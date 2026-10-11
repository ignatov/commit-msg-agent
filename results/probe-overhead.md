# probe-overhead

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | cost $ |
|---|---|---|---|---|---|---|---|---|
| claude:haiku:naive | 3/3 | 3214 | 3681 | 19949 | 5915 | 48 | 41 | 0.0289 |
| claude:haiku:lean | 3/3 | 1892 | 1918 | 331 | 0 | 4 | 0 | 0.0004 |
| claude:haiku:safe | 3/3 | 1848 | 1957 | 332 | 0 | 4 | 0 | 0.0004 |
| codex:gpt-5.6-luna:naive | 3/3 | 2675 | 3304 | 9627 | 0 | 5 | 0 | - |
| codex:gpt-5.6-luna:lean:low | 3/3 | 2548 | 2549 | 2507 | 0 | 5 | 0 | - |
