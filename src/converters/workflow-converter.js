import path from 'node:path';
import fs from 'fs-extra';
import yaml from 'js-yaml';

/**
 * Converts a BMAD workflow to Claude Skills SKILL.md format
 * @param {string} workflowPath - Path to workflow.yaml or workflow.md file
 * @param {string|null} instructionsPath - Path to instructions.md or instructions.xml file (null for workflow.md)
 * @param {string} workflowDir - Directory containing the workflow
 * @param {string|null} instructionsType - Type of instructions file ('md' or 'xml')
 * @param {Object} options - Conversion options
 * @param {boolean} options.isMarkdown - Whether the workflow file is workflow.md (default: false)
 * @returns {Promise<string>} SKILL.md content
 */
export async function convertWorkflowToSkill(
  workflowPath,
  instructionsPath,
  workflowDir,
  _instructionsType = null,
  options = {}
) {
  const { isMarkdown, bmadRoot, bmadRepo, bmadBranch } = {
    isMarkdown: false,
    bmadRoot: null,
    bmadRepo: null,
    bmadBranch: 'main',
    ...options,
  };

  if (!workflowPath || !(await fs.pathExists(workflowPath))) {
    throw new Error(`Workflow file not found: ${workflowPath}`);
  }

  if (!workflowDir || !(await fs.pathExists(workflowDir))) {
    throw new Error(`Workflow directory not found: ${workflowDir}`);
  }

  try {
    let workflow = {};
    let instructionsContent = '';

    if (isMarkdown) {
      // workflow.md format: file contains frontmatter YAML + markdown content
      const workflowContent = await fs.readFile(workflowPath, 'utf-8');

      if (!workflowContent || workflowContent.trim() === '') {
        throw new Error('Workflow file is empty');
      }

      // Parse frontmatter and content
      // More flexible regex: allows optional newlines and handles various formats
      const frontmatterMatch = workflowContent.match(
        /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
      );

      if (frontmatterMatch) {
        // Has frontmatter
        const frontmatterYaml = frontmatterMatch[1];
        const markdownContent = frontmatterMatch[2];

        try {
          workflow = yaml.load(frontmatterYaml) || {};
        } catch (yamlError) {
          throw new Error(`Invalid YAML frontmatter: ${yamlError.message}`);
        }

        // The markdown content IS the instructions
        // Normalize headings to ensure hierarchy fits under "## Instructions"
        // Downgrade all headings: # -> ###, ## -> ####
        instructionsContent = parseInstructions(markdownContent).replace(
          /^(#+)/gm,
          '##$1'
        );
      } else {
        // No frontmatter, treat entire file as instructions
        // Try to extract basic metadata from filename or use defaults
        instructionsContent = parseInstructions(workflowContent).replace(
          /^(#+)/gm,
          '##$1'
        );
      }
    } else if (workflowPath.endsWith('.xml')) {
      // workflow.xml format: pure XML file (like advanced-elicitation)
      // The XML file IS the instructions, extract metadata from XML attributes
      const xmlContent = await fs.readFile(workflowPath, 'utf-8');

      if (!xmlContent || xmlContent.trim() === '') {
        throw new Error('Workflow XML file is empty');
      }

      // Extract metadata from XML task attributes
      // Example: <task id="..." name="Advanced Elicitation" standalone="true" ...>
      const nameMatch = xmlContent.match(/name="([^"]+)"/);
      const standaloneMatch = xmlContent.match(/standalone="([^"]+)"/);

      workflow = {
        name: nameMatch ? nameMatch[1] : path.basename(workflowDir),
        description: nameMatch ? nameMatch[1] : 'XML Workflow',
        standalone: standaloneMatch ? standaloneMatch[1] === 'true' : true,
      };

      // Parse the XML content as instructions
      instructionsContent = parseXmlInstructions(xmlContent);
    } else {
      // workflow.yaml format: separate YAML file + instructions file
      const workflowContent = await fs.readFile(workflowPath, 'utf-8');

      if (!workflowContent || workflowContent.trim() === '') {
        throw new Error('Workflow file is empty');
      }

      try {
        workflow = yaml.load(workflowContent);
      } catch (yamlError) {
        throw new Error(`Invalid YAML syntax: ${yamlError.message}`);
      }

      if (!workflow) {
        throw new Error(
          'Invalid workflow.yaml structure: file is empty or invalid'
        );
      }

      // Read instructions if available
      if (instructionsPath && (await fs.pathExists(instructionsPath))) {
        // Link to local auxiliary file (instructions are copied into the skill dir by writeSkill)
        const basename = path.basename(instructionsPath);
        instructionsContent = `See instructions at: [${basename}](${basename})`;
      } else {
        instructionsContent = 'No instructions available.';
      }
    }

    // Extract workflow metadata
    const name = sanitizeName(workflow.name || path.basename(workflowDir));
    const description = workflow.description || 'Workflow';
    const standalone = workflow.standalone !== false; // Default to true
    const inputs = workflow.inputs || {};
    const outputs = workflow.outputs || {};
    const steps = workflow.steps || [];

    // Extract other configuration keys
    const excludedKeys = [
      'name',
      'description',
      'inputs',
      'outputs',
      'steps',
      'standalone',
      'version',
      'author',
      'web_bundle',
      'isMarkdown',
      'isXml',
    ];

    const configuration = {};
    for (const [key, value] of Object.entries(workflow)) {
      if (!excludedKeys.includes(key)) {
        configuration[key] = value;
      }
    }

    // Check for related files and read previews
    const templatePath = path.join(workflowDir, 'template.md');
    const checklistPath = path.join(workflowDir, 'checklist.md');
    const hasTemplate = await fs.pathExists(templatePath);
    const hasChecklist = await fs.pathExists(checklistPath);

    // Discover CSV method files (brain-methods.csv, methods.csv, *-methods.csv)
    const methodsFiles = [];
    try {
      const files = await fs.readdir(workflowDir);
      for (const file of files) {
        if (
          file.endsWith('.csv') &&
          (file.includes('method') || file.includes('brain'))
        ) {
          const csvPath = path.join(workflowDir, file);
          try {
            const csvContent = await fs.readFile(csvPath, 'utf-8');
            const lines = csvContent.split('\n').filter((l) => l.trim());
            // Count rows (excluding header)
            const rowCount = Math.max(0, lines.length - 1);
            // Get header to understand columns
            const header = lines[0] || '';
            methodsFiles.push({
              name: file,
              rowCount,
              header: header.substring(0, 100),
            });
          } catch {
            methodsFiles.push({ name: file, rowCount: 0, header: '' });
          }
        }
      }
    } catch {
      // Ignore errors reading directory
    }

    // Discover step files in steps/ directory
    const stepsDir = path.join(workflowDir, 'steps');
    const stepFiles = [];
    if (await fs.pathExists(stepsDir)) {
      try {
        const files = await fs.readdir(stepsDir);
        for (const file of files.sort()) {
          if (file.endsWith('.md')) {
            stepFiles.push(file);
          }
        }
      } catch {
        // Ignore errors reading steps directory
      }
    }

    // Read previews of related files (first 3 lines)
    let templatePreview = null;
    let checklistPreview = null;
    if (hasTemplate) {
      try {
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const templateLines = templateContent
          .split('\n')
          .slice(0, 3)
          .filter((l) => l.trim());
        if (templateLines.length > 0) {
          templatePreview = templateLines.join('\n').substring(0, 200);
        }
      } catch {
        // Ignore errors reading preview
      }
    }
    if (hasChecklist) {
      try {
        const checklistContent = await fs.readFile(checklistPath, 'utf-8');
        const checklistLines = checklistContent
          .split('\n')
          .slice(0, 3)
          .filter((l) => l.trim());
        if (checklistLines.length > 0) {
          checklistPreview = checklistLines.join('\n').substring(0, 200);
        }
      } catch {
        // Ignore errors reading preview
      }
    }

    // Ensure description is within 1024 char limit
    const finalDescription =
      description.length > 1024
        ? `${description.substring(0, 1021)}...`
        : description;

    // Build SKILL.md content
    const skillContent = buildWorkflowSkillContent({
      name,
      description: finalDescription,
      standalone,
      instructionsContent,
      inputs,
      outputs,
      steps,
      hasTemplate,
      hasChecklist,
      templatePreview,
      checklistPreview,
      configuration,
      methodsFiles,
      stepFiles,
    });

    return skillContent;
  } catch (error) {
    throw new Error(
      `Failed to convert workflow ${workflowPath}: ${error.message}`
    );
  }
}

/**
 * Sanitizes a name for use in SKILL.md frontmatter
 * @param {string} name - Original name
 * @returns {string} Sanitized name
 */
function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Parses XML instructions.xml to markdown
 * @param {string} xmlContent - Raw XML instructions content
 * @returns {string} Parsed markdown
 */
function parseXmlInstructions(xmlContent) {
  let parsed = xmlContent;

  // Extract task-level metadata from <task> attributes
  const taskMatch = parsed.match(/<task\s+([^>]+)>/i);
  let taskHeader = '';
  if (taskMatch) {
    const attrs = taskMatch[1];
    const nameMatch = attrs.match(/name="([^"]+)"/);
    const standaloneMatch = attrs.match(/standalone="([^"]+)"/);
    if (nameMatch) {
      taskHeader = `# ${nameMatch[1]}\n\n`;
      if (standaloneMatch && standaloneMatch[1] === 'true') {
        taskHeader += '*Standalone workflow*\n\n';
      }
    }
  }

  // Remove task wrapper
  parsed = parsed.replace(/<task\s+[^>]+>/gi, '');
  parsed = parsed.replace(/<\/task>/gi, '');

  // Convert <llm critical="true">...</llm> to a Critical section
  parsed = parsed.replace(
    /<llm\s+critical="true">([\s\S]*?)<\/llm>/gi,
    (_match, content) => {
      const items = extractInstructionItems(content);
      if (items.length > 0) {
        return `\n\n## Critical Instructions\n\n${items.map((i) => `> ⚠️ ${i}`).join('\n')}\n`;
      }
      return '';
    }
  );

  // Remove any remaining <llm> tags
  parsed = parsed.replace(/<llm[^>]*>/gi, '');
  parsed = parsed.replace(/<\/llm>/gi, '');

  // Convert <integration description="...">...</integration>
  parsed = parsed.replace(
    /<integration\s+description="([^"]+)">([\s\S]*?)<\/integration>/gi,
    (_match, desc, content) => {
      const items = extractInstructionItems(content);
      return `\n\n## ${desc}\n\n${items.map((i) => `- ${i}`).join('\n')}\n`;
    }
  );

  // Convert <flow>...</flow> wrapper
  parsed = parsed.replace(/<flow>/gi, '\n\n## Workflow Steps\n');
  parsed = parsed.replace(/<\/flow>/gi, '');

  // Convert <step n="1" title="...">
  parsed = parsed.replace(
    /<step\s+n="(\d+)"(?:\s+title="([^"]+)")?(?:\s+goal="([^"]+)")?[^>]*>/gi,
    (_match, num, title, goal) => {
      const stepTitle = title || goal || `Step ${num}`;
      return `\n\n### Step ${num}: ${stepTitle}\n`;
    }
  );
  parsed = parsed.replace(/<\/step>/gi, '');

  // Convert <case n="...">...</case> for response handling
  parsed = parsed.replace(
    /<case\s+n="([^"]+)">([\s\S]*?)<\/case>/gi,
    (_match, caseId, content) => {
      const items = extractInstructionItems(content);
      return `\n\n**Case "${caseId}":**\n${items.map((i) => `  - ${i}`).join('\n')}\n`;
    }
  );

  // Convert named sections like <csv-structure>, <context-analysis>, <smart-selection>, <format>, <response-handling>
  const namedSections = [
    'csv-structure',
    'context-analysis',
    'smart-selection',
    'format',
    'response-handling',
    'validation',
    'critical-context',
    'halt-conditions',
  ];
  for (const section of namedSections) {
    const sectionRegex = new RegExp(
      `<${section}[^>]*>([\\s\\S]*?)<\\/${section}>`,
      'gi'
    );
    parsed = parsed.replace(sectionRegex, (_match, content) => {
      const sectionTitle = section
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      // Check if content has <i> items or is plain text
      const items = extractInstructionItems(content);
      if (items.length > 0) {
        return `\n\n**${sectionTitle}:**\n${items.map((i) => `- ${i}`).join('\n')}\n`;
      }
      // Plain text content (like <format>)
      return `\n\n**${sectionTitle}:**\n\`\`\`\n${content.trim()}\n\`\`\`\n`;
    });
  }

  // Convert any remaining <desc>...</desc>
  parsed = parsed.replace(/<desc>([^<]+)<\/desc>/gi, (_match, content) => {
    return `\n*${content.trim()}*\n`;
  });

  // Convert standalone <i>...</i> items (instruction items) to bullet points
  // Use [\s\S]*? to match across newlines and normalize whitespace
  parsed = parsed.replace(/<i>([\s\S]*?)<\/i>/gi, (_match, content) => {
    const normalized = content.replace(/\s+/g, ' ').trim();
    return `\n- ${normalized}`;
  });

  // Convert <action>...</action> to - **Action:** ...
  parsed = parsed.replace(/<action>([^<]+)<\/action>/gi, (_match, content) => {
    return `\n- **Action:** ${content.trim()}`;
  });

  // Convert <ask>...</ask> to - **Ask:** ...
  parsed = parsed.replace(/<ask>([^<]+)<\/ask>/gi, (_match, content) => {
    return `\n- **Ask:** ${content.trim()}`;
  });

  // Convert <critical>...</critical>
  parsed = parsed.replace(
    /<critical>([^<]+)<\/critical>/gi,
    (_match, content) => {
      return `\n> **Critical:** ${content.trim()}`;
    }
  );

  // Convert <output>...</output>
  parsed = parsed.replace(/<output>([^<]+)<\/output>/gi, (_match, content) => {
    return `\n**Output:** ${content.trim()}`;
  });

  // Convert <check if="...">...</check>
  parsed = parsed.replace(
    /<check\s+if="([^"]+)">([\s\S]*?)<\/check>/gi,
    (_match, condition, content) => {
      const items = extractInstructionItems(content);
      if (items.length > 0) {
        return `\n\n**Check if:** ${condition}\n${items.map((i) => `- ${i}`).join('\n')}\n`;
      }
      return `\n\n**Check if:** ${condition}\n`;
    }
  );
  parsed = parsed.replace(/<\/check>/gi, '');

  // Convert <goto anchor="..."/>
  parsed = parsed.replace(
    /<goto\s+anchor="([^"]+)"\s*\/>/gi,
    (_match, anchor) => `\n→ Go to: **${anchor}**`
  );

  // Convert <invoke-workflow>...</invoke-workflow>
  parsed = parsed.replace(
    /<invoke-workflow>([^<]+)<\/invoke-workflow>/gi,
    (_match, content) => `\n- **Invoke Workflow:** ${content.trim()}`
  );

  // Convert <template-output>...</template-output>
  parsed = parsed.replace(
    /<template-output>([^<]+)<\/template-output>/gi,
    (_match, content) => `\n**Template Output:** ${content.trim()}`
  );

  // Clean up any remaining XML tags
  parsed = parsed.replace(/<[^>]+>/g, '');

  // Add task header at the beginning
  parsed = taskHeader + parsed;

  // Clean up whitespace
  parsed = parsed.replace(/\n{3,}/g, '\n\n').trim();

  return parsed;
}

/**
 * Extracts instruction items from XML content
 * Handles <i>...</i> and <desc>...</desc> tags
 * Normalizes whitespace to single spaces
 */
function extractInstructionItems(content) {
  const items = [];

  // Helper to normalize whitespace (replace newlines and multiple spaces with single space)
  const normalize = (text) => text.replace(/\s+/g, ' ').trim();

  // Extract <desc> first
  const descMatches = content.matchAll(/<desc>([\s\S]*?)<\/desc>/gi);
  for (const match of descMatches) {
    items.push(normalize(match[1]));
  }

  // Extract <i> items (use [\s\S] to match across newlines)
  const iMatches = content.matchAll(/<i>([\s\S]*?)<\/i>/gi);
  for (const match of iMatches) {
    items.push(normalize(match[1]));
  }

  return items;
}

/**
 * Parses XML-style tags in instructions.md to markdown
 * @param {string} instructions - Raw instructions content
 * @returns {string} Parsed markdown
 */
function parseInstructions(instructions) {
  let parsed = instructions;

  // Convert <step n="1" goal="..."> to ## Step 1: ...
  parsed = parsed.replace(
    /<step\s+n="(\d+)"(?:\s+goal="([^"]+)")?>/gi,
    (_match, num, goal) => {
      return goal ? `## Step ${num}: ${goal}` : `## Step ${num}:`;
    }
  );

  // Convert </step> to empty (just close the section)
  parsed = parsed.replace(/<\/step>/gi, '');

  // Convert <ask>...</ask> to **Ask:** ...
  parsed = parsed.replace(/<ask>(.*?)<\/ask>/gis, (_match, content) => {
    return `**Ask:** ${content.trim()}`;
  });

  // Convert <action>...</action> to **Action:** ...
  parsed = parsed.replace(/<action>(.*?)<\/action>/gis, (_match, content) => {
    return `**Action:** ${content.trim()}`;
  });

  // Convert <check>...</check> to **Check:** ...
  parsed = parsed.replace(/<check>(.*?)<\/check>/gis, (_match, content) => {
    return `**Check:** ${content.trim()}`;
  });

  // Convert <invoke-workflow>...</invoke-workflow> to **Invoke Workflow:** ...
  parsed = parsed.replace(
    /<invoke-workflow>(.*?)<\/invoke-workflow>/gis,
    (_match, content) => {
      return `**Invoke Workflow:** ${content.trim()}`;
    }
  );

  // Convert <template-output>...</template-output> to **Template Output:** ...
  parsed = parsed.replace(
    /<template-output>(.*?)<\/template-output>/gis,
    (_match, content) => {
      return `**Template Output:** ${content.trim()}`;
    }
  );

  return parsed;
}

/**
 * Builds the complete SKILL.md content for a workflow
 */
function buildWorkflowSkillContent({
  name,
  description,
  standalone,
  instructionsContent,
  inputs,
  outputs,
  steps,
  hasTemplate,
  hasChecklist,
  templatePreview,
  checklistPreview,
  methodsFiles = [],
  stepFiles = [],
  configuration = {},
}) {
  // Build frontmatter
  const frontmatter = `---
name: ${name}
description: ${description}
---`;

  let content = `${frontmatter}

# ${name}

## Overview
${description}

${
  Object.keys(configuration).length > 0
    ? `## Configuration
${Object.entries(configuration)
  .map(([key, value]) => {
    const formattedValue =
      typeof value === 'object' ? JSON.stringify(value) : value;
    return `- **${key}**: ${formattedValue}`;
  })
  .join('\n')}`
    : ''
}`;

  // Add "When to Use" section
  if (standalone) {
    content += `\n\n## When to Use
This workflow can be run standalone and is designed for: ${description.toLowerCase()}`;
  } else {
    content += `\n\n## When to Use
This workflow is typically invoked as part of a larger process. Use when: ${description.toLowerCase()}`;
  }

  // Add Instructions section
  content += `\n\n## Instructions
${instructionsContent}`;

  // Add Steps section if available
  if (steps.length > 0) {
    content += `\n\n## Workflow Steps
${steps
  .map((step, idx) => {
    const stepNum = idx + 1;
    const stepName = step.name || step.id || `Step ${stepNum}`;
    const stepDesc = step.description ? ` - ${step.description}` : '';
    const dependencies = step.depends_on
      ? ` (depends on: ${Array.isArray(step.depends_on) ? step.depends_on.join(', ') : step.depends_on})`
      : '';
    return `${stepNum}. **${stepName}**${stepDesc}${dependencies}`;
  })
  .join('\n')}`;
  }

  // Add Inputs section if available
  if (Object.keys(inputs).length > 0) {
    content += `\n\n## Inputs
${Object.entries(inputs)
  .map(([key, value]) => {
    // Handle structured input definitions
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const desc = value.description || '';
      const type = value.type || '';
      const required = value.required !== undefined ? value.required : null;
      const defaultValue = value.default !== undefined ? value.default : null;

      let inputLine = `- **${key}**`;
      if (type) inputLine += ` (${type})`;
      if (required !== null)
        inputLine += ` ${required ? '[required]' : '[optional]'}`;
      if (desc) inputLine += `: ${desc}`;
      if (defaultValue !== null)
        inputLine += ` (default: ${JSON.stringify(defaultValue)})`;
      return inputLine;
    }
    // Handle simple string values
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    return `- **${key}**: ${valueStr}`;
  })
  .join('\n')}`;
  }

  // Add Outputs section if available
  if (Object.keys(outputs).length > 0) {
    content += `\n\n## Outputs
${Object.entries(outputs)
  .map(([key, value]) => {
    // Handle structured output definitions
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const desc = value.description || '';
      const type = value.type || '';

      let outputLine = `- **${key}**`;
      if (type) outputLine += ` (${type})`;
      if (desc) outputLine += `: ${desc}`;
      return outputLine;
    }
    // Handle simple string values
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    return `- **${key}**: ${valueStr}`;
  })
  .join('\n')}`;
  }

  // Add Related Files section
  const hasMethodsFiles = methodsFiles.length > 0;
  const hasStepFiles = stepFiles.length > 0;

  if (hasTemplate || hasChecklist || hasMethodsFiles || hasStepFiles) {
    content += '\n\n## Supporting Files';

    // Methods/techniques CSV files (for progressive disclosure)
    if (hasMethodsFiles) {
      content += '\n\n### Methods Reference';
      for (const method of methodsFiles) {
        content += `\n- [${method.name}](${method.name})`;
        if (method.rowCount > 0) {
          content += ` - ${method.rowCount} techniques/methods available`;
        }
        if (method.header) {
          content += `\n  - Columns: \`${method.header}\``;
        }
      }
    }

    // Step files in steps/ directory
    if (hasStepFiles) {
      content += '\n\n### Workflow Step Files';
      content += `\n\nThis workflow uses ${stepFiles.length} micro-step files for disciplined execution:`;
      for (const step of stepFiles) {
        content += `\n- [${step}](steps/${step})`;
      }
    }

    // Template and checklist
    if (hasTemplate) {
      content += '\n\n### Document Template';
      content +=
        '\n- [template.md](template.md) - Document template for this workflow';
      if (templatePreview) {
        content += `\n\n  Preview:\n  \`\`\`\n  ${templatePreview}\n  \`\`\``;
      }
    }
    if (hasChecklist) {
      content += '\n\n### Validation Checklist';
      content +=
        '\n- [checklist.md](checklist.md) - Validation checklist for this workflow';
      if (checklistPreview) {
        content += `\n\n  Preview:\n  \`\`\`\n  ${checklistPreview}\n  \`\`\``;
      }
    }
  }

  return content;
}
