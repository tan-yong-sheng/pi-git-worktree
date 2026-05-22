---
name: git-smart-commit
description: Automatically split messy git changes into multiple meaningful conventional commits grouped by functional logic.
---

# Git Smart Commit

Group staged and unstaged changes by functional logic and commit them in batches.

---

## Flow

### 1. Analysis
- **Identify Changes**: `git status --short`.
- **Group**: Categorize files by logic (e.g., component-specific, data layer, configuration, tests).
- **Naming**: Use the **Semantic Type Reference** below.

### 2. Commit Plan
- **Summarize**: Present the plan to the user for confirmation.
- **Batches**:
  ```bash
  git add <files>
  git commit -m "<type>(<scope>): <subject>"
  ```

### 3. Execution & Verification
- Commit each batch sequentially.
- Verify: `git log --oneline -N` (N = commits created).

---

## Semantic Type Reference

| Type | When to use |
| ---- | ----------- |
| `feat` | New features |
| `fix` | Bug reports |
| `refactor` | Code changes without behavior change |
| `perf` | Performance improvements |
| `chore` | Build/maintenance/deps |
| `docs` | Documentation |
| `style` | Formatting/whitespace |
| `test` | Adding/fixing tests |
| `ci` | CI configuration |
| `revert` | Reverting commits |
| `build` | Build system/external dependencies |

---

## Rules
- **Subject**: Imperative verb (add, fix, remove...), max 50 chars, no period.
- **Scope**: Use component name (e.g., `hero`), `data`, `style`, or `project` (config).
- **Large Changes**: (> 50 files) Group summary first, then ask for confirmation.
