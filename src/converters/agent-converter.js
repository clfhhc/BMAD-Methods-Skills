import fs from 'fs-extra';
import yaml from 'js-yaml';

/**
 * Converts a BMAD agent.yaml file to Claude Skills SKILL.md format
 * @param {string} agentPath - Path to agent.yaml file
 * @param {Object} options - Conversion options
 * @param {number|null} options.identityCharLimit - Character limit for identity in description (null = no limit, default: null)
 * @param {Array} options.allAgents - All discovered agents (for related skills)
 * @param {Array} options.allWorkflows - All discovered workflows (for related skills)
 * @param {string} options.currentModule - Current module name (for finding related skills in same module)
 * @returns {Promise<string>} SKILL.md content
 */
export async function convertAgentToSkill(agentPath, options = {}) {
  if (!agentPath || !(await fs.pathExists(agentPath))) {
    throw new Error(`Agent file not found: ${agentPath}`);
  }

  try {
    // Read and parse YAML
    const content = await fs.readFile(agentPath, 'utf-8');

    if (!content || content.trim() === '') {
      throw new Error('Agent file is empty');
    }

    let agent;
    try {
      agent = yaml.load(content);
    } catch (yamlError) {
      throw new Error(`Invalid YAML syntax: ${yamlError.message}`);
    }

    if (!agent || !agent.agent) {
      throw new Error('Invalid agent.yaml structure: missing agent key');
    }

    const agentData = agent.agent;
    const metadata = agentData.metadata || {};
    const persona = agentData.persona || {};
    const menu = agentData.menu || [];
    const criticalActions = agentData.critical_actions || [];
    const startupMessage = agentData.startup_message || '';

    // Extract and sanitize name
    const name = sanitizeName(metadata.id || metadata.name || 'unknown-agent');

    // Build description from role and identity
    const role = persona.role || 'Agent';
    const identity = persona.identity || '';
    const identityCharLimit = options.identityCharLimit ?? null; // null = no limit (default)

    let identitySummary = identity;
    if (identityCharLimit !== null && identity.length > identityCharLimit) {
      identitySummary = `${identity.substring(0, identityCharLimit - 3)}...`;
    }

    const description = identitySummary ? `${role} - ${identitySummary}` : role;

    // Ensure description is within 1024 char limit (Claude Skills requirement)
    const finalDescription =
      description.length > 1024
        ? `${description.substring(0, 1021)}...`
        : description;

    // Build SKILL.md content
    const skillContent = buildAgentSkillContent({
      name,
      description: finalDescription,
      metadata,
      persona,
      menu,
      criticalActions,
      startupMessage,
      allAgents: options.allAgents || [],
      allWorkflows: options.allWorkflows || [],
      currentModule: options.currentModule || null,
    });

    return skillContent;
  } catch (error) {
    throw new Error(`Failed to convert agent ${agentPath}: ${error.message}`);
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
 * Builds the complete SKILL.md content for an agent
 */
function buildAgentSkillContent({
  name,
  description,
  metadata,
  persona,
  menu,
  criticalActions,
  startupMessage,
  allAgents,
  allWorkflows,
  currentModule,
}) {
  const displayName = metadata.name || metadata.title || name;
  const role = persona.role || 'Agent';
  const identity = persona.identity || '';
  // Handle principles as either array or string (multiline YAML)
  const principlesRaw = persona.principles || [];
  let principles = [];
  if (Array.isArray(principlesRaw)) {
    principles = principlesRaw;
  } else if (typeof principlesRaw === 'string') {
    // Parse multiline string format: extract lines starting with "-"
    principles = principlesRaw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.startsWith('-'))
      .map((line) => line.replace(/^-\s*['"]?/, '').replace(/['"]\s*$/, ''));
  }
  const communicationStyle = persona.communication_style || '';

  // Extract additional metadata fields
  const metadataFields = [];
  if (metadata.version) metadataFields.push(`version: ${metadata.version}`);
  if (
    metadata.tags &&
    Array.isArray(metadata.tags) &&
    metadata.tags.length > 0
  ) {
    metadataFields.push(`tags: ${metadata.tags.join(', ')}`);
  }

  // Build frontmatter
  let frontmatter = `---
name: ${name}
description: ${description}`;
  if (metadataFields.length > 0) {
    frontmatter += `\n${metadataFields.join('\n')}`;
  }
  frontmatter += '\n---';

  // Build overview section
  let content = `${frontmatter}

# ${displayName}

## Overview
${role}${identity ? ` - ${identity}` : ''}`;

  // Add communication style if present
  if (communicationStyle) {
    content += `\n\n**Communication Style:** ${communicationStyle}`;
  }

  // Add startup message if present
  if (startupMessage) {
    content += `\n\n${startupMessage}`;
  }

  // Build "When to Use" section
  if (menu.length > 0) {
    content += `\n\n## When to Use
Use this agent when you need to:
${menu.map((item) => `- ${item.description || item.trigger}`).join('\n')}`;
  }

  // Build Instructions section
  if (criticalActions.length > 0) {
    content += `\n\n## Instructions
${criticalActions.map((action) => `- ${action}`).join('\n')}`;
  }

  // Build Commands section
  if (menu.length > 0) {
    content += `\n\n## Commands
${menu
  .map((item) => {
    const trigger = item.trigger || 'unknown';
    const desc = item.description || 'No description';
    // Format command with better structure
    const commandCode = `\`${trigger}\``;
    return `- **${commandCode}** or fuzzy match on \`${trigger.toLowerCase().replace(/\s+/g, '-')}\` - ${desc}`;
  })
  .join('\n')}`;
  }

  // Build Guidelines section (enhanced formatting)
  if (principles.length > 0) {
    content += '\n\n## Guidelines';
    // Group principles if they have common themes
    for (const principle of principles) {
      content += `\n- ${principle}`;
    }
  }

  // Build Examples section (from menu items)
  if (menu.length > 0) {
    content += '\n\n## Examples';
    for (const item of menu) {
      const trigger = item.trigger || 'unknown';
      const desc = item.description || 'No description';
      // Extract workflow code from description if it references a workflow (e.g., [WS])
      const workflowMatch = desc.match(/\[(\w+)\]/);
      const workflowCode = workflowMatch ? workflowMatch[1] : null;

      // Extract just the short code (e.g., "WS" from "WS or fuzzy match on workflow-status")
      const shortCode = trigger.split(/\s+/)[0];

      // Try to find the workflow
      let workflow = null;
      if (workflowCode) {
        workflow = allWorkflows.find(
          (w) =>
            w.name.toLowerCase().replace(/-/g, '') ===
            workflowCode.toLowerCase().replace(/_/g, '')
        );
      }

      // Build a concise example - just description and code, no redundancy
      const cleanDesc = desc.replace(/\[(\w+)\]\s*/, '').trim();
      content += `\n\n**${cleanDesc}**`;

      if (workflow) {
        content += ` (invokes \`${workflow.name}\` workflow)`;
      }

      content += '\n\n```';
      content += `\n${shortCode}`;
      content += '\n```';
    }
  }

  // Build Related Skills section (from workflow dependencies and module)
  const relatedSkills = [];

  // Find workflows referenced by menu items
  for (const item of menu) {
    const desc = item.description || '';
    // Look for workflow references in format [WS], [BP], etc.
    const workflowCodes = desc.match(/\[(\w+)\]/g) || [];
    for (const code of workflowCodes) {
      const codeName = code.replace(/[[\]]/g, '').toLowerCase();
      // Try to match workflow names
      const matchingWorkflow = allWorkflows.find((w) => {
        const wName = w.name.toLowerCase().replace(/-/g, '');
        return (
          wName.includes(codeName) || codeName.includes(wName.substring(0, 2))
        );
      });
      if (
        matchingWorkflow &&
        !relatedSkills.find((s) => s.name === matchingWorkflow.name)
      ) {
        relatedSkills.push({
          type: 'workflow',
          name: matchingWorkflow.name,
          module: matchingWorkflow.module,
        });
      }
    }
  }

  // Find other agents in the same module
  if (currentModule) {
    const sameModuleAgents = allAgents.filter(
      (a) => a.module === currentModule && a.name !== name
    );
    for (const agent of sameModuleAgents.slice(0, 3)) {
      if (!relatedSkills.find((s) => s.name === agent.name)) {
        relatedSkills.push({
          type: 'agent',
          name: agent.name,
          module: agent.module,
        });
      }
    }
  }

  if (relatedSkills.length > 0) {
    content += '\n\n## Related Skills';
    for (const skill of relatedSkills) {
      const skillPath =
        skill.module === currentModule
          ? skill.name
          : `${skill.module}/${skill.name}`;
      const skillType = skill.type === 'agent' ? 'Agent' : 'Workflow';
      content += `\n- **${skillType}**: \`${skillPath}\``;
    }
  }

  return content;
}
