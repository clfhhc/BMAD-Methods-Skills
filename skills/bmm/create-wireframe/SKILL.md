---
name: create-excalidraw-wireframe
description: Create website or app wireframes in Excalidraw format
---

# create-excalidraw-wireframe

## Overview
Create website or app wireframes in Excalidraw format

## When to Use
This workflow can be run standalone and is designed for: create website or app wireframes in excalidraw format

## Instructions
# Create Wireframe - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates website or app wireframes in Excalidraw format.</critical>

<workflow>

  ## Step 0: Contextual Analysis
    **Action:** Review user's request and extract: wireframe type, fidelity level, screen count, device type, save location
    <check if="ALL requirements clear">**Action:** Skip to Step 5</check>
  

  <step n="1" goal="Identify Wireframe Type" elicit="true">
    **Action:** Ask: "What type of wireframe do you need?"
    **Action:** Present options:
      1. Website (Desktop)
      2. Mobile App (iOS/Android)
      3. Web App (Responsive)
      4. Tablet App
      5. Multi-platform
    **Action:** WAIT for selection
  

  <step n="2" goal="Gather Requirements" elicit="true">
    **Action:** Ask fidelity level (Low/Medium/High)
    **Action:** Ask screen count (Single/Few 2-3/Multiple 4-6/Many 7+)
    **Action:** Ask device dimensions or use standard
    **Action:** Ask save location
  

  <step n="3" goal="Check Theme" elicit="true">
    **Action:** Check for existing theme.json, ask to use if exists
  

  <step n="4" goal="Create Theme" elicit="true">
    **Action:** Ask: "Choose a wireframe style:"
    **Action:** Present numbered options:
      1. Classic Wireframe
         - Background: #ffffff (white)
         - Container: #f5f5f5 (light gray)
         - Border: #9e9e9e (gray)
         - Text: #424242 (dark gray)

      2. High Contrast
         - Background: #ffffff (white)
         - Container: #eeeeee (light gray)
         - Border: #212121 (black)
         - Text: #000000 (black)

      3. Blueprint Style
         - Background: #1a237e (dark blue)
         - Container: #3949ab (blue)
         - Border: #7986cb (light blue)
         - Text: #ffffff (white)

      4. Custom - Define your own colors
    **Action:** WAIT for selection
    **Action:** Create theme.json based on selection
    **Action:** Confirm with user
  

  ## Step 5: Plan Wireframe Structure
    **Action:** List all screens and their purposes
    **Action:** Map navigation flow between screens
    **Action:** Identify key UI elements for each screen
    **Action:** Show planned structure, confirm with user
  

  ## Step 6: Load Resources
    **Action:** Load {{templates}} and extract `wireframe` section
    **Action:** Load {{library}}
    **Action:** Load theme.json
    **Action:** Load {{helpers}}
  

  ## Step 7: Build Wireframe Elements
    <critical>Follow {{helpers}} for proper element creation</critical>

    <substep>For Each Screen:
      - Create container/frame
      - Add header section
      - Add content areas
      - Add navigation elements
      - Add interactive elements (buttons, inputs)
      - Add labels and annotations
    </substep>

    <substep>Build Order:
      1. Screen containers
      2. Layout sections (header, content, footer)
      3. Navigation elements
      4. Content blocks
      5. Interactive elements
      6. Labels and annotations
      7. Flow indicators (if multi-screen)
    </substep>

    <substep>Fidelity Guidelines:
      - Low: Basic shapes, minimal detail, placeholder text
      - Medium: More defined elements, some styling, representative content
      - High: Detailed elements, realistic sizing, actual content examples
    </substep>
  

  ## Step 8: Optimize and Save
    **Action:** Strip unused elements and elements with isDeleted: true
    **Action:** Save to {{default_output_file}}
  

  ## Step 9: Validate JSON Syntax
    <critical>NEVER delete the file if validation fails - always fix syntax errors</critical>
    **Action:** Run: node -e "JSON.parse(require('fs').readFileSync('{{default_output_file}}', 'utf8')); console.log('✓ Valid JSON')"
    <check if="validation fails (exit code 1)">
      **Action:** Read the error message carefully - it shows the syntax error and position
      **Action:** Open the file and navigate to the error location
      **Action:** Fix the syntax error (add missing comma, bracket, or quote as indicated)
      **Action:** Save the file
      **Action:** Re-run validation with the same command
      **Action:** Repeat until validation passes
    </check>
    **Action:** Once validation passes, confirm with user
  

  ## Step 10: Validate Content
    <invoke-task>Validate against {{validation}}</invoke-task>
  

</workflow>
```


## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Create Wireframe - Validation Checklist
## Layout Structure
  ```