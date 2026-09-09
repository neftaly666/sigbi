# CLAUDE.md

## Project Overview

SIGBI (Sistema de Gestión Bibliotecaria Inteligente) backend is a Spring Boot REST API
built with Java 25 and Maven. It manages books, clients, categories and reservations for
a library, plus AI features (conversational agent and RAG over documents).

Follow the existing architecture and conventions before introducing new patterns.

---

## Repository Structure

- controller
- service
- service/impl
- repo
- model
- dto
- config
- exception
- security
- tool
- util

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

The database standard is documented in `../documentacion/ESTANDAR-BD.md`.
Read it before creating any entity. Key rules:

- PostgreSQL; the schema is generated from JPA entities (`ddl-auto: update`).
- Primary key: `Integer id<ClassName>` with `GenerationType.IDENTITY`.
  The field name must be exactly `id` + the class simple name — `CRUDImpl.update()`
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
| `Category` | `category` | 1—N `Book` |
| `Book` | `book` | N—1 `Category` |
| `Client` | `client` | 1—N `Reservation` |
| `Reservation` | `reservation` | N—1 `Client`, 1—N `ReservationDetail` |
| `ReservationDetail` | `reservation_detail` | N—1 `Reservation`, N—1 `Book` |

---

## Build

Compile using:

./mvnw -DskipTests compile

Run tests only when explicitly requested.

---

## Agent Catalog

Agents are located in .agents/subagents
Available specialized agents:

- writer-code
  Implements code for backend and frontend

---

## Workflow Catalog

Workflows are located in .agents/workflows

## Features Catalog

Features are located in .agents/features

---

## General Rules

- Never hardcode secrets. All sensitive configuration comes from environment variables.
- Never modify shared infrastructure without an explicit request.
- Follow the project's existing conventions before introducing new ones.
