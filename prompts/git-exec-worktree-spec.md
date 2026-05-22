---
description: Check if git-worktree-spec.md exists in the worktree root, read it, and execute tasks according to its content.
---

# Execute Worktree Feature Spec

## Prerequisites

1. Check if `git-worktree-spec.md` exists in the current worktree root:
   - If **missing**: Inform the user, and ask to either provide manual requirements or abort.
   - If **exists**: Proceed to the next step.

## Read Spec

2. Read the full content of `git-worktree-spec.md`.

3. Parse the following sections to confirm task understanding:
   - **Goal**: Purpose of the feature.
   - **Implementation Scope**: Specific checklist items.
   - **Acceptance Criteria**: Conditions to pass upon completion.
   - **Technical Constraints**: Development limits and conventions.
   - **Cross-branch Notes**: Dependencies or merge order considerations.

## Execution

4. Execute the "Implementation Scope" checklist item by item:
   - After completing each task, update `git-worktree-spec.md` by marking the item as checked: `[x]`.
   - If a task description is ambiguous, ask the user instead of guessing.
   - Adhere to all listed "Technical Constraints".

## Verification

5. After implementation, verify each "Acceptance Criteria" item:
   - Run tests where applicable.
   - Start the dev server for UI/behavior validation.
   - Report verification results to the user.
