# Goshuincho

A full-stack shrine discovery web application — browse, search, and explore Japanese shrines, with a complete authentication system including Google OAuth.

## Quick Links

- [API Documentation](http://localhost:5286/swagger/index.html)
- [Architecture Diagram]()

## Features

- **Shrine Discovery** — Browse and search a curated database of Japanese shrines
- **Google OAuth** — One-click sign-in via Google, with CSRF-protected authorization flow
- **JWT Authentication** — Short-lived access tokens (15 min) with silent refresh and rotation
- **Multilingual UI** — English and Japanese locale support via vue-i18n
- **Dark Mode** — OS-aware theme that follows `prefers-color-scheme`, user-overridable
- **Image Upload** — Profile pictures stored via Azure Blob Storage

## Tech Stack

### Frontend

<div align="left">
  <img src="https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia"/>
  <img src="https://img.shields.io/badge/PrimeVue-41B883?style=for-the-badge&logo=prime&logoColor=white" alt="PrimeVue"/>
  <img src="https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
  <img src="https://img.shields.io/badge/vue--i18n-41B883?style=for-the-badge&logo=vue.js&logoColor=white" alt="vue-i18n"/>
  <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"/>
</div>

### Backend

<div align="left">
  <img src="https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="ASP.NET Core"/>
  <img src="https://img.shields.io/badge/EF_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="Entity Framework Core"/>
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white" alt="SQL Server"/>
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Azure_Blob-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Azure Blob Storage"/>
  <img src="https://img.shields.io/badge/Serilog-7B3F9E?style=for-the-badge&logo=dotnet&logoColor=white" alt="Serilog"/>
</div>

### Testing

<div align="left">
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest"/>
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"/>
</div>

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/goshuincho.git
cd goshuincho
```

2. Install the required dependencies and start the development server:

```bash
# Frontend (project root)
npm install
npm run dev        # http://localhost:5173

# Backend
cd backend
dotnet run         # http://localhost:5286
# Swagger UI: http://localhost:5286/swagger
```

3. Configure environment variables

Copy the example file to see all required keys:

```
user-secrets.example.json  ← reference only, do not fill in real values
```

Then set each value via CLI:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."
dotnet user-secrets set "Google:ClientId" "..."
dotnet user-secrets set "Google:ClientSecret" "..."
dotnet user-secrets set "Google:RedirectUri" "..."
dotnet user-secrets set "Jwt:Issuer" "..."
dotnet user-secrets set "Jwt:Audience" "..."
dotnet user-secrets set "Jwt:PublicKey" "..."
dotnet user-secrets set "Jwt:PrivateKey" "..."
```

## Project Structure

```
/                          # Vue 3 frontend (Vite)
├── frontend/src/
│   ├── views/             # Route-level page components
│   ├── components/        # Reusable UI components
│   ├── composables/api/   # One composable per API resource
│   ├── stores/            # auth.store.ts · setting.store.ts
│   ├── config/            # apiConfig.ts · routeConfig.ts · locales/
│   ├── types/             # TypeScript interfaces per domain
│   └── utils/             # Pure utility functions
└── backend/               # ASP.NET Core Web API
    ├── Controllers/        # HTTP layer
    ├── Service/            # Business logic
    ├── Repository/         # Data access
    ├── Models/             # EF Core entities
    └── Data/               # DbContext · seed data
```

## License

MIT
