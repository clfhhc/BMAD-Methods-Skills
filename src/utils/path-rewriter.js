/**
 * Rewrites BMAD installation paths to relative skill paths
 * Converts {project-root}/_bmad/... references to relative skill paths
 */

/**
 * Rewrite BMAD paths in content to relative skill paths
 * @param {string} content - File content to process
 * @param {Map|null} skillMap - Map of source paths to destination skill info
 * @param {Array|null} pathPatterns - Array of {pattern, replacement, description?} from config.json pathPatterns (source of truth for all regex rewrites)
 * @param {Object} [skillMapOptions] - From config.json skillMap: { sourcePrefix, dirLookahead, replacementPrefix } for the dynamic skillMap block
 * @returns {string} Content with rewritten paths
 */
export function rewriteBmadPaths(
  content,
  skillMap = null,
  pathPatterns = null,
  skillMapOptions = {}
) {
  let result = content;

  const opts = skillMapOptions || {};
  const sourcePrefix = opts.sourcePrefix ?? '\\{project-root\\}/_bmad/';
  const dirLookahead = opts.dirLookahead ?? "(?=['\\s`]|$)";
  const replacementPrefix = opts.replacementPrefix ?? '{skill-root}';

  // === CONFIG-DRIVEN PATTERNS (Applied First) ===
  if (pathPatterns && pathPatterns.length > 0) {
    for (const item of pathPatterns) {
      try {
        // Use pre-compiled regex if available, otherwise compile it
        const regex = item.regex || new RegExp(item.pattern, 'g');
        result = result.replace(regex, item.replacement);
      } catch (e) {
        console.warn(`⚠️  Invalid path pattern: ${e.message}`);
      }
    }
  }

  // === MAP-BASED EXACT REPLACEMENTS (Priority) ===
  if (skillMap) {
    const dirMap = new Map();

    // 1. Rewrite Workflow Files
    for (const [srcPath, { module, name }] of skillMap.entries()) {
      // Create directory mapping while we're here
      // srcPath is e.g. "bmm/workflows/testarch/ci/workflow.yaml"
      const srcDir = srcPath.substring(0, srcPath.lastIndexOf('/'));
      dirMap.set(srcDir, { module, name });

      // Replace file reference
      // Pattern: {project-root}/_bmad/{srcPath}
      // srcPath is now normalized by convert.js
      const escapedPath = srcPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`${sourcePrefix}${escapedPath}`, 'g');
      result = result.replace(
        regex,
        `${replacementPrefix}/${module}/${name}/SKILL.md`
      );
    }

    // 2. Rewrite Workflow Directories
    // Sort by length specific to generic to avoid partial matches
    const sortedDirs = Array.from(dirMap.keys()).sort(
      (a, b) => b.length - a.length
    );

    for (const srcDir of sortedDirs) {
      const { module, name } = dirMap.get(srcDir);
      const escapedDir = srcDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(
        `${sourcePrefix}${escapedDir}${dirLookahead}`,
        'g'
      );
      result = result.replace(regex, `${replacementPrefix}/${module}/${name}`);
    }
  }

  return result;
}

/**
 * Check if a file should have paths rewritten
 * @param {string} filename - Name of the file
 * @returns {boolean} True if file should be processed
 */
export function shouldRewritePaths(filename) {
  const extensions = ['.md', '.yaml', '.yml', '.xml', '.txt', '.csv'];
  return extensions.some((ext) => filename.toLowerCase().endsWith(ext));
}
