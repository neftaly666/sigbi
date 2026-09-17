# ANÁLISIS TÉCNICO-FUNCIONAL

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN010` - N.º AN-2026-001

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN010 |
| Versión | 1.1 |
| Fecha | 2026-09-14 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Módulo analizado | Reserva de libros |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-11 | D. Quispe | Versión inicial. Análisis AS-IS / TO-BE del módulo de reservas y plan de construcción. |
| 1.1 | 2026-09-14 | D. Quispe | sección 8.2: los nombres de las categorías de prueba se alinean con el diseño (AN090, DV-11) y se fija Hemeroteca como la categoría desactivada. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

## 1. Introducción

### 1.1 Objetivo

Analizar el proceso de reserva de libros de una biblioteca pequeña y especificar, con
detalle suficiente para construirlo, el módulo que lo sustituye en SIGBI: reglas, modelo
de datos, pantallas, contrato de servicios, casos de prueba y esfuerzo.

Este documento es el que se lee antes de escribir código. Lo que no esté aquí, en AN030
(qué debe hacer el producto) o en AN040 (cómo debe estar construido), no se implementa.

### 1.2 Por qué la reserva es el módulo principal

SIGBI tiene cuatro áreas funcionales: categorías, libros, clientes y reservas. Las tres
primeras son mantenimientos: una tabla, un formulario, cuatro operaciones. Son necesarias,
pero no tienen análisis que hacer - su comportamiento se deriva del modelo de datos.

La reserva es distinta por tres motivos:

1. **Es la única operación que escribe en más de una tabla.** Cabecera y detalles se
   graban juntos o no se graban.
2. **Es la única con regla de negocio propia.** Una reserva sin libros no es válida; un
   libro reservado cambia de estado.
3. **Es la única con flujo de más de un paso.** Elegir cliente, elegir libros, confirmar.

Por eso el análisis se concentra aquí. Los mantenimientos se especifican en la sección 6.2
con el detalle que necesitan, que es poco.

### 1.3 Alcance

**Del análisis:** el ciclo completo de la reserva, desde que el bibliotecario identifica al
cliente hasta que la reserva queda registrada y consultable, más los tres mantenimientos
que la alimentan.

**Fuera del análisis, por decisión del enunciado:** préstamo y devolución física, multas,
pagos, inventario por ejemplar, reserva con fecha de caducidad, cola de espera y
notificaciones. No se modelan ni se dejan columnas preparadas para ellos.

El límite es deliberado y conviene decirlo en voz alta: SIGBI registra **reservas**, no
préstamos. La diferencia es que la reserva no tiene fecha de devolución ni ciclo de cierre.

### 1.4 Etapas del trabajo

| Etapa | Contenido | Estado |
|---|---|---|
| E1 | Documentación de partida: estándar de base de datos, diseño en Figma, línea documental AN/EST | **Completada** (2026-09-11) |
| E2 | Dominio de biblioteca en el backend: entidades, repositorios, servicios, DTOs, controladores | Pendiente |
| E3 | Pantallas del frontend: catálogo, clientes, categorías, asistente de reserva y listado | Pendiente |
| E4 | Specs y agentes de IA versionados; asistente conversacional readaptado al dominio | Pendiente |
| E5 | Retirada del dominio médico heredado y renombrado del paquete | Pendiente |
| E6 | Verificación de aceptación, README final y publicación del repositorio | Pendiente |

---

## 2. Posición del módulo en el sistema

```
     Mantenimientos                       Operación                  Consulta
  +------------------+            +----------------------+    +------------------+
  | Categorías       |            |                      |    | Listado de       |
  |   +- clasifican  |----------->|  Registro de         |--->| reservas         |
  | Libros           |  alimentan |  reserva             |    |                  |
  | Clientes         |----------->|                      |    | Reservas de      |
  +------------------+            +----------+-----------+    | un cliente       |
                                             |                +------------------+
                                             | cambia
                                             v
                                   book.available = false
```

El módulo de reserva **consume** los tres mantenimientos y **modifica** el catálogo. Es el
único punto del sistema donde un dato de una tabla cambia como efecto de una operación
sobre otra.

El asistente de IA se sitúa transversalmente: lee catálogo y reservas para responder, pero
no escribe.

---

## 3. Análisis AS-IS

Situación de partida de una biblioteca pequeña que no tiene sistema. No hay un sistema
anterior que migrar: el AS-IS es el procedimiento manual.

### 3.1 Registro del catálogo

**Hoy.** Los libros se anotan en una hoja de cálculo o en un fichero de cartulinas. No hay
clave única: el mismo título puede aparecer dos veces con grafías distintas.

**Problemas observados:**

| ID | Problema |
|---|---|
| P-01 | Títulos duplicados por errores de tipeo; no hay identificador que lo impida |
| P-02 | La clasificación temática es un texto libre, así que "Novela", "novela" y "Narrativa" conviven |
| P-03 | No hay forma de saber si un ejemplar está comprometido sin preguntar |

### 3.2 Registro del cliente

**Hoy.** Los datos del cliente se piden cada vez que reserva y se anotan junto a la
reserva, no en un padrón.

**Problemas observados:**

| ID | Problema |
|---|---|
| P-04 | El mismo cliente aparece escrito de varias formas en distintas reservas |
| P-05 | Responder "¿qué tiene reservado esta persona?" obliga a revisar el registro entero |
| P-06 | No hay dato de contacto fiable |

### 3.3 Reserva

**Hoy.** El bibliotecario anota en un cuaderno la fecha, el nombre del cliente y los
títulos. Si son varios libros, son varias líneas sin nada que las vincule como un solo
acto.

**Problemas observados:**

| ID | Problema |
|---|---|
| P-07 | Una reserva de tres libros son tres anotaciones independientes; si se cancela, hay que encontrar las tres |
| P-08 | No queda registro de la hora, solo de la fecha, y a veces ni eso |
| P-09 | Nada impide reservar un libro ya reservado |

### 3.4 Consulta

**Hoy.** Toda consulta es una lectura secuencial del cuaderno.

| ID | Problema |
|---|---|
| P-10 | El tiempo de respuesta a "¿está disponible este título?" depende del volumen del registro |
| P-11 | No hay visión agregada: cuántos libros hay, de qué categorías, cuántas reservas activas |

### 3.5 Síntesis

Los once problemas se reducen a tres carencias: **no hay identidad** (P-01, P-04),
**no hay estado** (P-03, P-09) y **no hay vínculo entre las líneas de una misma operación**
(P-07). El modelo de datos de la sección 5 ataca las tres directamente.

---

## 4. Reglas de negocio consolidadas

Numeradas para poder referenciarlas desde los casos de prueba y desde el código.

| ID | Regla | Dónde se aplica |
|---|---|---|
| RN-01 | Un libro pertenece a exactamente una categoría. | FK no nulable `book.id_category` |
| RN-02 | No pueden existir dos libros con el mismo ISBN. | Restricción UNIQUE en base + validación en servicio |
| RN-03 | Una reserva pertenece a exactamente un cliente. | FK no nulable `reservation.id_client` |
| RN-04 | Una reserva contiene al menos un detalle. | Validación en el servicio de reserva |
| RN-05 | Cada detalle de reserva referencia exactamente un libro. | FK no nulable `reservation_detail.id_book` |
| RN-06 | Un libro no disponible no puede incluirse en una reserva nueva. | Validación en el servicio de reserva |
| RN-07 | Al registrarse una reserva, todos sus libros pasan a no disponibles. | Servicio de reserva, misma transacción |
| RN-08 | Un mismo libro no puede repetirse dos veces en la misma reserva. | Validación en el servicio de reserva |
| RN-09 | La cabecera y los detalles de una reserva se graban en una sola transacción. | `@Transactional` + `cascade = ALL` |
| RN-10 | La fecha de la reserva la asigna el servidor, no el cliente. | Servicio de reserva |
| RN-11 | No se puede eliminar una categoría que tiene libros. | Restricción de FK |
| RN-12 | No se puede eliminar un libro o un cliente con reservas registradas. | Restricción de FK |
| RN-13 | Al eliminar una reserva, se eliminan sus detalles y sus libros vuelven a estar disponibles. | Cascada + servicio |
| RN-14 | Una categoría desactivada (`status = false`) no se ofrece al clasificar libros nuevos, pero los ya clasificados la conservan. | Servicio de catálogo |

**Nota sobre RN-06 y RN-07.** El enunciado no exige el control de disponibilidad - el campo
`disponible` aparece en la entidad mínima, pero no hay funcionalidad que lo mueva. Se
incorpora porque sin él el campo es decorativo y el problema P-09 queda sin resolver. Está
marcado como prioridad B en AN030 (RF-15): si el tiempo aprieta, el CRUD y el registro de
reserva van primero.

---

## 5. Modelo de datos propuesto

Cinco tablas. Traducción directa de las entidades mínimas del enunciado al estándar del
proyecto:

| Enunciado | Clase Java | Tabla | PK |
|---|---|---|---|
| Categoría | `Category` | `category` | `id_category` |
| Libro | `Book` | `book` | `id_book` |
| Cliente | `Client` | `client` | `id_client` |
| Reserva | `Reservation` | `reservation` | `id_reservation` |
| DetalleReserva | `ReservationDetail` | `reservation_detail` | `id_reservation_detail` |

Cardinalidades: `Category 1-N Book` - `Client 1-N Reservation` -
`Reservation 1-N ReservationDetail` - `Book 1-N ReservationDetail`.

### 5.1 Decisiones de implementación

| ID | Decisión | Motivo |
|---|---|---|
| DM-01 | `ReservationDetail` tiene PK propia, no compuesta | Es una entidad con identidad, no una tabla puente N:M pura. El patrón `@Embeddable` + `@IdClass` de `ConsultExam` no aplica |
| DM-02 | La PK de cada clase se llama `id` + nombre de la clase | Lo exige `CRUDImpl.update()`, que resuelve el setter por reflexión. Incumplirlo rompe todo `PUT` en ejecución |
| DM-03 | Toda PK es `Integer` con `IDENTITY` | `CRUDImpl.update()` resuelve el método con `id.getClass()` |
| DM-04 | `isbn` es UNIQUE en base, no solo validado en el servicio | La unicidad debe resistir dos altas simultáneas (RN-02) |
| DM-05 | `reservation` no lleva estado ni fecha de vencimiento | La caducidad está fuera de alcance; una columna sin regla que la mueva es ruido |
| DM-06 | El documento del cliente se llama `dni` en el código, no `cedula` | Coherencia con `Patient` del código base. El rótulo en pantalla dice **"Documento"**, que no presupone el tipo ni el país: identificador en inglés, texto visible en español |
| DM-07 | `category.status` desactiva, no borra | RN-11 impide el borrado; la desactivación es la salida real (RN-14) |
| DM-08 | Ninguna FK es nulable | Un libro sin categoría, una reserva sin cliente o un detalle sin libro no son estados válidos |

Esquema físico completo, con tipos, longitudes y nombres de restricción, en
[`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md).

---

## 6. Diseño TO-BE

### 6.1 Especificación común de las pantallas

Todo lo que aplica a las cuatro pantallas de gestión, para no repetirlo en cada una:

| Aspecto | Definición |
|---|---|
| Estructura | Cabecera con título y acción principal - barra de filtro - tabla - paginador |
| Alta y edición | Diálogo modal sobre la tabla. No hay navegación a una página aparte |
| Tabla | Filas de 48 px (`mat.theme(density: -1)`). Columnas de datos y una final de acciones |
| Acciones por fila | Editar (lápiz) y eliminar (papelera), con rótulo accesible |
| Confirmación de borrado | Diálogo con el nombre del registro afectado. Nunca borrado directo |
| Estado de carga | Indicador en la tabla mientras `$loading` es verdadero |
| Estado vacío | Ilustración y texto que explica qué hacer, no una tabla en blanco |
| Estado de error | Banner con el mensaje del backend y un botón de reintento (`reload()`) |
| Validación | En el campo, bajo el control que la provocó. El mensaje del backend se muestra tal cual |
| Éxito | Snackbar breve; la tabla se recarga |
| Idioma | Todo texto visible en español |
| Responsive | A 390 px de ancho la tabla reduce columnas a las esenciales; no desborda horizontalmente |

### 6.2 Especificaciones particulares

#### 6.2.1 `category` - Categorías

| Aspecto | Definición |
|---|---|
| Columnas | Nombre - Descripción - Estado - Acciones |
| Campos del formulario | Nombre (obligatorio, <= 60) - Descripción (obligatoria, <= 150) - Estado (interruptor) |
| Filtro | Texto libre sobre nombre |
| Color | Cada categoría muestra su tono asignado junto al nombre, nunca en lugar del nombre |
| Reglas visibles | RN-11: si tiene libros, el borrado se rechaza con un mensaje que dice cuántos |

#### 6.2.2 `book` - Libros

| Aspecto | Definición |
|---|---|
| Columnas | Título - Autor - ISBN (monoespaciada) - Categoría (con su tono) - Disponible - Acciones |
| Campos del formulario | Título (<= 150) - Autor (<= 100) - ISBN (10-13) - Categoría (desplegable de activas) - Disponible (interruptor) |
| Filtro | Texto libre sobre título y autor, más desplegable de categoría |
| Reglas visibles | RN-02: ISBN duplicado se rechaza señalando el campo - RN-12: borrado rechazado si tiene reservas |
| Diálogo | `book-dialog`, artboard propio en Figma |

#### 6.2.3 `client` - Clientes

| Aspecto | Definición |
|---|---|
| Columnas | Nombres - Apellidos - Documento - Correo - Acciones |
| Campos del formulario | Nombres (<= 70) - Apellidos (<= 70) - Documento (8 dígitos) - Correo (formato válido, <= 55) |
| Filtro | Texto libre sobre nombres, apellidos y documento |
| Acción adicional | "Ver reservas" abre el listado filtrado por ese cliente (RF-11) |
| Reglas visibles | RN-12: borrado rechazado si tiene reservas |

#### 6.2.4 `reservation-wizard` - Registro de reserva

La única pantalla con flujo. Tres pasos con `mat-stepper`:

| Paso | Contenido | Condición para avanzar |
|---|---|---|
| 1. Cliente | Buscador por nombre o documento; selección única | Hay un cliente seleccionado |
| 2. Libros | Buscador del catálogo con filtro por categoría. Solo se listan los disponibles (RN-06). Selección múltiple, con las elecciones visibles como chips | Hay al menos un libro (RN-04) |
| 3. Confirmación | Resumen: cliente, libros elegidos, fecha | - |

Comportamiento:

- Un libro ya elegido no se puede volver a añadir (RN-08): aparece marcado en la lista.
- La fecha no es editable; la pone el servidor (RN-10). Se muestra como informativa.
- Al confirmar se envía una sola petición. Si falla, no se ha grabado nada (RN-09) y el
  asistente conserva la selección para reintentar.
- Al terminar, navega al listado de reservas con la nueva reserva resaltada.

#### 6.2.5 `reservation` - Listado de reservas

| Aspecto | Definición |
|---|---|
| Columnas | Fecha - Cliente - Libros reservados - Acciones |
| Libros | Los títulos como chips en la propia fila; si son más de tres, "+N" con el resto en emergente. **No hay que abrir el detalle para ver qué se reservó** (RF-10) |
| Filtro | Desplegable de cliente y rango de fechas |
| Acciones | Ver detalle - Eliminar (RN-13: devuelve los libros al catálogo, con confirmación explícita que lo advierte) |
| Orden | Fecha descendente |

#### 6.2.6 `dashboard` - Panel

Solo lectura, sin filtros. Cuatro indicadores (libros totales, disponibles, clientes,
reservas) y un gráfico de libros por categoría con los tonos del catálogo.

#### 6.2.7 `assistant` - Asistente

Conversación de una sola columna. El agente responde en español sobre catálogo y reservas,
con acceso **de solo lectura**: informa, no registra. Las respuestas en Markdown se
renderizan con `marked`.

### 6.3 API - contrato de servicios

Estilo REST, `/v1/<recurso>`, JSON. Códigos y variables en
[`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) sección 5.

| Método | Ruta | Entrada | Salida | Regla |
|---|---|---|---|---|
| GET | `/v1/categories` | - | `CategoryDTO[]` | |
| GET | `/v1/categories/{id}` | - | `CategoryDTO` | 404 si no existe |
| POST | `/v1/categories` | `CategoryDTO` | 201 + `Location` | |
| PUT | `/v1/categories/{id}` | `CategoryDTO` | `CategoryDTO` | |
| DELETE | `/v1/categories/{id}` | - | 204 | RN-11 |
| GET | `/v1/books` | - | `BookDTO[]` | |
| GET | `/v1/books/{id}` | - | `BookDTO` | 404 si no existe |
| POST | `/v1/books` | `BookDTO` | 201 + `Location` | RN-02 |
| PUT | `/v1/books/{id}` | `BookDTO` | `BookDTO` | RN-02 |
| DELETE | `/v1/books/{id}` | - | 204 | RN-12 |
| GET | `/v1/clients` | - | `ClientDTO[]` | |
| GET | `/v1/clients/{id}` | - | `ClientDTO` | 404 si no existe |
| POST | `/v1/clients` | `ClientDTO` | 201 + `Location` | |
| PUT | `/v1/clients/{id}` | `ClientDTO` | `ClientDTO` | |
| DELETE | `/v1/clients/{id}` | - | 204 | RN-12 |
| GET | `/v1/reservations` | - | `ReservationDTO[]` | Incluye cliente y títulos |
| GET | `/v1/reservations/{id}` | - | `ReservationDTO` | 404 si no existe |
| GET | `/v1/reservations/client/{id}` | - | `ReservationDTO[]` | RF-11 |
| POST | `/v1/reservations` | `ReservationDTO` | 201 + `Location` | RN-04, RN-06, RN-08, RN-09, RN-10 |
| DELETE | `/v1/reservations/{id}` | - | 204 | RN-13 |
| POST | `/v1/agents` | `{ "message": "..." }` | Respuesta del asistente | Solo lectura |

#### 6.3.1 Cuerpo de la reserva

Petición:

```json
{
  "idClient": 3,
  "details": [
    { "idBook": 12 },
    { "idBook": 27 }
  ]
}
```

`reservationDate` **no viaja en la petición** (RN-10). Se ignora si llega.

Respuesta de `GET /v1/reservations`:

```json
[
  {
    "idReservation": 5,
    "reservationDate": "2026-09-15T10:32:00",
    "client": { "idClient": 3, "firstName": "Ana", "lastName": "Rojas" },
    "details": [
      { "idReservationDetail": 9,  "book": { "idBook": 12, "title": "Los ríos profundos" } },
      { "idReservationDetail": 10, "book": { "idBook": 27, "title": "El zorro de arriba" } }
    ]
  }
]
```

El listado trae cliente y títulos resueltos: RF-10 exige que se vean sin navegación
adicional, y resolverlos en el cliente con N peticiones sería peor.

---

## 7. Requerimientos funcionales del módulo

Trazabilidad con AN030 y con las reglas de la sección 4:

| RF (AN030) | Descripción | Reglas | Pantalla | Endpoint |
|---|---|---|---|---|
| RF-01, RF-02 | Mantenimiento de categorías | RN-11, RN-14 | `category` | `/v1/categories` |
| RF-03, RF-04, RF-05 | Mantenimiento de libros | RN-01, RN-02, RN-12 | `book` | `/v1/books` |
| RF-06, RF-07 | Mantenimiento de clientes | RN-12 | `client` | `/v1/clients` |
| RF-08, RF-09 | Registro de reserva | RN-03 a RN-10 | `reservation-wizard` | `POST /v1/reservations` |
| RF-10 | Listado de reservas | - | `reservation` | `GET /v1/reservations` |
| RF-11 | Reservas de un cliente | - | `client` -> `reservation` | `GET /v1/reservations/client/{id}` |
| RF-12 | Validación de entrada | Todas | Todas | Todos |
| RF-13 | Control global de excepciones | - | - | `ResponseExceptionHandler` |
| RF-14 | Asistente conversacional | - | `assistant` | `POST /v1/agents` |
| RF-15 | Control de disponibilidad | RN-06, RN-07, RN-13 | `book`, `reservation-wizard` | `/v1/reservations` |
| RF-16 | Búsqueda y filtro de libros | - | `book` | `GET /v1/books` |
| RF-17 | Panel de resumen | - | `dashboard` | varios |

---

## 8. Plan de pruebas

### 8.1 Matriz de casos

| ID | Caso | Entrada | Resultado esperado | Regla |
|---|---|---|---|---|
| CP-01 | Alta de categoría válida | Nombre y descripción dentro de longitud | 201 + `Location` | - |
| CP-02 | Alta de categoría sin nombre | Nombre vacío | 400 señalando `name` | RF-12 |
| CP-03 | Borrado de categoría con libros | Categoría con 3 libros | Rechazo controlado, no 500 | RN-11 |
| CP-04 | Alta de libro válida | Datos completos, categoría activa | 201 + `Location` | - |
| CP-05 | Alta de libro con ISBN repetido | ISBN ya existente | 400 señalando `isbn` | RN-02 |
| CP-06 | Alta de libro sin categoría | `idCategory` nulo | 400 señalando `idCategory` | RN-01 |
| CP-07 | Alta de libro con título de 200 caracteres | Título > 150 | 400, no 500 | RF-12 |
| CP-08 | Alta de cliente con correo inválido | `ana@` | 400 señalando `email` | RF-12 |
| CP-09 | Alta de cliente con documento de 7 dígitos | `1234567` | 400 señalando `dni` | RF-12 |
| CP-10 | Borrado de cliente con reservas | Cliente con 1 reserva | Rechazo controlado | RN-12 |
| CP-11 | Reserva con un libro | Cliente válido, 1 libro disponible | 201; 1 cabecera y 1 detalle | RN-09 |
| CP-12 | Reserva con tres libros | Cliente válido, 3 libros disponibles | 201; 1 cabecera y 3 detalles | RN-09 |
| CP-13 | Reserva sin libros | `details: []` | 400 con mensaje explícito | RN-04 |
| CP-14 | Reserva sin cliente | `idClient` nulo | 400 señalando `idClient` | RN-03 |
| CP-15 | Reserva con libro no disponible | Libro con `available = false` | Rechazo con el título en el mensaje | RN-06 |
| CP-16 | Reserva con el mismo libro dos veces | `details` con `idBook` repetido | 400 con mensaje explícito | RN-08 |
| CP-17 | Disponibilidad tras reservar | Reserva de 2 libros | Los 2 quedan `available = false` | RN-07 |
| CP-18 | Fecha asignada por el servidor | `reservationDate` enviada en el pasado | Se ignora; queda la del servidor | RN-10 |
| CP-19 | Atomicidad | Reserva con un libro válido y otro inexistente | No se graba nada: 0 cabeceras, 0 detalles | RN-09 |
| CP-20 | Listado de reservas | 3 reservas registradas | Cada fila muestra fecha, cliente y títulos | RF-10 |
| CP-21 | Reservas de un cliente | Cliente con 2 de las 5 reservas | Devuelve exactamente 2 | RF-11 |
| CP-22 | Borrado de reserva | Reserva de 2 libros | Detalles eliminados y libros disponibles otra vez | RN-13 |
| CP-23 | Recurso inexistente | `GET /v1/books/9999` | 404 con cuerpo de error, sin traza | RF-13 |
| CP-24 | Error no controlado | Fallo interno provocado | Mensaje genérico; el detalle solo en el log | RF-13, E-01 |
| CP-25 | Regla saltándose la interfaz | `POST` directo a la API con `details: []` | Mismo rechazo que desde la pantalla | RNF-10 |
| CP-26 | Asistente | "¿Qué libros de poesía hay disponibles?" | Responde en español con títulos del catálogo | RF-14 |

**Nota sobre CP-25.** Es el caso que distingue una validación real de una decorativa: si
solo vive en el formulario de Angular, la API acepta la reserva vacía y la regla no existe.

### 8.2 Datos de prueba de referencia

| Elemento | Valor |
|---|---|
| Categorías | Narrativa - Informática - Ciencia - Historia - Infantil - Hemeroteca (6, con sus tonos) |
| Libros | 24, repartidos entre las seis categorías, todos disponibles al inicio |
| Clientes | 5, con documento de 8 dígitos y correo ficticio |
| Reservas iniciales | 3: una de un libro, una de tres y una de dos |
| Cliente de la prueba | El que tiene 2 reservas, para verificar CP-21 |

**Hemeroteca se carga desactivada.** Es el dato que verifica RN-14 sin necesidad de una
séptima categoría: no debe ofrecerse en el desplegable del formulario de libro, pero los
libros ya clasificados en ella conservan su referencia.

Ningún dato de prueba contiene información personal real. El detalle del juego canónico
-descripciones, tonos y reparto de los 24 libros- está en
[`AN050-diseño-ui-ux.md`](AN050-diseño-ui-ux.md) sección 8.

---

## 9. Migración y carga inicial

**No hay migración.** No existe un sistema anterior del que extraer datos: el AS-IS es
papel o una hoja de cálculo, y el enunciado no pide importarlos.

La carga inicial es la de la sección 8.2 y se hace **por la propia API**, no con `INSERT`
directos. Dos motivos: los datos pasan por las mismas validaciones que los reales, y la
carga sirve de verificación de que el despliegue funciona de punta a punta.

Si en el futuro hiciera falta importar un catálogo existente, el camino es un `POST` masivo
contra `/v1/books` desde un script, respetando RN-02. No se construye ahora.

---

## 10. Riesgos, decisiones abiertas y pendientes

### 10.1 Riesgos

| ID | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R-01 | El plazo es corto: 19 días naturales desde la fecha de este documento, con el dominio aún sin construir | Alto | Orden de construcción del Anexo A: el núcleo evaluable (RF de prioridad A) va primero; RF-15, RF-16 y RF-17 son sacrificables |
| R-02 | El dominio médico heredado sigue en el repositorio y puede confundir al evaluador | Medio | E5 retira el dominio antes de la entrega. Si no diera tiempo, el README indica explícitamente qué es SIGBI y qué es base heredada |
| R-03 | `ddl-auto: update` no borra ni renombra columnas | Medio | En desarrollo se recrea la base tras un renombrado. Documentado en AN070 sección 6.1 |
| R-04 | Desalineación entre `AUTH_MODE` del frontend y `app.auth.mode` del backend: todo responde 401 tras un login correcto | Medio | Documentado en README y en AN040 TC-07. La seguridad es opcional: ante cualquier duda, se desactiva |
| R-05 | Dependencia de OpenAI para RF-14 | Bajo | El núcleo funcional (RF-01 a RF-13) opera sin clave de OpenAI |
| R-06 | `backend/.agents/` está referenciado en el README y en `CLAUDE.md` pero no existe; es requisito de entrega | Alto | E4 lo crea. Es requisito sección 6 del enunciado, no un extra |
| R-07 | El repositorio aún no es público | Alto | Requisito sección 8. Cierra en E6, antes del 2026-09-30 |

### 10.2 Puntos abiertos

| ID | Punto | Estado |
|---|---|---|
| PA-01 | ¿Se implementa RF-15 (control de disponibilidad)? | Recomendado. Sin él, `available` es un campo decorativo y P-09 queda sin resolver. Decisión de tiempo, no de diseño |
| PA-02 | ¿Se conserva Spring Security con Supabase Auth, o se desactiva para simplificar la evaluación? | Abierto. La seguridad es opcional según el enunciado; conservarla añade pasos al README del evaluador |
| PA-03 | ¿Sobre qué documentos opera el RAG (RF-19)? | Abierto. El módulo existe y funciona; falta decidir el corpus. Es prioridad C |
| PA-04 | ¿Se renombra el paquete `com.mitocode`? | **Resuelta el 2026-09-15:** sí, a `com.sigbi`, en un commit único al cerrar la migración |

---

## Anexo A. Estimación de esfuerzo y cronograma

### A.1 Supuestos

- Un solo desarrollador.
- 4 horas efectivas por día laborable.
- La infraestructura genérica (`CRUDImpl`, `IGenericRepo`, manejo de errores, seguridad,
  módulo de IA) se reutiliza sin modificarla: no se estima.
- El diseño en Figma está cerrado: no se estima diseño visual.
- Desde el 2026-09-11 hasta el 2026-09-30 hay 13 días laborables, es decir, **52 horas
  efectivas**.

### A.2 Estimación por actividad

| Actividad | Horas | Etapa |
|---|---|---|
| Entidades JPA, repositorios y servicios (5 entidades) | 4 | E2 |
| DTOs y validaciones | 3 | E2 |
| Controladores CRUD (categorías, libros, clientes) | 3 | E2 |
| Servicio y controlador de reserva, con RN-04 a RN-10 | 6 | E2 |
| Servicios, modelos y stores del frontend | 4 | E3 |
| Pantallas de mantenimiento (3 tablas + diálogos) | 8 | E3 |
| Asistente de reserva (`reservation-wizard`) | 6 | E3 |
| Listado de reservas | 3 | E3 |
| Panel (`dashboard`) | 2 | E3 |
| Readaptación del asistente de IA al dominio | 3 | E4 |
| Specs y definición de agentes en `backend/.agents/` | 3 | E4 |
| Retirada del dominio médico y renombrado del paquete | 3 | E5 |
| Carga de datos de prueba y recorrido de aceptación (26 casos) | 4 | E6 |
| README final, revisión de `.gitignore` y publicación | 2 | E6 |
| **Total** | **54** | |

### A.3 Contraste con el plazo

54 horas estimadas contra 52 disponibles: el plan **no tiene holgura**. El margen sale de
lo sacrificable, no de comprimir el núcleo.

| Prioridad | Actividades | Horas |
|---|---|---|
| Imprescindible (RF de prioridad A + requisitos de entrega) | Todo excepto lo de abajo | 47 |
| Sacrificable | Panel (2 h) - Retirada del dominio médico (3 h) - RF-15 dentro del servicio de reserva (2 h) | 7 |

Si el núcleo se retrasa, lo primero que cae es el panel; después, la retirada del dominio
heredado (que es higiene, no funcionalidad evaluable).

### A.4 Cronograma

| Semana | Fechas | Contenido | Hito |
|---|---|---|---|
| S1 | 11-18 sep | E2 completa: dominio, DTOs, controladores, servicio de reserva | **H-1** (18 sep): la API responde los 21 endpoints |
| S2 | 21-25 sep | E3: pantallas de mantenimiento, asistente de reserva, listado | **H-2** (25 sep): flujo completo funcionando de punta a punta |
| S3 | 28-30 sep | E4, E5 y E6: specs y agentes, retirada del dominio heredado, aceptación, publicación | **H-3** (30 sep): entrega |

### A.5 Hitos

| ID | Hito | Fecha | Criterio de cumplimiento |
|---|---|---|---|
| H-1 | Backend funcional | 2026-09-18 | Los 21 endpoints responden; CP-01 a CP-25 pasan contra la API |
| H-2 | Frontend funcional | 2026-09-25 | Se registra una reserva de tres libros desde la interfaz y aparece en el listado |
| H-3 | Entrega | 2026-09-30 | Repositorio público, README verificado por un tercero, specs y agentes presentes |

### A.6 Ruta crítica

```
Entidades -> Servicio de reserva -> Asistente de reserva -> Aceptación -> Publicación
   4 h            6 h                      6 h                  4 h           2 h
```

Todo lo demás puede reordenarse. **El servicio de reserva es el cuello de botella:** es lo
único con reglas propias, lo único transaccional y lo que alimenta la pantalla más costosa.
Si a día 18 el `POST /v1/reservations` no graba cabecera y detalles correctamente, el
cronograma se desvía y hay que recortar por A.3.

---

## Referencias

- `evaluación-final/EvFinal_Java_AI_Full_Stack_MitoCode.pdf` - enunciado del trabajo final.
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - estructura de la solución.
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - requerimientos y métricas.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - stack y requisitos técnicos.
- [`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md) - esquema físico.
- [`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md) - [`EST020-estándar-de-backend-java.md`](EST020-estándar-de-backend-java.md) - normas de construcción.
- `diseño/README.md` - diseño en Figma.
