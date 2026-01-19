# Technical Reference

## Output Structure

The converter generates skills organized by module in the `skills/` directory at the project root:

skills/
├── bmm/
│   ├── analyst/
│   │   └── SKILL.md
│   ├── pm/
│   │   └── SKILL.md
│   ├── config.yaml          # Project configuration
│   └── (skills...)          # BMM methodology skills
├── core/
│   ├── config.yaml          # Core user settings
│   └── (skills...)          # Core system skills
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

The converter automatically handles non-standard resources referenced by skills that live outside the normal agent/workflow structure. Resource migration is **configurable via `config.json`** under the `auxiliaryResources` key.

### Core Migrations

1. **`documentation-standards.md`**:
   - Source: `src/bmm/agents/tech-writer/tech-writer-sidecar/documentation-standards.md`
   - Destination: `bmm/tech-writer/data/documentation-standards.md`
   - Purpose: Critical reference for technical writing skills

2. **TEA Knowledge Base**:
   - Source: `src/bmm/testarch/knowledge/`
   - Destination: `bmm/tea/knowledge/`
   - Purpose: Extensive testing patterns and practices

3. **TEA Index**:
   - Source: `src/bmm/testarch/tea-index.csv`
   - Destination: `bmm/tea/tea-index.csv`
   - Purpose: Index of testing architecture components

4. **Excalidraw Resources**:
   - Source: `src/core/resources/excalidraw`
   - Destination: `core/resources/excalidraw`
   - Purpose: Visual assets for diagramming skills

### Recursive Path Rewriting
Migrated resources are processed recursively. Any text-based files within these resources (e.g., Markdown in the TEA knowledge base) have their internal paths rewritten to be compatible with the new skill structure.

## Path Rewriting

To make skills portable, path rewriting uses a dynamic map of all discovered skills combined with configurable regex patterns:

- **Configurable Patterns**: Custom rewriting rules can be added to `config.json` under `pathPatterns`. These are applied first.
- **Pattern Optimization**: Regex patterns are pre-compiled once at startup for maximum performance during large conversion runs.
- **Exact Skill Resolution**: Uses a `skillMap` to resolve paths like `testarch/ci/workflow.yaml` to their correct installed name e.g. `testarch-ci`.
- **Global Normalization**: Path normalization ensures that both module paths (`src/*/`) and core paths (`src/core/*`) are correctly mapping to their destination equivalents.
- **Skill Root Variable**: Replaces fragile relative paths (`../../`) with `{skill-root}`.
- **Variable Consolidation**: `{skill-config}` has been merged into `{skill-root}`.
- **Standardized Paths**:
  - Cross-Skill: `{skill-root}/{module}/{skill}/SKILL.md`
  - Resources: `{skill-root}/{module}/{skill}/data/...`
- **Migrated Resources**: Paths to migrated files are updated to their new locations.

This ensures skills work correctly regardless of where the root `skills` directory is installed and that cross-skill references are robust.

The converter creates `config.yaml` files for each module. The generation logic prioritizes templates from the BMAD repository:

1. **BMAD Template**: Checks for `config-template.yaml` within the module directory in the BMAD repo.
2. **Fallback Defaults**: If no template exists in the repo, hardcoded defaults from `convert.js` are used.

Skills reference these configs using `{skill-root}/{module}/config.yaml`. Users should customize these files for their project settings.

## Placeholder Variables

Skills use placeholder variables to remain portable across installations:

| Variable | Description | Example Replacement |
|----------|-------------|---------------------|
| `{skill-root}` | Root of skills directory | `/project/.agent/skills` |
| `{project-data}` | Project data directory | `/project/_data` |
| `{runtime-memory}` | Runtime memory (tool-specific) | `.agent/memory` |
| `{output-folder}` | Generated content folder | `./output` |

The `bootstrap-bmad-skills` skill guides users through configuring these variables.

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

📌 BMAD-METHOD version: 6.0.0-alpha.23

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
