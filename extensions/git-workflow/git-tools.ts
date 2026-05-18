/**
 * Custom LLM-callable tools for git workflow automation.
 *
 * Tools registered:
 *   - git_branch_status   — current branch, upstream, ahead/behind
 *   - git_diff_summary    — structured diff between two refs
 *   - git_worktree_list   — list all worktrees with branch/path info
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { runGit } from "./git-context.js";

export function registerGitTools(pi: ExtensionAPI): void {
	// --- Tool: git_branch_status ---
	pi.registerTool({
		name: "git_branch_status",
		label: "Git Branch Status",
		description:
			"Show the current git branch name, upstream tracking branch, ahead/behind commit counts, and dirty state. Use before generating PRs or committing.",
		promptSnippet: "Check current git branch status and tracking info",
		promptGuidelines: [
			"Use git_branch_status when you need to know the current branch, its upstream, and how many commits ahead/behind it is before suggesting git operations.",
		],
		parameters: Type.Object({}),
		async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
			const branch = runGit("branch --show-current", ctx.cwd);
			const upstream = runGit("rev-parse --abbrev-ref @{upstream}", ctx.cwd);
			const ahead = runGit("rev-list --count @{upstream}..HEAD", ctx.cwd);
			const behind = runGit("rev-list --count HEAD..@{upstream}", ctx.cwd);
			const status = runGit("status --short", ctx.cwd);

			if (!branch.ok) {
				return {
					content: [{ type: "text", text: "Error: " + branch.error }],
					details: {},
					isError: true,
				};
			}

			const lines = [
				"Branch:  " + branch.stdout,
				"Upstream: " + (upstream.ok ? upstream.stdout : "(none)"),
				"Ahead:   " + (ahead.ok ? ahead.stdout : "?"),
				"Behind:  " + (behind.ok ? behind.stdout : "?"),
				"Dirty:   " + (status.ok && status.stdout ? "yes" : "no"),
			];
			if (status.ok && status.stdout) {
				lines.push("", "Changed files:", status.stdout);
			}

			return {
				content: [{ type: "text", text: lines.join("\n") }],
				details: {
					branch: branch.stdout,
					upstream: upstream.ok ? upstream.stdout : null,
				},
			};
		},
	});

	// --- Tool: git_diff_summary ---
	pi.registerTool({
		name: "git_diff_summary",
		label: "Git Diff Summary",
		description:
			"Produce a structured diff summary between two git refs (default: current branch vs master). Returns file-level stats and optionally the full diff for analysis.",
		promptSnippet: "Summarize git diff between two branches or refs",
		promptGuidelines: [
			"Use git_diff_summary when you need to analyze code changes between branches for PR generation, code review, or commit planning.",
		],
		parameters: Type.Object({
			from: Type.Optional(
				Type.String({ description: "Base ref (default: master)" }),
			),
			to: Type.Optional(
				Type.String({ description: "Target ref (default: HEAD)" }),
			),
			statOnly: Type.Optional(
				Type.Boolean({
					description:
						"If true, return only file stats without full diff (default: false)",
				}),
			),
		}),
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			const from = params.from || "master";
			const to = params.to || "HEAD";
			const range = from + ".." + to;

			const stat = runGit("diff --stat " + range, ctx.cwd);
			const log = runGit("log --oneline " + range, ctx.cwd);

			if (!stat.ok && !log.ok) {
				return {
					content: [{ type: "text", text: "No diff found for " + range }],
					details: { from: from, to: to },
				};
			}

			const parts: string[] = [];
			if (log.ok && log.stdout) {
				parts.push("=== Commits ===", log.stdout, "");
			}
			if (stat.ok && stat.stdout) {
				parts.push("=== File Stats ===", stat.stdout, "");
			}

			if (!params.statOnly) {
				const fullDiff = runGit("diff " + range, ctx.cwd);
				if (fullDiff.ok && fullDiff.stdout) {
					const truncated =
						fullDiff.stdout.length > 50000
							? fullDiff.stdout.slice(0, 50000) + "\n... (truncated)"
							: fullDiff.stdout;
					parts.push("=== Full Diff ===", truncated);
				}
			}

			return {
				content: [{ type: "text", text: parts.join("\n") || "No changes" }],
				details: {
					from: from,
					to: to,
					commitCount: log.ok ? log.stdout.split("\n").length : 0,
				},
			};
		},
	});

	// --- Tool: git_worktree_list ---
	pi.registerTool({
		name: "git_worktree_list",
		label: "Git Worktree List",
		description:
			"List all git worktrees with their branch names, paths, and HEAD commits. Use when the user asks about existing worktrees or parallel development setup.",
		promptSnippet: "List all git worktrees and their status",
		promptGuidelines: [
			"Use git_worktree_list when the user asks about existing worktrees or wants to see the parallel development setup.",
		],
		parameters: Type.Object({}),
		async execute(_toolCallId, _params, _signal, _onUpdate, ctx) {
			const result = runGit("worktree list --porcelain", ctx.cwd);
			if (!result.ok) {
				return {
					content: [{ type: "text", text: "Error: " + result.error }],
					details: {},
					isError: true,
				};
			}

			interface WorktreeInfo {
				path: string;
				head: string;
				branch?: string;
			}

			const worktrees: WorktreeInfo[] = [];
			let current: Partial<WorktreeInfo> = {};

			for (const line of result.stdout.split("\n")) {
				const spaceIdx = line.indexOf(" ");
				const key = spaceIdx >= 0 ? line.slice(0, spaceIdx) : line;
				const value = spaceIdx >= 0 ? line.slice(spaceIdx + 1) : "";

				if (key === "worktree") {
					if (current.path) {
						worktrees.push(current as WorktreeInfo);
					}
					current = { path: value };
				} else if (key === "HEAD") {
					current.head = value;
				} else if (key === "branch") {
					current.branch = value;
				}
			}
			if (current.path) {
				worktrees.push(current as WorktreeInfo);
			}

			const text = worktrees
				.map((wt, i) => {
					const branch = wt.branch
						? wt.branch.replace("refs/heads/", "")
						: "(detached)";
					return (
						i +
						1 +
						". " +
						branch +
						"\n   Path: " +
						wt.path +
						"\n   HEAD:  " +
						wt.head.slice(0, 7)
					);
				})
				.join("\n\n");

			return {
				content: [{ type: "text", text: text || "No worktrees found" }],
				details: { count: worktrees.length, worktrees: worktrees },
			};
		},
	});
}
