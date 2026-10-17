# bench-agents-opencode

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | tool calls | cost $ |
|---|---|---|---|---|---|---|---|---|---|
| opencode-acp:openai/gpt-5.6-luna:lean:low | 60/60 | 2857 | 5572 | 4458 | 0 | 18 | 1 | - | 0.0011 |
| opencode-acp:anthropic/claude-haiku-4-5:lean:default | 60/60 | 3710 | 6935 | 5840 | 0 | 74 | 0 | - | 0.0074 |
| opencode-acp:anthropic/claude-haiku-5-5:lean:low | 60/60 | 3350 | 7647 | 7654 | 0 | 126 | 0 | - | 0.0010 |
| opencode-acp:openai/gpt-5.6-luna:naive:low | 60/60 | 3003 | 6202 | 10494 | 0 | 21 | 3 | - | 0.0026 |
| opencode-acp:anthropic/claude-haiku-4-5:naive | 60/60 | 12777 | 23687 | 13938 | 0 | 991 | 957 | - | 0.0224 |

## codex-1 (diff 688 chars, git 555 ms)

Actual:
```
Skip postprocessing for short composer input (#39744)

## What changed

Return the initial wrapping ranges directly when the composer input produces a
single line and its byte length is less than the available width. This avoids
the additional grapheme and word-boundary pass for input that cannot wrap.

GitOrigin-RevId: 55d990a354fcc61e9a90d5796b4b39d16742cc50
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3047 ms):
```
Preserve short composer text without trailing whitespace wrapping
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2337 ms):
```
Fix textarea wrapping condition for single-line text
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2772 ms):
```
Keep whitespace-only soft breaks in the composer wrap

The composer's wrapping fast path now also returns early when the text fits on a single line, so the trailing-space handling below it is skipped in that case.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2881 ms):
```
Preserve unwrapped composer text ranges
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10212 ms):
```
Fix wrapping condition for single-line text within width limit
```

## codex-2 (diff 1343 chars, git 356 ms)

Actual:
```
Use default timeouts in cyber exec policy tests (#39496)

## What changed

Stop setting explicit one-second `timeout_ms` and `yield_time_ms` values in the
mock command calls. The shell command and unified exec variants now use their
default timing behavior while testing cyber exec policy.

GitOrigin-RevId: b1c25304ca47e7b08f023fe678467fc00330158b
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2860 ms):
```
Remove timeout from cyber command policy test requests
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2753 ms):
```
Simplify cyber exec policy test by removing timeout configuration

Remove the timeout key matching and timeout value assignment from the
command_response function, as they are no longer needed for the test.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2952 ms):
```
Stop setting timeout arguments in cyber exec policy test

The test helper no longer sends timeout_ms or yield_time_ms with the
command tool call. The timeout key was only used to pad the arguments,
so drop it along with the match arm that selected it.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (4235 ms):
```
Remove timeout from cyber exec policy test commands
```

opencode-acp:anthropic/claude-haiku-4-5:naive (6956 ms):
```
Remove timeout configuration from cyber exec policy tests
```

## codex-3 (diff 1926 chars, git 205 ms)

Actual:
```
Isolate IPC in Bubblewrap sandboxes (#39586)

## What changed

- Pass `--unshare-ipc` when building Bubblewrap arguments for both restricted-filesystem and full-filesystem sandbox paths.
- Update the Bubblewrap argument tests to cover the new namespace flag.

GitOrigin-RevId: 61fb1d5150d09626a3b6ee7a9c6a508108c52e80
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2549 ms):
```
Isolate IPC namespaces in Linux sandboxes
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3710 ms):
```
Add IPC namespace isolation to Linux sandbox processes

IPC namespace isolation (--unshare-ipc) is added to both full
filesystem and regular sandbox configurations to further restrict
inter-process communication between the sandboxed process and the
host system.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3284 ms):
```
Isolate Linux sandbox processes in their own IPC namespace

Add --unshare-ipc to the bwrap arguments in both the full-filesystem and the restricted filesystem paths, so sandboxed processes no longer share System V IPC objects and POSIX message queues with the host.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2821 ms):
```
Isolate IPC namespaces in Linux sandboxes
```

opencode-acp:anthropic/claude-haiku-4-5:naive (6657 ms):
```
Unshare IPC namespace in Linux sandbox processes
```

## codex-4 (diff 2532 chars, git 370 ms)

Actual:
```
Prevent Node REPL auth tokens from reaching child processes (#39301)

## What changed

- Add `NODE_REPL_AUTH_TOKEN` to the environment variables that model-reachable child processes cannot inherit.
- Remove the variable case-insensitively after shell environment policy overrides and from explicitly configured child command environments.
- Extend the environment scrubber tests to cover inherited and configured forms of the token.

GitOrigin-RevId: 716c65e0a9e222f705c226b7c86545251d3ea580
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2737 ms):
```
Prevent Node REPL auth tokens from reaching child processes
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2985 ms):
```
Prevent Node REPL auth tokens from reaching child processes

Add NODE_REPL_AUTH_TOKEN to the list of non-inheritable environment
variables to prevent sensitive authentication tokens from leaking to
model-reachable child processes. Update tests to verify the token is
properly filtered across different case variations.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2746 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes

The node REPL auth token is a credential, so it should not be inherited by model-reachable child processes. Add it to the non-inheritable list alongside the other auth and identity variables, and cover it in the scrubber tests, including case-insensitive matching.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2765 ms):
```
Prevent NODE_REPL_AUTH_TOKEN inheritance to child processes
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10576 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

## codex-5 (diff 3321 chars, git 142 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2981 ms):
```
Increase MCP model-visible tool name limit to 128 bytes

Update tool name normalization and coverage to match the Responses API
boundary.
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3146 ms):
```
Increase MCP tool name length limit from 64 to 128 bytes

Update the maximum allowed length for model-visible MCP tool names to 128
bytes to align with the Responses API name length boundaries. Add a test
to verify the boundary behavior at both 128 and 129 character lengths.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3152 ms):
```
Raise MCP model-visible tool name limit from 64 to 128 bytes

The Responses API accepts longer tool names than the 64-byte limit
assumed here, so long MCP tool names were being truncated and hashed
more often than necessary. Raise MAX_TOOL_NAME_LENGTH to 128 and update
the matching doc comment. Tests now check the boundary at 128 and 129
bytes, and the long-name test uses 128-byte names.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2812 ms):
```
Allow MCP tool names up to 128 bytes
```

opencode-acp:anthropic/claude-haiku-4-5:naive (9900 ms):
```
Increase MCP tool name length limit to 128 bytes
```

## codex-6 (diff 4055 chars, git 136 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (3321 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Add a regression test ensuring internal Guardian sessions preserve existing
proxy settings while regular sessions continue reconciling them.
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2770 ms):
```
Preserve Windows sandbox proxy settings for internal Guardian sessions

Guardian internal sessions should preserve proxy settings rather than
reconciling them, as they operate in isolated contexts where the parent's
proxy configuration may not be appropriate.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2812 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Internal Guardian sessions were reconciling Windows sandbox proxy
settings on startup like normal threads. Keep the existing settings
for Guardian sessions instead, and cover the difference with a test.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2971 ms):
```
Preserve Windows sandbox settings for Guardian sessions

Add coverage for Guardian session sandbox proxy behavior.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (6627 ms):
```
Preserve Windows sandbox proxy settings for Guardian internal sessions
```

## codex-7 (diff 5251 chars, git 123 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2600 ms):
```
Move code mode helper tests into runtime unit tests
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3142 ms):
```
Move text helper serialization test to code-mode-runtime

The test for the text() helper serializing objects is better placed in the
code-mode-runtime service tests where other text helper tests live. This
keeps runtime behavior tests colocated and reduces duplication with the
higher-level integration tests in the core suite.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3002 ms):
```
Move text helper test to code-mode runtime and drop core tests

The text() helper serialization test and the image helper error tests were end-to-end tests in core. The text() serialization case is now covered by a unit test in code-mode-runtime, and the image helper error tests are removed as redundant with the runtime coverage.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2709 ms):
```
Test code mode text serialization in runtime unit tests
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12167 ms):
```
Move text helper test to code-mode-runtime service tests
```

## codex-8 (diff 5608 chars, git 245 ms)

Actual:
```
Use in-process parsing for PowerShell command classification (#39602)

## What changed

- Route PowerShell wrapper extraction and Windows safe-command classification through the tree-sitter lowerer.
- Compile the PowerShell AST subprocess parser only in tests, where it remains available as an oracle.

GitOrigin-RevId: 3690bc32e8987ac9de820ef39ff7401d98ea8d83
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2846 ms):
```
Use unified PowerShell lowering for command safety checks
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3147 ms):
```
Consolidate PowerShell command parsing to Tree-sitter lowerer

Remove the AST-based PowerShell parser from production code paths. The
Tree-sitter lowerer provides better reliability and safety guarantees.
Keep the AST parser available only for testing purposes.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3438 ms):
```
Stop spawning PowerShell to parse command safety

PowerShell safety classification now uses the in-process Tree-sitter
lowerer instead of shelling out to the PowerShell AST parser. The
subprocess parser is kept only as a test oracle.

This removes the dependency on a PowerShell executable for command
classification, so it works the same off Windows and when pwsh is not
installed. Inputs the lowerer cannot handle are now rejected rather than
parsed by the external parser, so a few constructs such as `&&` chains
and parenthesized sub-expressions are no longer considered safe.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2873 ms):
```
Use Tree-sitter PowerShell parsing for command safety classification
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12777 ms):
```
[codex] Remove PowerShell AST parser in favor of Tree-sitter
```

## codex-9 (diff 6246 chars, git 234 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2662 ms):
```
Preserve bounds in reserved tool schemas
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3403 ms):
```
feat: preserve numeric and string bounds in tool schemas

Reserved tools like history and notes require strict parameter constraints
to be maintained in model requests. Add support for preserving minimum,
maximum, and maxLength bounds during schema parsing and serialization.

Also improve type inference to recognize maxLength as a string indicator
during schema sanitization.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2971 ms):
```
Preserve numeric and string bounds in tool input schemas

Reserved history and notes tools declare bounds such as minimum,
maximum, and maxLength. The schema parser dropped these keywords, so
the model received unconstrained parameters. Keep them on JsonSchema,
and infer a string type when only maxLength is present, as is already
done for enum and format.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3054 ms):
```
Preserve bounds in reserved tool schemas

Add numeric minimum/maximum and string maxLength support to JSON schema
serialization, with regression coverage for history and notes tools.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10696 ms):
```
Preserve parameter constraints in reserved tool schemas
```

## codex-10 (diff 7093 chars, git 236 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2577 ms):
```
Treat standard invalid_grant refresh failures as permanent
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3734 ms):
```
Honor RFC 6749 invalid_grant error in token refresh

When the OAuth provider returns a 400 Bad Request with "invalid_grant"
error code, treat it as a permanent refresh token failure per RFC 6749.
This prevents unnecessary retries when the refresh token is unusable,
even though the error code doesn't include legacy subtypes like expired
or reused.

Add tests to verify that standard invalid_grant errors fail permanently
while other 400 errors still retry as transient failures.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3414 ms):
```
Treat RFC 6749 invalid_grant on 400 as a permanent refresh failure

A 400 response with error "invalid_grant" means the refresh token is no
longer usable. The legacy subtype codes (expired, reused, revoked) are
not present in this form, so the classifier previously fell through to
the generic Other reason and retried. Mark it as a permanent failure
with the generic reason so the stored credentials are not retried.

Also pass the error code into classify_refresh_token_failure instead of
re-parsing the body, and add tests covering invalid_grant (no retry)
and other 400 errors (still transient, not cached as failed).
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2816 ms):
```
Handle standard invalid_grant refresh failures as permanent
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10784 ms):
```
Treat RFC 6749 standard invalid_grant as permanent auth failure

RFC 6749 reports an unusable refresh token as invalid_grant without
preserving the legacy expired/reused/revoked subtype. Treat this as a
permanent failure to avoid unnecessary retry attempts.
```

## codex-11 (diff 8342 chars, git 145 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (3581 ms):
```
Preserve Guardian denial and cancellation responses for MCP elicitation
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3952 ms):
```
Preserve guardian review outcomes in MCP elicitation responses

Update strict auto-review to accept and propagate guardian denial and
cancellation decisions alongside approvals. This ensures rejection
rationales and risk assessments are communicated to the agent, requiring
explicit user approval before proceeding with rejected operations.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3518 ms):
```
Preserve Guardian denials and cancellations for MCP elicitations

Strict auto-review used to turn every non-approved Guardian decision into a generic decline. The Guardian's denial rationale was lost, and cancellations were rejected by the elicitation check.

Now the core forwards Denied, TimedOut, and Abort decisions as elicitation responses, and the elicitation check accepts decline or cancel responses that carry the reviewer metadata but no content. The decline message is also reworded to ask the user for explicit approval.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2782 ms):
```
Preserve guardian denial and cancellation responses
```

opencode-acp:anthropic/claude-haiku-4-5:naive (11485 ms):
```
Preserve guardian denials in strict auto-review responses
```

## codex-12 (diff 9370 chars, git 126 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2809 ms):
```
Retry external provider auth after initial resolution failure
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3335 ms):
```
Support recovery from provider auth command resolution failures

When a provider auth command initially fails to resolve, the unauthorized
recovery mechanism now retries the command instead of giving up immediately.
This allows temporary command execution issues to be recovered from.

The recovery logic now checks for refreshable external auth more accurately,
retrying provider commands while avoiding unnecessary recovery attempts for
static authentication methods.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3155 ms):
```
Allow unauthorized recovery for external bearer auth without a token

When an external auth provider fails on the first resolution, there is no cached auth. Recovery was gated on the cached auth being API key auth, so it never ran and the request could not recover. Recovery now also runs when no auth is cached yet and when the cached auth supports unauthorized recovery. The refresh path accepts a missing cached auth and only records permanent failures for an auth that was actually attempted.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2780 ms):
```
Retry external auth resolution after initial failure on unauthorized recovery
```

opencode-acp:anthropic/claude-haiku-4-5:naive (9384 ms):
```
Retry provider auth command after initial resolution failure
```

## codex-13 (diff 10844 chars, git 132 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2580 ms):
```
Preserve Responses Lite prefix item IDs across requests
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3129 ms):
```
Assign deterministic IDs to Responses Lite prefix items

Prefix items (additional tools and base instructions) are rebuilt on
every request. Generate their IDs deterministically from the thread ID
and item payload so retries and resumed sessions preserve their identity.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3261 ms):
```
Assign stable IDs to Responses Lite prompt prefix items

Responses Lite rebuilds the tool list and base instructions on every
request, so they had no ID and could change identity across retries
or resumed sessions. Derive deterministic IDs from the thread ID and
the item payload so the same prompt prefix keeps the same identity
within a thread, and differs across threads or when content changes.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3108 ms):
```
Preserve Responses Lite prefix item identities across requests

Hash Responses Lite tools and base instructions by thread and payload so
retries and resumed sessions retain stable item IDs, with coverage for
incremental WebSocket requests and resumed sessions.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10574 ms):
```
Assign IDs to Responses Lite prefix items

Prefix items (additional_tools and base_instructions) are now
assigned deterministic IDs derived from the thread ID and payload
hash. This allows these prompt-only items to maintain consistent
identity across retries and resumed sessions, enabling proper
tracking in tracing spans.
```

## codex-14 (diff 12306 chars, git 135 ms)

Actual:
```
Move relay helpers into exec-server test support (#40712)

## What changed

- Move the reusable WebSocket relay, registration, frame capture, and encryption assertion helpers into `codex-exec-server-test-support`.
- Re-export the helpers from the existing relay test module so its callers keep the same interface.
- Add the Cargo dependencies and Bazel proto compile data required by the shared support module.

GitOrigin-RevId: 0383149c79ef86cb5e64a09baec41332f9eec4c6
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2637 ms):
```
Extract relay test utilities into shared support crate
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3433 ms):
```
Extract relay test utilities into dedicated support crate

Move WebSocket relay mocking and frame handling utilities from the
common test module into a reusable `codex-exec-server-test-support`
crate. This allows other test modules and crates to share relay testing
infrastructure without duplication.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2985 ms):
```
Move exec-server relay test helpers into the support crate

The noise relay test helpers (WebSocket accept, proxy, encryption
assertion, registry key lookup) were private to one test binary. Move
them into the shared exec-server test support crate so other tests can
reuse them. The protobuf definition is now exported from the exec-server
crate and compiled into the support crate.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2782 ms):
```
Extract shared relay test support utilities
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10974 ms):
```
Extract relay test utilities into test support crate
```

## codex-15 (diff 13298 chars, git 117 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2530 ms):
```
Use turn environment sandbox settings for tool execution
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3350 ms):
```
Reconcile sandbox configuration with TurnEnvironment

Use TurnEnvironment to access sandbox settings like windows_sandbox_level,
use_legacy_landlock, and windows_sandbox_private_desktop instead of reading
directly from turn context or config. This ensures sandbox policy is
consistently derived from the environment's configuration.

Add test to verify windows_sandbox_level override is restored on resume.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3439 ms):
```
Use turn environment sandbox config for Windows sandbox settings

Sandbox backend selection, patch safety checks, and exec policy now read
Windows sandbox level, private desktop, legacy landlock, and network
policy from the selected turn environment's config instead of the turn
context. The turn-wide value could differ from the environment owner's
config, so backend choice and the environment it applies to could
disagree.

Windows sandbox level overrides are also included in restorable thread
settings and in the MCP runtime invalidation check, so a resumed thread
keeps the override and a sandbox-level-only update refreshes MCP
configuration.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2961 ms):
```
Use turn environment settings for tool sandboxing (#40735)
```

opencode-acp:anthropic/claude-haiku-4-5:naive (9392 ms):
```
Resolve sandbox context reconciliation with TurnEnvironment

Access sandbox configuration consistently through TurnEnvironment
instead of directly from TurnContext and Config. Remove TODOs that
tracked this reconciliation work. Ensure windows_sandbox_level is
properly restored during thread resume.
```

## codex-16 (diff 15161 chars, git 126 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2637 ms):
```
Track multi-agent spawn calls in analytics
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3323 ms):
```
Track built-in collab agent tool calls in analytics

Add tracking for spawn_agent tool invocations in multi-agent v2,
including successful spawns and failures. Deduplicate subagent tool
call counts to avoid double-counting from both CollabAgentToolCall
and SubAgentActivity items. Report execution duration for collab
agent tool calls in the analytics event.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3148 ms):
```
Track multi-agent v2 spawn_agent calls as collab tool call analytics

Emit a codex_collab_agent_tool_call_event for each spawn_agent call in
multi-agent v2, covering both successful and failed spawns. Analytics
events are built from synthesized item started/completed notifications
so the reducer handles them like other tool calls.

Also dedupe subagent tool call counts by item id, so a collab tool call
and a sub-agent activity sharing an id are counted once, and report
execution duration for tool items instead of leaving it empty.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3889 ms):
```
Track multi-agent spawn calls in analytics
```

opencode-acp:anthropic/claude-haiku-4-5:naive (14936 ms):
```
Track collab agent tool calls in analytics
```

## codex-17 (diff 17587 chars, git 146 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (3279 ms):
```
Preserve scrollback in Windows Terminal viewports

Implement terminal-specific scrollback strategies for viewport growth and history insertion, preserving terminal-native scrollback in Windows Terminal while retaining Zellij compatibility. Add coverage for full-screen scrolling and history insertion.
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4131 ms):
```
Add scrollback strategy abstraction for terminal-safe history insertion

Introduce a `ScrollbackStrategy` enum to encapsulate terminal-specific behaviors
for growing viewports and inserting history. This replaces the simple `is_zellij`
boolean with a more flexible approach that detects Windows Terminal and applies
full-screen scrolling to avoid losing scrollback when partial DEC scroll regions
are unreliable.

Windows Terminal and Zellij (with terminal-wrapped history) now use full-screen
insertion to preserve native scrollback, while other terminals continue using
standard scroll region commands.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3068 ms):
```
Add full-screen scrollback strategy for Windows Terminal

Windows Terminal drops rows when a partial DEC scroll region is used to grow the inline viewport or insert history, so composer contents are lost instead of moving into scrollback. Introduce a ScrollbackStrategy that selects full-screen scrolling on Windows Terminal, keeping the scroll-region path for other terminals and the raw Zellij path for terminal-wrapped history.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3050 ms):
```
Preserve scrollback in Windows Terminal viewport updates

Add terminal-specific scrollback strategies for full-screen history insertion and viewport growth, including Windows Terminal detection and regression coverage.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (16701 ms):
```
Preserve terminal scrollback through full-screen viewport growth
```

## codex-18 (diff 18883 chars, git 127 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2658 ms):
```
Cache executor temporary directories for sandbox policy resolution
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3363 ms):
```
Plumb temporary directories through sandbox contexts

Add support for passing executor-local temporary directories through
the sandboxing layer so they can be used to resolve `:tmpdir` policy
entries. Extract temporary directory discovery into a separate method
to allow caching without repeating shell detection. Update all
sandbox context construction sites to include the temporary
directories field.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2928 ms):
```
Cache executor temporary directories for sandbox policy resolution

Remote and local environments now report their temporary directories,
which are cached on the turn environment and passed through the
filesystem sandbox context. This lets `:tmpdir` policy entries resolve
against the directories of the executor that runs the command instead
of the orchestrator's.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2955 ms):
```
Cache executor temporary directories for sandbox policy resolution
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12632 ms):
```
Propagate temporary directories through environment and sandbox contexts
```

## codex-19 (diff 21167 chars, git 371 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2666 ms):
```
Expand OAuth discovery redirect coverage
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4075 ms):
```
Expand OAuth discovery redirect tests with same-origin and cycle limits

- Add comprehensive test coverage for same-origin redirect handling in both
  resource and authorization metadata fetches
- Verify cross-origin redirects are rejected for both resource and authorization
  metadata discovery
- Test redirect cycle detection with bounded redirect limits
- Extract common test assertions into helper functions to reduce duplication
- Add MetadataDelivery enum to parameterize tests for direct vs redirected
  metadata delivery
- Update HTTP client initialization to use Environment::default_for_tests()
  for consistency
- Remove unused executor_discovery test assertion
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3688 ms):
```
Add redirect coverage to MCP OAuth discovery tests

The discovery tests now run through the local exec-server HTTP client
instead of building a RouteAwareHttpClient by hand. They also cover
same-origin metadata redirects, and check that cross-origin and
cyclic redirects are rejected without leaking resource headers.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3033 ms):
```
Harden OAuth metadata redirect discovery tests

Add coverage for same-origin redirects, cross-origin rejection, redirect cycles, and issuer validation while using the configured local HTTP client.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (16917 ms):
```
Test OAuth discovery redirect handling and validation
```

## codex-20 (diff 23412 chars, git 216 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2833 ms):
```
Attribute executor skills to selected plugins for analytics
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3150 ms):
```
Add executor plugin identity to skill analytics

Track which executor plugin originated each skill by attributing skills
to their selected plugin root during catalog discovery. This enables
accurate skill invocation metrics that capture the plugin context for
both explicit and implicit skill invocations.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3422 ms):
```
Attribute executor skills to their selected plugin for analytics

Selected executor plugins now record their root ID and plugin ID in a
thread-scoped snapshot. Skill catalog entries from those roots are
tagged with the plugin ID and user scope, so skill invocation analytics
report the owning plugin instead of null.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2685 ms):
```
Attribute executor skills to selected plugins in analytics
```

opencode-acp:anthropic/claude-haiku-4-5:naive (11776 ms):
```
Attribute executor plugins to skills
```

## codex-21 (diff 25330 chars, git 115 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2730 ms):
```
Add structured full approval reviews alongside fast decisions
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3896 ms):
```
Refactor approval review trait into fast and full review paths

Split `ApprovalReviewContributor` into two optional methods: `fast_decision`
for quick verdicts from cached evidence, and `full_review` for structured
assessment requests. Both default to `None`, allowing implementations to
support either or both paths.

Added `ApprovalReviewInput` and `ApprovalAssessment` types to provide
typed context and results for full reviews. Updated registry to offer both
`fast_approval_decision` and `full_approval_review` methods.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3686 ms):
```
Split approval review contributor into fast decision and full review

ApprovalReviewContributor previously exposed only one `contribute`
method that returned a ReviewDecision from a rendered prompt. Rename
it to `fast_decision` and add a `full_review` hook that takes a
structured ApprovalReviewInput and returns an ApprovalAssessment or
ApprovalReviewError. Both methods default to returning None, so
existing contributors only need to rename their method.

The registry mirrors this split: `fast_approval_decision` replaces
`approval_review`, and `full_approval_review` walks contributors in
order and returns the first claimed assessment.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2892 ms):
```
Add full approval review support for extensions
```

opencode-acp:anthropic/claude-haiku-4-5:naive (14161 ms):
```
Add full approval review path to extension contributors

This splits the ApprovalReviewContributor trait into two methods: fast_decision
returns approval decisions from existing evidence without performing a full review,
while full_review performs a complete structured assessment. The registry now
supports both paths, and new types define the structured approval review input
and output formats.
```

## codex-22 (diff 28926 chars, git 119 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (3041 ms):
```
Use acting model instructions for Guardian decisions
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3994 ms):
```
Support model-specific Guardian rejection and timeout instructions

Guardian review decisions can now use rejection and timeout instructions
from the acting model's catalog configuration instead of always using the
hardcoded defaults. This allows different models to provide customized
feedback when their actions are rejected or when reviews time out.

The rejection instructions are used in guardian denial messages, while
timeout instructions replace the default deadline exceeded message. Both
fall back to the legacy defaults when not configured in the model's
`auto_review` messages.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (7647 ms):
```
Use model-specific Guardian timeout and rejection messages

Guardian timeout and rejection messages were hardcoded, so the acting
model's catalog settings were ignored. Add optional rejection_instructions
and timeout_instructions to AutoReviewMessages and read them from the
acting model's info, falling back to the existing built-in text when unset.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2775 ms):
```
Use acting model instructions for Guardian reviews
```

opencode-acp:anthropic/claude-haiku-4-5:naive (13888 ms):
```
Inject model-specific Guardian review instructions
```

## codex-23 (diff 31823 chars, git 122 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2827 ms):
```
Add opt-out for unnecessary host skill discovery
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4417 ms):
```
Add opt-out for host skill discovery when all skill contributors support it

Add `SkipHostSkillDiscovery` feature flag and supporting infrastructure to allow sessions to skip discovering host-owned skills when no registered skill contributor requires them. This enables extensions with only executor and orchestrator skill providers to avoid the overhead of host skill snapshots.

The registry now exposes `requires_host_skill_discovery()` to indicate whether any contributor needs host skills. Skills extension and executor provider implement this method to opt out when appropriate. Session initialization and turn context building check this flag before performing host skill discovery.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2878 ms):
```
Add SkipHostSkillDiscovery feature to skip host skill snapshots

The feature, when enabled, skips host skill discovery at session init and per turn unless a registered skill contributor requires host skills. Contributors opt out via requires_host_skill_discovery(); the default keeps legacy discovery.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2849 ms):
```
Skip host skill discovery when extensions don't require it
```

opencode-acp:anthropic/claude-haiku-4-5:naive (9806 ms):
```
Add opt-out for host skill discovery in extension contributors

Contributors like ExecutorSkillProvider can now indicate whether they
require host skill snapshots by implementing requires_host_skill_discovery.
When all contributors opt out and the new SkipHostSkillDiscovery feature is
enabled, session initialization and turn context building skip the host skill
discovery phase entirely, improving performance for orchestrator and executor
workflows that don't depend on host-owned skills.
```

## codex-24 (diff 36705 chars, git 112 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2621 ms):
```
Add isolated Guardian reviewer configuration and policy template
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2625 ms):
```
Add sync reviewer configuration for Guardian v2 approval policies
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3161 ms):
```
Add sync reviewer options preparation for guardian v2

Prepare an isolated guardian reviewer internal session: read-only
permissions, cleared MCP servers and disabled features, with the model
chosen from the parent's auto-review override or a low-effort preset.
Starting the session stays with the host.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3604 ms):
```
Add isolated Guardian reviewer configuration and policy template

Implement read-only reviewer session setup with model selection, permission
isolation, network restrictions, policy prompts, and comprehensive tests.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (16819 ms):
```
Add synchronous reviewer configuration for Guardian extension
```

## codex-25 (diff 40675 chars, git 137 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (5572 ms):
```
Preserve TUI web links across rendering and wrapping
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (6935 ms):
```
Add web-link label styling and hide destinations on supporting terminals

Web links now display their labels with link styling (cyan underline) in
addition to their destinations. On terminals with reliable OSC 8 support
(Ghostty, iTerm2, WezTerm, Kitty, VS Code, Alacritty, Windows Terminal,
Konsole, GNOME Terminal, VTE), destinations are hidden to reduce clutter
while preserving clickability through hyperlink annotations.

Refactor hyperlink rendering into a dedicated `HyperlinkParagraph` widget
that keeps text and link annotations aligned during scrolling, replacing
separate text rendering and post-hoc hyperlink application. Add terminal
detection to determine link display policy based on terminal capabilities.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (5849 ms):
```
Hide web link destinations in terminals that support OSC 8 links

Terminals that render OSC 8 hyperlinks already show the target when a
label is clicked, so the trailing " (url)" suffix is redundant there.
Show only the styled label for web links in known-supporting terminals,
and keep the destination for unknown terminals, multiplexers, and
terminals without hyperlink support so the URL is never lost.

Web link labels are now styled as links in both prose and table cells.
Hyperlink-aware paragraph rendering is shared through
HyperlinkParagraph so the visible text and link annotations scroll and
wrap together.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (5408 ms):
```
Preserve TUI web link labels and targets across rendering (#403)
```

opencode-acp:anthropic/claude-haiku-4-5:naive (13409 ms):
```
Add styled web link labels and terminal-aware destination visibility
```

## codex-26 (diff 46683 chars, git 125 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (4153 ms):
```
Preserve genuine user input in Guardian authorization reviews

Record bounded user answers as trusted Guardian evidence, invalidate stale
reviews after new answers, and propagate input to root-worker reviews and
classification prompts. Add coverage for empty answers, hooks, truncation,
and worker propagation.
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (6299 ms):
```
Add user input answers to Guardian reviews with post-tool hook support

Record genuine user answers from request_user_input before post-tool hooks
can replace or reject their output. Include these bounded, role-labeled
fragments in both synchronous and asynchronous Guardian reviews so they
participate in authorization decisions. When a user provides an answer to
an input request, invalidate earlier synchronous reviews since the new
information changes the risk assessment.

Support post-tool hooks that can provide feedback or block user input
answers, with that feedback visible to classifiers but the original answer
preserved for authorization state changes. Extend the root authorization
snapshot to include user input responses so they propagate through worker
thread classifications.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3660 ms):
```
Record user-input answers as Guardian trusted evidence

Answers from request_user_input are now stored in the thread's Guardian
evidence and included in the authorization version. A new answer makes
earlier synchronous Guardian decisions stale, so they are not reused.

Trusted answers are added to both the synchronous reviewer prompt and
the async classifier input, bounded by count and token budget. Their
tool calls must still exist in history, so post-tool hooks that replace
or block the visible output cannot erase the answer the classifier sees.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3157 ms):
```
Preserve genuine user input in Guardian reviews

Record bounded request_user_input answers as trusted Guardian evidence,
invalidate stale reviews after answers, and propagate them through root
worker and async classifier prompts. Add coverage for hooks, truncation,
empty answers, and multi-agent authorization changes.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (13998 ms):
```
Capture user input answers for Guardian review context
```

## codex-27 (diff 52531 chars, git 143 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2903 ms):
```
Add automatic conversation recaps when returning to the TUI
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3981 ms):
```
Add automatic conversation recaps for unfocused tasks

Track when conversations become eligible for automatic recaps while the
terminal is unfocused. Generate concise summaries after 3 minutes without
focus if at least 3 turns have completed. Require 2 additional turns
before generating another recap. Preserve recap eligibility across thread
switches and history reloads.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3350 ms):
```
Add automatic conversation recap for unfocused TUI sessions

The TUI now tracks terminal focus loss and completed turns. When the
terminal stays unfocused for a few minutes after enough turns have
completed, it becomes eligible for a short recap of the task so the user
can pick it back up quickly.

Focus changes are forwarded as explicit TuiEvent::FocusGained and
TuiEvent::FocusLost events instead of being dropped or mapped to Draw,
so screens that previously relied on Draw can ignore focus-only events
without redrawing.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2888 ms):
```
Add automatic conversation recaps when terminal is unfocused
```

opencode-acp:anthropic/claude-haiku-4-5:naive (15519 ms):
```
Add automatic conversation recaps when returning to unfocused tasks
```

## codex-28 (diff 59843 chars, git 238 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2850 ms):
```
Expose managed developer instructions in requirements
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4174 ms):
```
Expose managed developer instructions in configuration requirements

Add support for `additional_developer_instructions` from enterprise requirements,
kept separate from client-provided developer instructions. These instructions are
rendered as a managed developer message in each conversation, with change notices
when the policy is updated or removed.

The feature includes validation to reject oversized policies during config load,
proper handling in subagent context sanitization to preserve managed policies
when clearing inherited instructions, and migration support for rollout history
and compaction workflows.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3509 ms):
```
Add managed additional_developer_instructions requirement

Lets administrators supply developer instructions through requirements.toml or managed config. They are injected as a dedicated managed_developer_instructions context fragment, separate from ordinary developer_instructions, and are validated against the model-context token limit at config load.

Forked and resumed sessions drop inherited managed fragments and rebuild them from current requirements, so the policy appears once per request. Rollback and rollout migration recognize the new fragment as contextual.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3141 ms):
```
Expose managed developer instructions via requirements (#39753)
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12645 ms):
```
Expose managed developer instructions in configRequirements

Managed instructions from requirements.toml or MDM are kept separate from ordinary developer instructions and rendered as a distinct developer message. They update automatically when requirements change, with appropriate notices for replacements and removals. Oversized policies are rejected during config loading to prevent silent truncation.
```

## codex-29 (diff 76597 chars, truncated, git 184 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (3425 ms):
```
Sanitize Git remote credentials across metadata and analytics

Introduce a sanitized Git URL type that removes credentials before Git
metadata is persisted, returned, or sent in analytics and model requests.
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4797 ms):
```
Add sanitization of Git remote URLs to prevent credential leakage

Git remote URLs in HTTPS and SSH formats can contain authentication
credentials (passwords, tokens, keys). These credentials must never be
stored in rollouts, thread metadata, or sent to language models.

Introduce `SanitizedGitUrl`, a newtype that removes credentials during
construction using the `gix-url` parser. Update all Git URL storage and
transport to use this type, ensuring credentials are stripped at the
boundary where URLs enter the system.

This prevents accidental exposure of Git credentials through:
- API responses and thread metadata
- SQLite state database
- Rollout files and analytics
- Model requests and turn metadata headers
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3962 ms):
```
Sanitize git remote URLs before they are stored or sent

Git remote URLs can carry credentials in the userinfo part (for example
https://user:token@host/repo.git). These were passed unchanged through
thread metadata, rollout files, SQLite, API responses, analytics, and
turn metadata sent to the model.

Introduce SanitizedGitUrl in codex-protocol, which strips credentials at
construction and rejects invalid remotes. Use it for every git origin
field so that credentials cannot reach any of those outputs. Existing
rollouts are sanitized on deserialization.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (4589 ms):
```
Sanitize Git remote URLs to remove credentials
```

opencode-acp:anthropic/claude-haiku-4-5:naive (11505 ms):
```
Add SanitizedGitUrl to redact Git credentials from metadata

Introduce a `SanitizedGitUrl` type that automatically removes
authentication credentials from Git remote URLs when they are parsed.
Update all git URL storage and transmission to use this type instead
of plain strings, ensuring credentials are never stored in SQLite,
serialized to API responses, or included in analytics events.
```

## codex-30 (diff 101984 chars, truncated, git 156 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (5514 ms):
```
Add atomic live turn settings updates with model switching support
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (6774 ms):
```
Add turn-level settings updates with step activation constraints

Introduce `TurnSettingsUpdate` to allow sparse modifications to a running
turn's model, reasoning effort, summary, and service tier without affecting
frozen initial settings or future turns. Model changes validate against
legacy approval policy, reviewer, and prefix-rule safety constraints that
still depend on the turn's admitted context. The `ResolvedStepSettings`
gains `apply_update` and `revalidate` methods to atomically publish changes,
while `step_activation` module enforces these safety boundaries. Include
comprehensive test coverage for valid and rejected transitions, concurrent
updates, and user-input authorization flows. Enable the `StepModelSwitching`
feature flag for gradual rollout.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (6006 ms):
```
Add per-turn settings updates for running turns

Introduce Op::TurnSettings so a running turn can receive sparse model,
effort, summary, and service tier changes without altering future thread
settings. Updates are validated against current constraints and reported
back as applied, rejected, or target-unavailable. Captured step settings
are not changed; only later step captures see the new selection.

Gate the feature behind the under-development step_model_switching flag.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (6029 ms):
```
Allow settings updates for running turn steps
```

opencode-acp:anthropic/claude-haiku-4-5:naive (23687 ms):
```
Add turn-settings updates for mid-step model switching

Sparse updates to running task settings must preserve legacy approval
policies, reviewer constraints, and model-safety properties. Ordinary
model switching is validated separately. Test coverage includes both
successful updates and constraint violations across model selections
and approval configurations.
```

## intellij-community-1 (diff 387 chars, git 3883 ms)

Actual:
```
misc codeowners: give IJPL the community productLayout package

The product model under community/platform/build-scripts/src/org/jetbrains/intellij/build/productLayout belongs to IJPL.
The OWNERSHIP syntax has no negation pattern. A later pattern rule in the parent file overrides the IJ Build Scripts Maintainers default for that package.
```

opencode-acp:openai/gpt-5.6-luna:lean:low (5430 ms, the IDE drops IJI-3163):
```
IJI-3163 codeowners mapping example
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (5719 ms):
```
Update CODEOWNERS for build scripts product layout
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (5698 ms, the IDE drops IJI-3163):
```
IJI-3163 is not in the branch name here (unknown), so omit issue id. Recent messages show style like "[platform] ..." or "docs air: ...". Change adds an ownership rule for productLayout directory.

Add OWNERSHIP rule for productLayout build code
```

opencode-acp:openai/gpt-5.6-luna:naive:low (6202 ms):
```
Add IJPL ownership for product layout build sources
```

opencode-acp:anthropic/claude-haiku-4-5:naive (11884 ms):
```
Add IJPL codeowners mapping for productLayout
```

## intellij-community-2 (diff 938 chars, git 776 ms)

Actual:
```
[jps] rename builder to mitigate TW-104697
```

opencode-acp:openai/gpt-5.6-luna:lean:low (4002 ms):
```
Capitalize project dependencies resolver builder name
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4223 ms):
```
[jps build] capitalize Project Dependencies Resolver message
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3868 ms):
```
JPS: capitalize dependency resolver builder name

The builder name is shown in the UI, so it now matches the title case
used for other builder names.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3988 ms):
```
[jps] Capitalize project dependencies resolver name
```

opencode-acp:anthropic/claude-haiku-4-5:naive (11326 ms):
```
[jps build] Capitalize project dependencies resolver name
```

## intellij-community-3 (diff 1021 chars, git 2368 ms)

Actual:
```
IDEA-392279 [java-psi] Follow-up: remove redundant instantiateWith call
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3164 ms):
```
inference: simplify nullability incorporation
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2880 ms):
```
inference: simplify nullability handling in type incorporation
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3560 ms):
```
Simplify nullability propagation in inference incorporation

Use the usage nullability directly when updating the bound instead of
first computing it via instantiatedWith. The intermediate instantiation
step was redundant here and made the nullability of the bound depend on
the instantiated value rather than the usage site.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3877 ms):
```
inference: simplify nullability incorporation
```

opencode-acp:anthropic/claude-haiku-4-5:naive (11859 ms):
```
cleanup: simplify nullability comparison
```

## intellij-community-4 (diff 1372 chars, git 274 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (4209 ms):
```
tests [editor]: verify split window navigation and selection
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3896 ms):
```
tests [editor]: verify split window selection and navigation

The test now explicitly verifies that creating a vertical splitter
copies the selected tab into the new window and correctly establishes
the navigation relationship between the original and new windows.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (4965 ms):
```
tests [editor]: check both windows after a vertical split

The test relied on the previous window of the split, without checking
that the split really produced a second window or what it selected.
Assert the window list, the selected file in the new window, and the
prev/next navigation between the two windows explicitly.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (5373 ms):
```
tests [editor]: cover split window navigation and selected tabs
```

opencode-acp:anthropic/claude-haiku-4-5:naive (14836 ms):
```
tests [editor]: cover window navigation after split
```

## intellij-community-5 (diff 1529 chars, git 2347 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, adjust benchmark, part10
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3537 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust performance test workload
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3946 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust action distribution and batch size, part10

Exclude renameVariable from random action selection due to performance
issues. Increase single user batch count to 1000 for more comprehensive
testing.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3214 ms):
```
[editor] Tune DocBranch performance test action mix

Drop renameVariable from the random action pick to cut its share of
the mix, mark it as too slow, and raise the single-user batch count
so the test still exercises enough edits.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2595 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, increase single-user batches
```

opencode-acp:anthropic/claude-haiku-4-5:naive (15358 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, fix range and scale up batches
```

## intellij-community-6 (diff 1688 chars, git 579 ms)

Actual:
```
AND-150 [android] Remove dead Compose compiler keys from K2ComposeCompilerConfigurationProvider
```

opencode-acp:openai/gpt-5.6-luna:lean:low (4064 ms):
```
Remove obsolete Compose compiler configuration overrides
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4074 ms):
```
Remove intrinsic remember and strong skipping feature flags from K2 Compose compiler configuration
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (4551 ms):
```
Remove obsolete Compose compiler options from IDE config

The IntrinsicRemember feature flag and its optimization key, along with
STRONG_SKIPPING_ENABLED_KEY, are no longer passed to the compiler
plugin configuration. Drop them so the IDE setup matches what the
compiler now expects.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (5156 ms):
```
Remove obsolete Compose compiler configuration options
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12505 ms):
```
[compose] Remove optimization configuration flags
```

## intellij-community-7 (diff 1952 chars, git 485 ms)

Actual:
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

opencode-acp:openai/gpt-5.6-luna:lean:low (5144 ms, the IDE drops IJPL-256790):
```
IJPL-256790 tests: add intellij.java.ide.customization.backend.tests to bazel-migrated-test-modules.txt
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4579 ms, the IDE drops IJPL-256790):
```
IJPL-256790 tests: add intellij.java.ide.customization.backend.tests to bazel-migrated-test-modules.txt

Move the jps_test target earlier in the BUILD file and add timeout
and tags attributes to match the conventions used in other test modules.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (4167 ms, the IDE drops MRI-5553):
```
[MRI-5553] switch intellij.java.ide.customization.backend.tests

Branch name is not available, so no issue id is included. The recent commits use the "switch X" pattern with an issue tag, but the tag cannot be taken from them.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (4920 ms, the IDE drops IJPL-256790):
```
IJPL-256790 tests: add intellij.java.ide.customization.backend.tests to Bazel migration list
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12908 ms):
```
switch intellij.java.ide.customization.backend.tests
```

## intellij-community-8 (diff 2104 chars, git 8788 ms)

Actual:
```
KTIJ-39860 [kotlin] Fix impossible is check null quick-fix
```

opencode-acp:openai/gpt-5.6-luna:lean:low (4792 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix null-check replacement for negated is checks
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4468 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix operator logic in ReplaceIsCheckWithNullCheckFix

The negation condition for selecting the null-check operator was
inverted, causing incorrect transformations. When an is-check is
negated, it should become !=, not ==.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (4061 ms):
```
Fix inverted null check operator in ReplaceIsCheckWithNullCheckFix

The quick fix mapped negated `is` checks to `==` and positive ones to
`!=`, so it produced the opposite of the intended condition. Swap the
operators and update the expected test output to match.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (4076 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix is-check to null-check conversion operators
```

opencode-acp:anthropic/claude-haiku-4-5:naive (17286 ms):
```
[kotlin] Fix inverted operator logic in null check replacement
```

## intellij-community-9 (diff 2367 chars, git 927 ms)

Actual:
```
[git] Initialize recentCommitsProvider in the background (IJPL-248720)
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3465 ms):
```
[git] Initialize amend commit provider asynchronously
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3829 ms):
```
[git]: Lazy-initialize GitRecentCommitsProvider in GitAmendCommitService

Wrap the GitRecentCommitsProvider initialization in an async block to
defer its creation until it's actually needed. This prevents unnecessary
initialization overhead when the service is first created.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3167 ms):
```
Make GitRecentCommitsProvider creation lazy in GitAmendCommitService

The provider was built eagerly in the service constructor, with preload
enabled. Create it inside an async block on Dispatchers.Default instead,
and await it where the amend targets are requested, so service startup
does not block on the initial commit load.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3286 ms):
```
[git] Initialize recent commits provider asynchronously
```

opencode-acp:anthropic/claude-haiku-4-5:naive (15691 ms):
```
Defer recentCommitsProvider initialization to be async
```

## intellij-community-10 (diff 2642 chars, git 159 ms)

Actual:
```
cleanup [python]: Clean up formatting and imports in PyTypeChecker
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2796 ms):
```
PyTypeChecker: clean up imports and function formatting
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2637 ms, the IDE drops PY-92880):
```
PY-92880 remove unused imports and reformat function signature
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2576 ms):
```
Clean up unused imports in PyTypeChecker and reformat subclassElementType signature
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3359 ms, the IDE drops PY-92880):
```
PY-92880 simplify PyTypeChecker imports and formatting
```

opencode-acp:anthropic/claude-haiku-4-5:naive (20290 ms):
```
misc [python]: remove unused imports and reformat subclassElementType
```

## intellij-community-11 (diff 3296 chars, git 8445 ms)

Actual:
```
[skeleton] IJPL-257214 use the fallback renderer instead of the canvas in the Windows frontend
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3719 ms):
```
[skeleton] use fallback renderer for JetBrains Client on Windows
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4632 ms):
```
refactor skeleton: rename WaylandRenderer to FallbackRenderer and use on Windows frontend

The renderer is now used on both Wayland and Windows frontend to avoid
platform-specific issues. Renamed to reflect its broader purpose as a
fallback rendering strategy that uses EDT-based Swing repaints instead
of heavyweight Canvas.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3617 ms):
```
refactor skeleton: rename Wayland renderer to fallback renderer

Rename EditorSkeletonWaylandRenderer to EditorSkeletonFallbackRenderer
and use it also for Windows JetBrains Client frontends, where a Canvas
hits JBR-10643. Canvas stays the default elsewhere.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3440 ms):
```
[skeleton] use fallback renderer for Windows frontend
```

opencode-acp:anthropic/claude-haiku-4-5:naive (13137 ms):
```
refactor skeleton: use fallback renderer for Wayland and Windows
```

## intellij-community-12 (diff 3785 chars, git 926 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (3980 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add split frontend startup flag test
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2888 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add test for Python tool window startup flag on split frontend
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (4217 ms):
```
[python] Add lambda test for PythonProcessOutput startup flag

Add a split-frontend lambda test asserting that the registry key
python.toolwindows.available.at.startup defaults to true when loaded
from the real frontend plugin set. Python tool windows were hidden at
startup on the split frontend because this default was missing there.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2990 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add split frontend tool window startup flag test
```

opencode-acp:anthropic/claude-haiku-4-5:naive (14264 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add test for python tool window startup flag
```

## intellij-community-13 (diff 4115 chars, git 889 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2503 ms):
```
fix [platform]: Set EDT priority natively on Windows
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3966 ms):
```
refactor [platform]: Use native API to set EDT thread priority on Windows

The native priority is raised directly via SetThreadPriority instead of
Thread.setPriority. A Java priority is copied to every thread the EDT
creates, which put lazily started kotlinx.coroutines workers at
THREAD_PRIORITY_HIGHEST above the threads that feed their queue, causing
spin-wait on preempted producers to hold every CPU for seconds. A native
priority is not inherited, avoiding this issue.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3459 ms):
```
refactor platform: set EDT native priority instead of Java priority

Calling Thread.setPriority(MAX_PRIORITY) on the EDT was copied to every
thread the EDT spawns. The lazily started kotlinx.coroutines workers then
ran at THREAD_PRIORITY_HIGHEST, above the producers that feed their queue,
and their spin-wait on a preempted producer held CPUs for seconds.

Set the native thread priority directly through SetThreadPriority. A
native priority is not inherited by new threads. Log an error if the call
fails.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3155 ms):
```
refactor [platform]: Set EDT priority natively without JVM inheritance

Prevent elevated priority from propagating to coroutines workers and log native priority update failures.
```

opencode-acp:anthropic/claude-haiku-4-5:naive (18781 ms):
```
refactor [platform]: use native SetThreadPriority for EDT

Set thread priority directly via native SetThreadPriority rather than
Thread.setPriority, since native priority is not inherited by lazily
started threads like kotlinx.coroutines workers. This prevents them
from starving their queue producers with unintended high priority.
```

## intellij-community-14 (diff 4485 chars, git 957 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2924 ms):
```
[navigation] Clarify navigation cancellation handling
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3173 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Handle cancellation in navigation service

Catch CancellationException separately from normal navigation failures.
When a newer navigation is triggered or the user cancels progress, return
false instead of propagating the exception. Only re-throw if the caller's
coroutine context is actually canceled.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2893 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Return false instead of throwing on external cancel

Navigation canceled by a newer request or by the user threw
CancellationException into the caller. Catch it when the caller's
coroutine is still active and return false, so only real coroutine
cancellation propagates. Document this contract on NavigationService.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2943 ms, the IDE drops IJPL-255127):
```
[navigation] IJPL-255127: Distinguish navigation cancellation from coroutine cancellation
```

opencode-acp:anthropic/claude-haiku-4-5:naive (17077 ms):
```
[navigation] Handle CancellationException in navigation submission

Catch CancellationException to distinguish between normal coroutine
cancellation and external cancellation from newer navigation or user
action. Return false in the latter case instead of propagating the
exception. Add documentation clarifying these cancellation semantics.
```

## intellij-community-15 (diff 4877 chars, git 112 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, JvmStatic, part45
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2796 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, expose Kotlin factories to Java
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2947 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, JvmStatic annotations, part45
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3121 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, add @JvmStatic to factories

Expose the companion factory methods of the experimental editor API as
static methods for Java callers. The factories are create, createInsert,
createDelete, insertOp, deleteOp, ready, deferred, createBranch,
createAgent and createGraph. Also turn the createGraph expression body
into a block body.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3800 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, expose factory methods to Java
```

opencode-acp:anthropic/claude-haiku-4-5:naive (20042 ms):
```
I need two pieces of information to write an accurate commit message:

1. **Branch name** - to determine if I should include the issue ID (the instructions say to only include it if the branch name contains it)
2. **Part number** - all recent commits in this series include a part number at the end

Could you provide these?
```

## intellij-community-16 (diff 5268 chars, git 4062 ms)

Actual:
```
fix [VCS]: Git log: second pressing of "delete branch" button logs an error IJPL-163588

Also fixes IJPL-257749
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2450 ms):
```
git: ignore repeated branch deletion requests
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3125 ms):
```
[git] Handle repeated branch deletion requests

Add filtering to skip deletion of branches that are already deleted,
and serialize deletion requests to prevent race conditions when the
"Delete" action is triggered multiple times before the UI updates.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2916 ms):
```
[git] Ignore repeated deletion of an already deleted branch

Deletion requests can arrive twice, for example when "Delete" is pressed
again before the UI has refreshed. The second request then failed on a
branch that no longer existed. Skip repositories where the local branch
is already gone, and serialize deletions in GitBrancherImpl so each one
sees the result of the previous one.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2921 ms):
```
[git] ignore repeated deletion requests for the same branch
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10913 ms):
```
[git] Handle repeated branch deletion requests

Deletion requests can pile up when the user presses delete multiple
times before the UI catches up with the previous operation. Filter
out repositories that no longer have the branch before attempting
deletion, and serialize deletion requests to ensure each sees the
previous result.
```

## intellij-community-17 (diff 6386 chars, git 368 ms)

Actual:
```
[plugin-manager] IJPL-257815 Keep selected rows below sticky headers after refresh

Refreshing plugin sources can replace the selected row and restore an
anchor that leaves the row behind the sticky header.

Reveal the selected row after anchor restoration when the old row was
visible. Leave offscreen selections in place. Add tests for both cases
and update the UI specification.
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2826 ms):
```
[plugin-manager] Reveal selected row replaced during source refresh
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3041 ms, the IDE drops IJPL-257815):
```
[plugin-manager] IJPL-257815 Reveal replaced selected row after source refresh

When a source refresh replaces a visible selected row, keep it visible below
the sticky header. However, do not scroll to reveal a replaced selected row
that is outside the current viewport.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2932 ms):
```
[plugin-manager] Reveal selected row when source refresh replaces it

When a repository refresh replaces the selected plugin row, the new row
could end up hidden behind the sticky header. Reveal it again if the
previous row was visible, and leave the viewport alone otherwise.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2998 ms, the IDE drops IJPL-257815):
```
[plugin-manager] IJPL-257815 Keep replaced selected rows visible after refresh
```

opencode-acp:anthropic/claude-haiku-4-5:naive (15188 ms):
```
[plugin-manager] Reveal replaced visible selected row on source refresh
```

## intellij-community-18 (diff 6986 chars, git 6756 ms)

Actual:
```
[java] IDEA-369985 SlowOp in GenerateToStringWorker.exitsMethodDialog
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2852 ms):
```
[java] Perform Generate toString conflict checks asynchronously
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3066 ms):
```
[java] Refactor GenerateToString to use non-blocking read actions

Move the method existence check to a background read action and delay
the conflict resolution dialog until the UI thread. This prevents
blocking the UI while searching for existing methods and aligns with
modern IntelliJ threading patterns.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3370 ms):
```
Make Generate toString run conflict lookup off the EDT

The existing-method lookup ran inside the write command on the EDT. Move
the lookup into a non-blocking read action on a background thread, then
show the conflict dialog and run the write on the EDT. Errors from
template evaluation are now reported via invokeLater so the hint shows
after the write context is left.

The completion test gets a second wait for async tasks, since the
action now finishes asynchronously.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2934 ms):
```
[JAVA] Generate toString asynchronously and wait for completion
```

opencode-acp:anthropic/claude-haiku-4-5:naive (16958 ms):
```
[java] refactor toString generation with async execution
```

## intellij-community-19 (diff 8020 chars, git 7420 ms)

Actual:
```
[Java. Tests] IDEA-394694 Fix project test leak in `com.intellij.java.codeInspection.GlobalInspectionContextTest`
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3566 ms):
```
[test framework] unregister HighlightDisplayKey once per tool
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (6251 ms):
```
[test framework] Register and unregister HighlightDisplayKey in configureInspections

Ensure that any HighlightDisplayKey entries created during inspection
configuration are properly cleaned up when the parent disposable is
disposed. Preserve pre-existing keys and keys registered by other code
during the configuration process. Add comprehensive tests to verify the
behavior in various scenarios including successful configuration, failed
configuration, and key replacement.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3841 ms):
```
[test framework] unregister inspection keys on configureInspections disposal

configureInspections() registers HighlightDisplayKey entries for each
tool but never removes them, so keys leak across tests. Remember which
keys were missing before configuration and unregister exactly those
when the parent disposable is disposed. Keys that already existed or
were replaced in the meantime are left alone.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2522 ms):
```
[test framework] unregister HighlightDisplayKey safely on disposal
```

opencode-acp:anthropic/claude-haiku-4-5:naive (16973 ms):
```
[test framework] unregister HighlightDisplayKey on disposal

Configured inspections now automatically clean up their
HighlightDisplayKey registrations when disposed. This prevents key
accumulation in tests and ensures proper cleanup even if
configuration fails.
```

## intellij-community-20 (diff 9108 chars, git 294 ms)

Actual:
```
KTIJ-40403 [kotlin] Offer remove question quick fix before callable references
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2793 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Fix removal of nullable callable reference qualifiers
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3449 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Handle whitespace and comments in callable reference static LHS fix

Improve the RemoveCallableReferenceStaticLhsFix to properly handle
question marks that are separated from the callable reference LHS by
whitespace or comments. Add helper functions to locate question mark
tokens before and after the callable reference expression, and add test
cases for these edge cases.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3027 ms):
```
Fix "Remove '?'" quick fix for nullable static LHS with comments or spaces

The question mark in `C?::foo` is not always a direct child of the
callable reference LHS when whitespace or comments separate it from the
LHS. Look up the '?' token in the surrounding siblings so the fix is
still offered in those cases.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3003 ms):
```
[kotlin] Fix callable reference nullable LHS quickfix with whitespace
```

opencode-acp:anthropic/claude-haiku-4-5:naive (15264 ms):
```
[kotlin] Improve nullable callable reference handling for spacing
```

## intellij-community-21 (diff 10486 chars, git 177 ms)

Actual:
```
[kotlin] inline: inline type parameters

- simplify type parameters processing

KTIJ-40432
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2801 ms):
```
[kotlin] inline: simplify CodeInliner analysis and type handling
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4275 ms):
```
[kotlin] inline: simplify CodeInliner by removing analysis permission decorators

Removed unnecessary `KaAllowAnalysisOnEdt` and `KaAllowAnalysisFromWriteAction`
annotations and their wrapping calls. Simplified `processTypeParameterUsages`
by making it a context function and eliminating lambda parameters, allowing
direct access to type information within the analysis session. Also removed
unused `getContextParameterExplicitArgument` function and simplified
`wrapCodeForSafeCall` analysis call.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3139 ms):
```
[kotlin] inline: drop EDT and write-action analysis permissions

Analysis in CodeInliner no longer needs allowAnalysisOnEdt or
allowAnalysisFromWriteAction wrappers. Type parameter usage handling is
merged into a single context-based function that runs under one analyze
session, and the context parameter lookup is inlined into its caller.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2756 ms):
```
[kotlin] inline: simplify CodeInliner analysis calls
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10895 ms):
```
[kotlin] inline: remove analysis permission annotations
```

## intellij-community-22 (diff 10986 chars, git 388 ms)

Actual:
```
[markdown] IJPL-257188 Support the Sticky Lines feature in Markdown


Merge-request: IJ-MR-227314
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2766 ms):
```
[markdown] Add sticky heading breadcrumbs for Markdown sections
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3268 ms):
```
[markdown] Implement sticky lines for Markdown headings in breadcrumbs

Add support for displaying Markdown headings as sticky lines in the
breadcrumbs panel. Each heading is pinned until the last line of its
section, allowing users to keep track of the document structure while
scrolling. The implementation uses the existing header folding regions
to determine section boundaries.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (4613 ms):
```
Add sticky line support for Markdown headings in breadcrumbs

Implement MarkdownFileBreadcrumbsCollector, which delegates crumbs to the
PSI collector and additionally reports each heading as a sticky line that
stays pinned until the last line of its section. Expose the header
regions visitor internally so the collector can reuse it, and scale the
live preview heading when it is painted as a sticky line so it fits the
single line height.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3144 ms):
```
[markdown] Support sticky lines for Markdown heading breadcrumbs
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12667 ms):
```
[markdown] Implement sticky lines for markdown section headers
```

## intellij-community-23 (diff 12992 chars, git 360 ms)

Actual:
```
[markdown] IJPL-257766 Support Setext headers in Markdown live preview


Merge-request: IJ-MR-227110
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2614 ms):
```
[markdown] Support Setext headings in Markdown live preview
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3784 ms):
```
[markdown] Support Setext headings in live preview

Add support for rendering Setext-style headings (with `===` or `---` underlines) in Markdown live preview, treating them equivalently to ATX headings. The underline is rendered as a horizontal rule, separate from the heading content.

Update heading spec generation to handle both ATX and Setext heading types, simplify Setext underline detection logic, and add comprehensive test coverage for Setext heading folding and rendering behavior.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2965 ms):
```
[markdown] Render Setext headings in Markdown live preview

Setext headings were left as plain text in live preview, and their
underline was painted by a code-span-only special case. Now the heading
text is rendered as a heading like ATX headings, and the underline is
drawn as a horizontal rule whenever it belongs to a heading.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (4929 ms):
```
[markdown] Support Setext headings in Markdown live preview
```

opencode-acp:anthropic/claude-haiku-4-5:naive (13350 ms):
```
[markdown] Support Setext headings in live preview
```

## intellij-community-24 (diff 14987 chars, git 8582 ms)

Actual:
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3010 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2812 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (2553 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2752 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

opencode-acp:anthropic/claude-haiku-4-5:naive (10994 ms):
```
[Java. Tests] move com.intellij.find to com.intellij.java.find
```

## intellij-community-25 (diff 16602 chars, git 8077 ms)

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

opencode-acp:openai/gpt-5.6-luna:lean:low (2679 ms):
```
refactoring air: make process probes hermetic in observation tests
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3587 ms):
```
refactor [air]: add a fake process table to hermetic suites

A runner can now probe a fake process table instead of the host, making
suites fully hermetic. Added `ProcessTable` trait and `FakeProcesses`
implementation, and updated observation tests to use fake processes
instead of the suite's own pid.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3373 ms):
```
refactoring air: fake the host process table in observe tests

The observation fixture probed the suite's own pid, so readiness
depended on the host's process list. It now gives the runner a fake
process table, so a ready worker reads as running on any host.

Adds ProcessTable to avl-host-sys, which a runner can be given in
place of the host. Overrides drop the table, so a suite that rebuilds
its environment still answers from the host by default.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2731 ms):
```
refactoring air: make process probes hermetic in host test fixtures
```

opencode-acp:anthropic/claude-haiku-4-5:naive (17814 ms):
```
refactoring air: introduce ProcessTable for hermetic tests

Add a ProcessTable trait allowing runners to query a fake process
table instead of the host. Implement FakeProcesses for test suites to
make fixtures hermetic: tests no longer depend on host processes.
Update the observer test fixture to use fake processes so the
readiness gate works without running actual commands.
```

## intellij-community-26 (diff 22415 chars, git 8608 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, rename, part3
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2826 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (4641 ms):
```
[editor] refactor: rename DocTextBranch to DocBranch

Rename the interface and implementation classes to use the shorter,
more concise name. Update all references in tests and code that use
this API.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3210 ms):
```
[editor] Rename DocTextBranch to DocBranch

The interface, its implementation, and the tests are renamed to drop the
"Text" infix. The branch is a versioned document, not a text value, and
DocText already names the materialized text.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2995 ms):
```
[editor] rename DocTextBranch to DocBranch
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12482 ms):
```
refactoring [platform]: rename DocTextBranch to DocBranch
```

## intellij-community-27 (diff 27722 chars, git 152 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, DAG pretty printer, part19
```

opencode-acp:openai/gpt-5.6-luna:lean:low (4870 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, event graph diagram, part18
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (6486 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram, part18
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (5453 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text diagram of event graph

Add EventGraphDiagram, which renders an EventGraphImpl as a box diagram
from toString(), so a failing graph can be read in a log. Runs are laid
out by depth, joined by connectors, and the output is bounded by
trimming the middle of long histories and capping concurrent boxes per
row.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (4620 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 event graph diagram, part18
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12597 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram rendering, part18
```

## intellij-community-28 (diff 41351 chars, git 425 ms)

Actual:
```
IJPL-252267 Add UI for editing default excludes
```

opencode-acp:openai/gpt-5.6-luna:lean:low (2857 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default exclusions settings
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (3613 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add settings for default .analysisignore exclusions

Allow users to customize the default exclusions for projects without a
.analysisignore file. Add a new settings tab to edit the default lines,
persist customizations, and sync them across the application. Update
the default entity patterns when lines change.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3252 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default .analysisignore exclusions editable in settings

The default exclusions of a project root without an .analysisignore file
were a fixed list. Store them in application settings and show them in a
new "Default Exclusions" tab of the File Types settings, so users can edit
them. Changes are applied to the existing default entities at once.

Unsupported lines are dropped on save, and the built-in list is stored as
an empty state so that a later product version can change its defaults.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3303 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default exclusions settings
```

opencode-acp:anthropic/claude-haiku-4-5:naive (12196 ms, the IDE drops IJPL-257500):
```
IJPL-257500 Make .analysisignore default exclusions editable

Add AnalysisIgnoreDefaultsSettings to store user-edited default
exclusions. Allow users to customize default patterns through the File
Types settings instead of requiring file edits. Update
AnalysisIgnoreService to sync default entities when lines change. Extend
IgnoredFilesAndFoldersPanel with configurable validation to support
editing both file type ignore patterns and analysis ignore defaults.
```

## intellij-community-29 (diff 59619 chars, git 10625 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, run-length encode, part2
```

opencode-acp:openai/gpt-5.6-luna:lean:low (3403 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, part2: run-length encode events
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (5999 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, part 2: run-length encode events

Events now cover multiple characters as runs, with ids spanning ranges.
The replay still tracks one unit per character, but the storage and merge
logic work at the run level, reducing graph size for large documents.

Run boundaries are preserved exactly as created; adjacent runs never
coalesce. This enables clean merges across different encodings of the
same units: a partly known run can be split and completed.
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3928 ms):
```
[editor] Run-length encode Eg-walker event graph

Store one event per insert or delete run instead of one per character.
Each run covers a range of lvs and seqs, and the graph keeps a per-agent
index of seq ranges. Merging a run that is partly known appends only its
unknown suffix.

The replay still works per character, so the run encoding does not yet
speed up document rebuilds. Typing a fragment or deleting a range now
appends a single graph entry.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (2938 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 run-length encode event graph events
```

opencode-acp:anthropic/claude-haiku-4-5:naive (19676 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 eg-walker: run-length encode events

Replace per-character event storage with run-length encoding: one Event
now covers multiple consecutive characters with ids spanning (agent, seq)
to (agent, seq + length - 1). This significantly reduces memory for
documents with large insertions or deletions.

Replay still processes one unit per character; coalescing runs and
per-unit optimization are follow-ups.

Event API changes: Insert.character() → content() returning the full
run; Delete gains required length parameter.
```

## intellij-community-30 (diff 99790 chars, truncated, git 175 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, move offset, part51
```

opencode-acp:openai/gpt-5.6-luna:lean:low (4017 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

opencode-acp:anthropic/claude-haiku-4-5:lean:default (2953 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

opencode-acp:anthropic/claude-haiku-5-5:lean:low (3067 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51

The recent messages follow the same pattern. The branch name is not given, so no issue id is added beyond the one in the recent commits, which is the established series prefix.
```

opencode-acp:openai/gpt-5.6-luna:naive:low (3211 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

opencode-acp:anthropic/claude-haiku-4-5:naive (19173 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```
