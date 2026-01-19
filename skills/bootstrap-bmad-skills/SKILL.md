---
name: bootstrap-bmad-skills
description: Bootstrap and install BMAD-METHOD skills for Claude Code, Cursor, Antigravity, and other tools.
---

# Bootstrap BMAD Skills

## Overview

This skill guides you through installing BMAD-METHOD skills and configuring them for your project.

## Commands

- **`BS`** or **`bootstrap-skills`** - Start the bootstrap workflow

---

## Workflow

### Step 1: Tool Identification

Ask which tool(s) the user is using. Multiple selections are allowed:

- [ ] Claude Code
- [ ] Cursor
- [ ] Antigravity
- [ ] Other (Specify)

### Step 2: Installation Scope

Ask whether to install skills **globally** or **project-specific**:

| Scope | Description |
|-------|-------------|
| **Global** | Skills available across all projects for that tool |
| **Project-Specific** | Skills limited to the current repository only |

**Destination paths by tool and scope:**

| Tool | Scope | Destination |
|------|-------|-------------|
| **Claude Code** | Global | `~/.claude/skills/` |
| **Claude Code** | Local | `./.claude/skills/` |
| **Cursor** | Local | `./.cursor/skills/` |
| **Antigravity** | Local | `./.agent/skills/` |

### Step 3: Fetch & Convert

Run the conversion command:
```bash
npx @clfhhc/bmad-methods-skills --output-dir .temp/converted-skills
```

This fetches the latest BMAD-METHOD and converts all agents/workflows.

### Step 4: Apply Enhancements

Use the `enhance-bmad-skills` skill (`SP` command) to:
1. **Scan paths**: Check for `{project-root}` references
2. **Adapt paths**: Adjust based on installation scope
   - **Global**: Prefer absolute paths
   - **Project-Specific**: Prefer relative paths

### Step 5: Install Skills

Run the install command:
```bash
npx @clfhhc/bmad-methods-skills install --from .temp/converted-skills --tool [TOOL] --force
```
Replace `[TOOL]` with `antigravity`, `cursor`, or `claude`.

### Step 6: Configure Installation

After installation, customize the config files. Ask these questions:

#### Core Configuration (`{skill-root}/core/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `user_name` | What name should I use to address you? | *(OS username)* |
| `communication_language` | What language should I communicate in? | English |
| `document_output_language` | What language for generated documents? | English |
| `output_folder` | Where should BMAD output artifacts? | `{project-root}/documents/bmad` |

#### BMM Configuration (`{skill-root}/bmm/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `project_name` | What is your project called? | *(directory name)* |
| `user_skill_level` | What's your development experience? | `intermediate` |
| `planning_artifacts` | Where to store planning docs? | `{output_folder}/planning-artifacts` |
| `implementation_artifacts` | Where to store implementation docs? | `{output_folder}/implementation-artifacts` |
| `project_knowledge` | Where to store project knowledge? | `{project-root}/docs` |

#### BMB Configuration (`{skill-root}/bmb/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `bmb_creations_output_folder` | Where to save custom agents/workflows? | `{output_folder}/bmb-creations` |

### Step 7: Verify

1. **Skills installed** at the correct destination
2. **Config files exist** with user's values
3. **Paths adapted** for the installation scope

---

## Guidelines

- **Ask before overwriting** existing skills
- **Offer defaults** - don't force user to answer every question
- **Explain placeholders** like `{project-root}` and `{skill-root}`

## Examples

**Quick bootstrap:**
```
BS
```
→ Starts the guided workflow

**Specific request:**
```
Install BMAD skills for Cursor, project-specific, with custom output folder
```
