# bench-agents-codex

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | cost $ |
|---|---|---|---|---|---|---|---|---|
| codex:gpt-5.6-luna:lean:low | 60/60 | 2439 | 3139 | 6815 | 0 | 16 | 0 | - |
| codex-acp:gpt-5.6-luna[low] | 60/60 | 2713 | 4885 | 21161 | 0 | 0 | 0 | - |

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

codex:gpt-5.6-luna:lean:low (2629 ms):
```
Preserve short single-line composer text during wrapping
```

codex-acp:gpt-5.6-luna[low] (4295 ms):
```
Preserve short composer text without wrapping
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

codex:gpt-5.6-luna:lean:low (2325 ms):
```
Remove timeout fields from cyber command policy tests
```

codex-acp:gpt-5.6-luna[low] (2282 ms):
```
Remove timeout parameters from cyber exec policy tests
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

codex:gpt-5.6-luna:lean:low (2388 ms):
```
Isolate IPC namespaces in Linux sandboxes
```

codex-acp:gpt-5.6-luna[low] (3420 ms):
```
Isolate IPC namespaces in Linux sandboxes
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

codex:gpt-5.6-luna:lean:low (2676 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

codex-acp:gpt-5.6-luna[low] (3439 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
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

codex:gpt-5.6-luna:lean:low (2686 ms):
```
Increase MCP model-visible tool name limit to 128 bytes

Update normalization tests to cover the new Responses API name boundary.
```

codex-acp:gpt-5.6-luna[low] (2696 ms):
```
Increase MCP tool name limit to 128 characters

Update tool name normalization and tests for the Responses API limit.
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

codex:gpt-5.6-luna:lean:low (2593 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Add coverage to verify Guardian sessions preserve proxy settings while
regular sessions continue to reconcile them.
```

codex-acp:gpt-5.6-luna[low] (2474 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Add coverage for Guardian session spawning behavior
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

codex:gpt-5.6-luna:lean:low (2517 ms):
```
Move text helper serialization test to runtime unit tests
```

codex-acp:gpt-5.6-luna[low] (2614 ms):
```
Test code mode text serialization in runtime unit tests
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

codex:gpt-5.6-luna:lean:low (2667 ms):
```
Use Tree-sitter PowerShell lowering for command safety checks
```

codex-acp:gpt-5.6-luna[low] (2757 ms):
```
Use Tree-sitter PowerShell parsing consistently in production
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

codex:gpt-5.6-luna:lean:low (2580 ms):
```
Preserve numeric and string bounds in tool schemas

Add support for serializing schema minimum, maximum, and maxLength constraints, with tests covering reserved history and notes tools.
```

codex-acp:gpt-5.6-luna[low] (3882 ms):
```
Preserve numeric and string bounds in tool schemas
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

codex:gpt-5.6-luna:lean:low (2792 ms):
```
Handle standard invalid_grant refresh failures

Add coverage for terminal standard OAuth errors while retaining retries for other bad requests.
```

codex-acp:gpt-5.6-luna[low] (2700 ms):
```
Treat standard invalid_grant failures as permanent
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

codex:gpt-5.6-luna:lean:low (2331 ms):
```
Preserve Guardian denial and cancellation responses
```

codex-acp:gpt-5.6-luna[low] (3002 ms):
```
Preserve guardian elicitation denials and cancellations
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

codex:gpt-5.6-luna:lean:low (2273 ms):
```
Retry external auth resolution after initial failure
```

codex-acp:gpt-5.6-luna[low] (2453 ms):
```
Retry external auth resolution after initial failure
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

codex:gpt-5.6-luna:lean:low (2389 ms):
```
Preserve Responses Lite prefix item IDs across requests
```

codex-acp:gpt-5.6-luna[low] (3977 ms):
```
Preserve Responses Lite prefix IDs across requests
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

codex:gpt-5.6-luna:lean:low (2463 ms):
```
Extract relay test helpers into shared support crate
```

codex-acp:gpt-5.6-luna[low] (2410 ms):
```
Extract relay test helpers into shared support crate
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

codex:gpt-5.6-luna:lean:low (2359 ms):
```
Use turn environment settings for sandbox execution and resume
```

codex-acp:gpt-5.6-luna[low] (4638 ms):
```
Use turn environment settings for sandbox execution
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

codex:gpt-5.6-luna:lean:low (2319 ms):
```
Track multi-agent tool call analytics and durations
```

codex-acp:gpt-5.6-luna[low] (2753 ms):
```
Track multi-agent tool call analytics and timing
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

codex:gpt-5.6-luna:lean:low (2503 ms):
```
Preserve terminal scrollback in Windows Terminal and Zellij
```

codex-acp:gpt-5.6-luna[low] (2545 ms):
```
Preserve scrollback in Windows Terminal full-screen updates
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

codex:gpt-5.6-luna:lean:low (2441 ms):
```
Cache executor temporary directories in sandbox contexts
```

codex-acp:gpt-5.6-luna[low] (2328 ms):
```
Carry executor temp directories into sandbox contexts
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

codex:gpt-5.6-luna:lean:low (2730 ms):
```
Expand OAuth discovery redirect coverage and use local HTTP clients in tests

Add tests for same-origin redirects, cross-origin rejection, and redirect
cycle limits while preserving issuer validation and header isolation.
```

codex-acp:gpt-5.6-luna[low] (2713 ms):
```
Expand OAuth discovery redirect coverage
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

codex:gpt-5.6-luna:lean:low (2269 ms):
```
Attribute executor skills to selected plugins in analytics
```

codex-acp:gpt-5.6-luna[low] (3864 ms):
```
Attribute executor skills to selected MCP plugins
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

codex:gpt-5.6-luna:lean:low (2235 ms):
```
Support fast and full approval review contributors
```

codex-acp:gpt-5.6-luna[low] (3371 ms):
```
Add structured approval reviews for extensions
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

codex:gpt-5.6-luna:lean:low (2563 ms):
```
Use acting model instructions for Guardian reviews
```

codex-acp:gpt-5.6-luna[low] (2425 ms):
```
Use acting model instructions for Guardian reviews
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

codex:gpt-5.6-luna:lean:low (2428 ms):
```
Skip host skill discovery when no provider requires it
```

codex-acp:gpt-5.6-luna[low] (4552 ms):
```
Skip host skill discovery when extensions do not require it
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

codex:gpt-5.6-luna:lean:low (2664 ms):
```
Add isolated configuration for synchronous Guardian reviewers
```

codex-acp:gpt-5.6-luna[low] (2436 ms):
```
Add isolated Guardian reviewer configuration and tests
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

codex:gpt-5.6-luna:lean:low (2939 ms):
```
Preserve TUI web links across wrapping and terminal rendering
```

codex-acp:gpt-5.6-luna[low] (4885 ms):
```
Improve TUI web-link rendering and hyperlink scrolling
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

codex:gpt-5.6-luna:lean:low (2831 ms):
```
Preserve Guardian context for user input answers
```

codex-acp:gpt-5.6-luna[low] (4456 ms):
```
Preserve user input in Guardian review evidence

Record bounded user answers and include them in synchronous and asynchronous Guardian reviews, invalidating stale decisions and covering root-worker flows.
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

codex:gpt-5.6-luna:lean:low (2660 ms):
```
Add automatic conversation recaps for unfocused TUI sessions
```

codex-acp:gpt-5.6-luna[low] (2832 ms):
```
Add automatic conversation recaps when TUI loses focus
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

codex:gpt-5.6-luna:lean:low (2878 ms):
```
Expose managed developer instructions in requirements
```

codex-acp:gpt-5.6-luna[low] (4400 ms):
```
Expose managed developer instructions in requirements
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

codex:gpt-5.6-luna:lean:low (2392 ms):
```
Sanitize Git remote credentials across metadata and storage
```

codex-acp:gpt-5.6-luna[low] (3496 ms):
```
Sanitize Git remote URLs before persisting metadata
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

codex:gpt-5.6-luna:lean:low (2506 ms):
```
Add live turn settings updates with model switching validation
```

codex-acp:gpt-5.6-luna[low] (3522 ms):
```
Allow settings updates for running turn steps
```

## intellij-community-1 (diff 387 chars, git 3452 ms)

Actual:
```
misc codeowners: give IJPL the community productLayout package

The product model under community/platform/build-scripts/src/org/jetbrains/intellij/build/productLayout belongs to IJPL.
The OWNERSHIP syntax has no negation pattern. A later pattern rule in the parent file overrides the IJ Build Scripts Maintainers default for that package.
```

codex:gpt-5.6-luna:lean:low (2380 ms):
```
Add IJPL ownership for product layout sources
```

codex-acp:gpt-5.6-luna[low] (4377 ms):
```
Assign product layout files to IJPL owners
```

## intellij-community-2 (diff 938 chars, git 647 ms)

Actual:
```
[jps] rename builder to mitigate TW-104697
```

codex:gpt-5.6-luna:lean:low (2323 ms):
```
Capitalize project dependencies resolver builder name
```

codex-acp:gpt-5.6-luna[low] (2384 ms):
```
capitalize project dependencies resolver name
```

## intellij-community-3 (diff 1021 chars, git 1958 ms)

Actual:
```
IDEA-392279 [java-psi] Follow-up: remove redundant instantiateWith call
```

codex:gpt-5.6-luna:lean:low (2297 ms):
```
inference: simplify nullability incorporation
```

codex-acp:gpt-5.6-luna[low] (2304 ms):
```
inference: simplify nullability incorporation
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

codex:gpt-5.6-luna:lean:low (2318 ms):
```
tests [editor]: verify split window navigation and selection
```

codex-acp:gpt-5.6-luna[low] (3560 ms):
```
tests [editor]: cover split window ordering and selected file
```

## intellij-community-5 (diff 1529 chars, git 955 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, adjust benchmark, part10
```

codex:gpt-5.6-luna:lean:low (2311 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust performance test actions
```

codex-acp:gpt-5.6-luna[low] (2544 ms):
```
[editor] increase single-user performance test batches
```

## intellij-community-6 (diff 1688 chars, git 593 ms)

Actual:
```
AND-150 [android] Remove dead Compose compiler keys from K2ComposeCompilerConfigurationProvider
```

codex:gpt-5.6-luna:lean:low (2403 ms):
```
Remove obsolete Compose compiler options for K2
```

codex-acp:gpt-5.6-luna[low] (2864 ms):
```
Remove obsolete Compose compiler options
```

## intellij-community-7 (diff 1952 chars, git 478 ms)

Actual:
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

codex:gpt-5.6-luna:lean:low (2439 ms, the IDE drops IJPL-256790):
```
IJPL-256790 add backend customization tests to Bazel migration list
```

codex-acp:gpt-5.6-luna[low] (2512 ms, the IDE drops IJPL-256790):
```
IJPL-256790 tests: add intellij.java.ide.customization.backend.tests to Bazel migration list
```

## intellij-community-8 (diff 2104 chars, git 9341 ms)

Actual:
```
KTIJ-39860 [kotlin] Fix impossible is check null quick-fix
```

codex:gpt-5.6-luna:lean:low (2437 ms):
```
KTIJ [kotlin] Fix is-check to null-check conversion operators
```

codex-acp:gpt-5.6-luna[low] (2445 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix is-check null check replacement operators
```

## intellij-community-9 (diff 2367 chars, git 875 ms)

Actual:
```
[git] Initialize recentCommitsProvider in the background (IJPL-248720)
```

codex:gpt-5.6-luna:lean:low (2369 ms):
```
[git] Initialize recent commits provider asynchronously
```

codex-acp:gpt-5.6-luna[low] (3951 ms):
```
[git]: initialize amend commit provider asynchronously
```

## intellij-community-10 (diff 2642 chars, git 116 ms)

Actual:
```
cleanup [python]: Clean up formatting and imports in PyTypeChecker
```

codex:gpt-5.6-luna:lean:low (2456 ms, the IDE drops PY-92880):
```
PY-92880 Format subclassElementType parameters and clean up imports
```

codex-acp:gpt-5.6-luna[low] (2475 ms):
```
misc [python]: format subclassElementType parameters
```

## intellij-community-11 (diff 3296 chars, git 8659 ms)

Actual:
```
[skeleton] IJPL-257214 use the fallback renderer instead of the canvas in the Windows frontend
```

codex:gpt-5.6-luna:lean:low (2367 ms):
```
[skeleton] avoid Canvas rendering on Windows frontend
```

codex-acp:gpt-5.6-luna[low] (2692 ms):
```
[skeleton] use fallback renderer for Windows frontend
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

codex:gpt-5.6-luna:lean:low (2451 ms):
```
[pycharm] Add a startup availability test for Python tool windows
```

codex-acp:gpt-5.6-luna[low] (2390 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a split frontend startup flag test
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

codex:gpt-5.6-luna:lean:low (2393 ms):
```
refactor platform: set EDT priority natively without inheriting it
```

codex-acp:gpt-5.6-luna[low] (2406 ms):
```
refactor [platform]: Set EDT priority via native Windows API
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

codex:gpt-5.6-luna:lean:low (2391 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Clarify navigation cancellation behavior
```

codex-acp:gpt-5.6-luna[low] (4432 ms):
```
[navigation] Handle external navigation cancellation without throwing

Return false for user or superseded navigation cancellation while preserving
normal coroutine cancellation. Document the cancellation behavior in the API.
```

## intellij-community-15 (diff 4877 chars, git 117 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, JvmStatic, part45
```

codex:gpt-5.6-luna:lean:low (3139 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, expose factory methods to Java
```

codex-acp:gpt-5.6-luna[low] (2529 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, Java API, part45
```

## intellij-community-16 (diff 5268 chars, git 4500 ms)

Actual:
```
fix [VCS]: Git log: second pressing of "delete branch" button logs an error IJPL-163588

Also fixes IJPL-257749
```

codex:gpt-5.6-luna:lean:low (2378 ms):
```
[git] ignore repeated deletion requests for the same branch
```

codex-acp:gpt-5.6-luna[low] (2371 ms):
```
[git] Ignore repeated branch deletion requests
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

codex:gpt-5.6-luna:lean:low (2325 ms):
```
[plugin-manager] Reveal replaced selected rows after refresh
```

codex-acp:gpt-5.6-luna[low] (4008 ms):
```
[plugin-manager] Preserve selected row visibility after source refresh
```

## intellij-community-18 (diff 6986 chars, git 7382 ms)

Actual:
```
[java] IDEA-369985 SlowOp in GenerateToStringWorker.exitsMethodDialog
```

codex:gpt-5.6-luna:lean:low (2315 ms):
```
[java] Run Generate to String conflict checks off the EDT
```

codex-acp:gpt-5.6-luna[low] (2672 ms):
```
[Java] Run Generate toString conflict checks off the EDT
```

## intellij-community-19 (diff 8020 chars, git 7921 ms)

Actual:
```
[Java. Tests] IDEA-394694 Fix project test leak in `com.intellij.java.codeInspection.GlobalInspectionContextTest`
```

codex:gpt-5.6-luna:lean:low (2322 ms):
```
[test framework] unregister HighlightDisplayKey on disposal
```

codex-acp:gpt-5.6-luna[low] (2516 ms):
```
[test framework] unregister inspection keys on disposal
```

## intellij-community-20 (diff 9108 chars, git 397 ms)

Actual:
```
KTIJ-40403 [kotlin] Offer remove question quick fix before callable references
```

codex:gpt-5.6-luna:lean:low (2443 ms):
```
KTIJ [kotlin] Fix nullable callable reference quickfixes with whitespace
```

codex-acp:gpt-5.6-luna[low] (2442 ms, the IDE drops KTIJ-40376):
```
KTIJ-40376 [kotlin] Fix nullable callable reference quickfix with whitespace
```

## intellij-community-21 (diff 10486 chars, git 243 ms)

Actual:
```
[kotlin] inline: inline type parameters

- simplify type parameters processing

KTIJ-40432
```

codex:gpt-5.6-luna:lean:low (2437 ms):
```
[kotlin] inline: simplify CodeInliner analysis and type handling
```

codex-acp:gpt-5.6-luna[low] (2359 ms):
```
[kotlin] inline: simplify analysis in CodeInliner
```

## intellij-community-22 (diff 10986 chars, git 580 ms)

Actual:
```
[markdown] IJPL-257188 Support the Sticky Lines feature in Markdown


Merge-request: IJ-MR-227314
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

codex:gpt-5.6-luna:lean:low (2443 ms):
```
[markdown] Support sticky Markdown headings in breadcrumbs
```

codex-acp:gpt-5.6-luna[low] (2459 ms, the IDE drops IJPL-257501):
```
[markdown] IJPL-257501 Support sticky lines for Markdown headings
```

## intellij-community-23 (diff 12992 chars, git 487 ms)

Actual:
```
[markdown] IJPL-257766 Support Setext headers in Markdown live preview


Merge-request: IJ-MR-227110
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

codex:gpt-5.6-luna:lean:low (2521 ms, the IDE drops IJPL-257527):
```
[markdown] IJPL-257527 Support Setext headings in Markdown live preview
```

codex-acp:gpt-5.6-luna[low] (2785 ms, the IDE drops IJPL-257527):
```
IJPL-257527 Support Setext headings in Markdown live preview
```

## intellij-community-24 (diff 14987 chars, git 8784 ms)

Actual:
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

codex:gpt-5.6-luna:lean:low (2405 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

codex-acp:gpt-5.6-luna[low] (2418 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
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

codex:gpt-5.6-luna:lean:low (2559 ms):
```
refactoring air: make process probes hermetic in VM tests
```

codex-acp:gpt-5.6-luna[low] (3628 ms):
```
refactoring air: fake the host process table in tests
```

## intellij-community-26 (diff 22415 chars, git 9056 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, rename, part3
```

codex:gpt-5.6-luna:lean:low (2809 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

codex-acp:gpt-5.6-luna[low] (2288 ms):
```
editor: rename DocTextBranch to DocBranch
```

## intellij-community-27 (diff 27722 chars, git 111 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, DAG pretty printer, part19
```

codex:gpt-5.6-luna:lean:low (2427 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, event graph diagram, part18
```

codex-acp:gpt-5.6-luna[low] (4277 ms):
```
[editor] event graph diagram and tests
```

## intellij-community-28 (diff 41351 chars, git 532 ms)

Actual:
```
IJPL-252267 Add UI for editing default excludes
```

codex:gpt-5.6-luna:lean:low (2446 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default .analysisignore exclusions
```

codex-acp:gpt-5.6-luna[low] (2539 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default exclusions settings
```

## intellij-community-29 (diff 59619 chars, git 11172 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, run-length encode, part2
```

codex:gpt-5.6-luna:lean:low (2503 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 add run-length encoding to eg-walker events
```

codex-acp:gpt-5.6-luna[low] (4166 ms):
```
[editor] optimize eg-walker event graph with run-length encoding
```

## intellij-community-30 (diff 99790 chars, truncated, git 141 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, move offset, part51
```

codex:gpt-5.6-luna:lean:low (2429 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

codex-acp:gpt-5.6-luna[low] (2850 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```
