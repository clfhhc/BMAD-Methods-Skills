---
name: create-excalidraw-dataflow
description: Create data flow diagrams (DFD) in Excalidraw format
---

# create-excalidraw-dataflow

## Overview
Create data flow diagrams (DFD) in Excalidraw format

## When to Use
This workflow can be run standalone and is designed for: create data flow diagrams (dfd) in excalidraw format

## Instructions
# Create Data Flow Diagram - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates data flow diagrams (DFD) in Excalidraw format.</critical>

<workflow>

  ## Step 0: Contextual Analysis
    **Action:** Review user's request and extract: DFD level, processes, data stores, external entities
    <check if="ALL requirements clear">**Action:** Skip to Step 4</check>
  

  <step n="1" goal="Identify DFD Level" elicit="true">
    **Action:** Ask: "What level of DFD do you need?"
    **Action:** Present options:
      1. Context Diagram (Level 0) - Single process showing system boundaries
      2. Level 1 DFD - Major processes and data flows
      3. Level 2 DFD - Detailed sub-processes
      4. Custom - Specify your requirements
    **Action:** WAIT for selection
  

  <step n="2" goal="Gather Requirements" elicit="true">
    **Action:** Ask: "Describe the processes, data stores, and external entities in your system"
    **Action:** WAIT for user description
    **Action:** Summarize what will be included and confirm with user
  

  <step n="3" goal="Theme Setup" elicit="true">
    **Action:** Check for existing theme.json, ask to use if exists
    <check if="no existing theme">
      **Action:** Ask: "Choose a DFD color scheme:"
      **Action:** Present numbered options:
        1. Standard DFD
           - Process: #e3f2fd (light blue)
           - Data Store: #e8f5e9 (light green)
           - External Entity: #f3e5f5 (light purple)
           - Border: #1976d2 (blue)

        2. Colorful DFD
           - Process: #fff9c4 (light yellow)
           - Data Store: #c5e1a5 (light lime)
           - External Entity: #ffccbc (light coral)
           - Border: #f57c00 (orange)

        3. Minimal DFD
           - Process: #f5f5f5 (light gray)
           - Data Store: #eeeeee (gray)
           - External Entity: #e0e0e0 (medium gray)
           - Border: #616161 (dark gray)

        4. Custom - Define your own colors
      **Action:** WAIT for selection
      **Action:** Create theme.json based on selection
    </check>
  

  ## Step 4: Plan DFD Structure
    **Action:** List all processes with numbers (1.0, 2.0, etc.)
    **Action:** List all data stores (D1, D2, etc.)
    **Action:** List all external entities
    **Action:** Map all data flows with labels
    **Action:** Show planned structure, confirm with user
  

  ## Step 5: Load Resources
    **Action:** Load {{templates}} and extract `dataflow` section
    **Action:** Load {{library}}
    **Action:** Load theme.json
    **Action:** Load {{helpers}}
  

  ## Step 6: Build DFD Elements
    <critical>Follow standard DFD notation from {{helpers}}</critical>

    <substep>Build Order:
      1. External entities (rectangles, bold border)
      2. Processes (circles/ellipses with numbers)
      3. Data stores (parallel lines or rectangles)
      4. Data flows (labeled arrows)
    </substep>

    <substep>DFD Rules:
      - Processes: Numbered (1.0, 2.0), verb phrases
      - Data stores: Named (D1, D2), noun phrases
      - External entities: Named, noun phrases
      - Data flows: Labeled with data names, arrows show direction
      - No direct flow between external entities
      - No direct flow between data stores
    </substep>

    <substep>Layout:
      - External entities at edges
      - Processes in center
      - Data stores between processes
      - Minimize crossing flows
      - Left-to-right or top-to-bottom flow
    </substep>
  

  ## Step 7: Optimize and Save
    **Action:** Verify DFD rules compliance
    **Action:** Strip unused elements and elements with isDeleted: true
    **Action:** Save to {{default_output_file}}
  

  ## Step 8: Validate JSON Syntax
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
  

  ## Step 9: Validate Content
    <invoke-task>Validate against {{validation}}</invoke-task>
  

</workflow>
```


## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Create Data Flow Diagram - Validation Checklist
## DFD Notation
  ```