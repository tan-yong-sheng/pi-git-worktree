/**
 * User-facing slash commands for git workflow automation.
 *
 * Commands registered:
 *   /wt-init        — start worktree split planning
 *   /wt-list        — show all git worktrees
 *   /pr-gen         — generate PR description from branch diff
 *   /smart-commit   — analyze changes and propose grouped commits
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { runGit } from "./git-context.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MSG_WT_INIT_USAGE =
	"Usage: /wt-init <features...>\nExample: /wt-init hero + pricing + testimonials";
const MSG_PR_GEN_USAGE =
	"Usage: /pr-gen [base-ref]\nExample: /pr-gen main\nDefault base: master";

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerGitCommands(pi: ExtensionAPI): void {
	// --- /wt-init ---
	pi.registerCommand("wt-init", {
		description:
			"Design a git worktree split plan from your requirements. Starts the git-worktree-design skill.",
		getArgumentCompletions: (prefix: string) => {
			var examples = [
				{
					value: "hero + pricing + testimonials",
					label: "Split into hero, pricing, testimonials branches",
				},
				{
					value: "auth + dashboard + settings",
					label: "Split into auth, dashboard, settings branches",
				},
				{
					value: "refactor + feature-a + feature-b",
					label: "Split into refactor and two feature branches",
				},
			];
			var filtered = examples.filter(
				(e) => e.value.indexOf(prefix) >= 0 || e.label.indexOf(prefix) >= 0,
			);
			return filtered.length > 0 ? filtered : null;
		},
		handler: async (args: string, ctx: any) => {
			var prompt = args
				? "Use the git-worktree-design skill. The user wants to split work into worktrees for: " +
					args
				: "Use the git-worktree-design skill to analyze my requirements and suggest a worktree split plan.";
			await ctx.sendUserMessage(prompt);
		},
	});

	// --- /wt-list ---
	pi.registerCommand("wt-list", {
		description: "List all git worktrees with branch and path info",
		handler: async (_args: string, ctx: any) => {
			var result = runGit("worktree list", ctx.cwd);
			if (result.ok) {
				ctx.ui.notify("Worktrees:\n" + result.stdout, "info");
			} else {
				ctx.ui.notify("Error: " + result.error, "error");
			}
		},
	});

	// --- /pr-gen ---
	pi.registerCommand("pr-gen", {
		description:
			"Generate a PR description from the current branch diff. Uses the git-pr-description skill.",
		getArgumentCompletions: (prefix: string) => {
			var bases = ["master", "main", "develop", "staging"];
			var filtered = bases.filter((b) => b.indexOf(prefix) === 0);
			return filtered.length > 0
				? filtered.map((b) => ({ value: b, label: b }))
				: null;
		},
		handler: async (args: string, ctx: any) => {
			var baseRef = (args && args.trim()) || "master";
			await ctx.sendUserMessage(
				"Use the git-pr-description skill to generate a PR description. Target branch is " +
					baseRef +
					".",
			);
		},
	});

	// --- /smart-commit ---
	pi.registerCommand("smart-commit", {
		description:
			"Analyze current changes and propose grouped commits. Uses the git-smart-commit skill.",
		handler: async (_args: string, ctx: any) => {
			await ctx.sendUserMessage(
				"Use the git-smart-commit skill to analyze my current changes and propose grouped commits.",
			);
		},
	});
}
