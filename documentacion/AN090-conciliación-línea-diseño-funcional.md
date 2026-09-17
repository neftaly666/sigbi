# CONCILIACIÓN DE LA LÍNEA DE DISEÑO FUNCIONAL

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN090` - N.º AN-2026-009

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN090 |
| Versión | 1.6 |
| Fecha | 2026-09-17 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Artefactos cotejados | Diseño de Figma (`diseño/figma-plugin/code.js`) - AN010 - AN030 - AN050 - AN070 - la aplicación publicada, en escritorio y en teléfono |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial. Primer cotejo completo del diseño contra el análisis funcional y el esquema. 16 divergencias registradas. |
| 1.1 | 2026-09-14 | D. Quispe | DV-11 resuelta: AN010 sección 8.2 corregida con los nombres del diseño. Quedan 15 divergencias abiertas. |
| 1.2 | 2026-09-14 | D. Quispe | Correcciones aplicadas al generador. El segundo pase destapó cinco divergencias más (DV-17 a DV-21), una de ellas grave: el asistente aparecía registrando una reserva. Total: 21 registradas, 17 resueltas. |
| 1.3 | 2026-09-14 | D. Quispe | Archivo de Figma regenerado desde el generador corregido. Dos divergencias más: DV-22 (texto en inglés en chips) y DV-23, que solo se vio al mirar el resultado renderizado. Total: 23 registradas, 19 resueltas. |
| 1.4 | 2026-09-17 | D. Quispe | Se registran las dos primeras divergencias **surgidas al implementar**, no al cotejar el diseño: DV-25 (paleta del gráfico del panel, por contraste) y DV-26 (nombre completo del sistema en la marca del menú). Se restaura además **DV-24**, que la sección 6.3 citaba pero que nunca llegó a la tabla de la sección 4. Total: 26 registradas, 22 resueltas. |
| 1.5 | 2026-09-17 | D. Quispe | Primer cotejo **desde un teléfono** y contra la aplicación publicada (sección 4.7): DV-35 a DV-38. Tres de las cuatro solo se manifiestan en un navegador móvil -autocorrección del teclado, `100vh` que miente, pie de menú que desaparece con el lateral-, así que ninguna revisión de escritorio podía verlas. **DV-34 queda superada por DV-38**: se resolvió sobre la premisa de que no había sesión, y publicar con `AUTH_ENABLED=true` la invalidó. Total: 38 registradas, 33 resueltas. |
| 1.6 | 2026-09-17 | D. Quispe | DV-39. Probada la aplicación en el teléfono, el nombre del sistema del `login` se veía pequeño: llevaba un 12 px que la escala no tiene. Comprobarlo destapó que AN050 sección 2.5 publicaba siete pasos mientras 3.3 y 3.5 mandaban otros cuatro sin recoger. Se publica la escala menor y la regla de que el contenido nunca baja de 14. Total: 39 registradas, 34 resueltas. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

## 1. Qué concilia este documento

SIGBI se especificó en tres sitios que se escribieron en momentos distintos:

| Línea | Artefacto | Qué fija |
|---|---|---|
| **Funcional** | AN010, AN030 | Reglas de negocio, requerimientos, datos de prueba |
| **De datos** | AN070, EST010 | Tablas, columnas, tipos, restricciones |
| **De diseño** | Figma + AN050 | Pantallas, columnas visibles, rótulos, estados |

Cuando tres documentos describen lo mismo, siempre acaban discrepando en algo. Esas
discrepancias son baratas de arreglar mientras no hay código y caras después: una columna
que el diseño muestra y el DTO no trae se descubre construyendo la pantalla, con la semana
del frontend ya empezada.

**Este documento las busca a propósito, antes de construir nada.**

### 1.1 Qué es una divergencia y qué no

Una divergencia es una **diferencia de contenido entre dos artefactos vigentes**: el diseño
dice una cosa, el análisis dice otra, y las dos están aprobadas.

No son divergencias, y no se registran aquí:

- Lo que el diseño detalla y el análisis no menciona porque es competencia del diseño
  (espaciados, tonos, microcopia).
- Lo que el análisis marca como **por construir**: ausencia de código no es discrepancia.
- Los errores tipográficos.

### 1.2 Método y jerarquía

Cotejo de cada artboard del generador contra la especificación de pantalla de AN010 sección 6.2,
el contrato de AN010 sección 6.3 y el esquema de AN070 sección 2.

Para resolver un empate, la jerarquía es:

```
enunciado del curso  >  AN030 (qué debe hacer)  >  AN070 (qué se puede guardar)
                                                          >  AN050 / Figma (cómo se ve)
```

**El diseño cede ante el modelo de datos**, no al revés - salvo que la comprobación
demuestre que el modelo se quedó corto, en cuyo caso se cambia el modelo explícitamente y
se anota en AN070. Una pantalla que muestra un dato que no existe no es un diseño ambicioso:
es una pantalla que no se puede construir.

---

## 2. Correspondencia de artefactos

Los diez artboards, con su componente, su requerimiento, su endpoint y sus tablas. Ningún
artboard queda sin requerimiento y ningún requerimiento de prioridad A queda sin artboard.

| Artboard | Componente | RF | Endpoint | Tablas |
|---|---|---|---|---|
| `login` | `LoginComponent` | RF-18 (C) | Supabase Auth | - |
| `dashboard` | `DashboardComponent` | RF-17 (B) | agregados | todas (lectura) |
| `book` | `BookComponent` | RF-03, RF-04, RF-16 | `/v1/books` | `book`, `category` |
| `book-dialog` | `BookDialogComponent` | RF-03, RF-05 | `/v1/books` | `book`, `category` |
| `client` | `ClientComponent` | RF-06, RF-07 | `/v1/clients` | `client` |
| `category` | `CategoryComponent` | RF-01, RF-02 | `/v1/categories` | `category` |
| `reservation-wizard` | `ReservationWizardComponent` | RF-08, RF-09, RF-15 | `POST /v1/reservations` | las cinco |
| `reservation` | `ReservationComponent` | RF-10, RF-11 | `/v1/reservations` | `reservation`, `reservation_detail`, `client`, `book` |
| `assistant` | `AssistantComponent` | RF-14, RF-19 (C) | `/v1/agents` | lectura |
| `book-mobile` | `BookComponent` (390 px) | RNF-07 | `/v1/books` | `book`, `category` |

**Cobertura inversa.** RF-12 (validación) y RF-13 (excepciones) no tienen artboard propio
porque son transversales: se manifiestan en el estado de error de cada campo y en el banner
de cada pantalla (AN050 sección 6). Están cubiertos, no olvidados.

---

## 3. Equivalencia de vocabulario

La convención -identificadores en inglés, interfaz en español- obliga a mantener una tabla
de traducción. Si no está escrita, cada pantalla la reinventa.

| Rótulo en pantalla | Campo del DTO | Columna | Documento que manda |
|---|---|---|---|
| Título | `title` | `book.title` | AN070 |
| Autor | `author` | `book.author` | AN070 |
| ISBN | `isbn` | `book.isbn` | AN070 |
| Categoría | `idCategory` / `category.name` | `book.id_category` | AN070 |
| Disponible / Reservado | `available` | `book.available` | AN070 |
| Nombres | `firstName` | `client.first_name` | AN070 |
| Apellidos | `lastName` | `client.last_name` | AN070 |
| **Documento** | `dni` | `client.dni` | DM-06 de AN010 |
| Correo | `email` | `client.email` | AN070 |
| Nombre (categoría) | `name` | `category.name` | AN070 |
| Descripción | `description` | `category.description` | AN070 |
| Activa / Inactiva | `status` | `category.status` | AN070 |
| Fecha | `reservationDate` | `reservation.reservation_date` | RN-10 |
| Cliente | `client` | `reservation.id_client` | AN070 |
| Libros reservados | `details[].book.title` | `reservation_detail.id_book` | AN010 sección 6.3.1 |

**El caso que se explica siempre.** Este campo tiene tres nombres y los tres son
deliberados: el enunciado lo llama *cedula*, el código lo llama `dni` -por coherencia con
`Patient` del proyecto base- y el rótulo de pantalla dice **Documento**, que no presupone
el tipo de documento ni el país. No es un descuido: es la separación entre identificador y
texto visible (DA-05). El rótulo cambió el 2026-09-16 y aparece así en los tres sitios donde
se ve: la columna de la tabla, el campo del formulario y el resumen del asistente de reserva.
La columna de Supabase **no se tocó**: sigue siendo `dni`.

### 3.1 Vocabulario que el diseño introduce y el modelo no admite

| Término del diseño | Problema | Resolución |
|---|---|---|
| "Reservas **activas**" (columna y filtro de `client`) | El modelo no tiene estado de reserva: DM-05 excluye caducidad y devolución, así que **toda reserva es activa** y el adjetivo distingue de nada | DV-03 |
| "Código" `R-0152` (columna de `reservation`) | `reservation` tiene `id_reservation`, `reservation_date` e `id_client`. No hay columna de código | DV-05 |
| "Publicaciones **retiradas de circulación**" (descripción de Hemeroteca) | Describe un estado de ejemplar que no existe; es texto de catálogo, no funcionalidad | Ninguna: es descripción libre de una categoría |

---

## 4. Divergencias detectadas

Veintiséis. Ordenadas por gravedad, no por pantalla.

Salieron de tres momentos distintos, y la distinción importa porque cada uno enseña algo
que el anterior no podía ver:

1. **El primer cotejo** (DV-01 a DV-16): leer el diseño contra el análisis.
2. **Aplicar las correcciones** (DV-17 a DV-23): al abrir el generador para cambiar un
   color aparecieron cosas que el artboard renderizado no enseña. Es el argumento para
   cotejar contra el código del diseño y no contra su captura.
3. **Construir la aplicación** (DV-25, DV-26): las únicas que no son errores del diseño
   sino **decisiones tomadas al implementar** que se apartan de él a propósito. Se
   registran aquí para que el diseño y el código no se contradigan en silencio.

**Gravedad:** **Alta** = impide construir la pantalla tal como está diseñada -
**Media** = se puede construir, pero incumple un requisito o promete algo que el backend no
hace - **Baja** = cosmética o de datos de muestra.

### 4.1 Gravedad alta

| ID | Divergencia | Artefactos en conflicto | Resolución |
|---|---|---|---|
| **DV-01** | El fondo del artboard `book-dialog` es `#0B1413`, un verde casi negro que **no pertenece a la paleta**. Los diálogos van sobre `Surface` con velo `Scrim` al 32 % | Generador línea 722 <-> AN050 sección 2.2, sección 4 | Corregir el generador: `bg: C.surf`. Es resto de una paleta teal descartada antes de fijar el índigo. **Ningún contraste de este diálogo está calculado**, porque su fondo no está en la tabla de sección 5 de AN050 |
| **DV-02** | La columna **RESERVAS ACTIVAS** de `client` muestra un conteo que `ClientDTO` no trae y que ningún endpoint calcula. Además "activas" no existe como concepto (DM-05) | Generador `screenClient` <-> AN010 sección 6.2.3, sección 6.3 <-> AN070 sección 2.2 | **Vocabulario corregido** el 2026-09-14: la columna y el filtro dicen "Reservas". Queda abierto si se añade `reservationCount` al DTO o se retira la columna - es **DP-01**, y es más barato quitar una columna que inventar un endpoint |
| **DV-03** | La columna **LIBROS** de `category` muestra un conteo que `CategoryDTO` no trae | Generador `screenCategory` <-> AN010 sección 6.2.1 <-> AN070 sección 2.1 | **Añadir `bookCount` al DTO de lectura.** Aquí el modelo se quedó corto: RN-11 exige un mensaje que diga *cuántos* libros impiden el borrado, así que el conteo hace falta de todos modos. La pantalla lo adelanta, no lo inventa |

### 4.2 Gravedad media

| ID | Divergencia | Artefactos en conflicto | Resolución |
|---|---|---|---|
| **DV-04** | La fila de `reservation` muestra un chip "N libros" y los títulos como **texto plano truncado a 250 px**. RF-10 exige ver los libros reservados en la fila | Generador `screenReservation` <-> AN010 sección 6.2.5, RF-10 | Un chip por título y "+N" con emergente para el resto, como especifica AN010. A 250 px, tres títulos se cortan y RF-10 no se cumple |
| **DV-05** | La fila de `reservation` lleva la columna **CÓDIGO** con valores `R-0152`. No hay tal campo en el modelo | Generador <-> AN070 sección 2.2 | Mostrar `idReservation` formateado en la capa de presentación, **sin persistir ningún código**. Si genera dudas, se retira la columna. No se añade una columna a la tabla por un adorno |
| **DV-06** | La única acción de fila de `reservation` es un chevron de detalle. AN010 pide **Ver detalle - Eliminar**, y AN060 establece que no existe ruta de detalle | Generador <-> AN010 sección 6.2.5 <-> AN060 sección 1 | Sustituir por dos acciones: ver (emergente en la propia fila) y eliminar, con la confirmación que advierte RN-13 |
| **DV-07** | La cuarta tarjeta del panel es **Categorías**. AN010 sección 6.2.6 especifica: libros totales, **disponibles**, clientes y reservas | Generador `screenDashboard` <-> AN010 sección 6.2.6 | Sustituir por **"Libros disponibles"**. Es justo el indicador de MN-01 -saber qué está disponible- y es el que falta |
| **DV-08** | Las tarjetas del panel muestran variación temporal: "+32 este mes", "+18 este mes", "2 nuevas" | Generador <-> AN070 sección 2 | **No son calculables.** `book`, `client` y `category` no tienen fecha de alta. Solo "Reservas del mes" lo es, vía `reservation_date`. Se retiran las otras tres. Añadir `created_at` a tres tablas por un texto pequeño amplía el modelo para un adorno |
| **DV-09** | El snackbar de borrado ofrece la acción **DESHACER** | Generador línea 1376 <-> AN010 sección 6.1 <-> AN010 sección 6.3 | Retirar. No hay endpoint de deshacer y RN-13 no tiene inversa: un borrado de reserva devuelve los libros al catálogo y no se puede revertir. El patrón de SIGBI es confirmación **previa** que nombra la consecuencia (PX-05 de AN050), no deshacer posterior. Un botón que promete lo que el backend no cumple es peor que no tenerlo |
| **DV-10** | El snackbar usa `#2E3635`, `#9BF3E8`, `#EDF1F0` y `#7FD7CC`, fuera de la paleta | Generador líneas 1370-1376 <-> AN050 sección 2 | Mismo origen que DV-01: resto de la paleta teal. Sustituir por el neutro oscuro de la escala y su texto correspondiente |

### 4.3 Halladas al aplicar las correcciones

| ID | Divergencia | Gravedad | Artefactos en conflicto | Resolución |
|---|---|---|---|---|
| **DV-21** | *(el artboard que describe ya no existe: DV-32 lo sustituyó por el estado inicial)* En `assistant`, la segunda respuesta es **"Reservation R-0155 created for María Fernández Ruiz with 1 copy: Clean Code"**, con chips de confirmación *R-0155 registrada* y *Ver reserva*. El asistente **registra una reserva**, y lo hace **en inglés** | **Alta** | Generador `screenAssistant` <-> RF-14 <-> AN010 sección 6.2.7 <-> RNF-03, TW-10 <-> AN060 sección 5 | **Corregida.** Es la divergencia más grave del cotejo: el artboard demostraba al asistente haciendo justo lo único que RF-14 le prohíbe, y el paso 5.1.3 de AN120 comprueba que no lo hace. Ahora el hilo está en español y la petición de reserva se **rechaza**, indicando dónde hacerla. El artboard enseña el límite en vez de saltárselo |
| **DV-17** | El formulario de `book-dialog` tiene un campo **Ejemplares**, y el error *"Ya existe un libro con ese ISBN"* colgaba **de ese campo**, no del ISBN | **Alta** | Generador `screenBookDialog` <-> AN010 sección 6.2.2 <-> AN070 sección 2.1 <-> AN030 NO-02 | **Corregida.** `book` no tiene columna de ejemplares y el inventario por ejemplar está fuera de alcance. Además el error colocado bajo el campo equivocado contradice PX-04, que es un principio del propio AN050. Campo retirado; el error va bajo `isbn` |
| **DV-20** | Los títulos de las reservas de maqueta contradicen la tabla de libros: *Cien años de soledad* aparece reservado y a la vez marcado **Disponible**, y *Rayuela* figura en dos reservas a la vez | Media | Generador `screenReservation` <-> `screenBook` <-> RN-07, RN-06 | **Corregida.** Un libro reservado no puede estar disponible (RN-07) ni estar en dos reservas (RN-06). Los títulos de las cinco filas se rehicieron sin solapamientos contradictorios |
| **DV-18** | En la página de componentes, la tabla de muestra etiqueta los estados como **Libre / Ocupado** | Baja | Generador `pageComponents` <-> AN050 sección 4.1 | **Corregida** a *Disponible / Reservado*, que son los rótulos fijados. El kit de componentes es de donde se copia: un rótulo mal ahí se propaga |
| **DV-19** | El banner de error dice *"Quítalo o elige otro **ejemplar**"* | Baja | Generador `pageComponents` <-> AN070 sección 2.1 | **Corregida** a *"otro título"*. Mismo concepto inexistente que DV-17, junto con *"Total de ejemplares"* en el resumen del asistente de reserva, ahora *"Libros seleccionados"* |
| **DV-22** | Tres chips con el rótulo en inglés: *Inactive* y *Available* en la página de componentes, y *Available* en `book-mobile` | Baja | Generador <-> RNF-03, TW-10 | **Corregida** a *No disponible*, *Seleccionado* y *Disponibles*. Aparecieron al preparar la regeneración, no en el cotejo: son tres palabras sueltas entre cientos |
| **DV-24** | El campo de correo del artboard `login` traía un **correo personal real** como texto de ejemplo | Media | Generador `pageScreens` <-> RNF-08 (datos personales) | **Corregida.** Todos los correos de maqueta usan el dominio ficticio `@correo.com`. Un dato personal real en un diseño que viaja a un repositorio público es justo lo que prohíbe la sección 8 del enunciado |
| **DV-23** | *(ya no aplica: desde DV-31 la fila muestra todos los títulos, sin "+N")* En la fila de una reserva de cuatro libros, el chip **"+N" se salía de la celda** y quedaba oculto tras la columna de acciones | Media | Render del generador <-> RF-10 | **Corregida.** El reparto de chips contaba títulos (tope de tres) en vez de medirlos; cuatro títulos largos desbordaban los 520 px de la celda. Ahora se reparten por ancho: caben los que quepan en ~430 px y el resto va al "+N". Se corrigió también el desbordamiento del panel del asistente, cuyo texto de rechazo tapaba la etiqueta *solo consulta* |

### 4.4 Gravedad baja

| ID | Divergencia | Artefactos en conflicto | Resolución |
|---|---|---|---|
| **DV-11** | Nombres de categoría. Diseño: *Informática*, *Hemeroteca*. AN010 sección 8.2: *Poesía*, *Referencia* | Generador <-> AN010 sección 8.2 | **Manda el diseño.** Los seis tonos de sección 2.3 de AN050 están asignados a los nombres del diseño y el juego de datos canónico ya se escribió con ellos. **Resuelta:** AN010 sección 8.2 corregida el 2026-09-14 (v1.1) |
| **DV-12** | Escala de los datos de maqueta: 1.284 libros, 396 clientes, 154 reservas, 486 títulos en Narrativa. El juego canónico son 24, 5 y 3 | Generador <-> AN010 sección 8.2 <-> AN050 sección 8 | ~~Sin cambio en el diseño~~. **Superada el 2026-09-16 por DV-28:** al redibujar el archivo contra la aplicación, las pantallas pasaron a llevar el juego canónico -24 libros, 18 disponibles, 6 categorías, 5 clientes, 3 reservas-. Aquella decisión se tomó cuando el diseño mandaba sobre el código; desde DV-27 manda el código |
| **DV-13** | Botón **Exportar** en la cabecera de `book` y de `reservation` | Generador <-> AN030 RF-01...RF-19, NO-06 | Retirar de los dos artboards. Ningún RF lo respalda y NO-06 excluye los informes del alcance |
| **DV-14** | La fila de usuario del menú muestra el perfil **"Bibliotecario"**. AN030 sección 1.4 dice que no hay perfiles diferenciados por permiso | Generador `appShell` <-> AN030 sección 1.4 | **Se conserva.** Es un rótulo descriptivo del único actor operativo, no un permiso. No implica control de acceso por rol y no se debe implementar como tal |
| **DV-15** | Subtítulo del asistente: "Consulta el catálogo y el **fondo bibliográfico** en lenguaje natural". "Fondo bibliográfico" apunta a RAG, que es RF-19, prioridad C | Generador <-> AN030 RF-14, RF-19 | Condicional: si RF-19 no entra en la entrega, el subtítulo pasa a "Consulta el catálogo y las reservas en lenguaje natural". **Prometer RAG en una pantalla sin RAG es una divergencia que el evaluador ve** |
| **DV-16** | `book-mobile` lleva **cinco** destinos en la barra inferior; el escritorio lleva seis. Falta *Categorías* | Generador `screenBookMobile` <-> `appShell` | Decisión consciente, no defecto: es el mantenimiento menos frecuente y se relega al menú de la pantalla de Libros. **Queda registrada** en AN050 sección 3.5, que es lo que faltaba |

---

### 4.5 Surgidas al implementar

No son fallos del diseño: son sitios donde el código se aparta de él con motivo. La
alternativa -cambiar el diseño y rehacer el archivo de Figma- costaba más de lo que
resolvía a cinco días de la entrega.

| ID | Divergencia | Gravedad | Artefactos en conflicto | Resolución |
|---|---|---|---|---|
| **DV-25** | Las barras del gráfico "Libros por categoría" **no usan los tonos de chip** de AN050 sección 2.3. Como relleno de barra sobre `Surface` blanco esos tonos dan **1,1:1**, ilegibles: están calculados para ir detrás de un texto oscuro en un chip, no como masa de color | Media | AN050 sección 2.3 <-> `dashboard.component.html` <-> RNF-06 (contraste) | **Aplicada.** Se usa el mismo matiz un paso más oscuro de cada rampa, con `>= 3:1` sobre el fondo en los dos temas. El chip de la categoría conserva su tono claro: son dos usos distintos del mismo color y necesitan pasos distintos |
| **DV-26** | La marca del menú lateral muestra **"Sistema de Gestión Bibliotecaria Inteligente"** como bajada, y AN050 sección 3.3 fija ahí `"Gestión bibliotecaria" en 11 px` | Baja | AN050 sección 3.3 <-> `layout.component.html` | **Aplicada por decisión de producto**: el nombre completo solo aparecía en el README, y un evaluador que abre la aplicación no lo ve en ninguna parte. Ocupa dos líneas dentro de los 248 px sin desbordar (166 px de texto medidos). AN050 sección 3.3 queda actualizado |

### 4.6 Cotejo contra la aplicación en ejecución (2026-09-16)

Las anteriores se encontraron leyendo. Estas se encontraron **abriendo la aplicación** en
`localhost:4200` y comparándola pantalla por pantalla con el archivo de Figma. El criterio
cambió: hasta aquí mandaba el diseño y el código se ajustaba; a partir de aquí **manda lo
implementado**, porque está construido, probado de extremo a extremo y es lo que verá quien
evalúe. El archivo de Figma y AN050 se rehicieron contra él.

| ID | Divergencia | Gravedad | Artefactos en conflicto | Resolución |
|---|---|---|---|---|
| **DV-27** | El `login` dibujado era una pantalla partida en dos columnas con panel de marca índigo; el implementado es una **tarjeta centrada de 360 px** con campos rellenos, heredada de la plantilla del curso | **Alta** | AN050 sección 3.1 <-> `login.component.html` | **Resuelta a favor del código.** PA-02 dejó el acceso tras `AUTH_ENABLED`; con la seguridad desactivada nadie lo ve, así que rehacerlo era trabajo sobre una pantalla muerta. Se redibujó el artboard y se reescribió AN050 sección 3.1 |
| **DV-28** | El panel dibujaba un gráfico de **"Reservas por mes"** con ocho barras verticales y cifras inventadas (1.284 libros, 396 clientes, 154 reservas) | **Alta** | AN050 sección 7.1 <-> `dashboard.component.html` <-> AN070 | **Resuelta a favor del código.** El modelo no guarda fecha de alta de libros ni de clientes: esa serie mensual no se puede calcular y era decorado. El artboard lleva ahora el panel real -"Libros por categoría", barras horizontales- y el juego canónico: 24 / 18 / 3 / 5 |
| **DV-29** | Las cuatro tarjetas de indicador mostraban una **variación** ("+18 este mes"); las implementadas muestran una **línea de detalle** calculada sobre los mismos datos ("6 reservados, el 25 % del catálogo") | Media | AN050 sección 7.1 <-> `dashboard.component.ts` | **Resuelta a favor del código**, que además resuelve el descuadre de altura que dejaba DV-08: las cuatro tarjetas vuelven a medir lo mismo porque todas tienen las cuatro líneas |
| **DV-30** | Los filtros dibujados eran chips de *Disponibles / Reservados*; los implementados son **un chip por categoría** en Libros y un **selector segmentado** Todas / Activas / Inactivas en Categorías | Media | AN050 sección 7.1 <-> `book.component.html`, `category.component.html` | **Resuelta a favor del código.** Se añadieron ambas piezas a la página de componentes del archivo |
| **DV-31** | La columna de estado de Libros se rotulaba **Estado**; en la aplicación es **Disponibilidad**. Clientes tiene **tres** acciones por fila, no dos, y Reservas **una** | Baja | AN050 sección 7.1 <-> plantillas de las cuatro pantallas de gestión | **Resuelta a favor del código.** Reservas solo permite eliminar porque RN-13 no deja editar una reserva registrada |
| **DV-32** | El asistente se dibujó como una **conversación en marcha**; lo que ve quien entra es el **estado inicial** con cuatro preguntas de ejemplo | Media | AN050 sección 7.1 <-> `assistant.component.html` | **Resuelta a favor del código.** La cuarta sugerencia -"Registra una reserva para María"- es de escritura a propósito: al pulsarla el agente se niega, y eso es lo que comprueba AN120 paso 5.1.3 |
| **DV-33** | El rol **`Error`** valía `#DC2626` en el generador y `#B3261E` en `material-theme.scss`. **AN050 nunca lo fijó**: no era un fallo de ninguna de las dos partes, era un hueco de la guía | Media | `code.js` <-> `material-theme.scss` <-> AN050 sección 2.3 | **Resuelta a favor del código y documentada.** `#B3261E` da 6,12:1 sobre `Surface Container Low`, donde se apoya el texto de error de 12 px; `#DC2626` se quedaba en 4,52:1, AA sin margen. AN050 sección 2.3 publica ahora los cuatro tokens del rol |
| **DV-34** | El pie del menú lateral mostraba un nombre propio ("Dante W. / Bibliotecario"); la aplicación rotula el **perfil** ("Bibliotecario / Personal de biblioteca") con un icono genérico | Baja | AN050 sección 3.3 <-> `layout.component.html` | ~~Resuelta a favor del código~~. **Superada por DV-38 el 2026-09-17.** Se resolvió sobre la premisa de que "sin sesión implementada (PA-02) no hay nombre que mostrar", y esa premisa caducó el día que se publicó con `AUTH_ENABLED=true`: hay sesión, hay correo y `GET /auth/user` lo devuelve |

### 4.7 Cotejo desde un teléfono (2026-09-17)

Las pasadas anteriores se hicieron **en el escritorio**, contra `localhost:4200` en una
ventana ancha. Esta se hizo sobre la aplicación publicada y desde un teléfono, y encontró
cuatro divergencias que ninguna pasada de escritorio podía encontrar: **tres de ellas solo
existen cuando el navegador es el de un móvil**.

| ID | Divergencia | Gravedad | Artefactos en conflicto | Resolución |
|---|---|---|---|---|
| **DV-35** | El campo de correo del `login` era un `<input>` de texto corriente, sin `type="email"` ni los atributos que apagan la autocorrección. En Android, Gboard "corrige" las palabras que no están en el diccionario y envía **otra dirección con formato válido**: el validador la da por buena, el botón se habilita y el backend responde **401**. En el escritorio no pasa porque no hay autocorrección | **Alta** | AN050 sección 3.1 <-> `login.component.html` | **Resuelta a favor del diseño.** El campo lleva `type`, `inputmode`, `autocapitalize`, `autocorrect` y `spellcheck`. Se recorta además el correo antes de enviarlo: se comprobó contra el backend publicado que **un espacio al final devuelve 401**, mientras que las mayúsculas no -Supabase normaliza el caso- |
| **DV-36** | `.shell` medía `height: 100vh`. En un navegador móvil `100vh` es la altura con la barra de direcciones retraída, así que el shell desborda lo visible, el documento se desplaza entero y **la barra inferior de navegación no se queda fija**. El botón flotante sí lo hace, porque es `position: fixed`: los dos se contradicen en la misma pantalla | **Alta** | AN050 sección 3.5 <-> `layout.component.css` | **Resuelta a favor del diseño.** `100dvh` con `100vh` declarado antes como reserva, en el shell y en el `login`. AN050 sección 3.5 publica ahora la regla y sección 5 la añade a la lista de verificación |
| **DV-37** | El campo de contraseña no tenía forma de revelar lo escrito. En un teclado de móvil, donde no se ve lo que se teclea y el error más probable es un carácter de más, es la diferencia entre corregir y volver a empezar | Media | AN050 sección 3.1 <-> `login.component.html` | **Resuelta a favor del diseño.** Conmutador de solo icono con `aria-pressed`, rótulo que dice la acción y `type="button"` para que no envíe el formulario |
| **DV-38** | El pie del menú lateral rotulaba "Bibliotecario / Personal de biblioteca" **escrito a mano en la plantilla**, y por debajo de 1024 px ese pie desaparece con el menú: en un teléfono no se veía la cuenta **ni había ningún botón para cerrar sesión**. `LoginService.userInfoUrl` ya existía, y su comentario decía que "lo consume DashboardStore" cuando no lo consumía nadie | Media | AN050 secciones 3.3 y 3.5 <-> `layout.component.html`, `login.service.ts` | **Resuelta a favor del diseño. Supera a DV-34.** El pie muestra la cuenta de `GET /auth/user` sobre el perfil, y en móvil un avatar en la cabecera abre el correo completo y "Cerrar sesión". Con `AUTH_ENABLED=false` no se llama al endpoint: la cadena está en `permitAll` y devolvería `anonymousUser` |

| **DV-39** | El nombre del sistema en el `login` se puso a **12 px**, un tamaño que la escala de AN050 sección 2.5 **no tiene**: su 12/16 es `Label medium` y es **IBM Plex Mono**, reservado a ISBN y códigos. En un teléfono en la mano se veía demasiado pequeño. Al comprobarlo se vio que el hueco era mayor: la sección 2.5 publicaba siete pasos mientras las secciones 3.3 y 3.5 mandaban 21, 13, 11 y 24 px, **que la tabla nunca recogió** | Media | AN050 secciones 2.5 y 3.1 <-> `login.component.css` | **Resuelta a favor del diseño.** El nombre pasa a `Label large` (14/20) y el subtítulo a `Body medium` (14/20), los dos desde los tokens del tema y no desde un número escrito a mano; la jerarquía la hacen peso y color. Medido sobre la aplicación: 282 px de texto en los 296 px interiores de la tarjeta a 360 px de pantalla, una línea; a 16 px se parte en dos. AN050 sección 2.5 publica además la **escala menor** que la aplicación ya usaba y fija la regla de que el contenido nunca baja de 14 |

**Lo que enseña esta pasada.** Las tres divergencias altas y medias de arriba llevaban
abiertas desde que existe la pantalla y **ninguna revisión de escritorio las habría visto**:
dos dependen del teclado del móvil y una del navegador que retrae la barra de direcciones.
Un cotejo hecho siempre en el mismo dispositivo solo prueba ese dispositivo. RNF-07 y TW-11
se verificaban estrechando la ventana del escritorio, que reproduce el **ancho** pero no el
teclado, ni la barra de direcciones, ni el `vh` que miente.

> **El asistente de reserva se recorrió entero** el 2026-09-16 -cliente, libros y
> confirmación- sin llegar a guardar: se salió con "Salir sin guardar" y la lista siguió con
> tres reservas. De ahí salieron los dos artboards nuevos, `reservation-wizard-books` y
> `reservation-wizard-confirm`, y el detalle de AN050 sección 7.1: los pasos hechos se marcan con
> un lápiz y no con un visto, y RN-10 está dicha en la propia tarjeta de Fecha.

> **Lo que el cotejo no tocó.** La paleta coincide uno a uno: los 21 tokens de color de
> sección 2.1-2.2 son idénticos en `code.js`, en `material-theme.scss` y en esta guía, en claro
> y en oscuro. Ningún CSS de componente escribe ya un color literal: el último que quedaba,
> un `color: red` en `.invalid` de `login.component.css`, **se corrigió el 2026-09-16** a
> `var(--mat-sys-error)`. Daba 3,74:1 sobre la tarjeta del acceso -por debajo de AA para
> texto pequeño- y ahora da 6,12:1. Comprobado en la aplicación: el mensaje "El correo es
> obligatorio" se pinta en `rgb(179, 38, 30)`, que es `#B3261E`.

---

## 5. Lo que el cotejo confirma

Tan importante como las divergencias es lo que se comprobó y **coincide**. Estos puntos no
hay que volver a mirarlos:

| # | Comprobación | Resultado |
|---|---|---|
| 1 | Los tres pasos del asistente de reserva (Cliente - Libros - Confirmación) | Coinciden con AN010 sección 6.2.4 |
| 2 | Los chips de filtro de `book` (*Disponibles* / *Reservados*) mapean a `available` | Correcto |
| 3 | Las columnas de `book` - Título, Autor, ISBN, Categoría, Estado, Acciones | Coinciden con AN010 sección 6.2.2 |
| 4 | Las columnas de `client` salvo DV-02 | Coinciden con AN010 sección 6.2.3 |
| 5 | Los estados de categoría (*Activa* / *Inactiva*) reflejan `status` y no un borrado | Correcto (RN-14, DM-07) |
| 6 | Hemeroteca aparece **inactiva** en el diseño | Es justo el dato que verifica RN-14; queda como dato canónico |
| 7 | El ISBN se muestra en tipografía monoespaciada en todas las pantallas | Correcto (AN050 sección 2.5) |
| 8 | El nombre de la categoría acompaña siempre a su tono | Correcto (PX-03) |
| 9 | Los ISBN de la maqueta son de 13 dígitos con prefijo `978` | Compatible con `varchar(13)` de AN070 |
| 10 | Los documentos de la maqueta son de 8 dígitos | Compatible con `varchar(8)` y con CP-09 |
| 11 | Ningún artboard muestra contraseñas, tokens ni datos personales reales | Correcto (RNF-04) |
| 12 | Cada artboard lleva el nombre exacto de su componente Angular | Correcto: la trazabilidad diseño<->código es automática |

---

## 6. Estado de las divergencias

Las correcciones del generador se aplicaron el **2026-09-14** sobre
`diseño/figma-plugin/code.js`. Estado de las veintiuna:

| ID | Gravedad | Dónde se corrige | Estado |
|---|---|---|---|
| DV-01 | Alta | Generador - fondo de `book-dialog` | Aplicada |
| DV-02 | Alta | Generador (rótulo) + DTO (conteo) | Parcial: rótulo aplicado - conteo en **DP-01** |
| DV-03 | Alta | DTO del backend (`bookCount`) | Abierta - producto 1 de AN080 |
| DV-04 | Media | Generador - chips de título y "+N" | Aplicada |
| DV-05 | Media | Generador - columna N.º | Aplicada |
| DV-06 | Media | Generador - acciones de fila | Aplicada |
| DV-07 | Media | Generador - cuarta tarjeta del panel | Aplicada |
| DV-08 | Media | Generador - variaciones temporales | Aplicada |
| DV-09 | Media | Generador - botón DESHACER | Aplicada |
| DV-10 | Media | Generador - colores del snackbar | Aplicada |
| DV-11 | Baja | AN010 sección 8.2 | Aplicada |
| DV-12 | Baja | - | **Superada por DV-28** |
| DV-13 | Baja | Generador - botón "Exportar" (x3) | Aplicada |
| DV-14 | Baja | - | Sin acción, justificada |
| DV-15 | Baja | Condicional | Abierta - **DP-03** |
| DV-16 | Baja | AN050 sección 3.5 | Registrada |
| DV-17 | Alta | Generador - campo "Ejemplares" | Aplicada |
| DV-18 | Baja | Generador - rótulos de estado | Aplicada |
| DV-19 | Baja | Generador - microcopia | Aplicada |
| DV-20 | Media | Generador - datos de maqueta | Aplicada |
| DV-21 | **Alta** | Generador - hilo del asistente | Aplicada |
| DV-22 | Baja | Generador - rótulos en inglés | Aplicada |
| DV-23 | Media | Generador - reparto de chips y alto del panel | Aplicada |
| DV-24 | Media | Generador - correo de ejemplo del `login` | Aplicada |
| DV-25 | Media | Código - paleta del gráfico del panel | Aplicada |
| DV-26 | Baja | Código + AN050 sección 3.3 | Aplicada |
| DV-27 | **Alta** | AN050 3.1 - `login` redibujado | Aplicada |
| DV-28 | **Alta** | AN050 7.1 - panel real en el archivo | Aplicada |
| DV-29 | Media | AN050 7.1 - detalle en vez de variación | Aplicada |
| DV-30 | Media | AN050 7.1 + componentes - filtros reales | Aplicada |
| DV-31 | Baja | AN050 7.1 - columnas y acciones | Aplicada |
| DV-32 | Media | AN050 7.1 - asistente en estado inicial | Aplicada |
| DV-33 | Media | AN050 2.3 - rol Error publicado | Aplicada |
| DV-34 | Baja | AN050 3.3 - pie del menú | **Superada por DV-38** |
| DV-35 | **Alta** | AN050 3.1 - correo a prueba de autocorrección | Aplicada |
| DV-36 | **Alta** | AN050 3.5 - alto del shell en `dvh` | Aplicada |
| DV-37 | Media | AN050 3.1 - conmutador de contraseña | Aplicada |
| DV-38 | Media | AN050 3.3 + 3.5 - cuenta real y salida en móvil | Aplicada |
| DV-39 | Media | AN050 2.5 + 3.1 - escala menor publicada | Aplicada |

**27 aplicadas - 1 superada - 1 parcial - 2 abiertas - 2 sin acción.**

### 6.1 Lo que queda por hacer

| Qué | Dónde | Cuándo |
|---|---|---|
| `bookCount` en el DTO de lectura de categoría (DV-03) | Producto 1 de AN080 | H-1 - 2026-09-18 |
| Decidir `reservationCount` o retirar la columna (DV-02) | **DP-01** | H-1 - 2026-09-18 |
| Subtítulo del asistente según entre o no RF-19 (DV-15) | **DP-03** | H-3 - 2026-09-30 |

**Ninguna toca el esquema.** `bookCount` y `reservationCount` son campos derivados de
lectura, no columnas: ninguna tabla de AN070 cambia, y el plan de AN080 no se mueve.

### 6.2 Archivo de Figma regenerado

El archivo `8vTvBVU8gUcB4EiC91QEEf` se regeneró el **2026-09-14** desde el generador
corregido, con `use_figma`. Las cuatro páginas se reconstruyeron y las anteriores se
retiraron **después** de que las nuevas estuvieran completas, para no quedarse sin diseño
si fallaba un paso intermedio.

| Página | Contenido |
|---|---|
| `SIGBI Foundations` | Tokens, tema oscuro, tipografía, espaciado, radios, iconografía |
| `SIGBI Components` | Botones, campos, chips, tabla, snackbar, banner de error, estado vacío |
| `SIGBI Screens` | Los nueve artboards de escritorio |
| `SIGBI Responsive` | `book-mobile` |

**Los 14 estilos de color, los 7 de texto y la colección de variables `SIGBI` no se
tocaron**: ninguna corrección cambió un valor de token, y recrearlos habría duplicado
estilos con el mismo nombre.

Las tres tipografías -Lora, IBM Plex Sans, IBM Plex Mono- cargaron sin caer al sustituto
Inter, así que los renders son fieles.

Los renders de `diseño/preview/` (`dashboard.jpg`, `book.jpg`) se **reexportaron** del
archivo regenerado, a 720 x 450 como los anteriores. Ya no muestran las tarjetas con
variación inventada (DV-08) ni el botón "Exportar" (DV-13).

### 6.3 Qué encontró cada pasada

Las veintiséis divergencias no salieron todas del mismo sitio, y eso es lo interesante:

| Pasada | Encontró | Ejemplo |
|---|---|---|
| **Cotejo del diseño contra el análisis** (sección 4.1-sección 4.2, sección 4.4) | 16 | La columna *Reservas activas* que el DTO no puede llenar |
| **Edición del generador** (DV-17 a DV-21) | 5 | El asistente registrando una reserva, en inglés |
| **Preparación de la regeneración** (DV-22, DV-24) | 2 | Tres chips en inglés - un correo personal real en el `login` |
| **Construir la aplicación** (DV-25, DV-26) | 2 | La paleta del gráfico, ilegible como relleno de barra |
| **Mirar el resultado renderizado** (DV-23) | 1 | El chip "+N" saliéndose de la celda |

Ninguna pasada sustituye a las otras. Leer el código del diseño encuentra lo que una
captura no enseña -un texto en inglés dentro de una cadena larga, un campo de más-, pero
**DV-23 solo se ve mirando**: el código era correcto y la aritmética de anchos, no. Contaba
chips cuando tenía que medirlos.

Por eso el próximo cotejo (sección 8) se hace contra la aplicación construida **y** contra sus
capturas, no contra una sola de las dos.

---

## 7. Decisiones pendientes

No son defectos: son cosas que alguien tiene que decidir antes de construir la pantalla.

| ID | Pregunta | Depende de | Fecha límite |
|---|---|---|---|
| **DP-01** | ¿`reservationCount` en `ClientDTO` (DV-02), o se retira la columna? | Coste en el producto 1 de AN080 | H-1 - 2026-09-18 |
| **DP-02** | ¿La reserva muestra `idReservation` formateado o se retira la columna de código (DV-05)? | Preferencia de presentación | H-2 - 2026-09-25 |
| **DP-03** | ¿Entra RF-19 (RAG) y con qué corpus? De ello depende el subtítulo del asistente (DV-15) | Horas disponibles en la etapa de cierre | H-3 - 2026-09-30 |
| **DP-04** | ¿Se implementa RF-15 (control de disponibilidad)? Sin él, la columna *Estado* de `book` y los chips *Disponibles/Reservados* muestran un campo que nada mueve | sección 7.2 de AN080 | H-1 - 2026-09-18 |

DP-04 es el que más superficie de pantalla afecta: aparece en `book`, en `book-mobile`, en
el paso 2 del asistente de reserva y en la tarjeta de panel de DV-07. Si RF-15 se recorta,
las cuatro siguen dibujándose, pero muestran un dato que solo cambia si alguien lo edita a
mano. **Es la divergencia que se crearía al recortar**, y por eso se anota aquí antes.

---

## 8. Estado de la higiene documental

| Documento | Estado | Observación |
|---|---|---|
| AN010 | Vigente - v1.1 | **sección 8.2 corregida** (DV-11) el 2026-09-14: nombres del diseño y Hemeroteca fijada como categoría desactivada |
| AN020 | Vigente | Sin impacto |
| AN030 | Vigente | Sin impacto |
| AN040 | Vigente | Sin impacto |
| AN050 | Vigente - v1.1 | Alineado con el generador corregido: semáforo de tres tonos, velo al 45 %, `book-dialog` de cinco campos y asistente que enseña su límite |
| AN060 | Vigente | Recoge la ausencia de ruta de detalle (DV-06) |
| AN070 | Vigente | Sin cambios de esquema: DV-03 se resuelve en el DTO |
| AN080 | Vigente | DP-01 y DP-04 se deciden en H-1 |
| AN100 | Provisional | Se verifica tras H-2; describe el comportamiento diseñado |
| AN110 | Vigente | Sin impacto |
| AN120 | Vigente | Sin impacto: prueba reglas, no presentación |
| AN130 | Plantilla | Se cumplimenta en el pase |
| EST010 / EST020 | Vigentes | Sin impacto |
| `diseño/figma-plugin/code.js` | **Corregido** el 2026-09-14 | 19 divergencias aplicadas; cada cambio lleva su ID en un comentario |
| Archivo de Figma `8vTvBVU8gUcB4EiC91QEEf` | **Regenerado** el 2026-09-14 | Cuatro páginas nuevas; las anteriores retiradas (sección 6.2) |
| `diseño/preview/*.jpg` | **Reexportados** el 2026-09-14 | 720 x 450, del archivo ya corregido |

**Próximo cotejo:** al cerrar H-2 (2026-09-25), esta vez contra la aplicación construida y
no contra el generador. Ese cotejo es el que descubre lo que ningún documento anticipa.

Los tres artefactos de diseño -generador, archivo de Figma y renders- están **alineados
entre sí** a esta fecha. Lo que queda por cerrar no es del diseño, sino de la construcción:
DP-01, DP-03 y DP-04 de sección 7.

---

## Referencias

- `diseño/figma-plugin/code.js` - generador del diseño; fuente cotejada.
- [`AN010-análisis-técnico-funcional.md`](AN010-análisis-técnico-funcional.md) - sección 6.2 pantallas, sección 6.3 contrato, sección 8.2 datos de prueba.
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - RF, no-objetivos y actores.
- [`AN050-diseño-ui-ux.md`](AN050-diseño-ui-ux.md) - especificación del diseño cotejado.
- [`AN060-flujos-de-navegación-appflow.md`](AN060-flujos-de-navegación-appflow.md) - rutas existentes y ausentes.
- [`AN070-esquema-del-backend.md`](AN070-esquema-del-backend.md) - tablas y columnas disponibles.
- [`AN080-plan-de-implementación.md`](AN080-plan-de-implementación.md) - hitos en los que vencen DP-01 a DP-04.
