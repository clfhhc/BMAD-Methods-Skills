import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'node:path';

/**
 * Fetches or clones the BMAD-METHOD repository
 * @param {string} repoUrl - Git repository URL
 * @param {string} branch - Branch to checkout
 * @param {string} tempDir - Temporary directory to clone into
 * @returns {Promise<string>} Path to the cloned repository root
 */
export async function fetchBmadRepo(
  repoUrl,
  branch,
  tempDir,
) {
  if (!repoUrl || !branch || !tempDir) {
    throw new Error(
      'Missing required parameters: repoUrl, branch, and tempDir are required',
    );
  }
  
  const git = simpleGit();
  
  try {
    // Check if directory exists and is a git repo
    const gitPath = path.join(tempDir, '.git');
    const isRepo = await fs.pathExists(gitPath);
    
    if (isRepo) {
      console.log(`Updating existing repository at ${tempDir}...`);
      const repoGit = simpleGit(tempDir);

      try {
        await repoGit.fetch('origin', branch);
        await repoGit.reset(['--hard', `origin/${branch}`]);
        console.log(`✓ Repository updated to latest ${branch}`);
      } catch (_fetchError) {
        console.warn(
          'Warning: Failed to update repository, attempting fresh clone...',
        );
        await fs.remove(tempDir);
        await git.clone(repoUrl, tempDir, [
          '--depth',
          '1',
          '--branch',
          branch,
        ]);
        console.log('✓ Repository cloned successfully');
      }
    } else {
      // Clean up if directory exists but isn't a repo
      if (await fs.pathExists(tempDir)) {
        await fs.remove(tempDir);
      }

      console.log(
        `Cloning ${repoUrl} (branch: ${branch}) to ${tempDir}...`,
      );
      await git.clone(repoUrl, tempDir, [
        '--depth',
        '1',
        '--branch',
        branch,
      ]);

      // Verify clone was successful
      if (!(await fs.pathExists(path.join(tempDir, '.git')))) {
        throw new Error('Clone completed but .git directory not found');
      }

      console.log('✓ Repository cloned successfully');
    }
    
    return tempDir;
  } catch (error) {
    if (
      error.message.includes('not found') ||
      error.message.includes('does not exist')
    ) {
      throw new Error(
        `Branch '${branch}' not found in repository. Please check the branch name.`,
      );
    }
    if (
      error.message.includes('permission denied') ||
      error.message.includes('EACCES')
    ) {
      throw new Error(
        `Permission denied accessing ${tempDir}. Check directory permissions.`,
      );
    }
    throw new Error(
      `Failed to fetch BMAD repository: ${error.message}`,
    );
  }
}
