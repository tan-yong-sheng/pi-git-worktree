/**
 * Session lifecycle hooks for pi-git-worktree.
 *
 * Injects git context at session start, re-injects after compaction
 * or mutating git commands — follows the rpiv-core pattern.
 *
 * Since custom git tools were removed (the LLM can use bash for
 * git commands), the injected context includes a reminder that
 * git CLI is available via bash.
 */
import {
	type ExtensionAPI,
	type ExtensionContext,
	isToolCallEventType,
	type ToolCallEvent,
} from "@earendil-works/pi-coding-agent";
import {
	clearGitContextCache,
	isGitMutatingCommand,
	resetInjectedMarker,
	takeGitContextIfChanged,
} from "./git-context.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MSG_TYPE_GIT_CONTEXT = "pi-git-worktree:git-context";
// MSG_LOADED removed — extension now loads silently

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerSessionHooks(pi: ExtensionAPI): void {
	pi.on("session_start", async (_event, ctx) => {
		await onSessionStart(pi, ctx);
	});
	pi.on("session_compact", async () => {
		await onSessionCompact(pi);
	});
	pi.on("tool_call", async (event) => {
		await onToolCall(event, pi);
	});
	pi.on("before_agent_start", async () => await onBeforeAgentStart(pi));
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function onSessionStart(
	pi: ExtensionAPI,
	ctx: ExtensionContext,
): Promise<void> {
	resetInjectedMarker();
	const gitCtx = await takeGitContextIfChanged(pi);
	if (gitCtx) {
		pi.sendMessage({
			customType: MSG_TYPE_GIT_CONTEXT,
			content:
				gitCtx +
				"\n\nGit CLI is available via bash — use `!git <command>` for any git operation.",
			display: false,
		});
	}
	// Notification hidden — extension loads silently; git context is
	// injected via display:false messages instead.
}

async function onSessionCompact(pi: ExtensionAPI): Promise<void> {
	resetInjectedMarker();
	clearGitContextCache();
	const gitCtx = await takeGitContextIfChanged(pi);
	if (gitCtx) {
		pi.sendMessage({
			customType: MSG_TYPE_GIT_CONTEXT,
			content:
				gitCtx +
				"\n\nGit CLI is available via bash — use `!git <command>` for any git operation.",
			display: false,
		});
	}
}

async function onToolCall(
	event: ToolCallEvent,
	pi: ExtensionAPI,
): Promise<void> {
	// Invalidate git cache when user runs mutating git commands via bash
	if (isToolCallEventType("bash", event)) {
		const cmd = event.input && event.input.command ? event.input.command : "";
		if (isGitMutatingCommand(cmd)) {
			clearGitContextCache();
		}
	}
}

async function onBeforeAgentStart(
	pi: ExtensionAPI,
): Promise<
	| { message: { customType: string; content: string; display: boolean } }
	| undefined
> {
	const gitCtx = await takeGitContextIfChanged(pi);
	if (!gitCtx) return undefined;
	return {
		message: {
			customType: MSG_TYPE_GIT_CONTEXT,
			content:
				gitCtx +
				"\n\nGit CLI is available via bash — use `!git <command>` for any git operation.",
			display: false,
		},
	};
}
