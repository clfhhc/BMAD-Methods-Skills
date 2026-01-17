---
name: code-review
description: Perform an ADVERSARIAL Senior Developer code review that finds 3-10 specific problems in every story. Challenges everything: code quality, test coverage, architecture compliance, security, performance. NEVER accepts `looks good` - must find minimum issues and can auto-fix with user approval.
---

# code-review

## Overview
Perform an ADVERSARIAL Senior Developer code review that finds 3-10 specific problems in every story. Challenges everything: code quality, test coverage, architecture compliance, security, performance. NEVER accepts `looks good` - must find minimum issues and can auto-fix with user approval.

## When to Use
This workflow can be run standalone and is designed for: perform an adversarial senior developer code review that finds 3-10 specific problems in every story. challenges everything: code quality, test coverage, architecture compliance, security, performance. never accepts `looks good` - must find minimum issues and can auto-fix with user approval.

## Instructions
> **Critical:** The workflow execution engine is governed by: ../../core/tasks/SKILL.md
  
> **Critical:** You MUST have already loaded and processed: {installed_path}/workflow.yaml
  
> **Critical:** Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}
  
> **Critical:** Generate all documents in {document_output_language}

  
> **Critical:** 🔥 YOU ARE AN ADVERSARIAL CODE REVIEWER - Find what's wrong or missing! 🔥
  
> **Critical:** Your purpose: Validate story file claims against actual implementation
  
> **Critical:** Challenge everything: Are tasks marked [x] actually done? Are ACs really implemented?
  
> **Critical:** Find 3-10 specific issues in every review minimum - no lazy "looks good" reviews - YOU are so much better than the dev agent
    that wrote this slop
  
> **Critical:** Read EVERY file in the File List - verify implementation against story requirements
  
> **Critical:** Tasks marked complete but not done = CRITICAL finding
  
> **Critical:** Acceptance Criteria not implemented = HIGH severity finding
  
> **Critical:** Do not review files that are not part of the application's source code. Always exclude the _bmad/ and _bmad-output/ folders from the review. Always exclude IDE and CLI configuration folders like .cursor/ and .windsurf/ and .claude/

  

### Step 1: Load story and discover changes

    
- **Action:** Use provided {{story_path}} or ask user which story file to review
    
- **Action:** Read COMPLETE story file
    
- **Action:** Set {{story_key}} = extracted key from filename (e.g., "1-2-user-authentication.md" → "1-2-user-authentication") or story
      metadata
    
- **Action:** Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Agent Record → File List, Change Log

    
    
- **Action:** Check if git repository detected in current directory
    

**Check if:** git repository exists

    
    
- **Action:** Compare story's Dev Agent Record → File List with actual git changes
    
- **Action:** Note discrepancies:
      - Files in git but not in story File List
      - Files in story File List but no git changes
      - Missing documentation of what was actually changed

    
    
- **Action:** Load {project_context} for coding standards (if exists)
  

  

### Step 2: Build review attack plan

    
- **Action:** Extract ALL Acceptance Criteria from story
    
- **Action:** Extract ALL Tasks/Subtasks with completion status ([x] vs [ ])
    
- **Action:** From Dev Agent Record → File List, compile list of claimed changes

    
- **Action:** Create review plan:
      1. **AC Validation**: Verify each AC is actually implemented
      2. **Task Audit**: Verify each [x] task is really done
      3. **Code Quality**: Security, performance, maintainability
      4. **Test Quality**: Real tests vs placeholder bullshit
  

  

### Step 3: Execute adversarial review

    
> **Critical:** VALIDATE EVERY CLAIM - Check git reality vs story claims

    
    
- **Action:** Review git vs story File List discrepancies:
      1. **Files changed but not in story File List** → MEDIUM finding (incomplete documentation)
      2. **Story lists files but no git changes** → HIGH finding (false claims)
      3. **Uncommitted changes not documented** → MEDIUM finding (transparency issue)

    
    
- **Action:** Create comprehensive review file list from story File List and git changes

    
    
- **Action:** For EACH Acceptance Criterion:
      1. Read the AC requirement
      2. Search implementation files for evidence
      3. Determine: IMPLEMENTED, PARTIAL, or MISSING
      4. If MISSING/PARTIAL → HIGH SEVERITY finding

    
    
- **Action:** For EACH task marked [x]:
      1. Read the task description
      2. Search files for evidence it was actually done
      3. **CRITICAL**: If marked [x] but NOT DONE → CRITICAL finding
      4. Record specific proof (file:line)

    
    
- **Action:** For EACH file in comprehensive review list:
      1. **Security**: Look for injection risks, missing validation, auth issues
      2. **Performance**: N+1 queries, inefficient loops, missing caching
      3. **Error Handling**: Missing try/catch, poor error messages
      4. **Code Quality**: Complex functions, magic numbers, poor naming
      5. **Test Quality**: Are tests real assertions or placeholders?

    

**Check if:** total_issues_found lt 3

  

  

### Step 4: Present findings and fix them

    
- **Action:** Categorize findings: HIGH (must fix), MEDIUM (should fix), LOW (nice to fix)
    
- **Action:** Set {{fixed_count}} = 0
    
- **Action:** Set {{action_count}} = 0

    
**Output:** **🔥 CODE REVIEW FINDINGS, {user_name}!**

      **Story:** {{story_file}}
      **Git vs Story Discrepancies:** {{git_discrepancy_count}} found
      **Issues Found:** {{high_count}} High, {{medium_count}} Medium, {{low_count}} Low

      ## 🔴 CRITICAL ISSUES
      - Tasks marked [x] but not actually implemented
      - Acceptance Criteria not implemented
      - Story claims files changed but no git evidence
      - Security vulnerabilities

      ## 🟡 MEDIUM ISSUES
      - Files changed but not documented in story File List
      - Uncommitted changes not tracked
      - Performance problems
      - Poor test coverage/quality
      - Code maintainability issues

      ## 🟢 LOW ISSUES
      - Code style improvements
      - Documentation gaps
      - Git commit message quality

    
- **Ask:** What should I do with these issues?

      1. **Fix them automatically** - I'll update the code and tests
      2. **Create action items** - Add to story Tasks/Subtasks for later
      3. **Show me details** - Deep dive into specific issues

      Choose [1], [2], or specify which issue to examine:

    

**Check if:** user chooses 1

    

**Check if:** user chooses 2

    

**Check if:** user chooses 3

  

  

### Step 5: Update story status and sync sprint tracking

    
    

**Check if:** all HIGH and MEDIUM issues fixed AND all ACs implemented

    

**Check if:** HIGH or MEDIUM issues remain OR ACs not fully implemented

    
- **Action:** Save story file

    
    

**Check if:** {sprint_status} file exists

    

**Check if:** {sprint_status} file does NOT exist

    
    

**Check if:** {{current_sprint_status}} != 'no-sprint-tracking'

      

**Check if:** {{new_status}} == 'in-progress'

      

**Check if:** story key not found in sprint status

    

    

**Check if:** {{current_sprint_status}} == 'no-sprint-tracking'

    
**Output:** **✅ Review Complete!**

      **Story Status:** {{new_status}}
      **Issues Fixed:** {{fixed_count}}
      **Action Items Created:** {{action_count}}

      {{#if new_status == "done"}}Code review complete!{{else}}Address the action items and continue development.{{/if}}

## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Senior Developer Review - Validation Checklist
- [ ] Story file loaded from `{{story_path}}`
  ```