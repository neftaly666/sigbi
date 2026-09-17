# REQUERIMIENTOS TÉCNICOS (TRD)

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN040` - N.º AN-2026-004

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN040 |
| Versión | 1.0 |
| Fecha | 2026-09-11 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-11 | D. Quispe | Versión inicial. Stack verificado contra `pom.xml` y `package.json`. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

Los identificadores **TW / TB / TD / TC** referencian, respectivamente, requisitos de web,
backend, datos y despliegue.

**Cómo leer las versiones.** La sección 0 lista lo **instalado y verificado** en el
repositorio el 2026-09-11, comprobado contra `backend/pom.xml`, `frontend/package.json` y
`backend/src/main/resources/application.yaml`. Lo que todavía no está instalado se marca
como *previsto*.

---

## 0. Stack tecnológico

### 0.1 Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| Angular (standalone) | 22.0 | SPA; rutas de `/pages` con carga perezosa |
| Angular Material | 22.0 | Biblioteca de componentes y sistema de temas |
| Angular CDK | 22.0 | Overlays, portales y utilidades de accesibilidad |
| RxJS | 7.8 | Interoperación con `HttpClient`; el estado va con signals |
| TypeScript | según Angular 22 | Lenguaje |
| chart.js | 4.5 | Gráficos del panel |
| date-fns | 4.4 | Formato y cálculo de fechas |
| marked | 18.0 | Render del Markdown que devuelve el asistente |
| ng2-pdf-viewer | 10.4 | Visor de PDF (solo si se usa RAG) |

Estado del árbol: `pages/` conserva las pantallas de MediApp (`medic`, `patient`,
`specialty`, `exam`, `consult-wizard`, `search`, `report`, `drug-rag`). Las pantallas de
SIGBI están diseñadas en Figma y **pendientes de construcción**.

### 0.2 Backend

| Tecnología | Versión | Rol |
|---|---|---|
| Java | 25 | Lenguaje |
| Spring Boot | 4.1.0 | Plataforma; arranque y autoconfiguración |
| Maven (wrapper) | `./mvnw` | Construcción; sin instalación global |
| `spring-boot-starter-webmvc` | 4.1.0 | API REST |
| `spring-boot-starter-data-jpa` | 4.1.0 | Persistencia (Hibernate) |
| `spring-boot-starter-validation` | 4.1.0 | Jakarta Validation |
| `spring-boot-starter-security-oauth2-resource-server` | 4.1.0 | Validación de JWT |
| `spring-hateoas` | - | Enlaces en respuestas puntuales |
| ModelMapper | 3.2.6 | Mapeo entidad <-> DTO |
| Lombok | - | Reducción de código repetitivo |
| JasperReports | 6.20.0 | Reportes **(heredado; se retira, fuera de alcance)** |
| `jackson-dataformat-xml` | - | Negociación de contenido XML **(heredado)** |

### 0.3 Inteligencia artificial

| Tecnología | Rol |
|---|---|
| Spring AI (BOM 2.0) | Integración con el modelo |
| `spring-ai-starter-model-openai` | Chat y embeddings. Modelo `gpt-4o-mini` |
| `spring-ai-starter-vector-store-pgvector` | Almacén vectorial. HNSW, `cosine_distance`, 1536 dimensiones |
| `spring-ai-pdf-document-reader` | Ingesta de PDF para RAG |
| `spring-ai-starter-model-chat-memory-repository-jdbc` | Memoria conversacional en `spring_ai_chat_memory` |
| `spring-ai-starter-mcp-client` | Cliente MCP. **Deshabilitado** (`spring.ai.mcp.client.enabled: false`) |

### 0.4 Datos

| Tecnología | Versión | Rol |
|---|---|---|
| PostgreSQL | 15+ | Motor de `sigbi`, local o en Supabase |
| Driver JDBC | `org.postgresql.Driver` | Conexión |
| pgvector | extensión `vector` | Almacén de embeddings (solo RAG) |
| Hibernate | el de Spring Boot 4.1 | ORM; genera el esquema con `ddl-auto: update` |

Sin herramienta de migraciones. La decisión y sus consecuencias están en DEC-03.

### 0.5 Servicios externos

| Servicio | Rol | Obligatorio |
|---|---|---|
| OpenAI | Modelo de chat y embeddings | Solo para las funciones de IA |
| Supabase - Auth | Emisión y validación de JWT | No (seguridad opcional) |
| Supabase - Storage | Bucket público de imágenes | No |
| Supabase - PostgreSQL | Base gestionada | No (alternativa a local) |

### 0.6 Herramientas

Git en monorepo, `./mvnw`, npm + Angular CLI, PostgreSQL local o proyecto de Supabase.
El JDK 25 y Node 20+ son los únicos requisitos previos de máquina.

---

## 1. Requerimientos técnicos web (TW)

| ID | Requerimiento |
|---|---|
| TW-01 | Angular 22 standalone. Sin NgModules en código nuevo. |
| TW-02 | Todas las rutas bajo `/pages` se cargan de forma perezosa desde `pages.routes.ts`. |
| TW-03 | Ningún componente inyecta `HttpClient`. El acceso HTTP pasa por un servicio que extiende `GenericService<T>`. |
| TW-04 | El estado de pantalla vive en un store con signals que expone `$datos`, `$loading`, `$error` y `reload()`. |
| TW-05 | Los formularios son reactivos y su definición vive en `forms/<recurso>.form.ts`, separada del componente. |
| TW-06 | Las interfaces de `model/` son espejo exacto del DTO del backend; ningún campo inventado en el cliente. |
| TW-07 | La URL del backend y el modo de autenticación se leen de `environments/`, nunca literales en el código. |
| TW-08 | Los errores HTTP se tratan en `server-error.interceptor.ts`; ningún componente hace `catchError` por su cuenta salvo para un caso propio. |
| TW-09 | El tema se define con `mat.theme()` y tokens `--mat-sys-*`; sin colores literales en los CSS de componente. |
| TW-10 | Todo texto visible al usuario está en español. |
| TW-11 | La interfaz responde correctamente a 390 px de ancho; las tablas del catálogo no desbordan. |

---

## 2. Requerimientos técnicos backend (TB)

| ID | Requerimiento |
|---|---|
| TB-01 | Cadena de dependencias `controller -> service -> repo -> model`. Un controlador nunca inyecta un repositorio. |
| TB-02 | Toda entidad de dominio reutiliza `ICRUD` / `CRUDImpl` / `IGenericRepo`. No se reimplementa el CRUD. |
| TB-03 | La clave primaria se llama `id` + nombre simple de la clase (`idBook`). Lo exige `CRUDImpl.update()` por reflexión. |
| TB-04 | Los endpoints siguen `/v1/<recurso-en-plural>` y devuelven `ResponseEntity`. |
| TB-05 | Las entidades JPA no se exponen. Entrada y salida son DTOs, mapeados con ModelMapper. |
| TB-06 | Los DTOs de entrada se validan con Jakarta Validation y `@Valid` en el controlador. |
| TB-07 | Las excepciones se manejan globalmente en `ResponseExceptionHandler` (`@RestControllerAdvice`). Ninguna traza llega al cliente. |
| TB-08 | Inyección por constructor mediante `@RequiredArgsConstructor`. Sin `@Autowired` en campos. |
| TB-09 | La operación de reserva (cabecera + detalles) es transaccional: o se graba entera o no se graba. |
| TB-10 | Los mensajes al usuario se resuelven por `messages*.properties`. `messages.properties` es el locale por defecto y está en español. |
| TB-11 | Los identificadores (clases, métodos, tablas, columnas, endpoints) están en inglés. |
| TB-12 | Ningún secreto literal en el código ni en `application.yaml`; todo por `${VARIABLE}`. |
| TB-13 | Registro con `@Slf4j`. Ningún dato personal ni token en el log. |
| TB-14 | El proyecto compila con `./mvnw -DskipTests compile` sin advertencias nuevas. |

---

## 3. Requerimientos técnicos de datos (TD)

| ID | Requerimiento |
|---|---|
| TD-01 | Cumplimiento del estándar EST010: PK `Integer id<Clase>` con `IDENTITY`, FK `id_<padre>`, `nullable` y `length` siempre explícitos. |
| TD-02 | El esquema se genera desde las entidades JPA. No se crean ni alteran tablas a mano. |
| TD-03 | Las restricciones de clave foránea se nombran `FK_<TABLA_HIJA>_<TABLA_PADRE>` en mayúsculas. |
| TD-04 | El ISBN del libro es único a nivel de base, no solo de validación en el servicio. |
| TD-05 | La relación cabecera-detalle usa `cascade = CascadeType.ALL` para persistir en un solo `save()`. |
| TD-06 | `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con `Include` solo en la PK, para no recorrer relaciones perezosas. |
| TD-07 | La extensión `vector` solo se exige si se usan las funciones de RAG. |
| TD-08 | Al renombrar un campo se elimina manualmente la columna huérfana: `ddl-auto: update` no borra ni renombra. |

---

## 4. Requerimientos de despliegue (TC)

| ID | Requerimiento |
|---|---|
| TC-01 | Topología de tres piezas: SPA estática, JAR ejecutable y PostgreSQL. Sin servidor de aplicaciones externo. |
| TC-02 | Backend empaquetado como JAR ejecutable con `./mvnw package`; arranca con `java -jar`. |
| TC-03 | Frontend construido con `npm run build`; los artefactos de `dist/` se sirven como estáticos. |
| TC-04 | Toda la configuración entra por variable de entorno. Ninguna ruta absoluta ni valor de máquina en el repositorio. |
| TC-05 | `SERVER_PORT` debe exportarse como `8080`: el valor por defecto del YAML es `80` y el frontend espera `8080`. |
| TC-06 | `FRONT_URL` define el único origen permitido por CORS. |
| TC-07 | `AUTH_MODE` del frontend y `app.auth.mode` del backend deben coincidir; si no, todas las peticiones responden 401. |
| TC-08 | En producción, `AUTH_COOKIE_SECURE=true` y HTTPS. `SameSite=None` solo si el frontend vive en otro dominio. |
| TC-09 | La base se crea vacía (`CREATE DATABASE sigbi`); el esquema lo levanta Hibernate en el primer arranque. |

### 4.1 Variables de entorno

| Variable | Obligatoria | Por defecto | Descripción |
|---|---|---|---|
| `DB_URL` | Sí | - | `jdbc:postgresql://localhost:5432/sigbi` |
| `DB_USERNAME` | Sí | - | Usuario de PostgreSQL |
| `DB_PASSWORD` | Sí | - | Contraseña de PostgreSQL |
| `FRONT_URL` | Sí | - | Origen permitido por CORS |
| `SERVER_PORT` | No | `80` | **Usar `8080`** |
| `OPENAI_API_KEY` | Solo IA | - | Clave de OpenAI |
| `SUPABASE_ISSUER_URI` | Solo auth | - | `https://<proyecto>.supabase.co/auth/v1` |
| `SUPABASE_URL` | Solo auth | - | URL del proyecto |
| `SUPABASE_ANON_KEY` | Solo auth | - | Clave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo auth | - | Clave de servicio. **Nunca al repositorio** |
| `AUTH_MODE` | No | `bearer` | `bearer` o `cookie` |
| `AUTH_COOKIE_SECURE` | No | `false` | `true` en producción |
| `AUTH_COOKIE_SAME_SITE` | No | `Lax` | `None` si el frontend está en otro dominio |
| `SUPABASE_BUCKET` | No | `photos` | Bucket de Storage |
| `SUPABASE_MAX_PHOTO_SIZE` | No | `2097152` | Tamaño máximo de imagen (2 MB) |

---

## 5. API interna

| Aspecto | Definición |
|---|---|
| Estilo | REST sobre HTTP(S), `/v1/<recurso-en-plural>` |
| Formato | JSON. `multipart/form-data` solo cuando viaja un archivo |
| Autenticación | JWT de Supabase, por cabecera `Authorization: Bearer` o por cookie, según `AUTH_MODE` |
| Paginación | `Pageable` de Spring Data, configurado en `PageableConfig` |
| Idioma de los mensajes | Resuelto por `Accept-Language`; por defecto español |

### 5.1 Códigos de respuesta

| Código | Cuándo |
|---|---|
| `200 OK` | Consulta o actualización correcta |
| `201 Created` | Alta correcta. Incluye cabecera `Location` |
| `204 No Content` | Baja correcta |
| `400 Bad Request` | Validación fallida. Detalle por campo |
| `401 Unauthorized` | Token ausente, inválido o caducado |
| `403 Forbidden` | Token válido sin permiso |
| `404 Not Found` | `ModelNotFoundException` |
| `415 Unsupported Media Type` | Tipo de contenido no admitido |
| `500 Internal Server Error` | Error no controlado. Cuerpo genérico, traza solo al log |

### 5.2 Recursos previstos

| Recurso | Verbos | Notas |
|---|---|---|
| `/v1/categories` | GET, GET/{id}, POST, PUT/{id}, DELETE/{id} | CRUD genérico |
| `/v1/books` | GET, GET/{id}, POST, PUT/{id}, DELETE/{id} | CRUD genérico; ISBN único |
| `/v1/clients` | GET, GET/{id}, POST, PUT/{id}, DELETE/{id} | CRUD genérico |
| `/v1/reservations` | GET, GET/{id}, POST, DELETE/{id} | POST con detalles anidados |
| `/v1/reservations/client/{id}` | GET | Reservas de un cliente (RF-11) |
| `/v1/agents` | POST | Asistente conversacional |

---

## 6. Registro de decisiones técnicas

| ID | Decisión | Justificación |
|---|---|---|
| DEC-01 | Transformar MediApp en vez de crear un proyecto nuevo | La infraestructura genérica ya está resuelta; rehacerla no aporta valor evaluable. |
| DEC-02 | Lógica de negocio en Java, nunca en la base | Reglas testeables y una sola fuente de verdad. Sin procedimientos almacenados. |
| DEC-03 | Sin herramienta de migraciones; `ddl-auto: update` | El alcance no exige versionado de esquema. **Coste aceptado:** no borra ni renombra columnas; el desarrollador limpia a mano. |
| DEC-04 | ModelMapper para entidad <-> DTO | Ya integrado y configurado en `MapperConfig`; evita mapeadores a mano. |
| DEC-05 | Estado del frontend con signals y `httpResource`, sin librería de estado | Es el patrón del código más reciente del repositorio; añadir NgRx sería infraestructura sin uso. |
| DEC-06 | Supabase Auth en vez de autenticación propia | Ya integrada. La seguridad es opcional en el enunciado y no debe consumir esfuerzo del núcleo. |
| DEC-07 | `Integer` como tipo de toda clave primaria | Lo impone `CRUDImpl.update()`, que resuelve el setter con `id.getClass()`. |
| DEC-08 | Monorepo | Un único enlace de entrega y cambios de contrato atómicos entre las dos piezas. |
| DEC-09 | Retirar JasperReports y el dominio médico al cerrar la migración | Fuera de alcance; su presencia solo añade peso y ruido al repositorio evaluado. |
| DEC-10 | Cliente MCP deshabilitado | No hay requisito que lo use; activarlo exigiría configurar servidores externos. |

---

## 7. Seguridad (resumen ejecutable)

- Identidad delegada en Supabase Auth: **el backend no almacena contraseñas**.
- JWT validado por Spring Security como OAuth2 Resource Server; `issuer-uri` obligatorio,
  y las claves públicas se descargan del emisor. Firma, emisor y expiración se verifican
  siempre.
- Dos modos de transporte de token (`bearer` / `cookie`) fijados por configuración, no por
  código.
- CORS restringido a un único origen (`app.front.url`).
- Consultas parametrizadas por JPA; sin concatenación de SQL.
- Ningún secreto versionado: `.gitignore` cubre `.env*`, `*.pem`, `*.key` y los perfiles
  locales.
- Los fallos de autenticación devuelven JSON (`RestAuthenticationEntryPoint`), nunca una
  redirección a formulario de login.
- Datos personales y tokens fuera de los logs.

Detalle del esquema y las reglas de persistencia en
[`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md) y
[`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md).
