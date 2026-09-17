# SIGBI - Diseño

## Archivo de Figma

**https://www.figma.com/design/8vTvBVU8gUcB4EiC91QEEf**

`fileKey`: `8vTvBVU8gUcB4EiC91QEEf` - team `1303839812280532934`

Generado con el MCP de Figma (`use_figma`, que ejecuta el Plugin API sobre el archivo).
Son capas nativas editables, no imágenes.

**Regenerado el 2026-09-16 contra la aplicación en ejecución.** Hasta esa fecha mandaba el
diseño y el código se ajustaba a él; desde ella manda **lo implementado**: las pantallas se
redibujaron abriendo `localhost:4200` y copiando lo que sirve Angular, con el juego de datos
canónico -24 libros, 18 disponibles, 6 categorías, 5 clientes, 3 reservas-. Las ocho
divergencias que salieron del cotejo están fichadas como DV-27 a DV-34 en
[`../AN090-conciliación-línea-diseño-funcional.md`](../AN090-conciliación-línea-diseño-funcional.md).

Lo que cambió de raíz: el `login` es la tarjeta centrada que existe, no un panel de marca a
dos columnas; el panel lleva "Libros por categoría" en barras horizontales, no una serie de
reservas por mes que el modelo no puede calcular; los filtros son chips de categoría y un
selector segmentado; y el asistente muestra su estado inicial con las cuatro preguntas de
ejemplo. Los estilos y las variables no se recrearon: ningún token de color cambió.

**El nombre del archivo hay que ponerlo a mano.** `figma.root.name` funciona dentro del
plugin, pero el MCP lo rechaza -*Setting the document name is currently not supported*-, así
que al regenerar por MCP el archivo conserva el nombre que tuviera. Debe ser
**SIGBI Sistema de Gestión Bibliotecaria Inteligente**, sin separador.

`preview/dashboard.jpg` y `preview/book.jpg` se reexportaron del archivo regenerado
(720 x 450), y `preview/app/` guarda las mismas dos pantallas **capturadas de la aplicación**.
Generador, archivo, renders y aplicación están alineados entre sí.

| Página | Contenido |
|--------|-----------|
| `SIGBI Foundations` | Roles de color claro/oscuro con contrastes verificados, escala tipográfica, espaciado 4/8, radios, iconografía |
| `SIGBI Components` | Botones, campos (normal, foco, error, deshabilitado), chips, tabla, snackbar, banner de error, estado vacío |
| `SIGBI Screens` | `login`, `dashboard`, `book`, `client`, `category`, `reservation`, `assistant`, `book-dialog` y los tres pasos del asistente de reserva: `reservation-wizard`, `reservation-wizard-books`, `reservation-wizard-confirm` |
| `SIGBI Responsive` | `book-mobile` - 390 x 844 |

Además, en el archivo:

- 14 estilos de color `SIGBI/...` y 7 estilos de texto `SIGBI/...`
- Colección de variables `SIGBI` con modos **Light** / **Dark** (20 variables)

## Correspondencia con el código

Cada artboard lleva el nombre de su componente Angular:

| Artboard | Componente | Endpoint |
|----------|-----------|----------|
| `dashboard` | `DashboardComponent` | - |
| `book` | `BookComponent` | `/v1/books` |
| `book-dialog` | `BookDialogComponent` | `/v1/books` |
| `client` | `ClientComponent` | `/v1/clients` |
| `category` | `CategoryComponent` | `/v1/categories` |
| `reservation` | `ReservationComponent` | `/v1/reservations` |
| `reservation-wizard` | `ReservationWizardComponent` | `/v1/reservations` |
| `assistant` | `AssistantComponent` | `/v1/agents` |

Los tokens de color usan los nombres de Angular Material 22, así que la traducción a
`material-theme.scss` es directa: `Primary` -> `--mat-sys-primary`,
`Surface Container` -> `--mat-sys-surface-container`, etc. Las tablas están dibujadas con
filas de 48 px, equivalente a `mat.theme(density: -1)`.

Tipografía: **Lora** (títulos), **IBM Plex Sans** (interfaz), **IBM Plex Mono** (ISBN y
cifras). Verificado que las tres cargaron en Figma, sin caer al sustituto Inter.

## Idioma

Dos idiomas, y no se mezclan:

- **Identificadores en inglés**: clases, variables, tablas, columnas, endpoints, nombres
  de capa y de artboard. Es la convención del código base.
- **Interfaz en español**: todo lo que lee el usuario. `messages.properties` (el locale por
  defecto del backend) está en español, y los componentes más recientes del frontend
  (`drug-rag`, `medibot-agent`, `not-403`, `login`) son español íntegro. El inglés que queda
  en las pantallas CRUD viejas es plantilla del curso, no la convención a seguir.

## Paleta

Índigo `#4F46E5` como primario y naranja `#C2410C` como acción secundaria, sobre
superficies con tinte índigo. Los estados llevan tres tonos, no dos: verde para
*Disponible*, ámbar para *Reservado* -un libro apartado no es un error- y rojo solo para lo
que el usuario tiene que corregir. Cada categoría del catálogo lleva su propio tono -índigo,
cian, esmeralda, ámbar, rosa, pizarra- para que la tabla se escanee de un vistazo; el
nombre va siempre escrito al lado, así que el color nunca es la única señal.

Contrastes verificados por cálculo, no a ojo. Todos los pares superan AA (4,5:1) y los
bordes superan 3:1:

| Par | Ratio |
|-----|-------|
| Blanco sobre Primary | 6,29:1 |
| Blanco sobre Tertiary | 5,18:1 |
| On Surface sobre Surface | 16,76:1 |
| On Surface Variant sobre Surface | 8,47:1 |
| Primary sobre Surface | 6,29:1 |
| Outline sobre Surface | 4,00:1 |

El tema oscuro se validó aparte -no es una inversión- y sus once pares también pasan.

## Regenerar

`figma-plugin/` contiene el mismo diseño como plugin de Figma independiente, por si se
quiere regenerar sin MCP. Ver `figma-plugin/README.md`.

`preview/` guarda renders de referencia exportados del archivo.
