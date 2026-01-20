---
name: bootstrap-bmad-skills
description: Bootstrap and install BMAD-METHOD skills for Claude Code, Cursor, Antigravity, and other tools.
---

# Bootstrap BMAD Skills

## Commands

- **`BS`** or **`bootstrap-skills`** - Start the bootstrap workflow

---

## When You Run BS (Guided Flow)

For **`BS`** or **`bootstrap-skills`**: (1) Ask Step 1 (Tool), Step 2 (Scope), and **Configure Installation**—offer defaults. (2) Summarize and **confirm** before running commands. (3) Run the one-liner or Manual (Steps 3–5) as appropriate; write the user’s config to `{skill-root}/_config/core.yaml` and `{skill-root}/_config/bmm.yaml` after install.

---

## Quick Start (Unattended)

Use only when the user explicitly wants to **skip prompts** (e.g. “just run it” or “use defaults”):

```bash
npx @clfhhc/bmad-methods-skills init --tool=[TOOL] --bootstrap
```

Replace `[TOOL]` with `antigravity`, `cursor`, or `claude`.

Afterward, the user can edit `{skill-root}/_config/core.yaml` and `{skill-root}/_config/bmm.yaml`, or you can run the **Configure Installation** questions and apply the answers to those files.

---

## Manual Workflow

Use when the user wants a guided experience, needs **global** install, or when you must run Fetch & Convert and Install as separate steps.

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
| **Global** | Skills available across all projects | Cursor: `~/.cursor/skills/`; Antigravity: `~/.gemini/antigravity/skills/`; Claude Code: `~/.claude/skills/` |
| **Project-Specific** | Skills limited to current repo | Cursor: `.cursor/skills/`; Antigravity: `.agent/skills/`; Claude Code: `.claude/skills/` |

**Note:** On **install**, use `--scope=project` (default) or `--scope=global` / `--global`. Project: `.{tool}/skills/` under cwd (run from project root). Global: `~/.cursor/skills` etc.; `--tool` required.

### Step 3: Fetch & Convert

```bash
npx @clfhhc/bmad-methods-skills --output-dir .temp/converted-skills
```

### Step 4: Install

**Project-specific** (default; run from project root):

```bash
npx @clfhhc/bmad-methods-skills install --from=.temp/converted-skills --tool=[TOOL] --force
```

**Global** (`--tool` required; works from any directory):

```bash
npx @clfhhc/bmad-methods-skills install --from=.temp/converted-skills --tool=[TOOL] --force --scope=global
```

(`--global` = `--scope=global`.)

### Step 5: Clean up

```bash
rm -rf .temp
```

---

## Configure Installation

Prompt the user for each configuration setting. Offer the defaults shown:

### Core Configuration (`{skill-root}/_config/core.yaml`)

| Setting | Question | Default |
|---------|----------|---------|
| `user_name` | What should agents call you? (Use your name or a team name) | BMad |
| `communication_language` | What language should agents use when chatting with you? | English |
| `document_output_language` | Preferred document output language? | English |
| `output_folder` | Where should output files be saved? | `_bmad-output` |

### BMM Configuration (`{skill-root}/_config/bmm.yaml`)

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
2. Config files exist: `_config/core.yaml`, `_config/bmm.yaml`
3. Paths use `{skill-root}` variable

## Guidelines

- **Guided Flow**: For `BS`, follow **When You Run BS (Guided Flow)** above.
- **Confirmation**: Always summarize the plan and ask for confirmation before executing automated installation commands.
- **Defaults**: Offer defaults—don’t force the user to answer every question if they accept the suggested values.
- **Overwrite**: Ask before overwriting existing skills unless `--force` is used.
