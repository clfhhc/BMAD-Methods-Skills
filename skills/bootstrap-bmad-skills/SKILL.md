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

## Workflow

### Step 1: Tool Identification
Ask the user which tool(s) they are using. Multiple selections are allowed.
- [ ] Claude Code
- [ ] Cursor
- [ ] Antigravity
- [ ] Other (Specify)

### Step 2: Installation Scope
Ask whether to install the skills as global or project-specific.
- **Global**: Skills will be available across all projects for that tool.
- **Project-Specific**: Skills will be limited to the current repository.

### Step 3: Fetch & Convert
Inform the user that you will now fetch the `bmad-methods` main branch and convert it in a temporary folder.

1.  **Convert**: Run `npx @clfhhc/bmad-methods-skills --output-dir .temp/converted-skills`
    - This fetches the `main` branch of BMAD-METHOD and converts all agents/workflows.

### Step 4: Apply Enhancements
Apply Phase 2 path adaptations and Phase 3 meta-docs.

1.  **Scan Paths**: Use the `enhance-bmad-skills` (`SP`) command to scan the converted skills for `{project-root}` references.
2.  **Adapt Paths**: Propose path adaptations (relative vs absolute) based on the target installation type.
    - If **Global**: Prefer absolute paths or relative to a fixed global root.
    - If **Project-Specific**: Prefer relative paths within the project.

### Step 5: Install Skills
Move the enhanced skills from `.temp/converted-skills` to the final destination based on Step 1 and 2.

| Tool | Scope | Destination |
|------|-------|-------------|
| **Claude Code** | Global | `~/.claude/skills/` |
| **Claude Code** | Local | `./.claude/skills/` |
| **Cursor** | Local | `./.cursor/skills/` |
| **Antigravity** | Local | `./.agent/skills/` |

*Note: Create directories if they don't exist.*

### Step 6: Verify
Ensure all file paths in the `SKILL.md` files are correct and that any referenced `data/` or `knowledge/` folders were moved correctly.

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
