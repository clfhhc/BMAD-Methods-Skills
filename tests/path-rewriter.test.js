import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { rewriteBmadPaths } from '../src/utils/path-rewriter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8')
);
const pathPatterns = config.pathPatterns || [];

test('rewriteBmadPaths', async (t) => {
  await t.test('rewrites paths using skillMap (exact match)', () => {
    const skillMap = new Map();
    skillMap.set('bmm/workflows/testarch/ci/workflow.yaml', {
      module: 'bmm',
      name: 'testarch-ci',
    });

    const content =
      'path: {project-root}/_bmad/bmm/workflows/testarch/ci/workflow.yaml';
    const result = rewriteBmadPaths(content, skillMap, pathPatterns);

    assert.strictEqual(result, 'path: {skill-root}/bmm/testarch-ci/SKILL.md');
  });

  await t.test('rewrites directory paths using skillMap (derived)', () => {
    const skillMap = new Map();
    skillMap.set('bmm/workflows/testarch/ci/workflow.yaml', {
      module: 'bmm',
      name: 'testarch-ci',
    });

    const content = 'dir: {project-root}/_bmad/bmm/workflows/testarch/ci';
    const result = rewriteBmadPaths(content, skillMap, pathPatterns);

    assert.strictEqual(result, 'dir: {skill-root}/bmm/testarch-ci');
  });

  await t.test('falls back to config pathPatterns for unknown paths', () => {
    const skillMap = new Map();
    const content =
      'path: {project-root}/_bmad/bmm/workflows/some-new-flow/workflow.yaml';
    const result = rewriteBmadPaths(content, skillMap, pathPatterns);

    assert.strictEqual(result, 'path: {skill-root}/bmm/some-new-flow/SKILL.md');
  });

  await t.test('replaces variable placeholders via pathPatterns', () => {
    const content = 'conf: {project-root}/_bmad/bmm/config.yaml';
    const result = rewriteBmadPaths(content, null, pathPatterns);

    assert.strictEqual(result, 'conf: {skill-root}/bmm/config.yaml');
  });
});
