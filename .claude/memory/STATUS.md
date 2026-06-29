# STATUS — 當前進度

_每次 /wrap-up 全部重寫。最後更新：2026-06-29_

## 目前分支
`develop`

## 上次完成
- merge refactor-common-components、feature-shrines、feature-shrine-description 進 develop
- 重組 shrine 相關元件（SearchView → ShrineView）
- Footer SVG 替換、a11y 修正
- 設計系統 token 導入 main.css

## 進行中
- **Collections 功能**（未 commit）
  - 後端：`CollectionsController.cs`、`CollectionService.cs`、`ICollectionService.cs`、`CollectionDto.cs`、`CollectionRequest.cs`、`Collection.cs` model、EF Migration
  - 前端：大量 unstaged changes（menubar、setting、auth、common components）

## 等待使用者行動
- 確認 Collections 功能是否準備好 commit
- 釐清前端 unstaged changes 目的（是 Collections 相關還是另一個 refactor）

## 下一步（Claude 可直接執行）
- 待確認後：建 `feature-collections` 分支並 commit
