# PRINCIPLES — 不用再問第二次的預設值

## 技術棧
- Frontend: Vue 3 + TypeScript + Vite，`@` alias → `frontend/src/`
- Backend: ASP.NET Core .NET 10，controller → service → repository
- Auth: JWT，access token 在 **httpOnly cookie `access_token`**（不是 Authorization header）

## 前端規則
- PrimeVue 元件**自動 import**，.vue 檔不需要寫 import
- SVG 用 `vite-svg-loader` 當 Vue 元件 import
- API 呼叫**禁止**手寫 try/catch/finally，一律用 `useAsyncState` / `useAsyncAction` / `useAsyncPaginatedState`
- Dark mode：在 `<html>` 加/移除 `.app-dark` class
- 分頁狀態從 `X-Pagination` response header 讀，`useAsyncPaginatedState` 自動解析，不要手刻

## 後端規則
- 例外一律在 service 層 throw custom exception，不在 controller
- `AzureBlobStorageService` 目前是 **stub**，回傳 placeholder URL，尚未連接真實 Azure
- Email reset password template 硬寫中文，未多語系化（blob storage 正式前不動）
- Shrine 地理搜尋動態半徑：50km → 100km → 200km，直到找到 ≥5 筆

## Git 規範
- Conventional commits：`feat(scope): desc`、`fix(scope): desc`、`refactor(scope): desc`、`doc(scope): desc`
- 分支從 `develop` 開（`feature-*`、`fix-*`）
- PR 目標：`develop`；`develop` merge 到 `main`
- Commit 前跑 `npm run type-check`
