# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR (Vite proxy forwards /api to reqres.in)
npm run build     # TypeScript type-check + Vite production build
npm run lint      # ESLint (flat config, TS + React rules)
npm run preview   # Preview production build locally
```

## Architecture

This is a React clean architecture template based on [rn-clean-architecture-template](https://github.com/jerrytran-wrk/rn-clean-architecture-template) and Resocoder's Flutter clean architecture. It enforces strict layer separation with dependency injection via tsyringe.

### Layer dependency rule

```
Presentation → Domain ← Data
                 ↑
               Core
```

Presentation depends on Domain (use cases, entities). Data implements Domain interfaces. Domain has zero dependencies on Presentation or Data — only on Core abstractions.

### Layers

- **`src/core/`** — Framework-agnostic: `UseCase<Result, Params>` interface (Promise-based), `RemoteProvider` HTTP abstraction (Axios impl), exception hierarchy (`Exception`, `RemoteException`, `LocalException`, etc.), `BuildConfig`
- **`src/domain/`** — Pure business logic: entity interfaces, repository interfaces (contracts), use case implementations. No framework imports.
- **`src/data/`** — Implements domain contracts: repository implementations, remote/local data sources, API request/response DTOs
- **`src/di/`** — tsyringe DI wiring: `AppDependencies` enum for tokens, module files register concrete implementations. `AppModule.registerDependencies()` bootstraps everything.
- **`src/presentation/`** — React UI: pages (component + hook per feature), `AuthContext` (React Context + useReducer for auth state with session restoration), `AppRouter` (auth-gated routing)

### DI pattern (tsyringe)

Classes use `@injectable()` and `@inject(AppDependencies.Token)` decorators. Registration happens in DI module files (`DataModule`, `RepositoryModule`, `UseCaseModule`). Presentation resolves use cases via `container.resolve<T>(token)` in custom hooks. Requires `reflect-metadata` import in `main.tsx` and Babel decorator plugins configured in `vite.config.ts`.

### Adding a new feature

1. **Domain**: entity interface in `domain/entity/`, repository interface in `domain/repository/`, use case in `domain/use-case/<feature>/` implementing `UseCase<R, P>`
2. **Data**: DTOs in `data/model/`, data sources in `data/data-source/<feature>/`, repository implementation in `data/repository/`
3. **DI**: add tokens to `di/types.ts`, register in the appropriate module (`DataModule`, `RepositoryModule`, `UseCaseModule`)
4. **Presentation**: page component + hook in `presentation/pages/<feature>/`, hook resolves use case from container and dispatches context actions

### Auth flow

`AuthProvider` restores session on mount by calling `SignInUseCase.call()` with no params (tries localStorage token). During restoration, `isRestoringSession: true` causes the router to show a loading screen. The mock data source accepts `user@example.com` with any password — swap `MockAuthenticationDataSource` for `ApiAuthenticationDataSource` in `DataModule.ts` to use a real API.

## TypeScript config

Strict mode enabled. Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`). No unused locals/parameters allowed.
