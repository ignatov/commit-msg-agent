# bench-agents

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | cost $ |
|---|---|---|---|---|---|---|---|---|
| claude:haiku:safe | 16/16 | 2834 | 4508 | 5907 | 0 | 76 | 0 | 0.0108 |
| claude:claude-haiku-5-5:safe:low | 16/16 | 2338 | 3519 | 7680 | 3685 | 90 | 15 | 0.0345 |
| codex:gpt-5.6-luna:lean:low | 16/16 | 2682 | 3222 | 6659 | 0 | 15 | 0 | - |
| codex-acp:gpt-5.6-luna[low] | 16/16 | 3334 | 4486 | 21011 | 0 | 0 | 0 | - |
| claude-acp:haiku | 16/16 | 5698 | 10547 | 26506 | 0 | 0 | 0 | 0.0045 |
| junie:junie-lite | 2/16 | 10860 | 10860 | 40613 | 12544 | 641 | 0 | 0.0069 |
| junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna | 0/16 | - | - | 0 | 0 | 0 | 0 | - |

## codex-1 (diff 713 chars, git 350 ms)

Actual:
```
Stop overriding Rust debuginfo in Bazel CI (#40864)

## What changed

Remove the CI-specific `-Cdebuginfo=0` flags for both target and execution
Rust actions, allowing the Bazel Rust toolchain and compilation mode to select
the debug-info level.

GitOrigin-RevId: f785347cde2b3ad0b7814ece2ba44fd89aa823b3
```

claude:haiku:safe (2325 ms):
```
ci: remove Rust debug info flags from CI config
```

claude:claude-haiku-5-5:safe:low (1997 ms):
```
Remove redundant debuginfo rustc flags from Bazel CI config
```

codex:gpt-5.6-luna:lean:low (2442 ms):
```
Remove explicit Rust debuginfo flags from CI configuration
```

codex-acp:gpt-5.6-luna[low] (4486 ms):
```
Remove explicit Rust debug flags from CI config
```

claude-acp:haiku (5274 ms):
```
ci: drop explicit rustc debuginfo flags from Bazel CI

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (13591 ms):
```
FAIL: no message in the report: ... run: commit message only, no code changes needed.

### Notes
- Follows existing commit message style (lowercase imperative, `ci:` prefix pattern from history).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (6053 ms):
```
FAIL: stopReason cancelled
```

## codex-2 (diff 6762 chars, git 171 ms)

Actual:
```
Respect paginated history when stopping background tasks (#40787)

## Why

Stopping a task from the agents overview may need to look up its active turn. Paginated threads should use the turn history endpoint instead of requesting embedded full history.

## What changed

- Read the thread without turns first to determine its history mode.
- Fetch the first turn page for paginated threads when the app server supports it.
- Fall back to embedded turn history for legacy threads and legacy server negotiation.

## Testing

Added coverage for paginated and legacy threads, including fallback after legacy capability negotiation.

GitOrigin-RevId: 44d506b19e32c6b3c27fac11fb748c23b8e47b5e
```

claude:haiku:safe (2834 ms):
```
Support paginated history lookup in agents overview stop

When stopping background tasks, respect the thread's history mode to
avoid unnecessary full history loads. Use paginated turn lookup when
supported, and fall back to legacy full history reads for compatibility.
```

claude:claude-haiku-5-5:safe:low (2338 ms):
```
TUI: Use paginated history when stopping agent turns
```

codex:gpt-5.6-luna:lean:low (2982 ms):
```
Use paginated history when stopping background tasks
```

codex-acp:gpt-5.6-luna[low] (2934 ms):
```
Use history mode when stopping background tasks
```

claude-acp:haiku (7768 ms):
```
Use history mode when finding turns to stop

Paginated threads don't need their full history to find the
in-progress turn, so the agents overview stop path now fetches one
turns page when the app server supports pagination. Legacy threads
and servers without pagination still read the full thread.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (10504 ms):
```
FAIL: no message in the report: - Generated a git commit message for the provided diff respecting the project's conventions (imperative mood, no issue ID, matching style of recent commits).
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (7133 ms):
```
FAIL: Error: {"code":-32000,"message":"Authentication is required before this operation can be performed."}
```

## codex-3 (diff 11930 chars, git 228 ms)

Actual:
```
Support persistent reasoning effort (#40799)

## What changed

- Add `persistent` to the reasoning-effort protocol and TypeScript SDK types.
- Show model-advertised persistent reasoning in the TUI as “Persistent”.
- Preserve `persistent` in local configuration while sending the Responses API's `disabled` wire value.

## Testing

- Cover parsing and serialization, request translation, remote model requests, the TUI reasoning selector, and TypeScript CLI argument forwarding.

GitOrigin-RevId: 22fc2fba1975db345c12d555ec12803d8dc0abca
```

claude:haiku:safe (3598 ms):
```
Add support for persistent reasoning effort level

Add "persistent" as a new reasoning effort option that maps to
"disabled" when sent to the Responses API. This allows reasoning to
continue until explicitly stopped rather than using predefined effort
levels. Update related type definitions, UI components, and tests to
support this new option.
```

claude:claude-haiku-5-5:safe:low (2010 ms):
```
Add persistent reasoning effort level and wire it to disabled
```

codex:gpt-5.6-luna:lean:low (2886 ms):
```
Support persistent reasoning effort mode
```

codex-acp:gpt-5.6-luna[low] (3334 ms):
```
Support persistent reasoning effort mode
```

claude-acp:haiku (5181 ms):
```
Add persistent reasoning effort option

Keep "persistent" in local settings, but send "disabled" to the
Responses API, which uses that name for the same behavior.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (18638 ms):
```
FAIL: no message in the report: ... level as "disabled" on the wire.
Map the new Persistent variant accordingly, and expose it in the TUI reasoning
selection popup alongside the existing presets.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (5715 ms):
```
FAIL: stopReason cancelled
```

## codex-4 (diff 51129 chars, git 199 ms)

Actual:
```
Route Guardian inference through dedicated endpoints (#40892)

## What changed

- Add the opt-in `features.guardianv2.free_guardian` setting to route eligible
  Guardian reviews to `/guardian` and asynchronous classifications to
  `/guardian-classifier`.
- Support endpoint selection for both HTTP and WebSocket Responses clients,
  including endpoint-aware connection reuse.
- Keep `/responses` for API-key authentication, custom provider URLs,
  non-Guardian models, and configurations where the option is disabled.
- Omit routing hints and `service_tier` from requests sent to the dedicated
  Guardian endpoints.

## Testing

- Cover route selection across authentication modes, provider URLs, HTTP
  fallback, WebSocket review sessions, and classifier sampling.

GitOrigin-RevId: 9c88673c710d009e0239559b9245a4e6c4f4befc
```

claude:haiku:safe (4481 ms):
```
Add support for free Guardian endpoints

Guardian V2 review and classification can now use dedicated unmetered Codex inference routes when enabled. Add a new `ResponsesEndpoint` enum to distinguish between regular user inference (`/responses`), full Guardian approval agents (`/guardian`), and lightweight Guardian risk classification (`/guardian-classifier`).

When `free_guardian` is enabled in the feature configuration, Guardian review sessions and classifiers automatically route through these dedicated endpoints instead of metered user inference, but only when using Codex backend authentication. This includes updating the ModelClient and LunaSampler to select the appropriate endpoint based on authentication and feature flags.
```

claude:claude-haiku-5-5:safe:low (2595 ms):
```
Route Guardian review through dedicated endpoints behind a flag

Add a free_guardian option that sends Guardian review and classifier
traffic to /guardian and /guardian-classifier on Codex backend routes,
with service tier cleared for those requests. Falls back to the regular
responses path otherwise.
```

codex:gpt-5.6-luna:lean:low (2964 ms):
```
Route Guardian inference through dedicated Codex endpoints
```

codex-acp:gpt-5.6-luna[low] (2842 ms):
```
Route Guardian inference through dedicated Codex endpoints
```

claude-acp:haiku (8323 ms):
```
Route Guardian inference to dedicated endpoints when enabled

Add the guardianv2.free_guardian option, which sends Guardian review
and risk classification to the unmetered Codex /guardian and
/guardian-classifier routes. The routes are used only with ChatGPT
auth against the default Codex backend; other providers keep using
/responses. Guardian requests on these routes omit service_tier.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (12086 ms):
```
FAIL: no message in the report: ...implementation

### Notes
- Commit message written in English following the project's imperative style and parenthetical issue ID convention from recent commits
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (4873 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-1 (diff 600 chars, git 316 ms)

Actual:
```
IJPL-249847 LSP API: make LspClientImpl.lsp4jServer property public
```

claude:haiku:safe (2134 ms):
```
refactor LSP: expose lsp4jServer with @ApiStatus.Internal
```

claude:claude-haiku-5-5:safe:low (2868 ms):
```
LSP: expose lsp4jServer to API consumers

The getter was internal, which kept the LSP4J server
hidden from other modules. Make it public and mark it
@ApiStatus.Internal so it is usable across modules
without being treated as a stable API.
```

codex:gpt-5.6-luna:lean:low (2590 ms):
```
expose lsp4jServer as an internal API property
```

codex-acp:gpt-5.6-luna[low] (3152 ms):
```
LSP: expose LspClientImpl.lsp4jServer as an internal API
```

claude-acp:haiku (4840 ms):
```
refactor LSP: make lsp4jServer public as an ApiStatus.Internal API
```

junie:junie-lite (7758 ms, cleaned):
```
refactor LSP: expose LspClientImpl.lsp4jServer as internal API
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2768 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-2 (diff 3499 chars, git 7354 ms)

Actual:
```
preserve daemon suspensions across modality changes (IJPL-244762)

Inline rename suspends daemon updates with a disposable handle.
Closing a modal dialog can re-enable the timer while that handle
remains active. Highlighting can then resume before the rename ends.

Require both an enabled timer and zero active suspensions before daemon
updates can run. This keeps modality changes from overriding nested
suspensions.

Add a test for nested suspensions to DaemonRespondToChangesTest.
Check that entering and leaving a modal context preserves both handles.
Check that the daemon resumes only after the last handle is disposed.
```

claude:haiku:safe (2204 ms, the IDE drops IJPL-244762):
```
IJPL-244762 respect nested daemon suspensions when modality changes

The daemon update timer should remain disabled when multiple suspensions
are active, even if the modality changes. Previously, the timer state
did not account for nested disableUpdateByTimer calls, causing the daemon
to resume prematurely when closing a modal dialog while suspensions were
still in effect.
```

claude:claude-haiku-5-5:safe:low (2143 ms):
```
Fix daemon update-by-timer check ignoring nested suspensions

The isUpdateByTimerEnabled() check returned only the flag and ignored
the nested disable count, so the daemon could resume while a
suspension was still active after a modal state change. Also add a
regression test covering this case.
```

codex:gpt-5.6-luna:lean:low (2730 ms, the IDE drops IJPL-244762):
```
IJPL-244762 respect nested daemon suspensions during modality changes

Add a regression test and account for active suspension scopes when checking
whether daemon updates are enabled.
```

codex-acp:gpt-5.6-luna[low] (2513 ms, the IDE drops IJPL-244762):
```
IJPL-244762 respect nested daemon suspensions after modality changes

Add a regression test and include active suspension count in daemon timer state.
```

claude-acp:haiku (5698 ms):
```
Keep update-by-timer disabled while any daemon suspension is active
```

junie:junie-lite (11452 ms):
```
FAIL: no message in the report: Wrote a git commit message for the provided diff.
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2616 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-3 (diff 9398 chars, git 11280 ms)

Actual:
```
IJPL-254187 provide public api for building rich commit details
```

claude:haiku:safe (2213 ms):
```
[vcs-log] extract commit changes viewer into a reusable component

Extract the logic for showing commit changes with details into a new
CommitChangesViewer component. This allows other parts of the codebase
to display commit changes and details in a consistent way without
duplicating the panel setup and configuration.
```

claude:claude-haiku-5-5:safe:low (1688 ms):
```
Extract the common details panel and changes dialog into a reusable CommitChangesViewer
```

codex:gpt-5.6-luna:lean:low (2394 ms):
```
vcs-log: extract commit changes viewer for reuse
```

codex-acp:gpt-5.6-luna[low] (3838 ms):
```
vcs-log: extract reusable commit changes viewer
```

claude-acp:haiku (5560 ms):
```
[vcs-log] move commit changes dialog into CommitChangesViewer
```

junie:junie-lite (9313 ms):
```
FAIL: no message in the report: ... changes viewing logic from `ShowAllAffectedFromHistoryAction` into a new `CommitChangesViewer` utility class, making it reusable across the codebase.
</submit>
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2741 ms):
```
FAIL: stopReason cancelled
```

## intellij-community-4 (diff 36663 chars, git 543 ms)

Actual:
```
PY-92887 Preserve operator overload types during type inference

Previously, flattening overloads and regrouping them by PSI scope merged different receiver specializations and lost result types.
Now each `PyOverloadType` is evaluated separately, preserving those specializations.
```

claude:haiku:safe (3182 ms, the IDE drops PY-92887):
```
PY-92887 preserve arguments for operator resolution with generic union members

When resolving operator overloads for union types, the arguments must be
preserved with each union member's resolved operator. This ensures that
overload selection happens independently for each union member, allowing
generic union members to correctly resolve their type parameters based on
the actual arguments.

Also extract the operator resolution result into a dedicated data class
and make the binary expression comparison chaining aware at the reference
resolution level.
```

claude:claude-haiku-5-5:safe:low (3519 ms):
```
[python] Resolve operators per union member with their arguments

Operator resolution flattened candidates across union members, so a
union member's overloads could be matched against the wrong operand
and the result collapsed. Keep each resolved operator together with
its receiver type, arguments, and side (inplace, left, right), and
match arguments per operator. Subscript and binary operators now
resolve against the actual operands, including chained comparisons.
```

codex:gpt-5.6-luna:lean:low (2546 ms, the IDE drops PY-92887):
```
PY-92887 Preserve arguments and sides in operator resolution
```

codex-acp:gpt-5.6-luna[low] (3595 ms):
```
refactor [python]: Preserve arguments during operator resolution
```

claude-acp:haiku (7484 ms):
```
Keep operator arguments and side with resolved union members

Resolve operators per receiver and keep each candidate's arguments and
operator side. Union members are then checked against their own
operands instead of a flattened list of callables.

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

junie:junie-lite (10860 ms, cleaned):
```
refactor [python]: Restructure operator resolution to preserve argument and side information

Introduce OperatorResolveResult and ResolvedOperator to carry the self
type, method, arguments, and operator side through the resolution
pipeline. This lets callers enforce strict union semantics by checking
each union member independently rather than flattening all candidates.

- Replace resolveGroupingByReceiver() with resolveOperator() returning
  typed records
- Add OperatorSide enum to distinguish inplace, left, and right operators
- Update PyCallExpressionHelper to consume the new format
- Expose getChainedComparisonAwareLeftExpression as a static helper
- Add getArguments() to PySubscriptionExpression for consistent access
```

junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna (2967 ms):
```
FAIL: stopReason cancelled
```
