# Enhance BMAD Skills Generation

## Overview
Analyze why generated skills are less detailed than the reference repo and create a plan to enhance the conversion process with additional sections, examples, and better structure.

## Current State Analysis

### Why Generated Skills Are Less Detailed

After analyzing the conversion code and comparing with the reference repository structure, here are the key differences:

1. **Content Truncation and Loss**

   - Identity text is truncated to 200 characters (line 48-51 in agent-converter.js)
   - Description is truncated to 1024 characters (line 57-60 in agent-converter.js)
   - Full persona identity is not fully presented

2. **Incomplete Content Extraction**

   - All metadata fields may not be utilized
   - Input/output descriptions from workflow.yaml may not be fully extracted
   - Step descriptions from workflow.yaml may not be fully utilized
   - Related files (template.md, checklist.md) are referenced but their content isn't summarized

3. **Formatting and Presentation Issues**

   - Principles are presented as simple bullet points (could be better formatted)
   - Menu items could have better formatting with clearer command patterns
   - XML instructions parsing could preserve more structure
   - Inputs/Outputs are shown but without detailed descriptions if they exist in workflow.yaml

### What Are CLAUDE.md and SUBAGENT-PATTERNS.md?

Based on Claude Code skills repository patterns:

**CLAUDE.md** - Likely contains:

- Instructions for how Claude should use these skills
- Skill interaction patterns
- Best practices for skill composition
- Guidelines for when to use which skill
- Cross-skill workflows and dependencies

**SUBAGENT-PATTERNS.md** - Likely contains:

- Patterns for creating subagents (specialized AI assistants)
- How to structure subagent prompts
- Subagent communication patterns
- Examples of effective subagent configurations
- Integration patterns between main agents and subagents

These are **meta-documentation files** that help users understand how to effectively use the skills ecosystem, not individual skill files.

## Improvement Plan

### Categorization: BMAD-Implied vs Our Additions

**BMAD-Implied Enhancements (Always Enabled):**
These improvements extract and present content that already exists in BMAD source files but isn't fully utilized:

1. **Remove Content Truncation**
   - Remove 200-char limit on identity summary (show full identity)
   - Keep 1024-char limit on description (Claude Skills requirement) but use full content when possible
   - Preserve all metadata fields

2. **Better Content Extraction**
   - Extract all metadata fields (title, version, etc.) if they exist
   - Extract detailed input/output descriptions from workflow.yaml if they exist
   - Extract step descriptions from workflow.yaml steps array
   - Include summary of template.md and checklist.md content

3. **Better Formatting of Existing Content**
   - Format principles with better structure (preserve existing content, just format better)
   - Improve menu item formatting (command patterns, clearer descriptions)
   - Better XML instruction parsing (preserve more structure, better markdown conversion)
   - Format inputs/outputs with descriptions if available in workflow.yaml

4. **Examples Section** (from menu items)
   - Generate usage examples from menu items
   - Show command patterns: `WS` → workflow-status workflow
   - Create example invocations based on triggers

5. **Related Skills Section** (from workflow dependencies)
   - Analyze menu items to find referenced workflows
   - Map agent → workflow relationships
   - Find complementary agents in the same module
   - All from BMAD structure

6. **Enhanced Best Practices** (from principles)
   - Better formatting of principles (better structure, preserve content)
   - Extract patterns from existing principles
   - Group related principles together

**Our Additions (Optional, Config-Controlled):**
These are enhancements we add that don't exist in BMAD source:

1. **Context-Aware Examples** (optional)
   - Domain-specific use cases
   - Real-world scenarios
   - Integration examples

2. **Advanced Troubleshooting** (optional)
   - Common errors and solutions
   - Validation checkpoints
   - Edge cases

3. **Enhanced Narratives** (optional)
   - Better explanations and context
   - Customized guidance per skill type

4. **Meta-Documentation** (optional)
   - `CLAUDE.md` - Instructions for using skills ecosystem
   - `SUBAGENT-PATTERNS.md` - Subagent creation patterns

## Implementation Plan

### Phase 1: BMAD-Implied Enhancements (Always Enabled) ✅ COMPLETED

**File**: `src/converters/agent-converter.js`

1. ✅ **Remove Identity Truncation**
   - Removed the 200-character limit on identity summary (line 48-51)
   - Use full identity text in description (up to 1024 chars total)
   - Full identity is already shown in Overview section, so progressive disclosure is maintained
   - The 200-char limit was arbitrary, not a Claude Skills requirement

2. ✅ **Extract All Metadata**
   - Include all metadata fields (title, version, tags, etc.) if present
   - Add metadata section if rich metadata exists
   - Check for additional fields in metadata object

3. ✅ **Examples Section** (from menu items)
   - Generate usage examples from menu items
   - Show command patterns: `WS` → workflow-status workflow
   - Create example invocations based on triggers
   - More concise format (removed redundancy)

4. ✅ **Related Skills Section** (from workflow dependencies)
   - Analyze menu items to find referenced workflows
   - Map agent → workflow relationships
   - Find complementary agents in the same module
   - All from BMAD structure

5. ✅ **Enhanced Best Practices** (from principles)
   - Better formatting of principles (better structure, preserve content)
   - Extract patterns from existing principles

6. ✅ **Better Formatting**
   - Enhance menu item formatting in Commands section (better command pattern display)
   - Better presentation of startup_message
   - Improve overall section structure and readability

**File**: `src/converters/workflow-converter.js`

1. ✅ **Extract Input/Output Descriptions**
   - Check if workflow.yaml inputs/outputs have description, type, required, default fields
   - Include full descriptions in Inputs/Outputs sections
   - Show type information if available
   - Indicate required vs optional if available

2. ✅ **Extract Step Descriptions**
   - Use step.name, step.description, step.depends_on from workflow.yaml steps array
   - Include step descriptions in Workflow Steps section
   - Show dependency relationships more clearly

3. ✅ **Better XML Parsing**
   - Preserve more structure from XML instructions
   - Better markdown conversion for nested elements (check, action, ask, etc.)
   - Preserve formatting from original instructions
   - Handle conditional flows better (<check if="...">)
   - Added support for `<output>` tags

4. ✅ **Related Files Summary**
   - If template.md or checklist.md exist, include brief summary or excerpt
   - Reference their purpose more clearly
   - Consider including first few lines as preview

5. ✅ **Support workflow.md format**
   - Added discovery of workflow.md files (core workflows use this format)
   - Parse frontmatter YAML + markdown content
   - Handle both workflow.yaml and workflow.md formats

**File**: `src/utils/file-finder.js`

1. ✅ **Support workflow.md discovery**
   - Search for both workflow.yaml and workflow.md files
   - Handle core workflows that use workflow.md format
   - Improved path handling for glob patterns

**File**: `convert.js`

1. ✅ **CLI Flag Support**
   - Added `--output-dir` flag for custom output directories
   - Added `--identity-limit` flag to control identity truncation
   - Added flags for optional enhancements (examples, best-practices, troubleshooting, related-skills, meta-docs)
   - Added `--help` flag

2. ✅ **Configuration Management**
   - Default output directory (`./skills`) is version controlled
   - Custom output directories for non-default configurations
   - Default enhancement settings in config.json

### Phase 2: Path Adaptation for Claude Skills

**Status**: In Progress

The BMAD-METHOD repository uses `{project-root}/_bmad/...` paths for a specific installation structure. These need adaptation for Claude Skills format.

#### Path Categories

After automated rewriting, remaining `{project-root}` references fall into three categories:

---

**Category A: Documentation Examples (KEEP AS-IS) ✅ COMPLETE**

> **Note:** These are intentionally kept as documentation/teaching content. They are NOT addressed in Phase 2 - they demonstrate BMAD path patterns to users learning the system.

These paths appear in:
- Code blocks showing example output (e.g., JSON subprocess returns)
- "Wrong/Fix" examples showing anti-patterns
- Bash/grep commands that search for patterns
- Variable documentation tables

| File | Line(s) | Content | Reason to Keep |
|------|---------|---------|----------------|
| `module-agent-validation.md` | L120-122 | Wrong/Fix example with ellipsis | Teaching anti-pattern |
| `subprocess-optimization-patterns.md` | L43 | JSON example output | Code block example |
| `step-02b-path-violations.md` | L102 | "What we're catching" example | Teaching what to detect |
| `step-02b-path-violations.md` | L164 | grep command in bash block | Shell command documentation |

---

**Category B: Template Placeholders (SCRIPT-FIXABLE)**

These use template placeholders like `{module-code}`, `{module-id}`, `[module]` and can be batch-replaced:

| File | Line(s) | Pattern | Script Fix |
|------|---------|---------|------------|
| `module-agent-validation.md` | L21 | `{project-root}/_bmad/{module-code}/...` | → `../../{module-code}/...` |
| `step-07c-build-module.md` | L95, L97 | `{project-root}/_bmad/{module-id}/...` | → `../../{module-id}/...` |
| `e-08c-edit-module.md` | L95 | `{project-root}/_bmad/{module-id}/...` | → `../../{module-id}/...` |
| `v-02c-validate-menu.md` | L104 | `{project-root}/_bmad/{module}/...` | → `../../{module}/...` |
| `v-02d-validate-structure.md` | L96 | `{project-root}/_bmad/{module}/...` | → `../../{module}/...` |
| `step-06-workflows.md` | L85 | `{project-root}/_bmad/{module_code}/...` | → `../../{module_code}/...` |
| `architecture.md` | L93 | `{project-root}/_bmad/[module]/...` | → `../../[module]/...` |
| `step-type-patterns.md` | L144-145 | `{project-root}/.../workflow.*` | → `../../module/skill/...` |
| `step-01-init-continuable-template.md` | L16 | `{project-root}/_bmad/[module-path]/...` | → `../../[module-path]/...` |
| `step-1b-template.md` | L16 | `{project-root}/_bmad/[module-path]/...` | → `../../[module-path]/...` |
| `step-template.md` | L14 | `{project-root}/_bmad/[module]/...` | → `../../[module]/...` |
| `workflow-template.md` | L56 | `{project-root}/_bmad/[MODULE FOLDER]/...` | → `../../[MODULE FOLDER]/...` |

**Action**: Add regex patterns to `path-rewriter.js` to handle template placeholders.

---

**Category C: Semantic Content Changes (AI-AGENT REQUIRED)**

These references are embedded in instructional content and need semantic understanding to adapt:

| File | Line(s) | Content | Issue |
|------|---------|---------|-------|
| `critical-actions.md` | L45 | `Review {project-root}/finances/...` | User project path - needs context |
| `trend-analyst.agent.yaml` | L48 | `exec: "{project-root}/_bmad/cis/tasks/..."` | CIS module doesn't exist in skills |
| `tea/SKILL.md` | L27 | `Load ... from {project-root}/_bmad/bmm/testarch/knowledge/` | Path to knowledge files not in skill |
| `tech-writer/SKILL.md` | L25-26 | `Load COMPLETE file {project-root}/_bmad/bmm/data/documentation-standards.md` | Critical action referencing external file |

These require AI understanding to:
1. Determine if the referenced content exists in converted skills
2. Adapt instructions to use relative skill paths
3. Potentially restructure instructions if content doesn't exist

#### Phase 2 Implementation Tasks

**2.1 Script Improvements** (Automated)
- [ ] Add regex patterns for template placeholders (`{module}`, `{module-code}`, `{module-id}`, `[module]`)
- [ ] Handle remaining `{project-root}/_bmad/...` and `{project-root}/_bmm/...` patterns with template variables

**2.2 AI-Agent Content Adaptation** (Manual/AI-assisted)

Create an `adapt-skill-paths` skill that:
1. Reviews skills for semantic path references in instructions
2. Identifies if referenced content exists in converted skill structure
3. Proposes adapted instructions using relative skill paths
4. Handles cases where content doesn't exist (add to skill, or note as external dependency)

**Skills requiring AI review:**
- `skills/bmb/agent/data/critical-actions.md`
- `skills/bmb/agent/data/reference/module-examples/trend-analyst.agent.yaml`
- `skills/bmm/tea/SKILL.md`
- `skills/bmm/tech-writer/SKILL.md`

**2.3 Content Migration** (Manual)

Some skills reference content that should be migrated:
- `bmm/testarch/knowledge/` fragments → should be in `skills/bmm/tea/knowledge/`
- `bmm/data/documentation-standards.md` → should be in `skills/bmm/tech-writer/`


- `CLAUDE.md` - Instructions for Claude on using the skills ecosystem
  - Generated from analyzing all agents and their menu items
  - Maps agent-to-workflow relationships
  - Documents skill interaction patterns
  
- `SUBAGENT-PATTERNS.md` - Patterns for creating and using subagents
  - Generated from agent persona patterns
  - Extracts communication styles and principles
  - Documents subagent creation patterns

## Implementation Details

### Key Files Modified

1. **`src/converters/agent-converter.js`** ✅
   - Enhanced `buildAgentSkillContent()` function
   - Added Examples section generation
   - Added Related Skills section generation
   - Enhanced guidelines formatting
   - Removed identity truncation

2. **`src/converters/workflow-converter.js`** ✅
   - Enhanced `buildWorkflowSkillContent()` function
   - Added support for workflow.md format
   - Improved input/output documentation
   - Enhanced step descriptions
   - Better XML parsing
   - Related files preview

3. **`src/utils/file-finder.js`** ✅
   - Added support for discovering workflow.md files
   - Improved path handling for glob patterns
   - Better error handling

4. **`convert.js`** ✅
   - Added CLI argument parsing
   - Added post-processing step after conversion
   - Added enhancement options to config
   - Passes all agents/workflows for relationship analysis

5. **`config.json`** ✅
   - Added enhancement configuration options

### Configuration

Add to `config.json`:

```json
{
  "enhancements": {
    "optional": {
      "addExamples": true,
      "addBestPractices": true,
      "addTroubleshooting": false,
      "addRelatedSkills": true,
      "generateMetaDocs": false
    },
    "identityCharLimit": null
  }
}
```

**Default Settings:**

- `addExamples`: **true** - Helpful for understanding usage
- `addBestPractices`: **true** - Provides helpful guidance
- `addRelatedSkills`: **true** - Helps discover related skills
- `addTroubleshooting`: **false** - May not be applicable to all skills, can be verbose
- `generateMetaDocs`: **false** - Only needed once at root level, not per-skill

**Note**: BMAD-implied enhancements are always enabled (no config needed). Only optional enhancements are controlled by config.

## Expected Outcomes

After Phase 1 (BMAD-Implied, Always Enabled): ✅ COMPLETED

- Full identity text preserved (no truncation)
- All metadata fields extracted and presented
- Better formatted principles and commands
- Complete input/output descriptions from workflow.yaml
- Better structured instructions from XML parsing
- Examples section from menu items
- Related skills section from workflow dependencies
- Skills will be more complete and faithful to BMAD source

After Phase 2 (Optional Enhancements, if enabled):

- Additional context-aware examples
- Advanced troubleshooting guidance
- Enhanced narratives
- Meta-documentation for ecosystem understanding

## Key Design Decisions

1. **BMAD-Implied Enhancements**: Always enabled, no config needed
   - These extract and present existing BMAD content better
   - No new content is added, just better extraction and formatting

2. **Optional Enhancements**: Config-controlled, most enabled by default
   - These add new content not in BMAD source
   - Defaults: Examples=true, BestPractices=true, RelatedSkills=true, Troubleshooting=false, MetaDocs=false
   - User can disable if they want minimal output

3. **Content Fidelity**: Priority is on accurately representing BMAD content
   - No content generation that isn't based on BMAD source
   - All enhancements must be traceable to BMAD source files

4. **CLI Flags**: Provide flexibility for custom configurations
   - Default output (`./skills`) is version controlled
   - Custom output directories for non-default settings
   - All optional enhancements can be toggled via flags

## Findings from Analysis

### BMAD Structure Analysis

Based on code analysis:

**Agent Structure (agent.yaml):**

- `agent.metadata` - id, name, title (possibly version, tags)
- `agent.persona` - role, identity, communication_style, principles, startup_message
- `agent.menu` - array of items with trigger, description
- `agent.critical_actions` - array of action strings

**Workflow Structure:**

- `workflow.yaml` format: name, description, standalone flag, inputs, outputs, steps, plus separate instructions.md/xml
- `workflow.md` format: frontmatter YAML + markdown content (used by core workflows)

### About the 200-Character Limit

The 200-character limit on identity (line 48-51 in agent-converter.js) is used to create a shorter description for the frontmatter `description` field. This is NOT a Claude Skills requirement - the 1024-char limit on the final description is the actual Claude Skills requirement.

**Current behavior:**

- Identity is truncated to 200 chars for the frontmatter description
- Full identity IS shown in the Overview section (line 138)
- The truncation is only for the frontmatter `description` field

**Progressive Disclosure:**

- The frontmatter `description` is what shows in skill lists/search
- The full content is in the Overview section
- The 200-char limit appears to be arbitrary, not a hard requirement

**Recommendation:** Remove the 200-char limit on identity. Use full identity in description (up to 1024 chars total). The Overview section already shows full identity, so progressive disclosure is maintained.

### Optional Enhancements - Default Settings

**Should be enabled by default:**

- `addExamples` - true (helpful for understanding usage)
- `addBestPractices` - true (helpful guidance)
- `addRelatedSkills` - true (helps discover related skills)

**Should be disabled by default:**

- `addTroubleshooting` - false (may not be applicable to all skills, can be verbose)
- `generateMetaDocs` - false (only needed once, not per-skill)

### Meta-Documentation Generation

Generate from BMAD structure:

- Analyze agent menu items to find workflow dependencies
- Map agent-to-workflow relationships
- Extract common patterns from workflow instructions
- Generate CLAUDE.md with skill interaction patterns
- Generate SUBAGENT-PATTERNS.md from agent persona patterns

## Next Steps

### Phase 2: AI-Enhanced Optional Enhancements

1. **Create `enhance-bmad-skills` skill** (SKILL.md file)
   - Instructions for AI models to enhance existing skills
   - Takes a SKILL.md file and adds context-aware enhancements
   - Maintains consistency with BMAD principles
   - Outputs enhanced version

2. **Implement enhancement logic** (if script-based approach preferred)
   - Context-aware example generation
   - Advanced troubleshooting scenarios
   - Enhanced narrative generation

### Phase 3: Meta-Documentation

1. **Generate CLAUDE.md**
   - Analyze all agents and workflows
   - Map relationships and dependencies
   - Document interaction patterns

2. **Generate SUBAGENT-PATTERNS.md**
   - Extract patterns from agent personas
   - Document subagent creation guidelines
   - Provide examples and best practices

## Completed Tasks

- ✅ Remove identity truncation (200 char limit) - use full identity in description up to 1024 chars
- ✅ Extract all metadata fields from agent.yaml and workflow.yaml (title, version, tags, etc.)
- ✅ Improve formatting of principles, menu items, and instructions in both converters
- ✅ Extract input/output descriptions, types, and required flags from workflow.yaml
- ✅ Extract step descriptions and dependencies from workflow.yaml steps array
- ✅ Enhance XML instruction parsing to preserve more structure and better markdown conversion
- ✅ Add brief summary or preview of template.md and checklist.md content
- ✅ Add Examples section generated from menu items with command patterns
- ✅ Add Related Skills section from workflow dependencies and same-module agents
- ✅ Enhance Best Practices section formatting from principles
- ✅ Support workflow.md format for core workflows
- ✅ Add CLI flags for configuration control
- ✅ Update config.json with default enhancement settings

## Remaining Tasks

- ✅ Create `enhance-bmad-skills` skill for AI-driven enhancements
- [ ] Phase 2: Implement context-aware example generation (if script-based)
- [ ] Phase 2: Implement advanced troubleshooting (if script-based)
- [ ] Phase 3: Generate CLAUDE.md from BMAD structure analysis
- [ ] Phase 3: Generate SUBAGENT-PATTERNS.md from agent persona patterns
