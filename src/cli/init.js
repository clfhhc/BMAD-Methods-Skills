#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '../../');

async function init() {
  console.log('🚀 BMAD Skills Installer\n');

  const args = process.argv.slice(2);
  const command = args[0];

  if (command !== 'init') {
    printHelp();
    return;
  }

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

  console.log(`📦 Installing BMAD Bootstrap Skill for ${selectedTool.name}...`);

  const targetDir = path.resolve(process.cwd(), selectedTool.path, 'bootstrap-bmad-skills');
  const sourceFile = path.join(pkgRoot, 'skills/bootstrap-bmad-skills/SKILL.md');

  try {
    await fs.ensureDir(targetDir);
    await fs.copy(sourceFile, path.join(targetDir, 'SKILL.md'));
    
    console.log(`\n✅ Successfully installed to: ${selectedTool.path}/bootstrap-bmad-skills/`);
    console.log('\nNext steps:');
    console.log('1. Open your AI chat (Antigravity, Cursor, or Claude Code).');
    console.log('2. Type "BS" or "bootstrap-skills" to fetch and install the full BMAD method suite.');
  } catch (error) {
    console.error(`\n❌ Installation failed: ${error.message}`);
  }
}

function printHelp() {
  console.log(`
Usage: npx bmad-skills init [options]

Options:
  --tool=<name>    Specify tool (antigravity, cursor, claude)
  --force          Install even if tool directory isn't detected
  -h, --help       Show this help
  `);
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
