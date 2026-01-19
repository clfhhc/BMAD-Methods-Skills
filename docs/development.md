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
│       ├── path-rewriter.js   # Dynamic path adaptation
│       ├── resource-migrator.js # Auxiliary resource handler
│       └── skill-writer.js
└── skills/                # Converted skills (committed to repo)
```

## Testing

Use the built-in test suite to verify path rewriting logic:

```bash
pnpm test
```

Tests for `path-rewriter.js` ensure that both `skillMap` resolutions and fallback regex patterns produce correct, portable paths.

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

## Release Process

We use **Semantic Release** to automate versioning, changelogs, and publishing. This workflow relies on **Conventional Commits** and strict branching rules.

### 1. Feature Branches
- **Create**: Always create a new branch for your changes (e.g., `feat/add-new-skill`, `fix/login-bug`).
  ```bash
  git checkout -b feature/my-cool-feature
  ```
- **Scope**: Keep branches focused on a single feature or fix.

### 2. Commit Messages (Conventional Commits)
We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification. Your commit messages determine the version bump:

- **`fix: ...`** -> **Patch Release** (v1.0.0 -> v1.0.1)
  - Usage: Internal bug fixes.
- **`feat: ...`** -> **Minor Release** (v1.0.0 -> v1.1.0)
  - Usage: New features.
- **`BREAKING CHANGE: ...`** -> **Major Release** (v1.0.0 -> v2.0.0)
  - Usage: Incompatible API changes. Example:
    ```
    feat: change authentication API

    BREAKING CHANGE: login() now accepts an object instead of two strings.
    ```
- **Other Types** (no release triggered):
  - `docs:` Documentation changes
  - `chore:` Maintenance, dependency updates
  - `refactor:` Code changes that neither fix a bug nor add a feature
  - `test:` Adding missing tests or correcting existing tests
  - `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)

### 3. Pull Requests & Merging
- **Open a PR**: Target the `main` branch.
- **Review**: Ensure CI passes (lint, test).
- **Merge Strategy**: **Squash and Merge** (Recommended).
  - This combines all your commits into one.
  - **Crucial**: The final merge commit message (the title of the PR usually) **MUST** follow the Conventional Commits format described above.
  - *Example PR Title*: `feat: add automated release workflow`
- **Rebase**: Alternatively, you can rebase, but every commit must be "conventional" to avoid invalid releases or cluttered changelogs. Merge commits are generally discouraged unless they are standard Conventional Commits.

### 4. Automatic Release
Once merged into `main`:
1. GitHub Actions triggers the `release` workflow.
2. `semantic-release` analyzes the new commits.
3. Automatically:
   - Bumps `package.json` version.
   - Generates/updates `CHANGELOG.md`.
   - Creates a GitHub Release.
   - Publishes to npm (with Provenance).
