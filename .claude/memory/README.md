# .claude/memory — 記憶系統索引

每次 session 開始讀：STATUS + BACKLOG + PRINCIPLES（透過 load-session.sh 自動注入）
其他檔案遇到相關問題時再查。

| 檔案 | 性質 | 用途 |
|------|------|------|
| STATUS.md | 每次重寫 | 現在在哪、進行中什麼 |
| BACKLOG.md | 更新 | 優先度排序任務 |
| PRINCIPLES.md | 更新 | 不用再說第二次的規則 |
| PLAYBOOKS.md | 更新 | 重複流程 SOP（≥2次才記） |
| GLOSSARY.md | 更新 | 術語、API 限制、外部服務 |
| INCIDENTS.md | **只 append** | 踩坑紀錄 + root cause |
| REFLECTIONS.md | **只 append** | Session 回顧 |

## Session SOP
- 開始：`load-session.sh` 自動注入 STATUS + BACKLOG + PRINCIPLES
- 結束：執行 `/wrap-up`
