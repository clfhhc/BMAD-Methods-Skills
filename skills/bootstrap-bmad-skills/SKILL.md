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

Use this when you need more control.

### 1. Tool & Scope

| Tool | Scope | Destination |
|------|-------|-------------|
| Claude Code | Global | `~/.claude/skills/` |
| Claude Code | Local | `./.claude/skills/` |
| Cursor | Local | `./.cursor/skills/` |
| Antigravity | Local | `./.agent/skills/` |

### 2. Fetch & Convert

```bash
npx @clfhhc/bmad-methods-skills --output-dir .temp/converted-skills
```

### 3. Install

```bash
npx @clfhhc/bmad-methods-skills install --from=.temp/converted-skills --tool=[TOOL] --force
```

---

## Configure Installation

Customize the generated config files:

### Core (`{skill-root}/core/config.yaml`)

| Setting | Default |
|---------|---------|
| `user_name` | *(OS username)* |
| `communication_language` | English |
| `document_output_language` | English |
| `output_folder` | `{project-root}/documents/bmad` |

### BMM (`{skill-root}/bmm/config.yaml`)

| Setting | Default |
|---------|---------|
| `project_name` | *(directory name)* |
| `user_skill_level` | `intermediate` |
| `planning_artifacts` | `{output_folder}/planning-artifacts` |
| `implementation_artifacts` | `{output_folder}/implementation-artifacts` |
| `project_knowledge` | `{project-root}/docs` |

### BMB (`{skill-root}/bmb/config.yaml`)

| Setting | Default |
|---------|---------|
| `bmb_creations_output_folder` | `{output_folder}/bmb-creations` |

---

## Verify

1. Skills installed at the correct destination
2. Config files exist (core, bmm, bmb)
3. Paths use `{skill-root}` variable

## Guidelines

- Ask before overwriting existing skills
- Offer defaults - don't force user to answer every question
