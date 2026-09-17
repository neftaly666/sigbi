# REQUERIMIENTOS DEL PRODUCTO (PRD)

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN030` - N.º AN-2026-003

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN030 |
| Versión | 1.1 |
| Fecha | 2026-09-15 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-11 | D. Quispe | Versión inicial. Requerimientos derivados del enunciado del trabajo final. |
| 1.1 | 2026-09-15 | D. Quispe | RF-14 pasa de prioridad A a B: el sección 6 del enunciado pide specs y agentes de desarrollo, no un asistente en el producto. Se corrige su origen y las menciones de sección 1.1 y sección 1.3. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

## 1. Visión general

### 1.1 Resumen del producto

SIGBI es una aplicación web para que una biblioteca registre su catálogo de libros, su
padrón de clientes y las reservas que estos hacen. Un bibliotecario entra, busca un libro,
elige un cliente y deja registrada la reserva de uno o varios títulos en una sola
operación. Incorpora además un asistente conversacional que responde sobre el catálogo y
las reservas sin navegar por los formularios - un añadido propio, no un requisito del
enunciado.

Es el trabajo final del curso Java AI Full Stack de MitoCode. El alcance lo fija el
enunciado; este documento lo traduce a requerimientos verificables.

### 1.2 Problema que resuelve

Una biblioteca pequeña que lleva el control en papel o en una hoja de cálculo tiene tres
problemas concretos:

1. **No sabe qué está reservado.** La disponibilidad de un título depende de que alguien
   recuerde anotarla.
2. **No puede clasificar.** Sin categorías, el catálogo solo se recorre en orden alfabético.
3. **No tiene historial por cliente.** Responder "¿qué tiene reservado esta persona?" exige
   revisar el registro entero.

SIGBI resuelve los tres con un modelo de datos mínimo y cuatro pantallas.

### 1.3 Alcance

**Dentro del alcance:**

- Mantenimiento (alta, consulta, edición, baja) de **categorías**.
- Mantenimiento de **libros**, clasificados por categoría.
- Mantenimiento de **clientes**.
- Registro de una **reserva** de uno o más libros para un cliente.
- Listado de reservas con fecha, cliente y libros reservados.
- Consulta de las reservas de un cliente concreto.
- **Asistente de IA** conversacional sobre el dominio (RF-14, prioridad B: añadido propio, no exigido).
- **Specs y agentes de IA** versionados en el repositorio.

**Fuera del alcance, por decisión explícita del enunciado:**

- Préstamos y devoluciones.
- Multas y pagos.
- Inventario avanzado (ejemplares múltiples, ubicación física, estado de conservación).
- Notificaciones (correo, SMS, avisos de vencimiento).
- Reservas con fecha de fin, caducidad o cola de espera.

Lo excluido no se diseña ni se deja "preparado". El modelo de datos es el mínimo que
sostiene lo de arriba.

### 1.4 Usuarios y stakeholders

| Actor | Descripción | Qué hace en el sistema |
|---|---|---|
| Bibliotecario | Usuario operativo. Único perfil funcional del alcance. | Todo: catálogo, clientes, reservas, consultas al asistente. |
| Administrador | Responsable de la instancia. | Configura variables de entorno, despliega, gestiona el acceso en Supabase. |
| Docente evaluador | Stakeholder de la entrega. | Clona el repositorio, lo ejecuta con el README y verifica los requisitos del enunciado. |

No hay perfiles diferenciados por permiso dentro de la aplicación: el enunciado no los
pide y añadirlos multiplicaría las pantallas sin aportar a la evaluación.

### 1.5 Contexto técnico

Resumen; el detalle verificable está en
[`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md).

| Capa | Tecnología |
|---|---|
| Backend | Spring Boot 4.1 - Java 25 - Maven |
| Frontend | Angular 22 - Angular Material 22 - signals |
| Base de datos | PostgreSQL 15+ (local o Supabase) |
| IA | Spring AI 2.0 - OpenAI - pgvector |
| Comunicación | REST sobre JSON, rutas `/v1/<recurso>` |

### 1.6 Glosario

| Término | Definición |
|---|---|
| **Categoría** | Clasificación temática a la que pertenece un libro. Un libro tiene exactamente una. |
| **Libro** | Título del catálogo, identificado por ISBN. Tiene un indicador de disponibilidad. |
| **Cliente** | Persona registrada que puede reservar. Identificada por su documento. |
| **Reserva** | Acto de apartar uno o más libros para un cliente en una fecha. |
| **Detalle de reserva** | Línea de una reserva; referencia exactamente un libro. |
| **Disponible** | Estado de un libro que no está comprometido por ninguna reserva vigente. |
| **Asistente** | Agente conversacional de IA con acceso de lectura al dominio. |
| **Spec** | Documento que describe una funcionalidad antes de implementarla, en `backend/.agents/features/`. |

---

## 2. Metas y objetivos

### 2.1 Metas de negocio

| ID | Meta |
|---|---|
| MN-01 | Que la biblioteca conozca en todo momento qué títulos están disponibles. |
| MN-02 | Que registrar una reserva de varios libros sea una sola operación, no varias anotaciones. |
| MN-03 | Que el catálogo sea navegable por categoría, no solo por título. |

### 2.2 Objetivos del producto

| ID | Objetivo | Verificación |
|---|---|---|
| OP-01 | CRUD completo y funcional de libro, cliente y categoría. | Las cuatro operaciones responden correctamente desde la interfaz. |
| OP-02 | Registro de una reserva con uno o más libros en una transacción. | Una reserva con tres libros deja una cabecera y tres detalles. |
| OP-03 | Listado de reservas mostrando fecha, cliente y libros. | La tabla de reservas muestra los tres datos sin navegación adicional. |
| OP-04 | Consulta de reservas por cliente. | Filtrar por un cliente devuelve solo sus reservas. |
| OP-05 | Validación de entrada en todos los servicios. | Un request inválido responde 400 con el detalle del campo. |
| OP-06 | Control global de excepciones. | Ningún error devuelve una traza de Java al cliente. |
| OP-07 | Al menos una spec y un agente de IA versionados. | Existen y son coherentes con el código implementado. |
| OP-08 | Repositorio público, ejecutable siguiendo solo el README. | Un tercero lo levanta sin preguntar nada. |

### 2.3 No-objetivos

| ID | No-objetivo | Razón |
|---|---|---|
| NO-01 | Diseño visual complejo o animaciones | El enunciado evalúa claridad y funcionamiento, no vistosidad. |
| NO-02 | Gestión de préstamos, multas y pagos | Fuera de alcance por enunciado. |
| NO-03 | Multi-biblioteca o multi-sede | No hay requisito. |
| NO-04 | Aplicación móvil nativa | La SPA es responsive; es suficiente. |
| NO-05 | Migración de datos desde un sistema previo | No existe sistema previo. |
| NO-06 | Informes analíticos o cuadros de mando avanzados | El panel se limita a agregados de lectura directa. |

---

## 3. Requerimientos

### 3.1 Funcionales

Prioridad: **A** = imprescindible para la entrega - **B** = deseable - **C** = opcional.

> **Corrección del 2026-09-15.** RF-14 figuraba como prioridad **A** con origen "Enunciado
> sección 6". Es una mala lectura: el sección 6 pide *"al menos una Spec"* y *"al menos un Agente de IA
> **orientado al desarrollo del proyecto**"*, versionados en el repositorio - artefactos de
> desarrollo, no una funcionalidad de la aplicación. Eso es OP-07, y se cumple con
> `backend/.agents/`. **El enunciado no pide un asistente conversacional dentro del
> producto**: ni sección 4 ni sección 5 lo mencionan. RF-14 pasa a **B**.

| ID | Requerimiento | Prioridad | Origen |
|---|---|---|---|
| RF-01 | Registrar una categoría con nombre, descripción y estado. | A | Enunciado sección 3, sección 4 |
| RF-02 | Listar, editar y eliminar categorías. | A | Enunciado sección 4 |
| RF-03 | Registrar un libro con título, autor, ISBN, disponibilidad y categoría. | A | Enunciado sección 3, sección 4 |
| RF-04 | Listar, editar y eliminar libros. | A | Enunciado sección 4 |
| RF-05 | Impedir dos libros con el mismo ISBN. | A | Regla derivada de RF-03 |
| RF-06 | Registrar un cliente con nombres, apellidos, documento y correo. | A | Enunciado sección 3, sección 4 |
| RF-07 | Listar, editar y eliminar clientes. | A | Enunciado sección 4 |
| RF-08 | Registrar una reserva asociada a un cliente y a uno o más libros. | A | Enunciado sección 4 |
| RF-09 | Rechazar una reserva sin ningún libro. | A | Regla derivada de RF-08 |
| RF-10 | Listar las reservas mostrando al menos fecha, cliente y libros reservados. | A | Enunciado sección 4 |
| RF-11 | Consultar las reservas de un cliente concreto. | A | Enunciado sección 4 |
| RF-12 | Validar los datos de entrada de todos los servicios y devolver el error por campo. | A | Enunciado sección 4 |
| RF-13 | Manejar los errores de forma global y uniforme. | A | Enunciado sección 4 |
| RF-14 | Ofrecer un asistente conversacional que responda sobre catálogo y reservas. | **B** | Capacidad heredada. **No exigida por el enunciado** |
| RF-15 | Marcar un libro como no disponible al quedar comprometido por una reserva. | B | Regla derivada de MN-01 |
| RF-16 | Filtrar y buscar libros por título, autor o categoría. | B | Usabilidad del catálogo |
| RF-17 | Mostrar un panel con el resumen del catálogo y las reservas. | B | MN-03 |
| RF-18 | Autenticar al usuario antes de acceder a las pantallas de gestión. | C | Enunciado sección 4 (opcional) |
| RF-19 | Responder preguntas sobre documentos del catálogo mediante RAG. | C | Capacidad heredada disponible |

### 3.2 No funcionales

| ID | Requerimiento | Criterio de aceptación |
|---|---|---|
| RNF-01 | Separación de responsabilidades entre controlador, servicio, persistencia y componentes del frontend. | Ningún controlador contiene reglas de negocio; ningún componente llama a `HttpClient`. |
| RNF-02 | Uso de DTOs; las entidades JPA no se exponen. | Ninguna respuesta JSON contiene una entidad serializada directamente. |
| RNF-03 | Interfaz en español; identificadores en inglés. | Ningún texto visible en inglés; ninguna clase, tabla o endpoint en español. |
| RNF-04 | Ninguna credencial, token o secreto versionado. | `.gitignore` los cubre y la revisión previa al commit lo confirma. |
| RNF-05 | Configuración exclusivamente por variable de entorno. | `application.yaml` no contiene ningún valor sensible literal. |
| RNF-06 | La aplicación se levanta siguiendo solo el README. | Un tercero ejecuta backend, frontend y base sin consultas adicionales. |
| RNF-07 | La interfaz es usable en móvil (390 px de ancho). | Las tablas del catálogo no desbordan horizontalmente. |
| RNF-08 | Contraste de texto conforme a WCAG AA (4,5:1). | Verificado por cálculo, no a ojo. Tabla de ratios en `diseño/README.md`. |
| RNF-09 | Persistencia en PostgreSQL, local o Supabase, sin cambiar código. | Solo cambia `DB_URL`. |
| RNF-10 | Las reglas de negocio se ejecutan en el backend, nunca solo en el frontend. | Saltarse la interfaz y llamar a la API directamente produce el mismo rechazo. |

### 3.3 Integraciones

| Sistema | Propósito | Obligatorio |
|---|---|---|
| OpenAI (vía Spring AI) | Modelo de chat y embeddings para el asistente y el RAG. | Solo para RF-14 y RF-19 |
| Supabase - PostgreSQL | Base de datos gestionada, alternativa a PostgreSQL local. | No |
| Supabase - Auth | Proveedor de identidad, emisión y validación de JWT. | No (RF-18 es opcional) |
| Supabase - Storage | Almacenamiento de imágenes de portada. | No |

Ninguna integración es imprescindible para que el núcleo funcional (RF-01 a RF-13) opere.

---

## 4. Experiencia de usuario

Resumen; el detalle está en el diseño de Figma (`diseño/README.md`) y se formalizará en
AN050.

**Principios:**

1. **Una tarea, una pantalla.** El catálogo se gestiona en una tabla con diálogo de
   edición; no hay navegación a página aparte para crear un libro.
2. **La reserva es un asistente por pasos.** Es el único flujo con más de una decisión:
   elegir cliente, elegir libros, confirmar.
3. **El color nunca es la única señal.** Cada categoría tiene su tono, pero el nombre va
   siempre escrito al lado.
4. **Errores en el sitio del error.** La validación del backend se muestra bajo el campo
   que la provocó, no en un aviso genérico.

**Pantallas:** `login`, `dashboard`, `book`, `client`, `category`, `reservation-wizard`,
`reservation`, `assistant`, más el diálogo `book-dialog` y la variante móvil `book-mobile`.

**Identidad visual:** índigo `#4F46E5` primario, naranja `#C2410C` de acción; tipografías
Lora (títulos), IBM Plex Sans (interfaz) e IBM Plex Mono (ISBN y cifras).

---

## 5. Métricas de éxito

La entrega se evalúa contra el enunciado, así que las métricas son de cumplimiento, no de
uso:

| ID | Métrica | Objetivo |
|---|---|---|
| ME-01 | Requerimientos de prioridad A implementados y verificados. | 100 % |
| ME-02 | Funcionalidades del enunciado sección 4 (backend) cubiertas. | 8 de 8 |
| ME-03 | Funcionalidades del enunciado sección 5 (frontend) cubiertas. | 7 de 7 |
| ME-04 | Specs versionadas en el repositorio. | >= 1 |
| ME-05 | Agentes de IA definidos y versionados. | >= 1 |
| ME-06 | Secretos presentes en el repositorio. | 0 |
| ME-07 | Pasos manuales no documentados para levantar el sistema. | 0 |
| ME-08 | Documentos de la línea AN/EST cerrados antes de la entrega. | Los aplicables al alcance |

---

## Referencias

- `evaluación-final/EvFinal_Java_AI_Full_Stack_MitoCode.pdf` - enunciado, fuente de todos los requisitos.
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - cómo se estructura la solución.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - requisitos técnicos verificables.
- [`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md) - modelo de datos.
- `diseño/README.md` - diseño, paleta y contrastes.
