---
name: create-excalidraw-diagram
description: Create system architecture diagrams, ERDs, UML diagrams, or general technical diagrams in Excalidraw format
---

# create-excalidraw-diagram

## Overview
Create system architecture diagrams, ERDs, UML diagrams, or general technical diagrams in Excalidraw format

## When to Use
This workflow can be run standalone and is designed for: create system architecture diagrams, erds, uml diagrams, or general technical diagrams in excalidraw format

## Instructions
# Create Diagram - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates system architecture diagrams, ERDs, UML diagrams, or general technical diagrams in Excalidraw format.</critical>

<workflow>

  ## Step 0: Contextual Analysis
    **Action:** Review user's request and extract: diagram type, components/entities, relationships, notation preferences
    <check if="ALL requirements clear">**Action:** Skip to Step 5</check>
    <check if="SOME requirements clear">**Action:** Only ask about missing info in Steps 1-2</check>
  

  <step n="1" goal="Identify Diagram Type" elicit="true">
    **Action:** Ask: "What type of technical diagram do you need?"
    **Action:** Present options:
      1. System Architecture
      2. Entity-Relationship Diagram (ERD)
      3. UML Class Diagram
      4. UML Sequence Diagram
      5. UML Use Case Diagram
      6. Network Diagram
      7. Other
    **Action:** WAIT for selection
  

  <step n="2" goal="Gather Requirements" elicit="true">
    **Action:** Ask: "Describe the components/entities and their relationships"
    **Action:** Ask: "What notation standard? (Standard/Simplified/Strict UML-ERD)"
    **Action:** WAIT for user input
    **Action:** Summarize what will be included and confirm with user
  

  <step n="3" goal="Check for Existing Theme" elicit="true">
    **Action:** Check if theme.json exists at output location
    <check if="exists">**Action:** Ask to use it, load if yes, else proceed to Step 4</check>
    <check if="not exists">**Action:** Proceed to Step 4</check>
  

  <step n="4" goal="Create Theme" elicit="true">
    **Action:** Ask: "Choose a color scheme for your diagram:"
    **Action:** Present numbered options:
      1. Professional
         - Component: #e3f2fd (light blue)
         - Database: #e8f5e9 (light green)
         - Service: #fff3e0 (light orange)
         - Border: #1976d2 (blue)

      2. Colorful
         - Component: #e1bee7 (light purple)
         - Database: #c5e1a5 (light lime)
         - Service: #ffccbc (light coral)
         - Border: #7b1fa2 (purple)

      3. Minimal
         - Component: #f5f5f5 (light gray)
         - Database: #eeeeee (gray)
         - Service: #e0e0e0 (medium gray)
         - Border: #616161 (dark gray)

      4. Custom - Define your own colors
    **Action:** WAIT for selection
    **Action:** Create theme.json based on selection
    **Action:** Show preview and confirm
  

  ## Step 5: Plan Diagram Structure
    **Action:** List all components/entities
    **Action:** Map all relationships
    **Action:** Show planned layout
    **Action:** Ask: "Structure looks correct? (yes/no)"
    <check if="no">**Action:** Adjust and repeat</check>
  

  ## Step 6: Load Resources
    **Action:** Load {{templates}} and extract `diagram` section
    **Action:** Load {{library}}
    **Action:** Load theme.json and merge with template
    **Action:** Load {{helpers}} for guidelines
  

  ## Step 7: Build Diagram Elements
    <critical>Follow {{helpers}} for proper element creation</critical>

    <substep>For Each Component:
      - Generate unique IDs (component-id, text-id, group-id)
      - Create shape with groupIds
      - Calculate text width
      - Create text with containerId and matching groupIds
      - Add boundElements
    </substep>

    <substep>For Each Connection:
      - Determine arrow type (straight/elbow)
      - Create with startBinding and endBinding
      - Update boundElements on both components
    </substep>

    <substep>Build Order by Type:
      - Architecture: Services → Databases → Connections → Labels
      - ERD: Entities → Attributes → Relationships → Cardinality
      - UML Class: Classes → Attributes → Methods → Relationships
      - UML Sequence: Actors → Lifelines → Messages → Returns
      - UML Use Case: Actors → Use Cases → Relationships
    </substep>

    <substep>Alignment:
      - Snap to 20px grid
      - Space: 40px between components, 60px between sections
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
    **Action:** Once validation passes, confirm: "Diagram created at {{default_output_file}}. Open to view?"
  

  ## Step 10: Validate Content
    <invoke-task>Validate against {{validation}} using {_bmad}/core/tasks/validate-workflow.xml</invoke-task>
  

</workflow>
```


## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Create Diagram - Validation Checklist
## Element Structure
  ```