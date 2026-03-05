# React Clean Architecture Template

A React + TypeScript project template implementing clean architecture, inspired by [rn-clean-architecture-template](https://github.com/jerrytran-wrk/rn-clean-architecture-template) and [Resocoder's Flutter clean architecture](https://resocoder.com/flutter-clean-architecture-tdd/).

## Features

- **Clean Architecture** — strict layer separation (Core, Domain, Data, Presentation)
- **Dependency Injection** — [tsyringe](https://github.com/microsoft/tsyringe) with decorator support
- **Promise-based** — async/await throughout (no observables)
- **React Context** — lightweight state management via Context + useReducer
- **React Router** — auth-gated routing with session restoration
- **Vite** — fast dev server with HMR

## Quick Start

```bash
npx degit your-username/react-clean-architecture-template my-app
cd my-app
npm install
npm run dev
```

The app starts on `http://localhost:5173` with a login page. Use `user@example.com` with any password (mock data source).

## Architecture

```
src/
├── core/           # Framework-agnostic abstractions (UseCase interface, HTTP provider, exceptions)
├── domain/         # Business logic (entities, repository interfaces, use cases)
├── data/           # Data layer (repository implementations, data sources, DTOs)
├── di/             # Dependency injection (token registry, module registrations)
└── presentation/   # React UI (pages, hooks, context, router)
```

### Layer dependency rule

```
Presentation → Domain ← Data
                 ↑
               Core
```

- **Domain** has zero dependencies on Data or Presentation — only on Core abstractions
- **Data** implements Domain interfaces (repository contracts)
- **Presentation** interacts with Domain through use cases only, never directly with repositories or data sources

### Adding a new feature

1. **Domain** — create entity interfaces, repository interface, and use case (`UseCase<Result, Params>`)
2. **Data** — create DTOs, data source(s), and repository implementation
3. **DI** — add token to `AppDependencies` enum, register in the appropriate module
4. **Presentation** — create page component + custom hook that resolves the use case from the DI container

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Connecting a real API

The template ships with a `MockAuthenticationDataSource` for zero-dependency demo. To connect a real backend:

1. Swap `MockAuthenticationDataSource` for `ApiAuthenticationDataSource` in `src/di/DataModule.ts`
2. Set `VITE_API_URL` in `.env` to your API base URL
3. Update the Vite proxy in `vite.config.ts` if needed for local development

## Tech Stack

- React 19 + TypeScript 5
- Vite 7
- tsyringe (dependency injection)
- axios (HTTP client)
- React Router 7

## Acknowledgements

- [rn-clean-architecture-template](https://github.com/jerrytran-wrk/rn-clean-architecture-template) — React Native clean architecture template
- [Resocoder](https://resocoder.com/flutter-clean-architecture-tdd/) — Flutter TDD clean architecture course

## License

MIT
