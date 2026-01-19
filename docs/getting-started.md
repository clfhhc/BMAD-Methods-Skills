# Getting Started

## Overview

This tool converts BMAD-METHOD (Breakthrough Method for Agile AI-Driven Development) agents and workflows into Claude Skills format. It automatically:

- Clones/fetches the latest BMAD-METHOD repository from GitHub
- Discovers all agents (`.agent.yaml`) and workflows (`workflow.yaml` + `instructions.md`)
- Converts them to Claude Skills format (`SKILL.md`)
- Applies path rewriting for portability
- Organizes output by module (bmm, core)

## Quick Start

### Option A: One-Liner (Recommended)

The fastest way to get all BMAD skills installed:

```bash
npx @clfhhc/bmad-methods-skills init --tool=[TOOL] --bootstrap
```

Replace `[TOOL]` with `antigravity`, `cursor`, or `claude`.

This single command:
1. ✅ Fetches and converts all BMAD agents/workflows
2. ✅ Applies automatic path rewriting
3. ✅ Installs skills to your tool's directory
4. ✅ Generates `config.yaml` for each module (core, bmm)
5. ✅ Cleans up temporary files

**After installation**, customize the generated config files at:
- `{skills-dir}/core/config.yaml` - User preferences
- `{skills-dir}/bmm/config.yaml` - Project settings
- `{skills-dir}/{module}/config.yaml` - Module specific configuration

### Option B: AI-Guided Workflow

For an interactive experience with step-by-step guidance:

```bash
# Install the bootstrap skill first
npx @clfhhc/bmad-methods-skills init

# Then open your AI tool and type:
# BS
```

The `BS` command starts an AI-guided workflow that:
1. Asks which tool you're using (Claude Code, Cursor, Antigravity)
2. Asks if you want global or project-specific installation
3. Walks you through custom configuration options

> **Note**: The `BS` workflow now recommends using `--bootstrap` for the actual installation.

## Prerequisites

- **Node.js** v20+ (managed via Mise with `.node-version`)
- **Git** (for cloning BMAD-METHOD repository)
- **Mise** (optional, for Node.js version management)

## Installation (Development)

1. Clone this repository:
```bash
git clone <your-repo-url>
cd BMAD-Methods-Skills
```

2. Install dependencies:
```bash
pnpm install
```

3. (Optional) If using Mise, it will automatically use the Node.js version specified in `.node-version`:
```bash
mise install
```

## Usage

### Basic Conversion

Run the conversion script with default settings:

```bash
pnpm convert
```

This will:
1. Clone or update the BMAD-METHOD repository (from `config.json`)
2. Discover all agents and workflows
3. Convert them to SKILL.md format with default enhancements
4. Detect BMAD repository version and validate structure
5. Write output to `./skills/` organized by module (version controlled)

**Default Settings:**
- Full identity text (no truncation)
- All metadata fields extracted
- Enhanced formatting and structure
- Optional enhancements enabled: Examples, Best Practices, Related Skills
- Optional enhancements disabled: Troubleshooting, Meta Docs

### Custom Configuration

You can override default settings using CLI flags:

```bash
# Output to a non-version-controlled directory with custom settings
pnpm convert --output-dir ./custom-skills --identity-limit 200 --no-examples

# Enable troubleshooting for this run
pnpm convert --troubleshooting

# Disable all optional enhancements
pnpm convert --no-examples --no-best-practices --no-related-skills
```

**Available CLI Options:**

- `--output-dir <path>` - Custom output directory (default: `./skills`)
  - Use a non-version-controlled folder for custom configs
  - Default `./skills` directory is version controlled with default settings

- `--identity-limit <num>` - Character limit for identity in description
  - Default: no limit (recommended)
  - Use `--identity-limit 200` to enable old truncation behavior

- Optional Enhancement Flags:
  - `--examples` / `--no-examples` - Enable/disable examples section
  - `--best-practices` / `--no-best-practices` - Enable/disable best practices
  - `--troubleshooting` / `--no-troubleshooting` - Enable/disable troubleshooting
  - `--related-skills` / `--no-related-skills` - Enable/disable related skills
  - `--meta-docs` / `--no-meta-docs` - Enable/disable meta-documentation

- `--help` or `-h` - Show help message

**Note:** The `./skills` directory contains skills generated with default settings and is version controlled. Use `--output-dir` to generate skills with different configurations to a separate directory.

### Configuration

Edit `config.json` to customize:

```json
{
  "bmadRepo": "https://github.com/bmad-code-org/BMAD-METHOD.git",
  "bmadBranch": "main",
  "outputDir": "./skills",
  "tempDir": "./.temp/bmad-method",
  "modules": ["bmm", "core"],
  "agentPaths": [
    "src/core/agents",
    "src/*/agents"
  ],
  "workflowPaths": [
    "src/core/workflows",
    "src/*/workflows"
  ],
  "auxiliaryResources": [
    {
      "src": "src/bmm/agents/tech-writer/tech-writer-sidecar/documentation-standards.md",
      "dest": "bmm/tech-writer/data/documentation-standards.md",
      "name": "Documentation Standards"
    },
    {
      "src": "src/core/resources/excalidraw",
      "dest": "core/resources/excalidraw",
      "name": "Excalidraw Resources",
      "isDirectory": true
    },
    {
      "src": "src/bmm/workflows/excalidraw-diagrams/_shared",
      "dest": "bmm/excalidraw-diagrams/_shared",
      "name": "Excalidraw Diagrams Shared",
      "isDirectory": true
    }
  ],
  "pathPatterns": [
    {
      "pattern": "\\{project-root\\}/_bmad/core/resources/excalidraw/([^/\\\\s'\\\"]+)",
      "replacement": "{skill-root}/core/resources/excalidraw/$1",
      "description": "Excalidraw helper resources"
    },
    {
      "pattern": "\\{project-root\\}/_bmad/bmm/workflows/excalidraw-diagrams/_shared/([^/\\\\s'\\\"]+)",
      "replacement": "{skill-root}/bmm/excalidraw-diagrams/_shared/$1",
      "description": "Excalidraw _shared files (templates, library)"
    },
    {
      "pattern": "\\{project-root\\}/_bmad/bmm/workflows/excalidraw-diagrams/_shared(?!/)",
      "replacement": "{skill-root}/bmm/excalidraw-diagrams/_shared",
      "description": "Excalidraw _shared directory"
    }
  ]
}
```

- **`auxiliaryResources`**: Define extra files or folders to migrate (e.g. Excalidraw core, Excalidraw Diagrams Shared). Supports `isDirectory: true` for recursive copy. Migrated content gets path rewriting.
- **`pathPatterns`**: Custom regex rules for path adaptation. Applied before standard rewriting. The default config includes patterns for Excalidraw core and `excalidraw-diagrams/_shared`; see [Technical Reference - Auxiliary Resource Migration](technical-reference.md#auxiliary-resource-migration) for the full list.

### Clean Up

Remove temporary files (keeps `skills/` directory):

```bash
pnpm clean
```

Remove both `skills/` and temporary files (full clean):

```bash
pnpm clean:all
```

## CLI Reference

### Commands

| Command | Description |
|---------|-------------|
| `npx @clfhhc/bmad-methods-skills` | Run the converter (fetch + convert) |
| `npx @clfhhc/bmad-methods-skills init` | Install bootstrap skills only |
| `npx @clfhhc/bmad-methods-skills init --bootstrap` | **Full install**: fetch, convert, and install |
| `npx @clfhhc/bmad-methods-skills install --from=<path>` | Install from a local directory |

### Init Options

| Option | Description |
|--------|-------------|
| `--tool=<name>` | Target tool: `antigravity`, `cursor`, or `claude` |
| `--bootstrap` | Auto-fetch, convert, and install the full BMAD suite |
| `--force` | Overwrite existing skills |
