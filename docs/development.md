# Development

## Project Structure

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

## Adding New Conversion Rules

To customize conversion:

1. **Agent Conversion**: Edit `src/converters/agent-converter.js`
2. **Workflow Conversion**: Edit `src/converters/workflow-converter.js`
3. **Output Format**: Edit `src/utils/skill-writer.js`

# Troubleshooting

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
