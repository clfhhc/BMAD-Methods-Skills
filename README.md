# BMAD-Methods-Skills

Automatically convert BMAD-METHOD agents and workflows to Claude Skills format.

## Overview

This tool converts BMAD-METHOD (Breakthrough Method for Agile AI-Driven Development) agents and workflows into Claude Skills format. It automatically:

- Clones/fetches the latest BMAD-METHOD repository from GitHub
- Discovers all agents (`.agent.yaml`) and workflows (`workflow.yaml` + `instructions.md`)
- Converts them to Claude Skills format (`SKILL.md`)
- Organizes output by module (bmm, bmb, cis, core)

## Prerequisites

- **Node.js** v20+ (managed via Mise with `.node-version`)
- **Git** (for cloning BMAD-METHOD repository)
- **Mise** (optional, for Node.js version management)

## Installation

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

## Distribution (New Projects)

To install the BMAD bootstrap skill into a new project, you can use `npx`:

```bash
npx @clfhhc/BMAD-Methods-Skills init
```

This will:
1. Detect your AI tool (.agent, .cursor, or .claude)
2. Install the `bootstrap-bmad-skills` into your project
3. Enable the `BS` command to fetch and install all other BMAD skills

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

**Note:** The `skills/` directory is committed to the repository, allowing users to use pre-converted skills without running the converter. An installer script will be provided to install these skills to Claude Code, OpenCode, Cursor, and Antigravity based on your local setup.

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

## Troubleshooting

### Repository Clone Fails

- Check internet connection
- Verify `bmadRepo` URL in `config.json` is correct
- Ensure you have write permissions to `tempDir`

### YAML Parse Errors

- The converter will skip invalid YAML files and report them
- Check the error messages for specific file paths
- Verify the BMAD-METHOD repository structure hasn't changed

### Missing Instructions

- Workflows without `instructions.md` will still be converted
- A warning will be logged for missing instruction files
- The skill will include a placeholder message

### Permission Errors

- Ensure you have write permissions to the output directory
- Check that the temp directory can be created/written to

## Development

### Project Structure

```
BMAD-Methods-Skills/
├── .node-version          # Node.js version for Mise
├── package.json           # Dependencies and scripts
├── config.json            # Configuration
├── convert.js             # Main conversion script
├── src/
│   ├── converters/        # Conversion logic
│   │   ├── agent-converter.js
│   │   └── workflow-converter.js
│   └── utils/             # Utility functions
│       ├── bmad-fetcher.js
│       ├── file-finder.js
│       └── skill-writer.js
└── skills/                # Converted skills (committed to repo)
```

### Adding New Conversion Rules

To customize conversion:

1. **Agent Conversion**: Edit `src/converters/agent-converter.js`
2. **Workflow Conversion**: Edit `src/converters/workflow-converter.js`
3. **Output Format**: Edit `src/utils/skill-writer.js`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- **BMAD-METHOD**: Created by [BMAD Code Organization](https://github.com/bmad-code-org/BMAD-METHOD)
- **Claude Skills**: Format by [Anthropic](https://github.com/anthropics/skills)

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Related Projects

- [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) - Original BMAD methodology
- [Claude Skills](https://github.com/anthropics/skills) - Claude Skills specification and examples
