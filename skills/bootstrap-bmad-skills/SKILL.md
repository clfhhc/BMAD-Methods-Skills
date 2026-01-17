---
name: bootstrap-bmad-skills
description: Bootstrap and install BMAD-METHOD skills for Claude Code, Cursor, Antigravity, and other tools.
---

# Bootstrap BMAD Skills

## Overview

This skill guides the user through fetching, converting, enhancing, and installing BMAD-METHOD skills for their preferred AI development tools.

## Commands

- **`BS or bootstrap-skills`** - Start the bootstrap and installation workflow

---

### Step 1: Automated Bootstrap (Recommended)
Run the automated bootstrap command to fetch, convert, and install the full BMAD method suite.
1.  **Run**: `npx @clfhhc/bmad-methods-skills init --bootstrap`
2.  **Verify**: Check that skills are installed in the tool directory (e.g., `.agent/skills`).

### Step 2: Manual Workflow (Alternative)
If custom configuration is needed, follow these steps:

**2.1 Fetch & Convert**
Run `npx @clfhhc/bmad-methods-skills --output-dir .temp/converted-skills` to fetch the `main` branch and convert agents/workflows.

**2.2 Apply Enhancements**
1.  **Scan Paths**: Check for `{project-root}` references.
2.  **Adapt Paths**: Adjust paths for your specific installation scope.

**2.3 Install Skills**
Run the `install` command to move skills to their final destination.
- Run `npx @clfhhc/bmad-methods-skills install --from .temp/converted-skills --tool [TOOL] --force`
  - Replace `[TOOL]` with `antigravity`, `cursor`, or `claude`.

### Step 3: Verify
Ensure all file paths in the `SKILL.md` files are correct and that `data/` or `knowledge/` folders were moved correctly (automated in Step 1).

---

## Guidelines

- **Safety First**: Don't overwrite existing skills without asking first.
- **Incremental**: If converting many skills, report progress periodically.
- **Customization**: Respect any custom module selections from `config.json`.
- **Clarity**: Always explain what is being done at each step.

## Examples

**Start the bootstrap process:**
```
BS
```

**Install for Cursor locally:**
```
Bootstrap BMAD skills for Cursor (Project-Specific)
```
