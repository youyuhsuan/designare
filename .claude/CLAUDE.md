# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Designare is a full-stack web app with a **Vue 3 frontend** (project root) and an **ASP.NET Core (.NET 10) backend** (`/backend`).

## Commands

All frontend commands run from the project root:

```sh
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Type-check + build for production
npm run type-check   # Run vue-tsc only
npm run lint         # Run oxlint then eslint (both with --fix)
npm run test:unit    # Run Vitest unit tests
npm run test:e2e     # Run Playwright e2e tests (build first on CI)
```

Run a single unit test file:

```sh
npm run test:unit -- src/components/__tests__/HelloWorld.spec.ts
```

Backend (from `/backend`):

```sh
dotnet run           # Starts API on http://localhost:5286
```

Swagger UI available at `http://localhost:5286/swagger` in development.

## Architecture

### Frontend (`frontend/src/`)

**`@` alias** resolves to `frontend/src/` (configured in `vite.config.ts`).

**PrimeVue components are auto-imported** via `unplugin-vue-components` — no explicit imports needed in `.vue` files. SVGs imported as Vue components via `vite-svg-loader`.

**Layer structure:**

- `views/` — route-level page components
- `components/` — reusable UI components (subdirectories group by feature)
- `composables/api/` — one composable per API resource (`useApiAuth`, `useApiUser`, `useApiShrines`, etc.)
- `stores/` — two Pinia stores: `auth.store.ts` and `setting.store.ts`
- `config/` — `apiConfig.ts` (endpoints + base URL), `routeConfig.ts` (route paths), `locales/` (i18n JSON)
- `types/` — TypeScript interfaces per domain
- `utils/` — pure utility functions
- `directives/` — custom Vue directives

**Async composables** — three variants, pick by use case:

| Composable                             | Returns                                                                | Use when                         |
| -------------------------------------- | ---------------------------------------------------------------------- | -------------------------------- |
| `useAsyncState<T>(fn, opts?)`          | `{ data, isLoading, error, execute }`                                  | need the response value          |
| `useAsyncAction<A>(fn, opts?)`         | `{ isLoading, execute }`                                               | fire-and-forget (submit, delete) |
| `useAsyncPaginatedState<T>(fn, opts?)` | `{ data, isLoading, isLoadingMore, pagination, execute, executeMore }` | paginated list                   |

All share the same options interface: `{ showErrorToast?, successMessage?, onError? }`. Never write manual try/catch/finally around API calls.

**API layer** (`composables/api/useApi.ts`):

- `instance` — unauthenticated Axios instance (public routes)
- `authInstance` — authenticated instance that attaches the Bearer token, handles 401s by silently refreshing the access token, and queues concurrent failed requests

**Pinia stores with persistence:**

- `auth.store` — persists `accessToken` + `refreshToken` to `localStorage["auth"]`. Handles login, logout, token refresh (idle timer fires after 15 min inactivity), Google OAuth flow, and app initialization from persisted tokens.
- `setting.store` — persists `userTheme` to `localStorage["theme"]` and `currentLanguage` to `localStorage["locale"]`. Unauthenticated users follow the OS `prefers-color-scheme`.

**Dark mode** is toggled by adding/removing the `.app-dark` class on `<html>`. The PrimeVue theme is configured with `darkModeSelector: ".app-dark"`.

**Custom directives** — both registered globally:

- `v-cursor-hover` — scales cursor on hover via `settingStore.cursor.size`. Optional binding value sets hover size.
- `v-cursor-stamp` — switches cursor to stamp mode on hover; increments `settingStore.cursor.clickId` on click. Use on stamp UI elements only, not regular buttons.

`settingStore.cursor` shape: `{ type: "dot" | "stamp", size?: number, color?: string, clickId: number }`

**i18n** — `vue-i18n` v11, `legacy: false`. Locale files at `config/locales/en.json` and `config/locales/zh.json`. Initial locale is restored from `localStorage["locale"]`.

**Route metadata conventions:**

- `meta: { requiresAuth: true }` — redirects unauthenticated users to `/auth`
- `meta: { fullscreen: true }` — signals to `App.vue` that the nav/layout should be hidden

**Utility functions** (`utils/`) — use these, don't re-implement:

- `debounce(fn, delay=500)` — generic debounce
- `compressImage(file, maxSize=400)` — resizes to 400px max, JPEG quality 0.8
- `filterNullish(obj)` — strips null/undefined keys from object before sending to API
- `formatAddress(shrine)` — formats as `"region · prefecture · city"`
- `generateFieldIds(keys)` — UUID-based unique IDs for form fields
- `handleError(error)` from `utils/errorHandler.ts` — use only when you need the error string outside a composable; composables handle it automatically

**Environment variables** (frontend) — copy `.env.sample` to `.env`:

```
VITE_OAUTH_CLIENT_ID       Google OAuth client ID
VITE_OAUTH_CLIENT_SECRET   Google OAuth secret
VITE_OAUTH_REDIRECT_URI    http://localhost:5173/
VITE_OAUTH_TOKEN_URI       https://oauth2.googleapis.com/token
```

### Backend (`backend/`)

ASP.NET Core Web API (.NET 10) following a controller → service → repository pattern.

**Auth:** JWT Bearer tokens signed with **RSA keys** (`private_key.pem` / `public_key.pem`). The access token is read from the `access_token` **httpOnly cookie** (not the Authorization header) — configured in `JwtBearerEvents.OnMessageReceived` in `Program.cs`.

**Services registered for DI:**
| Interface | Implementation |
|---|---|
| `IUserService` | `UserService` |
| `IJwtTokenGenerator` | `JwtTokenGenerator` |
| `ITokenBlacklistService` | `TokenBlacklistService` |
| `ITokenRepository` | `TokenRepository` |
| `IOAuthService` | `OAuthService` (singleton) |
| `ICookieService` | `CookieService` |
| `IStorageService` | `AzureBlobStorageService` |
| `IShrineService` | `ShrineService` |

**Database:** SQL Server via Entity Framework Core. Connection string in `appsettings.Development.json` (not committed). On startup in development, `context.Database.EnsureCreated()` is called.

**Logging:** Serilog writes to console + rolling daily log files in `backend/Logs/`. Error-only sink retains 30 days.

**CORS** allows origins: `localhost:5173`, `localhost:3000`, `localhost:8080`, `localhost:5286` with credentials.

**API endpoints:**

| Method | Route                       | Auth | Notes                                                        |
| ------ | --------------------------- | ---- | ------------------------------------------------------------ |
| POST   | `/api/auth/register`        | No   |                                                              |
| POST   | `/api/auth/login`           | No   | `rememberMe` → 7d or 30d refresh token                       |
| POST   | `/api/auth/logout`          | Yes  | blacklists access token                                      |
| GET    | `/api/auth/me`              | Yes  |                                                              |
| POST   | `/api/auth/refresh`         | No   | token rotation — old token revoked                           |
| POST   | `/api/auth/forgot-password` | No   | **always returns 200** (prevents email enumeration)          |
| POST   | `/api/auth/reset-password`  | No   | token expires 15 min                                         |
| GET    | `/api/users/{id}`           | Yes  |                                                              |
| PATCH  | `/api/users/{id}`           | Yes  | partial update, all fields optional                          |
| DELETE | `/api/users/{id}`           | Yes  |                                                              |
| POST   | `/api/users/{id}/picture`   | Yes  | max 5MB; JPEG, PNG, WebP only                                |
| GET    | `/api/shrines/suggestions`  | No   | `?keyword=&locale=` → 6 results                              |
| GET    | `/api/shrines/featured`     | No   | `?locale=` → 3 random                                        |
| POST   | `/api/shrines`              | No   | paginated search; metadata in `X-Pagination` response header |
| POST   | `/api/oauth/authorizations` | No   | returns Google OAuth authorization URL                       |
| POST   | `/api/oauth/tokens`         | No   | exchanges auth code → JWT tokens                             |

**Pagination:** `POST /api/shrines` returns pagination state in the `X-Pagination` response header as JSON (`totalPages`, `currentPage`, `hasNextPage`, `hasPreviousPage`). `useAsyncPaginatedState` parses this automatically — never implement manual pagination.

**Backend error conventions:** throw custom exceptions in services (not controllers); `GlobalErrorHandlingMiddleware` maps them:

- `ValidationException` → 400 with `{ fieldName: ["msg"] }` body
- `NotFoundException` → 404
- `ForbiddenException` → 403
- `ConflictException` → 409
- `UnprocessableContent` → 422

**Backend secrets** (via `dotnet user-secrets`, not committed): `Jwt:Issuer`, `Jwt:Audience`, `Jwt:PublicKey`, `Jwt:PrivateKey`, `Google:ClientId`, `Google:ClientSecret`, `Google:RedirectUri`, `Resend:ApiKey`.

**Known constraints:**

- `User.FavoriteGoods` is stored as a **JSON string** in SQL Server — serialize/deserialize in the service layer
- `AzureBlobStorageService` is currently **stubbed** and returns a placeholder URL
- Shrine geo-search uses a dynamic radius: 50 km → 100 km → 200 km until at least 5 results are found
- Email password-reset template is hardcoded in Chinese — do not localize until blob storage is functional

**Git conventions:** Conventional commits — `feat(scope): desc`, `fix(scope): desc`, `refactor(scope): desc`, `doc(scope): desc`. Branch off `develop` (`feature-*`, `fix-*`); PRs target `develop`; `develop` merges to `main`.

## Notion Task Templates | 任務追蹤模板

核心原則：每張票必須有 `Done when`（definition of done）。沒有 Done when = 不知道什麼時候算完。

### Feature

```
【Feature】標題

What: 一句話說清楚做什麼
Priority: P1 / P2 / P3
Due Date:
Done when: 怎麼知道做完了（e.g. 用戶能搜尋神社並看到結果）

Notes:

Attachments:
```

### Bug

```
【Bug】標題

What: 一句話描述問題
Priority: P1 / P2 / P3
Severity: S1 / S2 / S3
Due Date:
Done when: 怎麼知道修好了（e.g. 登入不再跳 401、無 console error）

Steps to Reproduce:
1.
2.

Expected:
Actual:

Attachments:
```

### Refactor

```
【Refactor】標題

What: 一句話說清楚改什麼（+ code snippet 選填）
Priority: P1 / P2 / P3
Due Date:
Done when: 怎麼知道重構完了（e.g. 所有測試通過、API 行為不變）

Impact Scope:
- 改動檔案：

Notes:

Attachments:
```

### Optimize

```
【Optimize】標題

What: 性能問題一句話（+ code snippet 選填）
Priority: P1 / P2 / P3
Due Date:
Done when: 可量化目標（e.g. 首頁 LCP < 2s、bundle size < 500kb）

Impact Scope:
- 改動檔案：

Notes:

Attachments:
```

### Portfolio

**用途：** 履歷素材。feature 做完、PR merge 後才寫，不是開發中寫。

**觸發條件：**

- Feature 完成 ✅
- 解決有趣技術問題 ✅
- 做了架構決策（選 A 不選 B）✅
- 花超過半天 ✅
- 普通 bug fix / 改 CSS / 改 config ❌

```
【Portfolio】功能名稱

Problem: 遇到什麼問題/需求
What I built: 做了什麼（技術面，包含關鍵決策）
Result: 結果/影響（可量化更好）

English one-liner: "I built X to solve Y, resulting in Z."
```

**怎麼用：** Notion 開獨立 Portfolio database，跟 task tracking 分開。之後寫履歷直接從這裡撈，不用憑記憶。
