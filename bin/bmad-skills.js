#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '../');

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'init') {
    await init(args);
  } else if (command === 'install') {
    await install(args);
  } else if (command === '--help' || command === '-h' || args.includes('--help') || args.includes('-h')) {
    printHelp();
  } else {
    // Proxy to convert.js logic
    await import('../convert.js');
  }
}



/**
 * Install specific skills from a source directory to the project's skill directory
 */
async function install(args) {
  const sourceArg = args.find(a => a.startsWith('--from='))?.split('=')[1];
  const force = args.includes('--force');

  if (!sourceArg) {
    console.error('❌ Missing required argument: --from=<path>');
    return;
  }

  const sourcePath = path.resolve(process.cwd(), sourceArg);
  if (!(await fs.pathExists(sourcePath))) {
    console.error(`❌ Source path does not exist: ${sourcePath}`);
    return;
  }

  // Detect tool
  const toolInfo = await detectTool(args);
  if (!toolInfo) return;

  console.log(`📦 Installation Target: ${toolInfo.name} (${toolInfo.path})`);
  console.log(`📂 Source: ${sourcePath}`);

  // Get skills from source
  const skills = await fs.readdir(sourcePath);
  const validSkills = [];
  
  for (const skill of skills) {
    if ((await fs.stat(path.join(sourcePath, skill))).isDirectory()) {
      validSkills.push(skill);
    }
  }

  if (validSkills.length === 0) {
    console.warn('⚠️  No skill directories found in source.');
    return;
  }

  console.log(`\nFound ${validSkills.length} skills to install.`);
  
  // Install
  for (const skillName of validSkills) {
    await installSkill(
      skillName, 
      path.join(sourcePath, skillName), 
      path.join(process.cwd(), toolInfo.path, skillName),
      force
    );
  }

  console.log(`\n✅ Installation complete.`);
}

async function init(args) {
  console.log('🚀 BMAD Skills Installer\n');

  const toolInfo = await detectTool(args);
  if (!toolInfo) return;

  console.log(`📦 Installing Bootstrap Skills for ${toolInfo.name}...`);

  // Dynamically find skills in package
  const skillsDir = path.join(pkgRoot, 'skills');
  if (!(await fs.pathExists(skillsDir))) {
     console.error('❌ Critical Error: Package skills directory not found.');
     return;
  }

  const skills = await fs.readdir(skillsDir);
  const skillsToInstall = [];
  
  for (const skill of skills) {
    // Only install directories as skills
    if ((await fs.stat(path.join(skillsDir, skill))).isDirectory()) {
        skillsToInstall.push(skill);
    }
  }

  if (skillsToInstall.length === 0) {
      console.warn('⚠️  No skills found in package to install.');
      return;
  }
  
  const force = args.includes('--force');

  try {
    for (const skillName of skillsToInstall) {
      const sourceDir = path.join(skillsDir, skillName);
      const targetDir = path.resolve(process.cwd(), toolInfo.path, skillName);
      
      await installSkill(skillName, sourceDir, targetDir, force);
    }
    
    console.log(`\n✅ Successfully initialized in: ${toolInfo.path}/`);
    console.log('\nNext steps:');
    console.log(`1. Open your AI chat (${toolInfo.name}).`);
    console.log('2. Type "BS" or "bootstrap-skills" to fetch and install the full BMAD method suite.');
  } catch (error) {
    console.error(`\n❌ Installation failed: ${error.message}`);
  }
}

/**
 * Helpher to copy skill with checks
 */
async function installSkill(name, source, target, force) {
  if (await fs.pathExists(target)) {
    if (!force) {
      console.warn(`  ⚠ Skill '${name}' already exists. Skipping.`);
    console.warn('    (Use --force to overwrite)');
      return;
    }
    console.log(`  ↻ Updating ${name}...`);
  } else {
    console.log(`  + Installing ${name}...`);
  }
  
  await fs.ensureDir(path.dirname(target));
  await fs.copy(source, target, { overwrite: true });
}

/**
 * Helper to detect AI tool
 */
async function detectTool(args) {
  const toolArg = args.find(a => a.startsWith('--tool='))?.split('=')[1];
  const force = args.includes('--force');

  const tools = [
    { name: 'Antigravity', path: '.agent/skills', active: await fs.pathExists('.agent') },
    { name: 'Cursor', path: '.cursor/skills', active: await fs.pathExists('.cursor') },
    { name: 'Claude Code (Local)', path: '.claude/skills', active: await fs.pathExists('.claude') },
  ];

  let selectedTool = tools.find(t => t.active);
  
  if (toolArg) {
    selectedTool = tools.find(t => t.name.toLowerCase().includes(toolArg.toLowerCase()));
  }

  if (!selectedTool) {
    if (force) {
       // Default to antigravity if forced and not found
       return tools[0];
    }
    
    console.log('❌ No AI tool directory detected (.agent, .cursor, .claude).');
    console.log('   Use --tool=<name> to force installation or ensure you are in the project root.');
    console.log('   Available tools: antigravity, cursor, claude');
    return null;
  }

  return selectedTool;
}

function printHelp() {
  console.log(`
Usage: npx @clfhhc/bmad-methods-skills [command] [options]

Commands:
  init             Install bootstrap skills into the current project
  install          Install skills from a local directory
  [no command]     Run the BMAD-to-Skills converter (proxy to convert.js)

Options (for init/install):
  --tool=<name>    Specify tool (antigravity, cursor, claude)
  --force          Overwrite existing skills / Force installation
  --from=<path>    (install only) Source directory containing skills

Options (for conversion):
  --repo <url>          Override BMAD repository URL
  --branch <name>       Override BMAD branch
  --output-dir <path>   Custom output directory
  --identity-limit <n>  Character limit for identity
  --[no-]examples       Enable/disable examples
  --[no-]best-practices Enable/disable best practices
  ... (see convert.js --help for full list)

  -h, --help       Show this help
  `);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
