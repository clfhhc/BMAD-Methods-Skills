# Getting Started

## Overview

This tool converts BMAD-METHOD (Breakthrough Method for Agile AI-Driven Development) agents and workflows into Claude Skills format. It automatically:

- Clones/fetches the latest BMAD-METHOD repository from GitHub
- Discovers all agents (`.agent.yaml`) and workflows (`workflow.yaml` + `instructions.md`)
- Converts them to Claude Skills format (`SKILL.md`)
- Organizes output by module (bmm, bmb, cis, core)

## Quick Start (Recommended)

For most users, the simplest way to get started is:

```bash
# Install the bootstrap skill
npx @clfhhc/bmad-methods-skills init

# Then open your AI tool and type:
# BS
```

The `BS` command starts an AI-guided workflow that:
1. Asks which tool you're using (Claude Code, Cursor, Antigravity)
2. Asks if you want global or project-specific installation
3. Fetches and converts BMAD skills
4. Guides you through configuration

> **For automation:** Use `init --bootstrap` to skip prompts and use defaults.

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
4. Write output to `./skills/` organized by module (version controlled)

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
  "modules": ["bmm", "bmb", "cis", "core"],
  "agentPaths": [
    "src/core/agents",
    "src/modules/*/agents"
  ],
  "workflowPaths": [
    "src/core/workflows",
    "src/modules/*/workflows"
  ]
}
```

### Clean Up

Remove temporary files (keeps `skills/` directory):

```bash
pnpm clean
```

Remove both `skills/` and temporary files (full clean):

```bash
pnpm clean:all
```
