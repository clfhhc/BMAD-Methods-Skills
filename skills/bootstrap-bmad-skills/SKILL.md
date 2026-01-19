---
name: bootstrap-bmad-skills
description: Bootstrap and install BMAD-METHOD skills for Claude Code, Cursor, Antigravity, and other tools.
---

# Bootstrap BMAD Skills

## Commands

- **`BS`** or **`bootstrap-skills`** - Start the bootstrap workflow

---

## Quick Start

Run the one-liner to install everything automatically:

```bash
npx @clfhhc/bmad-methods-skills init --tool=[TOOL] --bootstrap
```

Replace `[TOOL]` with `antigravity`, `cursor`, or `claude`.

Then proceed to **Configure Installation** below.

---

## Manual Workflow

Use this when you need more control or want a guided experience.

### Step 1: Tool Selection

Ask which tool(s) the user is using. Multiple selections are allowed:

- [ ] Claude Code
- [ ] Cursor
- [ ] Antigravity
- [ ] Other (Specify)

### Step 2: Installation Scope

Ask whether to install skills **globally** or **project-specific**:

| Scope | Description | Destination |
|-------|-------------|-------------|
| **Global** | Skills available across all projects | `~/.claude/skills/` (Claude only) |
| **Project-Specific** | Skills limited to current repo | `.[tool]/skills/` |

### Step 3: Fetch & Convert

```bash
npx @clfhhc/bmad-methods-skills --output-dir .temp/converted-skills
```

### Step 4: Install

```bash
npx @clfhhc/bmad-methods-skills install --from=.temp/converted-skills --tool=[TOOL] --force
```

### Step 5: Clean up

```bash
rm -rf .temp
```

---

## Configure Installation

Prompt the user for each configuration setting. Offer the defaults shown:

### Core Configuration (`{skill-root}/core/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `user_name` | What name should I use to address you? | *(OS username)* |
| `communication_language` | What language should I communicate in? | English |
| `document_output_language` | What language for generated documents? | English |
| `output_folder` | Where should BMAD output artifacts? | `{project-root}/documents/bmad` |

### BMM Configuration (`{skill-root}/bmm/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `project_name` | What is your project called? | *(directory name)* |
| `user_skill_level` | What's your development experience? | `intermediate` |
| `planning_artifacts` | Where to store planning docs? | `{output_folder}/planning-artifacts` |
| `implementation_artifacts` | Where to store implementation docs? | `{output_folder}/implementation-artifacts` |
| `project_knowledge` | Where to store project knowledge? | `{project-root}/docs` |

### BMB Configuration (`{skill-root}/bmb/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `bmb_creations_output_folder` | Where to store BMB outputs? | `{output_folder}/bmb-creations` |

---

## Verify

1. Skills installed at the correct destination
2. Config files exist (core, bmm, bmb)
3. Paths use `{skill-root}` variable

## Guidelines

- **Guided Flow**: If the user starts with `BS`, prioritize asking the questions in Steps 1, 2, and the Configuration section before running commands.
- **Confirmation**: Always summarize the plan and ask for confirmation before executing automated installation commands.
- **Defaults**: Offer defaults - don't force user to answer every question if they are happy with the suggested values.
- **Overwrite**: Ask before overwriting existing skills unless `--force` is used.
