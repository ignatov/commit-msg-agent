# probe-pi

| config | ok | median ms | max ms | input tokens | cached | output | reasoning | tool calls | cost $ |
|---|---|---|---|---|---|---|---|---|---|
| pi:anthropic/claude-haiku-4-5:naive | 3/3 | 1504 | 1508 | 1561 | 0 | 51 | 44 | - | 0.0018 |
| pi:anthropic/claude-haiku-4-5:lean:off | 3/3 | 1139 | 1177 | 70 | 0 | 4 | 0 | - | 0.0001 |
| pi:openai/gpt-5.6-luna:naive | 3/3 | 1529 | 1567 | 753 | 0 | 5 | 0 | - | 0.0002 |
| pi:openai/gpt-5.6-luna:lean:low | 3/3 | 1446 | 1550 | 66 | 0 | 5 | 0 | - | 0.0000 |
| claude:claude-haiku-4-5:safe | 3/3 | 1430 | 1473 | 327 | 0 | 4 | 0 | - | 0.0003 |
| codex:gpt-5.6-luna:lean:low | 3/3 | 2466 | 2571 | 2507 | 0 | 5 | 0 | - | - |
