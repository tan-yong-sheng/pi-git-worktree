---
name: git-smart-commit
description: Automatically split messy git changes into multiple meaningful conventional commits grouped by functional logic
---

# Git Smart Commit — Smart Split Commits

Group all current staged and unstaged changes by functional logic, then execute `git add` + `git commit` in batches.

---

## Flow

### 1. Check Change Status

Run the following commands to get the full change list:

```bash
git status --short
```

If there are no changes, inform the user that "there are no changes to commit" and exit.

Then get the diff content of all changes (used to determine grouping logic):

```bash
git diff
git diff --cached
```

---

### 2. Analyze and Group

Based on the following dimensions, split file changes into multiple **commit groups**, each representing an independent logical unit:

#### Grouping Criteria (Priority Order)

| Priority | Dimension                                  | Examples                                                                    |
| -------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| 1        | **Project scaffolding / Config files**     | `package.json`, `vite.config.*`, `.gitignore`, `README.md`, `tsconfig.json` |
| 2        | **Data layer / config data**               | `src/data/*.js`, `src/constants/*`, `src/config/*`                          |
| 3        | **Components (grouped by component name)** | `src/components/Hero.jsx` + corresponding test + corresponding style        |
| 4        | **Pages / Routes**                         | `src/pages/*`, `src/routes/*`, `src/App.jsx`                                |
| 5        | **Global styles**                          | `src/index.css`, `src/styles/*`, `src/theme/*`                              |
| 6        | **Utilities / hooks / types**              | `src/utils/*`, `src/hooks/*`, `src/types/*`                                 |
| 7        | **Tests**                                  | `__tests__/*`, `*.test.*`, `*.spec.*`                                       |
| 8        | **Docs / Others**                          | `docs/*`, `*.md` (not README), misc                                         |

#### Grouping Rules

- **Same component's JSX/TSX + CSS Module + test → group together**
- **Related data files that serve a specific component → consider merging or keeping independent**, depending on volume of changes
- **If a group has only 1 file with minimal changes (< 5 lines) → merge into the most closely related adjacent group**
- **New files use `feat`, modifications use `fix` / `refactor` / `style`, deletions use `chore`**

---

### 3. Produce Commit Plan

Before executing any git operations, list the plan for the user to confirm:

```
📋 Commit Plan (N commits total)

1. chore(project): initialize project config and dependencies
   → package.json, vite.config.js, .gitignore
2. feat(data): add homepage section configuration data
   → src/data/navigation.js, src/data/hero.js, ...
3. feat(navbar): add Navbar component (with RWD hamburger menu)
   → src/components/Navbar.jsx
...

Confirm execution? (Y/n)
```

Use the `notify_user` tool to present the plan to the user and wait for confirmation.

---

### 4. Execute Commits in Batches

After the user confirms, execute each group sequentially:

```bash
git add <file1> <file2> ...
git commit -m "<type>(<scope>): <subject>"
```

#### Commit Message Format

```
<type>(<scope>): <short description in English>
```

**Type reference table:**

| type       | When to use                               |
| ---------- | ----------------------------------------- |
| `feat`     | New feature, component, page              |
| `fix`      | Bug fix                                   |
| `style`    | Style-only adjustments (no logic changes) |
| `refactor` | Refactoring (no behavior changes)         |
| `chore`    | Chores (config files, scaffolding, CI)    |
| `docs`     | Documentation updates                     |
| `test`     | Test-related                              |

**Scope rules:**

- Component: use lowercase component name, e.g. `hero`, `navbar`, `pricing`
- Data layer: `data`
- Global styles: `style`
- Project config: `project`
- Multiple scopes: use the primary one, do not concatenate with slashes

**Subject rules:**

- Use English
- No more than 50 characters
- Do not end with a period
- Start with an imperative verb: add, adjust, fix, remove, refactor

---

### 5. Confirm Results

After all commits are complete, run:

```bash
git log --oneline -20
```

Display the results to the user to confirm all commits were created correctly.

---

## Edge Cases

- **Conflicts or merge state**: remind the user to resolve conflicts first, do not execute any operations
- **`.env` or sensitive files**: remind the user to confirm whether they should be gitignored, do not auto-commit
- **Extremely large change set (> 50 files)**: produce a grouping summary first, ask the user to confirm before executing
- **User has partially staged changes**: respect the already-staged state, treat it as an independent group or merge into the most related group
