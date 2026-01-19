# Technical Reference

## Output Structure

The converter generates skills organized by module in the `skills/` directory at the project root:

skills/
├── bmm/
│   ├── analyst/
│   │   └── SKILL.md
│   ├── pm/
│   │   └── SKILL.md
│   ├── prd/
│   │   └── SKILL.md
│   ├── create-ux-design/
│   │   └── SKILL.md
│   └── ...
├── bmb/
│   ├── module/
│   │   └── SKILL.md
│   ├── workflow/
│   │   └── SKILL.md
│   └── ...
├── core/
│   ├── advanced-elicitation/
│   │   └── SKILL.md
│   └── ...
```

Each skill folder contains:
- `SKILL.md` - The converted skill file
- `template.md` - (if present in workflow) Document template
- `checklist.md` - (if present in workflow) Validation checklist

## Conversion Details

### Agent Conversion

Agents (`.agent.yaml`) are converted with:
- **Name**: Sanitized from `metadata.id` or `metadata.name`
- **Description**: Combined `persona.role` + `persona.identity` (max 1024 chars)
- **Overview**: Full persona information
- **When to Use**: Derived from menu items
- **Instructions**: Critical actions and principles
- **Commands**: Menu items formatted as command list
- **Guidelines**: Persona principles

### Workflow Conversion

Workflows (`workflow.yaml` + `instructions.md`) are converted with:
- **Name**: Sanitized workflow name
- **Description**: From workflow.yaml
- **Overview**: Workflow description
- **When to Use**: Based on standalone flag and description
- **Instructions**: Linked `instructions.md` (or `.xml`) as an auxiliary file (not embedded)
- **Inputs/Outputs**: From workflow.yaml
- **Related Files**: References to template.md and checklist.md if present

### XML Tag Parsing

For legacy or XML-only workflows (where instructions are embedded), the converter automatically converts BMAD XML-style tags to Markdown. Note that standard workflows link to their instructions file instead.

- `<step n="1" goal="...">` → `## Step 1: ...`
- `<ask>...</ask>` → `**Ask:** ...`
- `<action>...</action>` → `**Action:** ...`
- `<check>...</check>` → `**Check:** ...`
- `<invoke-workflow>...</invoke-workflow>` → `**Invoke Workflow:** ...`
- `<template-output>...</template-output>` → `**Template Output:** ...`

## Auxiliary Resource Migration

The converter automatically handles non-standard resources that are referenced by skills but live outside the normal agent/workflow structure in BMAD:

1. **`documentation-standards.md`**:
   - Source: `bmm/data/documentation-standards.md`
   - Destination: `skills/bmm/tech-writer/data/documentation-standards.md`
   - Purpose: Critical reference for technical writing skills

2. **TEA Knowledge Base**:
   - Source: `bmm/testarch/knowledge/`
   - Destination: `skills/bmm/tea/knowledge/`
   - Purpose: Extensive testing patterns and practices

3. **TEA Index**:
   - Source: `bmm/testarch/tea-index.csv`
   - Destination: `skills/bmm/tea/tea-index.csv`
   - Purpose: Index of testing architecture components

## Path Rewriting

To make skills portable, path rewriting uses a dynamic map of all discovered skills to accurately resolve references:

- **Exact Skill Resolution**: Uses a `skillMap` to resolve paths like `testarch/ci/workflow.yaml` to their correct installed name e.g. `testarch-ci`, ensuring prefixes are handled correctly.
- **Skill Root Variable**: Replaces fragile relative paths (`../../`) with `{skill-root}`.
- **Variable Consolidation**: `{skill-config}` has been merged into `{skill-root}`.
- **Standardized Paths**:
  - Cross-Skill: `{skill-root}/{module}/{skill}/SKILL.md`
  - Resources: `{skill-root}/{module}/{skill}/data/...`
- **Migrated Resources**: Paths to migrated files are updated to their new locations.

This ensures skills work correctly regardless of where the root `skills` directory is installed and that cross-skill references are robust.

## Error Handling

The converter includes comprehensive error handling:

- **YAML Validation**: Validates YAML syntax before parsing
- **File Validation**: Checks file existence and readability
- **Graceful Degradation**: Continues processing on individual errors
- **Detailed Logging**: Reports all errors with file paths
- **Summary Report**: Shows conversion statistics and errors

## Example Output

After running the conversion, you'll see:

```
🚀 BMAD to Skills Converter

📥 Fetching BMAD-METHOD repository...
✓ Repository ready at: ./.temp/bmad-method

🔍 Discovering agents and workflows...
✓ Found 13 agents and 38 workflows

📁 Output directory: ./skills

🤖 Converting agents...
  ✓ core/bmad-master
  ✓ bmm/ux-designer
  ✓ bmm/tech-writer
  ✓ bmm/tea
  ...

⚙️  Converting workflows...
  ✓ core/brainstorming
  ✓ core/party-mode
  ✓ bmm/workflow-status
  ✓ bmm/document-project
  ✓ bmm/workflow-init
  ✓ bmm/testarch-trace
  ✓ bmm/testarch-test-design
  ✓ bmm/testarch-test-review
  ✓ bmm/testarch-ci
  ✓ bmm/testarch-nfr
  ✓ bmm/testarch-atdd
  ✓ bmm/testarch-automate
  ✓ bmm/testarch-framework
  ...

Stats:
  Agents: 13
  Workflows: 38

✅ Successfully converted 51 skills
📁 Output directory: ./skills
```
