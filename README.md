# BMAD-Methods-Skills

[![Release](https://github.com/clfhhc/BMAD-Methods-Skills/actions/workflows/release.yml/badge.svg)](https://github.com/clfhhc/BMAD-Methods-Skills/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/v/@clfhhc/bmad-methods-skills.svg)](https://www.npmjs.com/package/@clfhhc/bmad-methods-skills)

Automatically convert BMAD-METHOD agents and workflows to Claude Skills format.

## Quick Start

Install the BMAD bootstrap skill into your project:

```bash
npx @clfhhc/bmad-methods-skills init
# or
pnpm dlx @clfhhc/bmad-methods-skills init
```

This installs `bootstrap-bmad-skills` and `enhance-bmad-skills`. Then open your AI tool and use the **`BS`** command to start the guided installation workflow.

> **Note:** For fully automated installation without prompts, use `init --bootstrap` instead.

## What It Does

1. **Fetches** the latest BMAD-METHOD from GitHub
2. **Converts** agents and workflows to Claude Skills format
3. **Installs** skills to your AI tool's directory
4. **Generates** module config files (core, bmm, bmb)

## Supported Tools

| Tool | Directory |
|------|-----------|
| **Antigravity** | `.agent/skills/` |
| **Cursor** | `.cursor/skills/` |
| **Claude Code** | `.claude/skills/` (local) or `~/.claude/skills/` (global) |

## Documentation

- **[Getting Started](docs/getting-started.md)**: Installation and configuration
- **[Technical Reference](docs/technical-reference.md)**: Output structure and conversion details
- **[Development](docs/development.md)**: Contributing and project structure

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

- **BMAD-METHOD**: [BMAD Code Organization](https://github.com/bmad-code-org/BMAD-METHOD)
- **Claude Skills**: [Anthropic](https://github.com/anthropics/skills)

## Related Projects

- [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) - Original BMAD methodology
- [Claude Skills](https://github.com/anthropics/skills) - Claude Skills specification
