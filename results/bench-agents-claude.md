# bench-agents-claude

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | cost $ |
|---|---|---|---|---|---|---|---|---|
| claude:haiku:safe | 60/60 | 2395 | 5310 | 6010 | 0 | 72 | 0 | 0.0112 |
| claude:claude-haiku-5-5:safe:low | 60/60 | 2117 | 3507 | 7810 | 0 | 103 | 27 | 0.0645 |

## codex-1 (diff 688 chars, git 466 ms)

Actual:
```
Skip postprocessing for short composer input (#39744)

## What changed

Return the initial wrapping ranges directly when the composer input produces a
single line and its byte length is less than the available width. This avoids
the additional grapheme and word-boundary pass for input that cannot wrap.

GitOrigin-RevId: 55d990a354fcc61e9a90d5796b4b39d16742cc50
```

claude:haiku:safe (2214 ms):
```
Fix edge case in wrapped lines calculation for narrow widths
```

claude:claude-haiku-5-5:safe:low (1674 ms):
```
TUI: skip wrapping for short single-line composer text
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

claude:haiku:safe (2244 ms):
```
Simplify cyber execution policy test by removing timeout parameters

The timeout configuration is not necessary for the test's functionality.
Removed timeout_key variable and timeout_ms/yield_time_ms arguments
from the command response helper function.
```

claude:claude-haiku-5-5:safe:low (1759 ms):
```
Remove timeout args from cyber exec policy test
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

claude:haiku:safe (2395 ms):
```
Add IPC namespace isolation to Linux sandbox processes

Unshare the IPC namespace in addition to user and PID namespaces to
further isolate sandboxed processes and prevent inter-process
communication between the sandbox and host.
```

claude:claude-haiku-5-5:safe:low (2164 ms):
```
Add --unshare-ipc to Linux bubblewrap sandbox flags

Isolate System V IPC and POSIX message queues from the host by
unsharing the IPC namespace in both the full-filesystem and the
default bubblewrap configurations.
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

claude:haiku:safe (1593 ms):
```
Prevent Node REPL auth tokens from reaching child processes
```

claude:claude-haiku-5-5:safe:low (1876 ms):
```
Add NODE_REPL_AUTH_TOKEN to non-inheritable env vars

Keep the Node REPL auth token out of model-reachable child
processes, matching the other auth and identity variables already
in NON_INHERITABLE_ENV_VARS. Cover the case-insensitive matching
in the policy tests.
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

claude:haiku:safe (2218 ms):
```
Increase MCP tool name length limit from 64 to 128 bytes

Update the maximum tool name length constant and adjust related tests
to reflect the new 128-byte limit for model-visible MCP tool names.
This allows for longer tool names while maintaining uniqueness and
compatibility with the responses API.
```

claude:claude-haiku-5-5:safe:low (2073 ms):
```
Raise MCP tool name limit from 64 to 128 bytes

The Responses API accepts longer function names, so the model-visible
name limit in tool normalization is raised to match. Tests now cover the
128-byte boundary and the hashing fallback past it.
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

claude:haiku:safe (2231 ms):
```
Preserve Windows sandbox proxy settings for Guardian internal sessions

Guardian internal sessions should preserve proxy settings rather than
reconcile them to avoid interfering with the Guardian's sandboxed
environment configuration.
```

claude:claude-haiku-5-5:safe:low (2041 ms):
```
Use Guardian sandbox proxy settings for internal sessions

Internal Guardian sessions now preserve the Windows sandbox proxy
settings mode instead of reconciling them. Other session sources keep
the existing reconcile behavior.
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

claude:haiku:safe (2328 ms):
```
Move text helper serialization test to code-mode-runtime

Move the test for `text()` helper object serialization from the
integration test suite to the code-mode-runtime unit tests, where it
belongs with other text helper tests.
```

claude:claude-haiku-5-5:safe:low (1951 ms):
```
Move code-mode object text test from core suite to runtime
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

claude:haiku:safe (2680 ms):
```
Stop using PowerShell AST parser in production code

Replace the PowerShell AST parser with the Tree-sitter lowerer for
command classification. The AST parser is now only available for tests
as an oracle. This simplifies the codebase by removing the dual-parser
approach and ensures consistent command safety analysis.
```

claude:claude-haiku-5-5:safe:low (2040 ms):
```
Stop using the PowerShell subprocess parser in production

Command classification now lowers PowerShell scripts in-process via the
Tree-sitter lowerer. The subprocess-based AST parser is kept only as a
test oracle, and the Windows safe-command path no longer depends on it.
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

claude:haiku:safe (2414 ms):
```
Preserve numeric and string bounds in tool parameter schemas

Reserved tool declarations need to maintain parameter constraints like
minimum, maximum, and maxLength when exposed to the model. This ensures
the model respects the constraints for tools like history.list_items and
notes.search_contents.
```

claude:claude-haiku-5-5:safe:low (1678 ms):
```
Preserve numeric and string bounds in reserved tool schemas
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

claude:haiku:safe (3532 ms):
```
Treat RFC 6749 invalid_grant as permanent token failure

When the OAuth provider returns a 400 Bad Request with error code
invalid_grant, treat it as a permanent failure. This error indicates
the refresh token is no longer usable (expired, revoked, or reused) but
without the legacy subtype information, so we must fail closed rather
than retry.

Add tests to verify the distinction: invalid_grant on 400 fails
permanently, while other 400 errors like invalid_request are treated
as transient and retried.
```

claude:claude-haiku-5-5:safe:low (1790 ms):
```
Treat invalid_grant 400 refresh failures as permanent and stop caching other bad-request failures
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

claude:haiku:safe (2517 ms):
```
Enhance Guardian denial reporting in strict auto-review

Add rationale messages to Guardian-initiated denials so the agent
understands why an action was rejected and what alternatives are
available. Update strict auto-review to accept Decline and Cancel
responses from Guardian alongside Allow responses, and improve the
decline message to emphasize user approval requirements.
```

claude:claude-haiku-5-5:safe:low (2207 ms):
```
Preserve guardian denials and cancellations for MCP elicitations

Strict auto-review previously dropped Guardian denials and aborts, so the
MCP server only saw a generic decline. Keep those decisions as explicit
elicitation responses so the server can tell the user why the action was
rejected, and update the decline message to match.
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

claude:haiku:safe (2625 ms):
```
Allow provider auth command to recover from initial resolution failures

When a provider auth command fails initially, the unauthorized recovery
flow should retry the command to obtain credentials. Previously, the
recovery would only work if credentials were already cached. Now it
retries command resolution even when the initial attempt fails, allowing
recovery from transient command failures.

Also refined the condition for refreshable external auth to properly
handle cases where no auth is currently cached.
```

claude:claude-haiku-5-5:safe:low (1817 ms):
```
Let external auth unauthorized recovery retry after initial failure
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

claude:haiku:safe (2646 ms):
```
Add deterministic IDs to Responses Lite prefix items

Generate stable IDs for automatically-injected tools and base instructions
in Responses Lite requests. IDs are derived from thread ID and item payload
so they persist across retries and resumed sessions, enabling proper change
tracking and incremental request building.
```

claude:claude-haiku-5-5:safe:low (2303 ms):
```
Make Responses Lite prompt prefix items stable across requests

Assign deterministic IDs to the tools and base-instructions items that
Responses Lite prepends to every request. The IDs are derived from the
thread ID and the payload, so retries and resumed sessions keep the same
identity while changed tools or instructions get new ones.
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

claude:haiku:safe (2146 ms):
```
Extract relay test utilities into a shared support crate

Move WebSocket relay test helpers from exec-server integration tests to a dedicated test support library. This allows other test suites to reuse relay testing infrastructure without duplication.
```

claude:claude-haiku-5-5:safe:low (1681 ms):
```
Move exec-server relay test helpers into a shared support crate
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

claude:haiku:safe (2763 ms):
```
Derive sandbox configuration from turn environment

Reconcile backend selection with TurnEnvironment::sandbox_context so
that turn-wide sandbox settings are consistently sourced from the
environment rather than from TurnContext or Config separately. This
ensures that Windows sandbox level overrides and other environment-scoped
settings are properly retained across operations and session resumption.

Remove TODO comments that are now resolved by this refactoring.
```

claude:claude-haiku-5-5:safe:low (2288 ms):
```
Use windows sandbox level and related settings from the turn environment

Sandbox decisions (backend selection, legacy landlock, Windows sandbox level, private desktop) now read from the selected turn environment's config instead of the turn context. Restored thread settings also keep the Windows sandbox override, and the MCP runtime refreshes when that level changes. Resolves the TODOs that tracked these gaps.
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

claude:haiku:safe (2477 ms):
```
Track built-in collab agent tool calls in analytics

Add tracking for successful and failed spawn_agent tool calls in the
multi-agent v2 system. Emit ItemStarted and ItemCompleted notifications
with execution duration, allowing analytics to measure performance and
count unique subagent invocations by ID to avoid double-counting.
```

claude:claude-haiku-5-5:safe:low (2005 ms):
```
Track collab spawn tool calls in analytics

The spawn_agent handler now reports each call as a collab agent tool
call, including failed spawns. Analytics derives the subagent tool
count from unique item ids, so a call reported on both start and
completion is counted once.
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

claude:haiku:safe (2683 ms):
```
Add scrollback strategy abstraction for reliable history insertion

Introduce `ScrollbackStrategy` to handle terminal-specific scrollback behaviors.
Windows Terminal and Zellij with terminal-wrapped history now use full-screen
insertion to preserve terminal-native scrollback, avoiding data loss from
partial scroll regions. Standard terminals continue using scroll region commands.
```

claude:claude-haiku-5-5:safe:low (2194 ms):
```
TUI: Route history insertion through scrollback strategy

Replace the Zellij-only raw path with a ScrollbackStrategy that picks how history is inserted and how the viewport grows. Windows Terminal now uses full-screen scrolling so rows move into terminal scrollback instead of being dropped by partial DEC scroll regions.
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

claude:haiku:safe (2828 ms):
```
Propagate temporary directories from executor environments to sandbox contexts

Add caching and propagation of temporary directories reported by remote
executors through the environment selection and turn context layers into
sandbox policy contexts. This enables sandbox policies to properly resolve
`:tmpdir` entries by providing executor-local temporary directory paths.

For local environments, derive temporary directories from environment
variables (TEMP/TMP on Windows, TMPDIR/TEMPDIR/TMP on Unix) instead of
relying solely on `std::env::temp_dir()`.
```

claude:claude-haiku-5-5:safe:low (2217 ms):
```
Carry executor temporary directories through filesystem sandbox contexts

Cache the executor's temporary directories on each turn environment and
pass them to the file system sandbox context, so `:tmpdir` policy entries
resolve against the executor that owns them. Expose a borrowed policy
context so callers can interpret the policy without re-deriving paths.
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

claude:haiku:safe (2490 ms):
```
Expand OAuth discovery tests with redirect handling and isolation verification

Refactor the OAuth discovery test suite to improve coverage of metadata
redirect behavior. Add helpers to reduce duplication and introduce tests
for same-origin redirects, cross-origin redirect rejection, redirect
cycles, and resource header isolation across different delivery modes.
```

claude:claude-haiku-5-5:safe:low (2248 ms):
```
Add redirect and local-client coverage to MCP OAuth discovery tests

The discovery tests previously ran against a second, executor-backed client that is no longer used. Switch them to the local environment HTTP client and cover same-origin metadata redirects, cross-origin redirect rejection, and redirect cycles.
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

claude:haiku:safe (2186 ms):
```
Track selected plugins in extension data and attribute executor skills

Project selected plugins across thread and turn extension data to attribute executor skills with their plugin identifiers and scopes. This enables analytics to track skill invocations by their originating plugins.
```

claude:claude-haiku-5-5:safe:low (2213 ms):
```
Scope executor skill attribution to selected plugins

Skills from executor-selected plugins now carry their plugin id and
user scope into skill invocation analytics. The plugin identity comes
from the MCP selected-plugin contributions, filtered to roots that are
ready for the turn, so only plugins that actually loaded are attributed.
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

claude:haiku:safe (2788 ms):
```
Add approval review methods to extension API and rename fast path

The extension approval review trait now supports both fast decisions from existing
evidence and full structured reviews of host-owned approval actions. The fast path
method is renamed from `contribute` to `fast_decision` for clarity, and a new
`full_review` method enables extensions to perform comprehensive assessments with
structured input context including action details, conversation history, and retry
information.
```

claude:claude-haiku-5-5:safe:low (1814 ms):
```
Rename approval review contributor hooks into fast decision and full review paths
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

claude:haiku:safe (2367 ms):
```
Allow acting model to customize Guardian rejection and timeout messages

Guardian review decisions now use rejection and timeout instructions from
the acting model's catalog configuration instead of hardcoded messages.
This allows different models to provide model-specific guidance when
rejecting approvals or timing out reviews.
```

claude:claude-haiku-5-5:safe:low (1861 ms):
```
Make Guardian rejection and timeout messages configurable per model
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

claude:haiku:safe (3054 ms):
```
Add skip-host-discovery option for executor-only skill providers

When the `SkipHostSkillDiscovery` feature is enabled and no registered skill
contributor requires host skills, skip expensive host skill discovery during
session init and turn context setup. Extensions declaring they don't need host
skills can opt out via `requires_host_skill_discovery()`.

Add `ExecutorSkillProvider` implementation that opts out of host discovery.
Update `SkillsExtension` to only require discovery when a host provider is
installed.
```

claude:claude-haiku-5-5:safe:low (2371 ms):
```
Add skip_host_skill_discovery feature to bypass host skill scan

Adds a SkipHostSkillDiscovery feature flag. When enabled and no
registered skill contributor requires host skills, session init and
turn context building skip the host skill snapshot.
```

## codex-24 (diff 36705 chars, git 99 ms)

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

claude:haiku:safe (2467 ms):
```
Add Guardian reviewer configuration for sync approval reviews

Implements reviewer preparation logic to set up isolated internal sessions for Guardian approval reviews. Configures the reviewer with policy templates, read-only permissions, disabled risky features, and model-specific reasoning levels while preserving the parent session's environment and persistence settings.
```

claude:claude-haiku-5-5:safe:low (2112 ms):
```
Add sync reviewer options for guardian reviewer threads

Prepare isolated StartThreadOptions for guardian review sessions:
read-only permissions, disabled extension features, and the
reviewer model selected from the parent model's auto-review override.
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

claude:haiku:safe (4587 ms):
```
Add terminal hyperlink support to web link labels in markdown rendering

Web links now render with styled labels that preserve their hyperlink targets even when displayed without visible destinations. Terminal detection determines whether to show destinations—supporting terminals like Ghostty, Kitty, and WezTerm render label-only links, while unknown or multiplexed terminals keep destinations visible as fallback.

A new `HyperlinkParagraph` widget manages text and link annotation alignment during scrolling and wrapping. Link labels inherit link styling (cyan, underlined) while preserving inline formatting like bold and italic. Empty labels still show destinations to ensure usable URLs.
```

claude:claude-haiku-5-5:safe:low (2477 ms):
```
TUI: Render web link labels with link style and hide URL on capable terminals

Markdown links to web destinations now show only the styled label on
terminals known to support OSC 8 hyperlinks, keeping the target
attached. Other terminals, multiplexers, and unknown setups still show
the destination so the URL is never lost. Hyperlink-aware paragraph
rendering is shared across transcript, history, and pager views so
clipped links keep their targets.
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

claude:haiku:safe (3584 ms):
```
Add Guardian review evidence for user input answers

Record bounded user answers from `request_user_input` tool calls before
post-tool hooks can replace or reject their output. Include these trusted
fragments in both sync and async Guardian reviews so classifiers see
genuine user input even when tool output is modified.

Track user input response count in authorization version to invalidate
stale reviews when the user provides new answers. Discard synchronous
Guardian decisions after receiving any user answer, since those decisions
were made without this new information.
```

claude:claude-haiku-5-5:safe:low (2383 ms):
```
Trust user answers to Guardian reviews and invalidate stale reviews

Guardian reviewers now record genuine answers to request_user_input
and include them as trusted context. A user answer changes the
authorization state, so earlier synchronous review decisions are
discarded and the classifier and reviewer see the answer. Answers are
recorded before post-tool hooks run, so hooks cannot hide them.
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

claude:haiku:safe (3237 ms):
```
Add automatic conversation recaps when returning to unfocused tasks

Generate concise summaries of recent conversation history when users return
to a task after focus loss. Recap eligibility requires at least three
completed turns, a minimum delay after focus loss or task completion, and
sufficient turns since the last recap. Thread focus state is tracked across
focus events, thread switches, and session lifecycle transitions. Recap
generation and history rendering are implemented but not yet integrated
with the LLM backend.
```

claude:claude-haiku-5-5:safe:low (2360 ms):
```
Add terminal focus events and conversation recap in TUI
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

claude:haiku:safe (5310 ms):
```
Expose managed developer instructions in configuration requirements

Add `additional_developer_instructions` to ConfigRequirements to allow
administrators to supply managed policy text that renders separately from
ordinary developer instructions. These requirements-owned instructions:

- Are validated during config load to ensure they fit within a 10,000
  token context budget, preventing silent truncation
- Render in each turn's initial context with change notifications when
  the policy updates or is removed
- Persist through thread compaction and multi-agent forks, replacing
  stale policies from parent threads
- Remain separate from user-configured developer instructions

This enables organizations to enforce updated guidance on existing
conversations without conflicting with custom user instructions.
```

claude:claude-haiku-5-5:safe:low (2475 ms):
```
Add managed developer instructions from requirements

Introduce `additional_developer_instructions` in requirements.toml. The
value is exposed through the config requirements API and injected as a
separate developer message, so managed policy is not overwritten by
ordinary client developer instructions. Oversized policy is rejected at
config load instead of being truncated. Forked and resumed threads keep
exactly one current copy of the managed block.
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

claude:haiku:safe (4343 ms):
```
Sanitize Git URLs to prevent credential exposure in metadata and storage

This change introduces a new `SanitizedGitUrl` type that automatically removes authentication credentials (usernames, passwords, and tokens) from Git remote URLs before they are stored, transmitted, or logged.

The sanitization is applied at the boundaries where Git URLs enter the system:
- When collecting Git information from repositories
- When accepting Git URLs via API requests
- When deserializing Git metadata from storage

This ensures credentials never reach API responses, database records, rollout files, analytics payloads, or any other system output.
```

claude:claude-haiku-5-5:safe:low (2728 ms):
```
Sanitize git remote URLs before they leave the process

Client-supplied and on-disk remote URLs can carry credentials, which
then reached API responses, SQLite, rollout files, analytics, and
model request metadata. Introduce SanitizedGitUrl in codex-protocol
and use it for every place a remote URL is stored or emitted.
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

claude:haiku:safe (4079 ms):
```
Add step activation and model switching during turns with legacy compatibility

This change introduces the ability to update model and reasoning settings for a
running turn while ensuring compatibility with existing approval and Guardian
systems that still read from the original turn context.

New TurnSettings operation allows sparse updates to the current task's settings
snapshot without affecting frozen initial settings or child sessions. Updates are
validated against temporary legacy safety restrictions until consumers migrate to
captured step settings.

The step_model_switching feature flag gates this functionality. Configuration
schema updated to reflect the new feature.
```

claude:claude-haiku-5-5:safe:low (1899 ms):
```
Add turn-level settings updates for running steps
```

## intellij-community-1 (diff 387 chars, git 3452 ms)

Actual:
```
misc codeowners: give IJPL the community productLayout package

The product model under community/platform/build-scripts/src/org/jetbrains/intellij/build/productLayout belongs to IJPL.
The OWNERSHIP syntax has no negation pattern. A later pattern rule in the parent file overrides the IJ Build Scripts Maintainers default for that package.
```

claude:haiku:safe (2079 ms):
```
[platform] Update OWNERSHIP codeowners mapping for build scripts

Add IJPL as owner of the productLayout package under the build scripts directory.
```

claude:claude-haiku-5-5:safe:low (2643 ms):
```
Add OWNERSHIP entry for productLayout build scripts
```

## intellij-community-2 (diff 938 chars, git 647 ms)

Actual:
```
[jps] rename builder to mitigate TW-104697
```

claude:haiku:safe (1749 ms):
```
[jps build] capitalize "Project Dependencies Resolver" in message
```

claude:claude-haiku-5-5:safe:low (2043 ms):
```
Fix capitalization of dependencies resolver builder name
```

## intellij-community-3 (diff 1021 chars, git 1959 ms)

Actual:
```
IDEA-392279 [java-psi] Follow-up: remove redundant instantiateWith call
```

claude:haiku:safe (1629 ms):
```
cleanup: simplify nullability comparison in inference incorporation
```

claude:claude-haiku-5-5:safe:low (1984 ms, the IDE drops IDEA-392095):
```
IDEA-392095 [java-psi] Simplify nullability handling in inference bound incorporation
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

claude:haiku:safe (2228 ms):
```
tests [editor]: improve split window navigation assertions

The test now explicitly captures the secondary window returned by
createVerticalSplitter and verifies the window navigation order using
getPrevWindow and getNextWindow methods. This provides more precise
assertions about window relationships after splitting.
```

claude:claude-haiku-5-5:safe:low (2507 ms):
```
tests [editor]: check window order after a vertical split
```

## intellij-community-5 (diff 1529 chars, git 955 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, adjust benchmark, part10
```

claude:haiku:safe (2181 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust performance test parameters, part10

Reduce random action range from 100 to 89 to exclude slow renameVariable.
Increase single user batches from 20 to 1000 for more comprehensive
testing. Add TODO comment noting renameVariable performance issue.
```

claude:claude-haiku-5-5:safe:low (3410 ms):
```
[editor] Skip renameVariable in DocBranch perf test

Rename is too slow for the single-user benchmark, so exclude it from the random action mix. Also raise the single-user batch count from 20 to 1000 to get more samples.
```

## intellij-community-6 (diff 1688 chars, git 593 ms)

Actual:
```
AND-150 [android] Remove dead Compose compiler keys from K2ComposeCompilerConfigurationProvider
```

claude:haiku:safe (1532 ms):
```
Remove unused Compose compiler configuration options
```

claude:claude-haiku-5-5:safe:low (1966 ms):
```
Remove redundant Compose compiler options from IDE config

The IntrinsicRemember feature flag, its optimization key, and
STRONG_SKIPPING are removed so the plugin falls back to the compiler
defaults. Those defaults already match what the IDE needs.
```

## intellij-community-7 (diff 1952 chars, git 478 ms)

Actual:
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

claude:haiku:safe (1651 ms, the IDE drops MRI-5544):
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

claude:claude-haiku-5-5:safe:low (1703 ms):
```
Switch intellij.java.ide.customization.backend.tests to Bazel
```

## intellij-community-8 (diff 2104 chars, git 9341 ms)

Actual:
```
KTIJ-39860 [kotlin] Fix impossible is check null quick-fix
```

claude:haiku:safe (1984 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix operator logic in ReplaceIsCheckWithNullCheckFix

The operator selection logic was inverted. When the is expression is
negated, we should use "!=" instead of "==", and vice versa.
```

claude:claude-haiku-5-5:safe:low (2122 ms):
```
Fix inverted operator in ReplaceIsCheckWithNullCheck quickfix

The fix produced the wrong null check: a negated "is" check
was replaced with "== null" and a positive one with "!= null".
Swap the operators so "!is" becomes "!= null" and "is" becomes
"== null", and update the affected test expectations.
```

## intellij-community-9 (diff 2367 chars, git 875 ms)

Actual:
```
[git] Initialize recentCommitsProvider in the background (IJPL-248720)
```

claude:haiku:safe (1965 ms):
```
[git]: Defer GitRecentCommitsProvider initialization to avoid blocking

Wrap the provider initialization in an async block to defer its creation
until it's actually needed, preventing potential blocking during service
instantiation.
```

claude:claude-haiku-5-5:safe:low (2158 ms):
```
Git: make recent commits provider creation asynchronous

Create GitRecentCommitsProvider in a coroutine on Dispatchers.Default
and await it where amend targets are requested, so the service no
longer constructs it eagerly during service initialization.
```

## intellij-community-10 (diff 2642 chars, git 116 ms)

Actual:
```
cleanup [python]: Clean up formatting and imports in PyTypeChecker
```

claude:haiku:safe (1667 ms, the IDE drops PY-92880):
```
PY-92880 clean up unused imports and reformat function signature
```

claude:claude-haiku-5-5:safe:low (1868 ms):
```
Refactor PyTypeChecker: drop unused imports, import expandTupleTypeParameters, reformat subclassElementType signature
```

## intellij-community-11 (diff 3296 chars, git 8659 ms)

Actual:
```
[skeleton] IJPL-257214 use the fallback renderer instead of the canvas in the Windows frontend
```

claude:haiku:safe (2399 ms):
```
refactor platform: rename EditorSkeletonWaylandRenderer to EditorSkeletonFallbackRenderer

Generalize the renderer to handle both Wayland and Windows JetBrains Client
frontends, which both need EDT-confined rendering to avoid platform-specific
issues. On Wayland, Swing submits painted frames to the compositor. On Windows
JetBrains Client, avoid using Canvas buffer strategy due to JBR-10643.
```

claude:claude-haiku-5-5:safe:low (3038 ms):
```
[skeleton] use the Swing fallback renderer on Windows client

Rename EditorSkeletonWaylandRenderer to EditorSkeletonFallbackRenderer
and use it on Windows JetBrains Client as well as Wayland. The Canvas
renderer hits JBR-10643 on that frontend, and the fallback avoids it
by painting with Swing repaint() rather than a heavyweight Canvas.
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

claude:haiku:safe (1738 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add test for Python tool window startup flag on split frontend
```

claude:claude-haiku-5-5:safe:low (1977 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a startup-availability test for Python tool windows

The split frontend left Python tool windows hidden at startup. Pin the registry default for the startup-availability flag with a lambda test that runs only on the split frontend.
```

## intellij-community-13 (diff 4115 chars, git 851 ms)

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

claude:haiku:safe (2856 ms):
```
refactor [platform]: Set EDT priority via native SetThreadPriority

The native priority is raised directly instead of via Thread.setPriority
to avoid inheriting the priority to lazily started kotlinx.coroutines
workers, which caused them to preempt their producer threads and spin
on CPUs for seconds. A new setCurrentPriority method wraps the native
SetThreadPriority API call with proper error handling.
```

claude:claude-haiku-5-5:safe:low (3240 ms):
```
refactor [platform]: Raise EDT priority through the native API

Thread.setPriority() is inherited by threads the EDT creates. That
gave the lazily started kotlinx.coroutines workers the highest
priority, above the threads that feed their queue. Their spin-wait on
a preempted producer then held every CPU for seconds. A native
priority is not inherited, so set THREAD_PRIORITY_HIGHEST directly
with SetThreadPriority and log an error if the call fails.
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

claude:haiku:safe (2642 ms):
```
[navigation] Handle cancellation in navigate() and document behavior

When a navigation is canceled due to a newer request or user action,
ensure that CancellationException is properly handled and the caller
receives a false return value instead. Document the cancellation
semantics in the NavigationService interface to clarify that normal
coroutine cancellation exceptions are only thrown when the caller's
context is canceled, while external cancellations return false.
```

claude:claude-haiku-5-5:safe:low (2117 ms):
```
[navigation] Make navigation cancellation return false instead of throwing

Canceling a navigation because a newer one superseded it, or because the
user canceled the progress, now returns false from the navigation
service. CancellationException is only propagated when the caller's own
coroutine is canceled, so callers no longer have to handle an exception
for ordinary cancellation.
```

## intellij-community-15 (diff 4877 chars, git 117 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, JvmStatic, part45
```

claude:haiku:safe (2209 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, Java interop, part45

Add @JvmStatic annotations to companion object factory methods to improve Java interoperability and ensure consistent static method access from Java code.
```

claude:claude-haiku-5-5:safe:low (1764 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, add @JvmStatic to factories
```

## intellij-community-16 (diff 5268 chars, git 4500 ms)

Actual:
```
fix [VCS]: Git log: second pressing of "delete branch" button logs an error IJPL-163588

Also fixes IJPL-257749
```

claude:haiku:safe (2124 ms):
```
[git] Handle repeated deletion of the same branch

Filter out repositories where the branch is already deleted before
attempting deletion. Serialize branch deletion requests to ensure each
deletion sees the result of the previous one and can properly detect
stale deletion requests.
```

claude:claude-haiku-5-5:safe:low (1885 ms):
```
[git] Prevent repeated branch deletion from failing

Deleting the same branch twice in quick succession could run the
delete operation against a branch that no longer exists. Skip
repositories where the branch is already gone, and serialize deletion
requests so each one sees the result of the previous one.
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

claude:haiku:safe (2201 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh

When a source refresh replaces a visible selected row, the row must
remain visible below the sticky header. However, if the selected row is
replaced while offscreen, the viewport should not scroll to reveal it.
```

claude:claude-haiku-5-5:safe:low (1900 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh

Keep the selected plugin row visible below the sticky header when a
source refresh replaces it, but do not scroll to a selected row that
was already outside the viewport.
```

## intellij-community-18 (diff 6986 chars, git 7382 ms)

Actual:
```
[java] IDEA-369985 SlowOp in GenerateToStringWorker.exitsMethodDialog
```

claude:haiku:safe (2124 ms):
```
[java] refactor GenerateToStringActionHandlerImpl to use background thread

Move the expensive method lookup to a background read action and defer
the conflict resolution dialog to the UI thread. This prevents UI
blocking during method signature analysis while maintaining the same
user-facing behavior.
```

claude:claude-haiku-5-5:safe:low (2533 ms):
```
Move GenerateToString conflict check off EDT and into background read action

The existing-method lookup ran on the EDT inside the write command. It is
now done in a non-blocking read action, and only the user prompt stays on
the EDT. The write action runs in a non-cancellable progress, so the
generation is wrapped in a command rather than a bare write command.
```

## intellij-community-19 (diff 8020 chars, git 7921 ms)

Actual:
```
[Java. Tests] IDEA-394694 Fix project test leak in `com.intellij.java.codeInspection.GlobalInspectionContextTest`
```

claude:haiku:safe (2478 ms):
```
[tests] cleanup HighlightDisplayKey registration in configureInspections

Register unregistered tool keys during configuration and ensure they
are cleaned up on disposal. This prevents keys from leaking between
test cases. Also preserve any keys that existed before configuration or
were replaced during cleanup.
```

claude:claude-haiku-5-5:safe:low (2328 ms):
```
Make configureInspections unregister the HighlightDisplayKeys it creates

Keys registered by configureInspections are now removed when the parent
disposable is disposed, so they no longer leak into later tests. Keys
that were already registered beforehand, or that were replaced during the
test, are left alone. Keys are also cleaned up when configuration fails
partway through.
```

## intellij-community-20 (diff 9108 chars, git 397 ms)

Actual:
```
KTIJ-40403 [kotlin] Offer remove question quick fix before callable references
```

claude:haiku:safe (2282 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Handle whitespace and comments in callable reference fix

Improve the quick fix for removing question marks in callable reference
left-hand side to correctly handle cases with whitespace or comments
between the question mark and the callable reference expression.
```

claude:claude-haiku-5-5:safe:low (1791 ms):
```
Fix quick fix for '?' before callable reference with comment or space
```

## intellij-community-21 (diff 10486 chars, git 243 ms)

Actual:
```
[kotlin] inline: inline type parameters

- simplify type parameters processing

KTIJ-40432
```

claude:haiku:safe (3177 ms):
```
[kotlin] inline: simplify CodeInliner by removing redundant permission annotations and lambdas

Remove unnecessary KaAllowAnalysisOnEdt and KaAllowAnalysisFromWriteAction
annotations and their wrapping lambdas. Simplify processTypeParameterUsages
by converting it from a generic function with multiple lambdas to a context
function that directly accesses the KaSession. Remove the unused
getContextParameterExplicitArgument helper method and inline its logic.
Also remove redundant analyze wrapping in declaration name collision handling.
```

claude:claude-haiku-5-5:safe:low (2224 ms):
```
[kotlin] inline: drop KaAllowAnalysis* workarounds in CodeInliner

Analysis now runs without the EDT and write-action permission
opt-ins, so the wrappers and @OptIn annotations are removed.
Type parameter processing is moved into a single analyze session,
and the context parameter lookup is inlined.
```

## intellij-community-22 (diff 10986 chars, git 579 ms)

Actual:
```
[markdown] IJPL-257188 Support the Sticky Lines feature in Markdown


Merge-request: IJ-MR-227314
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

claude:haiku:safe (2586 ms):
```
[markdown] Add sticky line support for Markdown headings

Implement file breadcrumbs collector for Markdown to compute sticky line
information based on section ranges derived from heading structure. Each
heading is now pinned until the last line of its section, matching the
breadcrumbs hierarchy behavior. Also scale heading renderer when painting
in sticky line mode to fit the single-line height constraint.
```

claude:claude-haiku-5-5:safe:low (3507 ms):
```
[markdown] Show headings as sticky lines in the editor

Pin each Markdown heading until the end of its section, using a file
breadcrumbs collector. Scale heading previews in the live preview to
fit a single sticky line.
```

## intellij-community-23 (diff 12992 chars, git 487 ms)

Actual:
```
[markdown] IJPL-257766 Support Setext headers in Markdown live preview


Merge-request: IJ-MR-227110
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

claude:haiku:safe (2351 ms):
```
[markdown] Support Setext headings in live preview

Extend heading support to include Setext-style headings (underlined with
`===` or `---`). Parse Setext heading content using the appropriate token
type, treat Setext underlines as horizontal rules in the specs, and update
related logic to work with both ATX and Setext headers.
```

claude:claude-haiku-5-5:safe:low (1890 ms):
```
[markdown] Render Setext headings as live preview headings
```

## intellij-community-24 (diff 14987 chars, git 8784 ms)

Actual:
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude:haiku:safe (1810 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude:claude-haiku-5-5:safe:low (2230 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find tests to com.intellij.java.find

The tests are moved from com.intellij.find packages to com.intellij.java.find
packages, following the same restructuring as the other test moves. Imports
for classes still in the original packages are added explicitly, and the
copyright years are updated to 2026.
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

claude:haiku:safe (3537 ms):
```
refactor: add hermetic process table to the runner

Add a `ProcessTable` trait so a runner can probe a fake process table
instead of the host. A suite sets it with `with_process_table`, and the
runner's process probes answer from the table instead of running `ps` or
querying the process object.

Implement `FakeProcesses` in `avl-host-testkit` for hermetic testing: a
suite declares processes and gets back their fake pids. Update the
observation commands' fixture to use it, so workers in tests show as
running even on a loaded host.
```

claude:claude-haiku-5-5:safe:low (2074 ms):
```
refactoring air: make the probe tests use a fake process table

Hermetic suites no longer depend on host processes. A runner can be given
a ProcessTable that answers the ps probe in place of the host, and the
observation fixture declares its run-process stand-ins there.
```

## intellij-community-26 (diff 22415 chars, git 9056 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, rename, part3
```

claude:haiku:safe (2247 ms):
```
[editor] Rename DocTextBranch to DocBranch

Simplify the interface name by removing the redundant "Text" qualifier, as the
text content is already implicit in a document branch concept.
```

claude:claude-haiku-5-5:safe:low (1807 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

## intellij-community-27 (diff 27722 chars, git 111 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, DAG pretty printer, part19
```

claude:haiku:safe (1904 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram, part18
```

claude:claude-haiku-5-5:safe:low (1746 ms):
```
[editor] naive eg-walker, text diagram for EventGraph toString, part18
```

## intellij-community-28 (diff 41351 chars, git 532 ms)

Actual:
```
IJPL-252267 Add UI for editing default excludes
```

claude:haiku:safe (3763 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default analysis ignore lines editable in settings

The default exclusions for `.analysisignore` files can now be customized through the File Types settings panel. Added a new "Default Exclusions" tab that allows users to edit the patterns used when a project has no `.analysisignore` file.

The implementation separates built-in defaults from user customizations via `AnalysisIgnoreDefaultsSettings`, which persists edits and notifies services of changes. The default entity patterns update automatically when the user modifies the settings. Unsupported patterns are filtered out, and the settings store no data while users keep the built-in lines, allowing future product versions to update them.
```

claude:claude-haiku-5-5:safe:low (3465 ms):
```
lang: Let users edit default .analysisignore exclusions

Default exclusions were fixed in code. Add a File Types settings tab
that lists them, so users can change them. Changes are stored in the
application settings and synced to existing default entities. Built-in
lines are not stored, so a later product version can still change them.
```

## intellij-community-29 (diff 59619 chars, git 11172 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, run-length encode, part2
```

claude:haiku:safe (3974 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, part2

Implement run-length encoding for events and improve performance. One Event now
covers multiple single-character operations, reducing storage from n slots to O(log n)
runs in typical cases. The replay still walks per-unit for correctness, but run
boundaries are preserved for future optimization.

Refactor EventStore to index runs by agent and seq for O(1) id lookups. Split
mergeFrom to handle partly-known runs by appending only their unknown suffix.
Update tests to verify encoding invariants and add fuzz tests for run boundaries.
```

claude:claude-haiku-5-5:safe:low (3230 ms):
```
[editor] run-length encode the Eg-walker event graph

Store one event per run of single-character operations instead of one
per character. A large document or a multi-character edit now costs one
graph entry, and merges split runs only where the two graphs disagree.
The replay still works per character.
```

## intellij-community-30 (diff 99790 chars, truncated, git 142 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, move offset, part51
```

claude:haiku:safe (2094 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

claude:claude-haiku-5-5:safe:low (2421 ms):
```
[editor] Add text move ops to DocumentOp and the eg-walker replay

Text moves are recorded as an insert and a delete that carry a move
offset, so the op stream and the merge can tell a move from two plain
edits. A move that does not name its moved text, or whose moved text
overlaps the change, records as plain ops.
```
