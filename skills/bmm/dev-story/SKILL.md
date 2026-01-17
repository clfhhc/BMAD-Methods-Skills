---
name: dev-story
description: Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria
---

# dev-story

## Overview
Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria

## When to Use
This workflow can be run standalone and is designed for: execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria

## Instructions
> **Critical:** The workflow execution engine is governed by: ../../core/tasks/SKILL.md
  
> **Critical:** You MUST have already loaded and processed: {installed_path}/workflow.yaml
  
> **Critical:** Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}
  
> **Critical:** Generate all documents in {document_output_language}
  
> **Critical:** Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List,
    Change Log, and Status
  
> **Critical:** Execute ALL steps in exact order; do NOT skip steps
  
> **Critical:** Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution
    until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) UNLESS a HALT condition is triggered or the USER gives
    other instruction.
  
> **Critical:** Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 6 decides completion.
  
> **Critical:** User skill level ({user_skill_level}) affects conversation style ONLY, not code updates.

  

### Step 1: Find next ready story and load it

    

**Check if:** {{story_path}} is provided

    
    

**Check if:** {{sprint_status}} file exists

        

**Check if:** user chooses '2'

        

**Check if:** user chooses '3'

        

**Check if:** user chooses '4'

        

**Check if:** user provides story file path

      
    

    
    

**Check if:** {{sprint_status}} file does NOT exist

        

**Check if:** user chooses '2'

        

**Check if:** user chooses '3'

      

      

**Check if:** ready-for-dev story found in files

    

    
- **Action:** Store the found story_key (e.g., "1-2-user-authentication") for later status updates
    
- **Action:** Find matching story file in {story_dir} using story_key pattern: {{story_key}}.md
    
- **Action:** Read COMPLETE story file from discovered path

    

    
- **Action:** Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status

    
- **Action:** Load comprehensive context from story file's Dev Notes section
    
- **Action:** Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications
    
- **Action:** Use enhanced story context to inform implementation decisions and approaches

    
- **Action:** Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks

    
      Completion sequence
    
    HALT: "Cannot develop story without access to story file"
    ASK user to clarify or HALT
  

  

### Step 2: Load project context and story information

    
> **Critical:** Load all available context to inform implementation

    
- **Action:** Load {project_context} for coding standards and project-wide patterns (if exists)
    
- **Action:** Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status
    
- **Action:** Load comprehensive context from story file's Dev Notes section
    
- **Action:** Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications
    
- **Action:** Use enhanced story context to inform implementation decisions and approaches
    
**Output:** ✅ **Context Loaded**
      Story and project context available for implementation
  

  

### Step 3: Detect review continuation and extract review context

    
> **Critical:** Determine if this is a fresh start or continuation after code review

    
- **Action:** Check if "Senior Developer Review (AI)" section exists in the story file
    
- **Action:** Check if "Review Follow-ups (AI)" subsection exists under Tasks/Subtasks

    

**Check if:** Senior Developer Review section exists

    

**Check if:** Senior Developer Review section does NOT exist

  

  

### Step 4: Mark story in-progress

    

**Check if:** {{sprint_status}} file exists

      

**Check if:** current status == 'in-progress'

      

**Check if:** current status is neither ready-for-dev nor in-progress

      
- **Action:** Store {{current_sprint_status}} for later use
    

    

**Check if:** {{sprint_status}} file does NOT exist

  

  

### Step 5: Implement task following red-green-refactor cycle

    
> **Critical:** FOLLOW THE STORY FILE TASKS/SUBTASKS SEQUENCE EXACTLY AS WRITTEN - NO DEVIATION

    
- **Action:** Review the current task/subtask from the story file - this is your authoritative implementation guide
    
- **Action:** Plan implementation following red-green-refactor cycle

    
    
- **Action:** Write FAILING tests first for the task/subtask functionality
    
- **Action:** Confirm tests fail before implementation - this validates test correctness

    
    
- **Action:** Implement MINIMAL code to make tests pass
    
- **Action:** Run tests to confirm they now pass
    
- **Action:** Handle error conditions and edge cases as specified in task/subtask

    
    
- **Action:** Improve code structure while keeping tests green
    
- **Action:** Ensure code follows architecture patterns and coding standards from Dev Notes

    
- **Action:** Document technical approach and decisions in Dev Agent Record → Implementation Plan

    HALT: "Additional dependencies need user approval"
    HALT and request guidance
    HALT: "Cannot proceed without necessary configuration files"

    
> **Critical:** NEVER implement anything not mapped to a specific task/subtask in the story file
    
> **Critical:** NEVER proceed to next task until current task/subtask is complete AND tests pass
    
> **Critical:** Execute continuously without pausing until all tasks/subtasks are complete or explicit HALT condition
    
> **Critical:** Do NOT propose to pause for review until Step 9 completion gates are satisfied
  

  

### Step 6: Author comprehensive tests

    
- **Action:** Create unit tests for business logic and core functionality introduced/changed by the task
    
- **Action:** Add integration tests for component interactions specified in story requirements
    
- **Action:** Include end-to-end tests for critical user flows when story requirements demand them
    
- **Action:** Cover edge cases and error handling scenarios identified in story Dev Notes
  

  

### Step 7: Run validations and tests

    
- **Action:** Determine how to run tests for this repo (infer test framework from project structure)
    
- **Action:** Run all existing tests to ensure no regressions
    
- **Action:** Run the new tests to verify implementation correctness
    
- **Action:** Run linting and code quality checks if configured in project
    
- **Action:** Validate implementation meets ALL story acceptance criteria; enforce quantitative thresholds explicitly
    STOP and fix before continuing - identify breaking changes immediately
    STOP and fix before continuing - ensure implementation correctness
  

  

### Step 8: Validate and mark task complete ONLY when fully done

    
> **Critical:** NEVER mark a task complete unless ALL conditions are met - NO LYING OR CHEATING

    
    
- **Action:** Verify ALL tests for this task/subtask ACTUALLY EXIST and PASS 100%
    
- **Action:** Confirm implementation matches EXACTLY what the task/subtask specifies - no extra features
    
- **Action:** Validate that ALL acceptance criteria related to this task are satisfied
    
- **Action:** Run full test suite to ensure NO regressions introduced

    
    

**Check if:** task is review follow-up (has [AI-Review] prefix)

    
    

**Check if:** ALL validation gates pass AND tests ACTUALLY exist and pass

    

**Check if:** ANY validation fails

    

**Check if:** review_continuation == true and {{resolved_review_items}} is not empty

    
- **Action:** Save the story file
    
- **Action:** Determine if more incomplete tasks remain
    
      Next task
    
    
      Completion
    
  

  

### Step 9: Story completion and mark for review

    
- **Action:** Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)
    
- **Action:** Run the full regression suite (do not skip)
    
- **Action:** Confirm File List includes every changed file
    
- **Action:** Execute enhanced definition-of-done validation
    
- **Action:** Update the story Status to: "review"

    
    
- **Action:** Validate definition-of-done checklist with essential requirements:
      - All tasks/subtasks marked complete with [x]
      - Implementation satisfies every Acceptance Criterion
      - Unit tests for core functionality added/updated
      - Integration tests for component interactions added when required
      - End-to-end tests for critical flows added when story demands them
      - All tests pass (no regressions, new tests successful)
      - Code quality checks pass (linting, static analysis if configured)
      - File List includes every new/modified/deleted file (relative paths)
      - Dev Agent Record contains implementation notes
      - Change Log includes summary of changes
      - Only permitted story sections were modified

    
    

**Check if:** {sprint_status} file exists AND {{current_sprint_status}} != 'no-sprint-tracking'

    

**Check if:** {sprint_status} file does NOT exist OR {{current_sprint_status}} == 'no-sprint-tracking'

    

**Check if:** story key not found in sprint status

    
    HALT - Complete remaining tasks before marking ready for review
    HALT - Fix regression issues before completing
    HALT - Update File List with all changed files
    HALT - Address DoD failures before completing
  

  

### Step 10: Completion communication and user support

    
- **Action:** Execute the enhanced definition-of-done checklist using the validation framework
    
- **Action:** Prepare a concise summary in Dev Agent Record → Completion Notes

    
- **Action:** Communicate to {user_name} that story implementation is complete and ready for review
    
- **Action:** Summarize key accomplishments: story ID, story key, title, key changes made, tests added, files modified
    
- **Action:** Provide the story file path and current status (now "review")

    
- **Action:** Based on {user_skill_level}, ask if user needs any explanations about:
      - What was implemented and how it works
      - Why certain technical decisions were made
      - How to test or verify the changes
      - Any patterns, libraries, or approaches used
      - Anything else they'd like clarified

    

**Check if:** user asks for explanations

    
- **Action:** Once explanations are complete (or user indicates no questions), suggest logical next steps
    
- **Action:** Recommended next steps (flexible based on project setup):
      - Review the implemented story and test the changes
      - Verify all acceptance criteria are met
      - Ensure deployment readiness if applicable
      - Run `code-review` workflow for peer review
      - Optional: Run TEA `*automate` to expand guardrail tests

    
**Output:** 💡 **Tip:** For best results, run `code-review` using a **different** LLM than the one that implemented this story.
    

**Check if:** {sprint_status} file exists

    
- **Action:** Remain flexible - allow user to choose their own path or ask for other assistance

## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  ---
title: 'Enhanced Dev Story Definition of Done Checklist'
validation-target: 'Story markdown ({{story_path}})'
  ```