# /wrap-up — Session 收尾 SOP

## Stage 1: Gather（同步收集）
```bash
# 讀所有 memory 檔
cat .claude/memory/STATUS.md
cat .claude/memory/BACKLOG.md
cat .claude/memory/PRINCIPLES.md
cat .claude/memory/PLAYBOOKS.md
cat .claude/memory/INCIDENTS.md
cat .claude/memory/REFLECTIONS.md

# Git 狀態
git log --oneline -10
git status --short
```

## Stage 2: Analyze（分類本次 session 事件）
| 事件類型 | 寫入位置 |
|----------|----------|
| 完成功能 / 進度更新 | STATUS |
| 新任務 / 任務完成 | BACKLOG |
| 新決策 / 規則 | PRINCIPLES |
| 重複流程（≥2次）| PLAYBOOKS |
| Bug / 踩坑 | INCIDENTS（append only） |
| Session 回顧 | REFLECTIONS（append only） |

## Stage 3: Draft（輸出摘要表）
每檔一句摘要，**不輸出完整 markdown 或 diff**：
```
STATUS    → 重寫：完成 X，進行中 Y
BACKLOG   → 新增 B-0X：Z
INCIDENTS → append：YYYY-MM-DD 問題標題
```

## Stage 4: Confirm（詢問使用者）
「以上變更全採用？還是要跳過某個檔？」
只在使用者要求時展開細節。

## Stage 5: Atomic Commit（每檔獨立 commit）
```bash
# 格式：memory: <動詞> <檔名> (<一行摘要>)
git add .claude/memory/PRINCIPLES.md
git commit -m "memory: update PRINCIPLES (新增 X 規則)"

git add .claude/memory/INCIDENTS.md
git commit -m "memory: append INCIDENTS (YYYY-MM-DD 問題)"

# STATUS 最後 commit
git add .claude/memory/STATUS.md
git commit -m "memory: rewrite STATUS (完成 X，下一步 Y)"
```

## 關鍵規則
- INCIDENTS / REFLECTIONS **只 append，絕不改舊條目**
- 編輯前必須先讀取目標檔（確保 old_string 準確）
- STATUS **每次全部重寫**，不是 patch
- commit 完**不自動 push**
- 本次 session 若無新事件，詢問使用者是否強制留一條 REFLECTIONS
