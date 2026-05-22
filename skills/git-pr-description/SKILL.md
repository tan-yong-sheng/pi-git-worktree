---
name: git-pr-description
description: Automatically generate a Pull Request Title and Description from the diff.
---

# Git PR Description

Generate a structured PR Title and Description from branch diffs.

---

## Flow

### 1. Gather Context
- **Analyze Changes**: Get commits (`git log`) and diffs (`git diff`) relative to the base branch.
- **Synthesis**: Determine the purpose, scope, and impact (breaking/non-breaking).

### 2. Generate PR Title
- **Format**: `<type>: <short description>`
- **Rules**: English, <72 chars, imperative verb.
- **Type**: Use the **Semantic Type Reference** below.

### 3. Generate Description
- **Structure**: Use `references/pr-template.md`.
- **Content**: Group by functional area. Use pure functional descriptions (e.g., "add accordion animation")—**NEVER include file paths**.
- **🧪 Test Steps**: Every module listed must have an "Expected result".

### 4. Review
- Preview the full markdown in a code block.
- Ask the user to approve or suggest edits.

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
- **Consistency**: Title and description must follow functional-only style.
