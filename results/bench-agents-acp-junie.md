# bench-agents-acp-junie

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | cost $ |
|---|---|---|---|---|---|---|---|---|
| claude-acp:haiku | 60/60 | 5760 | 11561 | 26643 | 0 | 0 | 0 | 0.0045 |
| junie:junie-lite | 2/60 | 8403 | 8403 | 17927 | 7448 | 325 | 0 | 0.0031 |
| junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna | 0/60 | - | - | 0 | 0 | 0 | 0 | - |

## codex-1 (diff 688 chars, git 462 ms)

Actual:
```
Skip postprocessing for short composer input (#39744)

## What changed

Return the initial wrapping ranges directly when the composer input produces a
single line and its byte length is less than the available width. This avoids
the additional grapheme and word-boundary pass for input that cannot wrap.

GitOrigin-RevId: 55d990a354fcc61e9a90d5796b4b39d16742cc50
```

claude-acp:haiku (4352 ms):
```
Keep short single-line composer text unwrapped
```

junie:junie-lite (5959 ms):
```
FAIL: no message in the report: ...horter than the width, preventing unnecessary processing.

### Verification
- Not run: documentation-only task (generating a commit message from provided diff).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3093 ms):
```
FAIL: stopReason cancelled
```

## codex-2 (diff 1343 chars, git 347 ms)

Actual:
```
Use default timeouts in cyber exec policy tests (#39496)

## What changed

Stop setting explicit one-second `timeout_ms` and `yield_time_ms` values in the
mock command calls. The shell command and unified exec variants now use their
default timing behavior while testing cyber exec policy.

GitOrigin-RevId: b1c25304ca47e7b08f023fe678467fc00330158b
```

claude-acp:haiku (4968 ms):
```
Remove timeout arguments from cyber exec policy test

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (5963 ms, cleaned):
```
Remove timeout parameters from cyber exec policy test fixtures

The command_response helper no longer includes timeout_ms or
yield_time_ms since the upstream tool definitions stopped requiring
them.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3144 ms):
```
FAIL: stopReason cancelled
```

## codex-3 (diff 1926 chars, git 163 ms)

Actual:
```
Isolate IPC in Bubblewrap sandboxes (#39586)

## What changed

- Pass `--unshare-ipc` when building Bubblewrap arguments for both restricted-filesystem and full-filesystem sandbox paths.
- Update the Bubblewrap argument tests to cover the new namespace flag.

GitOrigin-RevId: 61fb1d5150d09626a3b6ee7a9c6a508108c52e80
```

claude-acp:haiku (4611 ms):
```
Isolate Linux sandbox processes in their own IPC namespace

Add `--unshare-ipc` to the Bubblewrap flags in both the standard and
full-filesystem modes so sandboxed processes cannot reach host System V
IPC objects or POSIX message queues.
```

junie:junie-lite (6352 ms):
```
FAIL: no message in the report: ...ndbox flags.
- The message follows the project's conventions: imperative mood, concise summary under 72 characters, with a body explaining what changed and why.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3063 ms):
```
FAIL: stopReason cancelled
```

## codex-4 (diff 2532 chars, git 283 ms)

Actual:
```
Prevent Node REPL auth tokens from reaching child processes (#39301)

## What changed

- Add `NODE_REPL_AUTH_TOKEN` to the environment variables that model-reachable child processes cannot inherit.
- Remove the variable case-insensitively after shell environment policy overrides and from explicitly configured child command environments.
- Extend the environment scrubber tests to cover inherited and configured forms of the token.

GitOrigin-RevId: 716c65e0a9e222f705c226b7c86545251d3ea580
```

claude-acp:haiku (4423 ms):
```
Prevent Node REPL auth token from reaching child processes

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (5710 ms):
```
FAIL: no message in the report: ...ote a git commit message for the provided diff adding `NODE_REPL_AUTH_TOKEN` to the non-inheritable environment variable list and updating the associated tests.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3207 ms):
```
FAIL: stopReason cancelled
```

## codex-5 (diff 3321 chars, git 97 ms)

Actual:
```
Raise the MCP tool name limit to 128 bytes (#39594)

## Why

The Responses API accepts tool names up to 128 bytes, but MCP tool name
normalization limited model-visible names to 64 bytes.

## What changed

- Preserve MCP tool names up to the 128-byte Responses API limit.
- Continue shortening and hashing names that exceed the limit so generated
  names remain bounded and unique.

## Testing

- Cover names at the 128-byte boundary and immediately above it.
- Verify distinct long names remain 128 bytes and code-mode compatible.

GitOrigin-RevId: 75544d00e75dd0e9328b3e2ac763d26f9cc99a48
```

claude-acp:haiku (4048 ms):
```
Raise MCP tool name limit from 64 to 128 bytes
```

junie:junie-lite (6271 ms):
```
FAIL: no message in the report: ...erifying boundary behavior at 128/129 characters for namespaced tool names
- Update existing long-name test to use 128-character names and assert the new length
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2720 ms):
```
FAIL: stopReason cancelled
```

## codex-6 (diff 4055 chars, git 96 ms)

Actual:
```
Preserve Windows proxy settings in Guardian sessions (#40641)

## Why

Guardian sessions can run alongside another Windows sandbox launch and should not reconcile the persistent proxy settings established by that launch.

## What changed

- Start internal Guardian sessions with `WindowsSandboxProxySettingsMode::Preserve`.
- Continue using `Reconcile` for other sessions.

## Testing

Added a thread manager test that verifies a parent session reconciles proxy settings while its internal Guardian session preserves them.

GitOrigin-RevId: c6a31637ecdf828548cfd7153da7e9405abe34fa
```

claude-acp:haiku (5107 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6311 ms):
```
FAIL: no message in the report: Wrote a git commit message for the provided diff following the project's conventions (imperative mood, English, no issue ID).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2607 ms):
```
FAIL: stopReason cancelled
```

## codex-7 (diff 5251 chars, git 99 ms)

Actual:
```
Consolidate code mode output helper tests (#39969)

## What changed

- Cover object serialization through the `text()` helper directly in the code
  mode runtime suite.
- Remove redundant core integration coverage for serialized text and rejected
  image outputs.

GitOrigin-RevId: f465b8361e9d725a7246994d9c41e9d01c969011
```

claude-acp:haiku (5166 ms):
```
Move code mode text helper test to the runtime crate

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (7362 ms):
```
FAIL: no message in the report: ...ssage generation only, no code changes needed

### Notes
- Follows existing commit style (imperative mood, scoped descriptions with issue IDs from branch names)
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2702 ms):
```
FAIL: stopReason cancelled
```

## codex-8 (diff 5608 chars, git 168 ms)

Actual:
```
Use in-process parsing for PowerShell command classification (#39602)

## What changed

- Route PowerShell wrapper extraction and Windows safe-command classification through the tree-sitter lowerer.
- Compile the PowerShell AST subprocess parser only in tests, where it remains available as an oracle.

GitOrigin-RevId: 3690bc32e8987ac9de820ef39ff7401d98ea8d83
```

claude-acp:haiku (5805 ms):
```
Drop PowerShell AST subprocess from production safety checks

The PowerShell AST parser ran a subprocess for every script checked. Route
Windows safe-command checks and PowerShell command parsing through the
in-process tree-sitter lowerer instead. Keep the AST parser only as a test
oracle, and remove tests that asserted its refusals.
```

junie:junie-lite (5710 ms):
```
FAIL: no message in the report: - Generated git commit message for the provided diff
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2728 ms):
```
FAIL: stopReason cancelled
```

## codex-9 (diff 6246 chars, git 198 ms)

Actual:
```
Preserve bounds in reserved tool schemas (#40719)

## Why

Reserved tool parameter constraints must survive schema parsing so the model receives the declared limits.

## What changed

- Preserve `minimum` and `maximum` as exact JSON numbers.
- Preserve `maxLength` and infer a string schema when it is the only type hint.

## Testing

- Cover bounded integer, number, and string schemas through both parsing paths.
- Verify history and notes tools retain their constraints in app-server model requests.

GitOrigin-RevId: 4cc89722b5b226d595b57232ec3b8e825863faf3
```

claude-acp:haiku (5389 ms):
```
Preserve bounds in reserved history and notes tool schemas

Schema compaction dropped minimum, maximum, and maxLength from the
parameters of reserved tools, so the model saw no limits on them.
Keep these keywords in JsonSchema and infer a string type from
maxLength so bounded strings survive normalization.
```

junie:junie-lite (7100 ms):
```
FAIL: no message in the report: ... conforms to 72-character limit and project style observed in recent commits.

### Notes
- No files modified; only the commit message was produced as requested.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4008 ms):
```
FAIL: Error: {"code":-32000,"message":"Authentication is required before this operation can be performed."}
```

## codex-10 (diff 7093 chars, git 115 ms)

Actual:
```
Treat `invalid_grant` refresh failures as permanent (#39637)

## Why

OAuth token endpoints can report an unusable refresh token with the standard
`invalid_grant` error instead of a legacy expired, reused, or revoked subtype.

## What changed

- Classify `400 Bad Request` responses with an `invalid_grant` error code as
  permanent refresh failures, preserving the generic failure reason.
- Cache that failure so subsequent refresh attempts do not repeat the request.
- Keep other `400 Bad Request` errors transient and retryable.

## Testing

Added refresh tests covering terminal `invalid_grant` responses and retryable
`invalid_request` responses.

GitOrigin-RevId: 513d34b514a7e4118a70c76e9d0fe779c006d5d8
```

claude-acp:haiku (7612 ms):
```
Treat invalid_grant refresh failures as permanent

RFC 6749 reports an unusable refresh token as invalid_grant without
the legacy expired, reused, or revoked subtype. Keep these 400
responses terminal with the generic reason instead of retrying them
as transient failures.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (11022 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the provided diff following the project's conventions
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4800 ms):
```
FAIL: stopReason cancelled
```

## codex-11 (diff 8342 chars, git 101 ms)

Actual:
```
Preserve strict MCP auto-review outcomes (#40031)

## What changed

Propagate canonical denial, timeout, and abort responses from strict MCP
auto-review instead of replacing them with a generic decline. This preserves
the reviewer's action and metadata, including denial rationale, while still
failing closed when no canonical decision is available.

Update the fallback message to direct the agent to request explicit user
approval before proceeding.

## Testing

Add unit and app-server integration coverage for strict auto-review denials
and cancellations.

GitOrigin-RevId: d8126ab223ab546b95e2d984f6e4dd540a324a59
```

claude-acp:haiku (6199 ms):
```
Preserve Guardian denials in MCP elicitation review

Guardian denials, timeouts, and aborts were dropped, so the elicitation fell back to a generic decline without the reviewer's rationale. Return these decisions as the elicitation response so the reason reaches the agent.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6698 ms):
```
FAIL: no message in the report: ...clude Denied, TimedOut, and Abort alongside Approved
- Updated test constants and expectations to match the new denial message format with rationale propagation
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3138 ms):
```
FAIL: stopReason cancelled
```

## codex-12 (diff 9370 chars, git 102 ms)

Actual:
```
Retry provider auth commands after initial failures (#40523)

## Why

A provider auth command can fail during initial credential resolution, leaving
no cached authentication. A subsequent `401` should still give the configured
provider one bounded opportunity to recover.

## What changed

- Treat configured external authentication with an empty cache as eligible for
  unauthorized recovery.
- Allow authority refresh to invoke the external provider when no prior auth is
  cached, while preserving the existing requirements for managers without an
  external provider.

## Testing

Added unit and client coverage for a provider command that fails initially and
succeeds during `401` recovery.

GitOrigin-RevId: 7cab9a03f90ce29b412be8fbd97b297acdad4482
```

claude-acp:haiku (5273 ms):
```
Recover provider command auth after initial resolution failure

Unauthorized recovery only ran for external auth already cached as an API key, so a provider auth command that failed on its first run was never retried. Treat missing external auth as refreshable so the command runs again after a 401.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6442 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the provided diff following the project's conventions (imperative mood, English, no issue ID since branch name isn't provided).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3091 ms):
```
FAIL: stopReason cancelled
```

## codex-13 (diff 10844 chars, git 100 ms)

Actual:
```
Give Responses Lite prefix items stable IDs (#40962)

## Why

Responses Lite rebuilds its tools and base-instruction prefix for each request. Stable item identities let follow-up WebSocket requests recognize that unchanged prefix and send only incremental input.

## What changed

- Derive deterministic IDs for additional-tools and base-instruction items from the thread ID and each item's serialized payload.
- Preserve IDs when rebuilding an unchanged request or resuming a session, while changing them when the thread or payload changes.

## Testing

- Cover ID stability and payload/thread sensitivity in request construction.
- Verify resumed Responses Lite sessions reuse prefix IDs and WebSocket follow-ups use `previous_response_id` with only new input items.

GitOrigin-RevId: 3c8548b96979d7578865b0ccc51c147926823478
```

claude-acp:haiku (4522 ms):
```
Stabilize Responses Lite prefix item IDs

Derive IDs for the per-request additional tools and base instructions
items from the thread ID and payload hash. Retries and resumed sessions
now send the same IDs, so websocket requests can use incremental create
on the shared prefix.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6818 ms):
```
FAIL: no message in the report: ...ge consistency.

### Notes
- Followed existing conventions: short summary line referencing the feature, no issue ID (branch name not provided), imperative mood.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2817 ms):
```
FAIL: stopReason cancelled
```

## codex-14 (diff 12306 chars, git 97 ms)

Actual:
```
Move relay helpers into exec-server test support (#40712)

## What changed

- Move the reusable WebSocket relay, registration, frame capture, and encryption assertion helpers into `codex-exec-server-test-support`.
- Re-export the helpers from the existing relay test module so its callers keep the same interface.
- Add the Cargo dependencies and Bazel proto compile data required by the shared support module.

GitOrigin-RevId: 0383149c79ef86cb5e64a09baec41332f9eec4c6
```

claude-acp:haiku (4235 ms):
```
Move relay test helpers into exec-server test support crate

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6072 ms):
```
FAIL: no message in the report: ...ge for refactoring relay test helpers from `tests/common/relay.rs` into a new `tests/support/relay.rs` module within the `codex-exec-server-test-support` crate.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2781 ms):
```
FAIL: stopReason cancelled
```

## codex-15 (diff 13298 chars, git 100 ms)

Actual:
```
Use turn environment settings for sandbox execution (#40771)

## Why

Tool execution can use an environment whose sandbox configuration differs from the turn-wide configuration. Sandbox selection and process setup need to follow the environment that owns the tool request.

## What changed

- Source Windows sandbox level, legacy Landlock mode, and Windows private desktop settings from the selected turn environment across tool orchestration, unified exec, patch application, and zsh fork escalation.
- Preserve Windows sandbox level overrides in restorable thread settings and invalidate MCP configuration when that level changes.

## Testing

- Add a resume test that verifies an elevated Windows sandbox override survives thread restoration.

GitOrigin-RevId: 9d8fc46404919f5ae97c9ed712c0932a1f095e36
```

claude-acp:haiku (6522 ms):
```
Resolve sandbox settings from the turn environment

Sandbox backend selection, exec-policy inputs, and patch approval now read
Windows sandbox and legacy Landlock settings from the turn environment's
config instead of the turn context, so they match the environment that
actually runs the command. MCP configuration is invalidated when the
Windows sandbox level changes, and restored thread settings keep the
runtime Windows sandbox override on resume.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (9943 ms):
```
FAIL: no message in the report: ...ification
- Not run: this is a commit message generation task, not code implementation.

### Notes
- No issue ID included since the branch name isn't available.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4103 ms):
```
FAIL: stopReason cancelled
```

## codex-16 (diff 15161 chars, git 108 ms)

Actual:
```
Track multi-agent v2 spawn calls in analytics (#39722)

## What changed

- Emit started and completed collaboration tool events for multi-agent v2
  `spawn_agent` calls, including failed invocations.
- Record execution duration and successful child-agent configuration metadata
  without including the spawn prompt.
- Deduplicate collaboration and subagent activity items by call ID when
  calculating per-turn subagent tool counts.

## Testing

- Extend the app-server multi-agent v2 integration test to cover successful
  and failed spawn telemetry, duration, prompt omission, and turn counts.

GitOrigin-RevId: c1c2fb9cc2a1a9b0f63ef68509ad36d11a92d1e5
```

claude-acp:haiku (4823 ms):
```
Track multi-agent v2 spawn calls in analytics

Report spawn_agent calls as collab tool call events and count each
collab or sub-agent tool call once per turn.
```

junie:junie-lite (7604 ms):
```
FAIL: no message in the report: ...g timing and status information
- Followed the existing commit message style: imperative mood, concise summary line under 72 characters, with a descriptive body
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2693 ms):
```
FAIL: stopReason cancelled
```

## codex-17 (diff 17587 chars, git 127 ms)

Actual:
```
Preserve inline TUI scrollback in Windows Terminal (#39619)

## Why

Windows Terminal can discard rows scrolled through a partial DEC scroll region instead of retaining them in terminal scrollback.

## What changed

- Detect Windows Terminal, including via `WT_SESSION`, and use full-screen scrolling for inline viewport growth and history insertion.
- Keep the existing terminal-wrapped history behavior for Zellij while centralizing terminal-specific scrollback selection.

## Testing

Add VT100-backed tests covering strategy selection and preservation of scrollback during history insertion and viewport growth.

GitOrigin-RevId: 209a7a8053a1fcf911d6e0aee764e563b8725bd1
```

claude-acp:haiku (6448 ms):
```
Use full-screen scrolling for Windows Terminal history

Partial DEC scroll regions can discard rows in Windows Terminal instead of moving them into scrollback. Scroll the whole screen there when inserting history or growing the viewport. Rename the Zellij raw insertion mode to FullScreen, since it now covers both cases.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (7754 ms):
```
FAIL: no message in the report: - Commit message written based on the provided diff and recent commit style.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2772 ms):
```
FAIL: stopReason cancelled
```

## codex-18 (diff 18883 chars, git 99 ms)

Actual:
```
Propagate temporary directories into sandbox policy contexts (#40660)

## Why

Filesystem policies containing `:tmpdir` need executor-local directory bindings,
including when execution occurs in a remote environment.

## What changed

- Cache temporary directories reported by remote executors and discover the
  equivalent directories for local environments.
- Preserve the cached directories across inherited environment selection and
  include them in `FileSystemSandboxContext`.
- Add `FileSystemSandboxPolicyContext` and a context accessor so filesystem
  policy entries can be resolved with the executor-owned current directory,
  workspace roots, and temporary directories.

## Testing

Extend environment-selection tests to cover local, remote, and inherited
temporary-directory policy context.

GitOrigin-RevId: 36335af3465c529f024bf69293af288803dd582d
```

claude-acp:haiku (6086 ms):
```
Carry executor temporary directories into sandbox contexts

Resolve `:tmpdir` policy entries against the directories of the
environment that runs the command, not the orchestrator's. Cache the
directories reported at environment setup and include them in the
filesystem sandbox context sent to the executor.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (8900 ms):
```
FAIL: no message in the report: ...tartup can cache the values
- Flow temporary directories through environment resolution for both local and remote exec-servers, including inherited environments
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2730 ms):
```
FAIL: stopReason cancelled
```

## codex-19 (diff 21167 chars, git 292 ms)

Actual:
```
Expand OAuth metadata redirect test coverage (#39320)

## What changed

- Cover same-origin redirects for protected-resource and authorization-server metadata.
- Verify that cross-origin redirects are rejected before contacting their targets and that redirect cycles fail within a bounded timeout.
- Exercise issuer validation and resource-header isolation for both direct and redirected metadata across legacy and Agent Plugin discovery modes.
- Reuse the test environment's local HTTP client throughout the discovery tests.

GitOrigin-RevId: bd12ac232c3b020a1c098a413361f8e205699699
```

claude-acp:haiku (7703 ms):
```
Cover OAuth metadata redirect handling in MCP discovery tests

Cover same-origin metadata redirects, cross-origin redirect rejection,
and redirect cycles in the legacy OAuth discovery tests. Discovery now
runs through the local HTTP client only, and the authorization-server
requests are checked for leaked resource headers.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (9282 ms):
```
FAIL: no message in the report: Wrote a commit message for the OAuth discovery test changes.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2742 ms):
```
FAIL: stopReason cancelled
```

## codex-20 (diff 23412 chars, git 107 ms)

Actual:
```
Attribute executor skill invocations to plugins (#39309)

## What changed

- Carry selected plugin identities from MCP discovery into per-turn extension data, limited to capability roots that are ready for the turn.
- Annotate executor skill catalog entries with the matching plugin ID and `user` scope.
- Include that attribution in `skill_invocation` analytics for both explicit and implicit executor skill invocations.

## Testing

- Extend the executor skills app-server test to verify plugin ID, skill scope, and invocation type for explicit and implicit analytics events.

GitOrigin-RevId: 9345600ae29bcb8eb894fffd2d6f7b05f22ebf74
```

claude-acp:haiku (6139 ms):
```
Attribute executor skill invocations to their plugin

Selected plugin identities are now kept on the thread, so executor
skill invocation analytics report the plugin_id and user scope instead
of null. Skill tools are also registered when only executor skills are
available, without requiring the orchestrator provider.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (8644 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the provided diff following the project's conventions (imperative mood, concise summary, body explaining what changed and why).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2884 ms):
```
FAIL: stopReason cancelled
```

## codex-21 (diff 25330 chars, git 96 ms)

Actual:
```
Add structured full approval reviews to extensions (#40472)

## What changed

- Split the approval review contributor into a `fast_decision` path for existing evidence and a `full_review` path for structured reviews.
- Add host-owned full-review inputs with action evidence, conversation history, thread and turn identifiers, approval context, and extension data.
- Add structured assessment and error types, and resolve full reviews using the first contributor that claims the request.

## Testing

- Cover full-review input propagation, first-claim ordering, and short-circuit behavior in the extension registry tests.

GitOrigin-RevId: 6f763d874af8c0b66a0d760b7b7c7dfe32251c9e
```

claude-acp:haiku (5945 ms):
```
Split approval review contributors into fast and full paths

Approval review contributors can now return a fast decision from existing evidence, or perform a full structured review of a host-owned approval request. The registry exposes both paths, so hosts can try the cheap path first and fall back to a full review. The existing contribute hook is renamed to fast_decision to make its role explicit.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (11355 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the provided diff refactoring `ApprovalReviewContributor` to separate fast decisions from full structured reviews.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2749 ms):
```
FAIL: stopReason cancelled
```

## codex-22 (diff 28926 chars, git 102 ms)

Actual:
```
Use model-specific auto-review outcome instructions (#39741)

## What changed

- Add `rejection_instructions` and `timeout_instructions` to catalog-provided auto-review messages.
- Use the acting model's instructions for denied and timed-out reviews across tool approvals, shell escalation, and MCP elicitation responses.
- Fall back to the existing instructions only when a catalog value is absent, while preserving explicit empty-string overrides.

## Testing

- Cover catalog overrides, legacy fallbacks, empty values, and separation between acting-model and reviewer-model messages.

GitOrigin-RevId: c5b2c2dbdaefd45d1d658651dd1abaeb6d8c93da
```

claude-acp:haiku (7200 ms):
```
Use acting model Guardian timeout and rejection text

Read the rejection and timeout messages from the acting model's
auto_review catalog entry. The legacy constants remain the fallback
when the field is absent. An empty string is used as-is.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (9375 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the provided diff following the project's conventions (imperative mood, no issue ID since none was provided).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2700 ms):
```
FAIL: stopReason cancelled
```

## codex-23 (diff 31823 chars, git 108 ms)

Actual:
```
Allow extensions to skip host skill discovery (#40631)

## What changed

- Add the under-development `skip_host_skill_discovery` feature to bypass host
  skill snapshots during session warmup and turn setup.
- Let skill invocation contributors declare whether they require host-owned
  skills. Preserve host discovery when no contributors are registered or any
  contributor requires it.
- Keep executor and orchestrator skill catalogs and instruction loading
  available when host discovery is skipped.

## Testing

- Cover executor-only, orchestrator, mixed-contributor, and legacy host-skill
  behavior.

GitOrigin-RevId: 48169403090b234e1a304c6523633fd867df454a
```

claude-acp:haiku (6584 ms):
```
Skip host skill discovery when no contributor needs it

Add the skip_host_skill_discovery feature flag. When it is enabled and no
registered skill contributor requires host-owned skills, sessions and
turns skip the host skill snapshot. Executor and orchestrator catalogs
are supplied independently, so their skills stay available.

Extensions opt out by overriding
SkillInvocationContributor::requires_host_skill_discovery. The default
keeps host discovery for contributors that do not opt out.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6199 ms):
```
FAIL: no message in the report: - Commit message generated based on the provided diff and recent commit conventions.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2758 ms):
```
FAIL: stopReason cancelled
```

## codex-24 (diff 36705 chars, git 100 ms)

Actual:
```
Prepare isolated Guardian reviewer sessions (#40742)

## What changed

- Add a policy prompt and output contract for synchronous Guardian reviews.
- Build reviewer thread options with a preferred review model, low reasoning effort when supported, and a fallback to the parent model and effective effort.
- Isolate reviewer sessions from parent instructions, MCP servers, optional features, and write access while preserving read restrictions, resolved environments, managed network constraints, and rollout persistence.
- Mark prepared threads as internal Guardian review sessions for later host-managed startup.

## Testing

- Cover reviewer isolation, read-only environment inheritance, review-model overrides, and parent-model fallback behavior.

GitOrigin-RevId: 5133be99674b64e06e19e7f2dbc86439e1678790
```

claude-acp:haiku (4957 ms):
```
Add isolated reviewer config for Guardian sync review

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (8133 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the Guardian v2 sync reviewer changes
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2798 ms):
```
FAIL: stopReason cancelled
```

## codex-25 (diff 40675 chars, git 114 ms)

Actual:
```
Render Markdown links as clickable labels in supported terminals (#40471)

## What changed

- Render web-link labels in cyan with an underline and hide the repeated destination in recognized terminals with hyperlink support.
- Keep destinations visible for unknown terminals, multiplexers, non-terminal output, and empty labels so the URL remains usable.
- Preserve OSC 8 link targets through prose and table wrapping, streaming updates, transcript clipping, and pager scrolling.

## Testing

- Add coverage for terminal detection, label formatting and fallbacks, wrapped tables and prose, streaming parity, history output, and scrolled transcript rendering.

GitOrigin-RevId: 4a09e41e349ba299022a9c00f0c25892d9aaefe3
```

claude-acp:haiku (7069 ms):
```
Hide web link URLs behind labels in capable terminals

Markdown links to web destinations now show only their styled label in
terminals known to support OSC 8 hyperlinks. Unknown terminals,
multiplexers, and dumb or screen/tmux TERM values keep the visible URL
so the destination is never lost.

Transcript rendering now goes through a shared HyperlinkParagraph so
hyperlink annotations stay aligned with wrapped and scrolled text. Link
labels also keep link styling inside tables and streamed output.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (7616 ms):
```
FAIL: no message in the report: ..., no code changes.

### Notes
- Commit message follows the project's style: imperative mood, concise summary under 72 chars, body explains what changed and why.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2767 ms):
```
FAIL: stopReason cancelled
```

## codex-26 (diff 46683 chars, git 99 ms)

Actual:
```
Treat user input answers as Guardian authorization changes (#40623)

## Why

Answers collected by `request_user_input` can change what the user authorizes, but post-tool hooks may replace or reject the tool output that Guardian normally sees.

## What changed

- Record bounded, host-observed answers before post-tool hooks run and provide them as trusted evidence to synchronous and asynchronous Guardian reviews.
- Include root-thread answers in worker review context.
- Count successful answers as authorization changes so earlier review evidence becomes stale, while ignoring empty or unrelated answers.

## Testing

Add coverage for allowed and denied stale reviews, empty and oversized answers, hook-modified output, and root-to-worker propagation.

GitOrigin-RevId: 970c52e40338ecd057c7cd2a69d04b06e97cd068
```

claude-acp:haiku (5534 ms):
```
Accept user input answers as Guardian authorization evidence

Request user input answers are recorded as trusted evidence before
post-tool hooks can replace them. Each answer advances the
authorization version, so earlier synchronous Guardian reviews are not
applied after the user responds. Root answers also reach worker
reviews.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (7702 ms):
```
FAIL: no message in the report: - Generated a git commit message for the provided diff following the project's conventions (imperative mood, issue ID from context, 72-char wrap).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2873 ms):
```
FAIL: stopReason cancelled
```

## codex-27 (diff 52531 chars, git 122 ms)

Actual:
```
Prepare the TUI for conversation recaps (#40696)

## What changed

- Forward terminal focus changes through the TUI event stream and handle them across interactive screens.
- Track completed turns and recap eligibility across active, resumed, and switched threads.
- Add bounded recent-conversation prompt construction and a wrapping `Conversation recap` history cell.
- Cover focus timing, repeat eligibility, restored progress, UTF-8 prompt limits, and recap rendering with unit and snapshot tests.

GitOrigin-RevId: d7542c18b2bb1e72f5906f563898645bb526255f
```

claude-acp:haiku (7551 ms):
```
Track recap eligibility for unfocused TUI threads

Terminal focus loss and gain are now delivered to the TUI as their own
events instead of being dropped or treated as draws. The app records
when a thread is left unfocused and how many turns have completed, so
a catch-up recap can later be generated for threads that stayed in the
background.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (9679 ms):
```
FAIL: no message in the report: ...adds automatic conversation recap functionality to the Codex TUI
- Message follows the project's conventions: imperative mood, no issue ID, 72-char wrapped body
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2943 ms):
```
FAIL: stopReason cancelled
```

## codex-28 (diff 59843 chars, git 158 ms)

Actual:
```
Add managed developer instructions to requirements (#39755)

## What changed

- Add `additional_developer_instructions` to managed requirements and expose it through `configRequirements/read` as `additionalDeveloperInstructions`, independently of ordinary developer instructions.
- Include the managed instructions in model context, emit explicit replacement or removal messages when requirements change, and preserve the current value across compaction, resume, and agent forks without duplication.
- Reject managed instructions whose rendered context exceeds 10,000 estimated tokens.

## Testing

- Cover requirements layering and API serialization, context updates and removal, size validation, repeated model requests, compaction and resume, rollout migration, and agent forks.

GitOrigin-RevId: bc0b70fb7988944c2f68176dff55f5ed61eb46c8
```

claude-acp:haiku (6897 ms):
```
Add managed developer instructions from requirements

Requirements can now set additional_developer_instructions. Unlike
developer_instructions, which clients own, this policy is sent as its
own developer message and updated through the world-state diff, so it
persists across turns, compaction, and resume. Forked agents drop
inherited copies and receive the current policy at startup. Oversized
policy fails config loading instead of being truncated.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (11116 ms):
```
FAIL: no message in the report: ...ates and removals with replacement/removal notices in conversation history
- Sanitize managed instructions during agent fork to avoid duplicating stale policies
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3210 ms):
```
FAIL: stopReason cancelled
```

## codex-29 (diff 76597 chars, truncated, git 141 ms)

Actual:
```
Sanitize credentials from Git remote metadata (#40713)

## Why

Git remote URLs can embed usernames, passwords, or tokens. Codex carries these
URLs through turn metadata and persisted thread metadata, so credentials must be
removed before a remote enters those paths.

## What changed

- Add `SanitizedGitUrl`, which parses Git URL and SCP-style remotes, strips
  authentication data, and preserves the conventional `git` SSH user.
- Use sanitized remotes when collecting Git metadata, enriching model requests,
  discovering cloud environments, updating thread metadata, and reading legacy
  rollouts. Reject or omit malformed remotes instead of retaining their raw
  contents.
- Keep API, schema, and TypeScript representations as strings while enforcing
  sanitization in Rust.

## Testing

- Cover URL schemes, SCP and IPv6 forms, remote helpers, encoded paths,
  malformed values, and legacy deserialization.
- Verify credentials do not appear in model requests, API responses, SQLite, or
  rollout files.

GitOrigin-RevId: 6435efc4c45bfbfad4723ce7a0457cb00175f25c
```

claude-acp:haiku (6394 ms):
```
Strip credentials from Git remote URLs

Git remotes can embed usernames and passwords. Store and send them only
through SanitizedGitUrl so credentials never reach thread metadata,
SQLite, rollout files, turn metadata headers, or cloud environment
detection.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (7534 ms):
```
FAIL: no message in the report: - Commit message generated based on the provided diff and recent commit style.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3248 ms):
```
FAIL: stopReason cancelled
```

## codex-30 (diff 101984 chars, truncated, git 101 ms)

Actual:
```
Add live turn settings updates (#40653)

## What changed

- Add a feature-gated `TurnSettings` operation that can update the model,
  reasoning effort, reasoning summary, and service tier for subsequent steps of
  a named running turn without changing future thread settings.
- Report whether an update was applied, rejected, or lost its live target.
- Revalidate managed constraints and preserve the turn's admitted approval and
  Guardian safety properties before publishing an updated settings snapshot.

## Testing

- Cover sparse updates, step capture and ordering, target replacement, managed
  policy changes, model metadata safety, and separation from future settings.

GitOrigin-RevId: ecaaaa95b4fd4ec9d62265bef551582dddb36d78
```

claude-acp:haiku (6599 ms):
```
Allow restricted settings updates to running turns

Let a live task change its model, effort, summary, and service tier
for subsequent step captures without altering its admitted snapshot
or future thread settings. Updates are validated against the admitted
turn's approval, reviewer, and guardian constraints, and rejected when
those legacy consumers would otherwise see a mismatch. Gated behind
the step_model_switching feature.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (8746 ms):
```
FAIL: no message in the report: ...ngs update capability, the safety validation layer, and the associated feature flag registration.
- No issue ID included since the branch name was not provided.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2749 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-1 (diff 387 chars, git 3452 ms)

Actual:
```
misc codeowners: give IJPL the community productLayout package

The product model under community/platform/build-scripts/src/org/jetbrains/intellij/build/productLayout belongs to IJPL.
The OWNERSHIP syntax has no negation pattern. A later pattern rule in the parent file overrides the IJ Build Scripts Maintainers default for that package.
```

claude-acp:haiku (5318 ms):
```
[platform] Assign productLayout build scripts to IJPL

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6470 ms):
```
FAIL: no message in the report: ...age text.

### Notes
- The diff adds an ownership rule for `/src/org/jetbrains/intellij/build/productLayout/**` assigned to 'IJPL', with a blank line separator.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2934 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-2 (diff 938 chars, git 647 ms)

Actual:
```
[jps] rename builder to mitigate TW-104697
```

claude-acp:haiku (3415 ms):
```
[jps] Capitalize the Project Dependencies Resolver builder name
```

junie:junie-lite (7844 ms):
```
FAIL: no message in the report: ...ct's conventions: uses the `[i18n]` prefix matching recent commits, imperative mood, lowercase start, and describes the change itself rather than the file list.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2877 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-3 (diff 1021 chars, git 1960 ms)

Actual:
```
IDEA-392279 [java-psi] Follow-up: remove redundant instantiateWith call
```

claude-acp:haiku (6567 ms):
```
Subject line: the change narrows an incorporation step so it keeps the usage nullability instead of combining it with the bound's existing nullability. Recent messages use `[java-psi]` scope tags and no issue id (the branch name isn't provided, so I won't invent one).[java-psi] Apply usage nullability to inference bounds

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (13108 ms):
```
FAIL: no message in the report: ...s the style of recent commits (prefix format, lowercase, concise)

### Notes
- The commit message is under 72 characters so no body is needed per the guidelines
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2770 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-4 (diff 1372 chars, git 185 ms)

Actual:
```
IJPL-251091 assert every step of the previous-window lookup

The test was muted on 2026-07-23 and the failure text did not survive:
TeamCity dropped the July builds, and the issue and the Slack thread hold
only a link. The test body was unchanged since then, and the muted test
passed in every retained build after the class teardown started to await
pending editor opens and to unsplit windows.

Assert the selected tab before the split, the two windows after it, and
the lookup in both directions. A future failure then names the broken
step instead of a bare null.
```

claude-acp:haiku (4053 ms):
```
tests [editor]: assert the split window copies the selected tab

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (7765 ms):
```
FAIL: no message in the report: - Wrote commit message for the test change in FileEditorManagerTest.kt that adds assertions for split window registration and navigation.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2839 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-5 (diff 1529 chars, git 955 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, adjust benchmark, part10
```

claude-acp:haiku (6953 ms):
```
[editor] Drop slow renameVariable from doc branch perf test

renameVariable is too slow for this benchmark. Narrow the random action range to 0..88 so the rename branch is never picked, and raise SINGLE_USER_BATCHES from 20 to 1000 for a longer single-user run.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6796 ms):
```
FAIL: no message in the report: - Write git commit message for DocBranchPerformanceTest.kt changes
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2887 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-6 (diff 1688 chars, git 593 ms)

Actual:
```
AND-150 [android] Remove dead Compose compiler keys from K2ComposeCompilerConfigurationProvider
```

claude-acp:haiku (4888 ms):
```
[compose] Drop IntrinsicRemember and strong skipping overrides for K2

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (6805 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the diff that removes IntrinsicRemember and strong skipping optimization flags from K2ComposeCompilerConfigurationProvider.kt
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2738 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-7 (diff 1952 chars, git 478 ms)

Actual:
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

claude-acp:haiku (4324 ms):
```
switch intellij.java.ide.customization.backend.tests
```

junie:junie-lite (8403 ms, cleaned):
```
tests: add intellij.java.ide.customization.backend.tests to bazel
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2850 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-8 (diff 2104 chars, git 9341 ms)

Actual:
```
KTIJ-39860 [kotlin] Fix impossible is check null quick-fix
```

claude-acp:haiku (3864 ms):
```
[kotlin] Fix inverted operator in ReplaceIsCheckWithNullCheckFix
```

junie:junie-lite (8212 ms):
```
FAIL: no message in the report: ...style of recent commits in the project

### Notes
- The fix corrects a logic error where `isNegated` was mapping to the wrong comparison operator ("==" vs "!=")
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3882 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-9 (diff 2367 chars, git 875 ms)

Actual:
```
[git] Initialize recentCommitsProvider in the background (IJPL-248720)
```

claude-acp:haiku (4154 ms):
```
git: Create recent commits provider asynchronously
```

junie:junie-lite (6909 ms):
```
FAIL: no message in the report: - Written commit message for the diff that defers `GitRecentCommitsProvider` initialization using `scope.async` in `GitAmendCommitService.kt`.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2726 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-10 (diff 2642 chars, git 116 ms)

Actual:
```
cleanup [python]: Clean up formatting and imports in PyTypeChecker
```

claude-acp:haiku (4001 ms):
```
misc python: tidy imports and wrap subclassElementType signature
```

junie:junie-lite (6624 ms):
```
FAIL: no message in the report: - Wrote a git commit message for a diff that removes unused imports and reformats a function signature in PyTypeChecker.kt.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2834 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-11 (diff 3296 chars, git 8659 ms)

Actual:
```
[skeleton] IJPL-257214 use the fallback renderer instead of the canvas in the Windows frontend
```

claude-acp:haiku (4632 ms):
```
[skeleton] use the fallback renderer for Windows client

Rename the Wayland renderer to EditorSkeletonFallbackRenderer and use it
on Windows JetBrains Client too. The Canvas renderer hits JBR-10643
there, and the fallback creates no Canvas.
```

junie:junie-lite (10059 ms, the IDE drops JBR-10643):
```
FAIL: no message in the report: ...rSkeletonWaylandRenderer` to `EditorSkeletonFallbackRenderer` and extending its use to Windows (JetBrains Client) to avoid the `Canvas`-related JBR-10643 issue.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (8680 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-12 (diff 3785 chars, git 861 ms)

Actual:
```
[pycharm] PY-89999 Pin the Python tool window startup-availability default on the split frontend

The tool window was absent in remote dev because the split frontend fell back to the
false default for python.toolwindows.available.at.startup. The test reads the key inside
the frontend process and sets no override of its own, so it depends on the default the
frontend customization plugin supplies. Split only: PyCharm Professional's monolith
customization defaults the same key to true, so a monolith invocation would pass with the
fix reverted.
```

claude-acp:haiku (8109 ms):
```
[python] Add a split-frontend test for the tool window startup flag

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (14259 ms):
```
FAIL: no message in the report: ..., issue ID from the code (PY-89999), concise summary under 72 characters.

### Notes
- No body needed as the summary fully describes the change (adding a test).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4507 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-13 (diff 4115 chars, git 850 ms)

Actual:
```
[platform] Raise the EDT priority natively to prevent its inheritance by new threads on Windows (RIDER-143488, KT-89579)

UiThreadPriority put the EDT above the dispatchers with
Thread.setPriority(MAX_PRIORITY) since 10d57269804b0 (2025.1). A Java
priority is copied to every thread the EDT creates, and the EDT creates
most kotlinx.coroutines workers, so the DefaultDispatcher-worker
threads, the ForkJoinPool delay scheduler and the Fleet kernel loop ran
at THREAD_PRIORITY_HIGHEST too, above the threads that publish into the
scheduler's global queue: kotlinx.coroutines.DefaultExecutor, Periodic
tasks thread, the application pool.

LockFreeTaskQueueCore spins without bound while a publisher has
reserved a slot and not yet stored the element. Windows schedules
strictly by priority, so a lower-priority publisher preempted in that
window did not run again while the workers spun on every logical CPU,
until the kernel's anti-starvation boost about 4 s later. For those
seconds the workers held all cores at HIGHEST and the publisher, like
every other thread at NORMAL or below on the machine, stayed runnable
without CPU.

The EDT now calls SetThreadPriority(THREAD_PRIORITY_HIGHEST), the level
HotSpot maps MAX_PRIORITY to, and leaves its Java priority at 6, which
HotSpot maps to THREAD_PRIORITY_NORMAL. Threads the EDT creates run at
NORMAL like everybody else, the UI still outranks the dispatchers, and
a preempted publisher gets a core within one quantum. The macOS branch
already works this way with a QoS class; Linux has no branch.
```

claude-acp:haiku (9065 ms):
```
Refactor platform: Raise EDT priority through the native API

Thread.setPriority copies the Java priority to threads the EDT creates.
The lazily started kotlinx.coroutines workers got THREAD_PRIORITY_HIGHEST,
above the threads that feed their queue. Their spin-wait on a preempted
producer then held every CPU for seconds. A native priority set via
SetThreadPriority is not inherited by threads created later.
```

junie:junie-lite (8087 ms):
```
FAIL: no message in the report: ...hanges EDT priority setting from Java's Thread.setPriority to a direct native SetThreadPriority call, avoiding priority inheritance by coroutine worker threads.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2976 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-14 (diff 4485 chars, git 1335 ms)

Actual:
```
[UI, Navigation] IJPL-257977 Fix NavigationService cancellation exceptions

The usual currentCoroutineContext().ensureActive() trick to ensure
that the exception is only propagated if it was our coroutine that
got canceled.

Done in doExclusively and not in twoPhaseExecutor, for example,
because it covers at least two cases: twoPhaseExecutor and
prepareWithProgressIfNeeded, which rethrows exceptions
from withBackgroundProgress.
```

claude-acp:haiku (5349 ms):
```
[navigation] Return false when navigation is canceled externally

A newer navigation request or a user cancellation no longer leaks
CancellationException to the caller. Only cancellation of the caller's
own coroutine is rethrown.
```

junie:junie-lite (8317 ms):
```
FAIL: no message in the report: ...he project's conventions: `[navigation]` prefix, imperative mood, 72-char limit on summary line
- No issue ID included since the branch name doesn't contain one
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4073 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-15 (diff 4877 chars, git 117 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, JvmStatic, part45
```

claude-acp:haiku (4489 ms):
```
[editor] Expose experimental factory methods to Java via @JvmStatic

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (11285 ms):
```
FAIL: no message in the report: ...lin interface files in the editor experimental module.
- Followed the existing commit message convention: `[editor] IJPL-254637 naive eg-walker, <description>`.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (5657 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-16 (diff 5268 chars, git 4500 ms)

Actual:
```
fix [VCS]: Git log: second pressing of "delete branch" button logs an error IJPL-163588

Also fixes IJPL-257749
```

claude-acp:haiku (6209 ms):
```
[git] Ignore repeated deletion of an already deleted branch

Pressing "Delete" again before the UI reflects the previous deletion
sent a stale request for a branch that no longer exists. Skip
repositories where the branch is already gone, and serialize deletion
requests so each one sees the result of the previous one.
```

junie:junie-lite (7031 ms):
```
FAIL: no message in the report: - Generated a git commit message for the provided diff following the project's conventions.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (3640 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-17 (diff 6386 chars, git 522 ms)

Actual:
```
[plugin-manager] IJPL-257815 Keep selected rows below sticky headers after refresh

Refreshing plugin sources can replace the selected row and restore an
anchor that leaves the row behind the sticky header.

Reveal the selected row after anchor restoration when the old row was
visible. Leave offscreen selections in place. Add tests for both cases
and update the UI specification.
```

claude-acp:haiku (4877 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (9446 ms):
```
FAIL: no message in the report: - Created a git commit message for the provided diff following the project's conventions.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4819 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-18 (diff 6986 chars, git 7382 ms)

Actual:
```
[java] IDEA-369985 SlowOp in GenerateToStringWorker.exitsMethodDialog
```

claude-acp:haiku (5548 ms):
```
[java] Look up existing toString method off the EDT

The lookup for an existing toString method can be slow, and it ran on the EDT before the write command. Run it in a non-blocking read action on a background thread, then show the conflict dialog on the EDT.
```

junie:junie-lite (8341 ms):
```
FAIL: no message in the report: ...- The commit message follows the observed pattern: `[language]` prefix, imperative mood, summary under 72 characters with a body explaining what changed and why
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2876 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-19 (diff 8020 chars, git 7921 ms)

Actual:
```
[Java. Tests] IDEA-394694 Fix project test leak in `com.intellij.java.codeInspection.GlobalInspectionContextTest`
```

claude-acp:haiku (5565 ms):
```
[test framework] unregister keys of configured inspections on dispose

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (8499 ms):
```
FAIL: no message in the report: - Generated commit message for the provided diff adding HighlightDisplayKey cleanup on disposal and a new test file.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4131 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-20 (diff 9108 chars, git 397 ms)

Actual:
```
KTIJ-40403 [kotlin] Offer remove question quick fix before callable references
```

claude-acp:haiku (7541 ms):
```
[kotlin] Fix 'Remove ?' fix when space or comment precedes '::'

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (8778 ms):
```
FAIL: no message in the report: ...uick fix for callable references to static members now correctly handles
edge cases where the question mark is separated from the LHS by whitespace or comments.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2671 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-21 (diff 10486 chars, git 243 ms)

Actual:
```
[kotlin] inline: inline type parameters

- simplify type parameters processing

KTIJ-40432
```

claude-acp:haiku (4335 ms):
```
[kotlin] inline: drop allowAnalysisOnEdt/FromWriteAction from CodeInliner
```

junie:junie-lite (6415 ms):
```
FAIL: no message in the report: Generated git commit message for the CodeInliner refactoring.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2685 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-22 (diff 10986 chars, git 578 ms)

Actual:
```
[markdown] IJPL-257188 Support the Sticky Lines feature in Markdown


Merge-request: IJ-MR-227314
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

claude-acp:haiku (6565 ms):
```
[markdown] Pin headings as sticky lines until their section ends
```

junie:junie-lite (7807 ms):
```
FAIL: no message in the report: ...ke `HeaderRegionsBuildingVisitor` internal so the breadcrumbs collector can reuse it
- Add tests covering sticky line hierarchy, setext headings, and edge cases
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2833 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-23 (diff 12992 chars, git 488 ms)

Actual:
```
[markdown] IJPL-257766 Support Setext headers in Markdown live preview


Merge-request: IJ-MR-227110
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

claude-acp:haiku (5589 ms):
```
[markdown] Render Setext headings in Markdown live preview

Setext headings now render like ATX headings in live preview, so the
heading text is styled and its underline is drawn as a horizontal rule.
Previously only an underline under a code span was changed.
```

junie:junie-lite (10183 ms):
```
FAIL: no message in the report: ...ication
- Reviewed diff to understand the change scope: heading HTML generation, spec handling, and tests
- Checked recent commit messages for style conventions
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (7533 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-24 (diff 14987 chars, git 8784 ms)

Actual:
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude-acp:haiku (5760 ms):
```
[Java. Tests] move com.intellij.find tests to com.intellij.java.find

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (10056 ms):
```
FAIL: no message in the report: ...t run: documentation-only task (commit message generation)

### Notes
- Message follows the established pattern: `[Java. Tests] IDEA-393917 move <old> to <new>`
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (7301 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-25 (diff 16602 chars, git 8421 ms)

Actual:
```
refactoring air: give the observe fixture a fake process table

The vnc test failed once at load 140 with "worker air-linux-1 is
stopped". Tart::running reads the pid record and probes the recorded pid
with /bin/ps. The observe fixture recorded the test process itself. So
the verdict came from five real ps answers about a busy process, and one
answer changed under load.

Runner::probe_process now asks a ProcessTable when the runner has one.
A production runner has none, so it still runs /bin/ps. The observe
fixture gives its runner FakeProcesses, and mark_ready records a fake
process. Machine expects large_enum_variant, because the runner field
moves the size gap over the clippy limit.
```

claude-acp:haiku (6971 ms):
```
refactoring air: probe a fake process table in lane tests

The observation fixture marked a worker ready with the suite's own pid
as its run process, so the probe read the test process itself and
depended on the host. A runner can now take a ProcessTable that answers
probes in place of the host, and the fixture declares its stand-in
processes there. Also allow large_enum_variant for Machine on Unix,
since a manager holds one machine for its whole life.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (9449 ms):
```
FAIL: no message in the report: refactoring [vm]: add a fake process table for hermetic probes
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (5280 ms):
```
FAIL: Error: {"code":-32000,"message":"Authentication is required before this operation can be performed."}
```

## intellij-community-26 (diff 22415 chars, git 9056 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, rename, part3
```

claude-acp:haiku (6201 ms):
```
[editor] rename DocTextBranch to DocBranch

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (16682 ms):
```
FAIL: no message in the report: ... imperative mood, concise summary under 72 characters with a body explaining what changed and why.
- No issue ID included since the branch name wasn't provided.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (9316 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-27 (diff 27722 chars, git 111 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, DAG pretty printer, part19
```

claude-acp:haiku (7881 ms):
```
[editor] naive eg-walker, draw event graph as text diagram

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (14982 ms):
```
FAIL: no message in the report: ...commits.

### Notes
- Branch name not provided, so issue ID IJPL-254637 is taken from the consistent pattern in all recent commit messages rather than invented.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (10405 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-28 (diff 41351 chars, git 532 ms)

Actual:
```
IJPL-252267 Add UI for editing default excludes
```

claude-acp:haiku (11561 ms):
```
lang.impl: Make default .analysisignore exclusions editable

The default exclusions were a constant. They are now stored in the
application settings, so the user can edit them in the File Types
settings. A new file in a project root and the default entity of each
root take the edited lines at once. Until the user changes them, the
built-in lines apply and the state holds no lines for them.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (13217 ms):
```
FAIL: no message in the report: - Wrote a git commit message for the provided diff summarizing the changes to .analysisignore default exclusions settings
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (7564 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-29 (diff 59619 chars, git 11172 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, run-length encode, part2
```

claude-acp:haiku (7188 ms):
```
[editor] Run-length encode the Eg-walker event graph

One event now covers a run of single-character operations, so a
fragment insert or delete costs one graph entry instead of one per
character. Merges split a run that is only partly known. The replay
still works per character.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (26622 ms):
```
FAIL: no message in the report: ... message text.
- ### Notes
  - The commit message follows the pattern of the previous commit `[editor] IJPL-254637 naive eg-walker, part1`, continuing as part2.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (5948 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-30 (diff 99790 chars, truncated, git 141 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, move offset, part51
```

claude-acp:haiku (7459 ms):
```
[editor] naive eg-walker, text move ops

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (10716 ms):
```
FAIL: no message in the report: - Added text move support to the DocumentOp/DocBranch CRDT system with move offsets on insert/delete ops
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (5652 ms):
```
FAIL: stopReason cancelled
```
