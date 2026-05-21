/**
 * Git context utilities — async helpers for session hooks.
 *
 * Uses pi.exec (async, abort-aware) to gather git context.
 * All sync helpers (runGit, GitResult) removed — the LLM can
 * run git commands directly via bash; no custom tools needed.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// ---------------------------------------------------------------------------
// Async helpers (used in session hooks — has access to pi.exec)
// ---------------------------------------------------------------------------

export type GitContext = { branch: string; commit: string; user: string };

const GIT_EXEC_TIMEOUT_MS = 30_000;

// Cache: undefined = not loaded yet, null = not a git repo / failed
let cache: GitContext | null | undefined;

export function clearGitContextCache(): void {
	cache = undefined;
}

export async function getGitContext(
	pi: ExtensionAPI,
): Promise<GitContext | null> {
	if (cache !== undefined) return cache;
	cache = await loadGitContext(pi);
	return cache;
}

async function loadGitContext(pi: ExtensionAPI): Promise<GitContext | null> {
	try {
		const [branchRes, commitRes] = await Promise.all([
			pi.exec("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
				timeout: GIT_EXEC_TIMEOUT_MS,
			}),
			pi.exec("git", ["rev-parse", "--short", "HEAD"], {
				timeout: GIT_EXEC_TIMEOUT_MS,
			}),
		]);

		const rawBranch = branchRes.stdout.trim();
		const commit = commitRes.stdout.trim();

		if (!rawBranch && !commit) return null;

		const branch = rawBranch === "HEAD" ? "detached" : rawBranch;

		let user = "";
		try {
			const r2 = await pi.exec("git", ["config", "user.name"], {
				timeout: GIT_EXEC_TIMEOUT_MS,
			});
			user = r2.stdout.trim();
		} catch {
			// fall through to env fallback
		}
		if (!user) user = process.env.USER || "unknown";

		return {
			branch: branch || "no-branch",
			commit: commit || "no-commit",
			user,
		};
	} catch {
		return null;
	}
}

// Returns git context string only when it changed since last injection.
let lastInjectedSig: string | null = null;

export function resetInjectedMarker(): void {
	lastInjectedSig = null;
}

export async function takeGitContextIfChanged(
	pi: ExtensionAPI,
): Promise<string | null> {
	const g = await getGitContext(pi);
	if (!g) return null;
	const sig = `${g.branch}\n${g.commit}\n${g.user}`;
	if (sig === lastInjectedSig) return null;
	lastInjectedSig = sig;
	return `## Git Context\n- Branch: ${g.branch}\n- Commit: ${g.commit}\n- User: ${g.user}`;
}

export function isGitMutatingCommand(cmd: string): boolean {
	return /\bgit\s+(checkout|switch|commit|merge|rebase|pull|reset|revert|cherry-pick|worktree|am|stash)\b/.test(
		cmd,
	);
}
