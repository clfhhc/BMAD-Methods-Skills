---
name: workflow-init
description: Initialize a new BMM project by determining level, type, and creating workflow path
---

# workflow-init

## Overview
Initialize a new BMM project by determining level, type, and creating workflow path

## When to Use
This workflow can be run standalone and is designed for: initialize a new bmm project by determining level, type, and creating workflow path

## Instructions
# Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow handles BOTH new projects AND legacy projects following the BMad Method</critical>

<workflow>

## Step 1: Scan for existing work
<output>Welcome to BMad Method, {user_name}!</output>

**Action:** Perform comprehensive scan for existing work:

- BMM artifacts: PRD, epics, architecture, UX, brief, research, brainstorm
- Implementation: stories, sprint-status, workflow-status
- Codebase: source directories, package files, git repo
- Check both {planning_artifacts} and {implementation_artifacts} locations

**Action:** Categorize into one of these states:

- CLEAN: No artifacts or code (or scaffold only)
- PLANNING: Has PRD/spec but no implementation
- ACTIVE: Has stories or sprint status
- LEGACY: Has code but no BMM artifacts
- UNCLEAR: Mixed state needs clarification

**Ask:** What's your project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}
**Action:** Store project_name
**Template Output:** project_name


## Step 2: Choose setup path
<check if="state == CLEAN">
  <output>Perfect! Fresh start detected.</output>
  **Action:** Continue to step 3
</check>

<check if="state == ACTIVE AND workflow_status exists">
  <output>✅ You already have workflow tracking at: {{workflow_status_path}}

To check progress: Load any BMM agent and run /bmad:bmm:workflows:workflow-status

Happy building! 🚀</output>
**Action:** Exit workflow (already initialized)
</check>

<check if="state != CLEAN">
  <output>Found existing work:
{{summary_of_findings}}</output>

**Ask:** How would you like to proceed?

1. **Continue** - Work with existing artifacts
2. **Archive & Start Fresh** - Move old work to archive
3. **Express Setup** - I know exactly what I need
4. **Guided Setup** - Walk me through options

Choice [1-4]

  <check if="choice == 1">
    **Action:** Set continuing_existing = true
    **Action:** Store found artifacts
    **Action:** Continue to step 7 (detect track from artifacts)
  </check>

  <check if="choice == 2">
    **Ask:** Archive existing work? (y/n)
    <action if="y">Move artifacts to {planning_artifacts}/archive/</action>
    <output>Ready for fresh start!</output>
    **Action:** Continue to step 3
  </check>

  <check if="choice == 3">
    **Action:** Jump to step 3 (express path)
  </check>

  <check if="choice == 4">
    **Action:** Continue to step 4 (guided path)
  </check>
</check>

<check if="state == CLEAN">
  **Ask:** Setup approach:

1. **Express** - I know what I need
2. **Guided** - Show me the options

Choice [1 or 2]:

  <check if="choice == 1">
    **Action:** Continue to step 3 (express)
  </check>

  <check if="choice == 2">
    **Action:** Continue to step 4 (guided)
  </check>
</check>


## Step 3: Express setup path
**Ask:** Is this for:
1. **New project** (greenfield)
2. **Existing codebase** (brownfield)

Choice [1/2]:
**Action:** Set field_type based on choice

**Ask:** Planning approach:

1. **BMad Method** - Full planning for complex projects
2. **Enterprise Method** - Extended planning with security/DevOps

Choice [1/2]:
**Action:** Map to selected_track: method/enterprise

<output>🚀 **For Quick Flow (minimal planning, straight to code):**
Load the **quick-flow-solo-dev** agent instead - use Quick Flow agent for faster development</output>

**Template Output:** field_type
**Template Output:** selected_track
**Action:** Jump to step 6 (discovery options)


## Step 4: Guided setup - understand project
**Ask:** Tell me about what you're working on. What's the goal?
**Action:** Store user_description

**Action:** Analyze for field type indicators:

- Brownfield: "existing", "current", "enhance", "modify"
- Greenfield: "new", "build", "create", "from scratch"
- If codebase exists, default to brownfield unless user indicates scaffold

<check if="field_type unclear AND codebase exists">
  **Ask:** I see existing code. Are you:
1. **Modifying** existing codebase (brownfield)
2. **Starting fresh** - code is just scaffold (greenfield)

Choice [1/2]:
**Action:** Set field_type based on answer
</check>

<action if="field_type not set">Set based on codebase presence</action>

**Action:** Check for game development keywords
<check if="game_detected">
<output>🎮 **GAME DEVELOPMENT DETECTED**

For game development, install the BMGD module:

```bash
bmad install bmgd
```

Continue with software workflows? (y/n)</output>
**Ask:** Choice:
<action if="n">Exit workflow</action>
</check>

**Template Output:** user_description
**Template Output:** field_type
**Action:** Continue to step 5


## Step 5: Guided setup - select track
<output>Based on your project, here are your BMad Method planning options:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. BMad Method** 🎯 {{#if recommended}}(RECOMMENDED){{/if}}

- Full planning: PRD + UX + Architecture
- Best for: Products, platforms, complex features
- Benefit: AI agents have complete context for better results

**2. Enterprise Method** 🏢

- Extended: Method + Security + DevOps + Testing
- Best for: Enterprise, compliance, mission-critical
- Benefit: Comprehensive planning for complex systems

**🚀 For Quick Flow (minimal planning, straight to code):**
Load the **quick-flow-solo-dev** agent instead - use Quick Flow agent for faster development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if brownfield}}
💡 Architecture creates focused solution design from your codebase, keeping AI agents on track.
{{/if}}</output>

**Ask:** Which BMad Method approach fits best?

1. BMad Method {{#if recommended}}(recommended){{/if}}
2. Enterprise Method
3. Help me decide
4. Switch to Quick Flow (use quick-flow-solo-dev agent)

Choice [1/2/3/4]:

<check if="choice == 4">
  <output>🚀 **Switching to Quick Flow!**

Load the **quick-flow-solo-dev** agent instead:

- Start a new chat
- Load the quick-flow-solo-dev agent
- Use Quick Flow for minimal planning and faster development

Quick Flow is perfect for:

- Simple features and bug fixes
- Rapid prototyping
- When you want to get straight to code

Happy coding! 🚀</output>
**Action:** Exit workflow
</check>

<check if="choice == 3">
  **Ask:** What concerns you about choosing?
  **Action:** Provide tailored guidance based on concerns
  **Action:** Loop back to choice
</check>

**Action:** Map choice to selected_track
**Template Output:** selected_track


## Step 6: Discovery workflows selection (unified)
**Action:** Determine available discovery workflows based on:
- field_type (greenfield gets product-brief option)
- selected_track (method/enterprise options)

<check if="field_type == greenfield AND selected_track in [method, enterprise]">
  <output>Optional discovery workflows can help clarify your vision:</output>
  **Ask:** Select any you'd like to include:

1. 🧠 **Brainstorm** - Creative exploration and ideation
2. 🔍 **Research** - Technical/competitive analysis
3. 📋 **Product Brief** - Strategic product planning (recommended)

Enter numbers (e.g., "1,3" or "all" or "none"):
</check>

<check if="field_type == brownfield AND selected_track in [method, enterprise]">
  <output>Optional discovery workflows:</output>
  **Ask:** Include any of these?

1. 🧠 **Brainstorm** - Creative exploration
2. 🔍 **Research** - Domain analysis

Enter numbers (e.g., "1,2" or "none"):
</check>

**Action:** Parse selections and set:

- brainstorm_requested
- research_requested
- product_brief_requested (if applicable)

**Template Output:** brainstorm_requested
**Template Output:** research_requested
**Template Output:** product_brief_requested

<check if="brownfield">
  <output>💡 **Note:** For brownfield projects, run document-project workflow first to analyze your codebase.</output>
</check>


<step n="7" goal="Detect track from artifacts" if="continuing_existing OR migrating_legacy">
**Action:** Analyze artifacts to detect track:
- Has PRD → BMad Method
- Has Security/DevOps → Enterprise Method
- Has tech-spec only → Suggest switching to quick-flow-solo-dev agent

<output>Detected: **{{detected_track}}** based on {{found_artifacts}}</output>
**Ask:** Correct? (y/n)

<ask if="n">Which BMad Method track instead?

1. BMad Method
2. Enterprise Method
3. Switch to Quick Flow (use quick-flow-solo-dev agent)

Choice:</ask>

**Action:** Set selected_track
**Template Output:** selected_track


## Step 8: Generate workflow path
**Action:** Load path file: {path_files}/{{selected_track}}-{{field_type}}.yaml
**Action:** Build workflow_items from path file
**Action:** Scan for existing completed work and update statuses
**Action:** Set generated date

**Template Output:** generated
**Template Output:** workflow_path_file
**Template Output:** workflow_items


## Step 9: Create tracking file
<output>Your BMad workflow path:

**Track:** {{selected_track}}
**Type:** {{field_type}}
**Project:** {{project_name}}

{{#if brownfield}}Prerequisites: document-project{{/if}}
{{#if has_discovery}}Discovery: {{list_selected_discovery}}{{/if}}

{{workflow_path_summary}}
</output>

**Ask:** Create workflow tracking file? (y/n)

<check if="y">
  **Action:** Generate YAML from template with all variables
  **Action:** Save to {planning_artifacts}/bmm-workflow-status.yaml
  **Action:** Identify next workflow and agent

<output>✅ **Created:** {planning_artifacts}/bmm-workflow-status.yaml

**Next:** {{next_workflow_name}}
**Agent:** {{next_agent}}
**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

{{#if next_agent not in [analyst, pm]}}
💡 Start new chat with **{{next_agent}}** agent first.
{{/if}}

To check progress: /bmad:bmm:workflows:workflow-status

Happy building! 🚀</output>
</check>



</workflow>
