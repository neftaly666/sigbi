# CLAUDE.md

## Project Overview

SIGBI (Sistema de Gestión Bibliotecaria Inteligente) is a monorepo with three pieces: a
Spring Boot REST API (Java 25, Maven), an Angular 22 SPA, and the AN/EST documentation
line. It manages books, clients, categories and reservations for a library, plus AI
features (conversational agent and RAG over documents).

Follow the existing architecture and conventions before introducing new patterns. The
written documentation is the contract: when code and documents disagree, fix the one that
is wrong, never leave both.

---

## Repository Structure

```
backend/         Spring Boot API. Packages: controller, service, service/impl, repo,
                 model, dto, config, exception, security, tool, util
backend/.agents/ Specs, subagents and workflows (see the catalogs below)
frontend/        Angular SPA: app/pages, app/services, app/store, app/forms, app/shared
documentacion/   AN010-AN130 and EST010/EST020, in Markdown and Word
```

---

## Architecture Principles

- Use the existing layered architecture.
- Reuse the generic CRUD abstractions whenever applicable (`ICRUD`, `CRUDImpl`, `IGenericRepo`).
- Prefer composition over creating new abstractions.
- Do not duplicate existing functionality.

---

## Coding Conventions

- Use Lombok.
- Prefer constructor injection.
- Use ResponseEntity in controllers.
- Use Jakarta Validation.
- Keep endpoint naming RESTful (`/v1/<plural-resource>`).
- Map entity <-> DTO with ModelMapper; never expose entities directly.
- Follow the existing package structure.
- Identifiers in English (classes, variables, tables, columns, endpoints).
- User-facing text in Spanish. `messages.properties` is the default locale and is Spanish;
  `messages_en` / `messages_fr` are the alternates. The English labels left in the older
  CRUD templates are course boilerplate, not the convention.

---

## Persistence

The database standard is documented in `documentacion/EST010-estándar-de-base-de-datos.md`.
Read it before creating any entity. Key rules:

- PostgreSQL; the schema is generated from JPA entities (`ddl-auto: update`).
- Primary key: `Integer id<ClassName>` with `GenerationType.IDENTITY`.
  The field name must be exactly `id` + the class simple name - `CRUDImpl.update()`
  resolves `setId<ClassName>` by reflection and fails at runtime otherwise.
- Foreign keys: `@JoinColumn(name = "id_<parent>", nullable = false,
  foreignKey = @ForeignKey(name = "FK_<CHILD>_<PARENT>"))`.
- Always declare `nullable` and `length` explicitly on `@Column`.
- `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` with `@EqualsAndHashCode.Include`
  on the primary key only.

---

## Domain Model

| Entity | Table | Relations |
|--------|-------|-----------|
| `Category` | `category` | 1-N `Book` |
| `Book` | `book` | N-1 `Category` |
| `Client` | `client` | 1-N `Reservation` |
| `Reservation` | `reservation` | N-1 `Client`, 1-N `ReservationDetail` |
| `ReservationDetail` | `reservation_detail` | N-1 `Reservation`, N-1 `Book` |

---

## Build

Backend, from `backend/`:

    ./mvnw -DskipTests compile

Frontend, from `frontend/`:

    npx ng build

Run tests only when explicitly requested.

---

## Agent Catalog

Agents are located in `backend/.agents/subagents`
Available specialized agents:

- writer-code
  Implements code for backend and frontend from a spec, following EST010/EST020.
  Knows the runtime traps that do not fail at compile time: primary key naming
  required by CRUDImpl reflection, lazy collections, header-detail toString
  recursion.

- reviewer-standards
  Read-only review of a change against the standards and against the spec that
  originated it. Reports by severity; does not modify code.

---

## Workflow Catalog

Workflows are located in `backend/.agents/workflows`

- WF-001-porcion-vertical
  Adding a domain entity end to end: the six files, in order, and the definition
  of done. Applied to the five SIGBI entities.

---

## Features Catalog

Features are located in `backend/.agents/features`

- FEAT-001-registro-de-reserva
  Reservation registration. Rules RN-03 to RN-10, contract and acceptance
  criteria. Implemented and verified, backend and frontend.

- FEAT-002-asistente-de-reserva
  The three-step wizard that consumes FEAT-001. Implemented and verified; the
  spec was written first and caught four requirements the first implementation
  had skipped.

---

## Frontend Conventions

- Angular 22 with signals; stores under `app/store`, forms under `app/forms`.
- Colors always come from design tokens; no literal color in a component stylesheet
  (rule TW-09 of AN050). `--mat-sys-*` for the Material roles, `--sigbi-*` for what
  Material does not provide.
- Identifiers in English or unaccented Spanish; user-facing text in Spanish, correctly
  accented.
- The design line is `documentacion/AN050-diseño-ui-ux.md`, and it is drawn against the
  running application, not the other way round.

---

## General Rules

- Never hardcode secrets. All sensitive configuration comes from environment variables.
- Never modify shared infrastructure without an explicit request.
- Follow the project's existing conventions before introducing new ones.
