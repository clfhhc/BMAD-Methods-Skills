---
name: sprint-status
description: Summarize sprint-status.yaml, surface risks, and route to the right implementation workflow.
---

# sprint-status

## Overview
Summarize sprint-status.yaml, surface risks, and route to the right implementation workflow.

## When to Use
This workflow can be run standalone and is designed for: summarize sprint-status.yaml, surface risks, and route to the right implementation workflow.

## Instructions
# Sprint Status - Multi-Mode Service

<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: ../../bmm/sprint-status/SKILL.md</critical>
<critical>Modes: interactive (default), validate, data</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES. Do NOT mention hours, days, weeks, or timelines.</critical>

<workflow>

## Step 0: Determine execution mode
  **Action:** Set mode = {{mode}} if provided by caller; otherwise mode = "interactive"

  <check if="mode == data">
    **Action:** Jump to Step 20
  </check>

  <check if="mode == validate">
    **Action:** Jump to Step 30
  </check>

  <check if="mode == interactive">
    **Action:** Continue to Step 1
  </check>


## Step 1: Locate sprint status file
  **Action:** Try {sprint_status_file}
  <check if="file not found">
    <output>❌ sprint-status.yaml not found.
Run `/bmad:bmm:workflows:sprint-planning` to generate it, then rerun sprint-status.</output>
    **Action:** Exit workflow
  </check>
  **Action:** Continue to Step 2


## Step 2: Read and parse sprint-status.yaml
  **Action:** Read the FULL file: {sprint_status_file}
  **Action:** Parse fields: generated, project, project_key, tracking_system, story_location
  **Action:** Parse development_status map. Classify keys:
  - Epics: keys starting with "epic-" (and not ending with "-retrospective")
  - Retrospectives: keys ending with "-retrospective"
  - Stories: everything else (e.g., 1-2-login-form)
  **Action:** Map legacy story status "drafted" → "ready-for-dev"
  **Action:** Count story statuses: backlog, ready-for-dev, in-progress, review, done
  **Action:** Map legacy epic status "contexted" → "in-progress"
  **Action:** Count epic statuses: backlog, in-progress, done
  **Action:** Count retrospective statuses: optional, done

**Action:** Validate all statuses against known values:

- Valid story statuses: backlog, ready-for-dev, in-progress, review, done, drafted (legacy)
- Valid epic statuses: backlog, in-progress, done, contexted (legacy)
- Valid retrospective statuses: optional, done

  <check if="any status is unrecognized">
    <output>
⚠️ **Unknown status detected:**
{{#each invalid_entries}}

- `{{key}}`: "{{status}}" (not recognized)
  {{/each}}

**Valid statuses:**

- Stories: backlog, ready-for-dev, in-progress, review, done
- Epics: backlog, in-progress, done
- Retrospectives: optional, done
  </output>
  **Ask:** How should these be corrected?
  {{#each invalid_entries}}
  {{@index}}. {{key}}: "{{status}}" → [select valid status]
  {{/each}}

Enter corrections (e.g., "1=in-progress, 2=backlog") or "skip" to continue without fixing:
<check if="user provided corrections">
**Action:** Update sprint-status.yaml with corrected values
**Action:** Re-parse the file with corrected statuses
</check>
</check>

**Action:** Detect risks:

- IF any story has status "review": suggest `/bmad:bmm:workflows:code-review`
- IF any story has status "in-progress" AND no stories have status "ready-for-dev": recommend staying focused on active story
- IF all epics have status "backlog" AND no stories have status "ready-for-dev": prompt `/bmad:bmm:workflows:create-story`
- IF `generated` timestamp is more than 7 days old: warn "sprint-status.yaml may be stale"
- IF any story key doesn't match an epic pattern (e.g., story "5-1-..." but no "epic-5"): warn "orphaned story detected"
- IF any epic has status in-progress but has no associated stories: warn "in-progress epic has no stories"
  

## Step 3: Select next action recommendation
  **Action:** Pick the next recommended workflow using priority:
  <note>When selecting "first" story: sort by epic number, then story number (e.g., 1-1 before 1-2 before 2-1)</note>
  1. If any story status == in-progress → recommend `dev-story` for the first in-progress story
  2. Else if any story status == review → recommend `code-review` for the first review story
  3. Else if any story status == ready-for-dev → recommend `dev-story`
  4. Else if any story status == backlog → recommend `create-story`
  5. Else if any retrospective status == optional → recommend `retrospective`
  6. Else → All implementation items done; suggest `workflow-status` to plan next phase
  **Action:** Store selected recommendation as: next_story_id, next_workflow_id, next_agent (SM/DEV as appropriate)


## Step 4: Display summary
  <output>
## 📊 Sprint Status

- Project: {{project}} ({{project_key}})
- Tracking: {{tracking_system}}
- Status file: {sprint_status_file}

**Stories:** backlog {{count_backlog}}, ready-for-dev {{count_ready}}, in-progress {{count_in_progress}}, review {{count_review}}, done {{count_done}}

**Epics:** backlog {{epic_backlog}}, in-progress {{epic_in_progress}}, done {{epic_done}}

**Next Recommendation:** /bmad:bmm:workflows:{{next_workflow_id}} ({{next_story_id}})

{{#if risks}}
**Risks:**
{{#each risks}}

- {{this}}
  {{/each}}
  {{/if}}

  </output>
  

## Step 5: Offer actions
  **Ask:** Pick an option:
1) Run recommended workflow now
2) Show all stories grouped by status
3) Show raw sprint-status.yaml
4) Exit
Choice:

  <check if="choice == 1">
    <output>Run `/bmad:bmm:workflows:{{next_workflow_id}}`.
If the command targets a story, set `story_key={{next_story_id}}` when prompted.</output>
  </check>

  <check if="choice == 2">
    <output>
### Stories by Status
- In Progress: {{stories_in_progress}}
- Review: {{stories_in_review}}
- Ready for Dev: {{stories_ready_for_dev}}
- Backlog: {{stories_backlog}}
- Done: {{stories_done}}
    </output>
  </check>

  <check if="choice == 3">
    **Action:** Display the full contents of {sprint_status_file}
  </check>

  <check if="choice == 4">
    **Action:** Exit workflow
  </check>


<!-- ========================= -->
<!-- Data mode for other flows -->
<!-- ========================= -->

## Step 20: Data mode output
  **Action:** Load and parse {sprint_status_file} same as Step 2
  **Action:** Compute recommendation same as Step 3
  **Template Output:** next_workflow_id = {{next_workflow_id}}
  **Template Output:** next_story_id = {{next_story_id}}
  **Template Output:** count_backlog = {{count_backlog}}
  **Template Output:** count_ready = {{count_ready}}
  **Template Output:** count_in_progress = {{count_in_progress}}
  **Template Output:** count_review = {{count_review}}
  **Template Output:** count_done = {{count_done}}
  **Template Output:** epic_backlog = {{epic_backlog}}
  **Template Output:** epic_in_progress = {{epic_in_progress}}
  **Template Output:** epic_done = {{epic_done}}
  **Template Output:** risks = {{risks}}
  **Action:** Return to caller


<!-- ========================= -->
<!-- Validate mode -->
<!-- ========================= -->

## Step 30: Validate sprint-status file
  **Action:** Check that {sprint_status_file} exists
  <check if="missing">
    **Template Output:** is_valid = false
    **Template Output:** error = "sprint-status.yaml missing"
    **Template Output:** suggestion = "Run sprint-planning to create it"
    **Action:** Return
  </check>

**Action:** Read and parse {sprint_status_file}

**Action:** Validate required metadata fields exist: generated, project, project_key, tracking_system, story_location
<check if="any required field missing">
**Template Output:** is_valid = false
**Template Output:** error = "Missing required field(s): {{missing_fields}}"
**Template Output:** suggestion = "Re-run sprint-planning or add missing fields manually"
**Action:** Return
</check>

**Action:** Verify development_status section exists with at least one entry
<check if="development_status missing or empty">
**Template Output:** is_valid = false
**Template Output:** error = "development_status missing or empty"
**Template Output:** suggestion = "Re-run sprint-planning or repair the file manually"
**Action:** Return
</check>

**Action:** Validate all status values against known valid statuses:

- Stories: backlog, ready-for-dev, in-progress, review, done (legacy: drafted)
- Epics: backlog, in-progress, done (legacy: contexted)
- Retrospectives: optional, done
  <check if="any invalid status found">
  **Template Output:** is_valid = false
  **Template Output:** error = "Invalid status values: {{invalid_entries}}"
  **Template Output:** suggestion = "Fix invalid statuses in sprint-status.yaml"
  **Action:** Return
  </check>

**Template Output:** is_valid = true
**Template Output:** message = "sprint-status.yaml valid: metadata complete, all statuses recognized"


</workflow>
