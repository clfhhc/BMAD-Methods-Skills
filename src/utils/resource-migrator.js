import path from 'node:path';
import fs from 'fs-extra';
import { rewriteBmadPaths, shouldRewritePaths } from './path-rewriter.js';

/**
 * Migrates specific data and knowledge resources from BMAD repo to skills output
 * @param {string} bmadRoot - Root of the fetched BMAD repo
 * @param {string} outputDir - Root of the skills output directory
 * @param {Array} auxiliaryResources - Array of migration definitions from config
 */
export async function migrateResources(
  bmadRoot,
  outputDir,
  auxiliaryResources = [],
  pathPatterns = null
) {
  console.log('📦 Migrating auxiliary resources...');

  // Use config-provided resources, or empty array if none
  const migrations = auxiliaryResources.map((res) => ({
    src: res.src,
    dest: res.dest,
    name: res.name,
    isDirectory: res.isDirectory || false,
  }));

  if (migrations.length === 0) {
    console.log('  ⚠️  No auxiliary resources configured in config.json');
    return;
  }

  let migratedCount = 0;

  for (const migration of migrations) {
    try {
      const srcPath = path.join(bmadRoot, migration.src);
      const destPath = path.join(outputDir, migration.dest);

      if (await fs.pathExists(srcPath)) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath, { overwrite: true });

        // Post-process: Rewrite paths in migrated files
        await processMigratedResource(destPath, pathPatterns);

        console.log(`  ✓ Migrated ${migration.name}`);
        migratedCount++;
      } else {
        console.warn(
          `  ⚠️  Source not found for ${migration.name}: ${migration.src}`
        );
      }
    } catch (error) {
      console.error(
        `  ✗ Failed to migrate ${migration.name}: ${error.message}`
      );
    }
  }

  console.log(`  ✓ Migrated ${migratedCount}/${migrations.length} resources\n`);
  if (migratedCount < migrations.length) {
    console.warn(
      '  ⚠️  Some resources were not found. BMAD repository structure may have changed.'
    );
    console.warn(
      '      Update auxiliaryResources in config.json or check for newer version.'
    );
  }
}

/**
 * Recursively process migrated resources to rewrite paths
 */
async function processMigratedResource(resourcePath, pathPatterns) {
  try {
    const stat = await fs.stat(resourcePath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(resourcePath);
      for (const file of files) {
        await processMigratedResource(
          path.join(resourcePath, file),
          pathPatterns
        );
      }
    } else if (shouldRewritePaths(resourcePath)) {
      const content = await fs.readFile(resourcePath, 'utf8');

      const rewritten = rewriteBmadPaths(content, null, pathPatterns);
      await fs.writeFile(resourcePath, rewritten, 'utf8');
    }
  } catch (error) {
    console.warn(
      `    ⚠️ Failed to process file ${resourcePath}: ${error.message}`
    );
  }
}
