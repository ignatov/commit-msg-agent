# bench-files-intellij

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | tool calls | cost $ |
|---|---|---|---|---|---|---|---|---|---|
| claude:haiku:safe | 35/35 | 2667 | 4888 | 8389 | 0 | 66 | 0 | - | 0.0159 |
| claude:haiku:safe+files | 35/35 | 9065 | 86417 | 71201 | 63607 | 761 | 0 | 4.2 | 0.0253 |
| claude:claude-haiku-5-5:safe:low | 35/35 | 2091 | 3435 | 11273 | 10964 | 90 | 17 | - | 0.0065 |
| claude:claude-haiku-5-5:safe:low+files | 35/35 | 4652 | 8532 | 24786 | 19469 | 375 | 116 | 1.3 | 0.0539 |
| codex:gpt-5.6-luna:lean:low | 35/35 | 2537 | 4881 | 8408 | 0 | 24 | 7 | - | - |
| codex:gpt-5.6-luna:lean:low+files | 35/35 | 6403 | 11281 | 19794 | 12169 | 232 | 77 | 2.0 | - |

## intellij-community-1 (diff 387 chars, git 3754 ms)

Actual:
```
misc codeowners: give IJPL the community productLayout package

The product model under community/platform/build-scripts/src/org/jetbrains/intellij/build/productLayout belongs to IJPL.
The OWNERSHIP syntax has no negation pattern. A later pattern rule in the parent file overrides the IJ Build Scripts Maintainers default for that package.
```

claude:haiku:safe (1910 ms):
```
docs: add IJPL ownership mapping for productLayout build scripts
```

claude:haiku:safe+files (4898 ms, the IDE drops IJI-3163):
```
IJI-3163 Add codeowners mapping for productLayout directory
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1678 ms):
```
IJ-OWNERSHIP: add productLayout ownership rule for IJPL
```

claude:claude-haiku-5-5:safe:low+files (3829 ms):
```
Add CODEOWNERS mapping for product layout build code

The productLayout build package had no ownership entry, so changes to it
fell through to the generic build scripts owners. Map it to IJPL.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2709 ms):
```
Add IJPL ownership for product layout build sources
```

codex:gpt-5.6-luna:lean:low+files (7807 ms):
```
Add ownership for the product layout build sources
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-2 (diff 938 chars, git 913 ms)

Actual:
```
[jps] rename builder to mitigate TW-104697
```

claude:haiku:safe (1865 ms):
```
[jps build] Capitalize "Project Dependencies Resolver" in builder name
```

claude:haiku:safe+files (4487 ms):
```
[i18n] Apply ellipsis fix in project dependencies resolver message
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1831 ms):
```
Capitalize the resolver name to match the bundle's display name convention
```

claude:claude-haiku-5-5:safe:low+files (4220 ms):
```
[jps] Capitalize project dependencies resolver builder name
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2728 ms):
```
[jps] Capitalize project dependencies resolver name
```

codex:gpt-5.6-luna:lean:low+files (4567 ms):
```
Capitalize Project Dependencies Resolver builder name
```
Tools: `git diff --cached`

## intellij-community-3 (diff 1021 chars, git 2212 ms)

Actual:
```
IDEA-392279 [java-psi] Follow-up: remove redundant instantiateWith call
```

claude:haiku:safe (1865 ms):
```
cleanup: simplify nullability check in inference incorporation phase
```

claude:haiku:safe+files (5136 ms):
```
cleanup: simplify nullability comparison in inference incorporation
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2009 ms):
```
Simplify nullability propagation for inferred bounds

The bound's nullability is now set directly from the usage nullability
instead of being instantiated with the existing bound nullability first.
```

claude:claude-haiku-5-5:safe:low+files (3839 ms):
```
inference: simplify nullability propagation of bounds

Use the usage nullability directly when updating a bound instead of
first instantiating it with the bound's own nullability.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2899 ms):
```
inference: simplify nullability incorporation
```

codex:gpt-5.6-luna:lean:low+files (11281 ms):
```
inference: fix nullability propagation in incorporation phase
```
Tools: `git diff --cached -- src/com/intellij/psi/impl/source/resolve/graphInference/InferenceIncorporationPhase.java && git sta`, `git diff --cached -- java/java-psi-impl/src/com/intellij/psi/impl/source/resolve/graphInference/InferenceIncorporationPh`

## intellij-community-4 (diff 1372 chars, git 186 ms)

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

claude:haiku:safe (2443 ms):
```
tests [editor]: verify split window selection and navigation

The test now explicitly validates that creating a vertical split copies
the selected tab into the new window and verifies the window navigation
order. Changed assertions to check specific window instances and their
selection state instead of just verifying the previous window's file.
```

claude:haiku:safe+files (8264 ms):
```
tests [fileEditor]: improve assertions in vertical split window test

Add more comprehensive assertions to verify that the split copies the
selected tab into the new window and that window navigation works
correctly. Capture the secondary window return value from
createVerticalSplitter to enable detailed validation of window state.
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2073 ms):
```
tests [editor]: cover secondary window after vertical split

The test previously asserted the previous window's selection without
checking the window set. Verify both windows exist, that the split
copies the selected file, and that prev/next navigation links them.
```

claude:claude-haiku-5-5:safe:low+files (4710 ms):
```
tests [editor]: check both windows after a vertical split

The split test only asserted the previous window's selected file, so it
would still pass if the split created no window or copied the wrong tab.
Assert the window set, the file copied into the new window, and the
prev/next navigation between the two windows.
```
Tools: `git diff --cached; git branch --show-current`

codex:gpt-5.6-luna:lean:low (2802 ms):
```
tests [editor]: cover split window ordering and selected tabs
```

codex:gpt-5.6-luna:lean:low+files (6826 ms):
```
tests [editor]: cover split window placement and selection
```
Tools: `git diff --cached -- .../testSrc/com/intellij/openapi/fileEditor/FileEditorManagerTest.kt`, `git diff --cached`

## intellij-community-5 (diff 1529 chars, git 1346 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, adjust benchmark, part10
```

claude:haiku:safe (2817 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust performance test parameters, part10

Reduce renameVariable action frequency from 10% to 0% due to
performance issues, and increase single user batch count from 20 to
1000 for more comprehensive testing.
```

claude:haiku:safe+files (12223 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, adjust test parameters, part10

Increase single user batches from 20 to 1000 for more thorough
testing coverage. Exclude renameVariable from random action pool and
add TODO comment noting performance issue.
```
Tools: `git diff --cached`, `git log --oneline -20`, `git branch --show-current`, `git status`

claude:claude-haiku-5-5:safe:low (2177 ms):
```
[editor] DocBranchPerformanceTest: tune action mix and batch count

Rebalance the random action distribution so rename is picked with the
correct weight after reducing the range to 89. Mark renameVariable as
too slow and raise the single-user batch count to 1000 to exercise the
benchmark longer.
```

claude:claude-haiku-5-5:safe:low+files (4724 ms):
```
[editor] Temporarily skip renameVariable in DocBranch perf test

renameVariable is too slow and dominates the single-user benchmark,
so drop it from the random action mix for now and raise the number of
single-user batches to keep the total op count meaningful.
```
Tools: `git diff --cached`, `git rev-parse --abbrev-ref HEAD`

codex:gpt-5.6-luna:lean:low (2432 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, increase performance test batches
```

codex:gpt-5.6-luna:lean:low+files (7486 ms):
```
[editor] increase single-user performance test workload
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-6 (diff 1688 chars, git 733 ms)

Actual:
```
AND-150 [android] Remove dead Compose compiler keys from K2ComposeCompilerConfigurationProvider
```

claude:haiku:safe (2250 ms):
```
Remove Compose compiler configuration flags for intrinsic remember and strong skipping

These flags are no longer needed in the K2 compiler configuration.
The intrinsic remember optimization and strong skipping features are
now handled differently or disabled at a higher level.
```

claude:haiku:safe+files (4731 ms):
```
Remove intrinsic remember and strong skipping configuration from K2
Compose compiler provider
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1892 ms):
```
Remove unused Compose compiler options for K2 IDE config
```

claude:claude-haiku-5-5:safe:low+files (3880 ms):
```
Remove obsolete IntrinsicRemember and strong skipping config

The IntrinsicRemember feature flag and its optimization key are no
longer needed, and strong skipping no longer needs to be disabled
explicitly for the IDE compiler configuration. Drop these settings so
the plugin uses the compiler defaults.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2481 ms):
```
Remove obsolete K2 Compose compiler options
```

codex:gpt-5.6-luna:lean:low+files (4643 ms):
```
Remove obsolete Compose compiler options for K2
```
Tools: `git diff --cached --stat && git diff --cached`

## intellij-community-7 (diff 1952 chars, git 485 ms)

Actual:
```
[MRI-5544] switch intellij.java.ide.customization.backend.tests
```

claude:haiku:safe (2215 ms, the IDE drops MRI-5563):
```
[MRI-5563] switch intellij.java.ide.customization.backend.tests

Move the jps_test target to the top of the BUILD.bazel file and add it to
bazel-migrated-test-modules.txt to enable running the tests with Bazel.
```

claude:haiku:safe+files (5094 ms):
```
switch intellij.java.ide.customization.backend.tests

Move the test configuration to the bazel-migrated-test-modules.txt and
restructure the BUILD.bazel to add timeout and community test tags,
aligning with the standard Bazel test migration pattern.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1573 ms, the IDE drops MRI-5552):
```
[MRI-5552] switch intellij.java.ide.customization.backend.tests
```

claude:claude-haiku-5-5:safe:low+files (7067 ms):
```
tests: switch intellij.java.ide.customization.backend.tests to Bazel

Mark the module as Bazel-migrated and move its test target into a
hand-maintained jps_test block, so the generator no longer owns it.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2572 ms, the IDE drops IJPL-256791):
```
IJPL-256791 tests: add intellij.java.ide.customization.backend.tests to Bazel migration
```

codex:gpt-5.6-luna:lean:low+files (5711 ms):
```
IJPL-256xxx tests: migrate intellij.java.ide.customization.backend.tests
```
Tools: `/bin/zsh -lc "git diff --cached -- build/bazel-migrated-test-modules.txt java/ide-customization/backend/BUILD.bazel && p`

## intellij-community-8 (diff 2104 chars, git 9124 ms)

Actual:
```
KTIJ-39860 [kotlin] Fix impossible is check null quick-fix
```

claude:haiku:safe (2621 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix operator logic in ReplaceIsCheckWithNullCheckFix

The negation condition for selecting the null check operator was inverted,
causing `is` checks to be replaced with the wrong operator. When the check
is negated, it should use `!=`, and when not negated, it should use `==`.
```

claude:haiku:safe+files (4921 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix operator logic in ReplaceIsCheckWithNullCheckFix

The operator assignment was reversed. When isNegated is true,
the operator should be != (not equal), and when false, it should
be == (equal). Update test expectations accordingly.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2221 ms):
```
Fix inverted operator in ReplaceIsCheckWithNullCheck quickfix

The fix produced "== null" for negated is-checks and "!= null" for
plain is-checks, which is backwards. Swap the operators so that
"!is" becomes "!= null" and "is" becomes "== null", and update the
two expected test outputs to match.
```

claude:claude-haiku-5-5:safe:low+files (3845 ms):
```
Fix inverted null check in ReplaceIsCheckWithNullCheck quickfix

The quickfix picked the operator backwards: `is T` became `!= null` and
`!is T` became `== null`. Swap the operators so the fix preserves the
meaning of the original expression, and update the test expectations.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2652 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix null-check replacement operators
```

codex:gpt-5.6-luna:lean:low+files (4655 ms, the IDE drops KTIJ-39860):
```
KTIJ-39860 [kotlin] Fix null-check replacement operators
```
Tools: `git diff --cached`

## intellij-community-9 (diff 2367 chars, git 895 ms)

Actual:
```
[git] Initialize recentCommitsProvider in the background (IJPL-248720)
```

claude:haiku:safe (2319 ms):
```
[git]: Lazily initialize GitRecentCommitsProvider on Default dispatcher

Wrap the GitRecentCommitsProvider initialization in an async task
on the Default dispatcher to defer its creation and avoid blocking
the project scope during startup.
```

claude:haiku:safe+files (9087 ms):
```
[git] Make recentCommitsProvider initialization lazy in GitAmendCommitService

Changed recentCommitsProvider from eager initialization to lazy
initialization using scope.async. This defers the creation of
GitRecentCommitsProvider until it's actually needed, improving
startup performance.
```
Tools: `git diff --cached`, `git log --oneline -20 | head -20`, `git rev-parse --abbrev-ref HEAD`

claude:claude-haiku-5-5:safe:low (1930 ms):
```
Make GitAmendCommitService recent-commits provider load asynchronously

The recent commits provider was constructed eagerly in the service
constructor, which may block service initialization. It is now created
in a background async and awaited when amend targets are requested.
```

claude:claude-haiku-5-5:safe:low+files (3748 ms):
```
git: create recent commits provider for amend lazily

The provider is constructed on a background dispatcher and awaited when
amend-specific targets are requested, so service creation no longer
blocks on building it.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2407 ms):
```
git: initialize amend commit provider asynchronously
```

codex:gpt-5.6-luna:lean:low+files (4739 ms):
```
git: initialize amend commit provider asynchronously
```
Tools: `git diff --cached -- plugins/git4idea/backend/src/checkin/GitAmendCommitService.kt`

## intellij-community-10 (diff 2642 chars, git 158 ms)

Actual:
```
cleanup [python]: Clean up formatting and imports in PyTypeChecker
```

claude:haiku:safe (1892 ms, the IDE drops PY-92880):
```
PY-92880 clean up unused imports and format function signature
```

claude:haiku:safe+files (7836 ms):
```
Clean up imports and reformat function signature in PyTypeChecker
```
Tools: `git diff --cached`, `git log --oneline -10`, `git rev-parse --abbrev-ref HEAD`

claude:claude-haiku-5-5:safe:low (1748 ms):
```
Refactor PyTypeChecker: remove unused Kotlin component imports and wrap subclassElementType signature
```

claude:claude-haiku-5-5:safe:low+files (4392 ms):
```
misc python: tidy imports and signature in PyTypeChecker
```
Tools: `git diff --cached`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (2376 ms, the IDE drops PY-92880):
```
PY-92880 Improve PyTypeChecker formatting and imports
```

codex:gpt-5.6-luna:lean:low+files (4786 ms):
```
misc [python]: Clean up PyTypeChecker formatting
```
Tools: `git diff --cached`

## intellij-community-11 (diff 3296 chars, git 8327 ms)

Actual:
```
[skeleton] IJPL-257214 use the fallback renderer instead of the canvas in the Windows frontend
```

claude:haiku:safe (2667 ms):
```
refactor [skeleton]: rename EditorSkeletonWaylandRenderer to EditorSkeletonFallbackRenderer

Use EDT-confined rendering on Windows frontend to avoid JBR-10643.
The renderer avoids creating a heavyweight Canvas, which works for
both Wayland (submits frames to Wayland) and Windows frontend
(avoids the Canvas buffer strategy issue).
```

claude:haiku:safe+files (6094 ms):
```
refactor [skeleton]: rename Wayland renderer to Fallback for both Wayland and Windows

The renderer avoids heavyweight `Canvas` which works better on Wayland
and avoids JBR-10643 on Windows JetBrains Client frontends. Extend its
use to Windows while updating documentation to reflect its more general
purpose.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (3363 ms):
```
[skeleton] use fallback renderer for Windows JetBrains Client

Canvas-based skeleton rendering hits JBR-10643 on Windows when running
as a JetBrains Client. Use the EDT-painted renderer, previously used
only on Wayland, for that case too. Rename it to
EditorSkeletonFallbackRenderer to reflect its broader use.
```

claude:claude-haiku-5-5:safe:low+files (4576 ms):
```
skeleton: use Swing renderer on Windows JetBrains Client

Canvas-based skeleton rendering hits JBR-10643 on Windows when running
as a JetBrains Client. Use the Swing fallback renderer there too, and
rename the Wayland-specific renderer to EditorSkeletonFallbackRenderer
since it now serves both cases.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2545 ms):
```
[skeleton] use fallback renderer for Windows frontend
```

codex:gpt-5.6-luna:lean:low+files (4794 ms):
```
[skeleton] use fallback renderer for Windows frontend
```
Tools: `git diff --cached --stat && git diff --cached`

## intellij-community-12 (diff 3785 chars, git 922 ms)

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

claude:haiku:safe (2166 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add test for Python tool window startup flag on split frontend
```

claude:haiku:safe+files (8408 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a test for the Python tool window startup flag
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2260 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add a startup-flag test for the Python tool window

The branch name is not provided, so no issue id is taken from it beyond what the recent commits show; the ticket PY-89999 appears in the file's own docstring, so the summary uses the subject as a test addition.
```

claude:claude-haiku-5-5:safe:low+files (3833 ms, the IDE drops PY-89999):
```
[pycharm] PY-89999 Add lambda test for PPOTW startup flag

Pin the split frontend's default for the Python tool window startup
availability registry key, so the frontend customization cannot
silently drop the rule that keeps the tool window visible at startup.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2555 ms):
```
[pycharm] Add split frontend startup flag test for Python tool windows
```

codex:gpt-5.6-luna:lean:low+files (8528 ms):
```
[pycharm] Add a split frontend startup flag test
```
Tools: `git diff --cached -- pycharm/src/com/jetbrains/python/tools/lambdaTests/PythonToolWindowStartupFlagTest.kt || git diff -`, `git diff --cached --stat && git diff --cached`, `git branch --show-current`

## intellij-community-13 (diff 4115 chars, git 1013 ms)

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

claude:haiku:safe (2772 ms):
```
refactor [platform]: Set EDT thread priority using native API

The native SetThreadPriority call is now used directly instead of
Thread.setPriority, since Java thread priority is inherited by lazily
started workers, causing priority inversion when they hold up the queue.
Native priority is not inherited, avoiding this issue.
```

claude:haiku:safe+files (6635 ms):
```
refactor [platform]: Use native SetThreadPriority instead of Java setPriority

Changed EDT priority setting to call Windows SetThreadPriority directly
instead of Thread.setPriority. Native priority is not inherited by
lazily-started coroutine workers, avoiding the issue where Java
priority gets propagated to secondary threads that could stall the
event dispatch thread.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2201 ms):
```
refactor platform: Set EDT priority to native HIGHEST

Thread.setPriority copied the Java MAX_PRIORITY to every thread the EDT
spawns, so lazily started kotlinx.coroutines workers ran at
THREAD_PRIORITY_HIGHEST above the threads feeding their queue. Their
spin-wait on a preempted producer then held CPUs for seconds. Setting
the native priority directly avoids the inheritance.
```

claude:claude-haiku-5-5:safe:low+files (4363 ms):
```
Set EDT native priority directly instead of via Java priority

Thread.setPriority(MAX) was copied to threads the EDT spawns, so lazily
started kotlinx.coroutines workers ran at highest priority and starved
the producers they waited on. Call SetThreadPriority on the EDT instead;
native priority is not inherited by child threads.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2371 ms):
```
refactor [platform]: Set EDT priority natively without inheriting it
```

codex:gpt-5.6-luna:lean:low+files (8227 ms):
```
refactor [platform]: Set Windows EDT priority natively
```
Tools: `/bin/zsh -lc "git diff --cached -- '.../src/com/intellij/platform/ide/bootstrap/UiThreadPriority.java' && git status --s`, `git diff --cached -- platform/platform-impl/bootstrap/src/com/intellij/platform/ide/bootstrap/UiThreadPriority.java`

## intellij-community-14 (diff 4485 chars, git 948 ms)

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

claude:haiku:safe (2475 ms):
```
[navigation] Handle cancellation gracefully in navigation requests

Navigation can be canceled for various reasons: a newer navigation request,
user cancellation of progress, or normal coroutine cancellation. Added proper
exception handling to distinguish between normal cancellation (which throws
CancellationException) and external cancellation (which returns false).
Updated documentation to clarify cancellation behavior and guarantees.
```

claude:haiku:safe+files (14762 ms):
```
[navigation] Handle cancellation distinction in NavigationService

Improve cancellation handling by distinguishing between normal coroutine
cancellation and external navigation cancellations. When navigation is
canceled by a newer request or user action, return false instead of
throwing CancellationException. Only throw the exception in normal
coroutine cancellation cases (when the caller is disposed or explicitly
canceled). Add documentation explaining the cancellation semantics.
```
Tools: `git status`, `git diff --cached`, `git rev-parse --abbrev-ref HEAD 2>/dev/null || git branch -a | head -5`, `git log --oneline -15`

claude:claude-haiku-5-5:safe:low (1596 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Cancel navigation with CancellationException handling
```

claude:claude-haiku-5-5:safe:low+files (4161 ms, the IDE drops IJPL-253947):
```
[navigation] IJPL-253947: Return false instead of throwing on navigation cancel

Navigation canceled by a newer request or by the user now returns false
rather than leaking CancellationException to the caller. Only real
coroutine cancellation of the caller still propagates, and the API
contract documents this.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2350 ms, the IDE drops IJPL-255149):
```
[navigation] IJPL-255149: Clarify navigation cancellation behavior
```

codex:gpt-5.6-luna:lean:low+files (6301 ms):
```
[navigation] Handle external navigation cancellation without throwing
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-15 (diff 4877 chars, git 136 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, JvmStatic, part45
```

claude:haiku:safe (2726 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, @JvmStatic annotations, part45
```

claude:haiku:safe+files (11040 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, JvmStatic interop, part45
```
Tools: `git diff --cached`, `git log --oneline -n 20`, `git rev-parse --abbrev-ref HEAD`, `git log --format="%B" -1 HEAD`

claude:claude-haiku-5-5:safe:low (1751 ms):
```
[editor] Add @JvmStatic to experimental editor factory methods
```

claude:claude-haiku-5-5:safe:low+files (3838 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, expose factories to Java

Mark the companion factory functions with @JvmStatic so Java callers
can use them as static methods instead of through Companion.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2500 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, add Java static factory methods
```

codex:gpt-5.6-luna:lean:low+files (4372 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, add Java static factories
```
Tools: `git diff --cached --stat && git diff --cached`

## intellij-community-16 (diff 5268 chars, git 4051 ms)

Actual:
```
fix [VCS]: Git log: second pressing of "delete branch" button logs an error IJPL-163588

Also fixes IJPL-257749
```

claude:haiku:safe (2670 ms):
```
[git] Handle repeated delete branch requests gracefully

Filter out repositories that no longer have the branch being
deleted, as the request may be stale when users press "Delete"
multiple times before the UI updates. Serialize branch deletion
requests to ensure each sees the result of the previous one.
```

claude:haiku:safe+files (6168 ms):
```
[git] Handle repeated deletion of the same branch

Serialize branch deletion requests with a lock and filter out
repositories where the branch is already deleted to avoid errors
when the same deletion is triggered multiple times.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1843 ms):
```
[git] Prevent repeated branch deletion from running twice

Serialize branch deletion requests and skip repositories where the
branch no longer exists, so a second "Delete" press does not fail or
send a duplicate notification.
```

claude:claude-haiku-5-5:safe:low+files (5122 ms):
```
[git] Ignore repeated deletion of an already deleted branch

A second "Delete" request for the same branch could arrive before the UI
caught up with the first deletion, so the branch was deleted again and
failed. Filter out repositories where the branch no longer exists, and
serialize batch deletions so each one sees the result of the previous.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2394 ms):
```
[git] Ignore repeated branch deletion requests
```

codex:gpt-5.6-luna:lean:low+files (5822 ms):
```
[git] Ignore repeated branch deletion requests
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-17 (diff 6386 chars, git 386 ms)

Actual:
```
[plugin-manager] IJPL-257815 Keep selected rows below sticky headers after refresh

Refreshing plugin sources can replace the selected row and restore an
anchor that leaves the row behind the sticky header.

Reveal the selected row after anchor restoration when the old row was
visible. Leave offscreen selections in place. Add tests for both cases
and update the UI specification.
```

claude:haiku:safe (2739 ms, the IDE drops IJPL-257815):
```
[plugin-manager] IJPL-257815 Reveal replaced selected row after source refresh

When a source refresh replaces a visible selected row, keep it visible
below the sticky header. However, do not scroll to reveal a replaced
selected row that was outside the viewport.
```

claude:haiku:safe+files (12090 ms):
```
[plugin-manager] Keep selected rows visible below sticky header on refresh

When a source refresh replaces a visible selected row, ensure it
remains visible below the sticky header. Do not reveal off-screen
selected rows to preserve the user's current viewport position.
```
Tools: `git diff --cached`, `git rev-parse --abbrev-ref HEAD`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2150 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh
```

claude:claude-haiku-5-5:safe:low+files (4652 ms):
```
[plugin-manager] Reveal replaced selected row after source refresh

When a source refresh replaces the selected row, the new row was not
scrolled into view, so the selection could be lost below the sticky
header. Reveal the replacement only if the old row was already visible,
so refreshes do not move the viewport for offscreen selections.
```
Tools: `git diff --cached; git branch --show-current`

codex:gpt-5.6-luna:lean:low (2444 ms):
```
[plugin-manager] Preserve selected row visibility after refresh
```

codex:gpt-5.6-luna:lean:low+files (8261 ms):
```
[plugin-manager] Preserve selected row visibility after source refresh
```
Tools: `git diff --cached -- .../UnifiedPluginsPageView.kt .../UnifiedPluginsPageRealRowsTest.kt .../unified-plugin-manager-ui.s`, `git diff --cached --stat && git diff --cached`, `git branch --show-current`

## intellij-community-18 (diff 6986 chars, git 6970 ms)

Actual:
```
[java] IDEA-369985 SlowOp in GenerateToStringWorker.exitsMethodDialog
```

claude:haiku:safe (2675 ms):
```
[java] refactor toString generation to use nonblocking read actions

Move the expensive method lookup to a background thread using
nonblocking read actions, and show the conflict dialog on the EDT.
Replace WriteCommandAction with CommandProcessor and the non-cancellable
write action API for better performance and modality handling.
```

claude:haiku:safe+files (9065 ms):
```
[java] Improve threading for GenerateToString action

Split the existing method lookup into a separate background read action
to avoid blocking the EDT, then show the conflict dialog on the EDT only
when needed. Use CommandProcessor instead of WriteCommandAction for
better control over write action execution with progress indication.
```
Tools: `git diff --cached`, `git log --oneline -20`

claude:claude-haiku-5-5:safe:low (2396 ms):
```
Move the toString conflict check off the EDT and run the write action with progress

Generate toString no longer blocks the UI thread while it searches for an existing toString method. The lookup now runs in a background read action, and only the conflict dialog is shown on the EDT. The generation itself runs as a write action with a non-cancellable progress indicator, wrapped in a command.
```

claude:claude-haiku-5-5:safe:low+files (5693 ms):
```
[java] Check generate-toString conflicts in a background read action

The existing-method lookup ran on the EDT before the write command, so
a slow lookup froze the UI. Run the lookup in a non-blocking read
action, show the conflict dialog on the UI thread, and run the write
under a progress indicator inside a command.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2410 ms):
```
[java] Run Generate toString conflict checks off the EDT
```

codex:gpt-5.6-luna:lean:low+files (5295 ms):
```
[Java] Run Generate toString checks in the background
```
Tools: `git diff --cached`

## intellij-community-19 (diff 8020 chars, git 7354 ms)

Actual:
```
[Java. Tests] IDEA-394694 Fix project test leak in `com.intellij.java.codeInspection.GlobalInspectionContextTest`
```

claude:haiku:safe (2605 ms):
```
[tests] cleanup HighlightDisplayKey registration in configureInspections

Register HighlightDisplayKey entries only for inspections that don't
already have them, and unregister them on disposal. This prevents
pollution of the global registry and ensures proper cleanup between
tests. Add comprehensive tests to verify the cleanup behavior in
various scenarios.
```

claude:haiku:safe+files (6182 ms):
```
[test framework] unregister HighlightDisplayKey for configured inspections on disposal

Ensure that HighlightDisplayKey entries created during configureInspections
are properly unregistered when the parentDisposable is disposed. Preserve
keys that existed before configuration or are replaced after it. Add tests
to verify the cleanup behavior in various scenarios.
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (2778 ms):
```
Unregister HighlightDisplayKeys created by configureInspections

configureInspections registers a HighlightDisplayKey for each tool
that lacks one, and never removes it. Keys created by the call are
now unregistered when the parent disposable is disposed. Keys that
were already present, or that were replaced during the test, are left
alone. Keys are also cleaned up when configuration throws midway.
```

claude:claude-haiku-5-5:safe:low+files (4430 ms):
```
[test framework] unregister inspection keys on configureInspections disposal

configureInspections() registered a HighlightDisplayKey for each tool
and never removed it, so keys leaked across tests. Record the keys
that did not exist before the call and unregister them when the
parent disposable is disposed. Keys that were replaced or registered
by someone else in the meantime are left alone.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2346 ms):
```
[test framework] unregister HighlightDisplayKey after configuring inspections
```

codex:gpt-5.6-luna:lean:low+files (6403 ms):
```
[inspections] unregister HighlightDisplayKey once per tool
```
Tools: `git diff --cached --stat && git diff --cached -- src/testFramework/src/com/intellij/testFramework/inspections.kt src/tes`, `git diff --cached --name-only && git diff --cached`

## intellij-community-20 (diff 9108 chars, git 312 ms)

Actual:
```
KTIJ-40403 [kotlin] Offer remove question quick fix before callable references
```

claude:haiku:safe (2154 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Handle nullable callable references with whitespace/comments
```

claude:haiku:safe+files (10064 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Add quick fixes for callable references with question marks and whitespace

Handle cases where question marks in callable reference expressions
are separated from the reference by whitespace or comments, providing
appropriate quick fixes for removal in each scenario.
```
Tools: `git diff --cached`, `git log --oneline -20 | head -15`, `git rev-parse --abbrev-ref HEAD`

claude:claude-haiku-5-5:safe:low (2190 ms):
```
Fix quick fix for '?' in nullable static callable reference LHS

The "Remove '?'" fix was only offered when the question mark was part of the LHS node. It now also handles a '?' separated from the LHS by whitespace or comments, and a '?' placed before the '::' token when the LHS is missing.
```

claude:claude-haiku-5-5:safe:low+files (5163 ms):
```
[kotlin] Find '?' in callable reference LHS across comments and spaces

The "Remove '?'" fix for a static callable reference LHS only matched
a question mark directly attached to the LHS. When a comment or
whitespace separated the '?' from the reference, the fix was not
offered. Look for the token past whitespace and comments on both
sides of the reference.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (3052 ms, the IDE drops KTIJ-39854):
```
KTIJ-39854 [kotlin] Handle spaced and commented callable references
```

codex:gpt-5.6-luna:lean:low+files (6173 ms):
```
[kotlin] Fix callable reference LHS quickfix with whitespace
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-21 (diff 10486 chars, git 204 ms)

Actual:
```
[kotlin] inline: inline type parameters

- simplify type parameters processing

KTIJ-40432
```

claude:haiku:safe (2801 ms):
```
[kotlin] inline: simplify CodeInliner by removing permission annotations and parameters

Remove KaAllowAnalysisOnEdt and KaAllowAnalysisFromWriteAction annotations
that are no longer needed. Refactor processTypeParameterUsages to use context
receiver instead of passing multiple lambda parameters, making the code more
readable and maintainable. Remove unnecessary analyze wrapping in name
validation logic.
```

claude:haiku:safe+files (7891 ms):
```
[kotlin] inline: simplify analyze calls in CodeInliner

Removed usage of deprecated KaAllowAnalysisOnEdt and
KaAllowAnalysisFromWriteAction permissions. Refactored
processTypeParameterUsages to use context receiver instead of
multiple lambda parameters.
```
Tools: `git diff --cached`, `git log --oneline -15`

claude:claude-haiku-5-5:safe:low (2284 ms):
```
[kotlin] inline: drop analysis permission workarounds in CodeInliner

Move type parameter processing into a single analyze session and remove
the allowAnalysisOnEdt and allowAnalysisFromWriteAction wrappers.
Inline the name validator setup in the declaration renaming path.
```

claude:claude-haiku-5-5:safe:low+files (3921 ms):
```
[kotlin] inline: drop allowAnalysis wrappers in CodeInliner

Merge type parameter processing into a single analyze session and remove
the KaAllowAnalysisOnEdt/FromWriteAction opt-ins and wrappers, since the
inliner now runs its analysis within one session.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2401 ms):
```
[kotlin] inline: simplify CodeInliner analysis and type processing
```

codex:gpt-5.6-luna:lean:low+files (4995 ms):
```
[kotlin] inline: simplify type parameter processing
```
Tools: `git diff --cached`

## intellij-community-22 (diff 10986 chars, git 413 ms)

Actual:
```
[markdown] IJPL-257188 Support the Sticky Lines feature in Markdown


Merge-request: IJ-MR-227314
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

claude:haiku:safe (2795 ms):
```
[markdown] Add sticky line support for Markdown headings

Implement FileBreadcrumbsCollector for Markdown to display section
headings as sticky lines. Each heading is pinned in the editor until
the end of its section, allowing readers to always see the current
heading hierarchy. Handle both ATX and Setext style headings, and
scale down headers that don't fit on a single line in sticky mode.
```

claude:haiku:safe+files (11911 ms):
```
[markdown] Add sticky line support for Markdown headings in breadcrumbs

Implement breadcrumb sticky lines for Markdown sections by creating
a new FileBreadcrumbsCollector that tracks heading regions and scales
heading rendering to fit in sticky lines. Also add comprehensive tests
for the sticky line behavior.
```
Tools: `git diff --cached`, `git log --oneline -5`, `git branch --show-current`, `git log --oneline -20 | grep markdown`

claude:claude-haiku-5-5:safe:low (2102 ms):
```
Add sticky lines for Markdown headings in the breadcrumbs

Pin each heading in the editor's sticky lines until the end of its
section, and show the heading hierarchy at the caret line. The sticky
lines come from a new FileBreadcrumbsCollector that wraps the PSI
collector and shares the heading visitor with folding.
```

claude:claude-haiku-5-5:safe:low+files (3847 ms):
```
Add sticky lines for Markdown headings in breadcrumbs

Pin the heading hierarchy at the top of the editor while scrolling a
Markdown file, so the current section stays visible. Headings are
collected from the same header regions the folding builder uses.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2584 ms):
```
IJPL-257xxx Markdown: support sticky heading lines in breadcrumbs

Fix sticky heading rendering in the live preview and add tests for heading scopes.
```

codex:gpt-5.6-luna:lean:low+files (8561 ms):
```
[markdown] Support sticky heading lines in breadcrumbs
```
Tools: `git diff --cached -- plugins/markdown/core/src/main/kotlin/org/intellij/plugins/markdown/breadcrumbs/MarkdownFileBreadcr`, `git diff --cached`, `git branch --show-current`

## intellij-community-23 (diff 12992 chars, git 384 ms)

Actual:
```
[markdown] IJPL-257766 Support Setext headers in Markdown live preview


Merge-request: IJ-MR-227110
Merged-by: Ilia Permiashkin <ilia.permiashkin@jetbrains.com>
```

claude:haiku:safe (3151 ms, the IDE drops IJPL-257433):
```
[markdown] IJPL-257433 Support Setext headings in live preview

Extend live preview to properly render Setext-style headings (underlined
with `===` or `---`). Parse Setext heading content with the correct token
type and treat underlines as horizontal rules. This ensures Setext headings
display with proper folding, HTML generation, and source mapping, replacing
section folds from the code folding builder.
```

claude:haiku:safe+files (10744 ms, the IDE drops IJPL-257527):
```
[markdown] IJPL-257527 Support Setext headings in Markdown live preview

Extend heading HTML generation and live preview specs to handle Setext
headings (with `===` or `---` underlines) in addition to ATX headings.
The underlines are rendered as horizontal rules. Add comprehensive tests
to verify correct folding and rendering of Setext headings.
```
Tools: `git diff --cached`, `git log --oneline -20`, `git rev-parse --abbrev-ref HEAD`

claude:claude-haiku-5-5:safe:low (2052 ms):
```
[markdown] Support Setext headings in Markdown live preview

Setext headings now render as headings in live preview, and their
underlines are painted as horizontal rules. Setext headings with
inline code were previously handled as a special case of the
underline. Setext headings in block quotes stay unchanged.
```

claude:claude-haiku-5-5:safe:low+files (4304 ms):
```
[markdown] Render Setext headings in Markdown live preview as headings

Setext headings were only handled through the underline, which was drawn
as a code-span-only rule. Treat the content line as a heading, like ATX
headings, and draw the underline as a horizontal rule.
```
Tools: `git diff --cached`

codex:gpt-5.6-luna:lean:low (2461 ms):
```
[markdown] Support Setext headings in Markdown live preview
```

codex:gpt-5.6-luna:lean:low+files (5896 ms):
```
[markdown] Support Setext headings in Markdown live preview
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-24 (diff 14987 chars, git 8321 ms)

Actual:
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude:haiku:safe (2390 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

claude:haiku:safe+files (6602 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```
Tools: `git diff --cached`

claude:claude-haiku-5-5:safe:low (1727 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find tests to com.intellij.java.find
```

claude:claude-haiku-5-5:safe:low+files (6372 ms):
```
[Java. Tests] move find tests from com.intellij.find to com.intellij.java.find

Relocate the Java find/usages test sources into the com.intellij.java
package namespace, matching the other test moves in this series. The
imports of platform find classes are made explicit, and the
ShowUsagesActionTest injector now uses myFixture's test root disposable.
```
Tools: `git diff --cached | head -150`, `git branch --show-current; git diff --cached | sed -n 150,400p | grep '^[+-]' | grep -v '^+++\|^---' | head -80`

codex:gpt-5.6-luna:lean:low (2285 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```

codex:gpt-5.6-luna:lean:low+files (4387 ms, the IDE drops IDEA-393917):
```
[Java. Tests] IDEA-393917 move com.intellij.find to com.intellij.java.find
```
Tools: `git diff --cached --stat && git diff --cached`

## intellij-community-25 (diff 16602 chars, git 7928 ms)

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

claude:haiku:safe (2774 ms):
```
refactor air: add a hermetic process table to the observe test fixture

A suite can now provide a fake process table through `Runner::with_process_table`,
so that process probes answer from the table rather than querying the host. The
observe tests use `FakeProcesses` to avoid depending on host processes when marking
workers ready. This makes the tests truly hermetic.
```

claude:haiku:safe+files (9321 ms):
```
refactoring [avl]: make process table probes hermetic with a fake host

A runner can now use a fake process table via `with_process_table()`,
so tests probe declared processes instead of the host. The `FakeProcesses`
table in testkit enables suites to declare process pids and have the
runner answer probes against them. This makes observation tests hermetic
and prevents host process state from affecting test results.
```
Tools: `git diff --cached`, `git log --oneline -15`

claude:claude-haiku-5-5:safe:low (3435 ms):
```
refactoring air: answer process probes from a fake table in tests

Suites that probed their own pid depended on the host's process
table, so a loaded host changed their answers. A runner can now take
a ProcessTable that answers in place of the host, and the observation
fixture uses a fake one.
```

claude:claude-haiku-5-5:safe:low+files (4920 ms):
```
refactoring air: give the lane tests a fake process table

The lane fixture marked workers ready with the test runner's own pid, so
the probe answered from the host and the result depended on the machine.
Let the runner take a ProcessTable in place of the host's process list,
and have the fixture declare its stand-in processes there.
```
Tools: `git diff --cached`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (2537 ms):
```
refactoring air: make process probes hermetic in VM tests
```

codex:gpt-5.6-luna:lean:low+files (4969 ms):
```
refactoring air: make VM process probes hermetic
```
Tools: `git diff --cached --stat && git diff --cached`

## intellij-community-26 (diff 22415 chars, git 8346 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, rename, part3
```

claude:haiku:safe (2035 ms):
```
[editor] Rename DocTextBranch to DocBranch for brevity
```

claude:haiku:safe+files (8999 ms):
```
Refactor: rename DocTextBranch to DocBranch

Shorten the class name by removing the redundant "Text" suffix
for the branch abstraction.
```
Tools: `git diff --cached`, `git log --oneline -10`, `git branch -a | grep -E "^\*"`

claude:claude-haiku-5-5:safe:low (1733 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

claude:claude-haiku-5-5:safe:low+files (3954 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 Rename DocTextBranch to DocBranch

Drop the redundant "Text" from the name, since the type is a branch of
documents, and rename the implementation and its tests to match.
```
Tools: `git diff --cached | head -300`

codex:gpt-5.6-luna:lean:low (2457 ms):
```
[editor] Rename DocTextBranch to DocBranch
```

codex:gpt-5.6-luna:lean:low+files (6058 ms):
```
[editor] Rename DocTextBranch to DocBranch
```
Tools: `git diff --cached`, `git branch --show-current`

## intellij-community-27 (diff 27722 chars, git 132 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, DAG pretty printer, part19
```

claude:haiku:safe (2173 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram, part18
```

claude:haiku:safe+files (8220 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, diagram rendering, part19
```
Tools: `git diff --cached`, `git log --oneline -20`, `git branch -v`

claude:claude-haiku-5-5:safe:low (1793 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, event graph diagram, part18
```

claude:claude-haiku-5-5:safe:low+files (5884 ms):
```
[editor] naive eg-walker, add text diagram of event graph

EventGraph.toString() returned an unhelpful summary, which made failed
replays hard to inspect in logs. Render the runs as box diagrams with
one row per depth and bounded size, so large histories stay readable.
```
Tools: `git diff --cached -- ':!*Test.kt' | head -700; git branch --show-current`

codex:gpt-5.6-luna:lean:low (2648 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 event graph diagram, part18
```

codex:gpt-5.6-luna:lean:low+files (7072 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, event graph diagram
```
Tools: `git diff --cached --stat && git diff --cached -- .../EventGraphDiagram.kt .../EventGraphImpl.kt .../EventGraphDiagramTes`, `git diff --cached --unified=3`

## intellij-community-28 (diff 41351 chars, git 417 ms)

Actual:
```
IJPL-252267 Add UI for editing default excludes
```

claude:haiku:safe (3281 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default .analysisignore lines editable in settings

Add a settings panel for editing the default exclusion patterns that apply to
project roots without a .analysisignore file. The user can now customize these
patterns through the File Types settings under a new "Default Exclusions" tab.

The patterns are stored only when they differ from the built-in defaults, and
the default entity automatically syncs when the user changes them through the
settings panel.
```

claude:haiku:safe+files (13078 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default analysis ignore lines editable in settings

The built-in default lines for analysis ignore patterns can now be
customized by users through the File Types settings panel. The patterns
are stored in the AnalysisIgnoreDefaultsSettings service and synced to
default entities whenever they change.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`, `git branch --show-current`, `git log --oneline -15`

claude:claude-haiku-5-5:safe:low (2175 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Make default .analysisignore lines editable in File Types

Default exclusions of .analysisignore are now stored in application
settings and shown in a new tab of the File Types settings. Edited
lines replace the built-in ones for new files and for existing default
entities, so that a later product version can still change the
built-in lines.
```

claude:claude-haiku-5-5:safe:low+files (8218 ms):
```
Let users edit default .analysisignore exclusions

The default exclusions for project roots without an .analysisignore
file were fixed in code. Add a Default Exclusions tab to the File Types
settings so users can edit them. The lines are stored in
analysisIgnore.xml, and nothing is stored while they keep the built-in
set, so later product versions can change the defaults.

Default entities are resynced when the lines change, and only supported
patterns are kept.
```
Tools: `git diff --cached`, `git diff --cached -- platform/lang-impl platform/lang-api/resources platform/platform-impl 2>/dev/null | grep -E '^[+-]'`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (2529 ms, the IDE drops IJPL-252267):
```
IJPL-252267 Add editable default exclusions settings
```

codex:gpt-5.6-luna:lean:low+files (8743 ms):
```
Add editable default exclusions for .analysisignore
```
Tools: `git diff --cached --stat && git diff --cached -- platform/lang-api/resources/messages/LangBundle.properties platform/lan`, `git diff --cached -- platform/lang-impl/src/com/intellij/openapi/fileTypes/impl/FileTypeConfigurable.java platform/lang-`, `git branch --show-current`

## intellij-community-29 (diff 59619 chars, git 10507 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, run-length encode, part2
```

claude:haiku:safe (4888 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 eg-walker run-length encoding, part 2

Implement run-length encoding for event storage: one StoredRun per
logical operation, not per character. Event.Insert and Event.Delete
now span multiple units via length() and content(). The graph size()
is the total unit count; the new runCount() is the storage count.

The replay per EgWalkerReplay still walks one unit at a time; per-unit
items and parents within a run are implicit (parent is the preceding
unit). The per-agent index tracks seqs and lvs of run boundaries for
O(1) lookups instead of O(n) scans. Merging splits a partly-known run
and appends only its unknown suffix. Add Lv as a semantic type alias
for clarity.
```

claude:haiku:safe+files (11914 ms):
```
[editor] eg-walker: run-length encode events, part 2

Implement run-length encoding of the event graph storage: one Event
represents multiple consecutive single-character operations with ids
([agent], seq) to ([agent], seq + length - 1). The replay walks one
unit at a time as before, but runs coalesce storage wins. The per-agent
index enables efficient id lookups and collision detection. A merge
across run boundaries correctly appends only the unknown suffix of a
run. Fuzz tests verify the encoding is semantically transparent.
```
Tools: `git diff --cached`, `Read ~/.claude/projects/…/tool-results/…`

claude:claude-haiku-5-5:safe:low (2235 ms):
```
Run-length encode editor event graph storage

Events now cover runs of characters instead of one character each. The graph stores one entry per run, and merges split runs that are only partly known. This makes large documents cheap to store and keeps the replay unchanged.
```

claude:claude-haiku-5-5:safe:low+files (6650 ms):
```
[editor] run-length encode Eg-walker event graph

Store consecutive single-character operations from one agent as one
event covering a range of seqs and lvs. This keeps the graph and the
per-agent id index proportional to the number of runs rather than to
the number of characters.

Replay still walks one unit at a time, so this change does not speed up
merging yet. It only reduces the storage and lookup cost of the graph.
```
Tools: `git diff --cached -- ':!*Test*' | head -700`, `git diff --cached --stat >/dev/null; git diff --cached -- ':!*Test*' | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | sed `

codex:gpt-5.6-luna:lean:low (2335 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 add run-length encoding to eg-walker events
```

codex:gpt-5.6-luna:lean:low+files (10731 ms):
```
[editor] naive eg-walker, run-length encode event graph
```
Tools: `git diff --cached --stat && git diff --cached -- src/platform/platform-impl/src/com/intellij/openapi/editor/impl/experim`, `/bin/zsh -lc "git diff --cached --unified=3 | sed -n '1,260p'"`, `/bin/zsh -lc "git diff --cached --unified=1 -- platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/Even`, `git branch --show-current && git log -10 --format=%s`

## intellij-community-30 (diff 99790 chars, truncated, git 171 ms)

Actual:
```
[editor] IJPL-254637 naive eg-walker, move offset, part51
```

claude:haiku:safe (2372 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51
```

claude:haiku:safe+files (86417 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text moves, part51

Add support for tracking text moves in document operations. A move is
represented as an insert and a delete pair with corresponding move
offsets that reference each other. Extends DocumentOp with moveOffset()
method, refactors BatchingSink as a state machine to handle move
operations, and enhances ReplayWalker to detect and report moves when
the moved text is intact. Includes validation in DocBranchImpl and
EventImpl to ensure move offsets are valid and don't overlap with edited
text. Adds comprehensive tests for move handling.
```
Tools: `git diff --cached --stat`, `git diff --cached | head -300`, `git diff --cached | wc -l`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/BatchingSink.kt | head -200`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/ex/experimental/DocBranch.kt platform/core-impl/src`, `git diff --cached --name-only | grep -i move`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/ReplayWalker.kt | head -150`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/ | grep "^diff --git" | head -20`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/EventImpl.kt`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/StoredRun.kt`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/EgWalkerReplay.kt | head -100`, `git log --oneline -5`, `git rev-parse --abbrev-ref HEAD`, `git log --all --oneline | grep IJPL-254637 | head -10`, `git log --all --oneline | grep "IJPL-254637.*part" | head -1`, `git diff --cached platform/core-impl/src/com/intellij/openapi/editor/impl/experimental/DocBranchImpl.kt | head -150`

claude:claude-haiku-5-5:safe:low (1853 ms, the IDE drops IJPL-254637):
```
[editor] IJPL-254637 naive eg-walker, text move ops, part51
```

claude:claude-haiku-5-5:safe:low+files (8532 ms):
```
[editor] naive eg-walker, text move ops, part51

Let a move of text be recorded as one insert and one delete that name
each other by move offset, so a merge keeps the moved text intact.
Replay emits such a pair only when the source still holds the fragment.
A move that fails the check, or that a merge breaks apart, falls back
to plain insert and delete ops.
```
Tools: `git diff --cached --stat >/dev/null; git diff --cached -- '*BatchingSink.kt' '*DocBranchImpl.kt' '*ReplayWalker.kt' '*Do`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (4881 ms):
```
[editor] naive eg-walker, text moves, part51
```

codex:gpt-5.6-luna:lean:low+files (11248 ms):
```
[editor] naive eg-walker, text moves, part51
```
Tools: `git diff --cached --stat && git diff --cached -- core-impl/src/com/intellij/openapi/editor/impl/experimental/BatchingSin`, `/bin/zsh -lc "git diff --cached -- '*BatchingSink.kt' '*ReplayWalker.kt' '*DocumentOp.kt' | sed -n '1,260p'"`, `/bin/zsh -lc "git diff --cached -- '*ReplayWalker.kt' '*EgWalkerReplay.kt' '*DocBranchImpl.kt' '*EventImpl.kt' '*StoredR`, `git branch --show-current`

## intellij-community-31 (diff 145671 chars, truncated, git 253 ms)

Actual:
```
PY-89567 [debugpy] move launch work off the EDT

- Replace AppUIExecutor EDT hops with `asyncPromise`.
- Collapse the legacy GeneralCommandLine patcher chain.
- Drop @RequiresEdt from `createSessionEx`.
- Collapse PyDebugRunner/PyDebugProcess to the one surviving launch
  path; drop the dead server-mode branch, its registry key, and the
  options it exposed
- Delete the pydevSrc client-mode-transport chain it alone reached
  (ClientModeMultiProcessDebugger, ClientModeDebuggerTransport,
  ClientModeDebuggerStatusHolder)
- Remove doExecute/executeWithLegacyWorkaround (forRemoval); no
  subclass still overrides doExecute
- Fix AiDebuggerDebugRunner and PythonBspDebugRunner, which overrode
  the now-deleted int-port createDebugProcess overload
- PythonCommandLineState no longer guesses the spawn path by runner
  type; the entry point used by debug launches never starts a process
- PyDebugRunner is now an AsyncProgramRunner; PyDebugBackendRunner is
  a plain strategy, not a ProgramRunner
- run profile state executes off the EDT before DapProcessStarter
  gets it; only session assembly stays on the EDT (platform
  requirement, confirmed live)
- PythonConsoleView builds the command-queue panel lazily


Merge-request: IJ-MR-226405
Merged-by: Egor Eliseev <Egor.Eliseev@jetbrains.com>
```

claude:haiku:safe (3552 ms, the IDE drops PY-89567):
```
PY-89567 Migrate PyDebugRunner from Java to Kotlin and refactor debug backend execution

Remove the single-port client-mode debugger launch path and restructure
Python debug execution around backend runners. Migrate PyDebugRunner to
Kotlin, replace the ProgramRunner interface with a custom PyDebugBackendRunner
contract that is resolved per launch, and move console creation to an EDT hop
in PythonCommandLineState. Mark deprecated client-mode classes for removal.
```

claude:haiku:safe+files (29528 ms, the IDE drops PY-89567):
```
PY-89567 Convert PyDebugRunner to Kotlin and remove single-port debug

Refactor debug runner infrastructure to eliminate the unused single-port
client-mode launch path and modernize the debug backend runner interface.
Make PyDebugBackendRunner a simple bridge instead of a ProgramRunner,
rename canRun to isApplicable, and have it return a Promise-based launch.
Convert PyDebugRunner from Java to Kotlin to enable better control flow
in the refactored debug launching logic.

Also defer PythonConsoleView's command-queue panel creation to avoid
failures during console initialization, and extract EDT thread crossing
into a reusable computeOnEdt helper with proper exception handling.
```
Tools: `git diff --cached --stat`, `git diff --cached | head -200`, `git diff --cached python/src/com/jetbrains/python/debugger/PyDebugRunner.java | head -100`, `git diff --cached | grep -A 30 "PyDebugRunner.java"`, `git diff --cached | grep -A 10 "PyDebugRunner.kt" | head -50`, `git diff --cached python/testSrc/com/jetbrains/python/run/PyConsoleOnEdtHopTest.kt | head -100`, `git diff --cached python/src/com/jetbrains/python/run/PythonCommandLineState.java | head -150`, `git diff --cached python/src/com/jetbrains/python/debugger/PyDebugProcess.java`, `git diff --cached python/src/com/jetbrains/python/debugger/PyDebugBackendRunner.kt | head -100`, `git diff --cached python/src/com/jetbrains/python/debugger/PythonDebugProgramRunner.kt`, `git diff --cached python/src/com/jetbrains/python/testing/PythonTestCommandLineStateBase.java`, `git diff --cached python/testSrc/com/jetbrains/python/debugger/PyDebugRunnerTest.kt`, `git diff --cached | grep -A 30 "PyDebugRunnerTest.kt"`

claude:claude-haiku-5-5:safe:low (2638 ms):
```
Remove the single-port debugger and run configuration debug path

The single-port debugger was kept behind a feature flag, and nothing in the IDE constructs it any more. Remove the registry key and server-mode settings, and deprecate the client-mode transport classes.

Replace PyDebugRunner's ProgramRunner base with a backend interface that PythonDebugProgramRunner dispatches to, so the platform keeps one stable runner. Move console creation for launches onto the EDT through a single hop, and have test run states build their console there too.
```

claude:claude-haiku-5-5:safe:low+files (7107 ms):
```
refactor debugger: start debug backends from one Python runner

PyDebugBackendRunner is no longer a ProgramRunner. PythonDebugProgramRunner
is the only runner the platform registers and hands each launch to the
backend that applies, so the run profile is opened once per launch.
PyDebugRunner moves to Kotlin with a single execute hook. The unused
python.debug.use.single.port registry key is removed.

The command queue panel of PythonConsoleView is created on first use, and
the test state no longer blocks on invokeAndWait to create its console.
```
Tools: `git diff --cached --stat | tail -1; git diff --cached -- python/src/com/jetbrains/python/debugger/PyDebugRunner.kt pytho`, `git branch --show-current; git diff --cached -- python/src/com/jetbrains/python/console/PythonConsoleView.java python/sr`

codex:gpt-5.6-luna:lean:low (2659 ms):
```
Refactor Python debugging to use a stable async program runner
```

codex:gpt-5.6-luna:lean:low+files (7659 ms):
```
refactor python debugger runner to Kotlin and async sessions
```
Tools: `git diff --cached --stat && git diff --cached -- python/src/com/jetbrains/python/debugger/PyDebugRunner.kt python/src/co`, `git diff --cached --name-status; git diff --cached -- python/pluginResources/intellij.python.community.impl.xml python/p`

## intellij-community-32 (diff 234704 chars, truncated, git 218 ms)

Actual:
```
IJPL-250364 [editor-tabs]: Add editor tabs grouping

Add the "Editor Tab Grouping" plugin (intellij.platform.editorTabGrouping).

- The plugin groups editor tabs by directory. Air (agent) tabs get a
  group of their own.
- GroupingJBEditorTabs sorts and lays out tabs by group, and
  TabGroupPainter paints the group headers.
- EditorTabGroupingConfigurable adds controls to the settings page.
- The platform gets extension points for the plugin.


Merge-request: IJ-MR-222358
Merged-by: Dmitry Yudin <Dmitry.Yudin@jetbrains.com>
```

claude:haiku:safe (4308 ms):
```
Add editor tab grouping plugin with directory-based tab organization

Implement a new plugin that groups editor tabs by directory to organize crowded
tab rows. The plugin provides visual grouping with color-coded group labels,
supports both outline and rail label styles, and includes configuration options
in editor settings.

Key changes:
- Add `EditorTabsFactory` extension point for tab implementation customization
- Implement `GroupingJBEditorTabs` with directory-aware tab grouping logic
- Add tab group painter with outline and rail label rendering styles
- Support drag-and-drop operations within grouped tabs
- Add configuration UI and persistent settings for grouping preferences
- Include comprehensive tests for grouping behavior, layout, and performance
- Expose `onDragStateChanged` hook in `JBTabsImpl` for extension tracking
```

claude:haiku:safe+files (27225 ms):
```
Add editor tab grouping plugin for organizing tabs by directory

Introduces a new plugin that groups editor tabs by parent directory to
help organize crowded tab rows. Features include automatic directory
grouping with color-coded groups, special handling for AI agent tabs,
and configuration options. Refactors EditorTabbedContainer to support
custom tab implementations via an extension point, enabling this and
future plugins to customize tab behavior. Adds test coverage for tab
drag, drop, and reallocation functionality.
```
Tools: `git status`, `git log --oneline -15`, `git diff --cached --stat`, `Read plugins/editor-tab-grouping/plugin/resources/META-INF/plugin.xml`, `Read plugins/editor-tab-grouping/src/com/intellij/platform/editorTabGrouping/impl/EditorTabGrouping.kt`, `git diff --cached platform/platform-api/src/com/intellij/ui/tabs/impl/JBTabsImpl.kt | head -100`, `git diff --cached platform/platform-impl/src/com/intellij/openapi/fileEditor/impl/EditorTabbedContainer.kt | head -150`, `git branch -a 2>/dev/null | head -20`, `git diff --cached platform/platform-impl/src/com/intellij/openapi/fileEditor/impl/EditorTabbedContainer.kt | tail -200`, `Read plugins/editor-tab-grouping/src/com/intellij/platform/editorTabGrouping/impl/GroupingJBEditorTabs.kt`

claude:claude-haiku-5-5:safe:low (1909 ms):
```
refactor [ij-light]: rename `.base` modules to `.baseline`
```

claude:claude-haiku-5-5:safe:low+files (7705 ms):
```
Add editor tab grouping plugin and extensible editor tabs

Introduce the intellij.platform.editorTabGrouping module, which groups
editor tabs by directory. It plugs in through a new EditorTabsFactory
extension point, so EditorTabbedContainer can use a grouping-aware
JBEditorTabs without changing the default editor tabs.

Make the JBTabs drag and drop path tolerate cases it did not handle
before: reallocate() now ignores tabs that are not visible, and drop
previews can be disallowed for a given index. The left-position
scrollbar rect no longer assumes a layout pass has happened.
```
Tools: `git diff --cached --stat | tail -1; git diff --cached -- platform/platform-api/src/com/intellij/ui/tabs/impl/JBTabsImpl.`, `git branch --show-current`

codex:gpt-5.6-luna:lean:low (2600 ms):
```
[ij-light] Add editor tab grouping plugin and support infrastructure
```

codex:gpt-5.6-luna:lean:low+files (8616 ms):
```
feat [ij-platform]: add editor tab grouping by directory
```
Tools: `git diff --cached --stat && git diff --cached -- platform/platform-impl/src/com/intellij/openapi/fileEditor/impl/EditorT`, `git diff --cached -- plugins/editor-tab-grouping/plugin/resources/META-INF/plugin.xml plugins/editor-tab-grouping/src/ma`, `/bin/zsh -lc "git diff --cached --name-only | grep editorTabGrouping | tail -20; git diff --cached -- plugins/editor-tab`

## intellij-community-33 (diff 440188 chars, truncated, git 3780 ms)

Actual:
```
KTIJ-39601 [kotlin] Make K2 specific test data files as default for quick fixes
```

claude:haiku:safe (2896 ms):
```
[kotlin] Consolidate K1 and K2 test data by removing K2-specific files
```

claude:haiku:safe+files (55573 ms, the IDE drops KTIJ-39601):
```
KTIJ-39601 [kotlin] Make K2 specific test data files as default for quickfix tests
```
Tools: `git status`, `git log --oneline -10`, `git diff --cached --stat | head -100`, `git diff --cached plugins/kotlin/code-insight/fixes-k2/tests/test/org/jetbrains/kotlin/idea/k2/codeinsight/fixes/Abstrac`, `git diff --cached 'plugins/kotlin/idea/tests/testData/quickfix/changeSignature/addEnumConstructorParameter.kt.after' | h`, `git diff --cached 'plugins/kotlin/idea/tests/testData/quickfix/addExclExclCall/iterableWithBadIterator.kt' | head -50`, `git diff --cached --name-status | grep "^D" | head -20`, `git log --oneline | grep -i "k2 specific\|k2 test" | head -5`, `git show c7669b0c99270 --stat | head -50`, `git diff --cached --name-status | grep "^R" | head -10`, `git branch -a 2>&1 | head -20`, `git log --oneline -1`

claude:claude-haiku-5-5:safe:low (2091 ms):
```
[kotlin] Drop K2-specific quick fix test data files

Most of the changed files are *.k2.kt* test data that were deleted, since K2 expected output now matches the shared *.kt* files. The branch name is not provided, so no issue id is included.
```

claude:claude-haiku-5-5:safe:low+files (6713 ms):
```
[kotlin] Merge K2 quick fix test data into common test files

K2 quick fix tests kept separate .k2.kt and .k2.kt.after copies. Fold
their expectations into the shared .kt and .kt.after files, using the
K2 error code in K2_ERROR directives, and delete the duplicates. The
test base class is updated to match, so K2 runs use the common files.
```
Tools: `git branch --show-current && git diff --cached -- plugins/kotlin/idea/tests/test/org/jetbrains/kotlin/idea/k2/codeinsigh`

codex:gpt-5.6-luna:lean:low (3353 ms):
```
[kotlin] Merge K2 quick-fix test data with common test data
```

codex:gpt-5.6-luna:lean:low+files (9966 ms):
```
[kotlin] Merge K2 quick-fix test data into common files
```
Tools: `git diff --cached --stat && git diff --cached -- src/idea/tests/org/jetbrains/kotlin/idea/k2/codeinsight/fixes/AbstractH`, `/bin/zsh -lc "git diff --cached -- '**/AbstractHighLevelQuickFixTest.kt'"`, `/bin/zsh -lc "git diff --cached --unified=2 | grep -E '"'^diff --git|''^[+-].*(K2|k2|FUS|directive|'"\\.after)' | head -`, `git branch --show-current`

## intellij-community-34 (diff 473061 chars, truncated, git 888 ms)

Actual:
```
LSP-1937 [protocol] speed up wire codec: compact JSON, streaming kotlinx decode, explicit nulls

1. Compact JSON, direct frames, lazy span decode; writer writes header, envelope head and payload parts, flushes once (Json.encodeToStream rejected: 30-76% slower)
2. Envelope and payload decode with kotlinx serializers; completion unions pick object or array by internal lexer peek (kotlinx#2223), no variant rerun
3. CompletionItem.Edit and FoldingRange.kind stream without tree
4. LSP.decodeJson = LSP.json + explicitNulls; required `T | null` members (InitializeParams.processId, rootUri, TextDocumentEdit version) written as null
5. Tests pin nullable defaults, merged descriptors and relied-on kotlinx 1.11.0 behaviour
```

claude:haiku:safe (3226 ms, the IDE drops LSP-1976):
```
LSP-1976 [lsp] wire codec and protocol hardening, streaming and merged serializers
```

claude:haiku:safe+files (35813 ms):
```
[lsp] refactor message handling with wire protocol abstraction

Introduce a wire-level abstraction for JSON-RPC message encoding and
decoding, enabling optimizations like explicitNulls decode and fast-path
payload decoding. Split LspException into response and decode variants.
Support sequential notification dispatch for better handler ordering.
Add comprehensive wire protocol tests.
```
Tools: `git diff --cached --stat`, `git diff --cached fleet/lsp.protocol/src/srcCommonMain/com/jetbrains/lsp/implementation/ | head -300`, `git diff --cached | head -500`, `git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/implementation/withLsp.kt | head -200`, `git log --oneline -10`, `git log --oneline -20 -- fleet/lsp.protocol/`, `git rev-parse --abbrev-ref HEAD`, `git diff --cached --name-only | head -20`, `git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/implementation/LspWireOutgoing.kt`, `git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/implementation/NotificationDispatch.kt`, `git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/protocol/LSP.kt | head -300`, `git log --format=%B -1 af45ee4c58c9b | head -20`, `git diff --cached --name-only | grep test`, `git log --oneline af45ee4c58c9b~5..HEAD -- fleet/lsp.protocol/ | head -20`, `git diff --cached | grep -A5 "^diff --git" | head -100`, `git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/implementation/withLsp.kt | head -600 | tail -30`

claude:claude-haiku-5-5:safe:low (2236 ms, the IDE drops LSP-1937):
```
LSP-1937 [protocol] rework wire codec, decode and encode protocol types without JSON trees
```

claude:claude-haiku-5-5:safe:low+files (5241 ms):
```
Harden LSP wire codec and decode union and nullable fields

Decode frames and payloads with a streaming codec instead of building
JSON trees, and make the protocol types tolerant of what real servers
and clients send: nullable fields default to null, unknown int enum
values are accepted, nulls are coerced where the spec allows, and
union results (such as type definition as Location or LocationLink)
resolve to the right variant.

A result that does not decode now fails the request with a
LspResultDecodeException (code RequestFailed) instead of breaking the
session, and LspException is sealed into response-error and decode
variants.
```
Tools: `git diff --cached --stat | tail -1; git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/implementati`, `git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/protocol/unions.kt fleet/lsp.protocol/srcCommonM`

codex:gpt-5.6-luna:lean:low (2614 ms, the IDE drops LSP-1980):
```
LSP-1980 [protocol] add streaming wire codec and robust serializers
```

codex:gpt-5.6-luna:lean:low+files (9059 ms):
```
[protocol] add streaming wire codec and harden LSP framing
```
Tools: `git diff --cached --stat && git diff --cached -- srcCommonMain 2>/dev/null | head -300`, `/bin/zsh -lc "git diff --cached --name-only | head; git diff --cached -- '**/LspWireCodec.kt' '**/LspServer.kt' '**/prot`, `/bin/zsh -lc "git branch --show-current; git diff --cached -- fleet/lsp.protocol/srcCommonMain/com/jetbrains/lsp/protoco`

## intellij-community-35 (diff 994169 chars, truncated, git 239 ms)

Actual:
```
IJAI-955 the dev-dist generator lives in community

The dev-dist generator code was ultimate code, although only its
ultimate facts are closed. The previous commit moved those facts into
the ultimate half. So the generator can now live in community, and
each half can later generate its own declarations with one code path.
The generated output is unchanged.

The new module intellij.platform.buildScripts.devDistGenerator is at
community/platform/build-scripts/dev-dist-generator, in the package
com.intellij.platform.buildScripts.devDistGenerator. Its test module
intellij.platform.buildScripts.devDistGenerator.tests is beside it. The
production module depends on community modules only. A standalone
community build compiles both modules and runs the tests.

What moved (git mv, the package line changed):
- 30 sources: the 28 devDist*.kt files of the earlier commit,
  devDistHalf.kt and communityDevDistHalf.kt.
- 15 test files, SourceRootModuleOutputProvider among them, and the six
  webp fold fixtures.
- The orchestration of ultimateGenerator.kt goes to the new file
  devDistHalves.kt: DevDistBazelComputes, computeDevDistBazelFiles,
  computeForeignAwareSections, computeCommunityDevDistFiles,
  communityTargetsJson and communityTargetsSeenFromMonorepo.
  forkDevDistHalves starts the renders beside the pipeline, and
  DevDistHalvesRun.finish writes them or reports their diffs. The
  ultimate generateAllModuleSetsWithProducts calls both with
  UltimateDevDistHalf. The order of the forks and the awaits is the
  order of the earlier code.

What stays in ultimate: main, the product-DSL configuration, the
variant and multi-plugin rules, ultimateDevDistHalf.kt, the CWM, egg,
Jupyter, native dependency and platform patch files, and their tests.
DevDistRunConfigurationModulesTest splits: the case that reads the
community checkout of the monorepo stays, because a standalone
community checkout has no monorepo root.

Kotlin internal visibility stops at the module. So the declarations
that the ultimate module and its tests use are now public with
ApiStatus.Internal: the half interfaces and their member types, the
Starlark types, the binder and descriptor helpers, the residual-jar
helpers, the run-configuration row functions, and the new entry. The
test-only ones serve the asset binding, native and GDScript tests.

The Rider names leave the moved tests and one comment. The tests use
neutral paths and labels. A token search over the new directory finds
only "ultimate" as the name of a half and the existing community
identifiers languageServerBase and CidrDependency.

Other edits: the ultimate .iml files and intellij.idea.ultimate.build.tests
depend on the new modules. Both tool guards name the new module. The
six specs point at the new paths, and generation.spec.md lists
devDistHalves.kt. testGroups.properties adds the new package. The
product-dsl README names the new directory.

The dev-dist plan now counts 6503 files, not 6502. The section writer
visits the BUILD.bazel of every module, and the new package adds one.

Verified:
- Both converters, a committing generator run and --check: all files
  unchanged. git status shows only the source edits.
- In community/: bazel build and bazel test of the new package, 143 of
  143 passed.
- tests.cmd: 73 of 73 ultimate generator tests, 143 of 143 community
  generator tests. The total is 216, as before the move.
- DevDistSpecReferencesTest 8 of 8, the tool guards of both roots, and
  build --nobuild over //build:all //build/... @community//build/....
- The fast project structure tests and ApiCheckTest.
- format.check in both roots.
- //build:all-products-packaging_test: 85 of 85 passed.
```

claude:haiku:safe (3739 ms):
```
[build] Add dev-distribution generator module

Add a new module `intellij.platform.buildScripts.devDistGenerator` that
contains the dev-distribution generator implementation. This tool generates
build plans for plugin and product distributions, supporting both community
and ultimate repository halves.

The generator consists of core planning logic, plugin layout asset bindings,
descriptor plan management, plan file generation with platform folding,
packaging coordination, and run configuration handling. Comprehensive test
coverage validates plan generation, folding, resource management, and
descriptor handling across multiple platforms.
```

claude:haiku:safe+files (36856 ms):
```
Add dev-dist-generator module with distribution planning logic

The new intellij.platform.buildScripts.devDistGenerator module provides
the core logic for generating development distributions, handling plugin
packing, layout assets, build sections, and product descriptors. This
shared generator is used by both community and ultimate distribution
halves to plan and generate their respective distributions. Includes 31
source files and 14 comprehensive test files.
```
Tools: `git diff --cached --stat`, `Read platform/build-scripts/dev-dist-generator/src/communityDevDistHalf.kt`, `head -50 platform/build-scripts/dev-dist-generator/src/devDistPlanGenerator.kt`, `git diff --cached platform/build-scripts/product-dsl/README.md`, `Read platform/build-scripts/dev-dist-generator/BUILD.bazel`, `git log --oneline -20`, `find platform/build-scripts/dev-dist-generator/src -name "*.kt" | wc -l`, `git log --oneline | grep -i "dev-dist\|generator" | head -20`, `Read platform/build-scripts/dev-dist-generator/testSrc/DevDistPluginPlanFilesTest.kt`, `git rev-parse --abbrev-ref HEAD`, `git diff --cached --name-only | head -1 | xargs dirname`, `git diff --cached platform/build-scripts/dev-dist-generator/BUILD.bazel | head -60`, `head -100 platform/build-scripts/dev-dist-generator/src/devDistHalves.kt | tail -50`, `git diff --cached --stat | grep -E "^(platform/build-scripts/dev-dist-generator|platform/build-scripts/product-dsl/READM`, `git diff --cached --name-status | grep dev-dist-generator | wc -l`
Denied: `git diff --cached --name-only | head -1 | xargs dirname`

claude:claude-haiku-5-5:safe:low (2267 ms):
```
dev-dist-generator: add the dev-distribution generator module

The module generates the dev-distribution plans, run configurations and
Bazel sections for the community and ultimate halves, so both passes
share one implementation. The product DSL README points to it.
```

claude:claude-haiku-5-5:safe:low+files (5738 ms):
```
[build] Add dev-distribution generator for dev run configurations

The dev distributions and their run configurations were maintained by
hand. The new generator builds them from the product registry, the run
configurations and the JPS model. One pass runs for the ultimate
repository and one for community, and both use the same planning code.
```
Tools: `git diff --cached --stat | tail -1; git diff --cached -- platform/build-scripts/dev-dist-generator/src/devDistGeneration`

codex:gpt-5.6-luna:lean:low (2976 ms):
```
[build] Add the dev-distribution generator
```

codex:gpt-5.6-luna:lean:low+files (7299 ms):
```
[build] Add a generator for split development distributions
```
Tools: `git diff --cached --stat && git diff --cached -- build/dev-dist-tool-guards/BUILD.bazel platform/build-scripts/product-d`, `/bin/zsh -lc "git diff --cached -- platform/build-scripts/dev-dist-generator/BUILD.bazel platform/build-scripts/dev-dist`
