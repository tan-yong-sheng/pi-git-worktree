---
name: git-exec-worktree-spec
description: Check if git-worktree-spec.md exists in the current worktree, read it, and execute the development tasks defined in the spec
---

# Execute Worktree Feature Spec

## Prerequisites

1. Check if `git-worktree-spec.md` exists in the root of the current working directory
   - If **not found**: inform the user that this worktree has no spec file, ask whether to describe requirements manually or abort
   - If **found**: proceed to the next step

## Read Spec

2. Read the full content of `git-worktree-spec.md`
3. Parse the following sections from the Spec to confirm understanding of the task:
   - **Goal**: what this feature aims to achieve
   - **Implementation Scope**: specific checklist tasks
   - **Acceptance Criteria**: conditions that must pass upon completion
   - **Technical Constraints**: limitations and conventions during development
   - **Cross-branch Notes**: any dependencies on other branches

## Execute Implementation

4. Execute each item in the "Implementation Scope" checklist **one by one**:
   - After completing each task, update `git-worktree-spec.md` by marking the completed checklist item as done `[x]`
   - If a task description is ambiguous, ask the user for clarification rather than guessing
   - Follow all constraints listed in "Technical Constraints"

## Acceptance Validation

6. After implementation is complete, verify each item in "Acceptance Criteria":
   - Run tests where applicable
   - Start the dev server for visual verification where applicable
   - Report the acceptance results to the user
