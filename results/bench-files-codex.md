# bench-files-codex

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | tool calls | cost $ |
|---|---|---|---|---|---|---|---|---|---|
| claude:haiku:safe | 35/35 | 2835 | 8208 | 9725 | 0 | 89 | 0 | - | 0.0191 |
| claude:haiku:safe+files | 35/35 | 8394 | 37603 | 73249 | 62235 | 763 | 0 | 4.1 | 0.0320 |
| claude:claude-haiku-5-5:safe:low | 35/35 | 2121 | 4805 | 12488 | 787 | 88 | 0 | - | 0.0955 |
| claude:claude-haiku-5-5:safe:low+files | 35/35 | 3831 | 8373 | 26230 | 18593 | 360 | 92 | 1.2 | 0.0720 |
| codex:gpt-5.6-luna:lean:low | 35/35 | 2397 | 3643 | 9571 | 0 | 16 | 1 | - | - |
| codex:gpt-5.6-luna:lean:low+files | 35/35 | 5216 | 12594 | 18699 | 9298 | 221 | 79 | 1.5 | - |

## codex-1 (diff 688 chars, git 509 ms)

Actual:
```
Skip postprocessing for short composer input (#39744)

## What changed

Return the initial wrapping ranges directly when the composer input produces a
single line and its byte length is less than the available width. This avoids
the additional grapheme and word-boundary pass for input that cannot wrap.

GitOrigin-RevId: 55d990a354fcc61e9a90d5796b4b39d16742cc50
```

claude:haiku:safe (2172 ms):
```
Fix composer wrapping for short text with zero-width edge case

The wrapping logic was incorrectly handling short text that fits within
the display width. When text length is less than width, it should
return early with the single wrapped line rather than attempting
additional wrapping logic that assumes multi-line output.
```

claude:haiku:safe+files (8674 ms):
```
Avoid redundant wrapping when text fits in single line

Skip expensive wrapping processing when a single wrapped line
contains text that fits entirely within the width. This prevents
unnecessary computation for content that requires no wrapping.
```
Tools: `git diff --cached`, `git log --oneline -20`, `git rev-parse --abbrev-ref HEAD`, `Read codex-rs/tui/src/bottom_pane/textarea/wrapping.rs`

claude:claude-haiku-5-5:safe:low (1838 ms):
```
Fix early return in composer wrapping for short single lines
```

claude:claude-haiku-5-5:safe:low+files (3456 ms):
```
Skip wrap fixup for composer text that fits on one line
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2224 ms):
```
Preserve unwrapped composer text under the available width
```

codex:gpt-5.6-luna:lean:low+files (6357 ms):
```
Preserve short composer text on a single line
```
Tools: `git diff --cached -- codex-rs/tui/src/bottom_pane/textarea/wrapping.rs`, `/bin/zsh -lc "sed -n '1,110p' codex-rs/tui/src/bottom_pane/textarea/wrapping.rs"`

## codex-2 (diff 1343 chars, git 331 ms)

Actual:
```
Use default timeouts in cyber exec policy tests (#39496)

## What changed

Stop setting explicit one-second `timeout_ms` and `yield_time_ms` values in the
mock command calls. The shell command and unified exec variants now use their
default timing behavior while testing cyber exec policy.

GitOrigin-RevId: b1c25304ca47e7b08f023fe678467fc00330158b
```

claude:haiku:safe (2237 ms):
```
Simplify cyber exec policy test by removing unused timeout keys

The test was setting timeout values (timeout_ms for ShellCommand and
yield_time_ms for UnifiedExec) that weren't being used. Remove the
timeout_key from the match statement and the corresponding assignment
to clean up the test code.
```

claude:haiku:safe+files (3827 ms):
```
Remove timeout configuration from cyber exec policy test

Simplify command response by removing timeout_ms and yield_time_ms
fields from the test command tool responses.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1786 ms):
```
Remove unused timeout args from cyber exec policy test
```

claude:claude-haiku-5-5:safe:low+files (3359 ms):
```
Drop unused timeout args from cyber exec policy test

The test built timeout arguments for both command tools, but the
cyber policy checks only care about the command and prefix rule.
Remove the extra timeout fields so the fixture matches what the
test actually exercises.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2307 ms):
```
Remove timeout parameters from cyber exec policy tests
```

codex:gpt-5.6-luna:lean:low+files (4359 ms):
```
Remove timeout fields from cyber exec policy tests
```
Tools: `git diff --cached -- codex-rs/core/tests/suite/cyber_exec_policy.rs`

## codex-3 (diff 1926 chars, git 149 ms)

Actual:
```
Isolate IPC in Bubblewrap sandboxes (#39586)

## What changed

- Pass `--unshare-ipc` when building Bubblewrap arguments for both restricted-filesystem and full-filesystem sandbox paths.
- Update the Bubblewrap argument tests to cover the new namespace flag.

GitOrigin-RevId: 61fb1d5150d09626a3b6ee7a9c6a508108c52e80
```

claude:haiku:safe (2003 ms):
```
Unshare IPC namespace in Linux sandbox processes

Add `--unshare-ipc` flag to Bubblewrap invocations to isolate the
inter-process communication namespace, further restricting sandboxed
process capabilities and improving security isolation.
```

claude:haiku:safe+files (8394 ms):
```
Add IPC namespace isolation to Linux sandbox bubblewrap processes

Isolate IPC namespaces for both full-filesystem and minimal-filesystem
sandbox configurations to improve process isolation and security.
```
Tools: `git status`, `git diff --cached`, `git log --oneline -10`

claude:claude-haiku-5-5:safe:low (2108 ms):
```
Isolate Linux bwrap sandboxes from host IPC namespace

Add --unshare-ipc to both full-filesystem and default bubblewrap
argument builders so sandboxed processes cannot reach System V IPC
objects or POSIX message queues shared with the host.
```

claude:claude-haiku-5-5:safe:low+files (2964 ms):
```
Isolate IPC namespace in Linux bubblewrap sandbox

Unshare the SysV IPC and POSIX message queue namespace so sandboxed
commands cannot reach IPC objects shared with the host or other
sandboxes.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2335 ms):
```
Unshare IPC namespaces in Linux sandboxes
```

codex:gpt-5.6-luna:lean:low+files (3899 ms):
```
Isolate Linux sandbox IPC namespaces
```
Tools: `/bin/zsh -lc "git diff --cached -- codex-rs/linux-sandbox/src/bwrap.rs codex-rs/linux-sandbox/src/linux_run_main_tests.r`

## codex-4 (diff 2532 chars, git 276 ms)

Actual:
```
Prevent Node REPL auth tokens from reaching child processes (#39301)

## What changed

- Add `NODE_REPL_AUTH_TOKEN` to the environment variables that model-reachable child processes cannot inherit.
- Remove the variable case-insensitively after shell environment policy overrides and from explicitly configured child command environments.
- Extend the environment scrubber tests to cover inherited and configured forms of the token.

GitOrigin-RevId: 716c65e0a9e222f705c226b7c86545251d3ea580
```

claude:haiku:safe (1598 ms):
```
Prevent Node REPL auth tokens from reaching child processes
```

claude:haiku:safe+files (3351 ms):
```
Prevent Node REPL auth tokens from reaching child processes (#38941)

Add NODE_REPL_AUTH_TOKEN to the list of non-inheritable
environment variables to prevent sensitive authentication tokens
from reaching child processes.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1959 ms):
```
Add NODE_REPL_AUTH_TOKEN to non-inheritable env vars

Keep the Node REPL auth token out of model-reachable child
processes, matching the other auth and identity variables in
NON_INHERITABLE_ENV_VARS.
```

claude:claude-haiku-5-5:safe:low+files (3177 ms):
```
Prevent Node REPL auth token from reaching child processes

The Node REPL auth token was inherited by model-reachable child
processes. Add it to the non-inheritable list so it is scrubbed the
same way as the other auth and identity variables.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2348 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

codex:gpt-5.6-luna:lean:low+files (3750 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```
Tools: `git diff --cached`

## codex-5 (diff 3321 chars, git 93 ms)

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

claude:haiku:safe (2116 ms):
```
Increase MCP tool name length limit from 64 to 128 bytes

Update the maximum tool name length constraint to align with the
Responses API specification. Add a test to verify tool names respect
the new boundary at 128 bytes, and update existing tests to reflect
the increased limit.
```

claude:haiku:safe+files (4905 ms):
```
Increase MCP tool name length limit to 128 bytes

Update the maximum allowed length for model-visible MCP tool names from
64 to 128 bytes to provide more flexibility for tool naming. Update
tests to validate the new boundary behavior.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2470 ms):
```
Raise MCP tool name limit from 64 to 128 bytes

The Responses API accepts longer function names than the 64-byte
limit we enforced, so long MCP tool names were hashed and truncated
without need. Raise the limit to 128 and update the length-boundary
tests to cover the exact edges.
```

claude:claude-haiku-5-5:safe:low+files (3420 ms):
```
Raise MCP model tool name limit to 128 bytes

Model-visible MCP tool names were capped at 64 bytes, which forced
long tool names to be hashed and made them hard to recognize. The
Responses API accepts 128, so raise the limit and update the tests
that depended on the old boundary.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2517 ms):
```
Increase MCP model-visible tool name limit to 128 bytes

Update normalization tests to cover 128-byte Responses API boundaries.
```

codex:gpt-5.6-luna:lean:low+files (5243 ms):
```
Allow MCP tool names up to 128 characters
```
Tools: `git diff --cached -- codex-rs/codex-mcp/src/connection_manager_tests.rs codex-rs/codex-mcp/src/tools.rs && git branch --`

## codex-6 (diff 4055 chars, git 93 ms)

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

claude:haiku:safe (2288 ms):
```
Preserve Windows sandbox proxy settings for Guardian internal sessions

Guardian internal sessions should maintain their proxy settings rather than
reconciling them. This prevents unwanted proxy configuration changes when
Guardian reviewers spawn within a parent session context.
```

claude:haiku:safe+files (4231 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Guardian internal sessions should preserve proxy settings rather than
reconciling them, so check the session source and set the appropriate
sandbox proxy settings mode when spawning sessions.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1822 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Internal Guardian sessions keep the proxy settings mode from their
parent instead of reconciling them, so the reviewer does not rewrite
sandbox proxy state shared with the parent thread.
```

claude:claude-haiku-5-5:safe:low+files (3125 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Guardian internal sessions should not reconcile proxy settings at
startup, so they keep the Windows sandbox proxy configuration they
inherit. Other session sources still reconcile as before.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2493 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Add coverage to verify Guardian sessions preserve existing proxy settings while
normal sessions continue to reconcile them.
```

codex:gpt-5.6-luna:lean:low+files (4251 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions
```
Tools: `git diff --cached -- codex-rs/core/src/thread_manager.rs codex-rs/core/src/thread_manager_tests.rs`

## codex-7 (diff 5251 chars, git 88 ms)

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

claude:haiku:safe (2636 ms):
```
Move text serialization test to code-mode-runtime unit tests

Move the text helper serialization test from the integration test
suite to the code-mode-runtime service tests where it can run without
network dependencies. Also remove two image helper tests that are now
redundant with the unified image budget implementation.
```

claude:haiku:safe+files (7337 ms):
```
Move text serialization tests to code-mode-runtime unit tests

Migrate text helper serialization tests from the core integration
test suite to the code-mode-runtime service tests for better test
organization and isolation.
```
Tools: `git diff --cached`, `git log --oneline -5`

claude:claude-haiku-5-5:safe:low (1652 ms):
```
Move the serialized text helper test into the code-mode runtime
```

claude:claude-haiku-5-5:safe:low+files (3587 ms):
```
Move code mode helper tests to the runtime crate

The text and image helper checks lived in the core integration suite,
which exercises the full turn loop. The same behavior is covered more
directly by the code-mode runtime tests, so the text helper case is
moved there and the redundant image helper integration tests are
dropped.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2281 ms):
```
Move text helper serialization test to runtime suite
```

codex:gpt-5.6-luna:lean:low+files (5406 ms):
```
Move code mode text helper coverage into runtime tests
```
Tools: `git diff --cached -- codex-rs/code-mode-runtime/src/service_tests.rs codex-rs/core/tests/suite/code_mode.rs && git branc`

## codex-8 (diff 5608 chars, git 157 ms)

Actual:
```
Use in-process parsing for PowerShell command classification (#39602)

## What changed

- Route PowerShell wrapper extraction and Windows safe-command classification through the tree-sitter lowerer.
- Compile the PowerShell AST subprocess parser only in tests, where it remains available as an oracle.

GitOrigin-RevId: 3690bc32e8987ac9de820ef39ff7401d98ea8d83
```

claude:haiku:safe (2417 ms):
```
Remove PowerShell AST parser from production command classification

The AST parser is now only used as a test oracle. Production code uses
the Tree-sitter-based lowerer exclusively. This simplifies the safety
logic and removes the executable-specific parsing distinction.
```

claude:haiku:safe+files (7215 ms):
```
Replace PowerShell AST parser with Tree-sitter in Windows safety checks

Remove the PowerShell AST parser from production command classification
and consolidate on the Tree-sitter-based parser for consistent PowerShell
script analysis. Keep the AST parser available as a test oracle only.
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2121 ms):
```
Switch PowerShell command parsing to the in-process Tree-sitter lowerer

The subprocess-based PowerShell AST parser is no longer used by the
safe-command checks or the plain-command extraction. Both now call the
Tree-sitter lowerer directly, and the subprocess parser is kept only as
a test oracle.
```

claude:claude-haiku-5-5:safe:low+files (3288 ms):
```
Use in-process PowerShell lowering for command safety

Stop spawning a PowerShell subprocess to parse inline scripts. Route
Windows safe-command checks and plain-command extraction through the
Tree-sitter lowerer, and keep the subprocess parser only as a test
oracle. This drops the dependency on the invoked PowerShell variant, so
the same script classifies the same way on every host.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2347 ms):
```
Use Tree-sitter PowerShell lowering for command safety classification
```

codex:gpt-5.6-luna:lean:low+files (4455 ms):
```
Use Tree-sitter parser for PowerShell command safety
```
Tools: `git diff --cached`

## codex-9 (diff 6246 chars, git 187 ms)

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

claude:haiku:safe (2708 ms):
```
Preserve numeric and string bounds in reserved tool schemas

Reserved tools like history and notes have parameter constraints that
must be retained in the model request to ensure correct tool usage.
Add support for preserving minimum, maximum, and maxLength attributes
in JSON schemas, and update type inference to recognize maxLength as
a string type indicator.
```

claude:haiku:safe+files (5134 ms):
```
Preserve numeric and string bounds in tool input schemas

Add minimum, maximum, and maxLength fields to JsonSchema struct to
preserve parameter constraints for reserved tools like history and
notes. Update schema sanitization to recognize maxLength as a string
type indicator. Add tests verifying bounds are preserved during
serialization and deserialization of tool input schemas.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1916 ms):
```
Preserve bounds and maxLength in tool input schemas

Keep minimum, maximum, and maxLength in parsed tool schemas so that
reserved history and notes tools retain their parameter constraints in
the model request. Infer string type from maxLength during
normalization.
```

claude:claude-haiku-5-5:safe:low+files (3792 ms):
```
Preserve bounds in tool input schemas

Schema parsing dropped minimum, maximum, and maxLength, so the history
and notes tool limits never reached the model. Keep these keywords
through parsing and serialization, and infer a string type when only
maxLength is present.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2317 ms):
```
Preserve bounds in reserved tool schemas
```

codex:gpt-5.6-luna:lean:low+files (4201 ms):
```
Preserve parameter bounds in tool schemas

Add numeric and string bounds to reserved tool declarations and verify
they survive schema parsing and serialization.
```
Tools: `git diff --cached`

## codex-10 (diff 7093 chars, git 99 ms)

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

claude:haiku:safe (2703 ms):
```
Handle RFC 6749 invalid_grant as permanent refresh token failure

Treat invalid_grant error code with 400 status as a permanent token
failure. RFC 6749 reports unusable refresh tokens as invalid_grant
without preserving the legacy expired/reused/revoked subtype, so we
must treat it as terminal rather than retrying.

Add tests to verify standard invalid_grant failures do not retry while
other bad request errors remain transient.
```

claude:haiku:safe+files (7961 ms):
```
Classify RFC 6749 invalid_grant as permanent token refresh failure

Handle the standard invalid_grant error code per RFC 6749, which omits
legacy refresh token failure subtypes. Treat invalid_grant with a 400
BAD_REQUEST status as a permanent failure to avoid unnecessary retries.
Other 400 errors continue to be treated as transient. Add tests to
distinguish permanent invalid_grant from other bad request failures.
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (1940 ms):
```
Classify invalid_grant token refresh failures as permanent

Treat HTTP 400 responses with error "invalid_grant" as a permanent
refresh failure, so the stored refresh token is not retried. Other
400 responses stay transient and are not cached.
```

claude:claude-haiku-5-5:safe:low+files (3350 ms):
```
Treat standard invalid_grant refresh errors as permanent

The refresh endpoint can return the RFC 6749 invalid_grant error for an
unusable refresh token. That code was not recognized, so Codex retried
the refresh on every call instead of stopping. Classify a 400 with
invalid_grant as a permanent failure with the generic reason, and keep
other 400 responses retryable.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2493 ms):
```
Handle standard invalid_grant refresh failures as permanent
```

codex:gpt-5.6-luna:lean:low+files (4202 ms):
```
Handle standard invalid_grant refresh failures
```
Tools: `git diff --cached -- codex-rs/login/src/auth/manager.rs codex-rs/login/tests/suite/auth_refresh.rs && git status --short`

## codex-11 (diff 8342 chars, git 87 ms)

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

claude:haiku:safe (2657 ms):
```
Preserve Guardian denial outcomes in MCP elicitation

Update MCP elicitation to handle Guardian denial and cancellation
responses as valid review outcomes. Guardian can now communicate
specific denial rationales that are preserved through the elicitation
flow, and strict auto-review accepts decline and cancel actions in
addition to accepts. This allows Guardian to communicate risk
assessments and policy violations to the user with structured
reasoning.
```

claude:haiku:safe+files (5366 ms):
```
Preserve Guardian denials and cancellations in MCP elicitation

Update the elicitation flow to recognize and propagate Guardian denials
and cancellations as valid auto-review outcomes, with explicit rationale
messages. Clarify the strict auto-review decline message to emphasize
the requirement for explicit user approval.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2068 ms):
```
Guardian review outcomes now surface as MCP elicitation responses

Guardian denials, timeouts, and aborts are passed back to the MCP
server as decline or cancel responses carrying the guardian rationale,
instead of being dropped. The strict auto-review decline message is
reworded to ask for explicit user approval.
```

claude:claude-haiku-5-5:safe:low+files (3046 ms):
```
Preserve Guardian denials for MCP elicitations

Strict auto-review dropped Guardian decline and cancel responses that
carried no content, so the request fell back to a generic message.
Forward those decisions with the reviewer's rationale and keep the
generic decline only when no canonical decision exists.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2319 ms):
```
Preserve Guardian denial and cancellation responses in MCP elicitation
```

codex:gpt-5.6-luna:lean:low+files (4743 ms):
```
Preserve Guardian denials for MCP elicitation requests
```
Tools: `git diff --cached`

## codex-12 (diff 9370 chars, git 91 ms)

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

claude:haiku:safe (2887 ms):
```
Allow provider auth command to recover after initial resolution failure

When a provider auth command fails initially, the auth manager now retries
resolving the external auth after an unauthorized response, rather than
treating the initial failure as permanent. This enables recovery scenarios
where the command may have transient issues.

The change also simplifies the refresh logic to handle cases where no auth
is cached, treating it the same as non-refreshable auth types.
```

claude:haiku:safe+files (6419 ms):
```
Fix auth recovery when external provider command fails initially
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2235 ms):
```
Recover external bearer auth refresh after initial command failure

The unauthorized recovery path only handled external API-key auth. A provider auth command that failed on the first resolution left the manager with no cached auth, so a 401 could not trigger a refresh. Allow recovery for external auth when no token is cached yet, and retry the command from the 401 path.
```

claude:claude-haiku-5-5:safe:low+files (3291 ms):
```
Retry external auth recovery after initial resolution failure

When the provider auth command fails at startup, no auth is cached.
Recovery was only enabled for cached API-key auth, so a 401 never
triggered a retry and the command was never re-run. Allow recovery
when no auth is cached yet, so the command is re-run on the next
unauthorized response.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2323 ms):
```
Retry external auth recovery after initial resolution failure
```

codex:gpt-5.6-luna:lean:low+files (4445 ms):
```
Retry external auth after initial resolution failure
```
Tools: `git diff --cached`

## codex-13 (diff 10844 chars, git 88 ms)

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

claude:haiku:safe (2526 ms):
```
Add stable IDs to Responses Lite prefix items for retry and session resumption

Prefix items (additional tools and base instructions) in Responses Lite
requests are rebuilt on every request. To preserve their identity across
retries and resumed sessions, generate stable IDs derived from the thread
ID and item payload. This ensures consistent tracing and server-side
deduplication.
```

claude:haiku:safe+files (8101 ms):
```
Assign deterministic IDs to Responses Lite prefix items

Prompt-only items (additional_tools and base_instructions) are rebuilt
on every request. Hash their visible payloads within the thread so
retries and resumed sessions preserve their identity.
```
Tools: `git diff --cached`, `git symbolic-ref --short HEAD`

claude:claude-haiku-5-5:safe:low (1676 ms):
```
Make Responses Lite prefix items stable across requests
```

claude:claude-haiku-5-5:safe:low+files (3077 ms):
```
Give Responses Lite prompt items stable IDs

Responses Lite rebuilds the additional-tools and base-instructions items
on every request. Derive their IDs from the thread and payload so retries
and resumed sessions send identical items, which keeps incremental
websocket requests on the same prefix.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2838 ms):
```
Preserve Responses Lite prefix item identities across requests
```

codex:gpt-5.6-luna:lean:low+files (4503 ms):
```
Preserve Responses Lite prefix item IDs across requests
```
Tools: `git diff --cached`

## codex-14 (diff 12306 chars, git 86 ms)

Actual:
```
Move relay helpers into exec-server test support (#40712)

## What changed

- Move the reusable WebSocket relay, registration, frame capture, and encryption assertion helpers into `codex-exec-server-test-support`.
- Re-export the helpers from the existing relay test module so its callers keep the same interface.
- Add the Cargo dependencies and Bazel proto compile data required by the shared support module.

GitOrigin-RevId: 0383149c79ef86cb5e64a09baec41332f9eec4c6
```

claude:haiku:safe (2240 ms):
```
Extract relay test utilities into a shared support crate

Move WebSocket relay helper functions from the common test module into
a dedicated test support library. This allows other tests to reuse relay
testing utilities without duplicating code.
```

claude:haiku:safe+files (4747 ms):
```
Extract relay test utilities into dedicated support crate

Move relay proxy functions and constants from the common test module
into a new test support library to enable reuse across multiple tests.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1591 ms):
```
Move exec-server relay test helpers into shared test support crate
```

claude:claude-haiku-5-5:safe:low+files (3328 ms):
```
Move exec-server relay test helpers into support crate
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2477 ms):
```
Extract relay test helpers into shared support crate
```

codex:gpt-5.6-luna:lean:low+files (4708 ms):
```
Extract relay test helpers into shared support crate
```
Tools: `git diff --cached -- codex-rs/exec-server/tests/support/relay.rs codex-rs/exec-server/tests/common/relay.rs codex-rs/exe`

## codex-15 (diff 13298 chars, git 87 ms)

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

claude:haiku:safe (2844 ms):
```
Persist Windows sandbox override in turn environment

Reconcile turn-wide sandbox configuration with TurnEnvironment so
the Windows sandbox level override is sourced consistently from the
turn environment rather than directly from TurnContext. This ensures
the override is retained when restoring thread settings and matches
the environment that will execute operations.

Remove stale TODOs that are now resolved by this change, and add a
test verifying the Windows sandbox override persists through resume.
```

claude:haiku:safe+files (6740 ms):
```
Consolidate sandbox context access through TurnEnvironment

Use TurnEnvironment to retrieve sandbox configuration settings
instead of accessing them directly from TurnContext or turn_ctx.config,
eliminating the TODO comments and reconciling backend selection with
the environment-scoped sandbox context. Include windows_sandbox_level
in restored settings to preserve runtime overrides across resume.
```
Tools: `git diff --cached`, `git log --oneline -10`

claude:claude-haiku-5-5:safe:low (2047 ms):
```
Reconcile turn environment settings for Windows sandbox and config

The sandbox backend choice and related settings were read from the
turn context. Read them from the selected turn environment's config
instead, and restore the Windows sandbox override on resume.
```

claude:claude-haiku-5-5:safe:low+files (4201 ms):
```
Use turn environment sandbox config for sandbox decisions

Sandbox backend selection, Windows sandbox level, and legacy Landlock
flags were read from turn-wide settings, which can differ from the
selected environment's config. Read them from the turn environment so
approval, execution, and escalation use the same sandbox that will run
the command.

Restore the Windows sandbox override when resuming a thread, and include
it in restorable settings, so resumed sessions keep the override.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2397 ms):
```
Use turn environment settings for sandbox execution
```

codex:gpt-5.6-luna:lean:low+files (5349 ms):
```
Use turn environment settings for sandbox execution

Ensure sandbox behavior and restored thread settings use the selected
turn environment, including Windows sandbox overrides.
```
Tools: `git diff --cached`

## codex-16 (diff 15161 chars, git 96 ms)

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

claude:haiku:safe (2449 ms):
```
Track built-in collab tool calls in analytics

Add tracking for multi-agent spawn operations by capturing tool call
lifecycle events. This includes recording both successful spawns and
failures with relevant metadata like agent state and execution duration.

Also fix subagent tool call deduplication to prevent counting duplicate
notifications for the same tool invocation.
```

claude:haiku:safe+files (7646 ms):
```
Track spawn_agent tool calls in analytics with timing and status

Add analytics tracking for multi-agent v2 spawn_agent tool calls by
recording ItemStarted and ItemCompleted notifications through a new
track_collab_tool_call method. Include execution duration, status,
receiver thread IDs, and agent state metadata. Prevent duplicate
counts of subagent tool calls by tracking unique IDs.
```
Tools: `git diff --cached`, `git log --oneline -10`

claude:claude-haiku-5-5:safe:low (2313 ms):
```
Track collab spawn_agent calls as analytics tool-call items

Emit ItemStarted/ItemCompleted notifications for multi-agent v2
spawn_agent calls so analytics records them as collab tool calls,
including failed spawns. Deduplicate subagent tool calls per turn by
item id so a call is counted once, and report execution duration for
tool items.
```

claude:claude-haiku-5-5:safe:low+files (3775 ms):
```
Track multi-agent v2 spawn_agent calls in analytics

Spawn calls were not reported as collab tool calls, so subagent usage
was undercounted. Emit started and completed items for spawn_agent
and report its execution duration.

Also count each subagent tool call id only once per turn, so the
started and completed notifications for the same call are not counted
twice.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2369 ms):
```
Track multi-agent tool calls in analytics
```

codex:gpt-5.6-luna:lean:low+files (4429 ms):
```
Track multi-agent spawn calls in analytics
```
Tools: `git diff --cached -- codex-rs/analytics/src/client.rs codex-rs/analytics/src/reducer.rs codex-rs/app-server/tests/suite/`

## codex-17 (diff 17587 chars, git 111 ms)

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

claude:haiku:safe (3910 ms):
```
Implement scrollback strategy abstraction for terminal-safe viewport growth

Refactor viewport growth and history insertion to use a new ScrollbackStrategy
enum that detects the terminal type and applies appropriate techniques:

- Standard terminals use DEC scroll regions for efficiency
- Windows Terminal uses full-screen scrolling to preserve scrollback
- Zellij uses full-screen insertion for terminal-wrapped history only

This abstraction replaces the boolean `is_zellij` flag with a more flexible
strategy pattern, enabling support for Windows Terminal's partial scroll region
limitations while maintaining compatibility with existing terminals.
```

claude:haiku:safe+files (9913 ms):
```
Preserve scrollback with full-screen history insertion for Windows Terminal

Abstract terminal scrollback strategies into a dedicated module to handle
terminal-specific requirements. Windows Terminal needs full-screen
insertion to preserve native scrollback when partial scroll regions
discard rows. Rename ZellijRaw to FullScreen to reflect its broader use
for terminals where partial scroll regions are unreliable.
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2331 ms):
```
TUI: Add full-screen scrollback strategy for Windows Terminal

Windows Terminal drops rows when a partial DEC scroll region is used
to grow the inline viewport or insert history. Route those writes
through a new ScrollbackStrategy that scrolls the whole screen
instead, and select it for Windows Terminal and WT_SESSION hosts.

Zellij keeps its existing raw-history path for terminal-wrapped lines.
```

claude:claude-haiku-5-5:safe:low+files (3971 ms):
```
Preserve Windows Terminal scrollback when growing the TUI viewport

Partial DEC scroll regions can drop rows in Windows Terminal instead of
moving them into scrollback. Route viewport growth and history insertion
through a full-screen scroll on Windows Terminal, and centralize the
choice in a ScrollbackStrategy that replaces the Zellij-only flag.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2380 ms):
```
Preserve TUI scrollback in Windows Terminal and Zellij
```

codex:gpt-5.6-luna:lean:low+files (5121 ms):
```
Preserve TUI scrollback in Windows Terminal
```
Tools: `git diff --cached -- codex-rs/tui/src/insert_history.rs codex-rs/tui/src/tui.rs codex-rs/tui/src/tui/history_tail.rs cod`

## codex-18 (diff 18883 chars, git 87 ms)

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

claude:haiku:safe (2835 ms):
```
Propagate executor temporary directories through environment selection

Add temporary_directories field to track executor-reported default directories
used to resolve `:tmpdir` policy entries. Thread this information from remote
environment info and local environment defaults through environment resolution,
turn environments, and sandbox contexts. Extract local temporary directory
detection into a reusable function to avoid duplication.
```

claude:haiku:safe+files (7927 ms):
```
Expose environment temporary directories for sandbox policy (#40659)

Separate local temporary directory discovery from general environment
info so orchestrators can resolve `:tmpdir` policy entries. Thread
temporary directories from both local and remote environments through
turn context and into sandbox contexts, exposing them via a new
`FileSystemSandboxPolicyContext` type for policy interpretation.
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2121 ms):
```
Carry temporary directories through executor filesystem context

Cache executor temporary directories on turn environments and pass them
in sandbox contexts so `:tmpdir` policy entries resolve against the
selected executor rather than the orchestrator.
```

claude:claude-haiku-5-5:safe:low+files (4113 ms):
```
Carry executor temporary directories in sandbox contexts

Cache each environment's temporary directories when it is resolved and
pass them with the filesystem sandbox context, so `:tmpdir` policy
entries resolve against the executor that owns them rather than the
orchestrator.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2408 ms):
```
Cache executor temporary directories in sandbox contexts
```

codex:gpt-5.6-luna:lean:low+files (5046 ms):
```
Carry executor temporary directories in environment snapshots
```
Tools: `git diff --cached --stat && git diff --cached`

## codex-19 (diff 21167 chars, git 283 ms)

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

claude:haiku:safe (2598 ms):
```
Expand OAuth discovery redirect tests with same-origin and cycle detection

Add comprehensive redirect handling tests for OAuth metadata discovery:
- Test same-origin redirects for both resource and authorization metadata
- Verify cross-origin redirects are rejected for both metadata types
- Detect and reject redirect cycles within discovery timeout
- Refactor test helpers to reduce duplication and improve clarity
- Replace direct HTTP client construction with test utility function
```

claude:haiku:safe+files (6347 ms):
```
Add comprehensive OAuth redirect security tests (#39019)

Expand mcp_2026_oauth_discovery tests to verify that OAuth metadata
discovery properly handles and rejects cross-origin redirects while
accepting same-origin redirects. Add tests for redirect cycle detection,
resource isolation during metadata requests, and refactor tests to use
a shared HttpClient factory for consistency. Update test utilities to
parameterize metadata delivery modes for broader test coverage.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1832 ms):
```
Tests: restructure MCP OAuth discovery tests around redirects

Cover same-origin metadata redirects, reject cross-origin redirects
and redirect cycles, and drop the executor-side discovery comparison
in favor of the local HTTP client.
```

claude:claude-haiku-5-5:safe:low+files (5458 ms):
```
Test MCP OAuth metadata redirect handling

Cover same-origin redirects for OAuth metadata, reject cross-origin
redirects for both resource and authorization metadata, and bound
redirect cycles with a timeout. Build the test HTTP client from the
shared test environment instead of constructing it per call.
```
Tools: `git diff --cached | head -400`, `git diff --cached | sed -n 400,700p; git branch --show-current`

codex:gpt-5.6-luna:lean:low (2193 ms):
```
Expand OAuth discovery redirect coverage
```

codex:gpt-5.6-luna:lean:low+files (4535 ms):
```
Expand OAuth discovery redirect coverage
```
Tools: `git diff --cached -- codex-rs/rmcp-client/tests/mcp_2026_oauth_discovery.rs`

## codex-20 (diff 23412 chars, git 93 ms)

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

claude:haiku:safe (2409 ms):
```
Add plugin identity attribution to executor skills

Track selected plugin identities through the MCP runtime and attribute them to executor skills in catalogs. This enables analytics to associate skill invocations with their originating plugins and properly scope them as user-level resources.
```

claude:haiku:safe+files (5667 ms):
```
Attribute executor skills to their source plugins for analytics

Track selected plugins across the session and use that information to
attribute executor skills to their originating plugin with the correct
analytics scope (user), enabling proper skill invocation analytics and
telemetry.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2045 ms):
```
Attribute executor skills and MCP plugins to their selected plugin

Selected executor plugins now carry their selected root ID through the
MCP projection into the thread extension data. Skills from those roots
are attributed to the plugin, so skill invocation analytics report the
plugin ID and user scope instead of leaving them unset.
```

claude:claude-haiku-5-5:safe:low+files (3831 ms):
```
Attribute executor skill invocations to their plugins

Executor skills were reported to analytics without a plugin id. Keep
the selected plugin identities on the thread and turn, and tag skills
from each selected root with their plugin so invocation events carry
plugin_id and the user skill scope.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2839 ms):
```
Attribute executor skills to their selected plugins
```

codex:gpt-5.6-luna:lean:low+files (4412 ms):
```
Attribute executor skills to their selected plugins
```
Tools: `git diff --cached --stat && git diff --cached`

## codex-21 (diff 25330 chars, git 85 ms)

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

claude:haiku:safe (3947 ms):
```
Rename ApprovalReviewContributor methods for fast and full review paths

The `ApprovalReviewContributor` trait now distinguishes between two review
patterns. The `fast_decision` method returns an existing decision from cached
evidence, while the new `full_review` method performs a structured assessment
of a host-owned approval action. Both are optional with default no-op
implementations, allowing contributors to support one or both paths.

The registry methods are renamed to match: `fast_approval_decision` for quick
cached lookups and `full_approval_review` for complete assessments. New types
`ApprovalReviewInput`, `ApprovalAssessment`, and `ApprovalReviewError` provide
structured context and results for full reviews.
```

claude:haiku:safe+files (10389 ms):
```
Support structured approval reviews alongside fast decisions (#40472)

Split ApprovalReviewContributor into fast_decision for quick evidence-based
determinations and full_review for comprehensive structured assessments. Add
ApprovalReviewInput, ApprovalAssessment, and ApprovalReviewError types to
provide rich context and clear results for full reviews. Rename registry
methods to clarify their purpose.
```
Tools: `git diff --cached`, `git diff --cached | tail -100`, `git log --oneline -15`

claude:claude-haiku-5-5:safe:low (2231 ms):
```
Split the approval review contributor API into fast decisions and full reviews

Renames the ApprovalReviewContributor::contribute method to fast_decision
and the registry's approval_review to fast_approval_decision. Adds a
full_review path with structured input (action, conversation snapshot,
thread identity, reasons) and typed assessment/error results, plus a
registry method full_approval_review that returns the first claim.
```

claude:claude-haiku-5-5:safe:low+files (3630 ms):
```
Split approval review into fast and full paths

Rename the approval-review contributor hook to fast_decision, which
returns a decision from existing evidence. Add full_review, which takes
a structured host-owned approval request and returns an assessment or
an operational error. The registry exposes both paths.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2291 ms):
```
Add full approval review support to extension contributors
```

codex:gpt-5.6-luna:lean:low+files (7480 ms):
```
Add full approval review API for extension contributors
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/ext/extension-api/src/contributors.rs codex-rs/ext/extension-a`, `git diff --cached -- codex-rs/ext/extension-api/tests/registry.rs codex-rs/ext/guardian-v2/src/async_scorer/extension_te`, `git branch --show-current`

## codex-22 (diff 28926 chars, git 91 ms)

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

claude:haiku:safe (3126 ms):
```
Allow Guardian to use model-specific rejection and timeout instructions

Guardian's denial and timeout messages can now be customized per model through
the catalog's auto_review message definitions. The rejection_instructions and
timeout_instructions fields in AutoReviewMessages let operators override the
legacy hardcoded messages for specific models, enabling better user guidance
tailored to each model's capabilities and policies.

The timeout message customization also applies to MCP tool elicitations and
shell escalation reviews, ensuring consistent messaging across all Guardian
review contexts.
```

claude:haiku:safe+files (9946 ms):
```
Allow Guardian to use model-specific rejection and timeout instructions

Add rejection_instructions and timeout_instructions fields to
AutoReviewMessages to allow Guardian's denial and timeout messages to
be overridden from model configuration instead of using hardcoded
strings. This enables per-model customization of Guardian feedback
messages while preserving the legacy defaults when not specified.
```
Tools: `git diff --cached`, `git log --oneline -20`, `git rev-parse --abbrev-ref HEAD`

claude:claude-haiku-5-5:safe:low (2261 ms):
```
Make auto-review rejection and timeout messages model-configurable

The guardian rejection and timeout messages now come from the acting
model's auto_review catalog entry when set, with the built-in text as
fallback. This lets model catalogs tune what the agent is told after a
review denial or timeout.
```

claude:claude-haiku-5-5:safe:low+files (3728 ms):
```
Use acting model Guardian rejection and timeout messages

Guardian denial and timeout messages were hardcoded, so model catalogs
could not customize them. Read rejection_instructions and
timeout_instructions from the acting model's auto_review messages and
fall back to the built-in text when they are absent.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2316 ms):
```
Use acting model instructions for Guardian reviews
```

codex:gpt-5.6-luna:lean:low+files (4363 ms):
```
Use acting model messages for Guardian review outcomes
```
Tools: `git diff --cached --stat && git diff --cached`

## codex-23 (diff 31823 chars, git 96 ms)

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

claude:haiku:safe (2981 ms):
```
Add host skill discovery opt-out for executor-only extensions

Introduces a new feature flag and extension API to allow skill providers to
opt out of host skill discovery. When `SkipHostSkillDiscovery` is enabled
and no registered contributor requires host skills, the session and turn
initialization skip the expensive host skill snapshot operation.

The `SkillInvocationContributor` trait now includes a
`requires_host_skill_discovery()` method that defaults to true for backward
compatibility. Extensions with only executor or orchestrator skill providers
can override this to return false, signaling that host discovery can be
safely skipped.
```

claude:haiku:safe+files (9851 ms):
```
Skip host skill discovery when contributors don't require it

Add a SkipHostSkillDiscovery feature flag and check whether installed
skill contributors need host-owned skills before discovering and
snapshotting them. Registries without host skill providers can now
opt out of expensive filesystem operations during session initialization
and per-turn, while retaining executor-supplied and instruction-based
skills from other providers.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2121 ms):
```
Add opt-in skip for host skill discovery when no contributor needs it

Introduce the SkipHostSkillDiscovery feature flag. When enabled and no
installed skill contributor requires host skills, session warmup and
turn context building skip the host skill snapshot. Contributors
default to requiring host discovery, so existing behavior is unchanged.
```

claude:claude-haiku-5-5:safe:low+files (4694 ms):
```
Skip host skill discovery without host contributors

Host skill snapshots were built for every turn even when no installed
skill contributor needs them. Add a SkipHostSkillDiscovery feature flag
and a contributor hook so sessions can skip host discovery when every
registered contributor opts out. Registries without skill contributors
keep the legacy behavior.
```
Tools: `git diff --cached -- codex-rs/core/src codex-rs/ext codex-rs/features codex-rs/core/config.schema.json`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (2366 ms):
```
Skip host skill discovery when providers do not require it
```

codex:gpt-5.6-luna:lean:low+files (6008 ms):
```
Add opt-out for unnecessary host skill discovery
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/core/src/session/session.rs codex-rs/core/src/session/turn_con`, `/bin/zsh -lc "git diff --cached -- codex-rs/core/tests/suite/skills_extension.rs codex-rs/ext/extension-api/tests/regist`

## codex-24 (diff 36705 chars, git 95 ms)

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

claude:haiku:safe (1643 ms):
```
Add Guardian reviewer configuration preparation
```

claude:haiku:safe+files (12834 ms):
```
Add sync reviewer configuration for Guardian approval reviews

Implement reviewer configuration preparation for Guardian's synchronous
reviewer, including policy template guidance and comprehensive option
setup for isolated reviewer threads. This includes model selection logic,
permission constraints, and feature isolation needed for safe approval
reviews.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`, `git log --oneline -10`, `git rev-parse --abbrev-ref HEAD`, `Read codex-rs/ext/guardian-v2/src/sync_reviewer/mod.rs`

claude:claude-haiku-5-5:safe:low (2078 ms):
```
Add sync reviewer options for guardian reviewer sessions

Prepare isolated StartThreadOptions for guardian reviews: pick the
reviewer model, drop parent developer instructions, MCP servers and
optional features, and force a read-only permission profile.
```

claude:claude-haiku-5-5:safe:low+files (4672 ms):
```
Add isolated reviewer config for guardian sync reviewer

Build the StartThreadOptions for a guardian review session from the
parent thread. The reviewer runs read-only, with approvals disabled,
MCP servers cleared, and the Guardian features turned off, so it cannot
recurse into another review or act on the workspace.
```
Tools: `git diff --cached -- codex-rs/ext/guardian-v2/src/sync_reviewer/mod.rs codex-rs/ext/guardian-v2/src/sync_reviewer/review`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (2378 ms):
```
Add isolated Guardian reviewer configuration and policy template
```

codex:gpt-5.6-luna:lean:low+files (5812 ms):
```
Add Guardian sync reviewer session configuration

Create isolated reviewer sessions with policy prompts, model selection,
read-only permissions, and disabled non-review features.
```
Tools: `git diff --cached -- codex-rs/ext/guardian-v2/src/sync_reviewer/mod.rs codex-rs/ext/guardian-v2/src/sync_reviewer/policy`

## codex-25 (diff 40675 chars, git 119 ms)

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

claude:haiku:safe (4719 ms):
```
Preserve markdown hyperlinks in wrapped content and label-only web links

Add terminal-aware presentation policy for web-link destinations. Supporting
terminals (Ghostty, iTerm2, WezTerm, Kitty, VS Code, Alacritty, Windows
Terminal, Konsole, GNOME Terminal, VTE) render label-only links with styled
labels and preserved targets via OSC 8. Other terminals keep visible
destinations as a fallback.

Introduce `HyperlinkParagraph` widget to keep text and hyperlink annotations
aligned during vertical scrolling. Use consistent hyperlink rendering across
chat history, pager overlays, and cell rendering.

Apply link styling (cyan + underline) to web-link labels while preserving
inline formatting (bold, italic, code). Ensure labels survive prose and table
wrapping without losing their link targets.
```

claude:haiku:safe+files (27909 ms):
```
Add web link label styling and align hyperlinks with text rendering

Introduce HyperlinkParagraph widget to coordinate hyperlink annotations
with text layout during rendering, ensuring visible text and OSC 8 codes
stay synchronized during vertical scrolling. Add terminal-aware policy
to hide web link destinations on terminals that support clickable labels,
falling back to destination visibility on unsupported terminals or when
labels lack visible content. Style link labels with link styling (cyan,
underlined) while preserving inline formatting like bold and italic.
```
Tools: `git diff --cached --stat`, `git diff --cached | head -200`, `git diff --cached | grep -A 20 "markdown_render.rs"`, `git diff --cached codex-rs/tui/src/terminal_hyperlinks.rs | head -100`, `git diff --cached codex-rs/tui/src/terminal_hyperlinks/paragraph.rs | head -100`, `git diff --cached codex-rs/tui/src/markdown_render/web_links.rs | head -150`, `git log --oneline -20`, `git log -1 --format=%B | head -20`, `git rev-parse --abbrev-ref HEAD`, `git diff --cached codex-rs/tui/src/markdown_render/web_links_tests.rs | head -100`, `git diff --cached codex-rs/tui/src/markdown_render_tests.rs | head -150`, `git diff --cached codex-rs/tui/src/markdown.rs`, `git diff --cached codex-rs/tui/src/markdown_render.rs | head -200`, `git log --format="%h %s" -15`

claude:claude-haiku-5-5:safe:low (2558 ms):
```
TUI: Render web link labels as styled, hide URL when supported

Use HyperlinkParagraph for transcript and history rendering so OSC 8
hyperlinks stay aligned with wrapped and scrolled text. On terminals
known to support OSC 8, web links show only their styled label; other
terminals, multiplexers, and unknown terminals keep the visible URL.
```

claude:claude-haiku-5-5:safe:low+files (8373 ms):
```
Hide web link URLs in TUI on hyperlink-capable terminals

Terminals that support OSC 8 already make the label clickable, so
printing the raw URL after it is redundant clutter. Show only the
styled label for web links on known-good terminals, and keep the
destination visible for unknown terminals, Apple Terminal, and
multiplexers where the label alone may not be usable.

Route all history and transcript paragraph rendering through a shared
HyperlinkParagraph so wrapping and scroll offsets stay aligned with
hyperlink annotations.
```
Tools: `git diff --cached`, `git diff --cached -- codex-rs/tui/src/markdown_render/web_links.rs codex-rs/tui/src/terminal_hyperlinks/paragraph.rs cod`, `Read ~/.claude/projects/…/tool-results/…`

codex:gpt-5.6-luna:lean:low (2760 ms):
```
Preserve Markdown web links across TUI rendering and wrapping
```

codex:gpt-5.6-luna:lean:low+files (5216 ms):
```
Improve TUI web link rendering and hyperlink alignment
```
Tools: `git diff --cached --stat && git diff --cached`

## codex-26 (diff 46683 chars, git 94 ms)

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

claude:haiku:safe (3672 ms):
```
Add user input evidence to Guardian authorization state

Record genuine user answers to request_user_input calls in Guardian
review evidence before post-tool hooks can replace or reject their
output. Include these bounded fragments in both synchronous and
asynchronous Guardian prompts so reviewers see the host's trusted
observation of what the user actually said.

Discard earlier synchronous reviews once any user answer arrives,
since they were made without knowledge of the user's authentic
preferences. Track authorization changes through user input response
counts alongside history versions, enabling reviewers to detect when
an answer should invalidate cached evidence.
```

claude:haiku:safe+files (16363 ms):
```
Record user answers from request_user_input for Guardian evidence

Capture and retain bounded, role-labeled user answers to request_user_input
invocations, making them available to both synchronous and asynchronous
Guardian reviewers alongside reviewed tool calls. User input response counts
now contribute to authorization version changes, enabling reviewers to see
genuine user preferences when assessing permissions.
```
Tools: `git diff --cached | head -200`, `git diff --cached | head -400`, `git diff --cached codex-rs/core/src/`, `git diff --cached codex-rs/ext/guardian-v2/`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2477 ms):
```
Trust user answers to Guardian reviews and keep them after sync reviews

The change makes request_user_input answers trusted evidence for Guardian. Answers are recorded per call, surfaced to both the async classifier and sync reviewers, and bump an authorization version so earlier review decisions are discarded after a user answer.
```

claude:claude-haiku-5-5:safe:low+files (4447 ms):
```
Trust user-input answers in Guardian reviews

Guardian reviewers treated answers to request_user_input as untrusted
context, so a user approving an action through that prompt could not
be recognized as authorization. Record bounded answers per call, keep
them only while their tool call stays in history, and include them in
a trusted section of the review prompt.

Answers also bump a user-input response count in the authorization
version, so a reviewer decision made before a new answer is marked
stale.
```
Tools: `git diff --cached --stat; git diff --cached -- codex-rs/core codex-rs/ext | head -700`

codex:gpt-5.6-luna:lean:low (2972 ms):
```
Preserve Guardian context across user input responses

Record bounded user answers as trusted Guardian evidence, invalidate stale
reviews, and propagate answers to root and async reviews with coverage tests.
```

codex:gpt-5.6-luna:lean:low+files (6507 ms):
```
Add Guardian user input evidence to review isolation

Record bounded genuine user answers and include them in Guardian reviews,
invalidating stale decisions and preserving visibility through hooks and
root-worker authorization snapshots.
```
Tools: `git diff --cached`, `/bin/zsh -lc "git diff --cached -- codex-rs/core/src/agent/control/user_authorization.rs codex-rs/core/src/codex_thread.`

## codex-27 (diff 52531 chars, git 106 ms)

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

claude:haiku:safe (3076 ms):
```
Add automatic conversation recaps when returning to unfocused tasks

Track when users switch away from a task and generate brief summaries of recent progress when they return after 3 minutes. Recaps are shown after 3 completed turns and at least 2 new turns since the last recap. Handle terminal focus events to know when the user is away, and preserve recap state across thread switches and session resumptions.
```

claude:haiku:safe+files (10772 ms):
```
Add automatic conversation recaps for unfocused tasks

Introduces recap generation infrastructure that provides a brief
catch-up message when users return to tasks they've left unfocused for
3 minutes. Recaps require at least 3 completed turns and track focus
state to know when generation should be triggered. Integrates new
FocusGained and FocusLost TUI events to monitor terminal focus changes.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`, `Read codex-rs/tui/src/app/recap.rs`

claude:claude-haiku-5-5:safe:low (2499 ms):
```
Add conversation recap after focus loss in TUI

Track completed turns and terminal focus so an unfocused TUI can show a short recap of the task once enough progress has accumulated. Forward FocusLost events to the TUI instead of dropping them, and treat FocusGained as a redraw-only event.
```

claude:claude-haiku-5-5:safe:low+files (4382 ms):
```
Add conversation recap groundwork and forward focus events

Track when an unfocused thread has enough completed turns and idle time to warrant a catch-up summary, and build the prompt and history cell for it. Focus gained and lost are now surfaced as TuiEvents instead of being dropped or folded into Draw, so the app can observe focus changes.
```
Tools: `git diff --cached --stat; git diff --cached -- codex-rs/tui/src/app/recap.rs codex-rs/tui/src/tui/event_stream.rs codex-`

codex:gpt-5.6-luna:lean:low (2356 ms):
```
Add automatic conversation recaps when the terminal is unfocused
```

codex:gpt-5.6-luna:lean:low+files (12594 ms):
```
Track terminal focus and recap progress in the TUI
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/tui/src/app/recap.rs codex-rs/tui/src/app/thread_events.rs cod`, `git diff --cached -- codex-rs/tui/src/app/session_lifecycle.rs codex-rs/tui/src/app/startup.rs codex-rs/tui/src/app/thre`, `/bin/zsh -lc "git diff --cached | grep -n -E 'recap|ThreadRecap|generate|Focus' | head -100"`, `git diff --cached -- codex-rs/tui/src/app/thread_events.rs codex-rs/tui/src/app/tests.rs codex-rs/tui/src/app.rs | tail `, `git branch --show-current && git diff --cached --numstat`

## codex-28 (diff 59843 chars, git 139 ms)

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

claude:haiku:safe (4433 ms):
```
Expose managed developer instructions from requirements to requests

Add support for enterprise-managed developer instructions that are supplied independently of ordinary client developer instructions. These instructions are loaded from `requirements.toml` or MDM, validated to stay within a 10,000-token limit, and injected into each model request as a separate developer message block enclosed in `<managed_developer_instructions>` markers.

Managed instructions are updated or removed atomically when requirements change, with replacement and removal notices provided for conversational clarity. The implementation ensures that instructions are rendered exactly once per request and properly sanitized when forking agent histories, preserving managed policies while removing stale content.
```

claude:haiku:safe+files (10247 ms):
```
Expose managed developer instructions from requirements (#XXXXX)

Add support for requirements-provided developer instructions that are
kept separate from client-specified instructions. Managed instructions
are sourced from requirements.toml or MDM and rendered with unique
markers to identify them during context building and history migrations.

These instructions are validated to fit within the model context budget
and are preserved when child agents fork from parent threads, with
updates and removals signaled through replacement notices. Stale managed
instructions from previous runs are replaced when configuration changes.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`

claude:claude-haiku-5-5:safe:low (2940 ms):
```
Add managed developer instructions from requirements

Requirements can now supply additional_developer_instructions, which are injected as a separate developer message. The value is validated against the model-context limit at config load. Compaction, fork, rollback, and resume paths keep exactly one current managed block.
```

claude:claude-haiku-5-5:safe:low+files (5889 ms):
```
Add managed developer instructions from requirements

Admins can now set additional_developer_instructions in requirements.
The text is sent as its own developer message, separate from client
instructions, so it cannot be overridden by them.

Changes to the policy are tracked in history. A new value replaces the
previous one, and removing it emits a notice that the old instructions
no longer apply. Oversized policy is rejected at config load rather than
truncated. Forked subagents drop inherited copies and receive the
current policy at startup.
```
Tools: `git diff --cached -- codex-rs/config codex-rs/core/src/config codex-rs/core/src/context codex-rs/core/src/session codex-`

codex:gpt-5.6-luna:lean:low (2773 ms):
```
Expose managed developer instructions from requirements
```

codex:gpt-5.6-luna:lean:low+files (5630 ms):
```
Expose managed developer instructions in config requirements
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/core/src/context/world_state/managed_developer_instructions.rs`

## codex-29 (diff 76597 chars, truncated, git 119 ms)

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

claude:haiku:safe (3480 ms):
```
Sanitize Git remote URLs before storing and transmitting

Add SanitizedGitUrl type that strips authentication credentials from
Git remote URLs. Apply this to all Git URL storage and transmission,
including thread metadata, rollouts, and analytics. Credential-bearing
URLs are now rejected at API boundaries and sanitized when loading
legacy data.
```

claude:haiku:safe+files (11379 ms):
```
Add SanitizedGitUrl to remove credentials from Git remotes

Introduce a new SanitizedGitUrl type that automatically removes
authentication credentials from Git remote URLs. Update all Git
remote URL fields throughout the codebase to use this type, ensuring
credentials never appear in API responses, database records, or
persisted metadata. Handle edge cases including SSH URLs, IPv6
addresses, remote helpers, and credential rewrite rules.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`, `Read ~/.claude/projects/…/tool-results/…`

claude:claude-haiku-5-5:safe:low (3007 ms):
```
Sanitize git remote URLs to strip credentials before persistence

Client-provided and rollout-recorded Git origin URLs can carry userinfo
such as tokens or passwords. Introduce SanitizedGitUrl in the protocol
crate and use it wherever repository URLs are stored, returned by the
API, or sent in turn metadata, so credentials never reach responses,
SQLite, rollout files, or model requests.
```

claude:claude-haiku-5-5:safe:low+files (7427 ms):
```
Sanitize git remote URLs before storing workspace metadata

Remote URLs can carry credentials, for example through userinfo or
insteadOf rewrites. Introduce a SanitizedGitUrl type that strips them
and rejects malformed input. Use it for git info collection, thread
metadata storage, the git info patch API, and cloud environment
detection. Malformed remotes are now dropped instead of persisted raw.
```
Tools: `git diff --cached -- codex-rs/protocol/src/sanitized_git_url.rs codex-rs/git-utils/src/info.rs codex-rs/state/src/runtim`, `git diff --cached --stat | tail -1 && git diff --cached -- codex-rs/state/src/runtime/threads.rs codex-rs/thread-store/s`

codex:gpt-5.6-luna:lean:low (2832 ms):
```
Sanitize Git remote credentials in metadata and analytics
```

codex:gpt-5.6-luna:lean:low+files (10082 ms):
```
Sanitize Git remote URLs in metadata
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/git-utils/src/info.rs codex-rs/protocol/src/sanitized_git_url.`, `git diff --cached -- codex-rs/state/src/model/thread_metadata.rs codex-rs/state/src/runtime/threads.rs codex-rs/thread-s`, `git branch --show-current && git diff --cached -- codex-rs/Cargo.toml codex-rs/protocol/Cargo.toml codex-rs/core/src/res`

## codex-30 (diff 101984 chars, truncated, git 93 ms)

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

claude:haiku:safe (4831 ms):
```
Add turn-level settings updates with atomic step activation

Introduce `TurnSettingsUpdate` to allow sparse edits to running turn settings,
published immediately for subsequent step captures while leaving already-captured
steps unchanged. Add `step_activation` module to validate updates against legacy
turn consumers (approvals, Guardian) that still read the admitted `TurnContext`.
Validate that updates preserve approval policy, reviewer, model classification,
and prefix-rule behavior. Add comprehensive tests for model switching, reasoning
effort changes, and rejection of unsafe updates. Enable the `step_model_switching`
feature flag and add it to the schema.
```

claude:haiku:safe+files (30240 ms):
```
Enable runtime model switching for running turns with step settings

Implement sparse turn-level settings updates that modify a running task's
resolved model, effort, summary, and service tier without affecting future
turns or their initial settings. Adds TurnSettingsUpdate protocol type,
Op::TurnSettings handler, and step_activation module with legacy safety
checks for ongoing approvals and Guardian operations. Updates are isolated
to their target turn and blocked if the task becomes unavailable or exits
during resolution. Includes comprehensive test coverage for various update
scenarios and safety constraints.
```
Tools: `git diff --cached --stat`, `git diff --cached --no-patch --summary`, `git diff --cached | head -300`, `git diff --cached codex-rs/core/src/session/step_activation.rs | head -150`, `git diff --cached codex-rs/protocol/src/protocol.rs | head -200`, `git diff --cached codex-rs/core/src/session/step_settings.rs`, `git diff --cached codex-rs/core/src/session/handlers.rs`, `git diff --cached codex-rs/features/src/lib.rs`, `git diff --cached codex-rs/core/tests/suite/step_settings.rs | head -300`, `git diff --cached codex-rs/core/src/session/step_activation.rs | tail -200`, `git log --oneline -20`, `git diff --cached | grep -A 5 "pub(super) async fn apply_turn_settings"`

claude:claude-haiku-5-5:safe:low (2999 ms):
```
Add turn-settings update op and step model switching feature

Introduce Op::TurnSettings to change a running turn's model, effort,
summary, and service tier without altering future defaults. Activation
validates the destination against the admitted turn's approval, reviewer,
and guardian constraints, and the feature is gated behind
step_model_switching.
```

claude:claude-haiku-5-5:safe:low+files (6007 ms):
```
Add restricted live updates to running turn settings

Running turns can now receive sparse model, effort, summary, and service
tier updates through a new TurnSettings op. Updates are published for
later step captures and never alter steps that were already captured.
They are gated behind the under-development step_model_switching
feature.

Approval policy, reviewer, and Guardian-related model properties are
still read from the admitted turn, so updates that would change them
are rejected for now.
```
Tools: `git diff --cached -- codex-rs/core/src/session/step_settings.rs codex-rs/core/src/session/handlers.rs codex-rs/features/`, `git diff --cached -- codex-rs/core/src/session/step_activation.rs | head -150`

codex:gpt-5.6-luna:lean:low (2764 ms):
```
Support live turn settings updates with safety validation
```

codex:gpt-5.6-luna:lean:low+files (6339 ms):
```
Allow atomic settings updates for active turns

Apply validated sparse updates to a captured live turn without changing
future thread settings or already captured step snapshots.
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/core/src/session/step_activation.rs codex-rs/core/src/session/`

## codex-31 (diff 149112 chars, truncated, git 142 ms)

Actual:
```
Support managed AWS access keys for Amazon Bedrock (#40481)

## What changed

- Add the experimental `amazonBedrockAccessKeys` app-server login flow, persist its credentials in the configured auth store, and use them for SigV4-signed Bedrock requests.
- Report `bedrockAccessKeys` as a distinct auth mode and document access-key login alongside AWS profile and environment credential setup.
- Clear the selected Bedrock provider, AWS settings, and Bedrock-specific model on logout while leaving external AWS credentials and `.env` untouched.
- Reject managed access-key login when higher-precedence configuration would prevent its region or profile settings from taking effect.

## Testing

- Cover access-key login, storage, request signing, configuration conflicts, status reporting, and logout cleanup.

GitOrigin-RevId: bbf297887c6503d3651ceb2aad85c4d626e32723
```

claude:haiku:safe (2970 ms):
```
Add support for Amazon Bedrock managed AWS access keys authentication
```

claude:haiku:safe+files (37603 ms):
```
Add Amazon Bedrock AWS access key authentication support

Introduce managed AWS access key authentication for Amazon Bedrock,
allowing users to supply AWS access keys directly instead of relying
solely on API keys or AWS profile configuration. This includes new
login/logout flows, auth storage, protocol changes, and credential
handling in the app server and model provider layers. Also update
Amazon Bedrock config management to support region configuration and
improved credential lifecycle handling.
```
Tools: `git diff --cached --stat`, `git diff --cached codex-rs/app-server-protocol/src/protocol/common.rs | head -100`, `git diff --cached codex-rs/app-server-protocol/src/protocol/v2/account.rs`, `git diff --cached codex-rs/login/src/auth/bedrock_access_keys.rs | head -80`, `git diff --cached codex-rs/cli/src/login.rs | head -120`, `git diff --cached codex-rs/model-provider/src/amazon_bedrock/auth.rs | head -150`, `git diff --cached codex-rs/app-server/tests/suite/v2/account.rs | head -200`, `git diff --cached codex-rs/core/src/config/edit/bedrock.rs`, `git diff --cached codex-rs/aws-auth/src/lib.rs`, `git diff --cached codex-rs/login/src/auth/manager.rs | head -150`, `git diff --cached codex-rs/login/src/auth/storage.rs`, `git diff --cached codex-rs/app-server/src/request_processors/account_processor.rs | head -250`, `git diff --cached codex-rs/app-server/src/request_processors/bedrock_auth.rs | head -150`

claude:claude-haiku-5-5:safe:low (4805 ms):
```
Add managed Amazon Bedrock AWS access key login

Store static AWS access keys as a managed auth mode, alongside the
existing Bedrock API key. Expose it through account/login/start as
amazonBedrockAccessKeys (experimental) and replace the old
BedrockSetupParams::AccessKeys variant with this path.
```

claude:claude-haiku-5-5:safe:low+files (7774 ms):
```
Add Amazon Bedrock access key login to app server

Users can now sign in to Amazon Bedrock with AWS access keys stored by
Codex, in addition to the existing API key flow. Login writes the
selected region to the Bedrock provider config, and logout clears the
Bedrock provider settings instead of refusing while Bedrock is active.
```
Tools: `git diff --cached -- codex-rs/login/src/auth/manager.rs codex-rs/app-server/src/request_processors/account_processor.rs `, `git branch --show-current; git diff --cached --stat | tail -1`

codex:gpt-5.6-luna:lean:low (3370 ms):
```
Add managed Amazon Bedrock AWS access key authentication
```

codex:gpt-5.6-luna:lean:low+files (8901 ms):
```
Add AWS access key authentication for Amazon Bedrock
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/app-server/src/request_processors/account_processor.rs codex-r`, `git branch --show-current && git diff --cached -- codex-rs/aws-auth/src/lib.rs codex-rs/login/src/auth/bedrock_access_ke`

## codex-32 (diff 216117 chars, truncated, git 119 ms)

Actual:
```
Snapshot resolved settings for each model step (#40651)

## Why

Thread settings can change while a turn is running, and delegated review or
compaction steps can select a different model. Each request needs a consistent
set of settings resolved against the model that will execute it.

## What changed

- Capture immutable resolved settings for each model step, including model
  metadata, reasoning options, service tier, approvals, and personality.
- Keep in-flight steps on their captured settings while applying thread updates
  to subsequent work.
- Resolve inherited reasoning summaries and filter service tiers against the
  selected model and feature configuration for review and compaction steps.

## Testing

Added coverage for settings updates during paused turns, model changes,
previous-model compaction, review-model defaults, and service-tier filtering.

GitOrigin-RevId: fca4b3b305379f1bf26a5cac75ee0dd1747ac1f6
```

claude:haiku:safe (8208 ms):
```
Scope step settings snapshot to their committed turn context
```

claude:haiku:safe+files (32015 ms):
```
Capture step settings in snapshots that are independent of future changes

Introduce `ResolvedStepSettings` as an immutable, resolved version of
configured step inputs with pinned model metadata and effective request
values. One snapshot produces several fresh `StepContext`s; replacing the
snapshot does not change steps or actions that have already captured it.
This enables step-scoped execution to be independent of settings updates
that occur during a turn, keeping ordinary settings changes from affecting
in-flight request preparation.
```
Tools: `git status`, `git diff --cached codex-rs/core/src/session/step_settings.rs | head -200`, `git diff --cached codex-rs/core/src/session/turn_context.rs | head -300`, `git diff --cached codex-rs/core/src/session/step_context.rs | head -200`, `git diff --cached codex-rs/core/src/session/turn.rs | head -250`, `git diff --cached codex-rs/core/src/session/tests.rs | head -400`, `Read codex-rs/core/tests/suite/step_settings_snapshots.rs`, `git diff --cached --stat | head -50`, `git diff --cached codex-rs/core/src/guardian/review.rs | head -100`, `Read codex-rs/core/tests/suite/step_settings_snapshots.rs`

claude:claude-haiku-5-5:safe:low (3539 ms):
```
Refactor core turn settings to use a shared model_info()/mode() accessor pattern

The TurnContext fields for model info, mode, personality, and reasoning
effort now read through the resolved step settings snapshot, so every
caller sees the same committed view. Tests update settings through a
helper that keeps the initial and current views in sync.
```

claude:claude-haiku-5-5:safe:low+files (6752 ms):
```
Capture step settings in an immutable resolved snapshot

Settings updates replaced the turn's model and effort fields in place,
so a step that was still planning or running could read a mix of old
and new values. Resolve the selected settings and pinned model metadata
into a ResolvedStepSettings snapshot, store it behind ArcSwap, and have
each StepContext capture one snapshot up front. Later updates swap the
snapshot for future steps only.
```
Tools: `git diff --cached -- codex-rs/core/src/session/step_settings.rs codex-rs/core/src/session/turn_context.rs codex-rs/core/`

codex:gpt-5.6-luna:lean:low (3643 ms):
```
Snapshot turn settings independently from thread updates
```

codex:gpt-5.6-luna:lean:low+files (11400 ms):
```
Bind step execution to immutable settings snapshots
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/core/src/session/step_settings.rs codex-rs/core/src/session/tu`, `/bin/zsh -lc "git diff --cached -- codex-rs/core/src/session/turn_context.rs codex-rs/core/src/session/step_context.rs c`, `/bin/zsh -lc "git branch --show-current && git diff --cached -- codex-rs/core/src/session/turn_context.rs | grep -E '"'^`

## codex-33 (diff 279774 chars, truncated, git 136 ms)

Actual:
```
Persist realtime events in the thread timeline (#40508)

## Why

Clients need a bounded view of realtime conversations that preserves the order of speech, agent work, and turn lifecycle events without loading the full thread history.

## What changed

- Persist realtime session boundaries, transcript segments, and promoted agent items in paginated thread rollouts.
- Add the experimental `thread/timeline/list` API to page ordinary items, realtime items, and turn boundaries in canonical rollout order. Include `activeRealtimeSessionAtPageStart` so each page can be rendered independently.
- Emit typed `thread/realtime/item/started`, `thread/realtime/item/transcript/delta`, and `thread/realtime/item/completed` notifications around durable realtime items.
- Keep the existing `thread/items/list` response and legacy thread history behavior unchanged.

## Testing

- Cover mixed timeline pagination, realtime-session state at page boundaries, rollout replay, subagent history prefixes, transcript streaming, steering, and promoted agent artifacts.

GitOrigin-RevId: faa2c420192d63e060e8fb32446e3c797422656e
```

claude:haiku:safe (5722 ms):
```
Add realtime item tracking to thread timeline and history

Implement support for persisting realtime conversation items in the
canonical thread history. This enables clients to access realtime
session transcripts and item lifecycle events through the thread
timeline API.

Add ThreadTimelineList request to query mixed ordinary and realtime
items in rollout order. Introduce RealtimeItem type to capture
transcript segments, session lifecycle, and item presentation details.
Emit item-started, transcript-delta, and item-completed notifications
to track realtime progress before canonical persistence.

Update thread history schema with realtime_items table and migrations.
Handle realtime event materialization and filtering based on history
mode to avoid duplicating data already present in canonical items.
```

claude:haiku:safe+files (28907 ms):
```
Add durable realtime timeline items and thread/timeline/list endpoint

Persist realtime speech and promoted agent work to the canonical rollout
as durably ordered timeline items. Introduce `thread/timeline/list` to
page items interleaved with turn boundaries, including realtime session
lifecycle and transcript segments. Add lifecycle notifications for
completed items. Support reconstruction from turn events and history
migrations for new state schema.
```
Tools: `git diff --cached --stat`, `git diff --cached codex-rs/app-server-protocol/src/protocol/v2/realtime.rs | head -100`, `git diff --cached codex-rs/app-server/src/realtime_history.rs | head -150`, `git diff --cached "codex-rs/state/thread_history_migrations/0005_thread_realtime_items.sql"`, `git diff --cached codex-rs/protocol/src/realtime.rs | head -150`, `git diff --cached codex-rs/app-server/tests/suite/v2/thread_timeline.rs | head -200`, `git diff --cached codex-rs/thread-store/src/local/thread_history/realtime.rs | head -200`, `git log --oneline -15`, `git diff --cached codex-rs/app-server/README.md`, `git diff --cached codex-rs/app-server-protocol/schema/typescript/ServerNotification.ts`

claude:claude-haiku-5-5:safe:low (2424 ms):
```
Add realtime item timeline and transcript notifications
```

claude:claude-haiku-5-5:safe:low+files (5978 ms):
```
Persist realtime transcript items in thread history

Realtime voice sessions produced transcript and session events that
were not kept with the thread, so they were lost on reload and never
reached clients. Store these items in the rollout and emit them as
thread realtime item notifications. Seal any open transcript segment
before user input so ordering matches what the user saw.
```
Tools: `git diff --cached --stat | tail -1; git diff --cached -- codex-rs/protocol/src/realtime.rs codex-rs/app-server/src/realt`

codex:gpt-5.6-luna:lean:low (2632 ms):
```
Add realtime conversation items to thread timelines
```

codex:gpt-5.6-luna:lean:low+files (5338 ms):
```
Persist realtime conversation items in thread history
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/app-server/src/realtime_history.rs codex-rs/app-server/src/rea`

## codex-34 (diff 448631 chars, truncated, git 161 ms)

Actual:
```
Standardize shell execution on unified exec (#39757)

## What changed

- Remove the legacy `shell_command` handler and runtime, leaving `exec_command`
  and `write_stdin` as the shell execution tools.
- Treat legacy `shell_command` model metadata as `unified_exec`, and normalize
  legacy user opt-outs so they do not disable command execution. Managed feature
  requirements and `shell_tool` can still disable it.
- Preserve shell approvals, sandboxing, zsh-fork support, and output truncation
  through the unified execution path.

## Testing

- Cover legacy configuration and model-metadata compatibility.
- Exercise unified shell execution, approvals, truncation, and `apply_patch`
  serialization across the app-server and core test suites.

GitOrigin-RevId: 5c2fd6164fc3519cdae4944cb9db276b8467311c
```

claude:haiku:safe (3864 ms):
```
Remove legacy shell_command tool and unify on exec_command

The shell_command tool is replaced by exec_command, which provides the same
functionality with a unified interface across platforms. This change removes the
deprecated shell_command handler, its associated runtimes, and updates all test
infrastructure and model configurations to use exec_command exclusively.

Legacy feature flags that disabled the shell tool are now normalized to not
disable command execution, ensuring backward compatibility for user configurations.
```

claude:haiku:safe+files (28086 ms):
```
Remove legacy shell_command tool and consolidate on unified_exec

Replace all shell command execution with unified_exec across models and
remove the deprecated ShellCommandHandler. Simplify shell tool feature
configuration by removing ShellCommandBackendConfig and updating model
definitions to use unified_exec. Add serde alias for backward
compatibility when deserializing legacy shell_command configurations.
```
Tools: `git diff --cached --stat`, `git diff --cached --name-only | head -20`, `git diff --cached --name-status | grep -E "(shell|handlers)" | sort`, `git diff --cached codex-rs/core/src/tools/handlers/mod.rs | head -50`, `git diff --cached codex-rs/core/src/tools/runtimes/mod.rs | head -80`, `Read codex-rs/core/src/tools/runtimes/shell/mod.rs`, `git diff --cached --name-status | grep "handlers/shell"`, `git diff --cached codex-rs/core/src/tools/spec_plan.rs | head -100`, `git diff --cached codex-rs/protocol/src/models.rs | head -80`, `git diff --cached codex-rs/models-manager/models.json | head -100`, `git diff --cached codex-rs/protocol/src/openai_models.rs | head -100`, `git diff --cached codex-rs/tools/src/tool_config.rs | head -120`, `git log --oneline -1`

claude:claude-haiku-5-5:safe:low (2726 ms):
```
Retire shell_command tool in favor of exec_command

The shell_command backend and its handler, runtime, and tests are
removed. Unified exec is now the only command execution tool, and
legacy shell_command config values are mapped to it.
```

claude:claude-haiku-5-5:safe:low+files (5057 ms):
```
Remove the legacy shell_command tool handler

The shell_command backend is no longer offered. Unified exec is now
always enabled unless managed requirements pin it off, so legacy user
opt-outs no longer select a removed shell path. Exec output truncation
also reserves room for the response metadata so output is not cut twice.
```
Tools: `git diff --cached --stat | tail -1 && git diff --cached -- codex-rs/core/src/tools/handlers/mod.rs codex-rs/core/src/too`

codex:gpt-5.6-luna:lean:low (2796 ms):
```
Remove the legacy shell command tool
```

codex:gpt-5.6-luna:lean:low+files (8942 ms):
```
Remove legacy shell command execution path

Use unified exec for all shell models and preserve legacy metadata compatibility. Improve exec output truncation to reserve response metadata space.
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/core/src/tools codex-rs/tools/src codex-rs/protocol/src codex-`, `git diff --cached -- codex-rs/tools/src/tool_config.rs codex-rs/core/src/tools/registry.rs codex-rs/core/src/tools/runti`

## codex-35 (diff 815546 chars, truncated, git 175 ms)

Actual:
```
Unify turn input submission and routing (#38275)

## What changed

- Add `TurnInputRequest` and typed submission results for atomically starting a turn, steering the active turn, or declining input with a specific reason.
- Expose `start_or_steer_turn`, `start_turn_if_idle`, and `steer_turn` on `CodexThread`, and migrate Core consumers to these APIs.
- Make app-server `turn/start` steer an active regular turn and return that turn's ID. Reject incompatible output schemas and non-steerable turns without applying settings or enqueueing input.

## Testing

- Cover concurrent start-or-steer submissions, accepted and rejected settings updates, output-schema compatibility, idle-start rejection, and app-server steering.

GitOrigin-RevId: dd9b5528d76ec650c019e97af420bc13190ea86a
```

claude:haiku:safe (4872 ms):
```
Refactor turn-input handling into dedicated modules

Move user message admission logic from ad-hoc session handlers into
dedicated turn_input module with clear request/response types. Extract
thread-settings updates into separate module. Define TurnInputRequest,
StartIfIdleSubmission, SteerSubmission, and NotSubmittedReason types in
protocol crate for shared use across Core's submission APIs. Update all
tests to import TurnInputRequest from new public API. This centralizes
turn-input decision logic and improves maintainability of admission and
steering code paths.
```

claude:haiku:safe+files (28454 ms):
```
Refactor turn input handling with unified request API (#38275)

Introduce TurnInputRequest and related types in the protocol layer
as a unified interface for turn submissions. Migrate from separate
methods for user input, steered input, and idle turns to a
composable TurnInputMode-based API. Extract thread settings
application into a dedicated module. Update all callers and tests.
```
Tools: `git diff --cached --stat | head -40`, `git diff --cached codex-rs/core/src/session/turn_input.rs | head -150`, `git diff --cached --name-status | grep -E "^(D|A)" | head -30`, `git diff --cached codex-rs/core/src/session/mod.rs | head -200`, `git diff --cached codex-rs/protocol/src/turn_input.rs | head -250`, `git log --oneline -20`, `git rev-parse --abbrev-ref HEAD`, `git diff --cached codex-rs/core/src/lib.rs | head -100`, `git diff --cached codex-rs/core/tests/suite/client.rs | head -300`, `git diff --cached codex-rs/core/src/session/handlers.rs | head -200`, `git diff --cached codex-rs/core/src/codex_thread.rs | head -300`, `git diff --cached --stat | tail -20`

claude:claude-haiku-5-5:safe:low (2178 ms):
```
Replace the Op-based turn submission with TurnInput request/submission APIs in core
```

claude:claude-haiku-5-5:safe:low+files (4614 ms):
```
Route turn input through a single Core handler

Start, steer, and idle-start decisions for submitted input now live in
one session turn-input module. Thread settings are validated before
input is admitted and applied only once Core accepts the input, so a
rejected submission leaves the thread unchanged.
```
Tools: `git diff --cached --stat | tail -1; git diff --cached -- codex-rs/core/src/session/turn_input.rs codex-rs/protocol/src/t`

codex:gpt-5.6-luna:lean:low (2990 ms):
```
Unify turn input submission handling across Codex clients
```

codex:gpt-5.6-luna:lean:low+files (6564 ms):
```
Unify turn input submission APIs
```
Tools: `git diff --cached --stat && git diff --cached -- codex-rs/core/src/session/turn_input.rs codex-rs/core/src/session/mod.r`, `git branch --show-current; git diff --cached --name-status; git log -5 --oneline`
