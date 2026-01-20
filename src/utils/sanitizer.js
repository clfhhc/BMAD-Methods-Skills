import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../../config.json');
export const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

/**
 * Sanitizes a skill name for use in file paths and URLs.
 * Ensures lowercase, removes invalid characters, and collapses hyphens.
 * @param {string} name - The original skill name
 * @returns {string} The sanitized, lowercase name
 */
export function sanitizeSkillName(name) {
  if (!name) return '';

  const patterns = config.sanitization || {};
  const invalidCharsRegex = patterns.invalidCharsRegex || '[^a-z0-9-]';
  const multipleHyphensRegex = patterns.multipleHyphensRegex || '-+';
  const leadingTrailingHyphensRegex =
    patterns.leadingTrailingHyphensRegex || '^-|-$';

  return name
    .toLowerCase()
    .replace(new RegExp(invalidCharsRegex, 'g'), '-')
    .replace(new RegExp(multipleHyphensRegex, 'g'), '-')
    .replace(new RegExp(leadingTrailingHyphensRegex, 'g'), ''); // Remove leading/trailing hyphens
}
