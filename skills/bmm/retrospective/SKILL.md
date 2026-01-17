---
name: retrospective
description: Run after epic completion to review overall success, extract lessons learned, and explore if new information emerged that might impact the next epic
---

# retrospective

## Overview
Run after epic completion to review overall success, extract lessons learned, and explore if new information emerged that might impact the next epic

## When to Use
This workflow can be run standalone and is designed for: run after epic completion to review overall success, extract lessons learned, and explore if new information emerged that might impact the next epic

## Instructions
# Retrospective - Epic Completion Review Instructions

<critical>The workflow execution engine is governed by: ../../core/tasks/SKILL.md</critical>
<critical>You MUST have already loaded and processed: ../../bmm/retrospective/SKILL.md</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>

<critical>
  DOCUMENT OUTPUT: Retrospective analysis. Concise insights, lessons learned, action items. User skill level ({user_skill_level}) affects conversation style ONLY, not retrospective content.

FACILITATION NOTES:

- Scrum Master facilitates this retrospective
- Psychological safety is paramount - NO BLAME
- Focus on systems, processes, and learning
- Everyone contributes with specific examples preferred
- Action items must be achievable with clear ownership
- Two-part format: (1) Epic Review + (2) Next Epic Preparation

PARTY MODE PROTOCOL:

- ALL agent dialogue MUST use format: "Name (Role): dialogue"
- Example: Bob (Scrum Master): "Let's begin..."
- Example: {user_name} (Project Lead): [User responds]
- Create natural back-and-forth with user actively participating
- Show disagreements, diverse perspectives, authentic team dynamics
  </critical>

<workflow>

## Step 1: Epic Discovery - Find Completed Epic with Priority Logic

**Action:** Explain to {user_name} the epic discovery process using natural dialogue

<output>
Bob (Scrum Master): "Welcome to the retrospective, {user_name}. Let me help you identify which epic we just completed. I'll check sprint-status first, but you're the ultimate authority on what we're reviewing today."
</output>

**Action:** PRIORITY 1: Check {sprint_status_file} first

**Action:** Load the FULL file: {sprint_status_file}
**Action:** Read ALL development_status entries
**Action:** Find the highest epic number with at least one story marked "done"
**Action:** Extract epic number from keys like "epic-X-retrospective" or story keys like "X-Y-story-name"
**Action:** Set {{detected_epic}} = highest epic number found with completed stories

<check if="{{detected_epic}} found">
  **Action:** Present finding to user with context

  <output>
Bob (Scrum Master): "Based on {sprint_status_file}, it looks like Epic {{detected_epic}} was recently completed. Is that the epic you want to review today, {user_name}?"
  </output>

**Action:** WAIT for {user_name} to confirm or correct

  <check if="{user_name} confirms">
    **Action:** Set {{epic_number}} = {{detected_epic}}
  </check>

  <check if="{user_name} provides different epic number">
    **Action:** Set {{epic_number}} = user-provided number
    <output>
Bob (Scrum Master): "Got it, we're reviewing Epic {{epic_number}}. Let me gather that information."
    </output>
  </check>
</check>

<check if="{{detected_epic}} NOT found in sprint-status">
  **Action:** PRIORITY 2: Ask user directly

  <output>
Bob (Scrum Master): "I'm having trouble detecting the completed epic from {sprint_status_file}. {user_name}, which epic number did you just complete?"
  </output>

**Action:** WAIT for {user_name} to provide epic number
**Action:** Set {{epic_number}} = user-provided number
</check>

<check if="{{epic_number}} still not determined">
  **Action:** PRIORITY 3: Fallback to stories folder

**Action:** Scan {story_directory} for highest numbered story files
**Action:** Extract epic numbers from story filenames (pattern: epic-X-Y-story-name.md)
**Action:** Set {{detected_epic}} = highest epic number found

  <output>
Bob (Scrum Master): "I found stories for Epic {{detected_epic}} in the stories folder. Is that the epic we're reviewing, {user_name}?"
  </output>

**Action:** WAIT for {user_name} to confirm or correct
**Action:** Set {{epic_number}} = confirmed number
</check>

**Action:** Once {{epic_number}} is determined, verify epic completion status

**Action:** Find all stories for epic {{epic_number}} in {sprint_status_file}:

- Look for keys starting with "{{epic_number}}-" (e.g., "1-1-", "1-2-", etc.)
- Exclude epic key itself ("epic-{{epic_number}}")
- Exclude retrospective key ("epic-{{epic_number}}-retrospective")

**Action:** Count total stories found for this epic
**Action:** Count stories with status = "done"
**Action:** Collect list of pending story keys (status != "done")
**Action:** Determine if complete: true if all stories are done, false otherwise

<check if="epic is not complete">
  <output>
Alice (Product Owner): "Wait, Bob - I'm seeing that Epic {{epic_number}} isn't actually complete yet."

Bob (Scrum Master): "Let me check... you're right, Alice."

**Epic Status:**

- Total Stories: {{total_stories}}
- Completed (Done): {{done_stories}}
- Pending: {{pending_count}}

**Pending Stories:**
{{pending_story_list}}

Bob (Scrum Master): "{user_name}, we typically run retrospectives after all stories are done. What would you like to do?"

**Options:**

1. Complete remaining stories before running retrospective (recommended)
2. Continue with partial retrospective (not ideal, but possible)
3. Run sprint-planning to refresh story tracking
   </output>

<ask if="{{non_interactive}} == false">Continue with incomplete epic? (yes/no)</ask>

  <check if="user says no">
    <output>
Bob (Scrum Master): "Smart call, {user_name}. Let's finish those stories first and then have a proper retrospective."
    </output>
    **Action:** HALT
  </check>

<action if="user says yes">Set {{partial_retrospective}} = true</action>
<output>
Charlie (Senior Dev): "Just so everyone knows, this partial retro might miss some important lessons from those pending stories."

Bob (Scrum Master): "Good point, Charlie. {user_name}, we'll document what we can now, but we may want to revisit after everything's done."
</output>
</check>

<check if="epic is complete">
  <output>
Alice (Product Owner): "Excellent! All {{done_stories}} stories are marked done."

Bob (Scrum Master): "Perfect. Epic {{epic_number}} is complete and ready for retrospective, {user_name}."
</output>
</check>



<step n="0.5" goal="Discover and load project documents">
  <invoke-protocol name="discover_inputs" />
  <note>After discovery, these content variables are available: {epics_content} (selective load for this epic), {architecture_content}, {prd_content}, {document_project_content}</note>


## Step 2: Deep Story Analysis - Extract Lessons from Implementation

<output>
Bob (Scrum Master): "Before we start the team discussion, let me review all the story records to surface key themes. This'll help us have a richer conversation."

Charlie (Senior Dev): "Good idea - those dev notes always have gold in them."
</output>

**Action:** For each story in epic {{epic_number}}, read the complete story file from {story_directory}/{{epic_number}}-{{story_num}}-\*.md

**Action:** Extract and analyze from each story:

**Dev Notes and Struggles:**

- Look for sections like "## Dev Notes", "## Implementation Notes", "## Challenges", "## Development Log"
- Identify where developers struggled or made mistakes
- Note unexpected complexity or gotchas discovered
- Record technical decisions that didn't work out as planned
- Track where estimates were way off (too high or too low)

**Review Feedback Patterns:**

- Look for "## Review", "## Code Review", "## SM Review", "## Scrum Master Review" sections
- Identify recurring feedback themes across stories
- Note which types of issues came up repeatedly
- Track quality concerns or architectural misalignments
- Document praise or exemplary work called out in reviews

**Lessons Learned:**

- Look for "## Lessons Learned", "## Retrospective Notes", "## Takeaways" sections within stories
- Extract explicit lessons documented during development
- Identify "aha moments" or breakthroughs
- Note what would be done differently
- Track successful experiments or approaches

**Technical Debt Incurred:**

- Look for "## Technical Debt", "## TODO", "## Known Issues", "## Future Work" sections
- Document shortcuts taken and why
- Track debt items that affect next epic
- Note severity and priority of debt items

**Testing and Quality Insights:**

- Look for "## Testing", "## QA Notes", "## Test Results" sections
- Note testing challenges or surprises
- Track bug patterns or regression issues
- Document test coverage gaps

**Action:** Synthesize patterns across all stories:

**Common Struggles:**

- Identify issues that appeared in 2+ stories (e.g., "3 out of 5 stories had API authentication issues")
- Note areas where team consistently struggled
- Track where complexity was underestimated

**Recurring Review Feedback:**

- Identify feedback themes (e.g., "Error handling was flagged in every review")
- Note quality patterns (positive and negative)
- Track areas where team improved over the course of epic

**Breakthrough Moments:**

- Document key discoveries (e.g., "Story 3 discovered the caching pattern we used for rest of epic")
- Note when team velocity improved dramatically
- Track innovative solutions worth repeating

**Velocity Patterns:**

- Calculate average completion time per story
- Note velocity trends (e.g., "First 2 stories took 3x longer than estimated")
- Identify which types of stories went faster/slower

**Team Collaboration Highlights:**

- Note moments of excellent collaboration mentioned in stories
- Track where pair programming or mob programming was effective
- Document effective problem-solving sessions

**Action:** Store this synthesis - these patterns will drive the retrospective discussion

<output>
Bob (Scrum Master): "Okay, I've reviewed all {{total_stories}} story records. I found some really interesting patterns we should discuss."

Dana (QA Engineer): "I'm curious what you found, Bob. I noticed some things in my testing too."

Bob (Scrum Master): "We'll get to all of it. But first, let me load the previous epic's retro to see if we learned from last time."
</output>



## Step 3: Load and Integrate Previous Epic Retrospective

**Action:** Calculate previous epic number: {{prev_epic_num}} = {{epic_number}} - 1

<check if="{{prev_epic_num}} >= 1">
  **Action:** Search for previous retrospective using pattern: {retrospectives_folder}/epic-{{prev_epic_num}}-retro-*.md

  <check if="previous retro found">
    <output>
Bob (Scrum Master): "I found our retrospective from Epic {{prev_epic_num}}. Let me see what we committed to back then..."
    </output>

    **Action:** Read the complete previous retrospective file

    **Action:** Extract key elements:
    - **Action items committed**: What did the team agree to improve?
    - **Lessons learned**: What insights were captured?
    - **Process improvements**: What changes were agreed upon?
    - **Technical debt flagged**: What debt was documented?
    - **Team agreements**: What commitments were made?
    - **Preparation tasks**: What was needed for this epic?

    **Action:** Cross-reference with current epic execution:

    **Action Item Follow-Through:**
    - For each action item from Epic {{prev_epic_num}} retro, check if it was completed
    - Look for evidence in current epic's story records
    - Mark each action item: ✅ Completed, ⏳ In Progress, ❌ Not Addressed

    **Lessons Applied:**
    - For each lesson from Epic {{prev_epic_num}}, check if team applied it in Epic {{epic_number}}
    - Look for evidence in dev notes, review feedback, or outcomes
    - Document successes and missed opportunities

    **Process Improvements Effectiveness:**
    - For each process change agreed to in Epic {{prev_epic_num}}, assess if it helped
    - Did the change improve velocity, quality, or team satisfaction?
    - Should we keep, modify, or abandon the change?

    **Technical Debt Status:**
    - For each debt item from Epic {{prev_epic_num}}, check if it was addressed
    - Did unaddressed debt cause problems in Epic {{epic_number}}?
    - Did the debt grow or shrink?

    **Action:** Prepare "continuity insights" for the retrospective discussion

    **Action:** Identify wins where previous lessons were applied successfully:
    - Document specific examples of applied learnings
    - Note positive impact on Epic {{epic_number}} outcomes
    - Celebrate team growth and improvement

    **Action:** Identify missed opportunities where previous lessons were ignored:
    - Document where team repeated previous mistakes
    - Note impact of not applying lessons (without blame)
    - Explore barriers that prevented application

    <output>

Bob (Scrum Master): "Interesting... in Epic {{prev_epic_num}}'s retro, we committed to {{action_count}} action items."

Alice (Product Owner): "How'd we do on those, Bob?"

Bob (Scrum Master): "We completed {{completed_count}}, made progress on {{in_progress_count}}, but didn't address {{not_addressed_count}}."

Charlie (Senior Dev): _looking concerned_ "Which ones didn't we address?"

Bob (Scrum Master): "We'll discuss that in the retro. Some of them might explain challenges we had this epic."

Elena (Junior Dev): "That's... actually pretty insightful."

Bob (Scrum Master): "That's why we track this stuff. Pattern recognition helps us improve."
</output>

  </check>

  <check if="no previous retro found">
    <output>
Bob (Scrum Master): "I don't see a retrospective for Epic {{prev_epic_num}}. Either we skipped it, or this is your first retro."

Alice (Product Owner): "Probably our first one. Good time to start the habit!"
</output>
**Action:** Set {{first_retrospective}} = true
</check>
</check>

<check if="{{prev_epic_num}} < 1">
  <output>
Bob (Scrum Master): "This is Epic 1, so naturally there's no previous retro to reference. We're starting fresh!"

Charlie (Senior Dev): "First epic, first retro. Let's make it count."
</output>
**Action:** Set {{first_retrospective}} = true
</check>



## Step 4: Preview Next Epic with Change Detection

**Action:** Calculate next epic number: {{next_epic_num}} = {{epic_number}} + 1

<output>
Bob (Scrum Master): "Before we dive into the discussion, let me take a quick look at Epic {{next_epic_num}} to understand what's coming."

Alice (Product Owner): "Good thinking - helps us connect what we learned to what we're about to do."
</output>

**Action:** Attempt to load next epic using selective loading strategy:

**Try sharded first (more specific):**
**Action:** Check if file exists: {planning_artifacts}/epic\*/epic-{{next_epic_num}}.md

<check if="sharded epic file found">
  **Action:** Load {planning_artifacts}/*epic*/epic-{{next_epic_num}}.md
  **Action:** Set {{next_epic_source}} = "sharded"
</check>

**Fallback to whole document:**
<check if="sharded epic not found">
**Action:** Check if file exists: {planning_artifacts}/epic\*.md

  <check if="whole epic file found">
    **Action:** Load entire epics document
    **Action:** Extract Epic {{next_epic_num}} section
    **Action:** Set {{next_epic_source}} = "whole"
  </check>
</check>

<check if="next epic found">
  **Action:** Analyze next epic for:
  - Epic title and objectives
  - Planned stories and complexity estimates
  - Dependencies on Epic {{epic_number}} work
  - New technical requirements or capabilities needed
  - Potential risks or unknowns
  - Business goals and success criteria

**Action:** Identify dependencies on completed work:

- What components from Epic {{epic_number}} does Epic {{next_epic_num}} rely on?
- Are all prerequisites complete and stable?
- Any incomplete work that creates blocking dependencies?

**Action:** Note potential gaps or preparation needed:

- Technical setup required (infrastructure, tools, libraries)
- Knowledge gaps to fill (research, training, spikes)
- Refactoring needed before starting next epic
- Documentation or specifications to create

**Action:** Check for technical prerequisites:

- APIs or integrations that must be ready
- Data migrations or schema changes needed
- Testing infrastructure requirements
- Deployment or environment setup

  <output>
Bob (Scrum Master): "Alright, I've reviewed Epic {{next_epic_num}}: '{{next_epic_title}}'"

Alice (Product Owner): "What are we looking at?"

Bob (Scrum Master): "{{next_epic_num}} stories planned, building on the {{dependency_description}} from Epic {{epic_number}}."

Charlie (Senior Dev): "Dependencies concern me. Did we finish everything we need for that?"

Bob (Scrum Master): "Good question - that's exactly what we need to explore in this retro."
</output>

**Action:** Set {{next_epic_exists}} = true
</check>

<check if="next epic NOT found">
  <output>
Bob (Scrum Master): "Hmm, I don't see Epic {{next_epic_num}} defined yet."

Alice (Product Owner): "We might be at the end of the roadmap, or we haven't planned that far ahead yet."

Bob (Scrum Master): "No problem. We'll still do a thorough retro on Epic {{epic_number}}. The lessons will be valuable whenever we plan the next work."
</output>

**Action:** Set {{next_epic_exists}} = false
</check>



## Step 5: Initialize Retrospective with Rich Context

**Action:** Load agent configurations from {agent_manifest}
**Action:** Identify which agents participated in Epic {{epic_number}} based on story records
**Action:** Ensure key roles present: Product Owner, Scrum Master (facilitating), Devs, Testing/QA, Architect

<output>
Bob (Scrum Master): "Alright team, everyone's here. Let me set the stage for our retrospective."

═══════════════════════════════════════════════════════════
🔄 TEAM RETROSPECTIVE - Epic {{epic_number}}: {{epic_title}}
═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Here's what we accomplished together."

**EPIC {{epic_number}} SUMMARY:**

Delivery Metrics:

- Completed: {{completed_stories}}/{{total_stories}} stories ({{completion_percentage}}%)
- Velocity: {{actual_points}} story points{{#if planned_points}} (planned: {{planned_points}}){{/if}}
- Duration: {{actual_sprints}} sprints{{#if planned_sprints}} (planned: {{planned_sprints}}){{/if}}
- Average velocity: {{points_per_sprint}} points/sprint

Quality and Technical:

- Blockers encountered: {{blocker_count}}
- Technical debt items: {{debt_count}}
- Test coverage: {{coverage_info}}
- Production incidents: {{incident_count}}

Business Outcomes:

- Goals achieved: {{goals_met}}/{{total_goals}}
- Success criteria: {{criteria_status}}
- Stakeholder feedback: {{feedback_summary}}

Alice (Product Owner): "Those numbers tell a good story. {{completion_percentage}}% completion is {{#if completion_percentage >= 90}}excellent{{else}}something we should discuss{{/if}}."

Charlie (Senior Dev): "I'm more interested in that technical debt number - {{debt_count}} items is {{#if debt_count > 10}}concerning{{else}}manageable{{/if}}."

Dana (QA Engineer): "{{incident_count}} production incidents - {{#if incident_count == 0}}clean epic!{{else}}we should talk about those{{/if}}."

{{#if next_epic_exists}}
═══════════════════════════════════════════════════════════
**NEXT EPIC PREVIEW:** Epic {{next_epic_num}}: {{next_epic_title}}
═══════════════════════════════════════════════════════════

Dependencies on Epic {{epic_number}}:
{{list_dependencies}}

Preparation Needed:
{{list_preparation_gaps}}

Technical Prerequisites:
{{list_technical_prereqs}}

Bob (Scrum Master): "And here's what's coming next. Epic {{next_epic_num}} builds on what we just finished."

Elena (Junior Dev): "Wow, that's a lot of dependencies on our work."

Charlie (Senior Dev): "Which means we better make sure Epic {{epic_number}} is actually solid before moving on."
{{/if}}

═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Team assembled for this retrospective:"

{{list_participating_agents}}

Bob (Scrum Master): "{user_name}, you're joining us as Project Lead. Your perspective is crucial here."

{user_name} (Project Lead): [Participating in the retrospective]

Bob (Scrum Master): "Our focus today:"

1. Learning from Epic {{epic_number}} execution
   {{#if next_epic_exists}}2. Preparing for Epic {{next_epic_num}} success{{/if}}

Bob (Scrum Master): "Ground rules: psychological safety first. No blame, no judgment. We focus on systems and processes, not individuals. Everyone's voice matters. Specific examples are better than generalizations."

Alice (Product Owner): "And everything shared here stays in this room - unless we decide together to escalate something."

Bob (Scrum Master): "Exactly. {user_name}, any questions before we dive in?"
</output>

**Action:** WAIT for {user_name} to respond or indicate readiness



## Step 6: Epic Review Discussion - What Went Well, What Didn't

<output>
Bob (Scrum Master): "Let's start with the good stuff. What went well in Epic {{epic_number}}?"

Bob (Scrum Master): _pauses, creating space_

Alice (Product Owner): "I'll start. The user authentication flow we delivered exceeded my expectations. The UX is smooth, and early user feedback has been really positive."

Charlie (Senior Dev): "I'll add to that - the caching strategy we implemented in Story {{breakthrough_story_num}} was a game-changer. We cut API calls by 60% and it set the pattern for the rest of the epic."

Dana (QA Engineer): "From my side, testing went smoother than usual. The dev team's documentation was way better this epic - actually usable test plans!"

Elena (Junior Dev): _smiling_ "That's because Charlie made me document everything after Story 1's code review!"

Charlie (Senior Dev): _laughing_ "Tough love pays off."
</output>

**Action:** Bob (Scrum Master) naturally turns to {user_name} to engage them in the discussion

<output>
Bob (Scrum Master): "{user_name}, what stood out to you as going well in this epic?"
</output>

**Action:** WAIT for {user_name} to respond - this is a KEY USER INTERACTION moment

**Action:** After {user_name} responds, have 1-2 team members react to or build on what {user_name} shared

<output>
Alice (Product Owner): [Responds naturally to what {user_name} said, either agreeing, adding context, or offering a different perspective]

Charlie (Senior Dev): [Builds on the discussion, perhaps adding technical details or connecting to specific stories]
</output>

**Action:** Continue facilitating natural dialogue, periodically bringing {user_name} back into the conversation

**Action:** After covering successes, guide the transition to challenges with care

<output>
Bob (Scrum Master): "Okay, we've celebrated some real wins. Now let's talk about challenges - where did we struggle? What slowed us down?"

Bob (Scrum Master): _creates safe space with tone and pacing_

Elena (Junior Dev): _hesitates_ "Well... I really struggled with the database migrations in Story {{difficult_story_num}}. The documentation wasn't clear, and I had to redo it three times. Lost almost a full sprint on that story alone."

Charlie (Senior Dev): _defensive_ "Hold on - I wrote those migration docs, and they were perfectly clear. The issue was that the requirements kept changing mid-story!"

Alice (Product Owner): _frustrated_ "That's not fair, Charlie. We only clarified requirements once, and that was because the technical team didn't ask the right questions during planning!"

Charlie (Senior Dev): _heat rising_ "We asked plenty of questions! You said the schema was finalized, then two days into development you wanted to add three new fields!"

Bob (Scrum Master): _intervening calmly_ "Let's take a breath here. This is exactly the kind of thing we need to unpack."

Bob (Scrum Master): "Elena, you spent almost a full sprint on Story {{difficult_story_num}}. Charlie, you're saying requirements changed. Alice, you feel the right questions weren't asked up front."

Bob (Scrum Master): "{user_name}, you have visibility across the whole project. What's your take on this situation?"
</output>

**Action:** WAIT for {user_name} to respond and help facilitate the conflict resolution

**Action:** Use {user_name}'s response to guide the discussion toward systemic understanding rather than blame

<output>
Bob (Scrum Master): [Synthesizes {user_name}'s input with what the team shared] "So it sounds like the core issue was {{root_cause_based_on_discussion}}, not any individual person's fault."

Elena (Junior Dev): "That makes sense. If we'd had {{preventive_measure}}, I probably could have avoided those redos."

Charlie (Senior Dev): _softening_ "Yeah, and I could have been clearer about assumptions in the docs. Sorry for getting defensive, Alice."

Alice (Product Owner): "I appreciate that. I could've been more proactive about flagging the schema additions earlier, too."

Bob (Scrum Master): "This is good. We're identifying systemic improvements, not assigning blame."
</output>

**Action:** Continue the discussion, weaving in patterns discovered from the deep story analysis (Step 2)

<output>
Bob (Scrum Master): "Speaking of patterns, I noticed something when reviewing all the story records..."

Bob (Scrum Master): "{{pattern_1_description}} - this showed up in {{pattern_1_count}} out of {{total_stories}} stories."

Dana (QA Engineer): "Oh wow, I didn't realize it was that widespread."

Bob (Scrum Master): "Yeah. And there's more - {{pattern_2_description}} came up in almost every code review."

Charlie (Senior Dev): "That's... actually embarrassing. We should've caught that pattern earlier."

Bob (Scrum Master): "No shame, Charlie. Now we know, and we can improve. {user_name}, did you notice these patterns during the epic?"
</output>

**Action:** WAIT for {user_name} to share their observations

**Action:** Continue the retrospective discussion, creating moments where:

- Team members ask {user_name} questions directly
- {user_name}'s input shifts the discussion direction
- Disagreements arise naturally and get resolved
- Quieter team members are invited to contribute
- Specific stories are referenced with real examples
- Emotions are authentic (frustration, pride, concern, hope)

<check if="previous retrospective exists">
  <output>
Bob (Scrum Master): "Before we move on, I want to circle back to Epic {{prev_epic_num}}'s retrospective."

Bob (Scrum Master): "We made some commitments in that retro. Let's see how we did."

Bob (Scrum Master): "Action item 1: {{prev_action_1}}. Status: {{prev_action_1_status}}"

Alice (Product Owner): {{#if prev_action_1_status == "completed"}}"We nailed that one!"{{else}}"We... didn't do that one."{{/if}}

Charlie (Senior Dev): {{#if prev_action_1_status == "completed"}}"And it helped! I noticed {{evidence_of_impact}}"{{else}}"Yeah, and I think that's why we had {{consequence_of_not_doing_it}} this epic."{{/if}}

Bob (Scrum Master): "Action item 2: {{prev_action_2}}. Status: {{prev_action_2_status}}"

Dana (QA Engineer): {{#if prev_action_2_status == "completed"}}"This one made testing so much easier this time."{{else}}"If we'd done this, I think testing would've gone faster."{{/if}}

Bob (Scrum Master): "{user_name}, looking at what we committed to last time and what we actually did - what's your reaction?"
</output>

**Action:** WAIT for {user_name} to respond

**Action:** Use the previous retro follow-through as a learning moment about commitment and accountability
</check>

<output>
Bob (Scrum Master): "Alright, we've covered a lot of ground. Let me summarize what I'm hearing..."

Bob (Scrum Master): "**Successes:**"
{{list_success_themes}}

Bob (Scrum Master): "**Challenges:**"
{{list_challenge_themes}}

Bob (Scrum Master): "**Key Insights:**"
{{list_insight_themes}}

Bob (Scrum Master): "Does that capture it? Anyone have something important we missed?"
</output>

**Action:** Allow team members to add any final thoughts on the epic review
**Action:** Ensure {user_name} has opportunity to add their perspective



## Step 7: Next Epic Preparation Discussion - Interactive and Collaborative

<check if="{{next_epic_exists}} == false">
  <output>
Bob (Scrum Master): "Normally we'd discuss preparing for the next epic, but since Epic {{next_epic_num}} isn't defined yet, let's skip to action items."
  </output>
  **Action:** Skip to Step 8
</check>

<output>
Bob (Scrum Master): "Now let's shift gears. Epic {{next_epic_num}} is coming up: '{{next_epic_title}}'"

Bob (Scrum Master): "The question is: are we ready? What do we need to prepare?"

Alice (Product Owner): "From my perspective, we need to make sure {{dependency_concern_1}} from Epic {{epic_number}} is solid before we start building on it."

Charlie (Senior Dev): _concerned_ "I'm worried about {{technical_concern_1}}. We have {{technical_debt_item}} from this epic that'll blow up if we don't address it before Epic {{next_epic_num}}."

Dana (QA Engineer): "And I need {{testing_infrastructure_need}} in place, or we're going to have the same testing bottleneck we had in Story {{bottleneck_story_num}}."

Elena (Junior Dev): "I'm less worried about infrastructure and more about knowledge. I don't understand {{knowledge_gap}} well enough to work on Epic {{next_epic_num}}'s stories."

Bob (Scrum Master): "{user_name}, the team is surfacing some real concerns here. What's your sense of our readiness?"
</output>

**Action:** WAIT for {user_name} to share their assessment

**Action:** Use {user_name}'s input to guide deeper exploration of preparation needs

<output>
Alice (Product Owner): [Reacts to what {user_name} said] "I agree with {user_name} about {{point_of_agreement}}, but I'm still worried about {{lingering_concern}}."

Charlie (Senior Dev): "Here's what I think we need technically before Epic {{next_epic_num}} can start..."

Charlie (Senior Dev): "1. {{tech_prep_item_1}} - estimated {{hours_1}} hours"
Charlie (Senior Dev): "2. {{tech_prep_item_2}} - estimated {{hours_2}} hours"
Charlie (Senior Dev): "3. {{tech_prep_item_3}} - estimated {{hours_3}} hours"

Elena (Junior Dev): "That's like {{total_hours}} hours! That's a full sprint of prep work!"

Charlie (Senior Dev): "Exactly. We can't just jump into Epic {{next_epic_num}} on Monday."

Alice (Product Owner): _frustrated_ "But we have stakeholder pressure to keep shipping features. They're not going to be happy about a 'prep sprint.'"

Bob (Scrum Master): "Let's think about this differently. What happens if we DON'T do this prep work?"

Dana (QA Engineer): "We'll hit blockers in the middle of Epic {{next_epic_num}}, velocity will tank, and we'll ship late anyway."

Charlie (Senior Dev): "Worse - we'll ship something built on top of {{technical_concern_1}}, and it'll be fragile."

Bob (Scrum Master): "{user_name}, you're balancing stakeholder pressure against technical reality. How do you want to handle this?"
</output>

**Action:** WAIT for {user_name} to provide direction on preparation approach

**Action:** Create space for debate and disagreement about priorities

<output>
Alice (Product Owner): [Potentially disagrees with {user_name}'s approach] "I hear what you're saying, {user_name}, but from a business perspective, {{business_concern}}."

Charlie (Senior Dev): [Potentially supports or challenges Alice's point] "The business perspective is valid, but {{technical_counter_argument}}."

Bob (Scrum Master): "We have healthy tension here between business needs and technical reality. That's good - it means we're being honest."

Bob (Scrum Master): "Let's explore a middle ground. Charlie, which of your prep items are absolutely critical vs. nice-to-have?"

Charlie (Senior Dev): "{{critical_prep_item_1}} and {{critical_prep_item_2}} are non-negotiable. {{nice_to_have_prep_item}} can wait."

Alice (Product Owner): "And can any of the critical prep happen in parallel with starting Epic {{next_epic_num}}?"

Charlie (Senior Dev): _thinking_ "Maybe. If we tackle {{first_critical_item}} before the epic starts, we could do {{second_critical_item}} during the first sprint."

Dana (QA Engineer): "But that means Story 1 of Epic {{next_epic_num}} can't depend on {{second_critical_item}}."

Alice (Product Owner): _looking at epic plan_ "Actually, Stories 1 and 2 are about {{independent_work}}, so they don't depend on it. We could make that work."

Bob (Scrum Master): "{user_name}, the team is finding a workable compromise here. Does this approach make sense to you?"
</output>

**Action:** WAIT for {user_name} to validate or adjust the preparation strategy

**Action:** Continue working through preparation needs across all dimensions:

- Dependencies on Epic {{epic_number}} work
- Technical setup and infrastructure
- Knowledge gaps and research needs
- Documentation or specification work
- Testing infrastructure
- Refactoring or debt reduction
- External dependencies (APIs, integrations, etc.)

**Action:** For each preparation area, facilitate team discussion that:

- Identifies specific needs with concrete examples
- Estimates effort realistically based on Epic {{epic_number}} experience
- Assigns ownership to specific agents
- Determines criticality and timing
- Surfaces risks of NOT doing the preparation
- Explores parallel work opportunities
- Brings {user_name} in for key decisions

<output>
Bob (Scrum Master): "I'm hearing a clear picture of what we need before Epic {{next_epic_num}}. Let me summarize..."

**CRITICAL PREPARATION (Must complete before epic starts):**
{{list_critical_prep_items_with_owners_and_estimates}}

**PARALLEL PREPARATION (Can happen during early stories):**
{{list_parallel_prep_items_with_owners_and_estimates}}

**NICE-TO-HAVE PREPARATION (Would help but not blocking):**
{{list_nice_to_have_prep_items}}

Bob (Scrum Master): "Total critical prep effort: {{critical_hours}} hours ({{critical_days}} days)"

Alice (Product Owner): "That's manageable. We can communicate that to stakeholders."

Bob (Scrum Master): "{user_name}, does this preparation plan work for you?"
</output>

**Action:** WAIT for {user_name} final validation of preparation plan



## Step 8: Synthesize Action Items with Significant Change Detection

<output>
Bob (Scrum Master): "Let's capture concrete action items from everything we've discussed."

Bob (Scrum Master): "I want specific, achievable actions with clear owners. Not vague aspirations."
</output>

**Action:** Synthesize themes from Epic {{epic_number}} review discussion into actionable improvements

**Action:** Create specific action items with:

- Clear description of the action
- Assigned owner (specific agent or role)
- Timeline or deadline
- Success criteria (how we'll know it's done)
- Category (process, technical, documentation, team, etc.)

**Action:** Ensure action items are SMART:

- Specific: Clear and unambiguous
- Measurable: Can verify completion
- Achievable: Realistic given constraints
- Relevant: Addresses real issues from retro
- Time-bound: Has clear deadline

<output>
Bob (Scrum Master): "Based on our discussion, here are the action items I'm proposing..."

═══════════════════════════════════════════════════════════
📝 EPIC {{epic_number}} ACTION ITEMS:
═══════════════════════════════════════════════════════════

**Process Improvements:**

1. {{action_item_1}}
   Owner: {{agent_1}}
   Deadline: {{timeline_1}}
   Success criteria: {{criteria_1}}

2. {{action_item_2}}
   Owner: {{agent_2}}
   Deadline: {{timeline_2}}
   Success criteria: {{criteria_2}}

Charlie (Senior Dev): "I can own action item 1, but {{timeline_1}} is tight. Can we push it to {{alternative_timeline}}?"

Bob (Scrum Master): "What do others think? Does that timing still work?"

Alice (Product Owner): "{{alternative_timeline}} works for me, as long as it's done before Epic {{next_epic_num}} starts."

Bob (Scrum Master): "Agreed. Updated to {{alternative_timeline}}."

**Technical Debt:**

1. {{debt_item_1}}
   Owner: {{agent_3}}
   Priority: {{priority_1}}
   Estimated effort: {{effort_1}}

2. {{debt_item_2}}
   Owner: {{agent_4}}
   Priority: {{priority_2}}
   Estimated effort: {{effort_2}}

Dana (QA Engineer): "For debt item 1, can we prioritize that as high? It caused testing issues in three different stories."

Charlie (Senior Dev): "I marked it medium because {{reasoning}}, but I hear your point."

Bob (Scrum Master): "{user_name}, this is a priority call. Testing impact vs. {{reasoning}} - how do you want to prioritize it?"
</output>

**Action:** WAIT for {user_name} to help resolve priority discussions

<output>
**Documentation:**
1. {{doc_need_1}}
   Owner: {{agent_5}}
   Deadline: {{timeline_3}}

2. {{doc_need_2}}
   Owner: {{agent_6}}
   Deadline: {{timeline_4}}

**Team Agreements:**

- {{agreement_1}}
- {{agreement_2}}
- {{agreement_3}}

Bob (Scrum Master): "These agreements are how we're committing to work differently going forward."

Elena (Junior Dev): "I like agreement 2 - that would've saved me on Story {{difficult_story_num}}."

═══════════════════════════════════════════════════════════
🚀 EPIC {{next_epic_num}} PREPARATION TASKS:
═══════════════════════════════════════════════════════════

**Technical Setup:**
[ ] {{setup_task_1}}
Owner: {{owner_1}}
Estimated: {{est_1}}

[ ] {{setup_task_2}}
Owner: {{owner_2}}
Estimated: {{est_2}}

**Knowledge Development:**
[ ] {{research_task_1}}
Owner: {{owner_3}}
Estimated: {{est_3}}

**Cleanup/Refactoring:**
[ ] {{refactor_task_1}}
Owner: {{owner_4}}
Estimated: {{est_4}}

**Total Estimated Effort:** {{total_hours}} hours ({{total_days}} days)

═══════════════════════════════════════════════════════════
⚠️ CRITICAL PATH:
═══════════════════════════════════════════════════════════

**Blockers to Resolve Before Epic {{next_epic_num}}:**

1. {{critical_item_1}}
   Owner: {{critical_owner_1}}
   Must complete by: {{critical_deadline_1}}

2. {{critical_item_2}}
   Owner: {{critical_owner_2}}
   Must complete by: {{critical_deadline_2}}
   </output>

**Action:** CRITICAL ANALYSIS - Detect if discoveries require epic updates

**Action:** Check if any of the following are true based on retrospective discussion:

- Architectural assumptions from planning proven wrong during Epic {{epic_number}}
- Major scope changes or descoping occurred that affects next epic
- Technical approach needs fundamental change for Epic {{next_epic_num}}
- Dependencies discovered that Epic {{next_epic_num}} doesn't account for
- User needs significantly different than originally understood
- Performance/scalability concerns that affect Epic {{next_epic_num}} design
- Security or compliance issues discovered that change approach
- Integration assumptions proven incorrect
- Team capacity or skill gaps more severe than planned
- Technical debt level unsustainable without intervention

<check if="significant discoveries detected">
  <output>

═══════════════════════════════════════════════════════════
🚨 SIGNIFICANT DISCOVERY ALERT 🚨
═══════════════════════════════════════════════════════════

Bob (Scrum Master): "{user_name}, we need to flag something important."

Bob (Scrum Master): "During Epic {{epic_number}}, the team uncovered findings that may require updating the plan for Epic {{next_epic_num}}."

**Significant Changes Identified:**

1. {{significant_change_1}}
   Impact: {{impact_description_1}}

2. {{significant_change_2}}
   Impact: {{impact_description_2}}

{{#if significant_change_3}} 3. {{significant_change_3}}
Impact: {{impact_description_3}}
{{/if}}

Charlie (Senior Dev): "Yeah, when we discovered {{technical_discovery}}, it fundamentally changed our understanding of {{affected_area}}."

Alice (Product Owner): "And from a product perspective, {{product_discovery}} means Epic {{next_epic_num}}'s stories are based on wrong assumptions."

Dana (QA Engineer): "If we start Epic {{next_epic_num}} as-is, we're going to hit walls fast."

**Impact on Epic {{next_epic_num}}:**

The current plan for Epic {{next_epic_num}} assumes:

- {{wrong_assumption_1}}
- {{wrong_assumption_2}}

But Epic {{epic_number}} revealed:

- {{actual_reality_1}}
- {{actual_reality_2}}

This means Epic {{next_epic_num}} likely needs:
{{list_likely_changes_needed}}

**RECOMMENDED ACTIONS:**

1. Review and update Epic {{next_epic_num}} definition based on new learnings
2. Update affected stories in Epic {{next_epic_num}} to reflect reality
3. Consider updating architecture or technical specifications if applicable
4. Hold alignment session with Product Owner before starting Epic {{next_epic_num}}
   {{#if prd_update_needed}}5. Update PRD sections affected by new understanding{{/if}}

Bob (Scrum Master): "**Epic Update Required**: YES - Schedule epic planning review session"

Bob (Scrum Master): "{user_name}, this is significant. We need to address this before committing to Epic {{next_epic_num}}'s current plan. How do you want to handle it?"
</output>

**Action:** WAIT for {user_name} to decide on how to handle the significant changes

**Action:** Add epic review session to critical path if user agrees

  <output>
Alice (Product Owner): "I agree with {user_name}'s approach. Better to adjust the plan now than fail mid-epic."

Charlie (Senior Dev): "This is why retrospectives matter. We caught this before it became a disaster."

Bob (Scrum Master): "Adding to critical path: Epic {{next_epic_num}} planning review session before epic kickoff."
</output>
</check>

<check if="no significant discoveries">
  <output>
Bob (Scrum Master): "Good news - nothing from Epic {{epic_number}} fundamentally changes our plan for Epic {{next_epic_num}}. The plan is still sound."

Alice (Product Owner): "We learned a lot, but the direction is right."
</output>
</check>

<output>
Bob (Scrum Master): "Let me show you the complete action plan..."

Bob (Scrum Master): "That's {{total_action_count}} action items, {{prep_task_count}} preparation tasks, and {{critical_count}} critical path items."

Bob (Scrum Master): "Everyone clear on what they own?"
</output>

**Action:** Give each agent with assignments a moment to acknowledge their ownership

**Action:** Ensure {user_name} approves the complete action plan



## Step 9: Critical Readiness Exploration - Interactive Deep Dive

<output>
Bob (Scrum Master): "Before we close, I want to do a final readiness check."

Bob (Scrum Master): "Epic {{epic_number}} is marked complete in sprint-status, but is it REALLY done?"

Alice (Product Owner): "What do you mean, Bob?"

Bob (Scrum Master): "I mean truly production-ready, stakeholders happy, no loose ends that'll bite us later."

Bob (Scrum Master): "{user_name}, let's walk through this together."
</output>

**Action:** Explore testing and quality state through natural conversation

<output>
Bob (Scrum Master): "{user_name}, tell me about the testing for Epic {{epic_number}}. What verification has been done?"
</output>

**Action:** WAIT for {user_name} to describe testing status

<output>
Dana (QA Engineer): [Responds to what {user_name} shared] "I can add to that - {{additional_testing_context}}."

Dana (QA Engineer): "But honestly, {{testing_concern_if_any}}."

Bob (Scrum Master): "{user_name}, are you confident Epic {{epic_number}} is production-ready from a quality perspective?"
</output>

**Action:** WAIT for {user_name} to assess quality readiness

<check if="{user_name} expresses concerns">
  <output>
Bob (Scrum Master): "Okay, let's capture that. What specific testing is still needed?"

Dana (QA Engineer): "I can handle {{testing_work_needed}}, estimated {{testing_hours}} hours."

Bob (Scrum Master): "Adding to critical path: Complete {{testing_work_needed}} before Epic {{next_epic_num}}."
</output>
**Action:** Add testing completion to critical path
</check>

**Action:** Explore deployment and release status

<output>
Bob (Scrum Master): "{user_name}, what's the deployment status for Epic {{epic_number}}? Is it live in production, scheduled for deployment, or still pending?"
</output>

**Action:** WAIT for {user_name} to provide deployment status

<check if="not yet deployed">
  <output>
Charlie (Senior Dev): "If it's not deployed yet, we need to factor that into Epic {{next_epic_num}} timing."

Bob (Scrum Master): "{user_name}, when is deployment planned? Does that timing work for starting Epic {{next_epic_num}}?"
</output>

**Action:** WAIT for {user_name} to clarify deployment timeline

**Action:** Add deployment milestone to critical path with agreed timeline
</check>

**Action:** Explore stakeholder acceptance

<output>
Bob (Scrum Master): "{user_name}, have stakeholders seen and accepted the Epic {{epic_number}} deliverables?"

Alice (Product Owner): "This is important - I've seen 'done' epics get rejected by stakeholders and force rework."

Bob (Scrum Master): "{user_name}, any feedback from stakeholders still pending?"
</output>

**Action:** WAIT for {user_name} to describe stakeholder acceptance status

<check if="acceptance incomplete or feedback pending">
  <output>
Alice (Product Owner): "We should get formal acceptance before moving on. Otherwise Epic {{next_epic_num}} might get interrupted by rework."

Bob (Scrum Master): "{user_name}, how do you want to handle stakeholder acceptance? Should we make it a critical path item?"
</output>

**Action:** WAIT for {user_name} decision

**Action:** Add stakeholder acceptance to critical path if user agrees
</check>

**Action:** Explore technical health and stability

<output>
Bob (Scrum Master): "{user_name}, this is a gut-check question: How does the codebase feel after Epic {{epic_number}}?"

Bob (Scrum Master): "Stable and maintainable? Or are there concerns lurking?"

Charlie (Senior Dev): "Be honest, {user_name}. We've all shipped epics that felt... fragile."
</output>

**Action:** WAIT for {user_name} to assess codebase health

<check if="{user_name} expresses stability concerns">
  <output>
Charlie (Senior Dev): "Okay, let's dig into that. What's causing those concerns?"

Charlie (Senior Dev): [Helps {user_name} articulate technical concerns]

Bob (Scrum Master): "What would it take to address these concerns and feel confident about stability?"

Charlie (Senior Dev): "I'd say we need {{stability_work_needed}}, roughly {{stability_hours}} hours."

Bob (Scrum Master): "{user_name}, is addressing this stability work worth doing before Epic {{next_epic_num}}?"
</output>

**Action:** WAIT for {user_name} decision

**Action:** Add stability work to preparation sprint if user agrees
</check>

**Action:** Explore unresolved blockers

<output>
Bob (Scrum Master): "{user_name}, are there any unresolved blockers or technical issues from Epic {{epic_number}} that we're carrying forward?"

Dana (QA Engineer): "Things that might create problems for Epic {{next_epic_num}} if we don't deal with them?"

Bob (Scrum Master): "Nothing is off limits here. If there's a problem, we need to know."
</output>

**Action:** WAIT for {user_name} to surface any blockers

<check if="blockers identified">
  <output>
Bob (Scrum Master): "Let's capture those blockers and figure out how they affect Epic {{next_epic_num}}."

Charlie (Senior Dev): "For {{blocker_1}}, if we leave it unresolved, it'll {{impact_description_1}}."

Alice (Product Owner): "That sounds critical. We need to address that before moving forward."

Bob (Scrum Master): "Agreed. Adding to critical path: Resolve {{blocker_1}} before Epic {{next_epic_num}} kickoff."

Bob (Scrum Master): "Who owns that work?"
</output>

**Action:** Assign blocker resolution to appropriate agent
**Action:** Add to critical path with priority and deadline
</check>

**Action:** Synthesize the readiness assessment

<output>
Bob (Scrum Master): "Okay {user_name}, let me synthesize what we just uncovered..."

**EPIC {{epic_number}} READINESS ASSESSMENT:**

Testing & Quality: {{quality_status}}
{{#if quality_concerns}}⚠️ Action needed: {{quality_action_needed}}{{/if}}

Deployment: {{deployment_status}}
{{#if deployment_pending}}⚠️ Scheduled for: {{deployment_date}}{{/if}}

Stakeholder Acceptance: {{acceptance_status}}
{{#if acceptance_incomplete}}⚠️ Action needed: {{acceptance_action_needed}}{{/if}}

Technical Health: {{stability_status}}
{{#if stability_concerns}}⚠️ Action needed: {{stability_action_needed}}{{/if}}

Unresolved Blockers: {{blocker_status}}
{{#if blockers_exist}}⚠️ Must resolve: {{blocker_list}}{{/if}}

Bob (Scrum Master): "{user_name}, does this assessment match your understanding?"
</output>

**Action:** WAIT for {user_name} to confirm or correct the assessment

<output>
Bob (Scrum Master): "Based on this assessment, Epic {{epic_number}} is {{#if all_clear}}fully complete and we're clear to proceed{{else}}complete from a story perspective, but we have {{critical_work_count}} critical items before Epic {{next_epic_num}}{{/if}}."

Alice (Product Owner): "This level of thoroughness is why retrospectives are valuable."

Charlie (Senior Dev): "Better to catch this now than three stories into the next epic."
</output>



## Step 10: Retrospective Closure with Celebration and Commitment

<output>
Bob (Scrum Master): "We've covered a lot of ground today. Let me bring this retrospective to a close."

═══════════════════════════════════════════════════════════
✅ RETROSPECTIVE COMPLETE
═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Epic {{epic_number}}: {{epic_title}} - REVIEWED"

**Key Takeaways:**

1. {{key_lesson_1}}
2. {{key_lesson_2}}
3. {{key_lesson_3}}
   {{#if key_lesson_4}}4. {{key_lesson_4}}{{/if}}

Alice (Product Owner): "That first takeaway is huge - {{impact_of_lesson_1}}."

Charlie (Senior Dev): "And lesson 2 is something we can apply immediately."

Bob (Scrum Master): "Commitments made today:"

- Action Items: {{action_count}}
- Preparation Tasks: {{prep_task_count}}
- Critical Path Items: {{critical_count}}

Dana (QA Engineer): "That's a lot of commitments. We need to actually follow through this time."

Bob (Scrum Master): "Agreed. Which is why we'll review these action items in our next standup."

═══════════════════════════════════════════════════════════
🎯 NEXT STEPS:
═══════════════════════════════════════════════════════════

1. Execute Preparation Sprint (Est: {{prep_days}} days)
2. Complete Critical Path items before Epic {{next_epic_num}}
3. Review action items in next standup
   {{#if epic_update_needed}}4. Hold Epic {{next_epic_num}} planning review session{{else}}4. Begin Epic {{next_epic_num}} planning when preparation complete{{/if}}

Elena (Junior Dev): "{{prep_days}} days of prep work is significant, but necessary."

Alice (Product Owner): "I'll communicate the timeline to stakeholders. They'll understand if we frame it as 'ensuring Epic {{next_epic_num}} success.'"

═══════════════════════════════════════════════════════════

Bob (Scrum Master): "Before we wrap, I want to take a moment to acknowledge the team."

Bob (Scrum Master): "Epic {{epic_number}} delivered {{completed_stories}} stories with {{velocity_description}} velocity. We overcame {{blocker_count}} blockers. We learned a lot. That's real work by real people."

Charlie (Senior Dev): "Hear, hear."

Alice (Product Owner): "I'm proud of what we shipped."

Dana (QA Engineer): "And I'm excited about Epic {{next_epic_num}} - especially now that we're prepared for it."

Bob (Scrum Master): "{user_name}, any final thoughts before we close?"
</output>

**Action:** WAIT for {user_name} to share final reflections

<output>
Bob (Scrum Master): [Acknowledges what {user_name} shared] "Thank you for that, {user_name}."

Bob (Scrum Master): "Alright team - great work today. We learned a lot from Epic {{epic_number}}. Let's use these insights to make Epic {{next_epic_num}} even better."

Bob (Scrum Master): "See you all when prep work is done. Meeting adjourned!"

═══════════════════════════════════════════════════════════
</output>

**Action:** Prepare to save retrospective summary document



## Step 11: Save Retrospective and Update Sprint Status

**Action:** Ensure retrospectives folder exists: {retrospectives_folder}
**Action:** Create folder if it doesn't exist

**Action:** Generate comprehensive retrospective summary document including:

- Epic summary and metrics
- Team participants
- Successes and strengths identified
- Challenges and growth areas
- Key insights and learnings
- Previous retro follow-through analysis (if applicable)
- Next epic preview and dependencies
- Action items with owners and timelines
- Preparation tasks for next epic
- Critical path items
- Significant discoveries and epic update recommendations (if any)
- Readiness assessment
- Commitments and next steps

**Action:** Format retrospective document as readable markdown with clear sections
**Action:** Set filename: {retrospectives_folder}/epic-{{epic_number}}-retro-{date}.md
**Action:** Save retrospective document

<output>
✅ Retrospective document saved: {retrospectives_folder}/epic-{{epic_number}}-retro-{date}.md
</output>

**Action:** Update {sprint_status_file} to mark retrospective as completed

**Action:** Load the FULL file: {sprint_status_file}
**Action:** Find development_status key "epic-{{epic_number}}-retrospective"
**Action:** Verify current status (typically "optional" or "pending")
**Action:** Update development_status["epic-{{epic_number}}-retrospective"] = "done"
**Action:** Save file, preserving ALL comments and structure including STATUS DEFINITIONS

<check if="update successful">
  <output>
✅ Retrospective marked as completed in {sprint_status_file}

Retrospective key: epic-{{epic_number}}-retrospective
Status: {{previous_status}} → done
</output>
</check>

<check if="retrospective key not found">
  <output>
⚠️ Could not update retrospective status: epic-{{epic_number}}-retrospective not found in {sprint_status_file}

Retrospective document was saved successfully, but {sprint_status_file} may need manual update.
</output>
</check>



## Step 12: Final Summary and Handoff

<output>
**✅ Retrospective Complete, {user_name}!**

**Epic Review:**

- Epic {{epic_number}}: {{epic_title}} reviewed
- Retrospective Status: completed
- Retrospective saved: {retrospectives_folder}/epic-{{epic_number}}-retro-{date}.md

**Commitments Made:**

- Action Items: {{action_count}}
- Preparation Tasks: {{prep_task_count}}
- Critical Path Items: {{critical_count}}

**Next Steps:**

1. **Review retrospective summary**: {retrospectives_folder}/epic-{{epic_number}}-retro-{date}.md

2. **Execute preparation sprint** (Est: {{prep_days}} days)
   - Complete {{critical_count}} critical path items
   - Execute {{prep_task_count}} preparation tasks
   - Verify all action items are in progress

3. **Review action items in next standup**
   - Ensure ownership is clear
   - Track progress on commitments
   - Adjust timelines if needed

{{#if epic_update_needed}} 4. **IMPORTANT: Schedule Epic {{next_epic_num}} planning review session**

- Significant discoveries from Epic {{epic_number}} require epic updates
- Review and update affected stories
- Align team on revised approach
- Do NOT start Epic {{next_epic_num}} until review is complete
  {{else}}

4. **Begin Epic {{next_epic_num}} when ready**
   - Start creating stories with SM agent's `create-story`
   - Epic will be marked as `in-progress` automatically when first story is created
   - Ensure all critical path items are done first
     {{/if}}

**Team Performance:**
Epic {{epic_number}} delivered {{completed_stories}} stories with {{velocity_summary}}. The retrospective surfaced {{insight_count}} key insights and {{significant_discovery_count}} significant discoveries. The team is well-positioned for Epic {{next_epic_num}} success.

{{#if significant_discovery_count > 0}}
⚠️ **REMINDER**: Epic update required before starting Epic {{next_epic_num}}
{{/if}}

---

Bob (Scrum Master): "Great session today, {user_name}. The team did excellent work."

Alice (Product Owner): "See you at epic planning!"

Charlie (Senior Dev): "Time to knock out that prep work."

</output>



</workflow>

<facilitation-guidelines>
<guideline>PARTY MODE REQUIRED: All agent dialogue uses "Name (Role): dialogue" format</guideline>
<guideline>Scrum Master maintains psychological safety throughout - no blame or judgment</guideline>
<guideline>Focus on systems and processes, not individual performance</guideline>
<guideline>Create authentic team dynamics: disagreements, diverse perspectives, emotions</guideline>
<guideline>User ({user_name}) is active participant, not passive observer</guideline>
<guideline>Encourage specific examples over general statements</guideline>
<guideline>Balance celebration of wins with honest assessment of challenges</guideline>
<guideline>Ensure every voice is heard - all agents contribute</guideline>
<guideline>Action items must be specific, achievable, and owned</guideline>
<guideline>Forward-looking mindset - how do we improve for next epic?</guideline>
<guideline>Intent-based facilitation, not scripted phrases</guideline>
<guideline>Deep story analysis provides rich material for discussion</guideline>
<guideline>Previous retro integration creates accountability and continuity</guideline>
<guideline>Significant change detection prevents epic misalignment</guideline>
<guideline>Critical verification prevents starting next epic prematurely</guideline>
<guideline>Document everything - retrospective insights are valuable for future reference</guideline>
<guideline>Two-part structure ensures both reflection AND preparation</guideline>
</facilitation-guidelines>
