# SIGBI - Sistema de Gestión Bibliotecaria Inteligente

Aplicación Full Stack para la gestión de libros, clientes, categorías y reservas de una
biblioteca, con capacidades de IA (agente conversacional y RAG sobre documentos).

Trabajo final del curso **Java AI Full Stack - MitoCode**.

| Capa | Tecnología |
|------|------------|
| Backend | Spring Boot 4.1.0 - Java 25 - Maven |
| Frontend | Angular 22 - Angular Material 22 - Signals |
| Base de datos | PostgreSQL 15+ (local o Supabase) |
| IA | Spring AI 2.0 - OpenAI - pgvector |
| Autenticación | Supabase Auth (JWT, OAuth2 Resource Server) - *opcional* |

---

## Demostración publicada

| | |
|---|---|
| **Aplicación** | `https://<pendiente>.vercel.app` |
| **API** | `https://<pendiente>.onrender.com` |
| **Acceso** | correo y contraseña de prueba, pendientes de crear en Supabase |

**La primera carga puede tardar cerca de un minuto.** El backend está en el plan gratuito de
Render, que duerme el servicio tras 15 minutos sin tráfico; la primera llamada lo despierta.
A partir de ahí responde con normalidad.

El paso a paso del despliegue -las tres piezas, el orden y las variables de entorno- está en
[`documentacion/AN110-manual-de-instalación.md`](documentacion/AN110-manual-de-instalación.md),
sección 10.

---

## Estructura del repositorio

```
sigbi/
+-- backend/          API REST Spring Boot
+-- frontend/         SPA Angular
+-- documentacion/    Línea documental AN/EST, diseño y enunciado
+-- CLAUDE.md         Convenciones del proyecto para los agentes de IA
```

---

## Requisitos previos

- **JDK 25** (`java -version`)
- **Node.js 20+** y npm
- **PostgreSQL 15+** en local, o un proyecto en [Supabase](https://supabase.com)
- Clave de **OpenAI** (solo si se usan las funciones de IA)

---

## 1. Base de datos

El esquema **lo genera Hibernate automáticamente** a partir de las entidades JPA
(`spring.jpa.hibernate.ddl-auto: update`). No hay migraciones que ejecutar a mano.

Solo hay que crear la base vacía:

```sql
CREATE DATABASE sigbi;
```

Si vas a usar RAG (búsqueda semántica sobre PDFs), habilita la extensión de vectores:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

> En Supabase, `vector` se activa desde *Database -> Extensions*.

Las convenciones de nombres de tablas, columnas, PK y FK están documentadas en
[`documentacion/EST010-estándar-de-base-de-datos.md`](documentacion/EST010-estándar-de-base-de-datos.md). **Léelo antes de crear
una entidad nueva**: contiene una regla obligatoria sobre el nombre de la clave primaria.

---

## 2. Backend

### Variables de entorno

| Variable | Obligatoria | Por defecto | Descripción |
|----------|-------------|-------------|-------------|
| `DB_URL` | Sí | - | `jdbc:postgresql://localhost:5432/sigbi` |
| `DB_USERNAME` | Sí | - | Usuario de PostgreSQL |
| `DB_PASSWORD` | Sí | - | Contraseña de PostgreSQL |
| `SERVER_PORT` | No | `80` | **Usa `8080`**: es el puerto que espera el frontend |
| `FRONT_URL` | Sí | - | `http://localhost:4200` (origen permitido por CORS) |
| `OPENAI_API_KEY` | Solo IA | - | Clave de OpenAI |
| `SUPABASE_ISSUER_URI` | Solo auth | - | `https://<proyecto>.supabase.co/auth/v1` |
| `SUPABASE_URL` | Solo auth | - | `https://<proyecto>.supabase.co` |
| `SUPABASE_ANON_KEY` | Solo auth | - | Clave pública del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo auth | - | Clave de servicio (**nunca** al repo) |
| `AUTH_MODE` | No | `bearer` | `bearer` o `cookie`. Debe coincidir con `AUTH_MODE` del frontend |
| `AUTH_COOKIE_SECURE` | No | `false` | `true` en producción (HTTPS) |
| `AUTH_COOKIE_SAME_SITE` | No | `Lax` | `None` si el frontend vive en otro dominio |
| `SUPABASE_BUCKET` | No | `photos` | Bucket de Storage para imágenes |
| `SUPABASE_MAX_PHOTO_SIZE` | No | `2097152` | Tamaño máximo de imagen en bytes (2 MB) |

Nunca escribas estos valores en `application.yaml`. Expórtalos en tu shell o usa el
perfil de ejecución de tu IDE:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/sigbi
export DB_USERNAME=postgres
export DB_PASSWORD=tu_password
export SERVER_PORT=8080
export FRONT_URL=http://localhost:4200
export OPENAI_API_KEY=sk-...
```

### Compilar y ejecutar

```bash
cd backend
./mvnw -DskipTests compile     # compilar
./mvnw spring-boot:run         # ejecutar
```

La API queda en `http://localhost:8080`. Todos los endpoints cuelgan de `/v1/...`.

---

## 3. Frontend

```bash
cd frontend
npm install
npm start
```

Disponible en `http://localhost:4200`.

La URL del backend y el modo de autenticación se configuran en
`src/environments/environment.development.ts`:

```ts
export const environment = {
    HOST: 'http://localhost:8080',
    RETRY: 2,
    AUTH_MODE: 'bearer' as AuthMode   // debe coincidir con app.auth.mode del backend
};
```

> Si `AUTH_MODE` del frontend y `app.auth.mode` del backend no coinciden, **todas las
> peticiones responden 401**.

Build de producción:

```bash
npm run build      # artefactos en dist/
```

---

## 4. Specs y Agentes de IA

Viven en el repositorio para poder ser revisados:

```
backend/.agents/
+-- features/      Specs funcionales (qué construir, antes de construirlo)
+-- subagents/     Definición e instrucciones de los agentes
+-- workflows/     Flujos de trabajo asistidos por IA
```

Las convenciones de arquitectura y código que siguen los agentes están en
[`CLAUDE.md`](CLAUDE.md).

---

## 5. Seguridad

- Ninguna credencial, token o clave se versiona en el repositorio.
- La configuración sensible se inyecta exclusivamente por variables de entorno.
- Revisa `.gitignore` antes de cada commit.
