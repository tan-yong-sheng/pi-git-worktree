# GitHub Issue Templates

Use the template that matches the issue type. Every issue follows the same DNA: **Why → What → How to Verify** — mirroring the PR template's 🎯 ⚠️ 🧪 structure for consistency across the git lifecycle.

---

## 🐛 Bug Report

```markdown
## 🎯 Why this issue
<!-- What happened, what were you trying to do -->

## ⚠️ What went wrong

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Behavior
<!-- What should have happened -->

### Actual Behavior
<!-- What actually happened -->

## 🧪 How to Verify the Fix
1. Step one
2. Step two
3. **Expected result**: describe the correct behavior after fix
```

---

## ✨ Feature Request

```markdown
## 🎯 Why this feature
<!-- Problem or motivation — why is this needed -->

## ⚠️ What's needed

### Proposed Solution
- **Approach**: describe the direction
- **Content**:
  - Specific requirement 1
  - Specific requirement 2

### Alternatives Considered
- Brief mention of other approaches and why they were not chosen

## 🧪 How to Verify
1. Step one
2. Step two
3. **Expected result**: describe the working feature behavior
```

---

## 📋 Task

```markdown
## 🎯 Why this task
<!-- Goal and context -->

## ⚠️ What to do
- [ ] Specific subtask 1
- [ ] Specific subtask 2
- [ ] Specific subtask 3

## 🧪 How to Verify Completion
1. Step one
2. Step two
3. **Expected result**: describe the completed state
```

---

## 🔧 Improvement

```markdown
## 🎯 Why this improvement
<!-- Current state and why it's insufficient -->

## ⚠️ What should change

### Current Behavior
- What exists now

### Desired Behavior
- **Approach**: direction of improvement
- **Content**:
  - Specific improvement 1
  - Specific improvement 2

## 🧪 How to Verify
1. Step one
2. Step two
3. **Expected result**: describe the improved behavior
```

---

## Shared Rules

These rules mirror the PR template principles — consistency across the entire git lifecycle (Issue → Worktree → Commit → PR):

- **No file paths** in the body — use functional descriptions instead of `src/components/Hero.jsx`
- **No markdown links** `[text](...)` or URI schemes (`file://`, `cci:`, etc.)
- **Emoji section headers** for visual scanning: 🎯 ⚠️ 🧪
- **Every issue must have a verification step** — no orphan claims without a way to confirm they're resolved
- **Use imperative verbs** for action items: "add", "fix", "remove", "refactor" — not "added", "fixing", "was removed"
