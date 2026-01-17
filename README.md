# BMAD-Methods-Skills

Automatically convert BMAD-METHOD agents and workflows to Claude Skills format.

## Distribution (New Projects)

To install the BMAD bootstrap skill into a new project, you can use `npx`:

```bash
npx @clfhhc/bmad-methods-skills init
```

This will:
1. Detect your AI tool (.agent, .cursor, or .claude)
2. Install the `bootstrap-bmad-skills` and `enhance-bmad-skills` into your project
3. Enable the `BS` command to fetch and install all other BMAD skills via `npx`

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
