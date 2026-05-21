/**
 * @tan-yong-sheng/pi-git-worktree — Extension entry point.
 *
 * Pure orchestrator. All logic lives in registrar modules;
 * this file is the table of contents.
 *
 * Session hooks:
 * - Injects git context (branch, commit, user) at session start
 * - Re-injects after compaction or mutating git commands
 * - Refreshes context before each agent turn if branch changed
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { registerSessionHooks } from "./session-hooks.js";

export default function (pi: ExtensionAPI): void {
	registerSessionHooks(pi);
}
