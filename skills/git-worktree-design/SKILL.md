---
name: git-worktree-design
description: Automatically triggers when the user's requirements involve adding multiple features, or when it's suitable to split into multiple feature branches for parallel development, or when mentioning "worktree", "git worktree", "multi-branch development", or "parallel branches". First analyzes the requirements and proposes a worktree split plan, then executes the setup after user confirmation.
---

# Git Worktree Design — Smart Split for Parallel Development

Analyze user requirements, determine whether it's suitable to use `git worktree` to split into multiple feature branches for parallel development, propose a plan, and execute it.

---

## Flow

### 1. Analyze Current State

Run the following commands to understand the repo state:

```bash
# Confirm current branch
git branch --show-current

# List existing worktrees
git worktree list

# Get remote info
git remote -v

# Check working directory status
git status --short

# Fetch latest remote state (non-destructive, never modifies working directory — prefer fetch over pull)
git fetch --all --prune && git log HEAD..@{upstream} --oneline 2>/dev/null && echo "⚠️ Local branch is behind remote — consider pulling before creating worktrees" || true
```

If there are uncommitted changes, remind the user to handle them first (commit or stash) before continuing.

#### Spec File Hygiene

Ensure `git-worktree-spec.md` is in `.gitignore` — spec files are local development guides, not repo artifacts. Then check if any `git-worktree-spec.md` already exists in a worktree directory: read it, compare its `Branch name` field against `git worktree list`, and if the branch no longer exists or has been merged, delete the stale spec. If the branch still exists but the spec is outdated, retain and update it rather than recreating from scratch.

---

### 2. Global Design (Split Plan + Feature Specs)

Before creating any worktree, complete the design for all features from a global perspective. This step produces both the **split plan** and the **Spec draft** for each feature, allowing the user to review the overall plan in one go.

#### 2a. Requirement Split

Based on the user's requirements, analyze and split into multiple independent feature branches.

**Split principles:**

| Principle                  | Description                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Feature independence**   | Each worktree handles one independent feature, minimizing cross-branch conflicts                           |
| **Minimal dependency**     | Avoid inter-branch dependencies as much as possible; each branch can be developed and tested independently |
| **Reasonable granularity** | Not too fine (increases management overhead), not too coarse (loses parallel development advantage)        |
| **Semantic naming**        | Branch names clearly describe the feature, format `feature/<feature-name>`                                 |

#### 2b. Design Each Feature Spec

For each split feature, based on the user's original requirements and the project's current state, **auto-derive** the complete Spec content (not just throw empty templates).

**Each Spec should include:**

| Section                   | Description                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| **Goal**                  | What this feature branch aims to achieve                                                            |
| **Implementation Scope**  | Specific task checklist, granular enough for AI to start working directly                           |
| **Acceptance Criteria**   | Testable behaviors or UI state descriptions                                                         |
| **Technical Constraints** | Project conventions, dependencies not to introduce, interfaces to maintain compatibility with, etc. |
| **Cross-branch Notes**    | Dependencies on other features, suggested merge order, etc.                                         |

> **Key point**: Consider cross-branch dependencies during the global design phase, e.g. whether a shared component produced by feature A affects feature B, whether merge order has sequencing requirements.

#### 2c. Present Complete Plan to User

Present the **complete plan** to the user in table + feature spec summary format:

```
📋 Worktree Split Plan (N branches total)

| # | Branch Name | Worktree Directory | Feature |
|---|-------------|-------------------|---------|
| 1 | feature/hero-redesign | ../project-hero | Hero section redesign |
| 2 | feature/pricing-page | ../project-pricing | Pricing page |
| 3 | feature/testimonials | ../project-testimonials | Testimonials section |

---
📝 Feature Spec Summary:

### 1. feature/hero-redesign
- Goal: Redesign the Hero section with dynamic background and CTA
- Acceptance: First contentful paint < 2s, CTA button navigates on click
- Dependencies: None, can be developed independently

### 2. feature/pricing-page
- Goal: Add pricing page with monthly/yearly toggle
- Acceptance: Price updates correctly when toggling monthly/yearly, mobile layout is correct
- Dependencies: None, can be developed independently

### 3. feature/testimonials
- Goal: Add testimonials carousel section
- Acceptance: Carousel auto-plays, manual switching has no bugs
- Dependencies: None, can be developed independently

---
Suggested merge order: 1 → 2 → 3 (no hard dependencies, any order works)

Confirm execution? (Y/n)
```

Use the `notify_user` tool to present the complete plan (split + spec summary) to the user and wait for confirmation.

---

### 3. Create Worktrees

After the user confirms, execute sequentially:

```bash
# Create each worktree (with new branch)
git worktree add -b <branch_name> <worktree_path>
```

#### Worktree Directory Naming Rules

- Directories are placed at the **same level** as the current repo (`../`)
- Format: `../<project-name>-<feature-short-name>`
- Use the repo directory name as the `<project-name>` prefix to avoid confusion with other projects

---

### 4. Install Dependencies

Detect the package manager used by the project and install dependencies:

```bash
# Detect lock file to determine package manager
# pnpm-lock.yaml → pnpm install
# yarn.lock → yarn install
# package-lock.json → npm install
# bun.lockb → bun install
```

For each worktree, execute:

```bash
cd <worktree_path> && <package_manager> install
```

> **Note**: Each worktree has an independent working directory; `node_modules` are not shared, so each must install separately.

---

### 5. Write Feature Spec Files

Use the `write_to_file` tool to write the Spec content designed in Step 2 to the root of each worktree at `<worktree_path>/git-worktree-spec.md`.

#### Spec File Format

```markdown
# Feature Spec: <feature name>

> This document was auto-generated by the Git Worktree Design Skill, intended as a development guide for AI Agents.

## Branch Info

| Item            | Value             |
| --------------- | ----------------- |
| Branch name     | `feature/<name>`  |
| Based on branch | `<base_branch>`   |
| Worktree path   | `<absolute_path>` |
| Created at      | `<timestamp>`     |

## Goal

(Filled in from Step 2 design content)

## Implementation Scope

- [ ] Specific task 1
- [ ] Specific task 2
- [ ] Specific task 3

## Acceptance Criteria

- When condition A is met, behavior X should occur
- When condition B is met, behavior Y should occur

## Technical Constraints

- No new npm dependencies (fill in as appropriate)
- Must be compatible with existing design system / API interfaces

## Cross-branch Notes

Dependencies on other worktree branches, merge order suggestions, etc.
```

---

### 6. Confirm Results

After all worktrees are created, run:

```bash
git worktree list
```

Display the results in table format:

```
✅ Worktrees created successfully!

| Worktree Directory | Branch | Status | Spec |
|-------------------|--------|--------|------|
| /path/to/project-hero | feature/hero-redesign | ✅ Ready | ✅ Written |
| /path/to/project-pricing | feature/pricing-page | ✅ Ready | ✅ Written |
| /path/to/project-testimonials | feature/testimonials | ✅ Ready | ✅ Written |

💡 Tips:
- Switch to the corresponding worktree directory to start development
- All worktrees share the same .git; commit history is shared
```

---

## Edge Cases

- **Branch already exists**: When a branch is detected as existing, use the command without `-b` (`git worktree add <path> <existing-branch>`), and prompt the user to confirm
- **Directory already exists**: Indicate the conflict and suggest an alternative directory name
- **Uncommitted changes**: Remind the user to commit or stash first
- **Worktree cleanup**: Remind the user to use `git worktree remove` and `git branch -d` for cleanup after development is complete

---

## Common Maintenance Commands

```bash
# List all worktrees
git worktree list

# Remove a worktree (preserves the branch)
git worktree remove <path>

# Force remove (when there are uncommitted changes)
git worktree remove --force <path>

# Clean up stale worktree references
git worktree prune

# Delete a branch (after merging)
git branch -d <branch_name>
```
