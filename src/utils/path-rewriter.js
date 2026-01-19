/**
 * Rewrites BMAD installation paths to relative skill paths
 * Converts {project-root}/_bmad/... references to relative skill paths
 */

/**
 * Rewrite BMAD paths in content to relative skill paths
 * @param {string} content - File content to process
 * @param {string} currentModule - Current skill's module (core, bmm, bmb)
 * @returns {string} Content with rewritten paths
 */
export function rewriteBmadPaths(
  content,
  _currentModule = 'bmm',
  skillMap = null
) {
  let result = content;

  // Calculate relative prefix based on current module
  // Skills are at: skills/{module}/{skillName}/
  // Use user-defined {skill-root} variable for portability instead of fragile relative paths
  const relativePrefix = '{skill-root}';

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
      const regex = new RegExp(`\\{project-root\\}/_bmad/${escapedPath}`, 'g');
      result = result.replace(
        regex,
        `${relativePrefix}/${module}/${name}/SKILL.md`
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
      // Look for directory path not followed by / (to avoid replacing parents of nested files that weren't caught?)
      // Actually, if we replaced files first, the only things left starting with this dir are directory references or other files.
      const regex = new RegExp(
        `\\{project-root\\}/_bmad/${escapedDir}(?=['\\s\`]|$)`,
        'g'
      );
      result = result.replace(regex, `${relativePrefix}/${module}/${name}`);
    }
  }

  // === SPECIFIC EXCEPTIONS (Must run before generic patterns) ===

  // Rewrite init nested workflow references
  // Must run BEFORE workflow-status directory rewrite
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/workflow-status\/init\/workflow\.(yaml|md)/g,
    `${relativePrefix}/bmm/init/SKILL.md`
  );

  // Rewrite document-project workflow references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/document-project\/workflows/g,
    `${relativePrefix}/bmm/document-project`
  );

  // Rewrite core workflow references
  // {project-root}/_bmad/core/workflows/{name}/workflow.* -> ../../core/{name}/SKILL.md
  result = result.replace(
    /\{project-root\}\/_bmad\/core\/workflows\/([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/core/$1/SKILL.md`
  );

  // Rewrite bmm workflow references (handles nested category folders)
  // {project-root}/_bmad/bmm/workflows/{category}/{name}/workflow.* -> ../../bmm/{name}/SKILL.md
  // {project-root}/_bmad/bmm/workflows/{name}/workflow.* -> ../../bmm/{name}/SKILL.md
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/(?:\d-[^/]+\/)?([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/bmm/$1/SKILL.md`
  );

  // Rewrite bmb workflow references
  // {project-root}/_bmad/bmb/workflows/{name}/workflow.* -> ../../bmb/{name}/SKILL.md
  result = result.replace(
    /\{project-root\}\/_bmad\/bmb\/workflows\/([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/bmb/$1/SKILL.md`
  );

  // Rewrite testarch workflow references (bmm/testarch/{name}/workflow.* or bmm/workflows/testarch/...)
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/(?:workflows\/)?testarch\/([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/bmm/testarch-$1/SKILL.md`
  );

  // Rewrite excalidraw-diagrams workflow references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/excalidraw-diagrams\/([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/bmm/$1/SKILL.md`
  );

  // Rewrite bmad-quick-flow workflow references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/bmad-quick-flow\/([^/\s'"]+)\/workflow\.(yaml|md)/g,
    `${relativePrefix}/bmm/$1/SKILL.md`
  );

  // Rewrite core tasks reference (special case)
  // {project-root}/_bmad/core/tasks/workflow.xml -> ../../core/tasks/SKILL.md
  result = result.replace(
    /\{project-root\}\/_bmad\/core\/tasks\/workflow\.xml/g,
    `${relativePrefix}/core/tasks/SKILL.md`
  );

  // Rewrite references to specific files within workflows
  // {project-root}/_bmad/*/workflows/*/{file} -> ../../{module}/{name}/{file}
  result = result.replace(
    /\{project-root\}\/_bmad\/(core|bmm|bmb)\/workflows\/(?:\d-[^/]+\/)?([^/\s'"]+)\/([^/\s'"]+\.(md|csv|yaml|xml))/g,
    `${relativePrefix}/$1/$2/$3`
  );

  // Rewrite step file references within workflows
  // {project-root}/_bmad/*/workflows/*/steps/{file} -> ../../{module}/{name}/steps/{file}
  result = result.replace(
    /\{project-root\}\/_bmad\/(core|bmm|bmb)\/workflows\/(?:\d-[^/]+\/)?([^/\s'"]+)\/steps\/([^/\s'"]+)/g,
    `${relativePrefix}/$1/$2/steps/$3`
  );

  // Rewrite bmb workflow step file references
  // {project-root}/_bmad/bmb/workflows/{name}/steps-*/step-*.md -> ../../bmb/{name}/steps-*/{file}
  result = result.replace(
    /\{project-root\}\/_bmad\/bmb\/workflows\/([^/\s'"]+)\/(steps-[^/]+)\/([^/\s'"]+)/g,
    `${relativePrefix}/bmb/$1/$2/$3`
  );

  // Rewrite directory references (without workflow.* at end)
  // {project-root}/_bmad/bmm/workflows/{category}/{name} -> ../../bmm/{name}
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/\d-[^/]+\/([^/\s'"]+)(?=['\s`])/g,
    `${relativePrefix}/bmm/$1`
  );

  // {project-root}/_bmad/bmm/workflows/{name} (without trailing /) -> ../../bmm/{name}
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/([a-z][-a-z0-9]+)(?=['\s`])/g,
    `${relativePrefix}/bmm/$1`
  );

  // Rewrite bmad-quick-flow directory references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/bmad-quick-flow\/([^/\s'"]+)(?=['\s`])/g,
    `${relativePrefix}/bmm/$1`
  );

  // Rewrite testarch directory references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/testarch\/([^/\s'"]+)(?=['\s`])/g,
    `${relativePrefix}/bmm/testarch-$1`
  );

  // Rewrite workflow-status directory references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/workflows\/workflow-status(?=['\s`/])/g,
    `${relativePrefix}/bmm/workflow-status`
  );

  // Rewrite config.yaml references (module-level config)
  // {project-root}/_bmad/{module}/config.yaml -> {skill-root}/{module}/config.yaml
  result = result.replace(
    /\{project-root\}\/_bmad\/(bmm|bmb|core)\/config\.yaml/g,
    '{skill-root}/$1/config.yaml'
  );

  // Rewrite agent manifest references
  result = result.replace(
    /\{project-root\}\/_bmad\/_config\/agent-manifest\.csv/g,
    '{skill-root}/agent-manifest.csv'
  );

  // Rewrite testarch tea-index.csv references
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/testarch\/tea-index\.csv/g,
    `${relativePrefix}/bmm/tea/tea-index.csv`
  );

  // Rewrite documentation-standards.md references (migrated to tech-writer/data)
  // {project-root}/_bmad/bmm/data/documentation-standards.md -> ../../bmm/tech-writer/data/documentation-standards.md
  // But wait, if we are IN tech-writer, it should be ./data/documentation-standards.md
  // The relativePrefix logic handles ../.. but we might prefer a direct replacement here
  // since it's a specific file.
  // Let's rely on the generic ../..bmm/tech-writer/data approach which works from anywhere.
  result = result.replace(
    /\{project-root\}\/_bmad\/bmm\/data\/documentation-standards\.md/g,
    `${relativePrefix}/bmm/tech-writer/data/documentation-standards.md`
  );

  // Rewrite _memory sidecar references (these are runtime, mark as placeholder)
  result = result.replace(
    /\{project-root\}\/_bmad\/_memory\/([^/\s'"]+)/g,
    '{runtime-memory}/$1'
  );

  // Rewrite bmb-creations references (these are output folders)
  result = result.replace(
    /\{project-root\}\/_bmad\/bmb-creations/g,
    '{output-folder}/bmb-creations'
  );

  // Rewrite core tasks file references (specific XML files)
  result = result.replace(
    /\{project-root\}\/_bmad\/core\/tasks\/([^/\s'"]+\\.xml)/g,
    `${relativePrefix}/core/tasks/$1`
  );

  // Rewrite tasks references (bmm/tasks/*, bmb/tasks/*)
  result = result.replace(
    /\{project-root\}\/_bmad\/(bmm|bmb|core)\/tasks\/([^/\s'"]+)/g,
    `${relativePrefix}/$1/tasks/$2`
  );

  // Rewrite _data references (project data files)
  result = result.replace(
    /\{project-root\}\/_data\/([^/\s'"]+)/g,
    '{project-data}/$1'
  );

  // Rewrite src/modules references (raw source paths)
  result = result.replace(
    /\{project-root\}\/src\/modules\/(bmm|bmb|core)\/workflows\/(?:\d-[^/]+\/)?([^/\s'"]+)/g,
    `${relativePrefix}/$1/$2`
  );

  // Rewrite src/modules agent step references
  result = result.replace(
    /\{project-root\}\/src\/modules\/bmb\/workflows\/([^/\s'"]+)\/(steps-[^/]+)\/([^/\s'"]+)/g,
    `${relativePrefix}/bmb/$1/$2/$3`
  );

  // Rewrite cis workflow references (if any)
  result = result.replace(
    /\{project-root\}\/_bmad\/cis\/workflows\/([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/cis/$1/SKILL.md`
  );

  // Generic fallback: Any remaining {project-root}/_bmad/{module}/workflows/{name}
  result = result.replace(
    /\{project-root\}\/_bmad\/(bmm|bmb|core|cis)\/workflows\/([a-z][-a-z0-9]+)/g,
    `${relativePrefix}/$1/$2`
  );

  // === Template Placeholder Patterns ===
  // These handle paths with template variables like {module}, {module-code}, [module], etc.

  // Handle {project-root}/_bmad/{module-code}/workflows/...
  result = result.replace(
    /\{project-root\}\/_bmad\/\{module-code\}\/workflows\//g,
    `${relativePrefix}/{module-code}/`
  );

  // Handle {project-root}/_bmad/{module-id}/workflows/...
  result = result.replace(
    /\{project-root\}\/_bmad\/\{module-id\}\/workflows\//g,
    `${relativePrefix}/{module-id}/`
  );

  // Handle {project-root}/_bmad/{module}/... (generic module placeholder)
  result = result.replace(
    /\{project-root\}\/_bmad\/\{module\}\//g,
    `${relativePrefix}/{module}/`
  );

  // Handle {project-root}/_bmad/{module_code}/workflows/...
  result = result.replace(
    /\{project-root\}\/_bmad\/\{module_code\}\/workflows\//g,
    `${relativePrefix}/{module_code}/`
  );

  // Handle {project-root}/_bmad/[module]/... (bracket notation)
  result = result.replace(
    /\{project-root\}\/_bmad\/\[module\]\//g,
    `${relativePrefix}/[module]/`
  );

  // Handle {project-root}/_bmad/[module-path]/workflows/...
  result = result.replace(
    /\{project-root\}\/_bmad\/\[module-path\]\/workflows\//g,
    `${relativePrefix}/[module-path]/`
  );

  // Handle {project-root}/_bmad/[MODULE FOLDER]/...
  result = result.replace(
    /\{project-root\}\/_bmad\/\[MODULE FOLDER\]\//g,
    `${relativePrefix}/[MODULE FOLDER]/`
  );

  // Handle {project-root}/.../ ellipsis patterns (documentation examples)
  result = result.replace(
    /\{project-root\}\/\.\.\.\/([^/\s'"]+)\/workflow\.(yaml|md|xml)/g,
    `${relativePrefix}/.../$1/SKILL.md`
  );

  // Handle {project-root}/_bmad/core/workflows/{workflow-name}/...
  result = result.replace(
    /\{project-root\}\/_bmad\/core\/workflows\/\{workflow-name\}\//g,
    `${relativePrefix}/core/{workflow-name}/`
  );

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
