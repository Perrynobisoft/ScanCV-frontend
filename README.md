# ScanCV Frontend

A modern React + TypeScript frontend application following Clean Architecture principles. This project is the frontend layer of the ScanCV product and is built to work with a backend API or an MSW mock server.

## 🚀 What this project includes

- React 19 + TypeScript + Vite
- TanStack Router for routing
- TanStack Query for server state management
- TailwindCSS for styling
- Axios HTTP client with interceptors
- Zod and @t3-oss/env-core for validation
- Paraglide + Inlang for internationalization
- MSW for mock API support in development
- Husky + Commitlint for Git hooks
- Vitest for testing

## 🗂️ Project structure

```
src/
├── application/         # Use cases, DTOs, repository and service interfaces
├── domain/              # Domain models and business types
├── infrastructure/      # HTTP, repositories, hooks, and concrete implementations
├── presentation/        # UI components, features, layouts, and providers
├── routes/              # TanStack Router route definitions
└── shared/              # Shared utilities, constants, types, and i18n
```

## ⚙️ Setup

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- pnpm 10+ via Corepack

### Install dependencies

```bash
corepack enable
pnpm install
```

### Configure environment

Copy `.env.example` to `.env` and update values as needed.

Example `.env`:

```env
VITE_APP_API_URL=http://localhost:3001
VITE_APP_TIMEOUT=30000
VITE_APP_TITLE=ScanCV
VITE_APP_ENABLE_MSW=true
VITE_APP_ENABLE_LOGGER=true
SERVER_URL=http://localhost:3001
```

### Run locally

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🧩 Available scripts

```bash
pnpm dev
pnpm start
pnpm build
pnpm build:msw
pnpm serve
pnpm test
pnpm test:watch
pnpm check:lint
pnpm check:type
pnpm check:format
pnpm check
pnpm fix:lint
pnpm fix:format
pnpm fix
pnpm gen:api
pnpm i18n:gen
pnpm machine-translate
```

## 🛠️ Key features

- Clean Architecture separation between application, domain, infrastructure, and presentation
- File-based routing with TanStack Router and nested route guards
- Authentication flow with protected routes and role checks
- Global caching and server state management with TanStack Query
- Mock API support with MSW for frontend-only development
- Internationalization with Paraglide and Inlang
- Path aliasing for clean imports

## 🌐 Internationalization (i18n)

- Translation files live in `src/shared/i18n/messages/`
- Run `pnpm i18n:gen` after updating translation files
- Supported languages: English (`en`) and German (`de`)
- Use translations through generated `@paraglide/messages`

## 📁 Folder overview

### `src/application`

- `dto/` — data transfer objects
- `exceptions/` — application errors
- `repositories/` — repository interfaces
- `services/` — service interfaces

### `src/domain`

- `models/` — domain entities and shared types

### `src/infrastructure`

- `hooks/` — API hooks and network utilities
- `http/` — HTTP client setup
- `repositories/` — repository implementations
- `services/` — service implementations

### `src/presentation`

- `components/` — reusable UI components
- `features/` — feature pages
- `hooks/` — presentation-specific hooks
- `layouts/` — layout components
- `provider/` — context providers

### `src/routes`

- Route definitions and loaders for TanStack Router
- Auto-generated route tree in `src/routeTree.gen.ts`

### `src/shared`

- Shared helpers, constants, enums, validation, and i18n utilities

## 🧪 Testing

```bash
pnpm test
pnpm test:watch
```

## 🐳 Docker

A Dockerfile is included and configured to use `pnpm`.

Build and run:

```bash
docker build -t scancv-frontend .
docker run -p 80:80 scancv-frontend
```

## 🔎 note

- This repository is the frontend application only.
- To run fully, point `VITE_APP_API_URL` to a backend service or enable mock mode with `VITE_APP_ENABLE_MSW=true`.
- `pnpm install` triggers `pnpm i18n:gen` automatically via `postinstall`.

## 🤝 Contributing

1. Fork the repository
2. Create a branch
3. Commit with a clear message
4. Open a Pull Request

## 📄 License

Use the license defined by your organization or repository.
