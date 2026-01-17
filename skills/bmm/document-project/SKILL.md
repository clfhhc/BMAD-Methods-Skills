---
name: document-project
description: Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development
---

# document-project

## Overview
Analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for AI-assisted development

## When to Use
This workflow can be run standalone and is designed for: analyzes and documents brownfield projects by scanning codebase, architecture, and patterns to create comprehensive reference documentation for ai-assisted development

## Instructions
# Document Project Workflow Router

<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: ../../bmm/document-project/SKILL.md</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<critical>This router determines workflow mode and delegates to specialized sub-workflows</critical>

## Step 1: Validate workflow and get project info

<invoke-workflow path="../../bmm/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>{{suggestion}}</output>
  <output>Note: Documentation workflow can run standalone. Continuing without progress tracking.</output>
  **Action:** Set standalone_mode = true
  **Action:** Set status_file_found = false
</check>

<check if="status_exists == true">
  **Action:** Store {{status_file_path}} for later updates
  **Action:** Set status_file_found = true

  <!-- Extract brownfield/greenfield from status data -->
  <check if="field_type == 'greenfield'">
    <output>Note: This is a greenfield project. Documentation workflow is typically for brownfield projects.</output>
    **Ask:** Continue anyway to document planning artifacts? (y/n)
    <check if="n">
      **Action:** Exit workflow
    </check>
  </check>

  <!-- Now validate sequencing -->
  <invoke-workflow path="../../bmm/workflow-status">
    <param>mode: validate</param>
    <param>calling_workflow: document-project</param>
  </invoke-workflow>

  <check if="warning != ''">
    <output>{{warning}}</output>
    <output>Note: This may be auto-invoked by prd for brownfield documentation.</output>
    **Ask:** Continue with documentation? (y/n)
    <check if="n">
      <output>{{suggestion}}</output>
      **Action:** Exit workflow
    </check>
  </check>
</check>



## Step 2: Check for resumability and determine workflow mode
<critical>SMART LOADING STRATEGY: Check state file FIRST before loading any CSV files</critical>

**Action:** Check for existing state file at: {output_folder}/project-scan-report.json

<check if="project-scan-report.json exists">
  **Action:** Read state file and extract: timestamps, mode, scan_level, current_step, completed_steps, project_classification
  **Action:** Extract cached project_type_id(s) from state file if present
  **Action:** Calculate age of state file (current time - last_updated)

**Ask:** I found an in-progress workflow state from {{last_updated}}.

**Current Progress:**

- Mode: {{mode}}
- Scan Level: {{scan_level}}
- Completed Steps: {{completed_steps_count}}/{{total_steps}}
- Last Step: {{current_step}}
- Project Type(s): {{cached_project_types}}

Would you like to:

1. **Resume from where we left off** - Continue from step {{current_step}}
2. **Start fresh** - Archive old state and begin new scan
3. **Cancel** - Exit without changes

Your choice [1/2/3]:

  <check if="user selects 1">
    **Action:** Set resume_mode = true
    **Action:** Set workflow_mode = {{mode}}
    **Action:** Load findings summaries from state file
    **Action:** Load cached project_type_id(s) from state file

    <critical>CONDITIONAL CSV LOADING FOR RESUME:</critical>
    **Action:** For each cached project_type_id, load ONLY the corresponding row from: {documentation_requirements_csv}
    **Action:** Skip loading project-types.csv and architecture_registry.csv (not needed on resume)
    **Action:** Store loaded doc requirements for use in remaining steps

    **Action:** Display: "Resuming {{workflow_mode}} from {{current_step}} with cached project type(s): {{cached_project_types}}"

    <check if="workflow_mode == deep_dive">
      **Action:** Load and execute: {installed_path}/workflows/deep-dive-instructions.md with resume context
    </check>

    <check if="workflow_mode == initial_scan OR workflow_mode == full_rescan">
      **Action:** Load and execute: {installed_path}/workflows/full-scan-instructions.md with resume context
    </check>

  </check>

  <check if="user selects 2">
    **Action:** Create archive directory: {output_folder}/.archive/
    **Action:** Move old state file to: {output_folder}/.archive/project-scan-report-{{timestamp}}.json
    **Action:** Set resume_mode = false
    **Action:** Continue to Step 0.5
  </check>

  <check if="user selects 3">
    **Action:** Display: "Exiting workflow without changes."
    **Action:** Exit workflow
  </check>

  <check if="state file age >= 24 hours">
    **Action:** Display: "Found old state file (>24 hours). Starting fresh scan."
    **Action:** Archive old state file to: {output_folder}/.archive/project-scan-report-{{timestamp}}.json
    **Action:** Set resume_mode = false
    **Action:** Continue to Step 0.5
  </check>



<step n="3" goal="Check for existing documentation and determine workflow mode" if="resume_mode == false">
**Action:** Check if {output_folder}/index.md exists

<check if="index.md exists">
  **Action:** Read existing index.md to extract metadata (date, project structure, parts count)
  **Action:** Store as {{existing_doc_date}}, {{existing_structure}}

**Ask:** I found existing documentation generated on {{existing_doc_date}}.

What would you like to do?

1. **Re-scan entire project** - Update all documentation with latest changes
2. **Deep-dive into specific area** - Generate detailed documentation for a particular feature/module/folder
3. **Cancel** - Keep existing documentation as-is

Your choice [1/2/3]:

  <check if="user selects 1">
    **Action:** Set workflow_mode = "full_rescan"
    **Action:** Display: "Starting full project rescan..."
    **Action:** Load and execute: {installed_path}/workflows/full-scan-instructions.md
    **Action:** After sub-workflow completes, continue to Step 4
  </check>

  <check if="user selects 2">
    **Action:** Set workflow_mode = "deep_dive"
    **Action:** Set scan_level = "exhaustive"
    **Action:** Display: "Starting deep-dive documentation mode..."
    **Action:** Load and execute: {installed_path}/workflows/deep-dive-instructions.md
    **Action:** After sub-workflow completes, continue to Step 4
  </check>

  <check if="user selects 3">
    **Action:** Display message: "Keeping existing documentation. Exiting workflow."
    **Action:** Exit workflow
  </check>
</check>

<check if="index.md does not exist">
  **Action:** Set workflow_mode = "initial_scan"
  **Action:** Display: "No existing documentation found. Starting initial project scan..."
  **Action:** Load and execute: {installed_path}/workflows/full-scan-instructions.md
  **Action:** After sub-workflow completes, continue to Step 4
</check>



## Step 4: Update status and complete

<check if="status_file_found == true">
  <invoke-workflow path="../../bmm/workflow-status">
    <param>mode: update</param>
    <param>action: complete_workflow</param>
    <param>workflow_name: document-project</param>
  </invoke-workflow>

  <check if="success == true">
    <output>Status updated!</output>
  </check>
</check>

<output>**✅ Document Project Workflow Complete, {user_name}!**

**Documentation Generated:**

- Mode: {{workflow_mode}}
- Scan Level: {{scan_level}}
- Output: {output_folder}/index.md and related files

{{#if status_file_found}}
**Status Updated:**

- Progress tracking updated

**Next Steps:**

- **Next required:** {{next_workflow}} ({{next_agent}} agent)

Check status anytime with: `workflow-status`
{{else}}
**Next Steps:**
Since no workflow is in progress:

- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>



</workflow>


## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Document Project Workflow - Validation Checklist
## Scan Level and Resumability
  ```