# FLUJOS DE NAVEGACIÓN (APPFLOW)

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN060` - N.º AN-2026-006

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN060 |
| Versión | 1.0 |
| Fecha | 2026-09-14 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Contenido | Mapa de rutas, flujo de sesión, flujo de la reserva, mantenimientos, asistente, flujos transversales y contratos que los sostienen |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial. Deriva los flujos de las pantallas de AN050 y del contrato de AN010 sección 6.3. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

**Qué es este documento.** AN050 dice cómo se ve cada pantalla; este dice **cómo se pasa de
una a otra**, qué condición hay que cumplir para avanzar y a dónde se cae cuando algo falla.
Es la especificación de `app.routes.ts` y `pages.routes.ts`.

**Estado al 2026-09-17.** Las rutas están **construidas** y coinciden con este documento:
`app.routes.ts` y `pages.routes.ts` declaran los destinos de abajo, con carga perezosa del
bloque `/pages`.

Una diferencia respecto al esqueleto heredado: **`cert.guard` se eliminó**. Consultaba
`/v1/menus/user`, que es la tabla `menu` de MediApp, y sin token devolvía una lista vacía,
así que habría cerrado las seis pantallas. RF-18 es prioridad C; cuando entre, el permiso
se resolverá sobre esta misma lista de destinos.

---

## 1. Mapa de rutas

Dos niveles. Fuera del layout solo viven el acceso y los errores; todo lo demás cuelga de
`/pages`, que aporta el app shell (sección 3 de AN050).

```
/                              -> redirige a /pages/dashboard
/login                         LoginComponent                  sin shell
/pages                         LayoutComponent                 [cert.guard]
   +-- /dashboard              DashboardComponent              carga perezosa
   +-- /book                   BookComponent
   +-- /category               CategoryComponent
   +-- /client                 ClientComponent
   +-- /reservation            ReservationComponent
   +-- /reservation-wizard     ReservationWizardComponent
   +-- /assistant              AssistantComponent
/403                           Not403Component                 sin shell
/**                            Not404Component                 sin shell
```

| Ruta | Componente | En el menú | Prioridad |
|---|---|---|---|
| `/login` | `LoginComponent` | No | C (RF-18) |
| `/pages/dashboard` | `DashboardComponent` | Sí - *Panel* | B (RF-17) |
| `/pages/book` | `BookComponent` | Sí - *Libros* | A (RF-03, RF-04) |
| `/pages/category` | `CategoryComponent` | Sí - *Categorías* | A (RF-01, RF-02) |
| `/pages/client` | `ClientComponent` | Sí - *Clientes* | A (RF-06, RF-07) |
| `/pages/reservation` | `ReservationComponent` | Sí - *Reservas* | A (RF-10, RF-11) |
| `/pages/reservation-wizard` | `ReservationWizardComponent` | **No** | A (RF-08, RF-09) |
| `/pages/assistant` | `AssistantComponent` | Sí - *Asistente* | A (RF-14) |

**Por qué el asistente de reserva no está en el menú.** Es un flujo con estado, no un
destino: se entra a él con una intención ("voy a registrar una reserva") y se sale por
donde termina. Ponerlo en el menú invitaría a abandonarlo a medias desde su propia barra de
navegación. Se llega desde el botón "Nueva reserva", presente en la cabecera del panel y de
Reservas; mientras dura, el ítem activo del menú es **Reservas**.

**Rutas que no existen y no se echan de menos:** no hay `/pages/book/:id` ni
`/pages/reservation/:id`. La edición es un diálogo modal (PX-01 de AN050) y el detalle de
la reserva cabe en la propia fila (RF-10). Una ruta de detalle sería una pantalla que nadie
pidió.

---

## 2. Flujo de sesión

```
     +------------------------------------------------------+
     |  Usuario abre la aplicación                          |
     +------------------------+-----------------------------+
                              v
                    ¿RF-18 activo?
              +--------- no ---------+         sí
              v                      |          v
     /pages/dashboard                |   cert.guard evalúa la sesión
                                     |          |
                                     |   +------+-------+
                                     |   |              |
                                     |  hay sesión   no hay
                                     |   |              |
                                     |   v              v
                                     +- /pages/...     /login
                                                        |
                                          credenciales  |
                                                        v
                                          Supabase Auth valida
                                                        |
                                     +------------------+------+
                                    ok                       error
                                     |                          |
                                     v                          v
                              /pages/dashboard        mensaje bajo el campo,
                                                      se permanece en /login
```

| Paso | Detalle |
|---|---|
| Guarda | `cert.guard` protege todo lo que cuelga de `/pages`. Es lo único que decide si hay sesión. |
| Identidad | La valida Supabase Auth, no SIGBI. El backend no guarda contraseñas (AN020 sección 7). |
| Transporte del token | `bearer` (cabecera) o `cookie`, según `AUTH_MODE`. Lo añade un interceptor; ningún componente toca la cabecera. |
| Cierre de sesión | Botón de la fila de usuario del menú lateral -> se limpia la sesión -> `/login`. |
| Caducidad | Un 401 en cualquier petición se trata en `server-error.interceptor.ts` y redirige a `/login` (sección 6). |

**Si RF-18 se desactiva** (es opcional por enunciado), `/login` deja de estar en el
recorrido y `cert.guard` permite el paso. No hay que tocar ninguna otra ruta: la decisión
vive en un sitio.

---

## 3. Flujo principal - registro de una reserva

Es el flujo que da sentido al sistema y el único con estado propio entre pantallas.

```
 [Panel] o [Reservas]
        |
        | pulsa "Nueva reserva"
        v
 +-------------------------------------------------------------+
 | /pages/reservation-wizard                                   |
 |                                                             |
 |  Paso 1 - Cliente                                           |
 |    busca por nombre o documento -> selecciona uno           |
 |    -- Siguiente habilitado solo con cliente seleccionado    |
 |                          |                                  |
 |                          v                                  |
 |  Paso 2 - Libros                                            |
 |    lista SOLO disponibles (RN-06), filtro por categoría     |
 |    selección múltiple -> chips sobre la lista                |
 |    un libro ya elegido aparece marcado (RN-08)              |
 |    -- Siguiente habilitado con >= 1 libro (RN-04)            |
 |                          |                                  |
 |                          v                                  |
 |  Paso 3 - Confirmación                                      |
 |    resumen: cliente - libros - fecha (informativa, RN-10)   |
 |    -- "Confirmar reserva"                                   |
 +--------------------------+----------------------------------+
                            | POST /v1/reservations
                            | { idClient, details:[{idBook}] }
                            v
                 +----------+-----------+
              201 Created            4xx / 5xx
                 |                       |
                 v                       v
    /pages/reservation con la     se permanece en el paso 3,
    nueva reserva resaltada       la selección se conserva,
    + snackbar de confirmación    el mensaje del backend se
                                  muestra sobre el resumen
```

### 3.1 Reglas de navegación del asistente

| Regla | Comportamiento |
|---|---|
| Avanzar | "Siguiente" está deshabilitado hasta que el paso cumple su condición. No se avanza para descubrir el error después. |
| Retroceder | Libre entre pasos ya visitados. Volver al paso 1 y cambiar de cliente **no** borra los libros elegidos: se conservan mientras sigan disponibles. |
| Abandonar | Navegar fuera con una selección en curso pide confirmación. Es el único sitio de la aplicación donde se pregunta al salir. |
| Una sola petición | El envío es atómico (RN-09). No hay grabado parcial por pasos: hasta pulsar "Confirmar reserva" no se ha escrito nada. |
| Reintento | Un fallo deja el asistente intacto en el paso 3. Reintentar es volver a pulsar el botón, no rehacer el flujo. |
| Salida | El éxito **siempre** lleva a `/pages/reservation`, nunca de vuelta al panel. El usuario quiere ver lo que acaba de registrar. |

### 3.2 Qué pasa en el otro lado

```
ReservationController -- @Valid --> IReservationService.save()
                                          |  una sola transacción:
                                          |  1. inserta reservation
                                          |  2. inserta reservation_detail (cascade ALL)
                                          |  3. book.available = false  (RN-07)
                                          v
                              201 + Location: /v1/reservations/{id}
```

La comprobación de RN-06 y RN-08 se hace **en el servicio**, no solo en el asistente. El
paso 2 filtra los libros no disponibles por comodidad; la regla la aplica el backend, y una
llamada directa a la API recibe el mismo rechazo (RNF-10, CP-25).

---

## 4. Flujos de mantenimiento

Los tres mantenimientos -libros, categorías, clientes- comparten un flujo idéntico. Se
describe una vez.

```
 /pages/<recurso>
      |
      |  el store carga (httpResource) --- $loading --- $error --> banner + "Reintentar"
      v
 tabla con filtros
      |
      +-- "Nuevo ..."        --> diálogo vacío --+
      +-- fila -> editar    --> diálogo cargado +
      |                                        v
      |                             Guardar -> POST | PUT
      |                                        |
      |                        +---------------+--------------+
      |                     201 / 200                        400
      |                        |                              |
      |                        v                              v
      |            cierra - snackbar - reload()    el diálogo permanece abierto,
      |                                            el error se pinta bajo su campo
      |
      +-- fila -> eliminar  --> confirmación que nombra el registro
                                       | DELETE
                            +----------+----------+
                          204                   rechazo controlado
                            |                        |
                            v                        v
                snackbar - reload()      diálogo con el motivo:
                                         "No se puede eliminar: tiene N libros"
```

Particularidades de cada uno:

| Pantalla | Qué añade al flujo común |
|---|---|
| `category` | El borrado con libros asociados se rechaza y el mensaje dice **cuántos** (RN-11). Desactivar (`status`) es la salida real: la categoría deja de ofrecerse al clasificar, pero los libros ya clasificados la conservan (RN-14). |
| `book` | El ISBN duplicado se rechaza señalando el campo `isbn` (RN-02). El desplegable de categoría lista **solo activas**. |
| `client` | La fila tiene una acción más: **"Ver reservas"**, que navega a `/pages/reservation` filtrado por ese cliente (RF-11). Es el único salto entre pantallas de gestión. |

El listado de reservas (`/pages/reservation`) sigue el mismo esquema pero **no tiene alta ni
edición**: se registra desde el asistente y se elimina con confirmación. Su borrado advierte
por escrito la consecuencia de RN-13 - los libros vuelven a estar disponibles.

---

## 5. Flujo del asistente de IA

```
 /pages/assistant
      |
      | el usuario escribe una pregunta en español
      v
 POST /v1/agents  { "message": "¿Qué libros de poesía hay disponibles?" }
      |
      | el agente consulta catálogo y reservas con sus herramientas (@Tool)
      v
 respuesta en Markdown --> se renderiza con `marked` en la columna de conversación
```

| Aspecto | Regla |
|---|---|
| Acceso | **Solo lectura.** El asistente informa; no registra reservas ni modifica el catálogo (RF-14). |
| Continuidad | La conversación mantiene memoria (`spring_ai_chat_memory`), así que una segunda pregunta puede referirse a la anterior. |
| Sin clave de OpenAI | La pantalla informa de que la función no está configurada. **El resto de la aplicación sigue operando** (R-05 de AN010): el asistente no es un punto único de fallo. |
| Salida del flujo | No hay: el asistente no navega a otras pantallas ni devuelve enlaces accionables. Si menciona un libro, el usuario lo busca en *Libros*. |

---

## 6. Flujos transversales

Lo que puede ocurrir en cualquier pantalla. Se resuelve en un sitio, no en cada componente
(TW-08).

| Situación | Dónde se trata | Comportamiento |
|---|---|---|
| Error de red o 5xx | `server-error.interceptor.ts` | Reintenta `environment.RETRY` veces; si persiste, el store expone `$error` y la pantalla muestra el banner con "Reintentar" |
| `401 Unauthorized` | `server-error.interceptor.ts` | Se limpia la sesión y se redirige a `/login`. No se muestra banner: la sesión caducada no es un error de la pantalla |
| `403 Forbidden` | `server-error.interceptor.ts` | Navega a `/403` (`Not403Component`) |
| `404` de recurso | El componente que lo pidió | Snackbar "El registro ya no existe" y `reload()` de la tabla. No se navega a la página de error: el usuario sigue donde estaba |
| Ruta inexistente | `app.routes.ts` (`/**`) | `Not404Component`, con enlace de vuelta al panel |
| `400` de validación | El formulario que lo provocó | El mensaje del backend se pinta bajo el campo, tal cual llega (PX-04 de AN050) |
| Operación correcta | El componente | Snackbar breve y recarga. Nunca un diálogo de éxito |

**La distinción que importa:** un 404 de *ruta* es un error de navegación y merece pantalla
propia; un 404 de *recurso* es un dato que ya no está, y sacar al usuario de su tabla por
eso es peor que decírselo y refrescar.

---

## 7. Contratos que sostienen la navegación

Cada salto de este documento depende de un endpoint concreto. Si el contrato cambia, el
flujo cambia con él.

| Flujo | Endpoint | Qué exige la navegación |
|---|---|---|
| sección 3 paso 1 | `GET /v1/clients` | Lista completa; el filtro por nombre y documento se hace en el cliente |
| sección 3 paso 2 | `GET /v1/books` | Cada libro trae `available` y su categoría resuelta, para filtrar sin una segunda llamada |
| sección 3 envío | `POST /v1/reservations` | 201 con cabecera `Location`; el identificador nuevo es lo que permite resaltar la fila de destino |
| sección 3 destino | `GET /v1/reservations` | Trae **cliente y títulos resueltos**: RF-10 exige verlos sin navegar, y resolverlos con N peticiones sería peor |
| sección 4 `client` -> reservas | `GET /v1/reservations/client/{id}` | Endpoint propio (RF-11); no se filtra el listado completo en el navegador |
| sección 4 borrados | `DELETE /v1/{recurso}/{id}` | 204 en el caso correcto; rechazo **controlado** -nunca un 500- cuando una FK lo impide (RN-11, RN-12) |
| sección 5 | `POST /v1/agents` | Respuesta en Markdown, en español |

**La dependencia más frágil** es la de `GET /v1/reservations`: si la respuesta dejara de
traer los títulos resueltos, la tabla de Reservas no podría cumplir RF-10 y habría que
inventar una pantalla de detalle. Por eso el contrato de AN010 sección 6.3.1 los incluye de forma
explícita y no como añadido opcional.

---

## Referencias

- [`AN050-diseño-ui-ux.md`](AN050-diseño-ui-ux.md) - cómo se ve cada pantalla de estos flujos.
- [`AN010-análisis-técnico-funcional.md`](AN010-análisis-técnico-funcional.md) - reglas RN-01 a RN-14 y contrato de servicios (sección 6.3).
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - enrutado, interceptores y guarda (sección 4.2).
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - RF-01 a RF-19 y sus prioridades.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - TW-02, TW-08 y códigos de respuesta (sección 5.1).
