---
name: git-worktree-design
description: Automatically triggers when the user's requirements involve adding multiple changes (features, refactors, bugfixes), or when it's suitable to split into multiple branches for parallel development. First analyzes requirements through codebase research, then proposes a worktree split plan and executes the setup.
---

# Git Worktree Design — Smart Split for Parallel Development

Analyze user requirements, perform codebase research, propose a plan, and execute parallel worktree setup.

---

## Flow

### 1. Research & Analysis
Before proposing any split, gather context. If a question can be answered by exploring the codebase, explore the codebase instead.

- **Explore Context**: 
    - Investigate structure, documentation, and architectural patterns.
    - If links (e.g., GitHub Issues) are provided, ingest them to extract requirements and constraints.
- **Synthesize**: Internally consolidate insights into an architectural map.

### 2. Global Design (Split Plan + Worktree Specs)
*Use the synthesized context to ground the specifications.*

#### 2a. Requirement Split
Based on requirements AND the synthesized context, split into independent work branches.

**Split principles:**
- **Independence**: Minimize cross-branch conflicts.
- **Minimal dependency**: Each branch develops independently.
- **Granularity**: Balanced management overhead.
- **Semantic naming**: `branch/<task-name>` (e.g., `feature/...`, `refactor/...`, `fix/...`).

#### 2b. Design Each Worktree Spec
Populate specs with project-specific paths/patterns.

| Section | Description |
|---|---|
| **Goal** | Task purpose |
| **Implementation Scope** | Task checklist with concrete file references |
| **Acceptance Criteria** | Testable behaviors/outcomes |
| **Technical Constraints** | Conventions, interfaces |
| **Cross-branch Notes** | Dependency/Merge order |

### 3. Execution
- **Plan Review**: Present the plan to the user and wait for confirmation.
- **Ensure Ignored**: Verify `git-worktree-spec.md` is in `.gitignore`.
- **Worktree Creation**: 
    - `git worktree add -b <branch_name> <worktree_path>`
    - Use `../<project-name>-<feature-short-name>` for paths.
- **Initialization**: Detect existing lockfile to choose package manager; suggest `pnpm` if absent for efficiency.
- **Documentation**: Write the grounded `git-worktree-spec.md` to the root of each worktree.
- **Verification**: List worktrees to confirm status.
