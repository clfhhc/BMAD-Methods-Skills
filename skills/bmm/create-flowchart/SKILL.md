---
name: create-excalidraw-flowchart
description: Create a flowchart visualization in Excalidraw format for processes, pipelines, or logic flows
---

# create-excalidraw-flowchart

## Overview
Create a flowchart visualization in Excalidraw format for processes, pipelines, or logic flows

## When to Use
This workflow can be run standalone and is designed for: create a flowchart visualization in excalidraw format for processes, pipelines, or logic flows

## Instructions
# Create Flowchart - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates a flowchart visualization in Excalidraw format for processes, pipelines, or logic flows.</critical>

<workflow>

  ## Step 0: Contextual Analysis (Smart Elicitation)
    <critical>Before asking any questions, analyze what the user has already told you</critical>

    **Action:** Review the user's initial request and conversation history
    **Action:** Extract any mentioned: flowchart type, complexity, decision points, save location

    <check if="ALL requirements are clear from context">
      **Action:** Summarize your understanding
      **Action:** Skip directly to Step 4 (Plan Flowchart Layout)
    </check>

    <check if="SOME requirements are clear">
      **Action:** Note what you already know
      **Action:** Only ask about missing information in Step 1
    </check>

    <check if="requirements are unclear or minimal">
      **Action:** Proceed with full elicitation in Step 1
    </check>
  

  <step n="1" goal="Gather Requirements" elicit="true">
    **Action:** Ask Question 1: "What type of process flow do you need to visualize?"
    **Action:** Present numbered options:
      1. Business Process Flow - Document business workflows, approval processes, or operational procedures
      2. Algorithm/Logic Flow - Visualize code logic, decision trees, or computational processes
      3. User Journey Flow - Map user interactions, navigation paths, or experience flows
      4. Data Processing Pipeline - Show data transformation, ETL processes, or processing stages
      5. Other - Describe your specific flowchart needs
    **Action:** WAIT for user selection (1-5)

    **Action:** Ask Question 2: "How many main steps are in this flow?"
    **Action:** Present numbered options:
      1. Simple (3-5 steps) - Quick process with few decision points
      2. Medium (6-10 steps) - Standard workflow with some branching
      3. Complex (11-20 steps) - Detailed process with multiple decision points
      4. Very Complex (20+ steps) - Comprehensive workflow requiring careful layout
    **Action:** WAIT for user selection (1-4)
    **Action:** Store selection in {{complexity}}

    **Action:** Ask Question 3: "Does your flow include decision points (yes/no branches)?"
    **Action:** Present numbered options:
      1. No decisions - Linear flow from start to end
      2. Few decisions (1-2) - Simple branching with yes/no paths
      3. Multiple decisions (3-5) - Several conditional branches
      4. Complex decisions (6+) - Extensive branching logic
    **Action:** WAIT for user selection (1-4)
    **Action:** Store selection in {{decision_points}}

    **Action:** Ask Question 4: "Where should the flowchart be saved?"
    **Action:** Present numbered options:
      1. Default location - docs/flowcharts/[auto-generated-name].excalidraw
      2. Custom path - Specify your own file path
      3. Project root - Save in main project directory
      4. Specific folder - Choose from existing folders
    **Action:** WAIT for user selection (1-4)
    <check if="selection is 2 or 4">
      **Action:** Ask for specific path
      **Action:** WAIT for user input
    </check>
    **Action:** Store final path in {{default_output_file}}
  

  <step n="2" goal="Check for Existing Theme" elicit="true">
    **Action:** Check if theme.json exists at output location
    <check if="theme.json exists">
      **Action:** Ask: "Found existing theme. Use it? (yes/no)"
      **Action:** WAIT for user response
      <check if="user says yes">
        **Action:** Load and use existing theme
        **Action:** Skip to Step 4
      </check>
      <check if="user says no">
        **Action:** Proceed to Step 3
      </check>
    </check>
    <check if="theme.json does not exist">
      **Action:** Proceed to Step 3
    </check>
  

  <step n="3" goal="Create Theme" elicit="true">
    **Action:** Ask: "Let's create a theme for your flowchart. Choose a color scheme:"
    **Action:** Present numbered options:
      1. Professional Blue
         - Primary Fill: #e3f2fd (light blue)
         - Accent/Border: #1976d2 (blue)
         - Decision: #fff3e0 (light orange)
         - Text: #1e1e1e (dark gray)

      2. Success Green
         - Primary Fill: #e8f5e9 (light green)
         - Accent/Border: #388e3c (green)
         - Decision: #fff9c4 (light yellow)
         - Text: #1e1e1e (dark gray)

      3. Neutral Gray
         - Primary Fill: #f5f5f5 (light gray)
         - Accent/Border: #616161 (gray)
         - Decision: #e0e0e0 (medium gray)
         - Text: #1e1e1e (dark gray)

      4. Warm Orange
         - Primary Fill: #fff3e0 (light orange)
         - Accent/Border: #f57c00 (orange)
         - Decision: #ffe0b2 (peach)
         - Text: #1e1e1e (dark gray)

      5. Custom Colors - Define your own color palette
    **Action:** WAIT for user selection (1-5)
    **Action:** Store selection in {{theme_choice}}

    <check if="selection is 5 (Custom)">
      **Action:** Ask: "Primary fill color (hex code)?"
      **Action:** WAIT for user input
      **Action:** Store in {{custom_colors.primary_fill}}
      **Action:** Ask: "Accent/border color (hex code)?"
      **Action:** WAIT for user input
      **Action:** Store in {{custom_colors.accent}}
      **Action:** Ask: "Decision color (hex code)?"
      **Action:** WAIT for user input
      **Action:** Store in {{custom_colors.decision}}
    </check>

    **Action:** Create theme.json with selected colors
    **Action:** Show theme preview with all colors
    **Action:** Ask: "Theme looks good?"
    **Action:** Present numbered options:
      1. Yes, use this theme - Proceed with theme
      2. No, adjust colors - Modify color selections
      3. Start over - Choose different preset
    **Action:** WAIT for selection (1-3)
    <check if="selection is 2 or 3">
      **Action:** Repeat Step 3
    </check>
  

  ## Step 4: Plan Flowchart Layout
    **Action:** List all steps and decision points based on gathered requirements
    **Action:** Show user the planned structure
    **Action:** Ask: "Structure looks correct? (yes/no)"
    **Action:** WAIT for user response
    <check if="user says no">
      **Action:** Adjust structure based on feedback
      **Action:** Repeat this step
    </check>
  

  ## Step 5: Load Template and Resources
    **Action:** Load {{templates}} file
    **Action:** Extract `flowchart` section from YAML
    **Action:** Load {{library}} file
    **Action:** Load theme.json and merge colors with template
    **Action:** Load {{helpers}} for element creation guidelines
  

  ## Step 6: Build Flowchart Elements
    <critical>Follow guidelines from {{helpers}} for proper element creation</critical>

    **Action:** Build ONE section at a time following these rules:

    <substep>For Each Shape with Label:
      1. Generate unique IDs (shape-id, text-id, group-id)
      2. Create shape with groupIds: [group-id]
      3. Calculate text width: (text.length × fontSize × 0.6) + 20, round to nearest 10
      4. Create text element with:
         - containerId: shape-id
         - groupIds: [group-id] (SAME as shape)
         - textAlign: "center"
         - verticalAlign: "middle"
         - width: calculated width
      5. Add boundElements to shape referencing text
    </substep>

    <substep>For Each Arrow:
      1. Determine arrow type needed:
         - Straight: For forward flow (left-to-right, top-to-bottom)
         - Elbow: For upward flow, backward flow, or complex routing
      2. Create arrow with startBinding and endBinding
      3. Set startBinding.elementId to source shape ID
      4. Set endBinding.elementId to target shape ID
      5. Set gap: 10 for both bindings
      6. If elbow arrow, add intermediate points for direction changes
      7. Update boundElements on both connected shapes
    </substep>

    <substep>Alignment:
      - Snap all x, y to 20px grid
      - Align shapes vertically (same x for vertical flow)
      - Space elements: 60px between shapes
    </substep>

    <substep>Build Order:
      1. Start point (circle) with label
      2. Each process step (rectangle) with label
      3. Each decision point (diamond) with label
      4. End point (circle) with label
      5. Connect all with bound arrows
    </substep>
  

  ## Step 7: Optimize and Save
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
    **Action:** Once validation passes, confirm with user: "Flowchart created at {{default_output_file}}. Open to view?"
  

  ## Step 9: Validate Content
    <invoke-task>Validate against checklist at {{validation}} using {_bmad}/core/tasks/validate-workflow.xml</invoke-task>
  

</workflow>
```


## Supporting Files

### Validation Checklist
- [checklist.md](checklist.md) - Validation checklist for this workflow

  Preview:
  ```
  # Create Flowchart - Validation Checklist
## Element Structure
  ```