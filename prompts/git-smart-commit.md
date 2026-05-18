---
name: git-smart-commit
description: Group all staged and unstaged changes by functional logic and propose a conventional commit plan
---

Group all staged and unstaged changes by functional logic and propose a conventional commit plan.

1. Run `git status --short` to get the change list
2. Run `git diff` and `git diff --cached` to get all diffs
3. Group files by functional logic (project config, data layer, components, pages, styles, utilities, tests, docs)
4. Produce a commit plan for the user to confirm before executing
5. Each commit uses conventional commit format: `<type>(<scope>): <description>`

Please load the git-smart-commit skill first to get the complete grouping rules and commit format conventions.
