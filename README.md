# @tan-yong-sheng/pi-git-worktree

A [Pi](https://github.com/earendil-works/pi) extension package for git workflow automation — smart commits, PR generation, and worktree design.

## What's Included

### 🧩 Extension (Session Hooks)

The extension automatically keeps the LLM informed about your git state:

- **Injects git context** (branch, commit, user) at session start — no explicit tool call needed
- **Re-injects after compaction** so context survives `/compact`
- **Invalidates cache** when you run mutating git commands (checkout, commit, merge, etc.)
- **Refreshes context** before each agent turn if the branch has changed
- **Reminds the LLM** that git CLI is available via bash (`!git <command>`)

No custom tools are registered — the LLM uses bash for git operations directly, which is more flexible and doesn't create a redundant API surface alongside the CLI.

### 📚 Skills

| Skill                   | Trigger                                         |
| ----------------------- | ----------------------------------------------- |
| **Git PR Description**  | "PR", "Pull Request", "write PR"                |
| **Git Smart Commit**    | "commit this", "commit my changes"              |
| **Git Worktree Design** | "worktree", "git worktree", "parallel branches" |

> Skills are automatically available as `/skill:git-pr-description`, `/skill:git-smart-commit`, and `/skill:git-worktree-design` when `enableSkillCommands` is enabled in Pi settings.

### 📝 Prompt Templates

| Template                 | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `git-exec-worktree-spec` | Read a worktree spec and execute development tasks |

> Prompt templates are **not** auto-triggered by the LLM — they are only invoked explicitly by the user (e.g., `/git-exec-worktree-spec`). This is intentional: skills handle the auto-triggerable workflows (PR generation, commit grouping, worktree design), while this prompt provides a manual-only execution workflow for worktree specs.

## Recommended Workflow

This package is designed around a three-step parallel development workflow:

```
/skill:git-worktree-design  →  Open agent in worktree  →  /git-exec-worktree-spec
       Step 1                        Step 2                       Step 3
    Design & split              Start coding              Execute the spec
```

### Step 1: Design the Split

In your **main project** session, invoke the worktree design skill:

```
/skill:git-worktree-design
```

Describe your requirements (e.g. "I need a hero redesign, pricing page, and testimonials section"). The skill will:

1. Analyze your repo state and existing worktrees
2. Propose a split plan with branch names, worktree directories, and feature specs
3. Wait for your confirmation, then create the worktrees and write `git-worktree-spec.md` into each one

### Step 2: Open a Session in Each Worktree

For each worktree created in Step 1, open a new Pi session in that directory:

```bash
# From your terminal — navigate to the worktree and start Pi
cd ../project-hero && pi

# Or from within an existing Pi session, use the session switch:
# Ctrl+N → navigate to the worktree directory
```

Each worktree is an independent working directory with its own `node_modules` (installed in Step 1). The extension's session hooks will automatically detect the new branch and inject fresh git context.

### Step 3: Execute the Feature Spec

In the worktree session, invoke the spec executor:

```
/git-exec-worktree-spec
```

This is a **prompt template** (not a skill), so it only runs when you explicitly invoke it. The agent will:

1. Read `git-worktree-spec.md` from the worktree root
2. Execute each checklist item in Implementation Scope one by one
3. Mark completed items as `[x]` in the spec file
4. Validate results against Acceptance Criteria

### When You're Done

Back in your main project session:

- Use `/skill:git-pr-description` to generate PR descriptions for completed worktrees
- Use `/skill:git-smart-commit` to group and commit any remaining changes
- Clean up merged worktrees with `git worktree remove <path>`

## Installation

```bash
pi install git:github.com/tan-yong-sheng/pi-git-worktree@main
```

## Project Structure

```
pi-git-worktree/
├── extensions/
│   └── git-workflow/
│       ├── index.ts         # Extension entry point (orchestrator)
│       ├── git-context.ts   # Async git context loading + caching
│       └── session-hooks.ts # Session lifecycle hooks
├── skills/
│   ├── git-pr-description/
│   │   ├── SKILL.md
│   │   └── references/pr-template.md
│   ├── git-smart-commit/
│   │   └── SKILL.md
│   └── git-worktree-design/
│       └── SKILL.md
├── prompts/
│   └── git-exec-worktree-spec.md
├── package.json
├── README.md
└── LICENSE
```

## Design Rationale

- **No extension commands that duplicate skills.** Skills are already invocable via `/skill:<name>` — adding parallel slash commands would be redundant.
- **Prompt templates are for manual-only workflows.** Unlike skills (which can be auto-triggered by the LLM), prompts are only invoked explicitly by the user. This keeps `git-exec-worktree-spec` as a deliberate, user-initiated action.
- **No duplicate content.** Skills handle PR description generation and commit grouping. There is no need for separate prompt templates that duplicate the same workflows.

## Development

- **`type: "module"`** — ESM throughout
- **`import type`** — Pi's jiti runtime resolves peer types at load time
- **`.js` import extensions** — Required for ESM resolution
- **Orchestrator entry point** — `index.ts` delegates to registrar modules
- **Peer dependencies** — `@earendil-works/pi-coding-agent`, `pi-ai`, `pi-tui` with `*` range

## License

MIT
