import fs from 'fs-extra';
import path from 'node:path';
import { rewriteBmadPaths, shouldRewritePaths } from './path-rewriter.js';

/**
 * Writes a SKILL.md file and related resources to the output directory
 * @param {string} outputDir - Base output directory
 * @param {string} module - Module name (bmm, bmb, cis, core)
 * @param {string} skillName - Skill name (sanitized)
 * @param {string} skillContent - SKILL.md content
 * @param {Object} options - Additional options
 * @param {string} options.workflowDir - Workflow directory (for copying templates/checklists)
 * @returns {Promise<string>} Path to written SKILL.md file
 */
export async function writeSkill(
  outputDir,
  module,
  skillName,
  skillContent,
  options = {}
) {
  if (!outputDir || !module || !skillName || !skillContent) {
    throw new Error(
      'Missing required parameters: outputDir, module, skillName, and skillContent are required'
    );
  }

  // Validate skillContent is not empty
  if (typeof skillContent !== 'string' || skillContent.trim() === '') {
    throw new Error('skillContent must be a non-empty string');
  }

  // Sanitize skillName to prevent directory traversal
  const sanitizedName = skillName
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-');
  if (sanitizedName !== skillName) {
    console.warn(
      `Warning: Skill name sanitized from "${skillName}" to "${sanitizedName}"`
    );
  }

  const skillDir = path.join(outputDir, module, sanitizedName);

  try {
    // Create directory structure
    await fs.ensureDir(skillDir);

    // Rewrite BMAD paths in SKILL.md content
    const rewrittenContent = rewriteBmadPaths(skillContent, module);

    // Write SKILL.md
    const skillPath = path.join(skillDir, 'SKILL.md');
    await fs.writeFile(skillPath, rewrittenContent, 'utf-8');

    // Copy entire workflow directory contents (excluding workflow.* files)
    if (options.workflowDir) {
      try {
        await copyDirectoryWithPathRewrite(
          options.workflowDir,
          skillDir,
          module
        );
      } catch (copyError) {
        console.warn(
          `Warning: Failed to copy related files for ${skillName}: ${copyError.message}`
        );
      }
    }

    return skillPath;
  } catch (error) {
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      throw new Error(
        `Permission denied writing to ${skillDir}. Check directory permissions.`
      );
    }
    throw new Error(`Failed to write skill file: ${error.message}`);
  }
}

/**
 * Recursively copy a directory, rewriting BMAD paths in text files
 */
async function copyDirectoryWithPathRewrite(srcDir, destDir, module) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip workflow.* files (they become SKILL.md)
    if (entry.name.startsWith('workflow.')) continue;

    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await fs.ensureDir(destPath);
      await copyDirectoryWithPathRewrite(srcPath, destPath, module);
    } else if (shouldRewritePaths(entry.name)) {
      // Read, rewrite paths, and write text files
      const content = await fs.readFile(srcPath, 'utf-8');
      const rewrittenContent = rewriteBmadPaths(content, module);
      await fs.writeFile(destPath, rewrittenContent, 'utf-8');
    } else {
      // Copy binary/other files as-is
      await fs.copy(srcPath, destPath);
    }
  }
}
