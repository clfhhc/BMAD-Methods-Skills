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

To make skills portable, absolute BMAD paths (`{project-root}/_bmad/...`) are rewritten to relative skill paths:

- **Cross-Skill References**: `../../{module}/{skill}/SKILL.md`
- **Internal Resources**: `../../{module}/{skill}/data/...`
- **Template Placeholders**: `{module-code}`, `{module-id}`, `[module]` patterns are preserved or adapted
- **Migrated Resources**: Paths to migrated files (like `documentation-standards.md`) are updated to their new locations

This ensures skills work correctly regardless of where the root `skills` directory is installed.

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
✓ Found 12 agents and 34 workflows

📁 Output directory: ./skills

🤖 Converting agents...
  ✓ bmm/analyst
  ✓ bmm/pm
  ✓ bmm/architect
  ...

⚙️  Converting workflows...
  ✓ bmm/product-brief
  ✓ bmm/prd
  ✓ bmm/architecture
  ...

📊 Conversion Summary

Agents:
  Total: 12
  Converted: 12
  Errors: 0

Workflows:
  Total: 34
  Converted: 34
  Errors: 0

✅ Successfully converted 46 skills
📁 Output directory: ./skills
```
