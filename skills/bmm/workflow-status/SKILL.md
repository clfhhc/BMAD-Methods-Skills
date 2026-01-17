---
name: workflow-status
description: Lightweight status checker - answers "what should I do now?" for any agent. Reads YAML status file for workflow tracking. Use workflow-init for new projects.
---

# workflow-status

## Overview
Lightweight status checker - answers "what should I do now?" for any agent. Reads YAML status file for workflow tracking. Use workflow-init for new projects.

## When to Use
This workflow can be run standalone and is designed for: lightweight status checker - answers "what should i do now?" for any agent. reads yaml status file for workflow tracking. use workflow-init for new projects.

## Instructions
# Workflow Status Check - Multi-Mode Service

<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: ../../bmm/workflow-status/SKILL.md</critical>
<critical>This workflow operates in multiple modes: interactive (default), validate, data, init-check, update</critical>
<critical>Other workflows can call this as a service to avoid duplicating status logic</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>

<workflow>

## Step 0: Determine execution mode
  **Action:** Check for {{mode}} parameter passed by calling workflow
  **Action:** Default mode = "interactive" if not specified

  <check if="mode == interactive">
    **Action:** Continue to Step 1 for normal status check flow
  </check>

  <check if="mode == validate">
    **Action:** Jump to Step 10 for workflow validation service
  </check>

  <check if="mode == data">
    **Action:** Jump to Step 20 for data extraction service
  </check>

  <check if="mode == init-check">
    **Action:** Jump to Step 30 for simple init check
  </check>

  <check if="mode == update">
    **Action:** Jump to Step 40 for status update service
  </check>


## Step 1: Check for status file
**Action:** Search {planning_artifacts}/ for file: bmm-workflow-status.yaml

<check if="no status file found">
  <output>No workflow status found.</output>
  **Ask:** Would you like to run Workflow Init now? (y/n)

  <check if="response == y OR response == yes">
    **Action:** Launching workflow-init to set up your project tracking...
    <invoke-workflow path="../../bmm/workflow-status/init/workflow.yaml"></invoke-workflow>
    **Action:** Exit workflow and let workflow-init take over
  </check>

  <check if="else">
    <output>No workflow status file. Run workflow-init when ready to enable progress tracking.</output>
    **Action:** Exit workflow
  </check>
</check>

<check if="status file found">
  **Action:** Continue to step 2
</check>


## Step 2: Read and parse status
**Action:** Read bmm-workflow-status.yaml
**Action:** Parse YAML file and extract metadata from comments and fields:

Parse these fields from YAML comments and metadata:

- project (from YAML field)
- project_type (from YAML field)
- project_level (from YAML field)
- field_type (from YAML field)
- workflow_path (from YAML field)

**Action:** Parse workflow_status section:

- Extract all workflow entries with their statuses
- Identify completed workflows (status = file path)
- Identify pending workflows (status = required/optional/recommended/conditional)
- Identify skipped workflows (status = skipped)

**Action:** Determine current state:

- Find first workflow with status != file path and != skipped
- This is the NEXT workflow to work on
- Look up agent and command from workflow path file
  

## Step 3: Display current status and options
**Action:** Load workflow path file based on workflow_path field
**Action:** Identify current phase from next workflow to be done
**Action:** Build list of completed, pending, and optional workflows
**Action:** For each workflow, look up its agent from the path file

<output>
## 📊 Current Status

**Project:** {{project}} (Level {{project_level}} {{project_type}})

**Path:** {{workflow_path}}

**Progress:**

{{#each phases}}
{{phase_name}}:
{{#each workflows_in_phase}}

- {{workflow_name}} ({{agent}}): {{status_display}}
  {{/each}}
  {{/each}}

## 🎯 Next Steps

**Next Workflow:** {{next_workflow_name}}

**Agent:** {{next_agent}}

**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

{{#if optional_workflows_available}}
**Optional Workflows Available:**
{{#each optional_workflows}}

- {{workflow_name}} ({{agent}}) - {{status}}
  {{/each}}
  {{/if}}

**Tip:** For guardrail tests, run TEA `*automate` after `dev-story`. If you lose context, TEA workflows resume from artifacts in `{{output_folder}}`.
  </output>
  

## Step 4: Offer actions
**Ask:** What would you like to do?

1. **Start next workflow** - {{next_workflow_name}} ({{next_agent}})
   {{#if optional_workflows_available}}
2. **Run optional workflow** - Choose from available options
   {{/if}}
3. **View full status YAML** - See complete status file
4. **Update workflow status** - Mark a workflow as completed or skipped
5. **Exit** - Return to agent

Your choice:

**Action:** Handle user selection based on available options

<check if="choice == 1">
  <output>Ready to run {{next_workflow_name}}!

**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

**Agent:** Load {{next_agent}} agent first

{{#if next_agent !== current_agent}}
Tip: Start a new chat and load the {{next_agent}} agent before running this workflow.
{{/if}}
</output>
</check>

<check if="choice == 2 AND optional_workflows_available">
  **Ask:** Which optional workflow?
{{#each optional_workflows numbered}}
{{number}}. {{workflow_name}} ({{agent}})
{{/each}}

Your choice:
**Action:** Display selected workflow command and agent
</check>

<check if="choice == 3">
  **Action:** Display complete bmm-workflow-status.yaml file contents
</check>

<check if="choice == 4">
  **Ask:** What would you like to update?

1. Mark a workflow as **completed** (provide file path)
2. Mark a workflow as **skipped**

Your choice:

  <check if="update_choice == 1">
    **Ask:** Which workflow? (Enter workflow ID like 'prd' or 'create-architecture')
    **Ask:** File path created? (e.g., docs/prd.md)
    <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
    **Action:** Update workflow_status in YAML file: {{workflow_id}}: {{file_path}}
    **Action:** Save updated YAML file preserving ALL structure and comments
    <output>✅ Updated {{workflow_id}} to completed: {{file_path}}</output>
  </check>

  <check if="update_choice == 2">
    **Ask:** Which workflow to skip? (Enter workflow ID)
    **Action:** Update workflow_status in YAML file: {{workflow_id}}: skipped
    **Action:** Save updated YAML file
    <output>✅ Marked {{workflow_id}} as skipped</output>
  </check>
</check>


<!-- ============================================= -->
<!-- SERVICE MODES - Called by other workflows -->
<!-- ============================================= -->

## Step 10: Validate mode - Check if calling workflow should proceed
**Action:** Read {planning_artifacts}/bmm-workflow-status.yaml if exists

<check if="status file not found">
  **Template Output:** status_exists = false
  **Template Output:** should_proceed = true
  **Template Output:** warning = "No status file found. Running without progress tracking."
  **Template Output:** suggestion = "Consider running workflow-init first for progress tracking"
  **Action:** Return to calling workflow
</check>

<check if="status file found">
  **Action:** Parse YAML file to extract project metadata and workflow_status
  **Action:** Load workflow path file from workflow_path field
  **Action:** Find first non-completed workflow in workflow_status (next workflow)
  **Action:** Check if {{calling_workflow}} matches next workflow or is in the workflow list

**Template Output:** status_exists = true
**Template Output:** project_level = {{project_level}}
**Template Output:** project_type = {{project_type}}
**Template Output:** field_type = {{field_type}}
**Template Output:** next_workflow = {{next_workflow_id}}

  <check if="calling_workflow == next_workflow">
    **Template Output:** should_proceed = true
    **Template Output:** warning = ""
    **Template Output:** suggestion = "Proceeding with planned next step"
  </check>

  <check if="calling_workflow in workflow_status list">
    **Action:** Check the status of calling_workflow in YAML

    <check if="status is file path">
      **Template Output:** should_proceed = true
      **Template Output:** warning = "⚠️ Workflow already completed: {{calling_workflow}}"
      **Template Output:** suggestion = "This workflow was already completed. Re-running will overwrite: {{status}}"
    </check>

    <check if="status is optional/recommended">
      **Template Output:** should_proceed = true
      **Template Output:** warning = "Running optional workflow {{calling_workflow}}"
      **Template Output:** suggestion = "This is optional. Expected next: {{next_workflow}}"
    </check>

    <check if="status is required but not next">
      **Template Output:** should_proceed = true
      **Template Output:** warning = "⚠️ Out of sequence: Expected {{next_workflow}}, running {{calling_workflow}}"
      **Template Output:** suggestion = "Consider running {{next_workflow}} instead, or continue if intentional"
    </check>

  </check>

  <check if="calling_workflow NOT in workflow_status list">
    **Template Output:** should_proceed = true
    **Template Output:** warning = "⚠️ Unknown workflow: {{calling_workflow}} not in workflow path"
    **Template Output:** suggestion = "This workflow is not part of the defined path for this project"
  </check>

**Template Output:** status_file_path = {{path to bmm-workflow-status.yaml}}
</check>

**Action:** Return control to calling workflow with all template outputs


## Step 20: Data mode - Extract specific information
**Action:** Read {planning_artifacts}/bmm-workflow-status.yaml if exists

<check if="status file not found">
  **Template Output:** status_exists = false
  **Template Output:** error = "No status file to extract data from"
  **Action:** Return to calling workflow
</check>

<check if="status file found">
  **Action:** Parse YAML file completely
  **Template Output:** status_exists = true

  <check if="data_request == project_config">
    **Template Output:** project_name = {{project}}
    **Template Output:** project_type = {{project_type}}
    **Template Output:** project_level = {{project_level}}
    **Template Output:** field_type = {{field_type}}
    **Template Output:** workflow_path = {{workflow_path}}
  </check>

  <check if="data_request == workflow_status">
    **Action:** Parse workflow_status section and return all workflow: status pairs
    **Template Output:** workflow_status = {{workflow_status_object}}
    **Action:** Calculate completion stats:
    **Template Output:** total_workflows = {{count all workflows}}
    **Template Output:** completed_workflows = {{count file path statuses}}
    **Template Output:** pending_workflows = {{count required/optional/etc}}
    **Template Output:** skipped_workflows = {{count skipped}}
  </check>

  <check if="data_request == all">
    **Action:** Return all parsed fields as template outputs
    **Template Output:** project = {{project}}
    **Template Output:** project_type = {{project_type}}
    **Template Output:** project_level = {{project_level}}
    **Template Output:** field_type = {{field_type}}
    **Template Output:** workflow_path = {{workflow_path}}
    **Template Output:** workflow_status = {{workflow_status_object}}
    **Template Output:** generated = {{generated}}
  </check>

**Template Output:** status_file_path = {{path to bmm-workflow-status.yaml}}
</check>

**Action:** Return control to calling workflow with requested data


## Step 30: Init-check mode - Simple existence check
**Action:** Check if {planning_artifacts}/bmm-workflow-status.yaml exists

<check if="exists">
  **Template Output:** status_exists = true
  **Template Output:** suggestion = "Status file found. Ready to proceed."
</check>

<check if="not exists">
  **Template Output:** status_exists = false
  **Template Output:** suggestion = "No status file. Run workflow-init to create one (optional for progress tracking)"
</check>

**Action:** Return immediately to calling workflow


## Step 40: Update mode - Centralized status file updates
**Action:** Read {planning_artifacts}/bmm-workflow-status.yaml

<check if="status file not found">
  **Template Output:** success = false
  **Template Output:** error = "No status file found. Cannot update."
  **Action:** Return to calling workflow
</check>

<check if="status file found">
  **Action:** Parse YAML file completely
  **Action:** Load workflow path file from workflow_path field
  **Action:** Check {{action}} parameter to determine update type

  <!-- ============================================= -->
  <!-- ACTION: complete_workflow -->
  <!-- ============================================= -->
  <check if="action == complete_workflow">
    **Action:** Get {{workflow_id}} parameter (required)
    **Action:** Get {{default_output_file}} parameter (required - path to created file)

    <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
    **Action:** Update workflow status in YAML:
    - In workflow_status section, update: {{workflow_id}}: {{default_output_file}}

    **Action:** Find {{workflow_id}} in loaded path YAML
    **Action:** Determine next workflow from path sequence
    **Action:** Find first workflow in workflow_status with status != file path and != skipped

    **Action:** Save updated YAML file preserving ALL structure and comments

    **Template Output:** success = true
    **Template Output:** next_workflow = {{determined next workflow}}
    **Template Output:** next_agent = {{determined next agent from path file}}
    **Template Output:** completed_workflow = {{workflow_id}}
    **Template Output:** default_output_file = {{default_output_file}}

  </check>

  <!-- ============================================= -->
  <!-- ACTION: skip_workflow -->
  <!-- ============================================= -->
  <check if="action == skip_workflow">
    **Action:** Get {{workflow_id}} parameter (required)

    **Action:** Update workflow status in YAML:
    - In workflow_status section, update: {{workflow_id}}: skipped

    **Action:** Save updated YAML file

    **Template Output:** success = true
    **Template Output:** skipped_workflow = {{workflow_id}}

  </check>

  <!-- ============================================= -->
  <!-- Unknown action -->
  <!-- ============================================= -->
  <check if="action not recognized">
    **Template Output:** success = false
    **Template Output:** error = "Unknown action: {{action}}. Valid actions: complete_workflow, skip_workflow"
  </check>

</check>

**Action:** Return control to calling workflow with template outputs


</workflow>
