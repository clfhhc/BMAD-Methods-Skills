import assert from 'node:assert';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { convertWorkflowToSkill } from '../src/converters/workflow-converter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures', 'workflow-instructions');
const workflowPath = path.join(fixturesDir, 'workflow.yaml');
const instructionsPath = path.join(fixturesDir, 'instructions.md');

test('workflow-converter: instructions link is local, not GitHub', async () => {
  const out = await convertWorkflowToSkill(
    workflowPath,
    instructionsPath,
    fixturesDir,
    null,
    {}
  );

  assert.ok(
    out.includes('](instructions.md)'),
    'Instructions section must link to local instructions.md'
  );
  assert.ok(
    !out.includes('github.com'),
    'Instructions must not contain GitHub URLs'
  );
});
