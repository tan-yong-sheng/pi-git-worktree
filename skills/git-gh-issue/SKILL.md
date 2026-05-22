---
name: git-gh-issue
description: Automatically generate and create structured GitHub Issues from conversation context or code artifacts.
---

# Git GH Issue

Generate a structured GitHub Issue from context or artifacts, then create it via `gh issue create`.

---

## Flow

### 1. Detect Mode & Gather Context
- **Mode**: Choose between **Conversation** (chat context) or **Code-aware** (diffs, errors, test logs).
- **Research**: Investigate repo structure, documentation, and any provided links. Determine the semantic type using the reference table below.

### 2. Collect Details
- **Granularity Assessment**: If complex, propose a "parent" issue with sub-issues. Confirm with the user.
- **Questions**: Ask missing details one-by-one (Type, Priority, Labels, Related). Skip already-known info.
- **Code-aware inference**: Auto-detect type/details from diffs; present for user confirmation.

### 3. Generate & Confirm
- **Template**: Use `references/issue-templates.md`.
- **Title**: `<type>: <short description>` (max 72 chars, imperative verb).
- **Preview**: Show the full markdown-formatted issue (title, body, labels) for approval.

### 4. Create
- Execute `gh issue create`.
- Handle label creation if missing.
- Link to the resulting issue.

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

## Constraints
- **No file paths/links**: Use functional descriptions.
- **Verification**: 🧪 steps MUST include "Expected result".
- **Duplicates**: Scan `gh issue list` first.
