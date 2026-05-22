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

### 2. Global Design (Plan + All Specs)
In a single step, design the **entire** plan and all associated specs to allow user approval of the full architecture.

#### 2a. Requirement Split
Analyze the requirements and split into independent work branches using these principles:
- **Independence**: Minimize cross-branch conflicts.
- **Minimal dependency**: Each branch develops independently.
- **Granularity**: Balanced management overhead.
- **Semantic naming**: `branch/<task-name>` (e.g., `feature/...`, `refactor/...`, `fix/...`).

#### 2b. Design All Worktree Specs
For every branch, **auto-derive** a comprehensive spec file.

| Section | Description |
|---|---|
| **Source Reference** | Explicit GitHub URL (for tracking) |
| **Goal** | Task purpose |
| **Requirements** | Comprehensive summary of issue/research context |
| **Implementation Scope** | Task checklist with **explicit file paths** |
| **Acceptance Criteria** | Testable behaviors/outcomes |
| **Technical Constraints** | Conventions, interfaces |
| **Cross-branch Notes** | Dependency/Merge order |

#### 2c. Present Global Plan
Present the **full plan** as a markdown code block **only in the chat interface** for review. **Do not create roadmap files in the repository.** If persistence is required, write the plan to `/tmp/git-worktree-design.md` only. Request confirmation for the entire roadmap before initiating any operations.

### 3. Execution (Batch)
Once approved:
1. **Worktree Creation**: Execute `git worktree add` for all branches in one sequence.
2. **Initialization**: Detect package manager (e.g., `pnpm-lock.yaml`); run install for each.
3. **Documentation**: Write the grounded `git-worktree-spec.md` to the root of each worktree.
4. **Verification**: List all worktrees and confirm status in a summary table.

### 3. Execution
- **Plan Review**: Present the plan to the user and wait for confirmation.
- **Ensure Ignored**: Verify `git-worktree-spec.md` is in `.gitignore`.
- **Worktree Creation**: 
    - `git worktree add -b <branch_name> <worktree_path>`
    - Use `../<project-name>-<feature-short-name>` for paths.
- **Initialization**: Detect package manager via lockfile (e.g., `pnpm-lock.yaml` for Node/TS); suggest efficient alternatives (like `pnpm`) if absent.
- **Documentation**: Write the grounded `git-worktree-spec.md` to the root of each worktree.
- **Verification**: List worktrees to confirm status.
