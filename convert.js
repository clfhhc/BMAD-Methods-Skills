import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchBmadRepo } from './src/utils/bmad-fetcher.js';
import { findAgentsAndWorkflows } from './src/utils/file-finder.js';
import { convertAgentToSkill } from './src/converters/agent-converter.js';
import { convertWorkflowToSkill } from './src/converters/workflow-converter.js';
import { writeSkill } from './src/utils/skill-writer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    outputDir: null,
    repoUrl: null,
    branch: null,
    identityCharLimit: null,
    addExamples: null,
    addBestPractices: null,
    addTroubleshooting: null,
    addRelatedSkills: null,
    generateMetaDocs: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--output-dir' && i + 1 < args.length) {
      options.outputDir = args[++i];
    } else if (arg === '--repo' && i + 1 < args.length) {
      options.repoUrl = args[++i];
    } else if (arg === '--branch' && i + 1 < args.length) {
      options.branch = args[++i];
    } else if (arg === '--identity-limit' && i + 1 < args.length) {
      const limit = Number.parseInt(args[++i], 10);
      options.identityCharLimit = Number.isNaN(limit) ? null : limit;
    } else if (arg === '--no-examples') {
      options.addExamples = false;
    } else if (arg === '--examples') {
      options.addExamples = true;
    } else if (arg === '--no-best-practices') {
      options.addBestPractices = false;
    } else if (arg === '--best-practices') {
      options.addBestPractices = true;
    } else if (arg === '--no-troubleshooting') {
      options.addTroubleshooting = false;
    } else if (arg === '--troubleshooting') {
      options.addTroubleshooting = true;
    } else if (arg === '--no-related-skills') {
      options.addRelatedSkills = false;
    } else if (arg === '--related-skills') {
      options.addRelatedSkills = true;
    } else if (arg === '--no-meta-docs') {
      options.generateMetaDocs = false;
    } else if (arg === '--meta-docs') {
      options.generateMetaDocs = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
BMAD to Skills Converter

Usage: pnpm convert [options]

Options:
  --output-dir <path>        Custom output directory (default: ./skills)
                            Use a non-version-controlled folder for custom configs
  
  --repo <url>              Override BMAD repository URL
  --branch <name>           Override BMAD branch (default: main)
  
  --identity-limit <num>    Character limit for identity in description
                            (default: no limit, use --identity-limit 200 to enable old behavior)
  
  Optional Enhancements (override config.json defaults):
    --examples / --no-examples
    --best-practices / --no-best-practices
    --troubleshooting / --no-troubleshooting
    --related-skills / --no-related-skills
    --meta-docs / --no-meta-docs
  
  -h, --help                Show this help message

Examples:
  # Use default config (outputs to ./skills, version controlled)
  pnpm convert
  
  # Output to custom directory with different settings
  pnpm convert --output-dir ./custom-skills --identity-limit 200 --no-examples
  
  # Enable troubleshooting for this run
  pnpm convert --troubleshooting
`);
}

// Parse CLI arguments
const cliOptions = parseArgs();

// Load configuration
const configPath = path.join(__dirname, 'config.json');
let config;
try {
  if (!(await fs.pathExists(configPath))) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }
  const configContent = await fs.readFile(configPath, 'utf-8');
  config = JSON.parse(configContent);

  // Validate required config fields
  const requiredFields = ['bmadRepo', 'bmadBranch', 'outputDir', 'tempDir'];
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required configuration field: ${field}`);
    }
  }

  // Merge CLI options with config
  if (cliOptions.outputDir) {
    config.outputDir = cliOptions.outputDir;
  }
  if (cliOptions.repoUrl) {
    config.bmadRepo = cliOptions.repoUrl;
    console.log(`ℹ️  Overriding BMAD Repo: ${config.bmadRepo}`);
  }
  if (cliOptions.branch) {
    config.bmadBranch = cliOptions.branch;
    console.log(`ℹ️  Overriding BMAD Branch: ${config.bmadBranch}`);
  }

  // Initialize enhancements config if not present
  if (!config.enhancements) {
    config.enhancements = {};
  }
  if (!config.enhancements.optional) {
    config.enhancements.optional = {
      addExamples: true,
      addBestPractices: true,
      addTroubleshooting: false,
      addRelatedSkills: true,
      generateMetaDocs: false,
    };
  }

  // Override with CLI options
  if (cliOptions.identityCharLimit !== null) {
    config.enhancements.identityCharLimit = cliOptions.identityCharLimit;
  }
  if (cliOptions.addExamples !== null) {
    config.enhancements.optional.addExamples = cliOptions.addExamples;
  }
  if (cliOptions.addBestPractices !== null) {
    config.enhancements.optional.addBestPractices = cliOptions.addBestPractices;
  }
  if (cliOptions.addTroubleshooting !== null) {
    config.enhancements.optional.addTroubleshooting = cliOptions.addTroubleshooting;
  }
  if (cliOptions.addRelatedSkills !== null) {
    config.enhancements.optional.addRelatedSkills = cliOptions.addRelatedSkills;
  }
  if (cliOptions.generateMetaDocs !== null) {
    config.enhancements.optional.generateMetaDocs = cliOptions.generateMetaDocs;
  }
} catch (error) {
  console.error(`❌ Failed to load configuration: ${error.message}`);
  process.exit(1);
}

// Statistics
const stats = {
  agents: { total: 0, converted: 0, errors: 0 },
  workflows: { total: 0, converted: 0, errors: 0 },
  errors: [],
};

/**
 * Main conversion function
 */
async function main() {
  console.log('🚀 BMAD to Skills Converter\n');

  try {
    // Step 1: Fetch BMAD repository
    console.log('📥 Fetching BMAD-METHOD repository...');
    const bmadRoot = await fetchBmadRepo(
      config.bmadRepo,
      config.bmadBranch,
      path.resolve(process.cwd(), config.tempDir),
    );
    console.log(`✓ Repository ready at: ${bmadRoot}\n`);

    // Step 2: Discover agents and workflows
    console.log('🔍 Discovering agents and workflows...');
    const { agents, workflows } = await findAgentsAndWorkflows(
      bmadRoot,
      config.agentPaths,
      config.workflowPaths,
    );

    stats.agents.total = agents.length;
    stats.workflows.total = workflows.length;

    console.log(
      `✓ Found ${agents.length} agents and ${workflows.length} workflows\n`,
    );

    // Step 3: Prepare output directory
    const outputDir = path.resolve(process.cwd(), config.outputDir);
    await fs.ensureDir(outputDir);
    console.log(`📁 Output directory: ${outputDir}\n`);

    // Step 4: Convert agents
    if (agents.length > 0) {
      console.log('🤖 Converting agents...');
      const agentOptions = {
        identityCharLimit: config.enhancements.identityCharLimit ?? null,
        allAgents: agents,
        allWorkflows: workflows,
      };
      for (const agent of agents) {
        try {
          const skillContent = await convertAgentToSkill(agent.path, {
            ...agentOptions,
            currentModule: agent.module,
          });
          await writeSkill(
            outputDir,
            agent.module,
            agent.name,
            skillContent,
          );
          stats.agents.converted++;
          console.log(`  ✓ ${agent.module}/${agent.name}`);
        } catch (error) {
          stats.agents.errors++;
          stats.errors.push({
            type: 'agent',
            path: agent.path,
            error: error.message,
          });
          console.error(
            `  ✗ ${agent.module}/${agent.name}: ${error.message}`,
          );
        }
      }
      console.log();
    }

    // Step 5: Convert workflows
    if (workflows.length > 0) {
      console.log('⚙️  Converting workflows...');
      const workflowOptions = {};
      for (const workflow of workflows) {
        try {
          const skillContent = await convertWorkflowToSkill(
            workflow.path,
            workflow.instructionsPath,
            workflow.workflowDir,
            workflow.instructionsType,
            {
              ...workflowOptions,
              isMarkdown: workflow.isMarkdown || false,
            },
          );
          await writeSkill(
            outputDir,
            workflow.module,
            workflow.name,
            skillContent,
            { workflowDir: workflow.workflowDir },
          );
          stats.workflows.converted++;
          console.log(`  ✓ ${workflow.module}/${workflow.name}`);
        } catch (error) {
          stats.workflows.errors++;
          stats.errors.push({
            type: 'workflow',
            path: workflow.path,
            error: error.message,
          });
          console.error(
            `  ✗ ${workflow.module}/${workflow.name}: ${error.message}`,
          );
        }
      }
      console.log();
    }

    // Step 6: Generate summary
    await printSummary();
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Prints conversion summary
 */
async function printSummary() {
  console.log('📊 Conversion Summary\n');
  console.log('Agents:');
  console.log(`  Total: ${stats.agents.total}`);
  console.log(`  Converted: ${stats.agents.converted}`);
  console.log(`  Errors: ${stats.agents.errors}`);
  console.log();
  console.log('Workflows:');
  console.log(`  Total: ${stats.workflows.total}`);
  console.log(`  Converted: ${stats.workflows.converted}`);
  console.log(`  Errors: ${stats.workflows.errors}`);
  console.log();

  const totalConverted =
    stats.agents.converted + stats.workflows.converted;
  const totalErrors = stats.agents.errors + stats.workflows.errors;

  if (totalErrors > 0) {
    console.log('⚠️  Errors encountered:');
    for (const err of stats.errors) {
      console.log(`  - ${err.type}: ${err.path}`);
      console.log(`    ${err.error}`);
    }
    console.log();
  }

  console.log(`✅ Successfully converted ${totalConverted} skills`);
  console.log(
    `📁 Output directory: ${path.resolve(process.cwd(), config.outputDir)}`,
  );
  
  // Show configuration info
  if (config.outputDir !== './skills') {
    console.log('\n💡 Note: Output directory is not the default (./skills)');
    console.log('   This directory is not version controlled.');
    console.log('   To use default settings, run without --output-dir flag.');
  }
  
  if (config.enhancements.identityCharLimit !== null) {
    console.log(`\n💡 Note: Identity character limit is set to ${config.enhancements.identityCharLimit}`);
    console.log('   Default behavior (no limit) is recommended for better content.');
  }

  // Print per-module breakdown
  if (totalConverted > 0) {
    console.log('\n📦 Per-module breakdown:');

    // Count by module from output structure
    const outputDir = path.resolve(process.cwd(), config.outputDir);
    if (await fs.pathExists(outputDir)) {
      const modules = await fs.readdir(outputDir);
      for (const module of modules) {
        const modulePath = path.join(outputDir, module);
        if ((await fs.stat(modulePath)).isDirectory()) {
          const skills = await fs.readdir(modulePath);
          console.log(`  ${module}: ${skills.length} skills`);
        }
      }
    }
  }
}

// Run the conversion
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
