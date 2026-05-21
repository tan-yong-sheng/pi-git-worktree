---
name: git-gh-issue
description: Automatically generate and create structured GitHub Issues from conversation context or code artifacts. Triggers when the user mentions "create an issue", "file an issue", "new issue", "report a bug", "open a GitHub issue", "gh issue", or "create issue from my changes". Also use when the user describes a bug, feature request, or task and wants it tracked on GitHub — even if they don't explicitly say "issue". This skill completes the git lifecycle - `Issue → Worktree → Smart Commit → PR`.
---

# Git GH Issue — Auto-generate and Create GitHub Issues

Generate a structured GitHub Issue from either conversation context or code artifacts, then create it directly on GitHub via `gh issue create` after user confirmation.

---

## Flow

### 1. Detect Input Mode

Determine which mode to use based on the user's trigger:

| User says | Mode | Source |
|-----------|------|--------|
| Describes a feature, bug, or task in chat | **Conversation** | Conversation context + user's description |
| "create issue from my changes" | **Code-aware** | `git diff` + `git diff --cached` |
| "create issue from this error" | **Code-aware** | User-provided error/log output |
| "create issue for this branch" | **Code-aware** | `git diff master..HEAD` |
| "create issue from this test failure" | **Code-aware** | Test output or user-provided failure log |

The user can force a mode explicitly: "create issue from what I just described" (conversation) vs "create issue from my diff" (code-aware).

---

### 2. Gather Repo Context

Before generating any issue content, scan the repo for context that enriches the issue and avoids duplicates:

```bash
# Repo info
gh repo view --json name,owner,defaultBranchRef

# Existing labels (for suggesting matching ones)
gh label list --limit 100

# Recent open issues (to check for duplicates)
gh issue list --state open --limit 20
```

If similar open issues already exist, mention them to the user before proceeding — don't create duplicates.

---

### 3. Collect Issue Details

#### Conversation Mode

Ask the user **one question at a time**, preferring multiple choice when possible:

1. **Issue type** — bug / feature / task / improvement
2. **Priority** (optional) — critical / high / medium / low
3. **Any specific label or assignee?** — pull from existing repo labels
4. **Any related issue or PR?** — for cross-linking in the body

Skip questions the user already answered in their description. The goal is to fill gaps, not re-ask what's known.

#### Code-Aware Mode

Read the artifact and **auto-detect** the issue type and details:

| Signal in artifact | Infer |
|--------------------|-------|
| Diff with `fix`, error keywords, exception traces | **Bug** |
| Diff with new components, pages, or modules | **Feature** |
| Diff with refactoring patterns, no behavior change | **Improvement** |
| Branch name starting with `feature/` | **Feature** |
| Branch name starting with `fix/` or `bugfix/` | **Bug** |

Detect **affected area** from the diff (which modules/components are touched) and **severity clues** (crash/exception → critical, visual glitch → low).

Present the inference to the user for confirmation:

```
🔍 Detected: Bug report
Affected: Navigation component
Severity: Medium
Is this correct? (Y / adjust)
```

Then ask only the remaining questions (labels, assignees, related issues) — the type and scope are already filled in.

---

### 4. Generate Issue Content

Read `references/issue-templates.md` for the full template matching the issue type. Generate the issue body following that template's structure.

#### Title Format

```
<type>: <short description>
```

**Type reference table** (matching git-smart-commit and git-pr-description conventions):

| type | When to use |
| ---- | ----------- |
| `feat` | New feature request |
| `fix` | Bug report |
| `task` | General task or chore |
| `improve` | Improvement to existing functionality |

**Title rules:**
- Use English
- No more than 72 characters
- Start with an imperative verb: add, fix, remove, refactor, improve
- Describe the core purpose concisely

#### Body Generation

**Conversation mode:** Synthesize the user's description into the template structure. The user described the "why" in chat — extract it into 🎯, derive the "what" into ⚠️, and infer verification steps into 🧪.

**Code-aware mode:** Pre-fill the template from the artifact:
- **Bug**: Extract failing behavior into "Steps to Reproduce" and "Actual Behavior"; infer "Expected Behavior"
- **Feature**: Extract the scope of new code into "What's needed / Proposed Solution"
- **Improvement**: Extract before/after from the diff into "Current Behavior" / "Desired Behavior"

The template is **pre-filled, not auto-submitted** — the user reviews and adjusts before creation. Code-aware mode just does the heavy lifting of extracting evidence from the artifact.

---

### 5. Preview & Confirm

Present the full issue (title + body + labels) as a **markdown code block** so the user can review the exact content that will be created:

`````
```markdown
fix: navbar collapses on mobile when hamburger menu is opened

## 🎯 Why this issue
Users on mobile devices cannot access navigation links...

## ⚠️ What went wrong
...
```
`````

Labels and metadata shown separately:

```
Labels: bug, priority:medium
Assignees: (none)
Related: #42
```

Ask the user to confirm or request adjustments. Do not proceed to creation until confirmed.

---

### 6. Create Issue

After the user confirms, create the issue on GitHub:

```bash
gh issue create \
  --title "<title>" \
  --body "<body>" \
  --label "<labels>"
```

If labels don't exist on the repo yet, `gh issue create` will fail. In that case, create the labels first:

```bash
gh label create "<label>" --color "<hex-color>" --description "<description>"
```

Then retry the issue creation.

After creation, display the result:

```
✅ Issue created: https://github.com/owner/repo/issues/123
```

---

## 🛑 Strict Format Rules

These rules mirror `git-pr-description` for consistency across the entire git lifecycle:

- **No Markdown link format**: `[text](...)`
- **No URI / scheme**: e.g. `file://`, `cci:`
- **No file paths**: neither relative nor absolute paths should appear in the body — replace with functional descriptions
- **Every 🧪 verification step must include an "Expected result"** line

---

## Edge Cases

- **Similar open issue exists**: Mention it to the user, ask whether to add a comment to the existing issue instead of creating a duplicate
- **`gh` not authenticated**: Run `gh auth status` first; if not logged in, remind the user to run `gh auth login` before proceeding
- **Repo has no labels**: Offer to create standard labels (bug, feature, priority:low/medium/high) or proceed without labels
- **Uncommitted changes in code-aware mode**: The diff includes unstaged changes — remind the user that the diff reflects working tree state, not just committed changes
- **Issue body exceeds GitHub limit** (~65,536 chars): Truncate the artifact evidence and add a note: "Full details available in [branch/commit]"
- **Network error during creation**: Retry once, then suggest the user create manually using the previewed content

---

## Additional Resources

### Reference Files

- **`references/issue-templates.md`** — The four issue type templates (Bug, Feature, Task, Improvement), with shared formatting rules

### Related Skills

- **`git-worktree-design`** — After creating an issue, the user may want to spin up a worktree to implement it
- **`git-smart-commit`** — Structured commits during implementation
- **`git-pr-description`** — PR generation after implementation, completing the full lifecycle
