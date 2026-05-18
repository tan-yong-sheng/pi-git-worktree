/**
 * @tan-yong-sheng/pi-git-worktree — Extension entry point.
 *
 * Pure orchestrator. All logic lives in registrar modules;
 * this file is the table of contents.
 *
 * Tools (LLM-callable):
 *   - git_branch_status   — current branch, upstream, ahead/behind
 *   - git_diff_summary    — structured diff between two refs
 *   - git_worktree_list   — list all worktrees with branch/path info
 *
 * Commands (user-invoked /slash):
 *   /wt-init              — start worktree split planning
 *   /wt-list              — show all git worktrees
 *   /pr-gen               — generate PR description from branch diff
 *   /smart-commit         — analyze changes and propose grouped commits
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { registerGitTools } from "./git-tools.js";
import { registerGitCommands } from "./git-commands.js";
import { registerSessionHooks } from "./session-hooks.js";

export default function (pi: ExtensionAPI): void {
  registerSessionHooks(pi);
  registerGitTools(pi);
  registerGitCommands(pi);
}
