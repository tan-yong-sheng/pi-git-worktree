/**
 * Session lifecycle hooks for pi-git-worktree.
 *
 * Injects git context at session start, re-injects after compaction
 * or mutating git commands — follows the rpiv-core pattern.
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
const MSG_LOADED = "pi-git-worktree extension loaded";

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerSessionHooks(pi: ExtensionAPI): void {
	pi.on("session_start", async (_event, ctx) => {
		await onSessionStart(pi, ctx);
	});
	pi.on("session_compact", async (_event, ctx) => {
		await onSessionCompact(pi);
	});
	pi.on("tool_call", async (event, ctx) => {
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
			content: gitCtx,
			display: false,
		});
	}
	if (ctx.hasUI) {
		ctx.ui.notify(MSG_LOADED, "info");
	}
}

async function onSessionCompact(pi: ExtensionAPI): Promise<void> {
	resetInjectedMarker();
	clearGitContextCache();
	const gitCtx = await takeGitContextIfChanged(pi);
	if (gitCtx) {
		pi.sendMessage({
			customType: MSG_TYPE_GIT_CONTEXT,
			content: gitCtx,
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
			content: gitCtx,
			display: false,
		},
	};
}
