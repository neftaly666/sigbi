# GUÍA DE PRUEBA DE ACEPTACIÓN

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN120` - N.º AN-2026-012

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN120 |
| Versión | 1.0 |
| Fecha | 2026-09-14 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Cubre | Los 26 casos de prueba de AN010 sección 8.1 |
| Duración estimada | 90 minutos |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial. Convierte la matriz CP-01...CP-26 de AN010 en un recorrido ejecutable con acta de conformidad. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

## 1. Qué prueba esta guía y quién la ejecuta

**Qué prueba.** Que SIGBI hace lo que AN030 dice que debe hacer, comprobado **desde fuera**:
desde la interfaz, como lo usaría un bibliotecario, y desde la API, como lo usaría alguien
que se salte la interfaz.

**Qué no prueba.** Rendimiento, concurrencia, seguridad ofensiva, compatibilidad entre
navegadores ni el aspecto visual. Tampoco prueba el código por dentro: aquí no se lee un
fuente.

**Quién la ejecuta.** Una persona que **no** escribió el código. Si no la hay, quien lo
escribió, pero siguiendo el guion al pie de la letra y sin arreglar nada por el camino: el
objetivo es encontrar fallos, no demostrar que no los hay.

**Cuándo.** Después de H-2 (2026-09-25) y antes de la entrega. Si algo falla, se anota, se
corrige y **se repite el recorrido entero** - no solo el caso que falló.

### 1.1 Cómo se registra el resultado

Cada paso tiene un identificador y una casilla. Tres resultados posibles:

| Marca | Significado |
|---|---|
| **OK** | Ocurrió exactamente lo descrito |
| **FALLA** | No ocurrió. Se anota qué pasó en su lugar |
| **N/A** | El requisito no está implementado por un recorte planificado (sección 7.2 de AN080). Se anota cuál |

**N/A no es OK.** Un recorte consciente se registra como recorte; se cuenta aparte en el
acta de sección 7.

---

## 2. Antes de empezar

### 2.1 Entorno

Debe estar en marcha lo de AN110: PostgreSQL con la base `sigbi`, el backend en `:8080` y
el frontend en `:4200`.

| # | Comprobación previa | OK |
|---|---|---|
| E-01 | `curl -i http://localhost:8080/v1/books` responde `200` o `401` | [ ] |
| E-02 | `http://localhost:4200` carga la aplicación | [ ] |
| E-03 | Los seis destinos del menú abren su pantalla sin banner de error | [ ] |
| E-04 | Se anota si la autenticación está activa o desactivada | [ ] |

Si E-01 a E-03 no pasan, **no siga**: el problema es de instalación, no de aceptación.
Vuelva a AN110 sección 7.

### 2.2 Datos que deben estar cargados

El juego canónico de AN050 sección 8, cargado **por la API** (AN110 sección 6):

| Elemento | Cantidad | Detalle |
|---|---|---|
| Categorías | 6 | Narrativa, Informática, Ciencia, Historia, Infantil y **Hemeroteca (inactiva)** |
| Libros | 24 | Cuatro por categoría, todos disponibles al inicio |
| Clientes | 5 | Documento de 8 dígitos, correo ficticio |
| Reservas | 3 | Una de 1 libro, una de 3 y una de 2 |

Con esas tres reservas, **6 de los 24 libros quedan no disponibles**.

| # | Comprobación de datos | OK |
|---|---|---|
| D-01 | La tabla de categorías muestra 6, con Hemeroteca marcada *Inactiva* | [ ] |
| D-02 | La tabla de libros muestra 24 | [ ] |
| D-03 | Filtrando por *Reservados* aparecen 6 libros | [ ] |
| D-04 | La tabla de clientes muestra 5 | [ ] |
| D-05 | La tabla de reservas muestra 3 | [ ] |

> **Si D-03 devuelve 0 libros reservados** y D-05 sí muestra las tres reservas, el control
> de disponibilidad (RF-15) no está operando. Anótelo aquí mismo: cambia el resultado
> esperado de los pasos 3.6, 4.5 y 5.3.

### 2.3 Los accesos de la prueba

| Si la autenticación está... | Haga esto |
|---|---|
| **Activa** | Consiga un usuario de prueba en Supabase. Necesitará además un token para los pasos por API: cópielo de las herramientas de desarrollo del navegador, cabecera `Authorization` |
| **Desactivada** | No necesita nada. Anótelo en el acta: es una opción legítima del enunciado, no un defecto |

### 2.4 El caso de prueba

Todo el recorrido gira en torno a una reserva concreta, para que los pasos se encadenen:

| Dato | Valor |
|---|---|
| Cliente | El **tercero** de la lista (el que ya tiene 2 reservas) |
| Libros | Tres títulos **disponibles**, de tres categorías distintas |
| Categoría nueva | *Cartografía* - se crea en el paso 3.1 y se elimina en el 5.4 |

Anote aquí los tres títulos antes de empezar; los va a necesitar cuatro veces:

```
Libro A: ______________________________
Libro B: ______________________________
Libro C: ______________________________
```

---

## 3. Recorrido principal

Ejecute en orden. Cada paso depende del anterior.

### 3.1 Mantenimiento de categorías

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 3.1.1 | *Categorías* -> *Nueva categoría*. Nombre "Cartografía", descripción "Mapas y atlas", activa. Guardar | Se guarda, se cierra el diálogo, aparece en la tabla | CP-01 | [ ] |
| 3.1.2 | *Nueva categoría* con el nombre vacío. Guardar | Rechazo con mensaje **bajo el campo Nombre**. El diálogo no se cierra | CP-02 | [ ] |
| 3.1.3 | Editar "Cartografía": cambiar la descripción. Guardar | Se guarda y la tabla lo refleja | - | [ ] |
| 3.1.4 | Abrir el desplegable de categoría en el formulario de un libro | Aparece "Cartografía"; **no** aparece "Hemeroteca" (inactiva) | RN-14 | [ ] |

### 3.2 Mantenimiento de libros

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 3.2.1 | *Libros* -> *Nuevo libro*. Título, autor, ISBN nuevo de 13 dígitos, categoría "Cartografía", disponible. Guardar | Se guarda y aparece en la tabla con el chip de su categoría | CP-04 | [ ] |
| 3.2.2 | *Nuevo libro* con el **mismo ISBN** del anterior | Rechazo con mensaje **bajo el campo ISBN** | CP-05 | [ ] |
| 3.2.3 | *Nuevo libro* sin elegir categoría | Rechazo señalando la categoría | CP-06 | [ ] |
| 3.2.4 | *Nuevo libro* con un título de 200 caracteres | Rechazo controlado. **No** una pantalla de error ni texto en inglés | CP-07 | [ ] |
| 3.2.5 | Buscar por el autor de un libro conocido | La tabla filtra correctamente | RF-16 | [ ] |
| 3.2.6 | Filtrar por la categoría "Narrativa" | Solo aparecen libros de Narrativa | RF-16 | [ ] |

### 3.3 Mantenimiento de clientes

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 3.3.1 | *Clientes* -> *Nuevo cliente* con datos válidos. Guardar | Se guarda y aparece en la tabla | - | [ ] |
| 3.3.2 | *Nuevo cliente* con el correo `ana@` | Rechazo **bajo el campo Correo** | CP-08 | [ ] |
| 3.3.3 | *Nuevo cliente* con el documento `1234567` (7 dígitos) | Rechazo **bajo el campo Documento** | CP-09 | [ ] |

### 3.4 Registro de la reserva - el caso central

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 3.4.1 | *Nueva reserva* desde el panel | Se abre el asistente en el paso 1 | RF-08 | [ ] |
| 3.4.2 | Intentar *Siguiente* sin elegir cliente | El botón está deshabilitado | AN060 sección 3.1 | [ ] |
| 3.4.3 | Buscar el cliente del caso por su documento y seleccionarlo. *Siguiente* | Avanza al paso 2 | - | [ ] |
| 3.4.4 | Observar la lista de libros | **Solo aparecen los disponibles.** Los 6 reservados no están | CP-15 - RN-06 | [ ] |
| 3.4.5 | Intentar *Siguiente* sin elegir ningún libro | El botón está deshabilitado | CP-13 - RN-04 | [ ] |
| 3.4.6 | Seleccionar los libros A, B y C | Aparecen como etiquetas sobre la lista | - | [ ] |
| 3.4.7 | Intentar seleccionar el libro A **otra vez** | Aparece marcado; no se añade dos veces | CP-16 - RN-08 | [ ] |
| 3.4.8 | Volver al paso 1, cambiar de cliente y avanzar | **Los tres libros siguen seleccionados** | AN060 sección 3.1 | [ ] |
| 3.4.9 | Volver a elegir el cliente del caso. *Siguiente* hasta el paso 3 | El resumen muestra cliente, los 3 libros y la fecha | - | [ ] |
| 3.4.10 | Intentar editar la fecha | **No es editable** | CP-18 - RN-10 | [ ] |
| 3.4.11 | *Confirmar reserva* | Va al listado de reservas con la nueva destacada y un aviso breve | CP-12 | [ ] |

### 3.5 Lo que quedó registrado

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 3.5.1 | Mirar la fila de la reserva nueva | Muestra fecha, cliente y **los tres títulos en la propia fila**, sin abrir nada | CP-20 - RF-10 | [ ] |
| 3.5.2 | Comprobar la fecha | Es la de hoy con la hora real del registro | RN-10 | [ ] |
| 3.5.3 | *Clientes* -> fila del cliente del caso -> *Ver reservas* | Aparecen **exactamente 3**: sus 2 anteriores y la nueva | CP-21 - RF-11 | [ ] |
| 3.5.4 | *Libros* -> filtrar por *Reservados* | Los libros A, B y C están ahora aquí: **9 reservados** | CP-17 - RN-07 | [ ] |

> Si 3.5.4 sigue mostrando 6, RF-15 no está implementado. Márquelo **N/A** y anote el
> recorte, en lugar de FALLA.

### 3.6 Eliminación de la reserva

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 3.6.1 | Pulsar la papelera de la reserva nueva | Diálogo que **nombra la reserva y advierte que sus libros volverán a estar disponibles** | RN-13 | [ ] |
| 3.6.2 | Confirmar | La reserva desaparece del listado | CP-22 | [ ] |
| 3.6.3 | Filtrar libros por *Disponibles* | A, B y C han vuelto: **18 disponibles** | CP-22 - RN-13 | [ ] |

---

## 4. Las reglas que deben rechazar

Aquí es donde se distingue un sistema con reglas de uno con formularios bonitos. **Todos
estos pasos deben fallar**, y fallar bien: mensaje claro en español, sin traza técnica y
sin quedar a medias.

### 4.1 Desde la interfaz

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 4.1.1 | Eliminar la categoría "Narrativa" (tiene libros) | Rechazo que dice **cuántos libros** lo impiden | CP-03 - RN-11 | [ ] |
| 4.1.2 | Eliminar un cliente con reservas | Rechazo controlado. **No** un error de servidor | CP-10 - RN-12 | [ ] |
| 4.1.3 | Eliminar un libro que está en una reserva | Rechazo controlado | CP-12 - RN-12 | [ ] |

### 4.2 Desde la API - **el paso que no se puede saltar**

Una validación que solo vive en el formulario de Angular no es una regla: es una sugerencia.
Estos pasos comprueban que la regla existe de verdad.

Si la autenticación está activa, añada `-H "Authorization: Bearer <token>"` a cada llamada.

| # | Llamada | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 4.2.1 | `POST /v1/reservations` con `{"idClient":3,"details":[]}` | **400** con mensaje explícito. **Nunca 201 ni 500** | **CP-25** - RN-04 | [ ] |
| 4.2.2 | `POST /v1/reservations` sin `idClient` | 400 señalando `idClient` | CP-14 - RN-03 | [ ] |
| 4.2.3 | `POST /v1/reservations` con el mismo `idBook` dos veces | 400 con mensaje explícito | CP-16 - RN-08 | [ ] |
| 4.2.4 | `POST /v1/reservations` con un libro **no disponible** | Rechazo, con el título en el mensaje | CP-15 - RN-06 | [ ] |
| 4.2.5 | `POST /v1/reservations` con un libro válido y otro **inexistente** | Rechazo y, sobre todo: **no se graba nada**. Comprobar en el listado que no hay reserva nueva | **CP-19** - RN-09 | [ ] |
| 4.2.6 | `POST /v1/reservations` con `reservationDate` en el pasado | Se ignora; la reserva queda con la fecha del servidor | CP-18 - RN-10 | [ ] |
| 4.2.7 | `GET /v1/books/9999` | **404** con cuerpo de error en JSON, **sin traza de Java** | CP-23 - RF-13 | [ ] |
| 4.2.8 | `POST /v1/books` con el ISBN de un libro existente | 400 señalando `isbn` | CP-05 - RN-02 | [ ] |

Comando de referencia para 4.2.1:

```bash
curl -i -X POST http://localhost:8080/v1/reservations \
     -H 'Content-Type: application/json' \
     -d '{"idClient":3,"details":[]}'
```

> **4.2.1 y 4.2.5 son los dos pasos críticos de toda la guía.** El primero demuestra que la
> regla vive en el backend; el segundo, que la transacción es real. Si alguno falla, la
> aceptación no se firma aunque todo lo demás esté en verde.

---

## 5. Comprobaciones de cierre

### 5.1 El asistente de IA

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 5.1.1 | Preguntar *"¿Qué libros de historia hay disponibles?"* | Responde **en español** con títulos reales del catálogo | CP-26 - RF-14 | [ ] |
| 5.1.2 | Preguntar *"¿y de ciencia?"* | Entiende que sigue hablando de libros disponibles | - | [ ] |
| 5.1.3 | Pedirle *"registra una reserva para María"* | **No la registra.** Indica dónde hacerlo | RF-14 | [ ] |

Sin clave de OpenAI, 5.1.1 a 5.1.3 son **N/A** y la pantalla debe avisar de que no está
configurado. El resto del sistema sigue funcionando: compruébelo abriendo *Libros*.

### 5.2 Manejo de errores

| # | Acción | Resultado esperado | CP | OK |
|---|---|---|---|---|
| 5.2.1 | **Detener el backend** y recargar *Libros* | Banner de error con botón *Reintentar*. **Ni pantalla en blanco ni texto técnico** | RF-13 | [ ] |
| 5.2.2 | Arrancar el backend y pulsar *Reintentar* | La tabla carga | AN050 sección 6 | [ ] |
| 5.2.3 | Navegar a `http://localhost:4200/pages/inventado` | Página de no encontrado, con vuelta al panel | AN060 sección 6 | [ ] |
| 5.2.4 | Revisar cualquier mensaje de error visto hoy | Ninguno contiene una traza de Java ni texto en inglés | CP-24 - RNF-03 | [ ] |

### 5.3 Interfaz y accesibilidad

| # | Acción | Resultado esperado | OK |
|---|---|---|---|
| 5.3.1 | Estrechar la ventana a 390 px en *Libros* | Se reorganiza en tarjetas. **Sin barra de desplazamiento horizontal** (RNF-07) | [ ] |
| 5.3.2 | Recorrer un formulario con el tabulador | El foco se ve siempre | [ ] |
| 5.3.3 | Revisar las pantallas visitadas | **Ningún texto visible en inglés** (RNF-03) | [ ] |
| 5.3.4 | Vaciar el filtro de búsqueda con un término imposible | Mensaje de *sin resultados*, distinto del de tabla vacía | [ ] |

### 5.4 Limpieza y estado final

| # | Acción | Resultado esperado | OK |
|---|---|---|---|
| 5.4.1 | Eliminar el libro creado en 3.2.1 | Se elimina (no está en ninguna reserva) | [ ] |
| 5.4.2 | Eliminar la categoría "Cartografía" | Se elimina: ya no tiene libros | [ ] |
| 5.4.3 | Eliminar el cliente creado en 3.3.1 | Se elimina: no tiene reservas | [ ] |
| 5.4.4 | Contar libros, clientes, categorías y reservas | **24 - 5 - 6 - 3** - el estado inicial | [ ] |
| 5.4.5 | Filtrar libros por *Reservados* | **6** - como al empezar | [ ] |

5.4.4 y 5.4.5 son la comprobación de que el sistema no dejó basura: si los números no
cuadran, algo se grabó donde no debía o no se borró lo que debía.

---

## 6. Después de la prueba

| # | Tarea |
|---|---|
| 1 | Anotar cada **FALLA** con: paso, qué se esperaba, qué ocurrió y captura si la hay |
| 2 | Anotar cada **N/A** con el recorte de sección 7.2 de AN080 que lo justifica |
| 3 | Corregir las FALLA y **repetir el recorrido entero**, no solo los pasos corregidos |
| 4 | Incorporar las capturas de la aplicación real a AN050 sección 7.2 y a AN100 |
| 5 | Pasar AN100 de **Provisional** a **Vigente** si el comportamiento coincide con lo descrito; corregirlo si no |
| 6 | Cumplimentar AN130 con las versiones desplegadas y el resultado |

**Por qué se repite entero (tarea 3):** una corrección puede romper un paso que ya pasaba.
Es exactamente el caso de las reglas de sección 4, que comparten el servicio de reserva.

---

## 7. Acta de conformidad

### 7.1 Resumen

| Bloque | Pasos | OK | FALLA | N/A |
|---|---|---|---|---|
| 2. Entorno y datos | 9 | | | |
| 3. Recorrido principal | 31 | | | |
| 4. Reglas que deben rechazar | 11 | | | |
| 5. Comprobaciones de cierre | 16 | | | |
| **Total** | **67** | | | |

### 7.2 Condiciones para firmar

La aceptación se firma si, y solo si:

| # | Condición |
|---|---|
| 1 | **Cero FALLA** en el bloque 4 (las reglas). Son la diferencia entre un sistema y un formulario |
| 2 | **4.2.1 y 4.2.5 en OK.** Sin excepción |
| 3 | Cero FALLA en el recorrido principal (bloque 3) |
| 4 | Ningún mensaje de error con traza técnica o texto en inglés (5.2.4) |
| 5 | Los **N/A** se corresponden con recortes planificados en sección 7.2 de AN080. Un N/A sin recorte documentado es una FALLA |
| 6 | 5.4.4 y 5.4.5 devuelven el estado inicial |

### 7.3 Resultado

| | |
|---|---|
| Fecha de ejecución | |
| Ejecutado por | |
| Versión del backend | |
| Versión del frontend | |
| Autenticación | [ ] Activa [ ] Desactivada |
| Asistente de IA | [ ] Configurado [ ] Sin clave |
| **Resultado** | [ ] **CONFORME** [ ] **CONFORME CON RECORTES** [ ] **NO CONFORME** |

**Recortes aceptados** (si procede):

```
_______________________________________________________________
_______________________________________________________________
```

**Fallas pendientes** (si procede):

```
_______________________________________________________________
_______________________________________________________________
```

| Rol | Nombre | Firma | Fecha |
|---|---|---|---|
| Ejecutor de la prueba | | | |
| Responsable del sistema | | | |

---

## Referencias

- [`AN010-análisis-técnico-funcional.md`](AN010-análisis-técnico-funcional.md) - matriz CP-01 a CP-26 (sección 8.1) y reglas RN-01 a RN-14 (sección 4).
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - RF y RNF verificados.
- [`AN050-diseño-ui-ux.md`](AN050-diseño-ui-ux.md) - juego de datos canónico (sección 8) y estados de pantalla (sección 6).
- [`AN080-plan-de-implementación.md`](AN080-plan-de-implementación.md) - sección 7.2: los recortes que justifican un N/A.
- [`AN100-manual-de-usuario.md`](AN100-manual-de-usuario.md) - comportamiento que esta guía contrasta.
- [`AN110-manual-de-instalación.md`](AN110-manual-de-instalación.md) - puesta en marcha del entorno de prueba.
- [`AN130-acta-de-puesta-en-operación.md`](AN130-acta-de-puesta-en-operación.md) - acta que recoge este resultado.
