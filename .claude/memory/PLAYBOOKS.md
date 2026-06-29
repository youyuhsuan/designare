# PLAYBOOKS — 重複流程 SOP

_同一流程執行 ≥2 次後才記錄。_

## PB-01：新功能分支流程

```bash
# 1. 確認在 develop
git checkout develop && git pull origin develop

# 2. 開分支
git checkout -b feature-<name>

# 3. 開發完畢，type check
npm run type-check

# 4. Commit（conventional commits）
git commit -m "feat(<scope>): <desc>"

# 5. PR 目標 develop
```

## PB-02：/wrap-up 收尾流程

1. 讀所有 `.claude/memory/` 檔案
2. 看 `git log --oneline -10` + `git status`
3. 分類事件到各記憶檔
4. 列出 draft 摘要表（每檔一句）
5. 詢問使用者確認
6. 每檔獨立 commit：`memory: <動詞> <檔名> (<一行摘要>)`
7. 不自動 push
