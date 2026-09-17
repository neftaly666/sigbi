# MANUAL DE INSTALACIÓN

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN110` - N.º AN-2026-011

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN110 |
| Versión | 1.0 |
| Fecha | 2026-09-14 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Dirigido a | Responsable de la instalación - docente evaluador |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial. Verificada contra `backend/pom.xml`, `backend/src/main/resources/application.yaml` y `README.md`. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

**Para quién es este documento.** Para quien pone SIGBI en marcha en una máquina donde no
estaba. El `README.md` de la raíz es la versión corta -los pasos y nada más-; este es el
mismo procedimiento con los porqués, las comprobaciones intermedias y las tres trampas que
dejan el sistema arrancado pero inservible.

Si solo quiere levantarlo y ya lo ha hecho antes, use el README.

---

## 1. Topología y componentes

Tres piezas. Ningún servidor de aplicaciones, ninguna cola, ningún proceso en segundo plano.

```
   +----------------------+        JSON / HTTP(S)       +----------------------+
   |  Frontend (SPA)      | --------------------------> |  Backend (API REST)  |
   |  Angular 22          | <-------------------------- |  Spring Boot 4.1     |
   |  :4200 (desarrollo)  |         /v1/<recurso>       |  :8080               |
   |  estáticos (prod.)   |                             +----------+-----------+
   +----------------------+                                        | JDBC
                                                        +----------v-----------+
                                                        |  PostgreSQL 15+      |
                                                        |  base `sigbi`        |
                                                        |  + extensión vector* |
                                                        +----------------------+
                                                                   ^ HTTPS
                                                        +----------+-----------+
                                                        |  OpenAI   (opcional) |
                                                        |  Supabase (opcional) |
                                                        +----------------------+
```
<sub>\* la extensión `vector` solo hace falta si se usa RAG.</sub>

| Componente | Artefacto | Puerto | Obligatorio |
|---|---|---|---|
| Base de datos | PostgreSQL 15+, base `sigbi` | 5432 | **Sí** |
| Backend | JAR ejecutable (`./mvnw package`) | 8080 | **Sí** |
| Frontend | Estáticos de `dist/` o `npm start` | 4200 | **Sí** |
| OpenAI | Servicio externo | - | No - solo para el asistente |
| Supabase Auth | Servicio externo | - | No - la autenticación es opcional |

**Orden de arranque:** base de datos -> backend -> frontend. El backend crea el esquema en su
primer arranque, así que la base tiene que existir antes.

---

## 2. Requisitos previos

| Requisito | Versión | Comprobación |
|---|---|---|
| JDK | **25** | `java -version` |
| Node.js | 20 o superior | `node -v` |
| npm | el que acompañe a Node | `npm -v` |
| PostgreSQL | 15 o superior | `psql --version` |
| Git | cualquiera reciente | `git --version` |

**No hace falta instalar Maven**: el repositorio trae el wrapper (`./mvnw`).
**No hace falta instalar Angular CLI globalmente**: `npm start` usa el local.

Opcionales, según lo que quiera activar:

| Para | Necesita |
|---|---|
| El asistente de IA (RF-14) | Una clave de OpenAI |
| RAG sobre documentos (RF-19) | Lo anterior + la extensión `vector` en PostgreSQL |
| Autenticación (RF-18) | Un proyecto de Supabase con Auth |

### 2.1 Obtener el código

```bash
git clone <url-del-repositorio> sigbi
cd sigbi
```

El repositorio es un monorepo: `backend/`, `frontend/` y `documentacion/` en la misma raíz.

---

## 3. Base de datos

**No hay migraciones que ejecutar.** El esquema lo genera Hibernate a partir de las
entidades JPA (`spring.jpa.hibernate.ddl-auto: update`). Usted solo crea la base vacía.

```sql
CREATE DATABASE sigbi;
```

Si va a usar RAG, habilite además la extensión de vectores **sobre esa base**:

```sql
\c sigbi
CREATE EXTENSION IF NOT EXISTS vector;
```

> En Supabase, `vector` se activa desde *Database -> Extensions*; no hace falta `psql`.

**Comprobación:** `\l` debe listar `sigbi`. No espere ver tablas todavía - no las hay hasta
que arranque el backend.

### 3.1 PostgreSQL local o Supabase

Es indistinto y **no cambia ni una línea de código**: solo cambia `DB_URL` (RNF-09).

| | `DB_URL` |
|---|---|
| Local | `jdbc:postgresql://localhost:5432/sigbi` |
| Supabase | `jdbc:postgresql://<host-de-supabase>:5432/postgres` |

En Supabase la cadena de conexión está en *Project Settings -> Database*. Use la del modo
que le indique el panel y añada los parámetros de SSL que le muestre.

---

## 4. Backend

### 4.1 Variables de entorno

**Toda** la configuración entra por variable de entorno. No escriba valores en
`application.yaml`: el fichero está preparado con marcadores `${VARIABLE}` y versionar un
secreto ahí incumple RNF-04.

| Variable | Obligatoria | Por defecto | Descripción |
|---|---|---|---|
| `DB_URL` | **Sí** | - | `jdbc:postgresql://localhost:5432/sigbi` |
| `DB_USERNAME` | **Sí** | - | Usuario de PostgreSQL |
| `DB_PASSWORD` | **Sí** | - | Contraseña de PostgreSQL |
| `FRONT_URL` | **Sí** | - | Único origen permitido por CORS: `http://localhost:4200` |
| `SUPABASE_ISSUER_URI` | **Sí** *(ver sección 4.2)* | - | `https://<proyecto>.supabase.co/auth/v1` |
| `SERVER_PORT` | No | `8080` | En la nube no hace falta: la plataforma inyecta `PORT` y tiene prioridad |
| `OPENAI_API_KEY` | Solo IA | - | Clave de OpenAI |
| `SUPABASE_URL` | Solo auth | - | URL del proyecto |
| `SUPABASE_ANON_KEY` | Solo auth | - | Clave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo auth | - | Clave de servicio. **Nunca al repositorio** |
| `AUTH_MODE` | No | `bearer` | `bearer` o `cookie` |
| `AUTH_COOKIE_SECURE` | No | `false` | `true` en producción |
| `AUTH_COOKIE_SAME_SITE` | No | `Lax` | `None` si el frontend vive en otro dominio |
| `SUPABASE_BUCKET` | No | `photos` | Bucket de Storage |
| `SUPABASE_MAX_PHOTO_SIZE` | No | `2097152` | 2 MB |

Mínimo para arrancar en local sin IA:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/sigbi
export DB_USERNAME=postgres
export DB_PASSWORD=su_password
export SERVER_PORT=8080
export FRONT_URL=http://localhost:4200
export SUPABASE_ISSUER_URI=https://su-proyecto.supabase.co/auth/v1
export OPENAI_API_KEY=sk-...        # solo si quiere el asistente
```

### 4.2 Las tres trampas

Ninguna da un error claro. Las tres dejan el sistema aparentemente arrancado.

> **Trampa 1 - `SERVER_PORT` vale 80 por defecto.**
> El YAML declara `${SERVER_PORT:80}` y el frontend apunta a `8080`. Si no la exporta, el
> backend intenta el puerto 80 -que en Linux exige privilegios- y el frontend pregunta a un
> puerto donde no hay nadie. **Expórtela siempre como `8080`.**

> **Trampa 2 - `AUTH_MODE` tiene que decir lo mismo en los dos lados.**
> `app.auth.mode` del backend y `AUTH_MODE` de `environment.development.ts` deben coincidir.
> Si no coinciden, el ingreso funciona y **todas** las peticiones posteriores responden 401.
> El síntoma engaña: parece un problema de credenciales y es de configuración.

> **Trampa 3 - `SUPABASE_ISSUER_URI` no tiene valor por defecto.**
> `application.yaml` la declara como `${SUPABASE_ISSUER_URI}`, sin alternativa. Aunque no
> vaya a usar autenticación, el marcador tiene que resolverse o el arranque falla. Exporte
> la URI de un proyecto de Supabase, o retire la autenticación de forma explícita: la
> seguridad es opcional según el enunciado (sección 4 y sección 7), y desactivarla no toca el dominio.
> **Decida esto antes de arrancar, no después del primer 401.**

### 4.3 Compilar y ejecutar

```bash
cd backend
./mvnw -DskipTests compile      # comprobación rápida
./mvnw spring-boot:run          # desarrollo
```

Para producción:

```bash
./mvnw package                  # genera target/*.jar
java -jar target/mediapp-backend-0.0.1-SNAPSHOT.jar
```

> El artefacto todavía se llama `mediapp-backend`: es deuda conocida de la migración
> (D-01 de AN020), no un error de empaquetado. Se renombra al cerrar la migración.

### 4.4 Comprobación

En el primer arranque, Hibernate crea las tablas. Verifíquelo:

```sql
\c sigbi
\dt
```

Debe ver las cinco de dominio - `category`, `book`, `client`, `reservation`,
`reservation_detail` - y, si la IA está activa, `vector_store` y `spring_ai_chat_memory`.

Y que la API responde:

```bash
curl -i http://localhost:8080/v1/books
```

Con la base recién creada devuelve `200` y una lista vacía. Si devuelve `401`, la
autenticación está activa: es correcto, y necesitará un token.

---

## 5. Frontend

```bash
cd frontend
npm install
npm start
```

Queda en `http://localhost:4200`.

La configuración vive en `src/environments/environment.development.ts`:

```ts
export const environment = {
    HOST: 'http://localhost:8080',
    RETRY: 2,
    AUTH_MODE: 'bearer' as AuthMode   // debe coincidir con app.auth.mode del backend
};
```

| Clave | Qué hace |
|---|---|
| `HOST` | Dirección del backend. **Tiene que coincidir con `SERVER_PORT`** |
| `RETRY` | Reintentos automáticos ante error de red antes de mostrar el banner |
| `AUTH_MODE` | `bearer` o `cookie`. Trampa 2 de sección 4.2 |

Para producción:

```bash
npm run build      # artefactos en dist/
```

Sirva el contenido de `dist/` con cualquier servidor de estáticos. Dos condiciones:

1. **`FRONT_URL` del backend debe ser exactamente ese origen**, o CORS bloqueará las
   peticiones.
2. El servidor debe **redirigir las rutas desconocidas a `index.html`**. Es una SPA: si no
   lo hace, recargar la página en `/pages/book` devuelve un 404 del servidor web.

---

## 6. Carga inicial de datos

SIGBI arranca con la base vacía y **no trae datos de ejemplo**. Es correcto: la pantalla
vacía de cada tabla explica qué hacer.

Para cargar el juego canónico de AN050 sección 8 -6 categorías, 24 libros, 5 clientes y 3
reservas-, **use la propia aplicación o su API**, nunca `INSERT` directos. Dos motivos:

1. Los datos pasan por las mismas validaciones que los reales; un `INSERT` a mano puede
   meter un ISBN duplicado que el sistema nunca habría aceptado.
2. La carga sirve de verificación de que el despliegue funciona de punta a punta.

Orden obligatorio, porque hay claves foráneas de por medio:

```
1. categorías   ->  2. libros        (cada libro necesita su categoría)
3. clientes     ->  4. reservas      (cada reserva necesita cliente y libros)
```

Ejemplo por API:

```bash
curl -X POST http://localhost:8080/v1/categories \
     -H 'Content-Type: application/json' \
     -d '{"name":"Narrativa","description":"Novela, cuento y relato","status":true}'
```

> Si la autenticación está activa, añada `-H "Authorization: Bearer <token>"` a cada
> llamada.

---

## 7. Verificación posterior a la instalación

Ocho comprobaciones. Si las ocho pasan, la instalación está bien.

| # | Comprobación | Resultado esperado |
|---|---|---|
| 1 | `\dt` sobre la base `sigbi` | Las cinco tablas de dominio existen |
| 2 | `curl -i http://localhost:8080/v1/books` | `200` (o `401` si la autenticación está activa) |
| 3 | Abrir `http://localhost:4200` | Carga la aplicación, no una página en blanco |
| 4 | Pulsar un destino del menú | La tabla carga; **no** aparece la franja roja de error |
| 5 | Crear una categoría desde la interfaz | Se guarda y aparece en la tabla |
| 6 | Crear un libro con esa categoría | Se guarda; la categoría aparece en el desplegable |
| 7 | Registrar una reserva de dos libros | Se guarda y aparece en el listado con sus dos títulos |
| 8 | Preguntar algo al asistente | Responde en español, o avisa de que no está configurado |

**Si la comprobación 4 falla con la franja roja**, el frontend no está hablando con el
backend. Por orden de probabilidad: `SERVER_PORT`, `HOST` de `environment`, `FRONT_URL`
(CORS) o `AUTH_MODE` desalineado. Son las tres trampas de sección 4.2 en el mismo síntoma.

**Si la 7 falla y la 6 pasa**, el problema está en el servicio de reserva, no en la
instalación.

El recorrido completo de aceptación, con sus casos de rechazo, está en
[`AN120-guía-de-prueba-de-aceptación.md`](AN120-guía-de-prueba-de-aceptación.md).

---

## 8. Actualización de versiones

```bash
git pull
cd backend  && ./mvnw -DskipTests compile && ./mvnw spring-boot:run
cd frontend && npm install && npm start
```

`npm install` no es opcional: una versión nueva puede traer dependencias nuevas.

### 8.1 Si el modelo de datos cambió

`ddl-auto: update` **añade** tablas y columnas, pero **no borra ni renombra** (TD-08). Al
renombrar un campo, la columna antigua se queda huérfana:

- **En desarrollo:** lo limpio es recrear la base (`DROP DATABASE sigbi; CREATE DATABASE
  sigbi;`) y volver a cargar los datos por API.
- **Con datos que importan:** elimine la columna huérfana a mano, después de comprobar que
  nada la usa. Haga copia de seguridad antes.

No hay Flyway ni Liquibase, y es una decisión consciente (DEC-03 de AN040): el alcance no
exige versionado de esquema. El coste es este párrafo.

---

## 9. Qué no hace esta instalación

Para que nadie lo busque:

| No incluye | Nota |
|---|---|
| **Copias de seguridad** | Ninguna tarea programada respalda la base. Si los datos importan, configure el respaldo de PostgreSQL por su cuenta |
| **Proceso en segundo plano** | SIGBI no tiene ninguno: ni tarea diaria, ni cola, ni planificador. Las reservas no caducan solas porque no hay nada que las caduque |
| **Alta disponibilidad** | Una instancia de cada pieza. Sin balanceador ni réplica |
| **HTTPS** | La configuración de certificados es del servidor web o del proveedor. En producción, además, `AUTH_COOKIE_SECURE=true` |
| **Monitorización** | Los registros van a la salida estándar (`@Slf4j`). Sin métricas ni alertas |
| **Usuarios de la aplicación** | Las cuentas se gestionan en Supabase Auth, no en SIGBI. El backend no guarda contraseñas |
| **Datos de ejemplo** | La base arranca vacía. Ver sección 6 |
| **Migración desde otro sistema** | No hay importador. No existe un sistema anterior (AN010 sección 9) |

---

## 10. Publicar en internet

Tres piezas, tres sitios. La base de datos ya está en Supabase, así que solo hay que colocar
las otras dos:

```
Navegador  ->  Vercel            ->  Render                  ->  Supabase
               frontend Angular      backend Spring Boot         PostgreSQL
               estático              contenedor Docker           ya existente
```

**Vercel no ejecuta Java**, y por eso el backend no puede vivir ahí: solo sirve ficheros
estáticos y funciones de JavaScript. De ahí la separación.

### 10.1 El orden importa

Cada pieza necesita la URL de la otra, así que hay una vuelta:

1. **Backend en Render**, con `FRONT_URL` provisional.
2. **Frontend en Vercel**, ya apuntando al backend.
3. **Corregir `FRONT_URL`** en Render con la URL real de Vercel. Render vuelve a desplegar
   solo. Sin este paso el navegador bloquea todas las llamadas por CORS y la aplicación
   aparece vacía sin decir por qué.

### 10.2 Backend en Render

Servicio de tipo **Web Service**, conectado al repositorio de GitHub:

| Ajuste | Valor |
|---|---|
| Runtime | **Docker** |
| Dockerfile Path | `backend/Dockerfile` |
| Docker Build Context Directory | `backend` |
| Health Check Path | `/v1/books` |

El `Dockerfile` compila con JDK 25 y ejecuta con JRE 25. Se usa Docker y no la detección
automática porque Java 25 y Spring Boot 4.1 son recientes y los *buildpacks* de la
plataforma todavía no los reconocen.

Variables de entorno del servicio -las mismas de sección 4.1, con estos valores-:

| Variable | Valor |
|---|---|
| `DB_URL` | El de Supabase, con **Session Pooler**: `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres` |
| `DB_USERNAME`, `DB_PASSWORD` | Los del pooler |
| `FRONT_URL` | La URL de Vercel, **sin barra final** |
| `SUPABASE_ISSUER_URI`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Del panel de Supabase |
| `AUTH_ENABLED` | `true` |
| `AUTH_MODE` | `bearer` |
| `OPENAI_API_KEY` | Si se deja vacía, el asistente responde que no está disponible y el resto funciona |

**No hay que fijar `PORT`**: lo inyecta Render y `application.yaml` lo lee antes que
`SERVER_PORT`.

### 10.3 Frontend en Vercel

Se importa el mismo repositorio y se marca `frontend` como **Root Directory**. El resto lo
lee Vercel de `frontend/vercel.json`: compila con `npm run build` y publica
`dist/sigbi-frontend/browser`.

Antes de desplegar hay que poner la URL del backend en
`frontend/src/environments/environment.ts`, en `HOST`, sin barra final. No es una variable
de entorno: Angular resuelve ese fichero al compilar.

### 10.4 El acceso, con seguridad activada

La demostración publicada **pide credenciales**, así que hace falta un usuario de prueba:

1. En Supabase, *Authentication -> Users -> Add user*, con correo y contraseña.
2. La misma pareja se publica en el `README.md` del repositorio: sin ella, quien evalúe
   abre el enlace y no pasa de la pantalla de acceso.
3. `AUTH_ENABLED` tiene que decir lo mismo en las dos piezas -`true` en Render y `true` en
   `environment.ts`-, y `AUTH_MODE` igual en ambas. Si no coinciden, todo responde 401
   después de un acceso correcto.

### 10.5 Monorepo: que cada plataforma mire solo lo suyo

Las dos piezas viven en el mismo repositorio y las dos plataformas lo aceptan sin
artificios: cada una apunta a su carpeta -Vercel con *Root Directory* `frontend`, Render
con el `Dockerfile` de `backend/`- y ninguna ve la otra.

Lo que sí conviene ajustar es **cuándo se despliega**. Por defecto, cualquier `push`
dispara las dos compilaciones, así que cambiar una coma de un documento recompila el
backend entero. Cada plataforma tiene su filtro:

| Plataforma | Dónde | Qué poner |
|---|---|---|
| Render | *Settings -> Build Filters -> Included Paths* | `backend/**` |
| Vercel | *Settings -> Git -> Ignored Build Step* | `git diff --quiet HEAD^ HEAD -- ./` |

El comando de Vercel se ejecuta con la carpeta raíz del proyecto ya situada en `frontend`,
así que con ese `./` compila solo si algo cambió dentro del frontend. Devuelve código 0
-"no hay cambios"- y Vercel cancela el despliegue.

No es imprescindible para entregar; sí lo es si vas a estar tocando documentación a
menudo, porque en el plan gratuito de Render cada compilación cuesta minutos.

### 10.6 Lo que hay que avisar

El plan gratuito de Render **duerme el servicio a los 15 minutos sin tráfico**. La primera
llamada después lo despierta y tarda cerca de un minuto: la pantalla se queda cargando y
parece rota. Conviene decirlo en el README y, si va a haber una defensa en directo, abrir
la aplicación unos minutos antes.

---

## Referencias

- `README.md` - versión breve de este procedimiento.
- `backend/src/main/resources/application.yaml` - marcadores de configuración.
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - topología (sección 1) y operación (sección 8).
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - requisitos TC-01 a TC-09 y variables (sección 4.1).
- [`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md) - tablas que debe ver tras el primer arranque.
- [`AN120-guía-de-prueba-de-aceptación.md`](AN120-guía-de-prueba-de-aceptación.md) - verificación funcional completa.
- [`AN130-acta-de-puesta-en-operación.md`](AN130-acta-de-puesta-en-operación.md) - acta a cumplimentar tras el pase.
