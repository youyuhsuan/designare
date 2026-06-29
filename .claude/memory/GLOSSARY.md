# GLOSSARY — 術語與外部參考

## 專案術語
| 術語 | 說明 |
|------|------|
| 御朱印 (Goshuin) | 日本神社/寺廟的朱印，本專案主要收藏物 |
| goshuincho | 御朱印帳，收集御朱印的冊子，也是本專案名稱 |
| Shrine | 神社資料模型，包含名稱、位置、地圖座標 |
| Collection | 使用者收藏的御朱印紀錄（B-01 功能） |

## API 速率 / 限制
| 項目 | 限制 |
|------|------|
| Shrine 搜尋分頁 | `X-Pagination` header，`useAsyncPaginatedState` 自動解析 |
| 使用者圖片上傳 | max 5MB，JPEG/PNG/WebP only |

## 外部服務
| 服務 | 用途 | 狀態 |
|------|------|------|
| Azure Blob Storage | 使用者圖片儲存 | Stubbed |
| Resend | Email 寄送（密碼重設）| 設定中 |
| Google OAuth | 第三方登入 | 可用 |
