# Technical Reference

## Output Structure

The converter supports two output layouts controlled by `config.json` → `outputStructure` (default: **`"flat"`**). Flat layout is required for AI tools (Claude Code, Cursor) that discover skills only in immediate subfolders of `skills/`.

### Flat (default)

skills/
├── bmm-analyst/
│   └── SKILL.md
├── bmm-architect/
│   └── SKILL.md
├── core-bmad-master/
│   └── SKILL.md
├── core-brainstorming/
│   └── SKILL.md
├── _config/
│   ├── bmm.yaml             # Module config (was bmm/config.yaml)
│   └── core.yaml            # Module config (was core/config.yaml)
├── _resources/
│   ├── excalidraw/          # excalidraw-helpers.md, validate-json-instructions.md, etc.
│   └── bmm-excalidraw-shared/   # excalidraw-templates.yaml, excalidraw-library.json
├── bootstrap-bmad-skills/
└── enhance-bmad-skills/
```

### Nested (`outputStructure: "nested"`)

skills/
├── bmm/
│   ├── analyst/
│   │   └── SKILL.md
│   ├── pm/
│   │   └── SKILL.md
│   ├── excalidraw-diagrams/
│   │   └── _shared/
│   ├── config.yaml
│   └── (skills...)
├── core/
│   ├── config.yaml
│   ├── resources/
│   │   └── excalidraw/
│   └── (skills...)
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
   - Purpose: Universal Excalidraw helpers (excalidraw-helpers.md, validate-json-instructions.md, library-loader.md)

5. **Excalidraw Diagrams Shared**:
   - Source: `src/bmm/workflows/excalidraw-diagrams/_shared`
   - Destination: `bmm/excalidraw-diagrams/_shared`
   - Purpose: Domain-specific templates and library (excalidraw-templates.yaml, excalidraw-library.json) used by create-excalidraw-flowchart, create-excalidraw-diagram, create-excalidraw-wireframe, create-excalidraw-dataflow

### Recursive Path Rewriting
Migrated resources are processed recursively. Any text-based files within these resources (e.g., Markdown in the TEA knowledge base) have their internal paths rewritten to be compatible with the new skill structure.

## Path Rewriting

To make skills portable, path rewriting uses **config-driven regex patterns** plus a dynamic map of discovered skills:

- **Source of truth**: Path-rewrite rules are in `config.json` under `pathPatterns` (nested) and `pathPatternsFlat` (flat). Each entry has `pattern` (regex), `replacement`, and optional `description`. **`outputStructure`** chooses which set is used: `"flat"` (default) uses `pathPatternsFlat`; `"nested"` uses `pathPatterns`. Only `replacement` differs (e.g. flat: `{skill-root}/bmm-analyst/`, `{skill-root}/_config/{module}.yaml`, `{skill-root}/_resources/excalidraw/`).
- **skillMap options**: The dynamic skillMap (exact rewrites for discovered agents/workflows) uses `config.skillMap`: `sourcePrefix`, `dirLookahead`, `replacementPrefix`. `outputStructure` in `skillMapOptions` controls `/{module}/{name}/` (nested) vs `/{module}-{name}/` (flat).
- **Pattern optimization**: Regexes are pre-compiled at startup for performance.
- **Exact skill resolution**: `skillMap` is applied with `pathPatterns`/`pathPatternsFlat` to resolve source paths to destination skills.
- **Skill root variable**: Output uses `{skill-root}`.
- **Standardized paths**: Flat: `{skill-root}/{module}-{skill}/SKILL.md`, `{skill-root}/_config/{module}.yaml`, `{skill-root}/_resources/...`. Nested: `{skill-root}/{module}/{skill}/SKILL.md`, `{skill-root}/{module}/config.yaml`, etc.
- **Migrated resources**: `auxiliaryResources` supports optional `destFlat`; when `outputStructure === "flat"` and `destFlat` is set, it is used instead of `dest`. Migrated content is rewritten with the active path patterns.

This ensures skills work correctly regardless of where the root `skills` directory is installed and that cross-skill references are robust.

The converter creates module config files. The generation logic prioritizes templates from the BMAD repository:

1. **BMAD Template**: Checks for `config-template.yaml` within the module directory in the BMAD repo.
2. **Fallback Defaults**: If no template exists in the repo, hardcoded defaults from `convert.js` are used.

- **Flat**: configs are `{skill-root}/_config/bmm.yaml` and `{skill-root}/_config/core.yaml`.
- **Nested**: configs are `{skill-root}/bmm/config.yaml` and `{skill-root}/core/config.yaml`.

Users should customize these files for their project.

## Placeholder Variables

Skills use placeholder variables to remain portable across installations:

| Variable | Description | Example Replacement |
|----------|-------------|---------------------|
| `{skill-root}` | Root of skills directory | `/project/.cursor/skills` (or `.agent/skills`, `.claude/skills`). Global: `~/.cursor/skills/` (Cursor), `~/.gemini/antigravity/skills/` (Antigravity), `~/.claude/skills/` (Claude Code) |
| `{project-data}` | Project data directory | `/project/_data` |
| `{runtime-memory}` | Runtime memory (tool-specific) | `.agent/memory` |
| `{output-folder}` | Generated content folder | `./output` |

The `bootstrap-bmad-skills` skill guides users through configuring these variables. See **Supported Tools** in the README for the full directory list.

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
