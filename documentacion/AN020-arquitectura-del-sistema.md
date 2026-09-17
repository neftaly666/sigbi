# ARQUITECTURA DEL SISTEMA

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN020` - N.º AN-2026-002

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN020 |
| Versión | 1.0 |
| Fecha | 2026-09-11 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Repositorio | Público, pendiente de publicación (requisito de entrega sección 8) |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-11 | D. Quispe | Versión inicial. Arquitectura de SIGBI sobre la base heredada de MediApp. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

**Cómo leer los estados.** Cada componente lleva una marca explícita:

- **(heredado)** - existe en el repositorio, viene de MediApp y se conserva tal cual.
- **(por construir)** - está diseñado y especificado, pero todavía no hay código.
- **(por retirar)** - código de MediApp que sale del repositorio al cerrar la migración.

Verificado contra el árbol del repositorio y `pom.xml` / `package.json` el 2026-09-11.

> **Al 2026-09-17 no queda nada "por construir" ni "por retirar".** Las marcas se conservan
> porque documentan de dónde viene cada pieza, pero el dominio de biblioteca está
> implementado de punta a punta y MediApp salió del repositorio: 86 ficheros del frontend
> y 58 del backend. El paquete raíz es `com.sigbi` (D-01 de la sección 12).

---

## 1. Visión general

SIGBI es una aplicación full stack de dos piezas desplegables y una base de datos:

```
+----------------------+        JSON / HTTPS        +----------------------+
|  Frontend (SPA)      | -------------------------> |  Backend (API REST)  |
|  Angular 22          | <------------------------- |  Spring Boot 4.1     |
|  :4200               |        /v1/<recurso>       |  :8080               |
+----------------------+                            +----------+-----------+
                                                               | JDBC
                                                    +----------v-----------+
                                                    |  PostgreSQL 15+      |
                                                    |  (local o Supabase)  |
                                                    |  + extensión vector  |
                                                    +----------------------+
                                                               ^
                                                               | HTTPS
                                                    +----------+-----------+
                                                    |  OpenAI (Spring AI)  |
                                                    |  chat + embeddings   |
                                                    +----------------------+
```

No hay capa intermedia, ni broker, ni proceso en segundo plano. Toda la lógica de negocio
vive en el backend; el frontend no calcula reglas, solo las presenta y las respeta.

**Decisión de partida.** SIGBI no se construye desde cero: se construye **transformando
MediApp**, el proyecto médico del curso. La infraestructura genérica (CRUD, manejo de
errores, seguridad, IA) se reutiliza tal cual; lo que cambia es el dominio. Esa decisión
está tomada y explica la forma del repositorio: lo que se ve de médico es sedimento en
retirada, no arquitectura.

---

## 2. Estructura del repositorio

Monorepo. Una sola raíz con las dos piezas y la documentación:

```
sigbi/
+-- backend/              API REST Spring Boot (Maven)
|   +-- src/main/java/com/sigbi/
|   +-- src/main/resources/
|   +-- .agents/          Specs y agentes de IA (requisito sección 6)
+-- frontend/             SPA Angular
|   +-- src/app/
+-- documentacion/        Esta línea documental AN/EST + diseño
|   +-- AN0xx-*.md, EST0xx-*.md
|   +-- diseño/           Figma: fileKey, plugin regenerador, renders
|   +-- evaluación-final/ Enunciado del curso
+-- CLAUDE.md             Convenciones que siguen los agentes
+-- README.md             Puesta en marcha
```

El enunciado admite multirepo; se eligió monorepo porque la entrega es un único enlace y
porque backend y frontend se versionan juntos (un cambio de contrato toca los dos lados en
el mismo commit).

**Resuelto el 2026-09-15:** el paquete Java es `com.sigbi` y el `artifactId` del POM,
`sigbi-backend`. Se conservaron los heredados durante la migración para no romper imports
en masa y se renombraron al cerrarla, como estaba previsto (sección 12, D-01).

---

## 3. Backend

Arquitectura en capas, una sola unidad desplegable:

```
controller -> service (interfaz) -> service/impl -> repo -> PostgreSQL
     |                                  |
     +---- dto <-- ModelMapper --> model +
```

| Paquete | Responsabilidad |
|---|---|
| `controller` | Endpoints REST. Valida con `@Valid`, mapea DTO<->entidad, devuelve `ResponseEntity`. Sin reglas de negocio. |
| `service` | Interfaces de caso de uso. `ICRUD<T, ID>` declara el contrato CRUD común. |
| `service/impl` | Implementaciones. `CRUDImpl<T, ID>` **(heredado)** resuelve save/update/findAll/findById/delete para toda entidad. |
| `repo` | Interfaces Spring Data. `IGenericRepo<T, ID>` **(heredado)** extiende `JpaRepository` y es `@NoRepositoryBean`. |
| `model` | Entidades JPA. Fuente de verdad del esquema. |
| `dto` | Contrato de entrada y salida. Las entidades nunca se exponen. |
| `exception` | `ResponseExceptionHandler` **(heredado)**: control global con `@RestControllerAdvice`. |
| `security` | Integración con Supabase Auth: OAuth2 Resource Server, resolución de token por cabecera o cookie. |
| `config` | `MapperConfig` (ModelMapper), `MessageConfig` (i18n), `PageableConfig`, `AgentConfig` (Spring AI). |
| `tool` | Herramientas que el agente de IA puede invocar (`@Tool` de Spring AI). |
| `util` | CORS, cargador de prompts, registro de clientes MCP. |

### 3.1 La porción vertical

Añadir una entidad de dominio cuesta seis archivos y ninguna abstracción nueva:

```
model/Book.java              @Entity
repo/IBookRepo.java          extends IGenericRepo<Book, Integer>
service/IBookService.java    extends ICRUD<Book, Integer>
service/impl/BookServiceImpl.java   extends CRUDImpl<Book, Integer>
dto/BookDTO.java             record o clase con Jakarta Validation
controller/BookController.java      @RequestMapping("/v1/books")
```

`BookServiceImpl` solo implementa `getRepo()`. El CRUD completo lo hereda. Las reglas de
negocio propias (por ejemplo, marcar libros como no disponibles al reservar) se añaden
como métodos adicionales de la interfaz de servicio, no dentro de `CRUDImpl`.

Detalle normativo en [`EST020-estándar-de-backend-java.md`](EST020-estándar-de-backend-java.md).

### 3.2 Restricción de `CRUDImpl` que condiciona el modelo

`CRUDImpl.update()` localiza el setter de la clave primaria **por reflexión**:

```java
String methodName = "setId" + entity.getClass().getSimpleName();
Method setIdMethod = entity.getClass().getMethod(methodName, id.getClass());
```

Por eso la PK de `Book` debe llamarse `idBook` y no `id`. No es una preferencia de estilo:
si el nombre no coincide, cualquier `PUT` falla en ejecución con `NoSuchMethodException` y
el compilador no lo detecta. Regla completa en
[`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md), sección 3.

### 3.3 Módulo de IA (heredado, se readapta)

Tres capacidades ya instaladas sobre Spring AI 2.0, que en SIGBI cambian de dominio:

| Capacidad | Hoy (MediApp) | En SIGBI |
|---|---|---|
| Agente conversacional con herramientas | `AgentController`, `tool/MedicTool`, `ConsultTool`, `ExamTool` | `AssistantController` + herramientas de catálogo y reservas |
| RAG sobre PDF | `RAGController`, pgvector, lector de PDF | Consulta sobre fichas o catálogo bibliográfico |
| Memoria conversacional | `spring_ai_chat_memory` (JDBC) | Igual, sin cambios |
| Cliente MCP | `MCPController`, deshabilitado (`spring.ai.mcp.client.enabled: false`) | Se mantiene deshabilitado |

El agente es lo que hace "inteligente" a SIGBI y cubre el requisito sección 6 del enunciado
(specs y agentes de IA), junto con los artefactos de `backend/.agents/`.

---

## 4. Frontend

SPA Angular 22, standalone, sin NgModules. Rutas perezosas bajo un layout común.

```
app.routes.ts
+-- /login                    LoginComponent
+-- /pages                    LayoutComponent  (shell: cabecera + menú lateral)
    +-- pages.routes.ts       carga perezosa de cada página
```

### 4.1 Patrón componente + store

Es el patrón del código más reciente y el que se aplica a todo lo nuevo:

| Pieza | Rol |
|---|---|
| `services/generic.service.ts` | `GenericService<T>` **(heredado)**: `findAll`, `findById`, `save`, `update`, `delete` sobre una `url` abstracta. |
| `services/<x>.service.ts` | Extiende `GenericService<T>` y fija la URL (`${environment.HOST}/v1/books`). |
| `store/<x>.store.ts` | Estado con signals. Usa `httpResource` y expone `$datos`, `$loading`, `$error` y `reload()`. |
| `pages/<x>/` | Componente de presentación. Inyecta el store, no habla con `HttpClient`. |
| `forms/<x>.form.ts` | Definición del formulario reactivo, separada del componente. |
| `model/<x>.ts` | Interfaz TypeScript espejo del DTO del backend. |

Ejemplo real del repositorio (`specialty.store.ts`), que es la plantilla a copiar:

```ts
readonly specialtiesResource = httpResource<Specialty[]>(
    () => this.specialtyService.resourceUrl, { defaultValue: [] });

readonly $specialties = this.specialtiesResource.value;
readonly $loading     = this.specialtiesResource.isLoading;
readonly $error       = this.specialtiesResource.error;
```

### 4.2 Transversales

| Pieza | Función |
|---|---|
| `interceptor/bearer-token.interceptor.ts` | Añade `Authorization: Bearer` cuando `AUTH_MODE` es `bearer`. |
| `interceptor/credentials.interceptor.ts` | Envía la cookie de sesión cuando `AUTH_MODE` es `cookie`. |
| `interceptor/server-error.interceptor.ts` | Reintentos (`environment.RETRY`) y traducción del error a mensaje de usuario. |
| `guard/cert.guard.ts` | Protege las rutas de `/pages`. |
| `pages/not-403`, `not-404` | Páginas de error, ya en español. |

### 4.3 Pantallas de SIGBI

Diseñadas en Figma, con un artboard por componente:

| Ruta | Componente | Consume |
|---|---|---|
| `/pages/dashboard` | `DashboardComponent` | agregados de catálogo y reservas |
| `/pages/book` | `BookComponent` + `BookDialogComponent` | `/v1/books` |
| `/pages/client` | `ClientComponent` | `/v1/clients` |
| `/pages/category` | `CategoryComponent` | `/v1/categories` |
| `/pages/reservation` | `ReservationComponent` | `/v1/reservations` |
| `/pages/reservation-wizard` | `ReservationWizardComponent` | `/v1/reservations` |
| `/pages/assistant` | `AssistantComponent` | `/v1/agents` |

Diseño y tokens: `documentacion/diseño/README.md` y el archivo de Figma
`8vTvBVU8gUcB4EiC91QEEf`.

**Por retirar:** `pages/medic`, `patient`, `specialty`, `exam`, `consult-wizard`, `search`,
`report`, `drug-rag` y sus stores, servicios, modelos y formularios asociados.

---

## 5. Base de datos

| Aspecto | Decisión |
|---|---|
| Motor | PostgreSQL 15+ (driver `org.postgresql.Driver`) |
| Hosting | Local o Supabase, indistinto |
| Generación del esquema | `spring.jpa.hibernate.ddl-auto: update` |
| Migraciones | Ninguna herramienta (no hay Flyway ni Liquibase) |
| Extensiones | `vector` (pgvector), solo para RAG |

**Consecuencia arquitectónica:** la fuente de verdad del esquema son las clases `@Entity`,
no un script SQL. Se cambia el modelo cambiando la entidad. `ddl-auto: update` añade, pero
no borra ni renombra: al renombrar un campo, la columna antigua queda huérfana y hay que
eliminarla a mano o recrear la base en desarrollo.

Cinco tablas de dominio (`category`, `book`, `client`, `reservation`,
`reservation_detail`) más las que crea Spring AI por su cuenta (`vector_store`,
`spring_ai_chat_memory`). Esquema completo en
[`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md).

---

## 6. Flujo funcional

El caso de uso que da sentido al sistema es el registro de una reserva. Es el único que
escribe en más de una tabla y el único con regla de negocio propia:

```
Bibliotecario
     |
     | 1. elige cliente
     v
ReservationWizardComponent -- 2. busca y selecciona 1..N libros disponibles
     |
     | 3. POST /v1/reservations  { idClient, reservationDate, details: [{ idBook }] }
     v
ReservationController -- @Valid --> IReservationService.save()
     |
     | 4. una sola transacción:
     |    - inserta reservation
     |    - inserta reservation_detail (cascade = ALL desde la cabecera)
     |    - marca book.available = false para cada libro
     v
201 Created + Location: /v1/reservations/{id}
```

Los CRUD de libro, cliente y categoría son el flujo trivial: listar, crear, editar,
eliminar, cada uno contra su recurso.

El alcance está deliberadamente cerrado: el enunciado excluye préstamos, devoluciones,
multas, pagos, inventario avanzado y notificaciones. No se diseñan "por si acaso".

---

## 7. Seguridad

| Aspecto | Implementación |
|---|---|
| Proveedor de identidad | Supabase Auth (externo). El backend no guarda contraseñas. |
| Validación de token | Spring Security OAuth2 Resource Server. `issuer-uri` apunta al proyecto de Supabase; Spring descarga las claves públicas y valida firma, emisor y expiración. |
| Transporte del token | Dos modos: `bearer` (cabecera `Authorization`) o `cookie`. Lo fija `app.auth.mode`. |
| CORS | Origen único permitido, `app.front.url`. |
| Secretos | Exclusivamente por variable de entorno. Nada de credenciales en `application.yaml` ni en el repositorio. |
| Errores de autenticación | `RestAuthenticationEntryPoint` devuelve JSON, nunca una redirección a formulario. |

**Trampa operativa documentada:** `AUTH_MODE` del frontend y `app.auth.mode` del backend
tienen que decir lo mismo. Si no coinciden, *todas* las peticiones responden 401 después
de un login correcto.

Spring Security es opcional según el enunciado (sección 4 y sección 7). Se conserva porque ya está
integrado y funcionando; si complicara la evaluación, se desactiva sin tocar el dominio.

---

## 8. Operación

| Aspecto | Valor |
|---|---|
| Ejecución backend | `./mvnw spring-boot:run` - `http://localhost:8080` |
| Ejecución frontend | `npm start` - `http://localhost:4200` |
| Build de producción | `./mvnw package` (JAR ejecutable) - `npm run build` (estáticos en `dist/`) |
| Configuración | Variables de entorno; ninguna ruta absoluta ni valor de máquina en el repositorio |
| Puerto por defecto | `SERVER_PORT` es `80` en el YAML; **hay que exportar `8080`**, que es el que espera el frontend |
| Logs | `slf4j` vía Lombok (`@Slf4j`). Sin datos sensibles en el log. |

No hay proceso programado, ni cola, ni tarea en segundo plano. El único componente externo
en tiempo de ejecución es OpenAI, y solo si se usan las funciones de IA.

---

## 9. Decisiones de arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| DA-01 | Transformar MediApp en lugar de partir de cero | La infraestructura genérica (CRUD, errores, seguridad, IA) ya está resuelta y probada; rehacerla no aporta nada evaluable. |
| DA-02 | Lógica de negocio en Java, no en la base | Una sola fuente de verdad y reglas testeables. Sin procedimientos almacenados. |
| DA-03 | Esquema generado desde entidades JPA | El enunciado no pide versionado de esquema; añadir Flyway sería infraestructura sin uso. |
| DA-04 | Monorepo | Un enlace de entrega y cambios de contrato atómicos entre las dos piezas. |
| DA-05 | Identificadores en inglés, interfaz en español | Es la convención del código base: `messages.properties` (locale por defecto) está en español y los componentes recientes también. |
| DA-06 | DTOs obligatorios, entidades nunca expuestas | Evita filtrar el modelo y las relaciones perezosas en la respuesta JSON. |
| DA-07 | Supabase Auth en vez de autenticación propia | Ya integrado; la seguridad es opcional en el enunciado y no debe consumir el presupuesto de esfuerzo. |

---

## 10. Deuda y avisos vigentes

| ID | Asunto | Estado |
|---|---|---|
| D-01 | Paquete `com.mitocode` y `artifactId: mediapp-backend` | **Cerrada el 2026-09-15.** Ahora `com.sigbi` y `sigbi-backend`. 83 ficheros, 210 referencias, compilación limpia. |
| D-02 | Dominio médico completo aún presente (`Medic`, `Patient`, `Consult`, `Exam`, `Specialty`) | **Cerrada el 2026-09-15.** 58 ficheros eliminados del backend; los endpoints médicos responden 404. |
| D-03 | `ConsultDetail` declara `idDetail`, incumpliendo la regla de la PK | **Cerrada el 2026-09-15** con D-02. La clase ya no existe. |
| D-04 | `backend/.agents/` está referenciado en `README.md` y `CLAUDE.md`, pero no existe | Abierto. Es requisito de entrega (sección 6): al menos una spec y un agente. |
| D-05 | Textos en inglés en las plantillas CRUD heredadas | Abierto. No se traducen: esas pantallas se retiran. |
| D-06 | Repositorio público sin publicar | Abierto. Requisito sección 8; cierra antes del 2026-09-30. |

---

## Referencias

- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - qué debe hacer el producto.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - stack y requisitos técnicos verificables.
- [`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md) - tablas, claves e integridad.
- [`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md) - convenciones de persistencia.
- [`EST020-estándar-de-backend-java.md`](EST020-estándar-de-backend-java.md) - convenciones de código del backend.
- `diseño/README.md` - diseño en Figma, tokens y contrastes.
