import fs from 'fs-extra';
import path from 'node:path';

/**
 * Migrates specific data and knowledge resources from BMAD repo to skills output
 * @param {string} bmadRoot - Root of the fetched BMAD repo
 * @param {string} outputDir - Root of the skills output directory
 */
export async function migrateResources(bmadRoot, outputDir) {
  console.log('📦 Migrating auxiliary resources...');

  const migrations = [
    {
      // Tech Writer: documentation-standards.md
      // From: src/modules/bmm/data/documentation-standards.md
      // To: bmm/tech-writer/data/documentation-standards.md
      src: path.join('src', 'modules', 'bmm', 'data', 'documentation-standards.md'),
      dest: path.join('bmm', 'tech-writer', 'data', 'documentation-standards.md'),
      name: 'Documentation Standards',
    },
    {
      // TEA: tea-index.csv
      // From: src/modules/bmm/testarch/tea-index.csv
      // To: bmm/tea/tea-index.csv
      src: path.join('src', 'modules', 'bmm', 'testarch', 'tea-index.csv'),
      dest: path.join('bmm', 'tea', 'tea-index.csv'),
      name: 'TEA Index',
    },
    {
      // TEA: knowledge directory
      // From: src/modules/bmm/testarch/knowledge/
      // To: bmm/tea/knowledge/
      src: path.join('src', 'modules', 'bmm', 'testarch', 'knowledge'),
      dest: path.join('bmm', 'tea', 'knowledge'),
      name: 'TEA Knowledge Base',
      isDirectory: true,
    }
  ];

  let migratedCount = 0;

  for (const migration of migrations) {
    try {
      const srcPath = path.join(bmadRoot, migration.src);
      const destPath = path.join(outputDir, migration.dest);

      if (await fs.pathExists(srcPath)) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(srcPath, destPath, { overwrite: true });
        console.log(`  ✓ Migrated ${migration.name}`);
        migratedCount++;
      } else {
        console.warn(`  ⚠️  Source not found for ${migration.name}: ${migration.src}`);
      }
    } catch (error) {
      console.error(`  ✗ Failed to migrate ${migration.name}: ${error.message}`);
    }
  }

  console.log(`  ✓ Migrated ${migratedCount} resources\n`);
  if (migratedCount < migrations.length) {
    console.warn('  ⚠️  Some resources were not found. This may happen if the BMAD repository structure has changed.');
    console.warn('      Please check if a newer version of @clfhhc/bmad-methods-skills is available.');
  }
}
