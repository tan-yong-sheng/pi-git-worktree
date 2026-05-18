---
name: git-pr-gen
description: Automatically generate a Pull Request Title and Description from the diff between the current branch and the target branch
---

Automatically generate a Pull Request Title and Description from the diff between the current branch and the target branch.

1. Run `git branch --show-current` to confirm the current branch
2. Run `git log --oneline master..HEAD` to get the commit list
3. Run `git diff --stat master..HEAD` to get file change statistics
4. Run `git diff master..HEAD` to get the full diff
5. Use the git-pr-description skill format to generate the PR Title and Description
6. Output in markdown code block format so the user can copy and paste directly

Please load the git-pr-description skill first to get the complete formatting rules.
