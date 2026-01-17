---
name: correct-course
description: Navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation
---

# correct-course

## Overview
Navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation

## When to Use
This workflow can be run standalone and is designed for: navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation

## Instructions
# Correct Course - Sprint Change Management Instructions

<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: ../../bmm/correct-course/SKILL.md</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>DOCUMENT OUTPUT: Updated epics, stories, or PRD sections. Clear, actionable changes. User skill level ({user_skill_level}) affects conversation style ONLY, not document updates.</critical>

<workflow>

## Step 1: Initialize Change Navigation
  **Action:** Confirm change trigger and gather user description of the issue
  **Action:** Ask: "What specific issue or change has been identified that requires navigation?"
  **Action:** Verify access to required project documents:
    - PRD (Product Requirements Document)
    - Current Epics and Stories
    - Architecture documentation
    - UI/UX specifications
  **Action:** Ask user for mode preference:
    - **Incremental** (recommended): Refine each edit collaboratively
    - **Batch**: Present all changes at once for review
  **Action:** Store mode selection for use throughout workflow

<action if="change trigger is unclear">HALT: "Cannot navigate change without clear understanding of the triggering issue. Please provide specific details about what needs to change and why."</action>

<action if="core documents are unavailable">HALT: "Need access to project documents (PRD, Epics, Architecture, UI/UX) to assess change impact. Please ensure these documents are accessible."</action>


<step n="0.5" goal="Discover and load project documents">
  <invoke-protocol name="discover_inputs" />
  <note>After discovery, these content variables are available: {prd_content}, {epics_content}, {architecture_content}, {ux_design_content}, {tech_spec_content}, {document_project_content}</note>


## Step 2: Execute Change Analysis Checklist
  **Action:** Load and execute the systematic analysis from: {checklist}
  **Action:** Work through each checklist section interactively with the user
  **Action:** Record status for each checklist item:
    - [x] Done - Item completed successfully
    - [N/A] Skip - Item not applicable to this change
    - [!] Action-needed - Item requires attention or follow-up
  **Action:** Maintain running notes of findings and impacts discovered
  **Action:** Present checklist progress after each major section

<action if="checklist cannot be completed">Identify blocking issues and work with user to resolve before continuing</action>


## Step 3: Draft Specific Change Proposals
**Action:** Based on checklist findings, create explicit edit proposals for each identified artifact

**Action:** For Story changes:

- Show old → new text format
- Include story ID and section being modified
- Provide rationale for each change
- Example format:

  ```
  Story: [STORY-123] User Authentication
  Section: Acceptance Criteria

  OLD:
  - User can log in with email/password

  NEW:
  - User can log in with email/password
  - User can enable 2FA via authenticator app

  Rationale: Security requirement identified during implementation
  ```

**Action:** For PRD modifications:

- Specify exact sections to update
- Show current content and proposed changes
- Explain impact on MVP scope and requirements

**Action:** For Architecture changes:

- Identify affected components, patterns, or technology choices
- Describe diagram updates needed
- Note any ripple effects on other components

**Action:** For UI/UX specification updates:

- Reference specific screens or components
- Show wireframe or flow changes needed
- Connect changes to user experience impact

<check if="mode is Incremental">
  **Action:** Present each edit proposal individually
  **Ask:** Review and refine this change? Options: Approve [a], Edit [e], Skip [s]
  **Action:** Iterate on each proposal based on user feedback
</check>

<action if="mode is Batch">Collect all edit proposals and present together at end of step</action>



## Step 4: Generate Sprint Change Proposal
**Action:** Compile comprehensive Sprint Change Proposal document with following sections:

**Action:** Section 1: Issue Summary

- Clear problem statement describing what triggered the change
- Context about when/how the issue was discovered
- Evidence or examples demonstrating the issue

**Action:** Section 2: Impact Analysis

- Epic Impact: Which epics are affected and how
- Story Impact: Current and future stories requiring changes
- Artifact Conflicts: PRD, Architecture, UI/UX documents needing updates
- Technical Impact: Code, infrastructure, or deployment implications

**Action:** Section 3: Recommended Approach

- Present chosen path forward from checklist evaluation:
  - Direct Adjustment: Modify/add stories within existing plan
  - Potential Rollback: Revert completed work to simplify resolution
  - MVP Review: Reduce scope or modify goals
- Provide clear rationale for recommendation
- Include effort estimate, risk assessment, and timeline impact

**Action:** Section 4: Detailed Change Proposals

- Include all refined edit proposals from Step 3
- Group by artifact type (Stories, PRD, Architecture, UI/UX)
- Ensure each change includes before/after and justification

**Action:** Section 5: Implementation Handoff

- Categorize change scope:
  - Minor: Direct implementation by dev team
  - Moderate: Backlog reorganization needed (PO/SM)
  - Major: Fundamental replan required (PM/Architect)
- Specify handoff recipients and their responsibilities
- Define success criteria for implementation

**Action:** Present complete Sprint Change Proposal to user
**Action:** Write Sprint Change Proposal document to {default_output_file}
**Ask:** Review complete proposal. Continue [c] or Edit [e]?


## Step 5: Finalize and Route for Implementation
**Action:** Get explicit user approval for complete proposal
**Ask:** Do you approve this Sprint Change Proposal for implementation? (yes/no/revise)

<check if="no or revise">
  **Action:** Gather specific feedback on what needs adjustment
  **Action:** Return to appropriate step to address concerns
  <goto step="3">If changes needed to edit proposals</goto>
  <goto step="4">If changes needed to overall proposal structure</goto>

</check>

<check if="yes the proposal is approved by the user">
  **Action:** Finalize Sprint Change Proposal document
  **Action:** Determine change scope classification:

- **Minor**: Can be implemented directly by development team
- **Moderate**: Requires backlog reorganization and PO/SM coordination
- **Major**: Needs fundamental replan with PM/Architect involvement

**Action:** Provide appropriate handoff based on scope:

</check>

<check if="Minor scope">
  **Action:** Route to: Development team for direct implementation
  **Action:** Deliverables: Finalized edit proposals and implementation tasks
</check>

<check if="Moderate scope">
  **Action:** Route to: Product Owner / Scrum Master agents
  **Action:** Deliverables: Sprint Change Proposal + backlog reorganization plan
</check>

<check if="Major scope">
  **Action:** Route to: Product Manager / Solution Architect
  **Action:** Deliverables: Complete Sprint Change Proposal + escalation notice

**Action:** Confirm handoff completion and next steps with user
**Action:** Document handoff in workflow execution log
</check>



## Step 6: Workflow Completion
**Action:** Summarize workflow execution:
  - Issue addressed: {{change_trigger}}
  - Change scope: {{scope_classification}}
  - Artifacts modified: {{list_of_artifacts}}
  - Routed to: {{handoff_recipients}}

**Action:** Confirm all deliverables produced:

- Sprint Change Proposal document
- Specific edit proposals with before/after
- Implementation handoff plan

**Action:** Report workflow completion to user with personalized message: "✅ Correct Course workflow complete, {user_name}!"
**Action:** Remind user of success criteria and next steps for implementation team


</workflow>


## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Change Navigation Checklist
<critical>This checklist is executed as part of: ../../bmm/correct-course/SKILL.md</critical>
  ```