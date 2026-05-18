# @tan-yong-sheng/pi-git-worktree

A [Pi](https://github.com/earendil-works/pi) extension package for git workflow automation — smart commits, PR generation, and worktree design.

## What's Included

### 🧩 Extension (Tools + Commands)

**3 Custom Tools** (LLM-callable):

| Tool                | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `git_branch_status` | Show current branch, upstream, ahead/behind, dirty state                |
| `git_diff_summary`  | Structured diff between two refs with file stats and optional full diff |
| `git_worktree_list` | List all worktrees with branch names, paths, and HEAD commits           |

**4 Slash Commands** (user-invoked):

| Command                  | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `/wt-init [features...]` | Start worktree split planning via git-worktree-design skill     |
| `/wt-list`               | Show all git worktrees                                          |
| `/pr-gen [base-ref]`     | Generate PR description via git-pr-description skill            |
| `/smart-commit`          | Propose grouped conventional commits via git-smart-commit skill |

### 📚 Skills

| Skill                   | Trigger                                        |
| ----------------------- | ---------------------------------------------- |
| **Git PR Description**  | 「PR」、「Pull Request」、「寫 PR」            |
| **Git Smart Commit**    | 「commit this」、「commit my changes」         |
| **Git Worktree Design** | 「worktree」、「git worktree」、「多分支開發」 |

### 📝 Prompt Templates

| Template             | Description                              |
| -------------------- | ---------------------------------------- |
| `exec-worktree-spec` | 讀取 git-worktree-spec.md 並執行開發任務 |
| `pr-gen`             | 從 branch diff 產生 PR 描述              |
| `smart-commit`       | 分析變更並提出分群 commit 計畫           |

## Installation

```bash
pi install git:github.com/tan-yong-sheng/pi-git-worktree@main
```

## Session Hooks

The extension automatically:

- **Injects git context** (branch, commit, user) at session start — available to the LLM without an explicit tool call
- **Re-injects after compaction** so context survives `/compact`
- **Invalidates cache** when you run mutating git commands (checkout, commit, merge, etc.)
- **Refreshes context** before each agent turn if the branch has changed

## Project Structure

```
pi-git-worktree/
├── extensions/
│   └── git-workflow/
│       ├── index.ts          # Extension entry point (orchestrator)
│       ├── git-context.ts    # Git command runner + context caching
│       ├── git-tools.ts      # LLM-callable tool registrations
│       ├── git-commands.ts   # Slash command registrations
│       └── session-hooks.ts  # Session lifecycle hooks
├── skills/
│   ├── git-pr-description/
│   │   ├── SKILL.md
│   │   └── references/pr-template.md
│   ├── git-smart-commit/
│   │   └── SKILL.md
│   └── git-worktree-design/
│       └── SKILL.md
├── prompts/
│   ├── exec-worktree-spec.md
│   ├── pr-gen.md
│   └── smart-commit.md
├── package.json
├── README.md
└── LICENSE
```

## Development

This package follows the [rpiv-mono](https://github.com/juicesharp/rpiv-mono) pattern:

- **`type: "module"`** — ESM throughout
- **`import type`** — Pi's jiti runtime resolves peer types at load time
- **`.js` import extensions** — Required for ESM resolution
- **Orchestrator entry point** — `index.ts` delegates to registrar modules
- **Peer dependencies** — `@earendil-works/pi-coding-agent`, `pi-ai`, `pi-tui`, `typebox` with `*` range

## License

MIT
