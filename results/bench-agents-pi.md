# bench-agents-pi

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | tool calls | cost $ |
|---|---|---|---|---|---|---|---|---|---|
| pi:anthropic/claude-haiku-4-5:lean:off | 60/60 | 2222 | 6151 | 5749 | 0 | 77 | 0 | - | 0.0073 |
| pi:anthropic/claude-haiku-5-5:lean:low | 60/60 | 2072 | 4767 | 7536 | 0 | 136 | 0 | - | 0.0010 |
| pi:openai/gpt-5.6-luna:lean:low | 60/60 | 1714 | 2618 | 4375 | 0 | 22 | 0 | - | 0.0011 |
| pi:anthropic/claude-haiku-4-5:naive | 60/60 | 10660 | 23980 | 7241 | 0 | 897 | 861 | - | 0.0132 |
| claude:claude-haiku-4-5:safe | 60/60 | 2410 | 3603 | 6006 | 0 | 70 | 0 | - | 0.0112 |
| claude:claude-haiku-5-5:safe:low | 60/60 | 2001 | 5093 | 7844 | 132 | 68 | 11 | - | 0.0016 |
| codex:gpt-5.6-luna:lean:low | 60/60 | 2544 | 3055 | 6815 | 0 | 18 | 1 | - | - |

## codex-1 (diff 688 chars, git 304 ms)

Actual:
```
Skip postprocessing for short composer input (#39744)

## What changed

Return the initial wrapping ranges directly when the composer input produces a
single line and its byte length is less than the available width. This avoids
the additional grapheme and word-boundary pass for input that cannot wrap.

GitOrigin-RevId: 55d990a354fcc61e9a90d5796b4b39d16742cc50
```

pi:anthropic/claude-haiku-4-5:lean:off (1771 ms):
```
Fix soft-break whitespace handling in TUI textarea wrapping

The condition for returning early wrapped lines was incomplete. When a
single wrapped line contains text shorter than the available width, it
should also return early to properly handle soft-break whitespace.
```

pi:anthropic/claude-haiku-5-5:lean:low (1603 ms):
```
Skip wrapping adjustments for single short composer lines

The early return now also covers text that fits on one line, so the
trailing-whitespace handling below it no longer runs for short input.
```

pi:openai/gpt-5.6-luna:lean:low (1889 ms):
```
Preserve unwrapped composer text when it fits on one line
```

pi:anthropic/claude-haiku-4-5:naive (12060 ms):
```
Fix text wrapping condition for single-line case
```

claude:claude-haiku-4-5:safe (1627 ms):
```
Fix TUI composer wrapping for single-line text shorter than width
```

claude:claude-haiku-5-5:safe:low (1684 ms):
```
Keep wrapped composer text when a single line fits
```

codex:gpt-5.6-luna:lean:low (2544 ms):
```
Preserve short single-line composer text during wrapping
```

## codex-2 (diff 1343 chars, git 289 ms)

Actual:
```
Use default timeouts in cyber exec policy tests (#39496)

## What changed

Stop setting explicit one-second `timeout_ms` and `yield_time_ms` values in the
mock command calls. The shell command and unified exec variants now use their
default timing behavior while testing cyber exec policy.

GitOrigin-RevId: b1c25304ca47e7b08f023fe678467fc00330158b
```

pi:anthropic/claude-haiku-4-5:lean:off (1796 ms):
```
Simplify cyber execution policy test by removing timeout parameters

The timeout configuration is now handled elsewhere, so remove the
timeout_key variable and timeout value assignment from the command
response builder.
```

pi:anthropic/claude-haiku-5-5:lean:low (1740 ms):
```
Remove unused timeout args from cyber exec policy test

The test helper set a timeout argument for each command tool. The
timeout is not needed for the approval flow under test, so drop it
and the matching key lookup.
```

pi:openai/gpt-5.6-luna:lean:low (1825 ms):
```
Remove timeout arguments from cyber execution policy tests
```

pi:anthropic/claude-haiku-4-5:naive (8766 ms):
```
Remove timeout configuration from cyber exec policy test
```

claude:claude-haiku-4-5:safe (2123 ms):
```
Simplify cyber exec policy test by removing timeout parameters

The test was setting timeout values that aren't necessary for the test
logic. Remove `timeout_key` from the match statement and delete the
lines that set timeout_ms and yield_time_ms in the args.
```

claude:claude-haiku-5-5:safe:low (1791 ms):
```
Remove unused timeout arguments from cyber exec test
```

codex:gpt-5.6-luna:lean:low (2336 ms):
```
Remove timeout fields from cyber command policy tests
```

## codex-3 (diff 1926 chars, git 148 ms)

Actual:
```
Isolate IPC in Bubblewrap sandboxes (#39586)

## What changed

- Pass `--unshare-ipc` when building Bubblewrap arguments for both restricted-filesystem and full-filesystem sandbox paths.
- Update the Bubblewrap argument tests to cover the new namespace flag.

GitOrigin-RevId: 61fb1d5150d09626a3b6ee7a9c6a508108c52e80
```

pi:anthropic/claude-haiku-4-5:lean:off (2565 ms):
```
Add IPC namespace isolation to Linux sandbox processes

The `--unshare-ipc` flag is added to both full filesystem and
restricted filesystem Bubblewrap sandbox configurations to isolate
inter-process communication namespaces, improving sandbox security.
```

pi:anthropic/claude-haiku-5-5:lean:low (1891 ms):
```
Unshare IPC namespace in Linux bubblewrap sandboxes

Add --unshare-ipc to both the full-filesystem and the default bwrap
argument builders, so sandboxed processes get their own System V IPC
and POSIX message queue namespace instead of sharing the host's.
```

pi:openai/gpt-5.6-luna:lean:low (1567 ms):
```
Unshare IPC namespace in Linux sandboxes
```

pi:anthropic/claude-haiku-4-5:naive (10266 ms):
```
Add IPC namespace isolation to Linux sandbox
```

claude:claude-haiku-4-5:safe (2190 ms):
```
Add IPC namespace isolation to Linux sandbox processes

Enable `--unshare-ipc` in Bubblewrap sandbox configuration to isolate
inter-process communication resources. This prevents sandboxed processes
from accessing the host's shared memory, message queues, and semaphores,
improving sandbox security posture alongside existing user, PID, and
network namespace isolation.
```

claude:claude-haiku-5-5:safe:low (2429 ms):
```
Add --unshare-ipc to Linux sandbox bwrap invocations

Isolate System V IPC and POSIX message queues from the host by
unsharing the IPC namespace in both the full-filesystem and
restricted bubblewrap flag builders.
```

codex:gpt-5.6-luna:lean:low (2392 ms):
```
Unshare IPC namespaces in Linux sandboxes
```

## codex-4 (diff 2532 chars, git 272 ms)

Actual:
```
Prevent Node REPL auth tokens from reaching child processes (#39301)

## What changed

- Add `NODE_REPL_AUTH_TOKEN` to the environment variables that model-reachable child processes cannot inherit.
- Remove the variable case-insensitively after shell environment policy overrides and from explicitly configured child command environments.
- Extend the environment scrubber tests to cover inherited and configured forms of the token.

GitOrigin-RevId: 716c65e0a9e222f705c226b7c86545251d3ea580
```

pi:anthropic/claude-haiku-4-5:lean:off (1454 ms):
```
Prevent Node REPL auth tokens from reaching child processes
```

pi:anthropic/claude-haiku-5-5:lean:low (1782 ms):
```
Prevent NODE_REPL auth token from reaching child processes

The NODE_REPL_AUTH_TOKEN environment variable is a credential, so it
should be scrubbed from model-reachable child processes like the other
non-inheritable auth variables. Add it to NON_INHERITABLE_ENV_VARS and
cover it in the scrubber tests, including case-insensitive matching on
Windows-style names.
```

pi:openai/gpt-5.6-luna:lean:low (1533 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

pi:anthropic/claude-haiku-4-5:naive (5514 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

claude:claude-haiku-4-5:safe (1640 ms):
```
Prevent Node REPL auth tokens from reaching child processes
```

claude:claude-haiku-5-5:safe:low (2001 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

codex:gpt-5.6-luna:lean:low (2599 ms):
```
Prevent NODE_REPL_AUTH_TOKEN from reaching child processes
```

## codex-5 (diff 3321 chars, git 92 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (1801 ms):
```
Increase MCP tool name length limit from 64 to 128 bytes

Update the maximum tool name length constant and adjust tests to reflect
the new limit. This allows for longer, more descriptive MCP tool names
while staying within model API constraints.
```

pi:anthropic/claude-haiku-5-5:lean:low (2029 ms):
```
Raise MCP model-visible tool name limit to 128 bytes

The Responses API accepts longer function names than the 64-byte cap
we were enforcing, so tool names were being hashed and truncated
unnecessarily. Raise MAX_TOOL_NAME_LENGTH to 128 and update the tests
to cover the new boundary: a name that fills exactly 128 bytes is kept
as-is, and one byte longer is shortened.
```

pi:openai/gpt-5.6-luna:lean:low (2283 ms):
```
Increase MCP model-visible tool name limit to 128 bytes

Update tool name normalization and tests to support the Responses API's
128-byte name limit while preserving uniqueness for long names.
```

pi:anthropic/claude-haiku-4-5:naive (6502 ms):
```
Increase MCP tool name length limit to 128 bytes
```

claude:claude-haiku-4-5:safe (2236 ms):
```
Increase MCP tool name length limit from 64 to 128 bytes

Update the maximum tool name length constraint to align with the
Responses API specification. Adjust tests to verify behavior at the new
boundary conditions.
```

claude:claude-haiku-5-5:safe:low (2354 ms):
```
Raise MCP tool name length limit from 64 to 128 bytes

The Responses API accepts longer function names than the 64-byte
limit we were enforcing, so hashing kicked in too early. Raise the
cap to 128 and update the boundary tests to cover 128 and 129 bytes.
```

codex:gpt-5.6-luna:lean:low (2644 ms):
```
Increase MCP model-visible tool name limit to 128 bytes

Update normalization tests for the Responses API name-length boundary and
long tool names.
```

## codex-6 (diff 4055 chars, git 90 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (1912 ms):
```
Preserve Windows sandbox proxy settings for Guardian internal sessions

Guardian internal sessions should preserve proxy settings rather than
reconciling them, as they operate in a controlled environment where
proxy configuration should not be modified. This change makes the proxy
settings mode conditional on the session source type.
```

pi:anthropic/claude-haiku-5-5:lean:low (1871 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Internal Guardian sessions were reconciling Windows sandbox proxy
settings like normal threads. Keep the settings as they are for
Guardian so the reviewer runs under the same proxy configuration as
its parent instead of re-deriving it.
```

pi:openai/gpt-5.6-luna:lean:low (2139 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Add coverage ensuring internal Guardian sessions preserve existing Windows
sandbox proxy settings while regular sessions continue reconciling them.
```

pi:anthropic/claude-haiku-4-5:naive (8881 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions
```

claude:claude-haiku-4-5:safe (2346 ms):
```
Preserve Windows sandbox proxy settings for Guardian internal sessions

Guardian internal sessions should preserve proxy settings rather than
reconcile them to avoid interfering with the sandbox environment. This
change makes the Windows sandbox proxy settings mode dependent on the
session source, using Preserve mode for Guardian sessions and Reconcile
mode for all others.
```

claude:claude-haiku-5-5:safe:low (1967 ms):
```
Use Guardian sandbox proxy settings for internal sessions
```

codex:gpt-5.6-luna:lean:low (2653 ms):
```
Preserve Windows sandbox proxy settings for Guardian sessions

Add coverage to verify internal Guardian sessions preserve existing proxy
settings while regular sessions continue to reconcile them.
```

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

pi:anthropic/claude-haiku-4-5:lean:off (2186 ms):
```
Move text helper serialization test to code-mode-runtime

The test for the text helper's object serialization capability is more
appropriately located in the code-mode-runtime service tests where the
behavior is directly tested, rather than in the integration tests. This
reduces redundancy and improves test organization by keeping unit-level
behavior tests closer to the implementation.
```

pi:anthropic/claude-haiku-5-5:lean:low (1906 ms):
```
Move text helper and image helper error tests to code-mode runtime

The end-to-end core tests for the text() and image() helpers covered
behavior that the code-mode runtime tests can check directly. Add a
runtime test for serializing objects through text() and remove the
core suite tests that duplicated runtime coverage.
```

pi:openai/gpt-5.6-luna:lean:low (1917 ms):
```
Move code mode helper tests into runtime unit tests
```

pi:anthropic/claude-haiku-4-5:naive (22843 ms):
```
Move text serialization test to code-mode runtime unit tests
```

claude:claude-haiku-4-5:safe (2498 ms):
```
Move text serialization test to code mode runtime

Move the test for the text helper's object serialization capability from
the integration test suite to the unit tests in code-mode-runtime. This
consolidates related tests in the same location and removes redundant
coverage of the same functionality across test layers.
```

claude:claude-haiku-5-5:safe:low (2596 ms):
```
Move code-mode serialized text and image helper tests to runtime
```

codex:gpt-5.6-luna:lean:low (2408 ms):
```
Move text serialization coverage to code mode runtime tests
```

## codex-8 (diff 5608 chars, git 162 ms)

Actual:
```
Use in-process parsing for PowerShell command classification (#39602)

## What changed

- Route PowerShell wrapper extraction and Windows safe-command classification through the tree-sitter lowerer.
- Compile the PowerShell AST subprocess parser only in tests, where it remains available as an oracle.

GitOrigin-RevId: 3690bc32e8987ac9de820ef39ff7401d98ea8d83
```

pi:anthropic/claude-haiku-4-5:lean:off (4200 ms):
```
Consolidate PowerShell parsing to use Tree-sitter lowerer exclusively

Remove the PowerShell AST parser from production code paths and make it
available only as a test oracle. Update Windows safe-command logic and
the PowerShell command extraction to use the Tree-sitter lowerer
consistently, eliminating the need to track the invoked PowerShell
variant for parsing decisions.
```

pi:anthropic/claude-haiku-5-5:lean:low (2072 ms):
```
Stop shelling out to PowerShell for command parsing

PowerShell command classification now uses the in-process Tree-sitter
lowerer instead of spawning powershell.exe/pwsh to build an AST. The
subprocess parser is kept only as a test oracle and is no longer
compiled into production code.

Inline -Command scripts that the Tree-sitter lowerer cannot represent
are therefore no longer classified as safe, and the tests that relied
on the AST parser's behavior for those constructs were removed.
```

pi:openai/gpt-5.6-luna:lean:low (1625 ms):
```
Use Tree-sitter PowerShell parsing for command safety
```

pi:anthropic/claude-haiku-4-5:naive (11099 ms):
```
[codex] Remove PowerShell AST parser from production code
```

claude:claude-haiku-4-5:safe (2604 ms):
```
Stop using PowerShell AST parser for Windows command safety

Replace the PowerShell AST parser with the Tree-sitter lowerer for
command classification. This simplifies the safety logic by using a
single parsing approach and removes the need to invoke the specific
PowerShell executable variant. The AST parser is retained as a test
oracle but is no longer compiled into production.
```

claude:claude-haiku-5-5:safe:low (1796 ms):
```
Switch PowerShell command parsing to the in-process Tree-sitter lowerer
```

codex:gpt-5.6-luna:lean:low (2442 ms):
```
Use Tree-sitter PowerShell lowering for command safety
```

## codex-9 (diff 6246 chars, git 171 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2333 ms):
```
Preserve numeric and string bounds in reserved tool schemas

Reserved tool declarations like history and notes require parameter
constraints to be retained when exposed to the model. Add support for
serializing minimum, maximum, and maxLength in JsonSchema, and update
schema inference to recognize these keywords as type indicators so they
are preserved through parsing and serialization.
```

pi:anthropic/claude-haiku-5-5:lean:low (2065 ms):
```
Preserve numeric and string bounds in tool input schemas

Reserved history and notes tools declare parameter bounds such as
integer minimum/maximum and string maxLength. The schema parser dropped
these keywords, so the model received unconstrained parameters.

Add minimum, maximum, and maxLength fields to JsonSchema so they survive
parsing and serialization, including exact integer values beyond f64
precision. Infer a string type from maxLength when no type is given.
```

pi:openai/gpt-5.6-luna:lean:low (1958 ms):
```
Preserve parameter bounds in reserved tool schemas

Retain numeric minimum and maximum values and string maxLength constraints
when serializing tool input schemas, including reserved history and notes
tools. Add regression coverage for schema parsing and app-server requests.
```

pi:anthropic/claude-haiku-4-5:naive (16736 ms):
```
fix: preserve bounds in tool input schemas
```

claude:claude-haiku-4-5:safe (2340 ms):
```
Preserve numeric and string bounds in reserved tool schemas

Reserved tools like history and notes need to maintain their parameter
constraints when exposed to the model. Add support for serializing
minimum, maximum, and maxLength constraints in JsonSchema, and update
schema sanitization to infer string type from maxLength keyword.
```

claude:claude-haiku-5-5:safe:low (2393 ms):
```
Preserve JSON schema bounds for reserved tool declarations

Keep minimum, maximum, and maxLength in tool input schemas so the
history and notes tools retain their parameter constraints in model
requests. Schemas with maxLength now infer as strings.
```

codex:gpt-5.6-luna:lean:low (2582 ms):
```
Preserve bounds in reserved tool schemas
```

## codex-10 (diff 7093 chars, git 104 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2311 ms):
```
Handle standard invalid_grant error code as permanent token failure

RFC 6749 reports an unusable refresh token as invalid_grant without
preserving the legacy expired/reused/revoked subtype. Treat this as a
terminal condition when returned with a 400 status code, preventing
unnecessary retry attempts while distinguishing from other bad request
errors that should be retried.
```

pi:anthropic/claude-haiku-5-5:lean:low (2010 ms):
```
Treat standard invalid_grant refresh failures as permanent

A 400 response with error "invalid_grant" (RFC 6749) means the refresh
token is unusable, but it did not carry the legacy expired, reused, or
revoked code, so it was classified as Other and retried. Classify it as
a permanent failure with the generic reason so the stored credentials
are not retried on every request.

Other 400 responses still fall through to the transient path and are
not cached as permanent. Tests cover both cases.
```

pi:openai/gpt-5.6-luna:lean:low (1820 ms):
```
Handle standard invalid_grant refresh failures as permanent
```

pi:anthropic/claude-haiku-4-5:naive (12885 ms):
```
Treat invalid_grant errors as permanent refresh failures
```

claude:claude-haiku-4-5:safe (2778 ms):
```
Treat RFC 6749 invalid_grant as permanent token refresh failure

When the OAuth server returns a 400 Bad Request with error code
invalid_grant, treat it as a permanent failure even though it lacks the
legacy subtype information. This prevents unnecessary retry loops when
the refresh token is unusable.

Add test cases to verify that standard invalid_grant failures don't
trigger retries, while other 400 errors continue to be treated as
transient failures.
```

claude:claude-haiku-5-5:safe:low (1886 ms):
```
Classify invalid_grant 400 refresh failures as permanent
```

codex:gpt-5.6-luna:lean:low (2359 ms):
```
Handle standard invalid_grant refresh failures as permanent
```

## codex-11 (diff 8342 chars, git 92 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2328 ms):
```
Preserve Guardian denial rationale and cancellations in strict auto-review

Guardian denials and cancellations now include structured rationale in the
approval metadata instead of generic decline messages. This allows agents to
understand specific rejection reasons and avoid circumvention attempts.

The strict auto-review validator now accepts Decline and Cancel actions with
empty content from Guardian reviewers, treating them as canonical decisions
that should be preserved in the elicitation response.
```

pi:anthropic/claude-haiku-5-5:lean:low (2096 ms):
```
Preserve Guardian denials and cancellations for MCP elicitations

Strict auto-review used to drop Guardian denials and aborts, so they
fell through to the user-facing flow. The elicitation manager now
accepts decline and cancel responses that carry the auto_review
reviewer metadata but no content, and the session forwards denied,
timed-out, and aborted Guardian decisions as elicitation responses.

The fallback decline message is reworded to tell the model to ask the
user for explicit approval before proceeding.
```

pi:openai/gpt-5.6-luna:lean:low (1572 ms):
```
Preserve Guardian denials and cancellations in MCP elicitation reviews
```

pi:anthropic/claude-haiku-4-5:naive (10707 ms):
```
Preserve Guardian denials in MCP elicitation
```

claude:claude-haiku-4-5:safe (2323 ms):
```
Preserve Guardian denials and cancellations in strict auto-review

Guardian review decisions (deny, cancel, timeout, abort) should be
propagated as elicitation responses with their metadata, not treated as
missing decisions. This ensures the model receives complete rejection
rationales and policy violation explanations rather than generic decline
messages.
```

claude:claude-haiku-5-5:safe:low (2046 ms):
```
Guardian elicitation review: preserve denials and cancellations

Guardian denials and cancellations returned from strict auto-review
were dropped, so the elicitation fell through instead of reaching the
MCP server with the reviewer's decision. Keep these responses intact
and forward the Guardian rationale to the server.
```

codex:gpt-5.6-luna:lean:low (2889 ms):
```
Preserve Guardian denials and cancellations in MCP elicitation
```

## codex-12 (diff 9370 chars, git 94 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (3202 ms):
```
Retry provider auth command after initial resolution failure

When a provider auth command initially fails to resolve, the subsequent
401 response from the server should trigger a retry of the command
rather than treating the failure as permanent. This allows recovery
from transient command execution issues.

Update the unauthorized recovery logic to retry external auth
resolution when the initial resolution failed, and adjust the
condition for determining whether refreshable external auth is
available to include cases where auth is not yet cached.
```

pi:anthropic/claude-haiku-5-5:lean:low (1895 ms):
```
Allow external bearer auth to recover from initial resolution failure

When the external provider auth command failed on the first resolution,
no auth was cached and unauthorized recovery was unavailable, so the
request could not retry the command after a 401. Recovery now runs for
external auth even when nothing is cached yet, and the refresh path
handles the no-cached-auth case by asking the external provider.
```

pi:openai/gpt-5.6-luna:lean:low (1652 ms):
```
Retry external auth resolution after initial failure during recovery
```

pi:anthropic/claude-haiku-4-5:naive (6934 ms):
```
Recover from initial provider auth command failures during unauthorized recovery
```

claude:claude-haiku-4-5:safe (2433 ms):
```
Allow external auth provider command to recover from initial resolution failures

When an external auth provider command fails initially, the recovery
mechanism should retry resolving the command after receiving a 401
response. Previously, recovery only worked if initial resolution
succeeded. Now recovery can retry even if the first attempt failed.
```

claude:claude-haiku-5-5:safe:low (1714 ms):
```
Allow refresh recovery when provider auth command starts failing
```

codex:gpt-5.6-luna:lean:low (2405 ms):
```
Retry external auth recovery after initial provider failure
```

## codex-13 (diff 10844 chars, git 92 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2202 ms):
```
Assign deterministic IDs to Responses Lite prefix items

Generate stable identifiers for AdditionalTools and base instruction
items in Responses Lite requests using thread ID and payload hash.
This ensures prefix items maintain consistent IDs across retries and
resumed sessions, enabling proper incremental updates when resuming
a conversation.
```

pi:anthropic/claude-haiku-5-5:lean:low (2338 ms):
```
Stabilize Responses Lite prefix item IDs across requests

Responses Lite sends the tool list and base instructions as input items
on every request, so they previously had no ID. That made the server
unable to match them for incremental websocket requests and caused the
prefix to be re-sent in full.

Derive deterministic IDs for these prefix items from the thread ID and
the item payload. Identical content in the same thread yields the same
ID, which keeps retries and resumed sessions stable, while changed tools
or instructions get a new ID. Different threads never share IDs.
```

pi:openai/gpt-5.6-luna:lean:low (1546 ms):
```
Stabilize Responses Lite prefix item IDs across requests
```

pi:anthropic/claude-haiku-4-5:naive (9962 ms):
```
Assign stable IDs to Responses Lite prefix items

Prefix items (base instructions and tools) are rebuilt on every
request. Generate deterministic IDs using v5 UUIDs based on the
thread ID and payload content so that retries and resumed sessions
preserve their identity across requests.
```

claude:claude-haiku-4-5:safe (2760 ms):
```
Record prompt-only response items with stable IDs based on thread and payload

Assign stable IDs to automatically-generated prefix items (additional tools
and base instructions) in Responses Lite requests. These IDs are derived from
the thread ID and the item's visible payload, ensuring that the same items
retain their identity across retries and resumed sessions while changing when
the content or tools are updated.
```

claude:claude-haiku-5-5:safe:low (1667 ms):
```
Stabilize stable Responses Lite prefix item ids
```

codex:gpt-5.6-luna:lean:low (2599 ms):
```
Preserve Responses Lite prefix item IDs across requests

Generate stable IDs for tools and base instructions by thread and payload
to support incremental requests and resumed sessions.
```

## codex-14 (diff 12306 chars, git 91 ms)

Actual:
```
Move relay helpers into exec-server test support (#40712)

## What changed

- Move the reusable WebSocket relay, registration, frame capture, and encryption assertion helpers into `codex-exec-server-test-support`.
- Re-export the helpers from the existing relay test module so its callers keep the same interface.
- Add the Cargo dependencies and Bazel proto compile data required by the shared support module.

GitOrigin-RevId: 0383149c79ef86cb5e64a09baec41332f9eec4c6
```

pi:anthropic/claude-haiku-4-5:lean:off (2182 ms):
```
Extract relay test utilities into a shared support crate

Move relay testing functions from the common test module into a
dedicated `codex-exec-server-test-support` crate. This allows other
tests and crates to reuse these utilities without duplicating code.
```

pi:anthropic/claude-haiku-5-5:lean:low (2366 ms):
```
Move exec-server relay test helpers into the support crate

The relay test helpers (websocket accept, proxying, registry key lookup,
and encryption assertions) were private to one test binary. Move them
into the exec-server test support crate so other test binaries can reuse
the same relay harness without duplicating it.

The protobuf module is now exported from the exec-server crate and
compiled into the support crate, so the generated relay types are shared
rather than included by path from two places.
```

pi:openai/gpt-5.6-luna:lean:low (1770 ms):
```
Extract relay test utilities into shared support crate
```

pi:anthropic/claude-haiku-4-5:naive (5631 ms):
```
Extract relay test utilities into test support crate
```

claude:claude-haiku-4-5:safe (2410 ms):
```
Extract relay test utilities into a dedicated support crate

Move shared relay test helpers from the common test module into
a reusable test support library. This allows other tests to use
these utilities without duplicating code. The support crate now
exposes functions for WebSocket handling, frame proxying, and
encryption assertion.
```

claude:claude-haiku-5-5:safe:low (1714 ms):
```
Move relay test helpers into exec-server test support crate
```

codex:gpt-5.6-luna:lean:low (2822 ms):
```
Share relay test utilities across exec-server integration tests
```

## codex-15 (diff 13298 chars, git 85 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2649 ms):
```
Reconcile sandbox context with turn environment in tool execution

Remove TODOs that are now resolved by using TurnEnvironment for sandbox
configuration. The turn environment's sandbox context now properly tracks
the Windows sandbox level override alongside other environment-specific
settings, ensuring consistency across patch safety assessment, command
execution, and settings restoration.

Also add a test verifying that Windows sandbox level overrides are
correctly restored when resuming a thread.
```

pi:anthropic/claude-haiku-5-5:lean:low (1893 ms):
```
Use turn environment sandbox config for Windows and legacy landlock

Sandbox selection, approval safety checks, and MCP invalidation read
Windows sandbox level and legacy landlock from the turn environment's
config instead of the turn context. Restored thread settings now keep
the Windows sandbox level override so resumed threads do not fall back
to the base config.
```

pi:openai/gpt-5.6-luna:lean:low (1801 ms):
```
Bind sandbox configuration to turn environments

Ensure tool execution, patch application, escalation, and MCP invalidation
use the selected turn environment's sandbox settings. Restore Windows sandbox
overrides when resuming threads and add coverage for the restored setting.
```

pi:anthropic/claude-haiku-4-5:naive (9277 ms):
```
Reconcile sandbox configuration with TurnEnvironment
```

claude:claude-haiku-4-5:safe (2484 ms):
```
Reconcile sandbox configuration with TurnEnvironment

Use TurnEnvironment to access sandbox configuration consistently across
tools and handlers, rather than accessing turn context or config directly.
This ensures all sandbox-related settings, including windows_sandbox_level
overrides, are applied uniformly and restored correctly across session
resume operations.
```

claude:claude-haiku-5-5:safe:low (2119 ms):
```
Move Windows sandbox level and legacy landlock to the turn environment

Sandbox backend selection, sandbox policy, and the unified exec and apply_patch paths now read windows_sandbox_level and use_legacy_landlock from the selected turn environment's config instead of the turn context. Thread settings restore also keeps the Windows sandbox override, and MCP settings invalidation tracks changes to it.
```

codex:gpt-5.6-luna:lean:low (2432 ms):
```
Use turn environment for sandbox settings
```

## codex-16 (diff 15161 chars, git 97 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2216 ms):
```
Track built-in control tool calls in analytics for multi-agent v2

Add analytics tracking for spawn_agent tool calls in multi-agent v2
to measure execution duration and capture tool outcomes alongside
other built-in control tools. Track both successful spawns and
failures to provide complete visibility into agent orchestration.
```

pi:anthropic/claude-haiku-5-5:lean:low (2125 ms):
```
Track spawn_agent calls in analytics as collab tool call events

MultiAgentV2 spawn_agent calls were not reported to analytics, so
sub-agent tool usage was missing from turn metrics. Emit an item
started/completed pair for each spawn, carrying the receiver thread,
agent state, and terminal status.

Also count each collab tool call item once per turn, since started and
completed notifications share an id, and report execution duration for
tool items from the observed start and completion times.
```

pi:openai/gpt-5.6-luna:lean:low (1687 ms):
```
Track multi-agent spawn calls in analytics
```

pi:anthropic/claude-haiku-4-5:naive (11570 ms):
```
Track collaborative agent tool calls in analytics

Add tracking for collaborative agent tool calls (spawn_agent) with
detailed information including status, thread IDs, and agent states.
Fix deduplication of subagent tool call counts and execution duration
calculation in analytics events.
```

claude:claude-haiku-4-5:safe (2309 ms):
```
Track collab agent tool calls in analytics

Add tracking of spawn_agent tool calls through the analytics client.
Track both successful spawns with agent state and failed spawns with
error information. Include execution duration and deduplicate subagent
tool calls in turn metrics.
```

claude:claude-haiku-5-5:safe:low (1978 ms):
```
Track collab spawn tool calls and fix subagent turn counts
```

codex:gpt-5.6-luna:lean:low (2475 ms):
```
Track multi-agent tool calls in analytics
```

## codex-17 (diff 17587 chars, git 117 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (3725 ms):
```
Implement scrollback strategy abstraction for terminal-safe viewport growth

Add a `ScrollbackStrategy` enum to encapsulate terminal-specific behaviors for
growing the viewport and inserting history. This replaces the boolean `is_zellij`
field with a more flexible approach that handles Windows Terminal and other
terminals that need full-screen scrolling instead of partial DEC scroll regions.

The strategy detects the terminal type at startup and provides methods to:
- Select the appropriate history insertion mode based on terminal and wrap policy
- Grow the viewport using terminal-safe techniques

For Windows Terminal and terminals with unreliable partial scroll regions, use
full-screen scrolling which preserves terminal-native scrollback. For standard
terminals and Zellij (except when using terminal-wrapped history), use the more
efficient DEC scroll region approach.
```

pi:anthropic/claude-haiku-5-5:lean:low (2189 ms):
```
Add full-screen scrollback strategy for Windows Terminal

Windows Terminal drops rows when a partial DEC scroll region is used to make room for the viewport or to insert history, so stale composer rows never reach scrollback. Introduce a ScrollbackStrategy that selects a full-screen path (clear the stale viewport, then scroll the whole screen with CRLF) for Windows Terminal and for terminal-wrapped history under Zellij. Standard and Zellij viewport growth keep the existing scroll-region behavior.
```

pi:openai/gpt-5.6-luna:lean:low (1650 ms):
```
Preserve scrollback in Windows Terminal and Zellij
```

pi:anthropic/claude-haiku-4-5:naive (10660 ms):
```
Make scrollback strategy terminal-aware

Replace the is_zellij boolean with a ScrollbackStrategy enum that handles
Standard, Zellij, and FullScreen strategies. Use full-screen scrolling
for Windows Terminal and terminal-wrapped history in Zellij to preserve
terminal-native scrollback when partial scroll regions are unreliable.
```

claude:claude-haiku-4-5:safe (3249 ms):
```
Implement scrollback strategies to handle terminal-specific history insertion

Add a new `ScrollbackStrategy` enum to handle different approaches for growing the
viewport and inserting history based on the terminal environment. Windows Terminal
and Zellij need full-screen scrolling to preserve their native scrollback when
partial scroll regions are unreliable.

Rename `InsertHistoryMode::ZellijRaw` to `FullScreen` to clarify its purpose
beyond Zellij compatibility. Move history insertion mode selection and viewport
growth logic into the strategy module for better maintainability.
```

claude:claude-haiku-5-5:safe:low (1753 ms):
```
Add full-screen scrollback strategy for Windows Terminal
```

codex:gpt-5.6-luna:lean:low (2384 ms):
```
Handle Windows Terminal scrollback safely
```

## codex-18 (diff 18883 chars, git 90 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2120 ms):
```
Derive sandbox policy context from executor environments

Add support for propagating temporary directories from executors to the
sandbox context, enabling proper resolution of `:tmpdir` policy entries.
The temporary directories are now captured from executor info responses
and carried through the turn environment, making them available when
constructing sandbox policies for tool execution.
```

pi:anthropic/claude-haiku-5-5:lean:low (2207 ms):
```
Cache executor temporary directories for `:tmpdir` resolution

Environments now cache the temporary directories reported by their
executor, either from the remote environment info or from local
detection. These are carried into the sandbox context sent to the
executor, so `:tmpdir` policy entries resolve against the executor that
owns them instead of being left unset.

A borrowed FileSystemSandboxPolicyContext exposes the cwd, workspace
roots, and temporary directories together, and the protocol keeps the
temporary directory list optional for transports that do not carry it.
```

pi:openai/gpt-5.6-luna:lean:low (1551 ms):
```
Cache executor temporary directories in sandbox policy context
```

pi:anthropic/claude-haiku-4-5:naive (10171 ms):
```
Add temporary directories to sandbox policy context
```

claude:claude-haiku-4-5:safe (2998 ms):
```
Propagate temporary directories through environment resolution and sandbox context

Add support for tracking executor-provided temporary directories through
environment resolution and including them in sandbox policy contexts. This
allows filesystem policies to correctly resolve `:tmpdir` entries across
both local and remote executors.

The change extracts temporary directory discovery from `EnvironmentInfo::local`
into a separate method that can be reused, passes temporary directories through
the environment resolution pipeline, and exposes them via the new
`FileSystemSandboxPolicyContext` struct for use during execution.
```

claude:claude-haiku-5-5:safe:low (2324 ms):
```
Carry temporary directories into executor filesystem sandbox context

The executor's temporary directories are now cached per environment and
passed through to filesystem sandbox contexts, so `:tmpdir` policy
entries resolve against the selected executor rather than the local
process.
```

codex:gpt-5.6-luna:lean:low (2374 ms):
```
Cache executor temporary directories in sandbox contexts
```

## codex-19 (diff 21167 chars, git 277 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2787 ms):
```
Expand OAuth discovery tests to cover redirects and cross-origin rejection

Add test coverage for same-origin redirect handling, cross-origin redirect
rejection, and redirect cycle detection. Refactor test helpers to reduce
duplication and improve clarity. Update HTTP client initialization to use
the standard test environment instead of manual construction.
```

pi:anthropic/claude-haiku-5-5:lean:low (2312 ms):
```
Add redirect coverage to MCP OAuth discovery tests

The discovery tests only exercised direct metadata responses. Add tests
for same-origin redirects being followed and for cross-origin and
redirect-cycle responses being rejected, so the OAuth discovery path
keeps its origin and loop checks covered.

Route all discovery calls through a shared local HTTP client helper
instead of building a RouteAwareHttpClient inline. Drop the executor
discovery comparison, which duplicated the local one.
```

pi:openai/gpt-5.6-luna:lean:low (1708 ms):
```
Expand OAuth discovery redirect coverage
```

pi:anthropic/claude-haiku-4-5:naive (12275 ms):
```
Expand OAuth discovery tests for redirect behavior

The test refactoring updates how OAuth discovery is tested by using a centralized
local HTTP client helper, adding support for testing same-origin metadata redirects,
and validating that cross-origin redirects and redirect cycles are properly rejected
in both resource and authorization metadata discovery paths.
```

claude:claude-haiku-4-5:safe (2806 ms):
```
Expand OAuth discovery redirect testing with cross-origin rejection

Add comprehensive tests for OAuth metadata redirect handling, including:
- Same-origin redirect following for both resource and authorization metadata
- Cross-origin redirect rejection for authorization metadata
- Redirect cycle detection with bounded limits
- Cross-origin redirect rejection for resource metadata

Introduce helper functions to reduce test duplication and improve clarity
around authorization request isolation and cross-origin validation.
```

claude:claude-haiku-5-5:safe:low (1781 ms):
```
Test: cover same-origin and cross-origin OAuth metadata redirects in MCP discovery
```

codex:gpt-5.6-luna:lean:low (2429 ms):
```
Expand OAuth discovery redirect coverage tests
```

## codex-20 (diff 23412 chars, git 90 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2405 ms):
```
Add skill scope and plugin attribution for executor skills

Executor skills from selected plugins are now attributed with their plugin identifier and marked with user skill scope. The selected plugin snapshot is tracked through the session and turn contexts, allowing executor skill catalogs to be enriched with plugin metadata.

This enables proper analytics reporting for executor skill invocations and establishes the connection between skills and their originating plugins.
```

pi:anthropic/claude-haiku-5-5:lean:low (2169 ms):
```
Attribute executor skills and MCP servers to their selected plugin

Selected executor plugins now record their root and plugin identity in a
thread-scoped snapshot. The skills extension uses this snapshot to tag
executor skills with their plugin ID and user scope, so skill invocation
analytics report the owning plugin instead of null.

The snapshot is filtered to roots that are ready for the current turn,
so stale plugin attributions do not leak into later turns.
```

pi:openai/gpt-5.6-luna:lean:low (2127 ms):
```
Attribute executor skills to selected plugins for analytics
```

pi:anthropic/claude-haiku-4-5:naive (10158 ms):
```
Attribute executor skills to their source plugins

Executor skills are now attributed to the plugins they originate from by
tracking selected plugins through the MCP runtime and session context.
Plugin identity is projected into skill catalogs, enabling skill
invocation analytics to record which plugin each skill came from.
```

claude:claude-haiku-4-5:safe (3032 ms):
```
Add selected plugin identity tracking to executor skills

Track plugin identities for executor skills by storing selected plugin
snapshots in thread extension data and attributing catalog entries to
their originating plugins. This enables analytics to distinguish skill
invocations from explicit executor plugins, including scope metadata for
proper tracking and reporting of plugin-provided skills.
```

claude:claude-haiku-5-5:safe:low (3009 ms):
```
Attribute executor skills and MCP plugins to their selected plugin
```

codex:gpt-5.6-luna:lean:low (2801 ms):
```
Attribute executor skills to selected plugins for analytics
```

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

pi:anthropic/claude-haiku-4-5:lean:off (2583 ms):
```
Add full approval review support to extension API

Split approval review into two paths: fast_decision for existing evidence
and full_review for structured host-owned requests. This allows extensions
to provide quick decisions without full review logic, or implement complete
assessment workflows. Both methods are optional with None as default, letting
contributors opt into one or both paths.
```

pi:anthropic/claude-haiku-5-5:lean:low (2656 ms):
```
Split approval review contributor into fast decision and full review

The ApprovalReviewContributor trait previously had one method,
contribute(), that only returned a fast decision from rendered prompt
text. Add explicit fast_decision() and full_review() methods so
extensions can provide a quick verdict from existing evidence, run a
full structured review of a host-owned approval request, or both.

Rename the registry lookup to fast_approval_decision() to match, and
add full_approval_review() that returns the first assessment claimed by
a contributor. The structured input carries the action, conversation
snapshot, thread and turn identifiers, and approval/retry reasons.
```

pi:openai/gpt-5.6-luna:lean:low (1614 ms):
```
Split fast approval decisions from full structured reviews
```

pi:anthropic/claude-haiku-4-5:naive (11377 ms):
```
Split approval review into fast decision and full review paths
```

claude:claude-haiku-4-5:safe (3362 ms):
```
Split approval review into fast decisions and full structured reviews

The approval review contribution now supports two distinct paths:

- `fast_decision()` returns cached decisions without performing a full review
- `full_review()` performs complete structured reviews with host-owned approval
  context including conversation history, action evidence, and retry reasons

Renamed the registry method from `approval_review()` to `fast_approval_decision()`
for clarity. Added new `ApprovalReviewInput`, `ApprovalAssessment`, and
`ApprovalReviewError` types to support the full review path with structured
access to approval context and standardized assessment results.
```

claude:claude-haiku-5-5:safe:low (1822 ms):
```
Refactor approval review contributor API: split fast decisions from full reviews
```

codex:gpt-5.6-luna:lean:low (2616 ms):
```
Split approval reviews into fast decisions and full assessments
```

## codex-22 (diff 28926 chars, git 90 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2044 ms):
```
Add customizable Guardian rejection and timeout messages via model catalog

Guardian now supports per-model rejection and timeout instructions in
the model catalog's auto_review messages. The acting model's catalog
configuration takes precedence over built-in default messages, allowing
organizations to customize approval rejection and timeout feedback.
```

pi:anthropic/claude-haiku-5-5:lean:low (2554 ms):
```
Use acting model's Guardian rejection and timeout instructions

Guardian denials and timeouts previously always returned the hardcoded
fallback text. Model catalogs can now supply `rejection_instructions` and
`timeout_instructions` under `auto_review`, so the message shown to the
agent matches the model that is acting on the request. The hardcoded
text remains the fallback when a value is absent. An empty string is
passed through as-is, letting a catalog suppress the extra text.

Timeout messages now take the acting model's `ModelInfo`, which is
threaded through the MCP elicitation, approval resolution, and shell
escalation paths.
```

pi:openai/gpt-5.6-luna:lean:low (1598 ms):
```
Use acting model instructions for Guardian decisions
```

pi:anthropic/claude-haiku-4-5:naive (10852 ms):
```
Respect model-specific Guardian timeout and rejection instructions

Add rejection_instructions and timeout_instructions fields to
AutoReviewMessages to allow models to customize the messages shown when
Guardian reviews time out or result in denials. Update guardian_timeout_message()
and rejection handling to use these model-specific values when available,
falling back to legacy defaults if not specified. Pass model_info through the
approval flow so Guardian decisions can access the acting model's configuration.
```

claude:claude-haiku-4-5:safe (2650 ms):
```
Support configurable Guardian rejection and timeout messages

Add rejection_instructions and timeout_instructions fields to
AutoReviewMessages so that catalog can override the default Guardian
denial and timeout messages per model. The acting model's instructions
are used when available, falling back to hardcoded defaults.

This enables better model-specific messaging when Guardian reviews are
denied or time out.
```

claude:claude-haiku-5-5:safe:low (2036 ms):
```
Make guardian rejection and timeout messages model-configurable
```

codex:gpt-5.6-luna:lean:low (2465 ms):
```
Use acting model instructions for Guardian reviews
```

## codex-23 (diff 31823 chars, git 89 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2704 ms):
```
Add skip-host-skill-discovery feature flag

Enable extensions to opt out of host skill discovery by implementing
`requires_host_skill_discovery()`. When the new feature flag is enabled
and no contributor requires host skills, skip the discovery phase during
session initialization and turn setup.

This allows skill providers like ExecutorSkillProvider to avoid redundant
host filesystem scans while preserving legacy behavior for registries
without skill contributors or those with host-dependent contributors.
```

pi:anthropic/claude-haiku-5-5:lean:low (1983 ms):
```
Add opt-out for host skill discovery when no host provider needs it

Introduce the SkipHostSkillDiscovery feature flag. When enabled and no
installed skill contributor requires host-owned skills, session startup
and turn context construction skip the host skill snapshot. Contributors
declare this through requires_host_skill_discovery(), which defaults to
true so existing extensions keep legacy discovery.
```

pi:openai/gpt-5.6-luna:lean:low (1710 ms):
```
Add opt-out for unnecessary host skill discovery
```

pi:anthropic/claude-haiku-4-5:naive (12847 ms):
```
Skip host skill discovery when not required by extensions
```

claude:claude-haiku-4-5:safe (3433 ms):
```
Add host skill discovery opt-out for executor-scoped providers

Register a new feature flag to allow skipping host skill discovery when
installed skill contributors (e.g., executor-only providers) don't depend
on it. Contributors declare their discovery requirements through a new
`requires_host_skill_discovery` callback that defaults to true for
backward compatibility.

The registry aggregates contributor requirements: discovery is skipped
only when the feature is enabled AND no contributor requires it. This
preserves repository skills for executor providers while allowing
orchestrator and other authority-scoped skills to operate independently.
```

claude:claude-haiku-5-5:safe:low (1999 ms):
```
Add opt-out for host skill discovery via extension hook
```

codex:gpt-5.6-luna:lean:low (3002 ms):
```
Skip host skill discovery when extensions do not require it
```

## codex-24 (diff 36705 chars, git 89 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (1631 ms):
```
Add reviewer configuration for Guardian sync approval workflow
```

pi:anthropic/claude-haiku-5-5:lean:low (2274 ms):
```
Add isolated config preparation for guardian sync reviewer

The guardian reviewer runs as an internal session that must not inherit the parent's developer instructions, MCP servers, apps, or memory. Build its StartThreadOptions with a read-only permission profile, a review model chosen from the parent's auto-review settings, and the policy template, leaving the session start to the host.
```

pi:openai/gpt-5.6-luna:lean:low (1867 ms):
```
Prepare isolated Guardian reviewer sessions and policy config

Add synchronous reviewer configuration that selects review models, preserves
effective network and environment restrictions, disables recursive features, and
loads the Guardian policy template. Include tests covering isolation,
read-only permissions, model overrides, and reasoning-effort fallback.
```

pi:anthropic/claude-haiku-4-5:naive (13015 ms):
```
Add Guardian sync reviewer configuration
```

claude:claude-haiku-4-5:safe (2972 ms):
```
Add sync reviewer configuration for Guardian extension

Introduce reviewer model selection and isolated thread configuration for the Guardian approval review extension. Adds a policy template markdown file that defines the security assessment framework, and implements logic to prepare review threads with read-only permissions, disabled features, and appropriate model settings. The reviewer inherits the parent session's configuration while enforcing isolation constraints necessary for safe approval decisions.
```

claude:claude-haiku-5-5:safe:low (1825 ms):
```
Add sync reviewer options for guardian reviewer sessions
```

codex:gpt-5.6-luna:lean:low (2256 ms):
```
Prepare isolated Guardian reviewer sessions safely
```

## codex-25 (diff 40675 chars, git 104 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (3846 ms):
```
Improve web link rendering in TUI with label styling and terminal detection

Add terminal-aware presentation of web links in markdown output. Supporting
terminals like Ghostty, Kitty, and VS Code now render web link labels with link
styling while hiding visible destinations, improving readability. Unknown
terminals and multiplexers retain visible destinations as a fallback.

Introduce HyperlinkParagraph widget that keeps hyperlink annotations aligned
with scrolled text, eliminating separate hyperlink application after rendering.
Add web_links module with terminal detection and presentation policy. Update
markdown rendering to style link labels and conditionally show destinations
based on terminal capabilities. Preserve inline formatting in styled labels
and ensure links survive history wrapping and table cell reflow.
```

pi:anthropic/claude-haiku-5-5:lean:low (2298 ms):
```
Hide web link destinations in label-only terminals

Terminals that support OSC 8 hyperlinks already make the label clickable, so printing the URL after it is redundant. For known terminals, render only the styled label and keep the target as a hyperlink. Multiplexers, screen/tmux, dumb and unknown terminals keep the visible destination so the URL is never lost.

Also style web link labels with the link style, and route all hyperlink-aware paragraph rendering through a shared HyperlinkParagraph so text and link annotations scroll and wrap together.
```

pi:openai/gpt-5.6-luna:lean:low (2571 ms):
```
Preserve terminal links in TUI Markdown rendering and scrolling

Add terminal-aware web link presentation, keeping labels clickable while
showing destinations in unsupported terminals. Preserve hyperlink metadata
through wrapping, tables, streaming output, and clipped transcript rendering
with a shared HyperlinkParagraph widget.
```

pi:anthropic/claude-haiku-4-5:naive (8787 ms):
```
Make TUI web link labels visually distinct and preserve destinations

Add terminal capability detection to intelligently hide web-link
destinations in terminals that support hyperlinks. Unify link rendering
through a new HyperlinkParagraph widget that keeps text and annotations
aligned during scrolling. Style link labels with cyan underline to match
destination styling, and ensure labels survive markdown and history
wrapping with consistent presentation.
```

claude:claude-haiku-4-5:safe (2667 ms):
```
Add terminal hyperlink styling to web link labels

Apply link styling to markdown link labels and preserve hyperlink metadata through text wrapping. Hide web link destinations in terminals with capable OSC 8 hyperlink support, keeping only the styled label text. Support both static and streaming markdown rendering with consistent link presentation policies.
```

claude:claude-haiku-5-5:safe:low (1950 ms):
```
Make TUI web link labels render without visible destinations on capable terminals
```

codex:gpt-5.6-luna:lean:low (2531 ms):
```
Preserve Markdown web links across TUI rendering and wrapping
```

## codex-26 (diff 46683 chars, git 88 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2886 ms):
```
Add user-input recording and validation to Guardian reviewers

Record genuine user answers from `request_user_input` tool calls before
post-tool hooks can replace or reject their output. Include these bounded,
role-labeled fragments in both synchronous and asynchronous Guardian
review prompts. Track authorization changes from user-input responses
separately from conversation rewrites, allowing reviews to detect stale
evidence when answers arrive.
```

pi:anthropic/claude-haiku-5-5:lean:low (2702 ms):
```
Treat user answers to request_user_input as trusted Guardian evidence

Guardian reviewers only saw synchronous review verdicts and tool
outputs, so a genuine user answer given mid-turn could not change
their authorization view. Record bounded user answers in the thread's
Guardian evidence, key them to the originating call, and include them
in both the synchronous and async reviewer prompts.

Answers count toward the authorization version, so a new answer
invalidates earlier synchronous decisions. Answers are recorded before
post-tool hooks run, so a hook cannot erase or hide them. Root-thread
answers are propagated to worker reviews through the root snapshot.
```

pi:openai/gpt-5.6-luna:lean:low (2618 ms):
```
Preserve Guardian evidence for user input across reviews

Add bounded, trusted user-input evidence to Guardian authorization state and
review prompts, ensuring genuine answers survive history truncation and
post-tool hooks while invalidating stale synchronous reviews. Extend root
worker propagation and coverage for empty, blocked, and hook-modified answers.
```

pi:anthropic/claude-haiku-4-5:naive (6960 ms):
```
Record and propagate user input responses in Guardian review evidence
```

claude:claude-haiku-4-5:safe (3226 ms):
```
Add Guardian review evidence for user input answers and root propagation

Record bounded, role-labeled user answers to genuine input requests before post-tool hooks can modify output. Include these trusted answers in both synchronous Guardian reviews and async classifier prompts, invalidating stale sync decisions when answers become available.

Propagate user input answers from root worker threads to parent reviews, tracking authorization changes through dedicated response counters that are independent of conversation history rewrites.
```

claude:claude-haiku-5-5:safe:low (1900 ms):
```
Guardian: record trusted user-input answers for reviewers
```

codex:gpt-5.6-luna:lean:low (2826 ms):
```
Preserve Guardian evidence across user input responses

Record trusted user answers and include them in Guardian reviews, so
reviews remain valid and root-worker authorization sees genuine input. Add
coverage for truncation, hooks, empty answers, and worker propagation.
```

## codex-27 (diff 52531 chars, git 98 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (3354 ms):
```
Add automatic conversation recaps when returning to unfocused tasks

Implement a recap system that generates brief summaries of conversation
progress when a user returns focus to a task after 3+ minutes of
inactivity. The system tracks completed turns, monitors terminal focus
state via FocusGained/FocusLost events, and ensures at least 2 new turns
between consecutive recaps. RecapState manages eligibility rules while
ThreadRecapHistoryCell renders the summaries with a labeled checkpoint
layout. Update all event handlers to process focus notifications.
```

pi:anthropic/claude-haiku-5-5:lean:low (2565 ms):
```
Add automatic conversation recaps for unfocused TUI sessions

The TUI now tracks terminal focus as its own event instead of folding
focus-gained into Draw and dropping focus-lost. When the terminal stays
unfocused after enough completed turns, the recap state becomes eligible
for a generated recap, so returning users can catch up quickly.

Focus events are forwarded to every event loop so prompts and overlays
handle them explicitly. Recap progress is kept per thread and survives
thread switching and replay.
```

pi:openai/gpt-5.6-luna:lean:low (1689 ms):
```
Add automatic conversation recaps when returning to the TUI
```

pi:anthropic/claude-haiku-4-5:naive (8713 ms):
```
Generate automatic recaps when conversation loses focus
```

claude:claude-haiku-4-5:safe (3379 ms):
```
Add conversation recap feature for unfocused tasks

Track when users switch away from active conversations and automatically
generate brief recaps once eligible conditions are met: at least three
completed turns, three minutes of inactivity, and focus loss. Recaps
summarize recent conversation history, changed files, and next steps in
at most 40 words to help users quickly resume context.
```

claude:claude-haiku-5-5:safe:low (2308 ms):
```
Add focus-aware conversation recap to the TUI

Track terminal focus events and generate an automatic recap when a
completed task has been unfocused for a while. Focus loss and gain are
now forwarded as TuiEvents instead of being dropped or treated as a
redraw.
```

codex:gpt-5.6-luna:lean:low (2958 ms):
```
Add automatic conversation recaps when the TUI loses focus
```

## codex-28 (diff 59843 chars, git 120 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (3663 ms):
```
Expose managed developer instructions in configuration requirements

Add support for requirements-owned developer instructions that are managed
separately from client-provided developer instructions. These instructions are
supplied via the `additional_developer_instructions` field in
`requirements.toml` or MDM and are validated to fit within a 10,000-token
limit including context markers.

The managed instructions are rendered as a separate developer message in each
request, automatically detecting when a policy has been updated or removed and
emitting appropriate notices. During agent forking, the managed policy is
preserved while sanitizing stale parent context, and only the current policy
is included after compaction rebuilds canonical context.
```

pi:anthropic/claude-haiku-5-5:lean:low (2080 ms):
```
Add managed additional developer instructions from requirements

Requirements can now supply additional_developer_instructions, which are injected as a separate managed developer message independent of the user's developer_instructions. The text is validated against the model-context budget at config load, is refreshed when the policy changes, and survives fork, compaction, resume, and rollback.
```

pi:openai/gpt-5.6-luna:lean:low (2122 ms):
```
Expose managed developer instructions in requirements
```

pi:anthropic/claude-haiku-4-5:naive (8633 ms):
```
Expose managed developer instructions from enterprise requirements
```

claude:claude-haiku-4-5:safe (3354 ms):
```
Expose managed developer instructions in config requirements

Add support for requirements-specific developer instructions that are kept separate from client-provided instructions. These managed instructions are included in every model request independently of ordinary developer instructions and persist through agent forks and compaction cycles.

The new `additional_developer_instructions` field in ConfigRequirements is populated from the requirements configuration and validated at config load time to ensure it fits within the 10,000-token context limit. When instructions change between requests, the system emits replacement or removal notices to keep the model informed of policy updates.
```

claude:claude-haiku-5-5:safe:low (2648 ms):
```
Expose additional developer instructions from requirements

Add an admin-managed additional_developer_instructions requirement. It is injected as a separate developer message, kept apart from ordinary developer_instructions, and validated against the context limit at config load. Fork and compaction paths now keep the current managed policy only once.
```

codex:gpt-5.6-luna:lean:low (2619 ms):
```
Expose managed developer instructions separately
```

## codex-29 (diff 76597 chars, truncated, git 106 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (4079 ms):
```
Add SanitizedGitUrl type to redact Git remote credentials

Git remote URLs often contain authentication credentials that must not
reach API responses, SQLite, or rollout files. Introduce a new type
that automatically sanitizes credentials during construction and use it
throughout the codebase for any field holding repository URLs.

The SanitizedGitUrl type:
- Parses Git URLs with gix-url to properly handle various formats
- Strips userinfo (username and password) from all URL schemes
- Rejects remote helpers with whitespace to prevent command injection
- Provides transparent serialization and deserialization
- Implements Ord for use in BTreeMaps and other collections

Update git-utils, protocol, app-server, state, rollout, thread-store,
analytics, cloud-tasks, and core modules to use SanitizedGitUrl for
repository URLs. Add comprehensive tests for credential redaction
across different URL formats and transport mechanisms.
```

pi:anthropic/claude-haiku-5-5:lean:low (2562 ms):
```
Sanitize Git remote URLs before they are stored or sent

Repository URLs can carry HTTPS credentials or tokens. Introduce a
SanitizedGitUrl type in codex-protocol that strips userinfo at
construction, and use it for GitInfo, rollout metadata, SQLite
thread metadata, thread/metadata/update patches, turn metadata headers,
and cloud-task environment detection. Credentials are then removed
before they reach API responses, databases, rollout files, or model
request headers. Existing rollouts and rows are sanitized on read.
```

pi:openai/gpt-5.6-luna:lean:low (2366 ms):
```
Sanitize Git remote URLs before persistence and outbound use

Implement credential-free Git URL handling across metadata, analytics,
environment detection, thread storage, and model request headers. Validate
and sanitize client-provided and legacy repository URLs, preserving repository
discovery while preventing credentials from reaching responses or persisted
state.
```

pi:anthropic/claude-haiku-4-5:naive (11807 ms):
```
Sanitize git remote URLs to prevent credential exposure

Repository URLs containing authentication credentials must not be
exposed in API responses, stored metadata, or debug output. Introduce
`SanitizedGitUrl` type that strips userinfo when parsing git remote
addresses, ensuring credentials are redacted before persisting or
transmitting metadata. Update all git URL handling in git-utils,
analytics, core, app-server, state management, and thread storage
to use the new type.
```

claude:claude-haiku-4-5:safe (3357 ms):
```
Add SanitizedGitUrl to remove credentials from Git remotes

Introduce a new SanitizedGitUrl type that strips authentication
credentials from Git remote URLs before storing them in metadata,
thread history, and API responses. This prevents sensitive tokens and
passwords from leaking into logs, SQLite databases, or outbound model
requests.

The sanitization happens automatically when Git URLs are parsed,
removing userinfo from HTTPS, SSH, and file:// schemes, and rejecting
remote helpers with embedded secrets. All existing code paths that
handle repository URLs now use SanitizedGitUrl to ensure credentials
are never persisted or transmitted.
```

claude:claude-haiku-5-5:safe:low (2622 ms):
```
Sanitize Git remote URLs before they leave the process

Client-supplied and locally discovered remote URLs can carry
userinfo such as tokens or passwords. Strip credentials at
construction via a SanitizedGitUrl type so that API responses,
SQLite rows, rollout files, cloud-task env detection, and model
request metadata never see them.
```

codex:gpt-5.6-luna:lean:low (2797 ms):
```
Sanitize Git remote URLs before persisting metadata
```

## codex-30 (diff 101984 chars, truncated, git 87 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (3153 ms):
```
Add step activation to apply live turn-settings updates

Enable model switching and other sparse settings changes to running turns
through a new `TurnSettings` operation. Implement validation against
current permissions and legacy approval/Guardian constraints that still
read from the initial turn context. Capture updated settings in step
snapshots for subsequent model invocations without affecting child
sessions or frozen initial settings.

Add the `step_model_switching` feature flag to control availability.
Include comprehensive tests for settings updates, validation failures,
and concurrent model lookups during activation.
```

pi:anthropic/claude-haiku-5-5:lean:low (2358 ms):
```
Add per-turn settings updates for running turns

Introduce Op::TurnSettings so a client can change the model, effort,
summary, or service tier of one live turn. The update is published for
later step captures only; steps already captured keep their snapshot.
The reply reports whether the update was applied, the target turn was
gone, or it was rejected.

Gate the feature behind the under-development step_model_switching
flag. While approvals and Guardian still read the admitted TurnContext,
reject destinations that would change approval policy, reviewer,
model-required authority, prefix-rule handling, or fallback metadata.
```

pi:openai/gpt-5.6-luna:lean:low (1545 ms):
```
Add atomic live turn settings updates with step activation safeguards
```

pi:anthropic/claude-haiku-4-5:naive (16099 ms):
```
Publish turn-level settings updates for step activation

Introduces turn-level settings updates that are captured as step-specific
snapshots, allowing dynamic changes to running turns without affecting
already-captured steps or future turns. Includes validation logic and
safety checks to ensure legacy-turn authorization remains consistent.
```

claude:claude-haiku-4-5:safe (3363 ms):
```
Add turn settings updates for live model switching

Implement restricted, mid-turn changes to step settings snapshots captured
at turn start. Users can now explicitly switch models during a running turn
when the StepModelSwitching feature is enabled.

The feature introduces a new TurnSettings operation that applies sparse
updates to only the named running turn, leaving child sessions and frozen
initial settings unchanged. Updates are validated against the current live
configuration and legacy safety constraints to ensure approvals, Guardian
policies, and model metadata remain compatible with the admitted turn context.
```

claude:claude-haiku-5-5:safe:low (1761 ms):
```
Session: add turn settings updates for running turns
```

codex:gpt-5.6-luna:lean:low (2463 ms):
```
Add live per-turn settings updates with atomic safety validation
```

## intellij-community-1 (diff 387 chars, git 943 ms)

Actual:
```
misc codeowners: give IJPL the community productLayout package

The product model under community/platform/build-scripts/src/org/jetbrains/intellij/build/productLayout belongs to IJPL.
The OWNERSHIP syntax has no negation pattern. A later pattern rule in the parent file overrides the IJ Build Scripts Maintainers default for that package.
```

pi:anthropic/claude-haiku-4-5:lean:off (1450 ms):
```
[platform] Update OWNERSHIP file to add IJPL as owner of productLayout
```

pi:anthropic/claude-haiku-5-5:lean:low (1577 ms):
```
Add OWNERSHIP mapping for productLayout build scripts

Assign the productLayout package under platform/build-scripts to the
IJPL owners so that code review requests reach the right team.
```

pi:openai/gpt-5.6-luna:lean:low (1832 ms, the IDE drops IJI-3163):
```
IJI-3163 add product layout ownership mapping
```

pi:anthropic/claude-haiku-4-5:naive (13517 ms):
```
Add IJPL ownership mapping for productLayout
```

claude:claude-haiku-4-5:safe (1605 ms):
```
codeowners mapping: add IJPL ownership for productLayout
```

claude:claude-haiku-5-5:safe:low (1748 ms):
```
Add OWNERSHIP entry for build-scripts productLayout code
```

codex:gpt-5.6-luna:lean:low (2733 ms, the IDE drops IJI-3163):
```
IJI-3163 codeowners mapping example
```

## intellij-community-2 (diff 938 chars, git 648 ms)

Actual:
```
[jps] rename builder to mitigate TW-104697
```

pi:anthropic/claude-haiku-4-5:lean:off (1424 ms):
```
[jps build] capitalize project dependencies resolver message
```

pi:anthropic/claude-haiku-5-5:lean:low (1763 ms):
```
Capitalize builder name in dependency resolver

The builder name is shown in the build UI, so it should match the title case used by other builder names.
```

pi:openai/gpt-5.6-luna:lean:low (2479 ms):
```
Capitalize Project Dependencies Resolver builder name
```

pi:anthropic/claude-haiku-4-5:naive (11896 ms):
```
[jps] Capitalize Project Dependencies Resolver message
```

claude:claude-haiku-4-5:safe (1586 ms):
```
[jps build] capitalize project dependencies resolver message
```

claude:claude-haiku-5-5:safe:low (1631 ms):
```
Project Dependencies Resolver: fix builder name capitalization
```

codex:gpt-5.6-luna:lean:low (2682 ms):
```
[jps] Capitalize project dependencies resolver name
```

## intellij-community-3 (diff 1021 chars, git 1171 ms)

Actual:
```
IDEA-392279 [java-psi] Follow-up: remove redundant instantiateWith call
```

pi:anthropic/claude-haiku-4-5:lean:off (1640 ms):
```
inference: simplify nullability check in incorporation phase

Remove unnecessary instantiation and intermediate variable by using
the usage nullability directly in the comparison and assignment.
```

pi:anthropic/claude-haiku-5-5:lean:low (2238 ms):
```
Simplify nullability propagation in inference incorporation

The bound's nullability was recomputed via instantiatedWith() before being
compared and applied. The usage nullability is now applied directly, which
removes the intermediate step and the extra comparison against the old
value.
```

pi:openai/gpt-5.6-luna:lean:low (1815 ms):
```
inference: simplify nullability incorporation
```

pi:anthropic/claude-haiku-4-5:naive (5105 ms):
```
inference: simplify nullability check
```

claude:claude-haiku-4-5:safe (1585 ms):
```
cleanup: simplify nullability comparison in InferenceIncorporationPhase
```

claude:claude-haiku-5-5:safe:low (2371 ms, the IDE drops IDEA-392279):
```
IDEA-392279 is not in the branch name here, and no branch name is given, so no issue id goes in the summary. The recent commits use a "[java-psi]" scope tag and English, mood is imperative-ish capitalized. The change simplifies bound nullability: instead of composing usage nullability with the bound's nullability, it directly uses the usage nullability.

Summary: "[java-psi] Simplify nullability of inference bound with usage"
```

codex:gpt-5.6-luna:lean:low (2831 ms):
```
[inference] Preserve usage nullability when incorporating bounds
```

## intellij-community-4 (diff 1372 chars, git 202 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (1721 ms):
```
tests [editor]: verify split window selection and navigation

The test now validates that creating a vertical split copies the
selected tab to the new window and that window navigation methods
correctly return the split windows.
```

pi:anthropic/claude-haiku-5-5:lean:low (1751 ms):
```
tests [editor]: check both windows after vertical split

The test asserted only the previous window's selected file after a
vertical split. Also verify that the split copies the selected tab into
the new window and that the prev/next window links point at each other.
```

pi:openai/gpt-5.6-luna:lean:low (1537 ms):
```
tests [editor]: verify split window navigation and selection
```

pi:anthropic/claude-haiku-4-5:naive (5332 ms):
```
tests [editor]: verify window selection and navigation after split
```

claude:claude-haiku-4-5:safe (2092 ms):
```
tests [editor]: enhance split window selection verification

The test now explicitly validates that the split copies the selected
tab into the new window and verifies window navigation references
instead of just checking the selected file through getPrevWindow.
```

claude:claude-haiku-5-5:safe:low (1811 ms):
```
tests [editor]: strengthen prev/next window assertions after split
```

codex:gpt-5.6-luna:lean:low (2518 ms):
```
tests [editor]: cover splitter window order and selected files
```

## intellij-community-5 (diff 1529 chars, git 931 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, adjust benchmark, part10
```

pi:anthropic/claude-haiku-4-5:lean:off (2113 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust action weights and batch size

Reduce random action range to exclude renameVariable due to performance
issues, and increase single user batch count for more comprehensive
testing.
```

pi:anthropic/claude-haiku-5-5:lean:low (1630 ms):
```
[editor] Disable renameVariable in DocBranch performance test

The rename action is too slow for the performance test, so it is
excluded from the random action mix. Its share of the action selection
is removed, and the single-user batch count is raised to compensate
for the fewer actions run.
```

pi:openai/gpt-5.6-luna:lean:low (1792 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust performance benchmark actions
```

pi:anthropic/claude-haiku-4-5:naive (9236 ms):
```
[editor] tune performance test: skip slow action, increase batch count
```

claude:claude-haiku-4-5:safe (2478 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, disable renameVariable in random actions, part10

Adjust random action distribution to exclude renameVariable by
reducing the range to 0..89 and add TODO comment noting that
renameVariable is too slow. Also increase SINGLE_USER_BATCHES from
20 to 1000 for more comprehensive single-user benchmarking.
```

claude:claude-haiku-5-5:safe:low (5093 ms):
```
[editor] DocBranchPerformanceTest: disable slow rename, more batches

Rename is too slow for the single-user benchmark, so the action roll
no longer reaches it. Single-user batch count goes from 20 to 1000.
```

codex:gpt-5.6-luna:lean:low (2476 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, extend single-user benchmark
```

## intellij-community-6 (diff 1688 chars, git 521 ms)

Actual:
```
AND-150 [android] Remove dead Compose compiler keys from K2ComposeCompilerConfigurationProvider
```

pi:anthropic/claude-haiku-4-5:lean:off (1311 ms):
```
Remove unused Compose compiler configuration options
```

pi:anthropic/claude-haiku-5-5:lean:low (1803 ms):
```
Remove obsolete Compose compiler options from IDE config

Drop the IntrinsicRemember feature flag and the intrinsic remember and
strong skipping overrides from K2ComposeCompilerConfigurationProvider.
These settings no longer need to be forced off for the IDE plugin, so
the compiler defaults apply.
```

pi:openai/gpt-5.6-luna:lean:low (1562 ms):
```
Remove obsolete Compose compiler feature flags
```

pi:anthropic/claude-haiku-4-5:naive (10022 ms):
```
[compose] Remove intrinsic remember and strong skipping configs
```

claude:claude-haiku-4-5:safe (1683 ms):
```
Remove unused Compose compiler configuration options
```

claude:claude-haiku-5-5:safe:low (1803 ms):
```
Drop IntrinsicRemember and StrongSkipping overrides in K2 compose config
```

codex:gpt-5.6-luna:lean:low (2440 ms):
```
K2: Use default Compose compiler optimization settings
```

## intellij-community-7 (diff 1952 chars, git 332 ms)

Actual:
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

pi:anthropic/claude-haiku-4-5:lean:off (1296 ms, the IDE drops MRI-5563):
```
[MRI-5563] switch intellij.java.ide.customization.backend.tests
```

pi:anthropic/claude-haiku-5-5:lean:low (2115 ms, the IDE drops MRI-5552):
```
[MRI-5552]-style prefix would need a branch id, which I don't have, so use a plain summary matching the "switch ... tests" pattern.

switch intellij.java.ide.customization.backend.tests to Bazel

Move the test target out of the auto-generated section and mark it
with the skip-generation marker so the Bazel test definition is kept
by hand. Add the module to bazel-migrated-test-modules.txt so it runs
under Bazel.
```

pi:openai/gpt-5.6-luna:lean:low (1766 ms, the IDE drops IJPL-256790):
```
IJPL-256790 tests: add intellij.java.ide.customization.backend.tests to bazel-migrated-test-modules.txt
```

pi:anthropic/claude-haiku-4-5:naive (10427 ms):
```
switch intellij.java.ide.customization.backend.tests
```

claude:claude-haiku-4-5:safe (1502 ms, the IDE drops MRI-5544):
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

claude:claude-haiku-5-5:safe:low (1623 ms):
```
Switch intellij.java.ide.customization.backend.tests to Bazel
```

codex:gpt-5.6-luna:lean:low (2451 ms, the IDE drops IJPL-256792):
```
IJPL-256792 tests: add intellij.java.ide.customization.backend.tests to Bazel migration list
```

## intellij-community-8 (diff 2104 chars, git 7987 ms)

Actual:
```
KTIJ-39860 [kotlin] Fix impossible is check null quick-fix
```

pi:anthropic/claude-haiku-4-5:lean:off (2112 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix operator logic in ReplaceIsCheckWithNullCheckFix

The negation condition was inverted, causing the wrong operator to be
selected when replacing is-checks with null checks. Swapped the operators
so negated checks use != and non-negated checks use ==.
```

pi:anthropic/claude-haiku-5-5:lean:low (1868 ms):
```
Fix inverted null-check operator in ReplaceIsCheckWithNullCheckFix

The quick fix had the operator swapped: a negated "is" check (`!is`) was
replaced with `== null`, and a plain "is" check with `!= null`. Select
the operator so that `is` becomes `!= null` and `!is` becomes `== null`,
and update the two test expectations to match.
```

pi:openai/gpt-5.6-luna:lean:low (1782 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Correct null check replacement for is expressions
```

pi:anthropic/claude-haiku-4-5:naive (10463 ms):
```
[kotlin] Fix operator assignment in ReplaceIsCheckWithNullCheckFix
```

claude:claude-haiku-4-5:safe (2245 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix operator logic in ReplaceIsCheckWithNullCheckFix

The negation logic for determining the null check operator was inverted.
When the is-check is negated, use "!=" instead of "==", and vice versa.
```

claude:claude-haiku-5-5:safe:low (1668 ms):
```
Fix inverted null-check operator in ReplaceIsCheckWithNullCheckFix
```

codex:gpt-5.6-luna:lean:low (2909 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix is-check to null-check conversion
```

## intellij-community-9 (diff 2367 chars, git 1535 ms)

Actual:
```
[git] Initialize recentCommitsProvider in the background (IJPL-248720)
```

pi:anthropic/claude-haiku-4-5:lean:off (1917 ms):
```
[git]: Lazy initialize GitRecentCommitsProvider with async

Wrap GitRecentCommitsProvider initialization in scope.async to defer its construction until it's actually needed. This prevents unnecessary initialization and allows the provider to be created on a background thread.
```

pi:anthropic/claude-haiku-5-5:lean:low (1837 ms):
```
Make GitRecentCommitsProvider creation async in GitAmendCommitService

The provider was constructed eagerly during service initialization, with
preload enabled. Move its construction into a coroutine started on the
service scope and await it where recent commits are needed, so service
initialization no longer blocks on creating the provider.
```

pi:openai/gpt-5.6-luna:lean:low (1870 ms):
```
[git]: Initialize amend commit provider asynchronously
```

pi:anthropic/claude-haiku-4-5:naive (11790 ms):
```
git: defer GitRecentCommitsProvider initialization
```

claude:claude-haiku-4-5:safe (2123 ms):
```
[git]: Lazily initialize GitRecentCommitsProvider in GitAmendCommitService

Wrap the provider initialization in an async block to defer instantiation
until it's actually needed, avoiding unnecessary work during service
startup.
```

claude:claude-haiku-5-5:safe:low (1766 ms):
```
Make GitAmendCommitService create the recent commits provider lazily on a background dispatcher, and await it where it is used.
```

codex:gpt-5.6-luna:lean:low (2442 ms, the IDE drops IJPL-258):
```
IJPL-258??? Initialize Git recent commits provider asynchronously
```

## intellij-community-10 (diff 2642 chars, git 206 ms)

Actual:
```
cleanup [python]: Clean up formatting and imports in PyTypeChecker
```

pi:anthropic/claude-haiku-4-5:lean:off (1447 ms, the IDE drops PY-92880):
```
PY-92880 cleanup: remove unused imports and reformat function signature
```

pi:anthropic/claude-haiku-5-5:lean:low (1864 ms):
```
Clean up unused imports and reformat a function signature in PyTypeChecker

The recent commits in this series are PY-92880 cleanups of PyTypeChecker. This change removes the unused PyNamedParameter and component1/component2 imports, adds an import for expandTupleTypeParameters, and wraps the subclassElementType signature to the multi-line style used elsewhere.
```

pi:openai/gpt-5.6-luna:lean:low (1562 ms, the IDE drops PY-92880):
```
PY-92880 simplify PyTypeChecker imports and formatting
```

pi:anthropic/claude-haiku-4-5:naive (10353 ms):
```
Remove unused imports and reorganize imports in PyTypeChecker
```

claude:claude-haiku-4-5:safe (1629 ms, the IDE drops PY-92880):
```
PY-92880 clean up unused imports and format function signature
```

claude:claude-haiku-5-5:safe:low (3032 ms):
```
misc python: clean up imports in PyTypeChecker and wrap a signature
```

codex:gpt-5.6-luna:lean:low (2650 ms, the IDE drops PY-92880):
```
PY-92880 Improve PyTypeChecker formatting and imports
```

## intellij-community-11 (diff 3296 chars, git 10445 ms)

Actual:
```
[skeleton] IJPL-257214 use the fallback renderer instead of the canvas in the Windows frontend
```

pi:anthropic/claude-haiku-4-5:lean:off (2259 ms):
```
refactor skeleton: rename WaylandRenderer to FallbackRenderer

The renderer is now used on both Wayland and Windows (JetBrains Client),
so the name should reflect its broader purpose. It paints on the EDT
with Swing `repaint()` without using a heavyweight Canvas, which works
for both platforms but avoids platform-specific issues like JBR-10643
on Windows.
```

pi:anthropic/claude-haiku-5-5:lean:low (1959 ms):
```
Rename the Wayland skeleton renderer to a fallback renderer and use it on Windows JetBrains Client

The Canvas-based renderer is avoided on Windows frontends (JBR-10643), so the Swing-based renderer is now used there as well. The class is renamed from EditorSkeletonWaylandRenderer to EditorSkeletonFallbackRenderer to reflect that it is no longer Wayland-specific.
```

pi:openai/gpt-5.6-luna:lean:low (1587 ms):
```
[skeleton] use fallback renderer for JetBrains Client on Windows
```

pi:anthropic/claude-haiku-4-5:naive (15741 ms):
```
[skeleton] rename WaylandRenderer as fallback for Wayland and Windows
```

claude:claude-haiku-4-5:safe (2881 ms):
```
refactor [skeleton]: rename EditorSkeletonWaylandRenderer to EditorSkeletonFallbackRenderer

Rename the renderer to better reflect its purpose: it's a fallback
renderer that paints on the EDT with Swing `repaint()` instead of using
a heavyweight `Canvas`. This approach works for both Wayland (where
Swing submits frames to the compositor) and Windows JetBrains Client
(where it avoids JBR-10643). Extend the usage to Windows frontend in
addition to Wayland.
```

claude:claude-haiku-5-5:safe:low (1973 ms, the IDE drops JBR-10643):
```
Rename the Wayland renderer to a fallback renderer and use it on Windows JetBrains Client too, since Canvas causes JBR-10643 there.
```

codex:gpt-5.6-luna:lean:low (3055 ms):
```
[skeleton] use fallback renderer for Windows frontend
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

pi:anthropic/claude-haiku-4-5:lean:off (1434 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a lambda-framework test suite for the Python tool window startup flag
```

pi:anthropic/claude-haiku-5-5:lean:low (1703 ms, the IDE drops PY-89999):
```
[python] PY-89999 Add a lambda test for the startup flag of Python tool windows

Python tool windows stayed hidden at startup on the split frontend. Add a split-mode lambda test that checks the startup-availability registry key defaults to true when loaded from the real frontend plugin set.
```

pi:openai/gpt-5.6-luna:lean:low (1564 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add split frontend startup flag test
```

pi:anthropic/claude-haiku-4-5:naive (13940 ms):
```
[python] Add a lambda-framework test for tool window startup flag
```

claude:claude-haiku-4-5:safe (1887 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a test for Python tool window startup availability flag
```

claude:claude-haiku-5-5:safe:low (2121 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a startup-flag test for the Python tool windows
```

codex:gpt-5.6-luna:lean:low (2489 ms):
```
[pycharm] Add split frontend startup availability test for Python tool window
```

## intellij-community-13 (diff 4115 chars, git 899 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2705 ms):
```
refactor [platform]: Set EDT native thread priority directly

The native priority is now raised directly via SetThreadPriority instead
of Thread.setPriority, which was copied to every thread created by the
EDT. This prevented lazily started kotlinx.coroutines workers from being
preempted by lower-priority queue-feeding threads, causing spin-waits to
hold CPU resources for extended periods. Native thread priority is not
inherited by child threads, avoiding this issue.
```

pi:anthropic/claude-haiku-5-5:lean:low (2368 ms):
```
refactor platform: set EDT native priority instead of Java priority

Thread.setPriority(MAX_PRIORITY) is copied to every thread the EDT
creates. The lazily started kotlinx.coroutines workers then ran at
THREAD_PRIORITY_HIGHEST above the threads feeding their queue, and their
spin-wait on a preempted producer held CPUs for seconds.

Raise the native priority with SetThreadPriority instead. A native
priority is not inherited by new threads, so worker threads keep the
default priority.
```

pi:openai/gpt-5.6-luna:lean:low (1603 ms):
```
refactor [platform]: set EDT priority natively without inheriting it
```

pi:anthropic/claude-haiku-4-5:naive (14694 ms):
```
refactor platform: set EDT thread priority via native API

Java thread priority is inherited by all threads created by EDT,
causing lazily started kotlinx.coroutines workers to be prioritized
above their queue feeders, leading to performance issues. Using
native Windows API sets priority only for the EDT thread itself,
avoiding this inheritance problem.
```

claude:claude-haiku-4-5:safe (2906 ms):
```
refactor platform: set EDT thread priority natively on Windows

The native priority is raised directly via SetThreadPriority instead of
Thread.setPriority: a Java priority is copied to every thread the EDT
creates, which put the lazily started kotlinx.coroutines workers at
THREAD_PRIORITY_HIGHEST above the threads that feed their queue, and
their spin-wait on a preempted producer then held every CPU for seconds.
A native priority is not inherited.
```

claude:claude-haiku-5-5:safe:low (2230 ms):
```
refactor [platform]: Raise EDT priority natively instead of via Java

The Java thread priority is copied to threads the EDT creates, which
put kotlinx.coroutines workers above their producers and caused
long spin-waits. Setting the native priority avoids the inheritance.
```

codex:gpt-5.6-luna:lean:low (2479 ms):
```
refactor [platform]: Set EDT priority natively without inheriting it
```

## intellij-community-14 (diff 4485 chars, git 989 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (2379 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Handle cancellation in navigation requests

Add proper cancellation handling to distinguish between normal
coroutine cancellation and external navigation cancellation. Catch
CancellationException and ensure the caller's context is still active
before propagating. Update documentation to clarify cancellation
behavior.
```

pi:anthropic/claude-haiku-5-5:lean:low (4767 ms):
```
[navigation] Return false instead of throwing on external cancellation

Navigation canceled by a newer request or by the user now returns false
to the caller. CancellationException is still propagated when the
caller's own coroutine is canceled, so disposed services and explicitly
canceled jobs behave as before.
```

pi:openai/gpt-5.6-luna:lean:low (1448 ms):
```
[navigation] Handle external navigation cancellation without throwing
```

pi:anthropic/claude-haiku-4-5:naive (10485 ms):
```
[navigation] Distinguish normal and external navigation cancellations
```

claude:claude-haiku-4-5:safe (2361 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Handle cancellation in navigate() correctly

Navigation can be canceled for different reasons: either due to
a newer navigation request or user cancellation. In these cases,
the method should return false without throwing CancellationException.
Only throw CancellationException for normal coroutine cancellation
when the caller's context is no longer active.
```

claude:claude-haiku-5-5:safe:low (2253 ms):
```
Branch name is not provided, so no issue id. Recent commits use "[scope] IJPL-xxx: Summary" for navigation; no id allowed here. Prefix pattern: "[navigation]" tag is appropriate since the change is in navigation service. Summary: describe cancellation behavior change in IdeNavigationService.

[navigation] Return false instead of throwing on external cancellation
```

codex:gpt-5.6-luna:lean:low (2676 ms):
```
[navigation] Clarify navigation cancellation behavior
```

## intellij-community-15 (diff 4877 chars, git 155 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, JvmStatic, part45
```

pi:anthropic/claude-haiku-4-5:lean:off (1808 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, JvmStatic annotations, part45
```

pi:anthropic/claude-haiku-5-5:lean:low (1852 ms):
```
Add @JvmStatic to experimental editor factory methods

Mark the companion-object factories in the experimental editor API
(Agent, DocBranch, DocMerge, DocTextOp, Event, EventGraph) with
@JvmStatic so Java callers can invoke them as static methods without
going through the Companion instance.
```

pi:openai/gpt-5.6-luna:lean:low (1710 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, expose factory methods to Java
```

pi:anthropic/claude-haiku-4-5:naive (13763 ms):
```
[editor] add @JvmStatic to experimental editor API static methods
```

claude:claude-haiku-4-5:safe (1941 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, JvmStatic annotations, part45
```

claude:claude-haiku-5-5:safe:low (1800 ms):
```
[editor] Add @JvmStatic to experimental factory methods

Expose the companion factory functions of Agent, DocBranch,
DocMerge, DocTextOp, Event and EventGraph as static methods for
Java callers.
```

codex:gpt-5.6-luna:lean:low (2521 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, expose Kotlin factories to Java
```

## intellij-community-16 (diff 5268 chars, git 4352 ms)

Actual:
```
fix [VCS]: Git log: second pressing of "delete branch" button logs an error IJPL-163588

Also fixes IJPL-257749
```

pi:anthropic/claude-haiku-4-5:lean:off (2145 ms):
```
[git] Handle repeated delete branch requests

Prevent errors when delete branch is called multiple times before the
UI catches up with the previous deletion. Filter out repositories where
the branch is no longer present and serialize deletion requests so each
one sees the result of the previous.
```

pi:anthropic/claude-haiku-5-5:lean:low (1731 ms):
```
[git] Ignore repeated deletion of an already deleted branch

Deletion requests can pile up when "Delete" is pressed again before the UI catches up with the previous deletion. Serialize branch deletions in GitBrancherImpl so each one sees the result of the previous, and skip repositories where the branch no longer exists instead of failing.
```

pi:openai/gpt-5.6-luna:lean:low (1439 ms):
```
[git] Ignore repeated branch deletion requests
```

pi:anthropic/claude-haiku-4-5:naive (12269 ms):
```
[git] Handle repeated branch deletion attempts

Deletion requests can pile up (e.g. "Delete" pressed multiple
times). Filter out repositories where the branch is already
deleted and serialize deletion operations with a lock to ensure
each request sees the result of the previous one.
```

claude:claude-haiku-4-5:safe (3116 ms):
```
[git] Handle repeated delete branch requests gracefully

When a user presses "Delete" multiple times before the UI updates, the
deletion requests can pile up. Add synchronization in GitBrancherImpl to
serialize deletion requests, and filter out repositories where the branch
is already deleted in GitBranchWorker to prevent errors on stale requests.
```

claude:claude-haiku-5-5:safe:low (2164 ms):
```
[git] Make branch deletion skip repositories where branch is gone

The branch deletion request may be stale when the user presses
"Delete" again before the UI catches up. Filter out repositories
that no longer have the branch, and serialize deletion requests so
each sees the result of the previous one.
```

codex:gpt-5.6-luna:lean:low (2419 ms):
```
[git] Ignore repeated deletion requests for the same branch
```

## intellij-community-17 (diff 6386 chars, git 414 ms)

Actual:
```
[plugin-manager] IJPL-257815 Keep selected rows below sticky headers after refresh

Refreshing plugin sources can replace the selected row and restore an
anchor that leaves the row behind the sticky header.

Reveal the selected row after anchor restoration when the old row was
visible. Leave offscreen selections in place. Add tests for both cases
and update the UI specification.
```

pi:anthropic/claude-haiku-4-5:lean:off (1901 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh

When a source refresh replaces a visible selected row, the row must
remain visible below the sticky header. However, a source refresh must
not scroll to reveal a selected row that was already outside the
viewport.
```

pi:anthropic/claude-haiku-5-5:lean:low (1992 ms):
```
[plugin-manager] Reveal selected row after source refresh

When a repository refresh replaces the selected plugin row, the new row
was not revealed, so the selection could end up hidden behind the sticky
header. Reveal the replacement only if the previous selected row was
visible in the viewport, so offscreen selections keep the current scroll
position.
```

pi:openai/gpt-5.6-luna:lean:low (2087 ms):
```
[plugin-manager] Preserve viewport when selected rows are refreshed

Ensure replaced visible selected rows remain visible below the sticky header
without revealing selected rows that were previously offscreen. Add coverage
for both refresh scenarios.
```

pi:anthropic/claude-haiku-4-5:naive (10906 ms):
```
[plugin-manager] Keep replaced selected rows visible after refresh

When a source refresh replaces a visible selected row, the viewport
should keep that row visible below the sticky header. When a selected
row is replaced while offscreen, the viewport position must not change.
```

claude:claude-haiku-4-5:safe (2336 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh

When a source refresh replaces a visible selected row, the row must
remain visible below the sticky header. However, a source refresh must
not scroll to reveal a selected row that was already outside the viewport.
```

claude:claude-haiku-5-5:safe:low (1923 ms):
```
[plugin-manager] Keep selected row visible after source refresh

When a source refresh replaces the selected row, reveal the new row only if the old one was visible. This stops refreshes from scrolling the list to an offscreen selection.
```

codex:gpt-5.6-luna:lean:low (2525 ms):
```
[plugin-manager] Reveal replaced selected rows after refresh
```

## intellij-community-18 (diff 6986 chars, git 7070 ms)

Actual:
```
[java] IDEA-369985 SlowOp in GenerateToStringWorker.exitsMethodDialog
```

pi:anthropic/claude-haiku-4-5:lean:off (1872 ms):
```
[java] refactor generate-toString to use background read action

Move the expensive method lookup to a background read action to avoid
blocking the EDT, and split the conflict resolution logic into separate
methods for finding existing methods and choosing the policy.
```

pi:anthropic/claude-haiku-5-5:lean:low (2500 ms):
```
Move Generate toString action off the EDT-blocking write command

The conflict check for an existing toString() method ran on the EDT
inside a write command, which blocked the UI on slow PSI lookups and
could trigger a dialog while the write action was held. The lookup now
runs in a non-blocking read action on a background thread; the policy
dialog is shown on the EDT afterwards, and the generation itself runs
as a write action with progress under a regular command.

Error hints from the worker are also shown via invokeLater, since the
worker may now run off the EDT.
```

pi:openai/gpt-5.6-luna:lean:low (2000 ms):
```
[java] Perform toString conflict checks asynchronously
```

pi:anthropic/claude-haiku-4-5:naive (9437 ms):
```
[java] Refactor toString generation to use async read actions
```

claude:claude-haiku-4-5:safe (2231 ms):
```
[java] Refactor toString generation to use non-blocking read action

Move the expensive method lookup to a background read action and defer
the conflict dialog to the UI thread. This prevents blocking the UI while
searching for existing toString methods in large classes.
```

claude:claude-haiku-5-5:safe:low (2017 ms):
```
[Java] Run toString method conflict check off the EDT

The existing-method lookup now runs in a background read action, and the
conflict dialog is shown on the EDT afterward. The write command runs
with a progress indicator instead of a plain write command action.
```

codex:gpt-5.6-luna:lean:low (2475 ms):
```
[java] Run Generate toString conflict checks off the EDT
```

## intellij-community-19 (diff 8020 chars, git 7992 ms)

Actual:
```
[Java. Tests] IDEA-394694 Fix project test leak in `com.intellij.java.codeInspection.GlobalInspectionContextTest`
```

pi:anthropic/claude-haiku-4-5:lean:off (2303 ms):
```
[test framework] unregister inspection keys after configureInspections disposal

Register HighlightDisplayKey instances for inspection tools only when
needed, and unregister them when the parent disposable is disposed.
This prevents pollution of the global HighlightDisplayKey registry
across test runs. Preserve any keys that existed before configuration
or were created during configuration failure handling.
```

pi:anthropic/claude-haiku-5-5:lean:low (2217 ms):
```
Unregister HighlightDisplayKeys registered by configureInspections

configureInspections() registers a HighlightDisplayKey for each tool
but never removed it, so keys leaked across tests and made later
lookups see stale state. Record which keys were newly registered and
unregister them when the parent disposable is disposed. A key that was
already present, or was replaced during the test, is left untouched.

Add tests covering disposal of new keys, preservation of pre-existing
and replacement keys, and cleanup after configuration fails.
```

pi:openai/gpt-5.6-luna:lean:low (1508 ms):
```
[test framework] unregister inspection highlight keys on disposal
```

pi:anthropic/claude-haiku-4-5:naive (10020 ms):
```
[test framework] unregister inspection keys on disposal
```

claude:claude-haiku-4-5:safe (2364 ms):
```
[tests] cleanup HighlightDisplayKey after configureInspections

Register HighlightDisplayKey entries for inspection tools only during the test and unregister them in a disposer to avoid polluting the global key registry. Also add tests to verify correct cleanup behavior.
```

claude:claude-haiku-5-5:safe:low (2592 ms):
```
Make configureInspections unregister HighlightDisplayKeys it created

The branch name is unknown, so no issue id is included. Recent messages are English, with imperative/lowercase-ish mood mixed; I'll use a bracketed scope tag to match the [test framework] style.

[test framework] unregister keys created by configureInspections

Keys registered for the configured tools are now removed when the
parent disposable is disposed. Keys that were already present, or that
were replaced during the test, are left untouched.
```

codex:gpt-5.6-luna:lean:low (2454 ms):
```
[test framework] unregister HighlightDisplayKey once per tool
```

## intellij-community-20 (diff 9108 chars, git 351 ms)

Actual:
```
KTIJ-40403 [kotlin] Offer remove question quick fix before callable references
```

pi:anthropic/claude-haiku-4-5:lean:off (2222 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Improve test coverage for callable reference static lhs fixes

Add test cases for removing question marks in callable references when
there are comments or spaces between the qualifier and the operator.
Also refactor the fix factory to properly handle these edge cases by
checking for question marks before and after the callable reference.
```

pi:anthropic/claude-haiku-5-5:lean:low (1946 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Fix "Remove '?'" for callable reference with trivia

The quick fix removing the '?' from a static LHS of a callable reference
did not find the question mark when whitespace or comments separated it
from the LHS, or when the '?' was parsed outside the callable reference.
Look for the question mark token in those positions as well, and add
tests covering both cases.
```

pi:openai/gpt-5.6-luna:lean:low (1714 ms):
```
KTIJ [kotlin] Handle spaced and commented nullable callable references
```

pi:anthropic/claude-haiku-4-5:naive (14208 ms):
```
[kotlin] Support whitespace and comments in callable reference nullable fixes

Add handling for question mark tokens that may be separated from
callable references by whitespace or comments. Improve detection
of nullable qualifiers in various positions within the expression.
```

claude:claude-haiku-4-5:safe (2395 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Improve handling of question marks in callable reference fixes

Handle cases where question marks appear before or after callable
reference expressions, separated by whitespace or comments. Add test
cases for these edge cases to ensure the quick fix works correctly in
all scenarios.
```

claude:claude-haiku-5-5:safe:low (2469 ms):
```
Branch name is not provided, so no issue id. Recent messages use "[kotlin]" tag, mood imperative ("Add", "Fix"). The change: fix quick fix for removing '?' in callable reference static LHS when comment or space separates the '?' from '::'.

Fix to "Remove '?'" quickfix in callable reference with static LHS, handling comments and spaces between '?' and '::'

Let me make it shorter, under 72 chars.

[kotlin] Fix "Remove '?'" quick fix for callable reference LHS
```

codex:gpt-5.6-luna:lean:low (2717 ms):
```
[kotlin] Fix callable reference quickfix with trivia between tokens

Add coverage for nullable callable references with spaces and comments.
```

## intellij-community-21 (diff 10486 chars, git 235 ms)

Actual:
```
[kotlin] inline: inline type parameters

- simplify type parameters processing

KTIJ-40432
```

pi:anthropic/claude-haiku-4-5:lean:off (2745 ms):
```
[kotlin] inline: simplify CodeInliner by removing analysis wrappers

Removed unnecessary KaAllowAnalysisOnEdt and KaAllowAnalysisFromWriteAction
permissions and their wrapping calls. Simplified processTypeParameterUsages
to use a context receiver instead of multiple lambda parameters, making
the code more readable and maintainable.
```

pi:anthropic/claude-haiku-5-5:lean:low (2350 ms):
```
[kotlin] inline: remove allowAnalysisOnEdt/FromWriteAction workarounds

Drop the KaAllowAnalysisOnEdt and KaAllowAnalysisFromWriteAction opt-ins
and wrappers in CodeInliner. Analysis calls now run directly within
analyze blocks. Merge the type parameter usage processing into a single
context-based function, so one analyze session covers all lookups
instead of one per property.
```

pi:openai/gpt-5.6-luna:lean:low (1535 ms):
```
[kotlin] inline: simplify CodeInliner analysis and type handling
```

pi:anthropic/claude-haiku-4-5:naive (10245 ms):
```
[kotlin] inline: remove deprecated analysis permissions
```

claude:claude-haiku-4-5:safe (3324 ms):
```
[kotlin] inline: simplify CodeInliner by removing unnecessary analysis wrappers

Remove redundant allowAnalysisOnEdt and allowAnalysisFromWriteAction
calls that are no longer needed. Simplify processTypeParameterUsages by
inlining its parameters and moving it to a context function. Remove the
getContextParameterExplicitArgument wrapper function. Eliminate an
unnecessary analyze block in renameDeclarations.
```

claude:claude-haiku-5-5:safe:low (2096 ms):
```
[kotlin] inline: stop wrapping KaSession calls in analysis permissions

The inliner no longer needs allowAnalysisOnEdt/FromWriteAction opt-ins.
Type parameter processing runs inside a single analyze(call) block, and
name validation is moved out of analyze(context).
```

codex:gpt-5.6-luna:lean:low (2822 ms):
```
[kotlin] inline: simplify CodeInliner analysis
```

## intellij-community-22 (diff 10986 chars, git 439 ms)

Actual:
```
[markdown] IJPL-257188 Support the Sticky Lines feature in Markdown


Merge-request: IJ-MR-227314
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

pi:anthropic/claude-haiku-4-5:lean:off (2605 ms):
```
[markdown] Implement sticky line support for Markdown headings

Add support for sticky lines in Markdown files to pin section headings
while scrolling. Headings remain pinned until the end of their section,
showing the hierarchy of nested headings. This is implemented via a new
MarkdownFileBreadcrumbsCollector that computes sticky line information
based on the Markdown heading structure, and a scaling adjustment in the
live preview renderer to fit multi-line headings into single sticky lines.
```

pi:anthropic/claude-haiku-5-5:lean:low (2151 ms):
```
Add sticky line support for Markdown headings in breadcrumbs

Implement a FileBreadcrumbsCollector for Markdown files that reports each
heading as a sticky line, pinned until the end of its section. Sticky
lines are computed from the same header regions used for folding, so
the pinned scope matches what folding already shows. The collector
delegates breadcrumbs to the PSI collector.

Also scale the live preview heading when it is painted as a sticky line,
so it fits into the single line height.
```

pi:openai/gpt-5.6-luna:lean:low (1714 ms):
```
[markdown] Support sticky heading lines in Markdown breadcrumbs
```

pi:anthropic/claude-haiku-4-5:naive (8898 ms):
```
[markdown] Add sticky lines to breadcrumbs showing section headers

Implement MarkdownFileBreadcrumbsCollector to display Markdown section
headers as sticky lines in the editor, pinned at the top while scrolling
through the document. This shows the complete heading hierarchy for the
current viewport. Also scale heading rendering to fit within one line
height when painted as a sticky line.
```

claude:claude-haiku-4-5:safe (2633 ms):
```
[markdown] Add sticky line support for Markdown headings

Implement FileBreadcrumbsCollector for Markdown to enable sticky lines that pin headings at the top of the editor as you scroll. Each heading remains pinned until the end of its section, determined by the folding hierarchy. Also adjust heading rendering in live preview when sticky lines are active to fit the constrained height.
```

claude:claude-haiku-5-5:safe:low (2030 ms):
```
Add sticky lines for Markdown headings in breadcrumbs

Pin each heading to the top of the editor while the caret is inside its section. The sticky lines come from a new file breadcrumbs collector that reuses the header regions of the folding builder.
```

codex:gpt-5.6-luna:lean:low (2720 ms):
```
[markdown] Add sticky lines for Markdown heading breadcrumbs
```

## intellij-community-23 (diff 12992 chars, git 412 ms)

Actual:
```
[markdown] IJPL-257766 Support Setext headers in Markdown live preview


Merge-request: IJ-MR-227110
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

pi:anthropic/claude-haiku-4-5:lean:off (2701 ms):
```
[markdown] Support Setext headings in live preview

Extend heading specs to cover both ATX and Setext heading syntax.
Parse Setext heading content with the correct token type for accurate
inline HTML generation. Render Setext underlines as separate horizontal
rules, consistent with how thematic breaks are handled. Update tests to
verify Setext heading folding, concealment, and source mapping behavior.
```

pi:anthropic/claude-haiku-5-5:lean:low (1752 ms):
```
Render Setext headings in Markdown live preview

Setext headings were not rendered by live preview, and their underline was only hidden when it sat under a code span. Treat both ATX and Setext headings as headings: the content line becomes a heading fold with inline HTML, and the underline is painted as a horizontal rule.
```

pi:openai/gpt-5.6-luna:lean:low (1660 ms, the IDE drops IJPL-257527):
```
[markdown] IJPL-257527 Support Setext headings in Markdown live preview
```

pi:anthropic/claude-haiku-4-5:naive (9827 ms):
```
[markdown] Support Setext headings in live preview
```

claude:claude-haiku-4-5:safe (2660 ms):
```
[markdown] Support Setext headings in live preview with proper heading and rule specs

Setext headings now generate proper heading specs for their content lines,
with separate horizontal rule specs for their underlines. This replaces
the previous limited handling that only worked for code spans. The heading
HTML generator now detects and uses the correct token type for both ATX
and Setext heading content.
```

claude:claude-haiku-5-5:safe:low (1818 ms):
```
[markdown] Support Setext headings in Markdown live preview

Render Setext headings as headings and paint their underline as a
horizontal rule, instead of treating them as code span underlines.
```

codex:gpt-5.6-luna:lean:low (2633 ms, the IDE drops IJPL-257527):
```
[markdown] IJPL-257527 Support Setext headings in Markdown live preview
```

## intellij-community-24 (diff 14987 chars, git 9233 ms)

Actual:
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

pi:anthropic/claude-haiku-4-5:lean:off (1594 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

pi:anthropic/claude-haiku-5-5:lean:low (1526 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

pi:openai/gpt-5.6-luna:lean:low (1585 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

pi:anthropic/claude-haiku-4-5:naive (4485 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude:claude-haiku-4-5:safe (1838 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude:claude-haiku-5-5:safe:low (2374 ms):
```
[Java. Tests] Move com.intellij.find tests to com.intellij.java.find

The package of the find tests in intellij.java.tests moves from
com.intellij.find to com.intellij.java.find, following the same
migration as the other packages moved under IDEA-393917.
```

codex:gpt-5.6-luna:lean:low (2697 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

## intellij-community-25 (diff 16602 chars, git 8575 ms)

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

pi:anthropic/claude-haiku-4-5:lean:off (1411 ms):
```
refactoring air: add a hermetic process table to the probe
```

pi:anthropic/claude-haiku-5-5:lean:low (2237 ms):
```
refactoring air: fake the host process table in hermetic suites

The observation fixture and the process probe read the host's process
table, so a ready worker's run-process identity depended on the test
runner's own pid and on the processes of the machine. Give a runner an
optional ProcessTable that answers probes in place of the host, and a
FakeProcesses table for the suites that need one. An override keeps the
table only when cloned, not when it changes the environment.
```

pi:openai/gpt-5.6-luna:lean:low (1957 ms):
```
refactoring air: make process probes hermetic in VM tests

Introduce a fake process table for host runners and use it in observation
tests, preventing process probes from depending on the test host's processes.
```

pi:anthropic/claude-haiku-4-5:naive (13455 ms):
```
refactoring [vm]: allow hermetic testing with a fake process table

Add ProcessTable trait to Runner so test suites can inject a fake
process table and avoid querying the actual host. Implement
FakeProcesses for hermetic testing, where only declared processes
exist and no probe can depend on host state.
```

claude:claude-haiku-4-5:safe (3603 ms):
```
refactoring air: add a fake process table to hermetic test runners

A hermetic suite now provides its runner with a fake process table through
`with_process_table`, so that process probes answer from the suite's declared
processes instead of the host. This makes the observation command tests
hermetic with respect to the host's process state, and allows suites to
control which processes appear running without affecting the host.

The `ProcessTable` trait abstracts the process lookup, and `FakeProcesses`
implements it for tests. Runners that set a process table skip the host's
process probing and answer from the table instead. Overriding environment
variables on a runner drops the table to avoid stale references.
```

claude:claude-haiku-5-5:safe:low (2242 ms):
```
refactoring air: add a fake process table for the ps probe

Hermetic suites now give the runner a ProcessTable, so the probe no longer reads host processes. The lane observation fixture declares its own stand-in run process instead of using the test pid.
```

codex:gpt-5.6-luna:lean:low (2733 ms):
```
refactoring air: hermeticize process probes in VM tests
```

## intellij-community-26 (diff 22415 chars, git 9200 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, rename, part3
```

pi:anthropic/claude-haiku-4-5:lean:off (2688 ms):
```
[editor] Rename DocTextBranch to DocBranch for clarity

Simplify the interface name by removing the redundant "Text" qualifier.
The interface already operates on text through the DocText abstraction,
making "DocTextBranch" unnecessarily verbose. Rename all related classes
and tests accordingly: DocTextBranchImpl → DocBranchImpl,
DocTextBranchTest → DocBranchTest, DocTextBranchFuzzTest → DocBranchFuzzTest.
```

pi:anthropic/claude-haiku-5-5:lean:low (1876 ms):
```
[editor] Rename DocTextBranch to DocBranch

The branch type no longer needs the "Text" infix: it is the versioned
document itself, and DocText is the materialized value it exposes.
Rename the interface, its implementation, and the tests to match.
```

pi:openai/gpt-5.6-luna:lean:low (1802 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

pi:anthropic/claude-haiku-4-5:naive (12001 ms):
```
[editor] rename DocTextBranch to DocBranch
```

claude:claude-haiku-4-5:safe (1722 ms):
```
[editor] Rename DocTextBranch to DocBranch for brevity
```

claude:claude-haiku-5-5:safe:low (1740 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

codex:gpt-5.6-luna:lean:low (2474 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

## intellij-community-27 (diff 27722 chars, git 160 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, DAG pretty printer, part19
```

pi:anthropic/claude-haiku-4-5:lean:off (1663 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram, part18
```

pi:anthropic/claude-haiku-5-5:lean:low (1948 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram of event graph, part18

Draw EventGraph as a text box diagram for debugging.

The diagram places each run in a row by depth and a column by branch,
and bounds its size so a long history stays readable in logs. The
toString of EventGraph now renders it.
```

pi:openai/gpt-5.6-luna:lean:low (1876 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, event graph diagram, part18
```

pi:anthropic/claude-haiku-4-5:naive (15020 ms):
```
[editor] naive eg-walker, event graph diagram, part18
```

claude:claude-haiku-4-5:safe (2022 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, box diagram, part18
```

claude:claude-haiku-5-5:safe:low (1697 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text diagram, part18
```

codex:gpt-5.6-luna:lean:low (2506 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 event graph diagram, part18
```

## intellij-community-28 (diff 41351 chars, git 439 ms)

Actual:
```
IJPL-252267 Add UI for editing default excludes
```

pi:anthropic/claude-haiku-4-5:lean:off (6151 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default .analysisignore lines editable in File Types settings

Add a settings panel for editing the default exclusion patterns used in
.analysisignore files when no file exists at a project root. The patterns are
now stored in AnalysisIgnoreDefaultsSettings and can be customized by users
through the File Types settings dialog. Default entities automatically sync
when the user changes these patterns, and the built-in lines are preserved
in storage until the user makes changes.
```

pi:anthropic/claude-haiku-5-5:lean:low (2407 ms):
```
Make default .analysisignore exclusions editable in File Types settings

The default exclusions for a project root without an .analysisignore file
were a fixed list. Users could not change them without writing a file.

Add a "Default Exclusions" tab to the File Types settings, shown when the
defaults are enabled. The edited lines are stored in an application-level
settings component. Only supported patterns are kept, and the built-in
lines are not stored, so a later product version can still change them.
A change of the lines notifies the analysis ignore service, which updates
the default entities of the project roots.
```

pi:openai/gpt-5.6-luna:lean:low (1890 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default .analysisignore exclusions
```

pi:anthropic/claude-haiku-4-5:naive (7996 ms):
```
Make default analysis ignore lines customizable in settings

Add a new tab in File Types settings to edit the default exclusion
patterns. The patterns are shown only when the feature is enabled and
replace the built-in defaults in the workspace when changed. The
application syncs default entities whenever the user edits the lines
or project roots change.
```

claude:claude-haiku-4-5:safe (2811 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default .analysisignore lines editable in File Types settings

Allow users to customize the default exclusion patterns in the File Types
settings panel when .analysisignore defaults are enabled. Add a new settings
component to manage default lines, persist customizations, and sync changes
to existing default entities across projects.
```

claude:claude-haiku-5-5:safe:low (4089 ms):
```
Make defaults for .analysisignore editable in File Types settings
```

codex:gpt-5.6-luna:lean:low (2561 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default exclusions settings
```

## intellij-community-29 (diff 59619 chars, git 11396 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, run-length encode, part2
```

pi:anthropic/claude-haiku-4-5:lean:off (4818 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 eg-walker: run-length encode events, part 2

Implement run-length encoding for events in the event graph. One stored run now
covers multiple single-character operations with consecutive ids. Adjacent runs
never coalesce, and the replay still tracks one item per character, so this is
the first step of a two-phase optimization.

The Event interface changes from `character()` to `content()` and `length()`.
Delete events now carry their length explicitly. The graph stores runs instead of
individual events and indexes them by agent and seq range for fast lookups.

The merge algorithm now handles partly known runs: when a run of the other graph
is only partially known in this graph, the unknown suffix is appended as a new run.

Add the LV type alias to document that graph indexes are local versions, not
universal ids. Add fuzz tests that verify run boundaries do not affect correctness.
```

pi:anthropic/claude-haiku-5-5:lean:low (2347 ms):
```
[editor] Run-length encode Eg-walker event graph

Store one event per run of single-character operations instead of one
per character. A run covers a contiguous seq range and an lv range, and
merges split a partly known run so only the unknown suffix is appended.

Replay still works per unit, so this shrinks the graph storage and the
op-append cost but not the replay cost.
```

pi:openai/gpt-5.6-luna:lean:low (1691 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 run-length encode Eg-walker event graph
```

pi:anthropic/claude-haiku-4-5:naive (23980 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 eg-walker: implement run-length event encoding

Run-length encode event storage: one Event now covers multiple units
(characters) with one id range, reducing storage for runs of identical
operations. The graph stores StoredRun objects instead of per-unit
events. Replay still works per-unit to maintain correctness. The merge
logic handles partial run matches when syncing between replicas with
different encodings. Introduce LV type alias for unit indexes (local
versions) and AgentRun for per-agent seq indexing.
```

claude:claude-haiku-4-5:safe (2042 ms):
```
[editor] eg-walker naive implementation part 2: run-length encode events
```

claude:claude-haiku-5-5:safe:low (2150 ms):
```
[editor] Run-length encode Eg-walker event graph

The graph stored one event per character. Events now cover a run of
characters with one id range, and merges split a partly known run so
only its unknown suffix is appended.
```

codex:gpt-5.6-luna:lean:low (2534 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 run-length encode event graph events
```

## intellij-community-30 (diff 99790 chars, truncated, git 188 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, move offset, part51
```

pi:anthropic/claude-haiku-4-5:lean:off (3987 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51

Add support for text moves to the event graph and replay walker. A move consists
of an insert op and a delete op with move offsets that name each other. The
insert's move offset points to the source in the text after the insert, and the
delete's move offset points to the copy in the text before the delete.

The sink batches move reports into a pair of ops with move offsets when both
halves arrive and the moved text is intact. A move op never joins a neighbour,
and a move without its other half records as a plain op. The walker reports
moves via moveInsert and moveDelete methods when the whole run moves and the
moved text stays together.
```

pi:anthropic/claude-haiku-5-5:lean:low (2340 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51

Record a move as a paired insert and delete with move offsets

DocumentEvent.getMoveOffset now flows into DocumentOp, so a text move
keeps its source and copy offsets through the op stream. The event
graph, the replay walk, and the batching sink carry the move offsets.
A move half that does not name its other half, or whose moved text
is no longer intact, falls back to a plain insert or delete, so a
bad offset never fails an edit or a merge.
```

pi:openai/gpt-5.6-luna:lean:low (1743 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

pi:anthropic/claude-haiku-4-5:naive (10997 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

claude:claude-haiku-4-5:safe (2094 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

claude:claude-haiku-5-5:safe:low (2227 ms):
```
[editor] Add text move ops to the naive eg-walker, part51
```

codex:gpt-5.6-luna:lean:low (2647 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```
