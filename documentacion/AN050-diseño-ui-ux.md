# DISEÑO UI/UX

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN050` - N.º AN-2026-005

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN050 |
| Versión | 1.2 |
| Fecha | 2026-09-17 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Contenido | Principios de experiencia, identidad visual, app shell, componentes, accesibilidad, pantallas y datos canónicos de la demostración |
| Fuente | Archivo de Figma `8vTvBVU8gUcB4EiC91QEEf` |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial. Formaliza el diseño ya construido en Figma: tokens con contraste calculado, app shell, componentes, estados y las nueve pantallas. |
| 1.1 | 2026-09-14 | D. Quispe | Se aplican al generador las correcciones de AN090 (DV-01 a DV-21). Semáforo de estados con sus tres tonos reales, velo del modal al 45 %, `book-dialog` sin el campo inexistente y asistente que enseña su límite de solo lectura. |
| 1.2 | 2026-09-17 | D. Quispe | Las pantallas ya están construidas: se corrige el estado de implementación, que seguía diciendo "por construir". Se actualiza la marca del menú con el nombre completo del sistema (DV-26 de AN090). |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

**Qué es este documento.** El diseño de SIGBI **ya existe** como capas nativas de Figma
(no imágenes): páginas `SIGBI Foundations`, `SIGBI Components`, `SIGBI Screens` y
`SIGBI Responsive`. Este documento es su especificación escrita - lo que hay que saber
para traducirlo a Angular Material sin abrir el archivo.

Los valores de esta guía están tomados del generador `diseño/figma-plugin/code.js`, que es
la fuente que produjo el archivo. Si el archivo y este documento discrepan, manda el
generador y se corrige el documento.

**Estado de la implementación:** el diseño está cerrado y **las pantallas de Angular están
construidas y verificadas** contra el backend. Las divergencias entre lo que dice este
documento y lo que hace el código están registradas en AN090 sección 4.5; no hay ninguna
sin registrar.

Las capturas son de las dos fuentes y están separadas a propósito: `diseño/preview/` guarda
los renders del archivo de Figma y `diseño/preview/app/` las de la aplicación en ejecución
(sección 7.2). Desde el 2026-09-16 el archivo de Figma se dibuja **contra la aplicación**, no al
revés.

---

## 1. Principios de experiencia

Cinco decisiones que explican todo lo demás. Cuando una pantalla nueva plantee una duda,
se resuelve con estos principios antes que con el gusto.

| ID | Principio | Consecuencia práctica |
|---|---|---|
| PX-01 | **Una tarea, una pantalla.** | Los mantenimientos son tabla + diálogo modal. Crear un libro no navega a otra página: abre `book-dialog` sobre la tabla y devuelve al mismo sitio. |
| PX-02 | **Solo la reserva merece un asistente.** | Es el único flujo con más de una decisión encadenada, así que es el único con `mat-stepper`. Todo lo demás cabe en un formulario. |
| PX-03 | **El color nunca es la única señal.** | Cada categoría tiene su tono, pero el nombre va siempre escrito al lado. Un usuario con daltonismo pierde el atajo visual, no la información. |
| PX-04 | **El error se muestra donde se produjo.** | La validación del backend se pinta bajo el campo que la provocó, con el mensaje que devolvió el servidor. Nada de avisos genéricos arriba del formulario. |
| PX-05 | **Nada se borra sin decir qué se borra.** | Toda confirmación nombra el registro afectado y, si la operación tiene efectos colaterales (RN-13: los libros vuelven al catálogo), los advierte por escrito. |

Un principio que **no** se adoptó, y conviene dejarlo dicho: SIGBI no busca vistosidad.
NO-01 de AN030 excluye el diseño complejo y las animaciones. La interfaz debe leerse
rápido con una tabla de 24 libros delante, no impresionar en una captura.

---

## 2. Identidad visual

Base **Material 3**, porque es lo que impone Angular Material 22 a través de `mat.theme()`.
Cada token de esta sección tiene su equivalente `--mat-sys-*` en el frontend, así que la
traducción a `material-theme.scss` es una correspondencia uno a uno, no una reinterpretación.

### 2.1 Escala de marca (tokens de color)

Índigo como primario y naranja quemado como acción secundaria. Es una paleta saturada a
propósito: una paleta institucional apagada cumpliría accesibilidad y parecería un
producto sin terminar.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `Primary` | `#4F46E5` | `#A5B4FC` | Acción principal, elemento activo del menú, marca |
| `On Primary` | `#FFFFFF` | `#1E1B4B` | Texto sobre primario |
| `Primary Container` | `#E0E7FF` | `#3730A3` | Fondo del ítem de menú activo, chips destacados |
| `On Primary Container` | `#1E1B4B` | `#E0E7FF` | Texto sobre contenedor primario |
| `Primary Hover` | `#4338CA` | `#C7D2FE` | Estado `:hover` del botón relleno |
| `Secondary` | `#5B5B7A` | `#B4B7D4` | Acciones de segundo orden |
| `Secondary Container` | `#DDE0F5` | `#3A3E5E` | Fondos suaves neutros |
| `Tertiary` | `#C2410C` | `#FDBA74` | Acción de acento: "Nueva reserva" |
| `On Tertiary` | `#FFFFFF` | `#4A1D05` | Texto sobre terciario |
| `Tertiary Container` | `#FFE8D4` | `#7C2D12` | Realce cálido |
| `On Tertiary Container` | `#4A1D05` | `#FFE8D4` | Texto sobre contenedor terciario |

### 2.2 Neutros y superficies

Las superficies llevan tinte índigo en vez de gris puro. Es lo que impide que la aplicación
parezca un formulario administrativo.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `Surface` | `#FFFFFF` | `#111225` | Fondo de la columna de contenido y de los paneles |
| `Surface Container Low` | `#F6F7FE` | `#171930` | Campo de búsqueda, zonas hundidas |
| `Surface Container` | `#EEF1FD` | `#1E2139` | Menú lateral |
| `Surface Container High` | `#E4E9FB` | `#282C48` | Cabecera de tabla, fila resaltada |
| `On Surface` | `#1B1B34` | `#E6E7F5` | Texto principal |
| `On Surface Variant` | `#4A4A6A` | `#B9BCD8` | Texto secundario, iconos inactivos |
| `Outline` | `#7C7CA0` | `#8B8FB4` | Borde de control con foco, texto de marcador |
| `Outline Variant` | `#C5CBEA` | `#3A3E5E` | Separadores, borde de panel y de tabla |
| `Scrim` | `#000000` | `#000000` | Velo del modal, a 45 % de opacidad |

**Espaciado:** escala 4/8 - `4, 8, 12, 16, 24, 32, 48`. No hay valores intermedios.
**Radios:** `xs 4` - `sm 8` - `md 12` - `lg 16` - `xl 28` - `full 999`.
**Elevaciones:** tres niveles - `E1` tarjeta, `E2` menú emergente, `E3` diálogo modal.

### 2.3 Semáforo de estados y tonos de categoría

Las etiquetas de estado son suaves (fondo claro, texto oscuro del mismo matiz), nunca
rótulos saturados de color plano:

| Estado | Fondo | Texto | Dónde |
|---|---|---|---|
| Éxito | `#D1FAE5` | `#047857` | **Disponible**, categoría **Activa**, confirmación |
| Aviso | `#FFE8D4` | `#4A1D05` | **Reservado**: el libro está comprometido |
| Error | `#FEE2E2` | `#5C0A0A` | Validación fallida, operación rechazada |

**Reservado no es un error.** Lleva el tono de aviso, no el rojo: un libro apartado es un
estado normal del catálogo. El rojo queda para lo que el usuario tiene que corregir.

El **rol `Error`** -el color del texto de validación y del borde del campo en falta- no
estaba fijado en esta guía, y por eso el diseño y la aplicación llevaban rojos distintos. Se
resuelve a favor de lo implementado (DV-33):

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `Error` | `#B3261E` | `#FFB4AB` | Texto de error, borde del campo inválido |
| `On Error` | `#FFFFFF` | `#690005` | Texto sobre el rojo pleno |
| `Error Container` | `#FEE2E2` | `#93000A` | Fondo del banner y de la etiqueta de error |
| `On Error Container` | `#5C0A0A` | `#FFDAD6` | Texto sobre el contenedor |

`#B3261E` da 6,54:1 sobre blanco y 6,12:1 sobre `Surface Container Low`, que es donde se
apoya el texto de error de 12 px. El `#DC2626` que llevaba el archivo de Figma se quedaba en
4,52:1 sobre esa misma superficie: pasa AA por tres centésimas, sin margen.

Cada categoría del catálogo lleva su propio tono, para que la tabla se escanee de un
vistazo (PX-03: el nombre va siempre al lado):

| Categoría | Fondo | Texto |
|---|---|---|
| Narrativa | `#E0E7FF` | `#312E81` |
| Informática | `#CFFAFE` | `#155E75` |
| Ciencia | `#D1FAE5` | `#065F46` |
| Historia | `#FEF3C7` | `#78350F` |
| Infantil | `#FCE7F3` | `#9D174D` |
| Hemeroteca | `#E2E8F0` | `#1E293B` |

> Los tonos son seis porque el juego de datos de demostración tiene seis categorías. El
> catálogo real puede tener más: la categoría sin tono asignado cae al par neutro
> `Secondary Container` / `On Surface`. El tono es un adorno funcional, no una clave.

> **Estos seis nombres son los canónicos.** AN010 sección 8.2 llevaba otros dos (Poesía,
> Referencia); la divergencia se resolvió a favor del diseño el 2026-09-14, porque los tonos
> ya estaban asignados a estos nombres. Trazabilidad en
> [`AN090-conciliación-línea-diseño-funcional.md`](AN090-conciliación-línea-diseño-funcional.md), DV-11.

### 2.4 Mapeo al tema de Angular Material

La traducción es mecánica. En `material-theme.scss` se declara `mat.theme()` con los
colores de sección 2.1-sección 2.2 y **no se escribe ningún color literal en el CSS de un componente**
(TW-09): todo se referencia por token.

| Token de esta guía | Variable del sistema |
|---|---|
| `Primary` | `--mat-sys-primary` |
| `On Primary` | `--mat-sys-on-primary` |
| `Primary Container` | `--mat-sys-primary-container` |
| `Tertiary` | `--mat-sys-tertiary` |
| `Surface` | `--mat-sys-surface` |
| `Surface Container` | `--mat-sys-surface-container` |
| `On Surface` | `--mat-sys-on-surface` |
| `On Surface Variant` | `--mat-sys-on-surface-variant` |
| `Outline` / `Outline Variant` | `--mat-sys-outline` / `--mat-sys-outline-variant` |

**Densidad:** las tablas están dibujadas con filas de 48 px, que es exactamente
`mat.theme(density: -1)`. No hay que ajustar alturas a mano.

**Tema oscuro:** los valores oscuros de sección 2.1-sección 2.2 **no son una inversión** del tema claro;
se eligieron y midieron aparte. Se aplican con el esquema de color del sistema operativo.

### 2.5 Tipografía e iconografía

Tres familias, cada una con un trabajo distinto:

| Familia | Papel |
|---|---|
| **Lora** | Títulos. Una serif da carácter bibliotecario sin disfrazar la interfaz de libro antiguo. |
| **IBM Plex Sans** | Toda la interfaz: rótulos, cuerpo, botones, tablas. |
| **IBM Plex Mono** | ISBN, cifras de los indicadores y cualquier dato que se compare carácter a carácter. |

Escala de texto publicada como estilos `SIGBI/...` en el archivo:

| Estilo | Familia | Tamaño / interlineado | Uso |
|---|---|---|---|
| `Display small` | Lora SemiBold | 36 / 44 | Cifra grande de indicador |
| `Headline medium` | Lora SemiBold | 28 / 36 | Título de página en la cabecera |
| `Title large` | IBM Plex Sans Medium | 22 / 28 | Título de diálogo y de panel |
| `Body large` | IBM Plex Sans Regular | 16 / 24 | Texto de lectura, mensajes del asistente |
| `Body medium` | IBM Plex Sans Regular | 14 / 20 | Celdas de tabla, cuerpo general |
| `Label large` | IBM Plex Sans Medium | 14 / 20 | Botones, cabecera de tabla, menú |
| `Label medium` | IBM Plex Mono Regular | 12 / 16 | ISBN, códigos, marcas de tiempo |

**Fuentes verificadas.** Las tres cargaron en Figma sin caer al sustituto Inter. El
generador tiene un mecanismo de reserva a Inter y avisa de la familia que faltó, para que
un render con la tipografía equivocada no pase por bueno.

**Iconografía:** trazo de 20 px en el menú y 18 px en los controles, con el peso del icono
alineado al texto que acompaña. Ningún icono va solo si es la única forma de entender la
acción: los botones de fila (editar, eliminar) llevan rótulo accesible.

---

## 3. Estructura de la aplicación (app shell)

Lienzo de escritorio: **1440 x 900**. Dos zonas fijas - menú lateral de 248 px y columna de
contenido de 1192 px.

```
+------------+--------------------------------------------------+
|  sidenav   |  topbar  80 px                                   |
|  248 px    |  Título (Lora 28) + subtítulo - acciones a la dcha|
|            +--------------------------------------------------+
|  marca     |                                                  |
|  -------   |  body   padding 32 px - gap 20 px                |
|  Panel     |                                                  |
|  Libros    |   +--------------------------------------------+ |
|  Categorías|   | panel: filtros + tabla + paginador         | |
|  Clientes  |   | radio 12 - borde Outline Variant           | |
|  Reservas  |   +--------------------------------------------+ |
|  Asistente |                                                  |
|  -------   |                                                  |
|  usuario   |                                                  |
+------------+--------------------------------------------------+
```

### 3.1 Login

Tarjeta centrada de 360 px sobre `Surface`, sin app shell: título de la aplicación a dos
líneas, subtítulo "Ingrese sus credenciales", dos campos **rellenos** -correo y contraseña-
y un botón "Entrar" alineado a la derecha. Mientras valida, una barra de progreso
indeterminada corona la tarjeta.

Es la única pantalla que conserva la plantilla del curso. El acceso (RF-18) es de
**prioridad C** y PA-02 lo dejó tras el interruptor `AUTH_ENABLED`: con la seguridad
desactivada la aplicación entra directa a `/pages/dashboard`, así que rehacer el acceso
habría sido trabajo sobre una pantalla que nadie ve.

> **Esta sección se reescribió el 2026-09-16 contra la aplicación.** Antes describía un
> acceso partido en dos columnas con panel de marca que nunca se implementó. Se resolvió a
> favor de lo implementado (DV-27 en
> [`AN090-conciliación-línea-diseño-funcional.md`](AN090-conciliación-línea-diseño-funcional.md)).

### 3.2 Cabecera (`topbar`)

80 px de alto, fondo `Surface`, relleno de 20 px vertical y 32 px horizontal.

- **Bloque de título:** título de página en Lora SemiBold 28/36 y, opcionalmente, un
  subtítulo de 13/18 en `On Surface Variant` que dice dónde está el usuario dentro del
  flujo ("Paso 2 de 3 - Selección de libros").
- **Acciones a la derecha:** como mucho dos. La principal es un botón relleno; la
  secundaria, delineado.

La cabecera no lleva buscador global: cada pantalla filtra lo suyo en su propia barra de
filtros.

### 3.3 Menú lateral (`sidenav`)

248 px, fondo `Surface Container`, relleno de 16 px vertical y 12 px horizontal.

De arriba abajo: **marca** (icono de libro en `Primary`, "SIGBI" en Lora 21 y "Sistema de
Gestión Bibliotecaria Inteligente" en 11 px, en dos líneas), los **seis destinos**, un
separador y la **fila de usuario** (avatar de 36 px, nombre, perfil y botón de salir).

> **Actualizado el 2026-09-17** (DV-26 de AN090). La bajada decía "Gestión bibliotecaria".
> El nombre completo del sistema solo aparecía en el README, así que quien abría la
> aplicación no lo veía en ninguna parte. Ocupa dos líneas dentro de los 248 px sin
> desbordar -166 px de texto medidos- y el icono lleva `flex-shrink: 0` para no encogerse
> al crecer el bloque de texto.

| Destino | Icono | Ruta |
|---|---|---|
| Panel | `dashboard` | `/pages/dashboard` |
| Libros | `book` | `/pages/book` |
| Categorías | `tag` | `/pages/category` |
| Clientes | `users` | `/pages/client` |
| Reservas | `calendar` | `/pages/reservation` |
| Asistente | `sparkles` | `/pages/assistant` |

El ítem activo es una píldora de 48 px de alto con radio completo, fondo
`Primary Container` y texto e icono en `On Primary Container`, en peso Medium. El inactivo
va sin fondo, en `On Surface Variant` y peso Regular. **El estado activo se distingue por
fondo y por peso tipográfico**, no solo por color (PX-03).

`reservation-wizard` no tiene entrada propia: se llega desde el botón "Nueva reserva" y
mientras dura el asistente el destino activo es **Reservas**.

### 3.4 Área de contenido

Fondo `Surface`, relleno de 32 px y separación de 20 px entre bloques. El contenido vive
dentro de un **panel** de fondo blanco, radio 12 y borde `Outline Variant`, que agrupa la
barra de filtros, la tabla y el paginador en una sola pieza visual.

La **barra de filtros** es constante en las cuatro pantallas de gestión: campo de búsqueda
de 320 x 44 con radio completo sobre `Surface Container Low`, seguido de los chips de
filtro propios de la pantalla y, al final de la fila, el botón de filtros avanzados.

### 3.5 Comportamiento por ancho de pantalla

Dos disposiciones; no hay tercera.

| Ancho | Menú | Tabla | Cabecera |
|---|---|---|---|
| >= 1024 px | Lateral fijo de 248 px | Todas las columnas | Título + acciones |
| < 1024 px | Barra inferior de navegación | La tabla se sustituye por tarjetas apiladas | Título compacto de 24/30 y acción principal como botón flotante |

El artboard `book-mobile` (390 x 844) fija la variante estrecha, que es la que cumple
RNF-07 y TW-11. Dos decisiones importantes:

1. **La tabla desaparece, no se encoge.** A 390 px cada libro es una tarjeta con título,
   autor, chip de categoría y etiqueta de disponibilidad. Comprimir seis columnas produce
   una tabla ilegible con desbordamiento horizontal, que es exactamente lo que RNF-07
   prohíbe.
2. **La barra inferior lleva cinco destinos, no seis.** Cabe la navegación principal -
   Panel, Libros, Clientes, Reservas, Asistente - y **Categorías** se relega al menú de la
   propia pantalla de Libros. Es el mantenimiento menos frecuente.

---

## 4. Componentes y patrones

Todo lo de esta sección está dibujado en `SIGBI Components` y se implementa con Angular
Material: no hay componentes propios salvo composición.

| Componente | Especificación |
|---|---|
| **Botón relleno** | Fondo `Primary`, texto `On Primary`, radio completo, alto 44. Acción principal de la pantalla. Uno por pantalla. |
| **Botón de acento** | Fondo `Tertiary`, texto `On Tertiary`. Reservado a "Nueva reserva": es la acción que da sentido al sistema. |
| **Botón delineado** | Borde `Outline`, texto `Primary`. Acción secundaria. |
| **Botón de icono** | 40 x 40, icono 20 en `On Surface Variant`. Siempre con rótulo accesible. |
| **Campo de texto** | Cuatro estados dibujados: normal (borde `Outline Variant`), foco (borde `Primary` de 2 px), error (borde `Error`, mensaje debajo en `Error`) y deshabilitado (38 % de opacidad). |
| **Chip** | Radio completo, alto 32. Dos usos: filtro activo (fondo `Primary Container`) y valor de categoría (fondo y texto del tono de sección 2.3). |
| **Tabla** | Cabecera en `Surface Container High` con `Label large`; filas de 48 px separadas por línea de 1 px en `Outline Variant`; columna final de acciones alineada a la derecha. |
| **Paginador** | Al pie del panel, dentro del mismo borde. |
| **Diálogo** | Ancho 900 (`book-dialog`), radio 16, elevación `E3`, velo `Scrim` al 45 %. Título `Title large`, cuerpo en formulario de dos columnas, acciones abajo a la derecha. |
| **Snackbar** | Fondo oscuro, texto claro, 14/20, esquina inferior izquierda. Acción opcional en `Label large`. |
| **Banner de error** | Fondo `Error Container`, texto `On Error Container`, icono a la izquierda y botón "Reintentar" a la derecha, que llama a `reload()` del store. |
| **Estado vacío** | Icono grande en `Outline`, título `Title large`, texto explicativo en `On Surface Variant` y botón de la acción que lo resuelve. |
| **Tarjeta de indicador** | Solo en el panel: rótulo, cifra en `Display small` monoespaciada, variación y un icono sobre el tono de su categoría. |

### 4.1 Microcopia

Español íntegro (RNF-03, TW-10). Cuatro reglas:

1. **El botón dice lo que hace**, en infinitivo o con el sustantivo de la acción:
   "Nueva reserva", "Guardar", "Eliminar", "Reintentar". Nunca "Aceptar" ni "OK".
2. **La confirmación nombra el registro y su consecuencia.** No "¿Eliminar este
   elemento?", sino: *"Se eliminará la reserva del 15/09/2026 de Ana Rojas. Sus 2 libros
   volverán a estar disponibles."*
3. **El estado vacío dice qué hacer**, no que no hay nada: *"Aún no hay reservas. Cuando
   registres la primera aparecerá aquí con su cliente y sus libros."*
4. **El error del backend se muestra tal cual.** El backend resuelve sus mensajes en
   `messages.properties`, que está en español (TB-10). El frontend no los reescribe ni los
   reinterpreta: los coloca bajo el campo correcto.

Rótulos fijados, por si hubiera tentación de cambiarlos:

| Concepto | Rótulo en pantalla | Identificador |
|---|---|---|
| Documento del cliente | **Documento** | `dni` |
| Disponibilidad | **Disponible** / **Reservado** | `available` |
| Estado de categoría | **Activa** / **Inactiva** | `status` |
| Fecha de la reserva | **Fecha** | `reservationDate` |

---

## 5. Accesibilidad y dispositivo

| Requisito | Regla | Verificación |
|---|---|---|
| Contraste de texto | >= 4,5:1 (WCAG AA) | Calculado, no estimado - tabla abajo |
| Contraste de bordes y controles | >= 3:1 | Calculado |
| Color como señal | Nunca única: siempre acompañado de texto o icono | Revisión de cada pantalla |
| Foco visible | Borde `Primary` de 2 px en todo control enfocable | Recorrido con tabulador |
| Objetivo táctil | >= 44 px de lado en la variante móvil | Medido en `book-mobile` |
| Rótulo accesible | Todo botón de solo icono lo lleva | Revisión de plantilla |
| Ancho mínimo | 390 px sin desbordamiento horizontal | `book-mobile` (RNF-07, TW-11) |

**Contrastes del tema claro**, medidos sobre los valores de sección 2.1-sección 2.2:

| Par | Ratio | Umbral |
|---|---|---|
| On Primary sobre Primary | 6,29:1 | 4,5:1 OK |
| On Tertiary sobre Tertiary | 5,18:1 | 4,5:1 OK |
| On Surface sobre Surface | 16,76:1 | 4,5:1 OK |
| On Surface Variant sobre Surface | 8,47:1 | 4,5:1 OK |
| Primary sobre Surface | 6,29:1 | 4,5:1 OK |
| Outline sobre Surface | 4,00:1 | 3:1 OK |

El tema oscuro se validó por separado y sus once pares también superan el umbral.

**Cómo se comprueba, y por qué importa.** El ratio se calcula con la fórmula de luminancia
relativa de WCAG, no se juzga a ojo. Un par que "parece bien" a 4,1:1 incumple, y la
diferencia no se ve en una captura. La tabla de ratios se regenera cuando cambia un token.

---

## 6. Estados de la interfaz

Cada pantalla de datos tiene **cinco** estados, y los cinco están diseñados. Una pantalla
que solo contempla el caso feliz no está terminada.

| Estado | Señal del store | Qué se ve |
|---|---|---|
| **Cargando** | `$loading` verdadero | Indicador dentro del panel, conservando la altura de la tabla para que el contenido no salte al llegar |
| **Con datos** | `$datos` no vacío | Tabla y paginador |
| **Vacío** | `$datos` vacío, sin error | Estado vacío con icono, explicación y la acción que lo resuelve |
| **Error** | `$error` presente | Banner con el mensaje del backend y botón "Reintentar" que invoca `reload()` |
| **Filtrado sin resultados** | Hay datos, el filtro no casa | Mensaje distinto del vacío: propone limpiar el filtro, no crear un registro |

Los dos últimos se confunden a menudo y son cosas distintas: "no hay libros" pide crear uno;
"ningún libro coincide con *quijote*" pide borrar el filtro.

**Tras una operación correcta:** snackbar breve y recarga de la tabla. No hay diálogo de
éxito - interrumpe sin aportar.

---

## 7. Pantallas

Once artboards. Cada uno lleva el nombre de su componente Angular; el asistente de
reserva ocupa tres porque sus tres pasos son pantallas distintas.

| Artboard | Componente | Ruta | Endpoint |
|---|---|---|---|
| `login` | `LoginComponent` | `/login` | Supabase Auth |
| `dashboard` | `DashboardComponent` | `/pages/dashboard` | agregados |
| `book` | `BookComponent` | `/pages/book` | `/v1/books` |
| `book-dialog` | `BookDialogComponent` | (modal) | `/v1/books` |
| `client` | `ClientComponent` | `/pages/client` | `/v1/clients` |
| `category` | `CategoryComponent` | `/pages/category` | `/v1/categories` |
| `reservation-wizard` | `ReservationWizardComponent` (paso 1) | `/pages/reservation-wizard` | `/v1/clients` |
| `reservation-wizard-books` | `ReservationWizardComponent` (paso 2) | `/pages/reservation-wizard` | `/v1/books` disponibles |
| `reservation-wizard-confirm` | `ReservationWizardComponent` (paso 3) | `/pages/reservation-wizard` | `POST /v1/reservations` |
| `reservation` | `ReservationComponent` | `/pages/reservation` | `/v1/reservations` |
| `assistant` | `AssistantComponent` | `/pages/assistant` | `/v1/agents` |
| `book-mobile` | `BookComponent` (390 px) | `/pages/book` | `/v1/books` |

### 7.1 Detalle por pantalla

> **Reescrita el 2026-09-16 contra la aplicación en ejecución** (`localhost:4200`), no al
> revés. Donde el diseño y la pantalla no coincidían, mandó la pantalla; cada cambio queda
> trazado en [`AN090`](AN090-conciliación-línea-diseño-funcional.md), DV-27 a DV-34.

**`dashboard` - Panel.** Subtítulo "Estado del catálogo y de los préstamos" y acción de
acento "Nueva reserva". Cuatro tarjetas de indicador, cada una con su icono en pastilla de
40 px, rótulo, cifra y **una línea de detalle que es un hecho calculado**, no un adorno:

| Indicador | Cifra | Detalle | Tono de la pastilla |
|---|---|---|---|
| Libros en el catálogo | 24 | 5 categorías activas los clasifican | `Primary Container` |
| Disponibles ahora | 18 | 6 reservados, el 25 % del catálogo | Éxito |
| Reservas registradas | 3 | 3 en los últimos 7 días | `Tertiary Container` |
| Clientes | 5 | 2 con alguna reserva | `Secondary Container` |

Debajo, el panel **"Libros por categoría"**: una tabla de barras horizontales, una fila por
categoría con su nombre, la barra en el tono de la categoría y el número en monoespaciado.
La tabla *es* el gráfico -el lector de pantalla lee "Ciencia, 4 libros"-, así que la vista
accesible no es una alternativa aparte. Las categorías inactivas llevan su etiqueta al lado
del nombre. **No hay serie de reservas por mes**: el modelo no guarda fecha de alta de
libros ni de clientes, y una curva mensual habría sido inventada.

**`book` - Libros.** Subtítulo "Catálogo completo de la biblioteca" y acción "Nuevo libro".
Barra de filtros con buscador de 320 px -"Buscar por título o autor"- y un chip por cada
una de las seis categorías. Tabla de seis columnas: **Título** (ordenada) - Autor - ISBN
monoespaciado - Categoría (etiqueta con su tono) - **Disponibilidad** (Disponible / Reservado)
- Acciones (editar, eliminar). Paginador de Material con 10 filas por página.

**`book-dialog` - Alta y edición de libro.** Diálogo de 620 px: Título a ancho completo,
Autor e ISBN en dos columnas, Categoría como desplegable, e interruptor **Disponible** con
su texto de apoyo -"Un libro deja de estar disponible al reservarse; aquí se corrige a mano
si hiciera falta"-. Cierra con "Cancelar" y "Guardar", que nace deshabilitado hasta que el
formulario es válido. **Cinco campos, ni uno más**: el modelo no tiene ejemplares ni fecha
de alta. El ISBN duplicado (RN-02) se pinta bajo el campo que lo provoca.

**`client` - Clientes.** Subtítulo "Personas que pueden reservar libros". Solo buscador, sin
chips. Tabla de Nombres - **Apellidos** (ordenada) - Documento monoespaciado - Correo -
Acciones, y son **tres** acciones: ver reservas del cliente (RF-11), editar y eliminar.

**`category` - Categorías.** Subtítulo "Clasificación del catálogo". El filtro no son chips
sino un **selector segmentado** de Todas / Activas / Inactivas. Tabla de **Nombre**
(ordenada, con el punto de color de la categoría delante) - Descripción - Estado
(Activa / Inactiva) - Libros - Acciones. Intentar eliminar una categoría con libros devuelve
un rechazo que dice **cuántos** libros lo impiden (RN-11).

**`reservation-wizard` - Nueva reserva.** Tres pasos, tres artboards, **recorridos en la
aplicación el 2026-09-16** de principio a fin sin llegar a guardar. Lo común a los tres: el
subtítulo dice en cuál estás, la acción de cabecera es un "Salir sin guardar" delineado y el
indicador de progreso marca los pasos ya hechos con un **lápiz**, no con un visto, porque se
puede volver a ellos.

- **Paso 1 - Cliente.** Buscador "Buscar por nombre o documento" y lista con radio: nombre y,
  debajo, `documento - correo` en monoespaciado. El pie solo tiene "Continuar", **deshabilitado
  hasta elegir cliente**; no hay "Atrás" porque es el primer paso.
- **Paso 2 - Selección de libros.** Lo elegido aparece como **chips retirables encima del
  buscador**, y la lista de abajo son solo libros **disponibles** (RN-06), cada uno con
  título, `autor - categoría - ISBN` y una casilla a la derecha. No se puede elegir dos veces
  el mismo título (RN-08). Pie con "Atrás" y "Continuar".
- **Paso 3 - Confirmación.** Tres tarjetas de resumen: **Cliente** (nombre, documento y correo),
  **Libros (N)** (título, autor y categoría de cada uno) y **Fecha**, que no es un campo sino
  una explicación: *"La registra el sistema al guardar. La fecha y hora de la reserva son las
  del momento en que se guarda, y no se pueden modificar"* - RN-10, dicho donde el usuario lo
  lee. La acción final, "Confirmar reserva", es la única de **acento** del flujo.

**Salir a mitad pide confirmación:** el diálogo dice qué se pierde -"Se perderá la selección
de 2 libros y la reserva no quedará registrada"-, con la cuenta real de libros elegidos.

**`reservation` - Reservas.** Subtítulo "Préstamos registrados, del más reciente al más
antiguo". **No tiene barra de filtros.** Tabla de Fecha monoespaciada - Cliente - Libros
reservados - Acciones. Cada título va como etiqueta neutra en la propia fila, todos, sin
recorte ni "+N": con el volumen real caben (RF-10 pide verlos sin navegar al detalle). La
única acción es eliminar, porque RN-13 no permite editar una reserva.

**`assistant` - Asistente.** Subtítulo "Consulta el catálogo y las reservas en lenguaje
natural". El artboard dibuja el **estado inicial**, que es lo que ve quien entra: icono,
"Pregúntame por el catálogo", el párrafo que declara el límite -"No registro ni modifico
nada: para eso están las pantallas de gestión"- y cuatro preguntas de ejemplo. La cuarta,
"Registra una reserva para María", es de escritura **a propósito**: al pulsarla el agente
se niega, que es lo que comprueba el paso 5.1.3 de AN120. Abajo, el redactor con "Escribe
tu pregunta" y el botón "Enviar", deshabilitado mientras no haya texto.

**`book-mobile` - Libros en móvil.** 390 x 844. Cabecera compacta de 56 px, buscador y
chips, y la tabla sustituida por **tarjetas**: título, autor, etiquetas de categoría y
disponibilidad, ISBN y una fila de acciones separada por un filete, con los botones de icono
agrandados a 44 px. El menú lateral se sustituye por la barra inferior de cinco destinos
-Categorías se alcanza desde Libros- y la acción principal baja a un botón flotante.

### 7.2 Capturas de referencia

`diseño/preview/` guarda dos renders del archivo de Figma -`dashboard.jpg` y `book.jpg`- y,
en `diseño/preview/app/`, **las mismas dos pantallas capturadas de la aplicación en
ejecución** el 2026-09-16 sobre el juego de datos canónico.

Las dos parejas se pueden poner una al lado de la otra: el archivo de Figma se redibujó
contra esas capturas, así que si alguna vez dejan de parecerse, es el diseño el que se ha
quedado atrás.

---

## 8. Datos canónicos de la demostración

El juego de datos con el que se dibujó el diseño y con el que se ejecutan las capturas y la
prueba de aceptación. Se carga **por la API**, no con `INSERT` directos (AN010 sección 9).

Ninguno de estos datos corresponde a una persona real.

### 8.1 Categorías (6)

| Nombre | Descripción | Estado |
|---|---|---|
| Narrativa | Novela, cuento y relato en lengua española y traducida | Activa |
| Informática | Programación, arquitectura de software y sistemas | Activa |
| Ciencia | Divulgación científica, física, biología y matemáticas | Activa |
| Historia | Historia universal, América Latina y ensayo histórico | Activa |
| Infantil | Álbum ilustrado y lectura para primeros lectores | Activa |
| Hemeroteca | Publicaciones periódicas retiradas de circulación | **Inactiva** |

**Hemeroteca está desactivada a propósito.** Es el dato que permite verificar RN-14 sin
añadir una séptima categoría: no debe aparecer en el desplegable del formulario de libro,
pero los libros ya clasificados en ella conservan su referencia y su tono en la tabla.

### 8.2 Libros (24)

Cuatro por categoría, todos disponibles al inicio. Cada uno con título, autor, ISBN de 13
dígitos único y su categoría. El ISBN de la demostración se genera con prefijo `978` y no
corresponde a ninguna publicación real.

### 8.3 Clientes (5)

Nombres, apellidos, documento de 8 dígitos y correo ficticio de dominio `@correo.com`.

### 8.4 Reservas iniciales (3)

| # | Cliente | Libros | Para qué sirve |
|---|---|---|---|
| 1 | Cliente A | 1 | Caso mínimo (CP-11) |
| 2 | Cliente A | 3 | Segunda reserva del mismo cliente: verifica RF-11 / CP-21 |
| 3 | Cliente B | 2 | Comprueba el borrado con devolución al catálogo (CP-22) |

Tras la carga, **6 de los 24 libros quedan no disponibles** si RF-15 está implementado. Es
la comprobación rápida de que RN-07 funciona: si los 24 siguen disponibles, el marcado no
se está aplicando.

---

## Referencias

- `diseño/README.md` - archivo de Figma, páginas y correspondencia con el código.
- `diseño/figma-plugin/code.js` - generador del diseño; fuente de los valores de este documento.
- [`AN010-análisis-técnico-funcional.md`](AN010-análisis-técnico-funcional.md) - especificación de pantallas (sección 6) y datos de prueba (sección 8.2).
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - requerimientos de experiencia y RNF-07, RNF-08.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - TW-09 a TW-11.
- [`AN060-flujos-de-navegación-appflow.md`](AN060-flujos-de-navegación-appflow.md) - cómo se encadenan estas pantallas.
- [`AN090-conciliación-línea-diseño-funcional.md`](AN090-conciliación-línea-diseño-funcional.md) - divergencias entre diseño y análisis.
