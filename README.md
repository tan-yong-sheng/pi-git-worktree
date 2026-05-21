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
