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
| `user_name` | What should agents call you? (Use your name or a team name) | BMad |
| `communication_language` | What language should agents use when chatting with you? | English |
| `document_output_language` | Preferred document output language? | English |
| `output_folder` | Where should output files be saved? | `_bmad-output` |

### BMM Configuration (`{skill-root}/bmm/config.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `project_name` | What is your project called? | *(directory name)* |
| `user_skill_level` | What is your development experience level? | `intermediate` |
| `planning_artifacts` | Where should planning artifacts be stored? (Brainstorming, Briefs, PRDs, UX Designs, Architecture, Epics) | `{output_folder}/planning-artifacts` |
| `implementation_artifacts` | Where should implementation artifacts be stored? (Sprint status, stories, reviews, retrospectives, Quick Flow output) | `{output_folder}/implementation-artifacts` |
| `project_knowledge` | Where should long-term project knowledge be stored? (docs, research, references) | `docs` |

---

## Verify

1. Skills installed at the correct destination
2. Config files exist (core, bmm)
3. Paths use `{skill-root}` variable

## Guidelines

- **Guided Flow**: If the user starts with `BS`, prioritize asking the questions in Steps 1, 2, and the Configuration section before running commands.
- **Confirmation**: Always summarize the plan and ask for confirmation before executing automated installation commands.
- **Defaults**: Offer defaults - don't force user to answer every question if they are happy with the suggested values.
- **Overwrite**: Ask before overwriting existing skills unless `--force` is used.
