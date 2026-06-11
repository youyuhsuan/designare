# Designare (御朱印帳 · Goshuincho)

> A full-stack Japanese shrine discovery web application — browse, search, and collect shrines, with production-grade authentication including Google OAuth.

![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)
![PrimeVue](https://img.shields.io/badge/PrimeVue-41B883?style=for-the-badge&logo=prime&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Live Demo:** _[deployment in progress]_  
**API Docs:** `http://localhost:5286/swagger` (local dev)

---

## What Problem Does It Solve?

Japan has over 80,000 registered shrines. Travelers and spiritual tourists — Japanese and international alike — have no single, multilingual tool to discover nearby shrines, understand their deities and blessings, or track personal visits. *Goshuincho* (御朱印帳) is the traditional stamp-collection book pilgrims carry; Designare is its digital companion.

**Core value hypothesis:** "Can a user find a shrine that matters to them, in the language they think in?"

Every architecture decision traces back to this question.

---

## Architecture Overview

```
Browser (Vue 3 SPA)
│
│  Axios authInstance (Bearer JWT)
│  Axios instance    (public calls)
│
▼
ASP.NET Core 10 Web API
│
│  Controllers → Services → Repositories
│         ↕
│  Entity Framework Core
│         ↕
│  SQL Server (Shrines, ShrineTranslations, ShrineImages,
│              Users, RefreshTokens, TokenBlacklists,
│              PasswordResetTokens)
│
│  Azure Blob Storage (profile pictures)
│  Resend             (transactional email)
│  Google OAuth 2.0   (social login)
```

**Frontend layers:**

```
Views (route pages)
  └── Composables (useAsyncState / useAsyncAction / useAsyncPaginatedState)
        └── API composables (useApiShrines / useApiAuth / useApiUser / useApiOAuth)
              └── Axios instances (useApi.ts — public vs. authenticated)
Pinia stores (auth.store / setting.store / loading.store)
Router (beforeEach guards for auth protection + initialize())
```

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI Framework | Vue 3 Composition API + TypeScript | Strong typing; Composition API scales better than Options API for composable reuse |
| State | Pinia | Vue-native, TypeScript-first, devtools support, `pinia-plugin-persistedstate` for token persistence |
| Component Library | PrimeVue 4 + TailwindCSS 4 | PrimeVue provides accessible components (AutoComplete, FileUpload, DatePicker, Form); Tailwind handles custom layout |
| API Client | Axios | Interceptors for token injection + refresh logic; two-instance pattern separates public/authenticated calls cleanly |
| Validation | Zod + `@primevue/forms` resolver | Schema-driven validation shared between form UI and type inference |
| i18n | vue-i18n 11 | Runtime locale switching; locale also sent as `Accept-Language` header so API returns the right translation |
| Backend | ASP.NET Core 10 (.NET 10) | Familiar C# type system; EF Core for migrations; excellent JWT middleware; structured DI |
| Auth | JWT RS256 (15 min) + Refresh Token Rotation | Asymmetric signing: private key signs, public key validates — private key never leaves the server |
| Token Blacklist | SQL Server `TokenBlacklists` table | Fast JTI lookup on logout; `ExpiresAt` index enables background pruning |
| Email | Resend | Developer-friendly API; anti-enumeration: forgot-password always returns 200 |
| Storage | Azure Blob Storage SDK | Profile pictures stored by `userId/guid_filename` path pattern |
| Logging | Serilog (Console + File sinks) | Structured JSON logging; separate error log file by date |

---

## Project Status Snapshot

| Feature | Frontend | Backend | Notes |
|---|---|---|---|
| Shrine list (featured) | ✅ | ✅ | Homepage random 3; locale-aware |
| Shrine search (paginated) | ✅ | ✅ | POST body; `X-Pagination` header; IntersectionObserver infinite scroll |
| Shrine autocomplete | ✅ | ✅ | Debounced; server-side prefix sort |
| Shrine detail view | ✅ | ✅ | Full translation fallback chain: requested → en → first |
| Geolocation search | ✅ | ✅ | Dynamic radius 50→100→200 km; Haversine distance sort |
| Email/password auth | ✅ | ✅ | BCrypt hashing; JWT RS256; refresh rotation |
| Google OAuth | ✅ | ✅ | CSRF `state` UUID; PKCE-style flow via backend |
| Password reset | ✅ | ✅ | URL-safe Base64 token; SHA-256 hash stored; 15 min expiry |
| User profile CRUD | ✅ | ✅ | PATCH with diff (only changed fields sent) |
| Profile picture upload | ✅ (UI) | ⚠️ stubbed | Azure Blob stub returns placeholder URL |
| Dark mode | ✅ | — | System-aware + user override; persisted via Pinia |
| i18n EN/ZH | ✅ | ✅ | Frontend locales + `ShrineTranslation` table |
| Custom cursor | ✅ | — | `v-cursor-hover` directive; `v-cursor-stamp` SVG interaction |
| Fortune stick mini-game | ✅ | — | Omikuji animation with gravity-fall CSS phase machine |
| Visit tracking | ⚠️ UI shell | ❌ missing | `saveRecord` has `TODO` placeholder; no backend endpoint |
| Wishlist | ⚠️ UI shell | ❌ missing | Local toggle state only; no persistence |
| User collections | ❌ | ❌ | Commented out in `Shrine.cs` |
| Image gallery (multi-photo) | — | ❌ | `ShrineImage` model exists; no upload endpoint |
| Admin panel | ❌ | ❌ | Not started |

---

## Vertical Slice Breakdown

Each slice cuts from browser interaction down to the database row — the opposite of "finish all models first, then all controllers." Slicing vertically means each slice ships user-observable value.

**Ordering: riskiest assumption first**

> Ask: "What assumption, if wrong, makes everything else useless?"  
> That's Slice 1.

---

### Slice 1: Shrine Discovery Core ✅

**Hypothesis:** "Users can find shrines they care about."  
If this is broken, nothing else matters.

**User story:** I open the home page, see featured shrines instantly, and can search by name or location — in my language.

| Layer | File | What happens |
|---|---|---|
| View | `HomeView.vue` | `useAsyncState` wraps `getFeaturedShrines()`; skeleton shown during `isLoading` |
| View | `SearchView.vue` | `useAsyncPaginatedState` drives infinite scroll via `IntersectionObserver`; `loadMore()` appends pages |
| Component | `SearchBar.vue` | Dual-input (name + location); debounced `getShrineSuggestions()`; `navigator.geolocation` for coordinates |
| Component | `ShrineDetailView.vue` | Renders translation fields, opening hours, deities, benefits with loading skeletons |
| API composable | `useApiShrines.ts` | GET `/api/shrines/featured`; POST `/api/shrines`; GET `/api/shrines/:id`; GET `/api/shrines/suggestions?keyword=` |
| HTTP layer | `useApi.ts` | Public `instance`; `Accept-Language` injected from `setting.store` |
| Controller | `ShrinesController.cs` | `GetLocale()` parses `Accept-Language` header; falls back to `"en"` |
| Service | `ShrineService.cs` | Random 3 via `OrderBy(Guid.NewGuid())` for featured; Haversine geo-sort with 50→100→200 km expansion; translation fallback chain |
| Database | `Shrines`, `ShrineTranslations` | Separate translation table with `(ShrineId, Locale)` index; benefits/enshrineDeity stored as JSON strings |
| Pagination | `ShrinesController.cs` + `useAsyncPaginatedState.ts` | `X-Pagination` response header parsed automatically |

**Interview talking points:**

- **Why POST for search, not GET?** URL length limits (~2000 chars). Search body includes geo-coordinates, pagination, and keyword — too large for a query string in edge cases. Using POST with a JSON body also gives a cleaner DTO. Trade-off acknowledged: POST is not cacheable by default, which matters at scale.

- **Why dynamic radius?** Japan's shrine density is uneven — Tokyo has dozens within 5 km, rural Tohoku might have one within 100 km. Fixed radius would either flood urban users or return zero results in rural areas. The 50→100→200 km expansion stops at the first tier with ≥5 results. The minimum-5 threshold is a product decision that could be made configurable.

- **Why two-step geo-sort?** SQL Server doesn't natively support spherical distance queries efficiently. The service fetches candidates via a bounding-box SQL `WHERE BETWEEN` (cheap, uses indexes), then sorts in memory using the Haversine formula. At 80,000+ shrines you would add a `geography` column and a spatial index.

- **Translation fallback chain** in `GetShrineByIdAsync`: requested locale → `"en"` → any available translation. Prevents a null detail page if a translation doesn't exist yet. Real i18n production pattern.

---

### Slice 2: Authentication + Silent Refresh ✅ (bugs found and fixed — see deep dive)

**Hypothesis:** "Users can safely stay logged in across sessions without phantom logouts."

**User story:** A user logs in Monday, returns Thursday on the same device — session continues seamlessly.

| Layer | File | What happens |
|---|---|---|
| View | `AuthLoginView.vue`, `AuthRegisterView.vue` | `@primevue/forms` + Zod resolver; `useAsyncAction` wraps `authStore.login()` |
| Store | `auth.store.ts` | `login()` → `setAuthState()` → `getUser()` → `resetTimer()`; tokens persisted to `localStorage` |
| Router guard | `router/index.ts` | `beforeEach`: tokens exist but `isAuthenticated=false` → `authStore.initialize()` |
| App lifecycle | `App.vue` | `mousemove/click/keydown/scroll/touchstart` → `debouncedResetTimer`; `visibilitychange` pauses/resumes timer |
| HTTP layer | `useApi.ts` | `authInstance` intercepts 401 → queues concurrent requests → `refreshAccessToken()` → replays original |
| API composable | `useApiAuth.ts` | POST `/api/auth/refresh` with `{ refreshToken }` using public `instance` (no stale Bearer header) |
| Controller | `AuthController.cs` | SHA-256 hash lookup → validates in DB → issues new access token → rotates refresh token |
| Blacklist | `TokenBlacklistService.cs` | On logout: stores JTI + expiry; checked on every `GET /api/auth/me` |
| OAuth | `OAuthController.cs` | Google code exchange → `GetOrCreateByGoogleIdAsync` → JWT + refresh token |
| CSRF | `router/index.ts` (OAuth callback) | `crypto.randomUUID()` state stored in `sessionStorage`; validated before `processGoogleCallback()` |

**Interview talking points:**

- **Why RS256 (asymmetric)?** With HS256 the same secret both signs and verifies. Any service that needs to verify tokens must also have the secret — meaning it can forge tokens. RS256 lets you share the public key freely while keeping the private key isolated to the auth service.

- **Why hash refresh tokens?** Refresh tokens are long-lived credentials. If the database is compromised, raw tokens would let an attacker immediately take over all sessions. SHA-256 hashes mean leaked DB rows are useless without the original raw token.

- **"Remember me" changes the refresh token expiry** — 30 days vs. 7 days — but the access token is always 15 minutes. The short-lived token makes the actual API requests; the refresh token's life controls session persistence.

- **Token rotation prevents replay attacks.** Every refresh call revokes the old refresh token and issues a new one. If an attacker steals a refresh token, they get one use. On the next legitimate use, the server finds the token already revoked.

- **The 15-minute idle timer** is driven by UI activity events, not a wall clock. A user watching a video doesn't get logged out; a genuinely idle tab does. The `visibilitychange` handler pauses the timer on tab switch.

---

### Slice 3: User Identity ✅

**Hypothesis:** "Personalization adds enough value that users will return."

**User story:** A user uploads a profile photo, edits their bio and location, and can delete their account.

| Layer | File | What happens |
|---|---|---|
| Component | `PersonalContainer.vue` | View/edit toggle; diff-only PATCH; `compressImage()` before upload |
| Utility | `compressImage.ts` | Canvas resize to max 400px; JPEG quality 0.8; `URL.revokeObjectURL()` to prevent memory leak |
| Component | `AppearanceContainer.vue` | Theme toggle (light/dark/system); language picker |
| Store | `setting.store.ts` | `activeTheme`: authenticated → `userTheme`, anonymous → OS `prefers-color-scheme` |
| API composable | `useApiUser.ts` | `getUser`, `updateUser` (PATCH), `uploadUserImage` (POST multipart), `deleteUser` |
| Controller | `UsersController.cs` | Validates file ≤5 MB, type JPEG/PNG/WebP |
| Service | `AzureBlobStorageService.cs` | **Stubbed** — returns placeholder URL; Azure SDK scaffolded but not wired |

**Interview talking points:**

- **Diff-only PATCH:** The form compares `e.values` against `initialValues` field by field. Only changed fields go into the request body. The backend applies partial update semantics: `if (request.Name != null) user.Name = request.Name`. Prevents accidental overwrites of fields the user didn't touch.

- **Image compression before upload:** The frontend uses a `<canvas>` to resize the image to max 400×400 px at 0.8 JPEG quality. This reduces upload size from potentially several MB to ~50–100 KB. The `ObjectURL` is released via `URL.revokeObjectURL()` after the image loads to prevent memory leaks.

- **Dark mode design decision:** Anonymous users always follow system preference (can't be remembered without an account). Authenticated users get their own `userTheme` preference stored in localStorage. The `activeTheme` computed property implements this branch cleanly.

---

### Slice 4: Shrine Engagement — Visit Tracking ⚠️ (UI shell, backend missing)

**Hypothesis:** "Users want to track which shrines they've visited — the retention behavior that makes this a collection app, not a search engine."

**User story:** On a shrine detail page, an authenticated user clicks "Visited", optionally adds a date and note, and saves the record permanently.

**Current state:** `ShrineDetailView.vue` has toggle buttons, `isVisited`/`isWishlisted` local refs, and a `saveRecord` action with a 500ms fake delay + success toast. Looks functional but persists nothing.

```typescript
// Current stub in ShrineDetailView.vue
const saveRecord = useAsyncAction(
  async () => {
    // TODO: wire to POST /api/users/:id/collections when backend is ready
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
  },
  { successMessage: t("shrines.detail.saveSuccess") },
);
```

**What needs to be built to complete this slice:**

Backend — new `UserCollection` model:
```csharp
public class UserCollection
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ShrineId { get; set; }
    public bool IsVisited { get; set; }
    public bool IsWishlisted { get; set; }
    public DateTime? VisitDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; } = null!;
    public Shrine Shrine { get; set; } = null!;
}
```

New endpoint: `POST /api/users/{userId}/collections`  
Frontend: Replace the stub in `saveRecord` with `useApiUser().saveCollection(userId, payload)`

**Interview talking points:**

- **Why this is the highest-retention feature:** Discovery (Slice 1) brings users once. Authentication (Slice 2) creates an account. Visit tracking is what gives users a reason to return — they want to see their stamp collection grow. This is the "collection" in Goshuincho. Without it, the app is a read-only shrine encyclopedia.

- **Honesty about the stub:** I left the frontend UI in place with a visible TODO rather than hiding the half-finished feature. In a team environment I would open a GitHub issue, set the button to disabled with a tooltip "Coming soon", and not ship the misleading success toast.

- **What I learned from leaving it incomplete:** Shipping a complete slice — even just visits without notes — is better than shipping a polished UI with no backend. The stub taught me to think about slices earlier, not infrastructure first.

---

### Slice 5: Wishlist ❌ (UI shell only)

**Hypothesis:** "Users want to save shrines to visit before they've been there."

`isWishlisted` ref toggles a local heart button. Shares the same `UserCollection` table design as Slice 4 — once backend is built, wishlist is a 30-minute add-on.

---

## Silent Refresh Deep Dive

This section shows the kind of production-grade thinking I apply when I own auth infrastructure. The bugs were discovered during code review, not in production.

### Context

The refresh logic lives in `useApi.ts` inside `authInstance.interceptors.response`. When any authenticated request returns 401, the interceptor should: refresh the access token once, replay all queued requests that arrived during the refresh, and log out if refresh fails.

---

### Bug 1: Idle Timer Never Started After Login

**Location:** `frontend/src/stores/auth.store.ts`

**The problem:**

`resetTimer()` starts a 15-minute countdown that proactively refreshes the access token before a 401 ever occurs. But it was only called from App.vue event listeners — never on login, page reload, or Google OAuth.

**Scenario where it fails:**
1. User logs in
2. User does nothing for 15 minutes (no mouse/keyboard)
3. Access token expires silently
4. User clicks something → API call returns 401
5. Reactive refresh fires (fine if refresh token valid)
6. If refresh token is also expired → phantom logout with no warning

The same gap existed in `initialize()` (restoring tokens on page reload) and `processGoogleCallback()` (Google OAuth flow).

**The fix** — add `resetTimer()` to three entry points:

```typescript
const login = async (values: LoginRequest) => {
  setAuthState((await loginUser(values)).data);
  await getUser();
  resetTimer(); // ← ADDED
};

const initialize = async () => {
  loadingStore.start();
  try {
    if (!accessToken.value || !refreshToken.value) return;
    await getUser();
    isAuthenticated.value = true;
    resetTimer(); // ← ADDED
  } finally {
    loadingStore.stop();
  }
};

const processGoogleCallback = async (code: string) => {
  setAuthState((await createGoogleToken(code)).data);
  await getUser();
  resetTimer(); // ← ADDED
};
```

**Why this matters:** This is a subtle temporal bug. The timer mechanism works correctly once started — the problem is the start condition. Finding it requires tracing the full lifecycle of `resetTimer` across every auth entry point, not just reading the function itself.

---

### Bug 2: Race Condition and Dead Code in the Refresh Interceptor

**Location:** `frontend/src/composables/api/useApi.ts`

**The buggy code (before fix):**

```javascript
try {                             // outer try
  try {                           // inner try
    if (!isRefreshing) {
      isRefreshing = true;
      await useAuthStore().refreshAccessToken();
    } else {
      await new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject }); // queued requester waits
      });
    }
    processQueue(); // BUG: called by BOTH winner and queued requesters
  } catch (error: unknown) {
    processQueue(error);
  } finally {
    isRefreshing = false; // BUG: queued requesters also reset the lock
  }
  return authInstance(error.config); // BUG: runs even when refresh failed
} catch {
  logout(); // DEAD CODE: inner catch swallows all errors; this never fires
}
```

**Three specific problems:**

| # | Problem | Consequence |
|---|---|---|
| 1 | `return authInstance(config)` runs even on refresh failure | Retries with expired token; generates spurious 401 before silent failure |
| 2 | Outer `catch { logout() }` is dead code | Logout never happens on refresh failure; user stays in broken auth state |
| 3 | Queued requesters reset `isRefreshing` in `finally` | Semantically wrong — could allow a premature second refresh |

**The fixed pattern:**

```javascript
authInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      shouldSkipRefresh(error)
    ) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue and wait
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => authInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // This request wins the refresh lock
      isRefreshing = true;
      try {
        await useAuthStore().refreshAccessToken();
        processQueue();               // unblock all queued requests
        return authInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);   // reject all queued requests
        await useAuthStore().logout(); // refresh is broken — log out
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;         // only the lock owner resets the lock
      }
    }

    return Promise.reject(handleError(error));
  },
);
```

**Key differences:**

| Issue | Before | After |
|---|---|---|
| Queued requests | Push and wait inside the same try block | Return new Promise immediately; replay in `.then()` |
| Retry after failed refresh | Falls through to `authInstance(config)` | `return Promise.reject(refreshError)` — no retry |
| Logout on failure | Dead outer catch, never fires | `await logout()` in the single catch branch |
| Lock reset | Both winner and queued reset `isRefreshing` | Only the `finally` of the lock owner resets it |

**Why this matters for the interview:** Real auth bugs don't crash visibly — they cause intermittent "phantom logout" reports that are hard to reproduce. Identifying this requires understanding JavaScript's `async/await` execution model, Promise queue semantics, and module-level shared state. The fix follows the established queue pattern used in libraries like `axios-auth-refresh`.

---

## Architecture Decisions

### Why Two Axios Instances?

`instance` (public) and `authInstance` (authenticated) in `useApi.ts`. The separation means:

- Public requests (shrine list, search, suggestions) never accidentally send a Bearer token
- Auth requests always inject the current token from `useAuthStore().accessToken`
- The 401 refresh interceptor is only attached to `authInstance` — doesn't interfere with legitimately public 401s
- `shouldSkipRefresh` guard prevents an infinite refresh loop when `/api/auth/refresh` itself returns 401 (expired refresh token)

### Why `useAsyncState` / `useAsyncAction` / `useAsyncPaginatedState`?

Early in the project, every component had its own `isLoading`, `error`, and try/catch/finally. After the third copy-paste I extracted three composables:

- `useAsyncState<T>` — data-fetching that sets reactive `data`, `isLoading`, `error`
- `useAsyncAction<A>` — mutations that don't return data (form submits, deletes)
- `useAsyncPaginatedState<T>` — extends `useAsyncState` with pagination metadata parsed from `X-Pagination` header

All three are generics — TypeScript infers the data shape from the async function's return type. Components never write their own loading state logic.

### Why `pinia-plugin-persistedstate` with `pick`?

Only `["accessToken", "refreshToken"]` persist to localStorage — not the user object. On page reload, the router's `beforeEach` guard detects tokens but no `isAuthenticated` state, calls `initialize()`, and re-fetches the user from `/api/auth/me`. This means:

1. The app verifies the token is still valid on every reload (could have been revoked server-side)
2. User profile data is always fresh from the server
3. Sensitive user data is not persisted in localStorage unnecessarily

### Why `Accept-Language` Header for Locale?

The frontend sends the user's selected language on every Axios request. The backend's `GetLocale()` parses this to select `ShrineTranslation` rows. More robust than a URL parameter because:

1. Every existing shrine endpoint gets locale support automatically without changing URLs
2. Follows HTTP content-negotiation semantics — the fallback behavior is already defined in the HTTP standard
3. The frontend locale toggle and the backend translation selection are coupled by a header, not by a route contract

### Why `GlobalErrorHandlingMiddleware` on the Backend?

Custom exceptions (`NotFoundException`, `ValidationException`, `UnprocessableContent`, etc.) are thrown from services — never from controllers. The middleware maps them to HTTP status codes via a C# pattern-match expression. Consistent JSON error shape throughout the API without per-controller try/catch. The frontend's `handleError()` then maps status codes to user-facing i18n strings.

---

## What I'd Build Next

### Immediate: Close the Core Loop (Slice 4)

The most important missing piece is visit tracking. Without persistence, users have no reason to return. This is a 2–3 hour backend task (model + migration + endpoint + service) and a 1-hour frontend task (wire `saveRecord` to a real API call).

Priority:
1. `UserCollection` model + EF migration
2. `POST /api/users/{userId}/collections` endpoint
3. `GET /api/users/{userId}/collections` to load existing state on shrine detail page load
4. Replace the 500ms stub in `ShrineDetailView.vue`

### Short Term: Infrastructure Gaps

- **Azure Blob Storage:** `AzureBlobStorageService.cs` is fully scaffolded — wire the `BlobContainerClient` to `IConfiguration`. The connection string and container name are already read from user-secrets.
- **Rate limiting:** `/api/auth/login`, `/api/auth/forgot-password`, and `/api/auth/refresh` have no rate limiting. ASP.NET Core 8+ includes built-in `AddRateLimiter` middleware.
- **Token blacklist pruning:** `TokenBlacklists` rows accumulate indefinitely. A background `IHostedService` should clean expired JTIs.
- **API versioning:** Add `/api/v1/` prefix before any external clients exist.

### Medium Term: Search and Discovery

- **Spatial index:** Add a SQL Server `geography` column to `Shrines` and use `STDistance()` for geo-queries. Currently all candidates are loaded into memory for Haversine sorting.
- **Featured shrine algorithm:** Currently random (`OrderBy(Guid.NewGuid())`). Could weight by region, season (some shrines have seasonal significance), or proximity to the user's last session location.
- **Shrine image gallery:** `ShrineImage` model, `ShrineImages` table, and blob storage service are ready. Need an upload endpoint and a carousel UI component.

### Long Term: The Retention Loop

- **Stamp collection view:** All visited shrines with visit dates — the digital Goshuincho.
- **Regional completion tracking:** "You've visited 3 of 12 shrines in Kyoto Prefecture" — progress mechanic.
- **Push notifications:** Web Push API + geofencing — "You're near Fushimi Inari Shrine."
- **Admin panel:** Shrine management, image upload workflow, user management.

---

## Growth Visible in the Code

### Where I Grew During This Project

**From copy-paste to composables.** Early views had inline loading states. Extracting `useAsyncState` and `useAsyncAction` was the moment I understood why composables exist — not just for reuse, but for making the right thing the easy thing.

**From HS256 instinct to RS256 understanding.** My first JWT implementation used a symmetric HMAC secret because that's what most tutorials show. Switching to RS256 with PEM-encoded keys required understanding why asymmetric signing matters for distributed systems, even when there's only one service today.

**From "it works" to "why does it work."** The `shouldSkipRefresh` guard for the refresh endpoint took 20 minutes to understand but 2 hours to debug when I accidentally removed it. Understanding why the interceptor would loop infinitely without it changed how I think about all interceptor design.

### Where the Next Step Is Clear

- `useApi.ts` — the most complex file — had zero tests. The silent refresh fix should ship with unit tests covering the queue behavior.
- Zod schemas exist only for auth (`authSchemas.ts`). User update and shrine search request bodies have no client-side schema validation.
- `PersonalContainer.vue` is 580 lines and handles four concerns (profile view, edit mode, picture upload, account deletion) — decompose into focused components.
- `AzureBlobStorageService` stub silently returns a fake URL without logging a warning. Better design: throw `NotImplementedException` in development to surface the incompleteness clearly.

---

## Running Locally

**Prerequisites:** Node 22+, .NET 10 SDK, SQL Server (Docker works)

```bash
# Clone
git clone https://github.com/youyuhsuan/designare.git
cd designare

# Frontend (from project root)
npm install
npm run dev          # http://localhost:5173

# Backend (separate terminal)
cd backend

# Set secrets (one-time setup)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=Designare;Trusted_Connection=true;"
dotnet user-secrets set "Google:ClientId" "your-client-id"
dotnet user-secrets set "Google:ClientSecret" "your-client-secret"
dotnet user-secrets set "Google:RedirectUri" "http://localhost:5173/oauth/callback"
dotnet user-secrets set "Jwt:Issuer" "designare"
dotnet user-secrets set "Jwt:Audience" "designare-client"
dotnet user-secrets set "Jwt:PublicKey" "$(cat public_key.pem)"
dotnet user-secrets set "Jwt:PrivateKey" "$(cat private_key.pem)"
dotnet user-secrets set "Resend:ApiKey" "re_your_key"

dotnet run           # http://localhost:5286
                     # Swagger: http://localhost:5286/swagger
                     # DB tables + seed data created automatically in Development
```

```bash
# Quality checks (from project root)
npm run test:unit    # Vitest unit tests
npm run test:e2e     # Playwright e2e tests
npm run type-check   # vue-tsc strict mode
npm run lint         # oxlint + eslint
```

---

## Project Structure

```
designare/
├── frontend/src/
│   ├── views/                    # Route-level pages
│   │   ├── HomeView.vue          # Featured shrines + hero search
│   │   ├── SearchView.vue        # Paginated search with infinite scroll
│   │   ├── ShrineDetailView.vue  # Full shrine detail + visit/wishlist UI
│   │   ├── SettingsView.vue      # Profile + appearance settings
│   │   └── auth/                 # Login, register, forgot/reset password
│   ├── components/
│   │   ├── auth/                 # LoginForm, RegisterForm, FortuneSticks, GoogleOAuthButton
│   │   ├── common/               # SearchBar (dual-input + autocomplete), ShrineCard
│   │   ├── Menubar/              # DesktopNav, MobileNav, Hamburger, ThemeToggle
│   │   └── setting/              # PersonalContainer, AppearanceContainer, SettingLayout
│   ├── composables/
│   │   ├── api/                  # useApi.ts, useApiAuth, useApiShrines, useApiUser, useApiOAuth
│   │   ├── useAsyncState.ts      # Reactive data-fetch wrapper
│   │   ├── useAsyncAction.ts     # Reactive mutation wrapper
│   │   └── useAsyncPaginatedState.ts  # Paginated fetch + X-Pagination header
│   ├── stores/
│   │   ├── auth.store.ts         # Tokens, user, idle timer, login/logout/initialize
│   │   ├── setting.store.ts      # Theme, language, cursor
│   │   └── loading.store.ts      # Global loading overlay
│   ├── directives/
│   │   ├── cursor.ts             # v-cursor-hover (enlarges cursor on hover)
│   │   └── stamp.ts              # v-cursor-stamp (shrine petal SVG interaction)
│   ├── config/                   # apiConfig.ts, routeConfig.ts, i18nConfig.ts, locales/
│   ├── types/                    # Per-domain TypeScript interfaces
│   ├── schemas/                  # authSchemas.ts (Zod)
│   └── utils/                    # compressImage, debounce, errorHandler, filterNullish, formatUI
└── backend/
    ├── Controllers/              # AuthController, UsersController, ShrinesController, OAuthController
    ├── Service/                  # *Service.cs + I*Service.cs interfaces
    ├── Data/                     # AppDbContext, DataSeeder, shrines.json seed
    ├── Models/                   # User, Shrine, ShrineTranslation, ShrineImage, RefreshToken, TokenBlacklist
    ├── DTOs/                     # Request/response shape objects
    ├── Migrations/               # EF Core migrations
    ├── Middleware/               # GlobalErrorHandlingMiddleware
    ├── Exceptions/               # Custom exception types
    ├── Helpers/                  # RsaKeyHelper (PEM loading)
    └── Program.cs                # DI registration, middleware pipeline, Serilog, CORS, Swagger
```

---

## License

MIT
