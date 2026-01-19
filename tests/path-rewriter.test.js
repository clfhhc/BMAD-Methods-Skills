import assert from 'node:assert';
import { test } from 'node:test';
import { rewriteBmadPaths } from '../src/utils/path-rewriter.js';

test('rewriteBmadPaths', async (t) => {
  await t.test('rewrites paths using skillMap (exact match)', () => {
    const skillMap = new Map();
    // Keys normalized by converter (no src/modules/)
    skillMap.set('bmm/workflows/testarch/ci/workflow.yaml', {
      module: 'bmm',
      name: 'testarch-ci',
    });

    const content =
      'path: {project-root}/_bmad/bmm/workflows/testarch/ci/workflow.yaml';
    const result = rewriteBmadPaths(content, 'bmm', skillMap);

    assert.strictEqual(result, 'path: {skill-root}/bmm/testarch-ci/SKILL.md');
  });

  await t.test('rewrites directory paths using skillMap (derived)', () => {
    const skillMap = new Map();
    skillMap.set('bmm/workflows/testarch/ci/workflow.yaml', {
      module: 'bmm',
      name: 'testarch-ci',
    });

    const content = 'dir: {project-root}/_bmad/bmm/workflows/testarch/ci';
    const result = rewriteBmadPaths(content, 'bmm', skillMap);

    // Directory should map to skill root
    assert.strictEqual(result, 'dir: {skill-root}/bmm/testarch-ci');
  });

  await t.test('falls back to regex for unknown paths', () => {
    const skillMap = new Map();
    // No entry for this path

    const content =
      'path: {project-root}/_bmad/bmm/workflows/some-new-flow/workflow.yaml';
    const result = rewriteBmadPaths(content, 'bmm', skillMap);

    // Should fallback to legacy regex: bmm/some-new-flow/SKILL.md
    assert.strictEqual(result, 'path: {skill-root}/bmm/some-new-flow/SKILL.md');
  });

  await t.test('replaces variable placeholders', () => {
    const content = 'conf: {project-root}/_bmad/bmm/config.yaml';
    const result = rewriteBmadPaths(content, 'bmm');

    // {skill-config} was consolidated to {skill-root}
    assert.strictEqual(result, 'conf: {skill-root}/bmm/config.yaml');
  });
});
