---
name: git-pr-description
description: Automatically generate a Pull Request Title and Description from the diff between the current branch and the target branch. Triggers when the user mentions "PR", "Pull Request", "write PR", "PR description", or "create PR".
---

# Git PR Description — Auto-generate PR Title and Description

Generate a structured PR Title and Description from all commits and diffs on the current branch relative to the target branch (default `master`).

---

## Flow

### 1. Confirm Branch Info

Get the current branch name and target branch:

```bash
git branch --show-current
```

The default target branch is `master`. If the user specifies a different base branch, use the user's choice.

Confirm that the current branch has commit differences relative to the target branch:

```bash
git log --oneline master..HEAD
```

If there are no differences, inform the user that "the current branch has no differences from the target branch" and exit.

---

### 2. Collect Change Info

Get the full commit list and diff:

```bash
# Commit summary
git log --oneline master..HEAD

# Detailed commit messages
git log --format="%h %s%n%b" master..HEAD

# Changed file statistics
git diff --stat master..HEAD

# Full diff (for analyzing specific changes)
git diff master..HEAD
```

---

### 3. Analyze Changes

Based on the collected info, analyze:

- **Purpose of the changes**: what problem this branch solves or what feature it adds
- **Scope of modifications**: which components, modules, and config files are affected
- **Impact**: whether there are breaking changes, whether existing functionality is affected

---

### 4. Generate PR Title

#### Title Format

```
<type>: <short description>
```

**Type reference table:**

| type       | When to use           |
| ---------- | --------------------- |
| `feat`     | New feature           |
| `fix`      | Bug fix               |
| `refactor` | Refactoring           |
| `style`    | Style adjustments     |
| `chore`    | Chores, configuration |
| `docs`     | Documentation updates |
| `test`     | Test-related          |

**Title rules:**

- Use English for descriptions
- No more than 72 characters
- Start with an imperative verb: add, adjust, fix, remove, refactor
- Precisely describe the core purpose of this PR

---

### 5. Generate PR Description

Use the template in `references/pr-template.md` to generate the Description.

#### Description Structure

```markdown
## 🎯 Why this change

Briefly describe the background and motivation for this PR

## ⚠️ What changed

Grouped by feature and requirement:

- **Feature name / Requirement item**: describe the business goal of this group of changes
- **Direction of change**: briefly describe (performance, fix, style, etc.)
- **Content**: list specific changes, **never** include any file paths (including relative paths), always use functional descriptions instead, e.g. "add accordion expand animation" instead of "modified `src/components/FAQ.jsx`"

### [Feature name / Requirement item]

- **Direction of change**: ...
- **Content**:
  - Specific change 1 (pure functional description)
  - Specific change 2 (pure functional description)

### [Another feature name]

- **Direction of change**: ...
- **Content**:
  - ...

## 🧪 Test Steps

> **Rule: Each module / component listed in "What changed" must have at least one corresponding test case to ensure all changes are covered.**

### Test Case 1: [Test scenario for Module A]

1. Step one
2. Step two
3. **Expected result**: describe expected behavior

### Test Case 2: [Test scenario for Module B]

1. Step one
2. Step two
3. **Expected result**: describe expected behavior

### Test Case N: [Continue until all changed modules have corresponding tests]
```

---

### 6. Output Result

Output the complete PR Title + Description as a **markdown code block** so the user can copy and paste directly to a GitHub PR.

Output format (entire content wrapped in a markdown code block):

````
```markdown
<title>
<full description markdown content, including ##, ###, lists, etc.>
```
````

**Notes:**

- Do not add extra prefixes like `📝 PR Title:` outside the code block — output copyable markdown directly
- The first line inside the code block is the PR Title, followed by a blank line, then the Description
- The user may request adjustments to any part before copying
- **Important**: **Never** include any file paths (including relative paths) in the Description — always use pure functional descriptions instead

---

## 🛑 Strict Format Rules

- **No Markdown link format**: `[text](...)`
- **No URI / scheme**: e.g. `file://`, `cci:`
- **No file paths**: neither relative nor absolute paths should appear in the Description — replace with pure functional descriptions

## Edge Cases

- **Uncommitted changes exist**: remind the user to commit or stash first to avoid omissions

## Additional Resources

### Reference Files

- **`references/pr-template.md`** — The complete template for PR Description, customizable per team needs
