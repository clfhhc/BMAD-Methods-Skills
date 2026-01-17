#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '../');

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'init') {
    await init(args);
  } else if (command === '--help' || command === '-h' || args.includes('--help') || args.includes('-h')) {
    printHelp();
  } else {
    // Proxy to convert.js logic
    // This will run convert.js with the current process.argv
    await import('../convert.js');
  }
}

async function init(args) {
  console.log('🚀 BMAD Skills Installer\n');

  const toolArg = args.find(a => a.startsWith('--tool='))?.split('=')[1];
  const force = args.includes('--force');

  // 1. Detect tool
  const tools = [
    { name: 'Antigravity', path: '.agent/skills', active: await fs.pathExists('.agent') },
    { name: 'Cursor', path: '.cursor/skills', active: await fs.pathExists('.cursor') },
    { name: 'Claude Code (Local)', path: '.claude/skills', active: await fs.pathExists('.claude') },
  ];

  let selectedTool = tools.find(t => t.active);
  
  if (toolArg) {
    selectedTool = tools.find(t => t.name.toLowerCase().includes(toolArg.toLowerCase()));
  }

  if (!selectedTool && !force) {
    console.log('❌ No AI tool directory detected (.agent, .cursor, .claude).');
    console.log('   Use --tool=<name> to force installation.');
    console.log('   Available tools: antigravity, cursor, claude');
    return;
  }

  if (force && !selectedTool) {
      // Default to antigravity if forced and not found
      selectedTool = tools[0];
  }

  console.log(`📦 Installing BMAD Skills for ${selectedTool.name}...`);

  const skillsToInstall = ['bootstrap-bmad-skills', 'enhance-bmad-skills'];
  
  try {
    for (const skillName of skillsToInstall) {
      const sourceDir = path.join(pkgRoot, 'skills', skillName);
      const targetDir = path.resolve(process.cwd(), selectedTool.path, skillName);
      
      if (await fs.pathExists(sourceDir)) {
        await fs.ensureDir(path.dirname(targetDir));
        await fs.copy(sourceDir, targetDir);
        console.log(`  ✓ ${skillName}`);
      } else {
        console.warn(`  ⚠ Skill not found in package: ${skillName}`);
      }
    }
    
    console.log(`\n✅ Successfully installed to: ${selectedTool.path}/`);
    console.log('\nNext steps:');
    console.log('1. Open your AI chat (Antigravity, Cursor, or Claude Code).');
    console.log('2. Type "BS" or "bootstrap-skills" to fetch and install the full BMAD method suite.');
  } catch (error) {
    console.error(`\n❌ Installation failed: ${error.message}`);
  }
}

function printHelp() {
  console.log(`
Usage: npx @clfhhc/bmad-methods-skills [command] [options]

Commands:
  init             Install bootstrap skills into the current project
  [no command]     Run the BMAD-to-Skills converter (proxy to convert.js)

Options (for init):
  --tool=<name>    Specify tool (antigravity, cursor, claude)
  --force          Install even if tool directory isn't detected

Options (for conversion):
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
