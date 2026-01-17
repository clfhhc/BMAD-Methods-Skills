# BMAD-Methods-Skills

[![Release](https://github.com/clfhhc/BMAD-Methods-Skills/actions/workflows/release.yml/badge.svg)](https://github.com/clfhhc/BMAD-Methods-Skills/actions/workflows/release.yml)
[![npm](https://img.shields.io/npm/v/@clfhhc/bmad-methods-skills.svg)](https://www.npmjs.com/package/@clfhhc/bmad-methods-skills)

Automatically convert BMAD-METHOD agents and workflows to Claude Skills format.

## Distribution (New Projects)

To install the BMAD bootstrap skill into a new project, you can use `npx`:

```bash
npx @clfhhc/bmad-methods-skills init --bootstrap
```

This will:
1. Detect your AI tool (.agent, .cursor, or .claude)
2. Automatically fetch, convert, and install the complete BMAD method suite
3. Install `bootstrap-bmad-skills` and `enhance-bmad-skills` for future maintenance
4. Enable the `BS` command as a manual backup workflow

## Documentation

For full documentation on development, manual usage, and technical details, please see:

- **[Getting Started](docs/getting-started.md)**: Installation, Usage, and Configuration
- **[Technical Reference](docs/technical-reference.md)**: Output structure and conversion details
- **[Development](docs/development.md)**: Project structure, contributing, and troubleshooting

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
