# Technical Reference

## Output Structure

The converter generates skills organized by module in the `skills/` directory at the project root:

```
skills/
├── bmm/
│   ├── analyst/
│   │   └── SKILL.md
│   ├── pm/
│   │   └── SKILL.md
│   └── ...
├── bmb/
│   └── builder/
│       └── SKILL.md
├── cis/
│   └── creative-intelligence/
│       └── SKILL.md
└── core/
    └── ...
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
- **Instructions**: Parsed `instructions.md` with XML tags converted to markdown
- **Inputs/Outputs**: From workflow.yaml
- **Related Files**: References to template.md and checklist.md if present

### XML Tag Parsing

The converter automatically converts BMAD XML-style tags in instructions:

- `<step n="1" goal="...">` → `## Step 1: ...`
- `<ask>...</ask>` → `**Ask:** ...`
- `<action>...</action>` → `**Action:** ...`
- `<check>...</check>` → `**Check:** ...`
- `<invoke-workflow>...</invoke-workflow>` → `**Invoke Workflow:** ...`
- `<template-output>...</template-output>` → `**Template Output:** ...`

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
