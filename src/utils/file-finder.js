import path from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import yaml from 'js-yaml';

/**
 * Discovers all agent and workflow files in the BMAD repository
 * @param {string} bmadRoot - Root path of BMAD-METHOD repository
 * @param {string[]} agentPaths - Glob patterns for agent paths
 * @param {string[]} workflowPaths - Glob patterns for workflow paths
 * @param {{ moduleExtractionPatterns?: Array<{ pattern: string, group: number }> }} [options] - Optional. moduleExtractionPatterns from config for extractModule.
 * @returns {Promise<{agents: Array, workflows: Array}>}
 */
export async function findAgentsAndWorkflows(
  bmadRoot,
  agentPaths,
  workflowPaths,
  options = {}
) {
  const parsingPatterns = options.workflowParsingPatterns || {};
  if (!bmadRoot || !(await fs.pathExists(bmadRoot))) {
    throw new Error(`BMAD root directory does not exist: ${bmadRoot}`);
  }

  if (!Array.isArray(agentPaths) || !Array.isArray(workflowPaths)) {
    throw new Error('agentPaths and workflowPaths must be arrays');
  }

  const { moduleExtractionPatterns } = options;
  const agents = [];
  const workflows = [];

  // Find all agent.yaml files
  for (const pattern of agentPaths) {
    try {
      const fullPattern = path.join(bmadRoot, pattern, '**/*.agent.yaml');
      const files = await glob(fullPattern, {
        ignore: ['node_modules/**', '.git/**'],
      });

      for (const filePath of files) {
        try {
          // Validate file exists and is readable
          if (!(await fs.pathExists(filePath))) {
            console.warn(`Warning: Agent file not found: ${filePath}`);
            continue;
          }

          const relativePath = path.relative(bmadRoot, filePath);
          const module = extractModule(
            relativePath,
            moduleExtractionPatterns,
            options.fallbackModuleExtractionPatterns
          );
          const name = path.basename(filePath, '.agent.yaml');

          if (!name || name.trim() === '') {
            console.warn(`Warning: Invalid agent name in ${filePath}`);
            continue;
          }

          agents.push({
            type: 'agent',
            path: filePath,
            module: module || 'core',
            name: name,
          });
        } catch (error) {
          console.warn(
            `Warning: Failed to process agent file ${filePath}: ${error.message}`
          );
        }
      }
    } catch (error) {
      console.warn(
        `Warning: Failed to search for agents in pattern ${pattern}: ${error.message}`
      );
    }
  }

  // Find all workflow.yaml, workflow.md, and workflow.xml files
  // Use a Map to deduplicate by directory (prefer yaml > md > xml)
  const workflowsByDir = new Map();

  for (const pattern of workflowPaths) {
    // Search for workflow.yaml, workflow.md, and workflow.xml recursively
    // Priority: yaml > md > xml (if multiple exist in same directory)
    const workflowPatterns = [
      {
        pattern: path.join(bmadRoot, pattern, '**', 'workflow.yaml'),
        priority: 1,
      },
      {
        pattern: path.join(bmadRoot, pattern, '**', 'workflow.md'),
        priority: 2,
      },
      {
        pattern: path.join(bmadRoot, pattern, '**', 'workflow.xml'),
        priority: 3,
      },
    ];

    for (const { pattern: fullPattern, priority } of workflowPatterns) {
      try {
        const files = await glob(fullPattern, {
          ignore: ['node_modules/**', '.git/**'],
        });

        for (const filePath of files) {
          try {
            // Ensure we have an absolute path
            const absolutePath = path.isAbsolute(filePath)
              ? filePath
              : path.resolve(bmadRoot, filePath);

            // Validate file exists and is readable
            if (!(await fs.pathExists(absolutePath))) {
              console.warn(`Warning: Workflow file not found: ${absolutePath}`);
              continue;
            }

            const workflowDir = path.dirname(absolutePath);

            // Skip if we already have a higher priority workflow for this directory
            const existing = workflowsByDir.get(workflowDir);
            if (existing && existing.priority <= priority) {
              continue;
            }

            const relativePath = path.relative(bmadRoot, absolutePath);
            const module = extractModule(
              relativePath,
              moduleExtractionPatterns,
              options.fallbackModuleExtractionPatterns
            );

            const isMarkdown = absolutePath.endsWith('.md');
            const isXml = absolutePath.endsWith('.xml');

            let name = null;

            // Extract name from file content
            const content = await fs.readFile(absolutePath, 'utf-8');
            if (isMarkdown) {
              const frontmatterSimpleRegex =
                parsingPatterns.frontmatterSimpleRegex ||
                '^---\\s*\\n([\\s\\S]*?)\\n---';
              const match = content.match(new RegExp(frontmatterSimpleRegex));
              if (match) {
                try {
                  const frontmatter = yaml.load(match[1]);
                  name = frontmatter.name;
                } catch (_e) {
                  // Ignore invalid frontmatter
                }
              }
            } else if (isXml) {
              const xmlNameRegex =
                parsingPatterns.xmlNameRegex || 'name="([^"]+)"';
              const match = content.match(new RegExp(xmlNameRegex));
              if (match) name = match[1];
            } else {
              try {
                const workflow = yaml.load(content);
                name = workflow.name;
              } catch (_e) {
                // Ignore invalid YAML
              }
            }

            // Fallback to directory name if no name found
            if (!name) {
              name = path.basename(workflowDir);
            }

            // Determine instructions path based on workflow type
            let instructionsPath = null;
            let instructionsType = null;

            if (isMarkdown) {
              // workflow.md IS the instructions file
              instructionsPath = absolutePath;
              instructionsType = 'md';
            } else if (isXml) {
              // workflow.xml IS the instructions file (XML-only workflow)
              instructionsPath = absolutePath;
              instructionsType = 'xml';
            } else {
              // workflow.yaml - look for separate instructions files
              const instructionsMdPath = path.join(
                workflowDir,
                'instructions.md'
              );
              const instructionsXmlPath = path.join(
                workflowDir,
                'instructions.xml'
              );

              const hasInstructionsMd = await fs.pathExists(instructionsMdPath);
              const hasInstructionsXml =
                await fs.pathExists(instructionsXmlPath);
              instructionsPath = hasInstructionsMd
                ? instructionsMdPath
                : hasInstructionsXml
                  ? instructionsXmlPath
                  : null;
              instructionsType = hasInstructionsMd
                ? 'md'
                : hasInstructionsXml
                  ? 'xml'
                  : null;

              if (!instructionsPath) {
                console.warn(
                  `Warning: Missing instructions.md or instructions.xml for workflow ${name} at ${workflowDir}`
                );
              }
            }

            if (!name || name.trim() === '') {
              console.warn(`Warning: Invalid workflow name in ${absolutePath}`);
              continue;
            }

            workflowsByDir.set(workflowDir, {
              priority,
              workflow: {
                type: 'workflow',
                path: absolutePath,
                module: module || 'core',
                name: name,
                instructionsPath: instructionsPath,
                instructionsType: instructionsType,
                workflowDir: workflowDir,
                isMarkdown: isMarkdown,
                isXml: isXml,
              },
            });
          } catch (error) {
            console.warn(
              `Warning: Failed to process workflow file ${filePath}: ${error.message}`
            );
          }
        }
      } catch (error) {
        console.warn(
          `Warning: Failed to search for workflows in pattern ${fullPattern}: ${error.message}`
        );
      }
    }
  }

  // Extract workflows from the Map
  for (const { workflow } of workflowsByDir.values()) {
    workflows.push(workflow);
  }

  return { agents, workflows };
}

function extractModule(
  relativePath,
  moduleExtractionPatterns,
  fallbackPatterns
) {
  const patterns =
    Array.isArray(moduleExtractionPatterns) &&
    moduleExtractionPatterns.length > 0
      ? moduleExtractionPatterns
      : fallbackPatterns;

  if (Array.isArray(patterns) && patterns.length > 0) {
    for (const { pattern, group } of patterns) {
      const m = relativePath.match(new RegExp(pattern));
      if (m && m[group] != null) return m[group].toLowerCase();
    }
  }

  return null;
}
