---
name: create-story
description: Create the next user story from epics+stories with enhanced context analysis and direct ready-for-dev marking
---

# create-story

## Overview
Create the next user story from epics+stories with enhanced context analysis and direct ready-for-dev marking

## When to Use
This workflow can be run standalone and is designed for: create the next user story from epics+stories with enhanced context analysis and direct ready-for-dev marking

## Instructions
> **Critical:** The workflow execution engine is governed by: ../../core/tasks/SKILL.md
  
> **Critical:** You MUST have already loaded and processed: {installed_path}/workflow.yaml
  
> **Critical:** Communicate all responses in {communication_language} and generate all documents in {document_output_language}

  
> **Critical:** 🔥 CRITICAL MISSION: You are creating the ULTIMATE story context engine that prevents LLM developer mistakes, omissions or
    disasters! 🔥
  
> **Critical:** Your purpose is NOT to copy from epics - it's to create a comprehensive, optimized story file that gives the DEV agent
    EVERYTHING needed for flawless implementation
  
> **Critical:** COMMON LLM MISTAKES TO PREVENT: reinventing wheels, wrong libraries, wrong file locations, breaking regressions, ignoring UX,
    vague implementations, lying about completion, not learning from past work
  
> **Critical:** 🚨 EXHAUSTIVE ANALYSIS REQUIRED: You must thoroughly analyze ALL artifacts to extract critical context - do NOT be lazy or skim!
    This is the most important function in the entire development process!
  
> **Critical:** 🔬 UTILIZE SUBPROCESSES AND SUBAGENTS: Use research subagents, subprocesses or parallel processing if available to thoroughly
    analyze different artifacts simultaneously and thoroughly
  
> **Critical:** ❓ SAVE QUESTIONS: If you think of questions or clarifications during analysis, save them for the end after the complete story is
    written
  
> **Critical:** 🎯 ZERO USER INTERVENTION: Process should be fully automated except for initial epic/story selection or missing documents

  

### Step 1: Determine target story

    

**Check if:** {{story_path}} is provided by user or user provided the epic and story number such as 2-4 or 1.6 or epic 1 story 5

    
- **Action:** Check if {{sprint_status}} file exists for auto discover
    

**Check if:** sprint status file does NOT exist

      

**Check if:** user chooses '1'

      

**Check if:** user provides epic-story number

      

**Check if:** user provides story docs path

    

    
    

**Check if:** no user input provided

      
- **Action:** Extract from found story key (e.g., "1-2-user-authentication"):
        - epic_num: first number before dash (e.g., "1")
        - story_num: second number after first dash (e.g., "2")
        - story_title: remainder after second dash (e.g., "user-authentication")
      
- **Action:** Set {{story_id}} = "{{epic_num}}.{{story_num}}"
      
- **Action:** Store story_key for later use (e.g., "1-2-user-authentication")

      
      
- **Action:** Check if this is the first story in epic {{epic_num}} by looking for {{epic_num}}-1-* pattern
      

**Check if:** this is first story in epic {{epic_num}}

        

**Check if:** epic status is not one of: backlog, contexted, in-progress, done

        
**Output:** 📊 Epic {{epic_num}} status updated to in-progress
      

      
- **Action:** GOTO step 2a
    
    
- **Action:** Load the FULL file: {{sprint_status}}
    
- **Action:** Read ALL lines from beginning to end - do not skip any content
    
- **Action:** Parse the development_status section completely

    
- **Action:** Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "backlog"

    

**Check if:** no backlog story found

    
- **Action:** Extract from found story key (e.g., "1-2-user-authentication"):
      - epic_num: first number before dash (e.g., "1")
      - story_num: second number after first dash (e.g., "2")
      - story_title: remainder after second dash (e.g., "user-authentication")
    
- **Action:** Set {{story_id}} = "{{epic_num}}.{{story_num}}"
    
- **Action:** Store story_key for later use (e.g., "1-2-user-authentication")

    
    
- **Action:** Check if this is the first story in epic {{epic_num}} by looking for {{epic_num}}-1-* pattern
    

**Check if:** this is first story in epic {{epic_num}}

      

**Check if:** epic status is not one of: backlog, contexted, in-progress, done

      
**Output:** 📊 Epic {{epic_num}} status updated to in-progress
    

    
- **Action:** GOTO step 2a
  

  

### Step 2: Load and analyze core artifacts

    
> **Critical:** 🔬 EXHAUSTIVE ARTIFACT ANALYSIS - This is where you prevent future developer fuckups!

    
    
    Available content: {epics_content}, {prd_content}, {architecture_content}, {ux_content},
    {project_context}

    
    
- **Action:** From {epics_content}, extract Epic {{epic_num}} complete context: **EPIC ANALYSIS:** - Epic
    objectives and business value - ALL stories in this epic for cross-story context - Our specific story's requirements, user story
    statement, acceptance criteria - Technical requirements and constraints - Dependencies on other stories/epics - Source hints pointing to
    original documents 
    
- **Action:** Extract our story ({{epic_num}}-{{story_num}}) details: **STORY FOUNDATION:** - User story statement
    (As a, I want, so that) - Detailed acceptance criteria (already BDD formatted) - Technical requirements specific to this story -
    Business context and value - Success criteria 
    

**Check if:** story_num > 1

    
    

**Check if:** previous story exists AND git repository detected

  

  

### Step 3: Architecture analysis for developer guardrails

    
> **Critical:** 🏗️ ARCHITECTURE INTELLIGENCE - Extract everything the developer MUST follow! **ARCHITECTURE DOCUMENT ANALYSIS:** 
- **Action:** Systematically
    analyze architecture content for story-relevant requirements:

    
    

**Check if:** architecture file is single file

    

**Check if:** architecture is sharded to folder
 **CRITICAL ARCHITECTURE EXTRACTION:** 
- **Action:** For
    each architecture section, determine if relevant to this story: - **Technical Stack:** Languages, frameworks, libraries with
    versions - **Code Structure:** Folder organization, naming conventions, file patterns - **API Patterns:** Service structure, endpoint
    patterns, data contracts - **Database Schemas:** Tables, relationships, constraints relevant to story - **Security Requirements:**
    Authentication patterns, authorization rules - **Performance Requirements:** Caching strategies, optimization patterns - **Testing
    Standards:** Testing frameworks, coverage expectations, test patterns - **Deployment Patterns:** Environment configurations, build
    processes - **Integration Patterns:** External service integrations, data flows 
- **Action:** Extract any story-specific requirements that the
    developer MUST follow
    
- **Action:** Identify any architectural decisions that override previous patterns
  

  

### Step 4: Web research for latest technical specifics

    
> **Critical:** 🌐 ENSURE LATEST TECH KNOWLEDGE - Prevent outdated implementations! **WEB INTELLIGENCE:** 
- **Action:** Identify specific
    technical areas that require latest version knowledge:

    
    
- **Action:** From architecture analysis, identify specific libraries, APIs, or
    frameworks
    
- **Action:** For each critical technology, research latest stable version and key changes:
      - Latest API documentation and breaking changes
      - Security vulnerabilities or updates
      - Performance improvements or deprecations
      - Best practices for current version
    **EXTERNAL CONTEXT INCLUSION:** 
- **Action:** Include in story any critical latest information the developer needs:
      - Specific library versions and why chosen
      - API endpoints with parameters and authentication
      - Recent security patches or considerations
      - Performance optimization techniques
      - Migration considerations if upgrading
  

  

### Step 5: Create comprehensive story file

    
> **Critical:** 📝 CREATE ULTIMATE STORY FILE - The developer's master implementation guide!

    
- **Action:** Initialize from template.md:
    {default_output_file}
    story_header

    
    story_requirements

    
    
    developer_context_section **DEV AGENT GUARDRAILS:** 
    technical_requirements
    architecture_compliance
    library_framework_requirements
    
    file_structure_requirements
    testing_requirements

    
    

**Check if:** previous story learnings available

    
    

**Check if:** git analysis completed

    
    

**Check if:** web research completed

    
    project_context_reference

    
    
    story_completion_status

    
    
- **Action:** Set story Status to: "ready-for-dev"
    
- **Action:** Add completion note: "Ultimate
    context engine analysis completed - comprehensive developer guide created"
  

  

### Step 6: Update sprint status and finalize

    Validate against checklist at {installed_path}/checklist.md using _bmad/core/tasks/validate-workflow.xml
    
- **Action:** Save story document unconditionally

    
    

**Check if:** sprint status file exists

    
- **Action:** Report completion
    
**Output:** **🎯 ULTIMATE BMad Method STORY CONTEXT CREATED, {user_name}!**

      **Story Details:**
      - Story ID: {{story_id}}
      - Story Key: {{story_key}}
      - File: {{story_file}}
      - Status: ready-for-dev

      **Next Steps:**
      1. Review the comprehensive story in {{story_file}}
      2. Run dev agents `dev-story` for optimized implementation
      3. Run `code-review` when complete (auto-marks done)
      4. Optional: Run TEA `*automate` after `dev-story` to generate guardrail tests

      **The developer now has everything needed for flawless implementation!**

## Supporting Files

### Document Template
- [template.md](template.md) - Document template for this workflow

  Preview:
  ```
  # Story {{epic_num}}.{{story_num}}: {{story_title}}
Status: ready-for-dev
  ```

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # 🎯 Story Context Quality Competition Prompt
## **🔥 CRITICAL MISSION: Outperform and Fix the Original Create-Story LLM**
  ```