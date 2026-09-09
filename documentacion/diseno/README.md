# SIGBI · Diseño

## Archivo de Figma

**https://www.figma.com/design/8vTvBVU8gUcB4EiC91QEEf**

`fileKey`: `8vTvBVU8gUcB4EiC91QEEf` · team `1303839812280532934`

Generado con el MCP de Figma (`use_figma`, que ejecuta el Plugin API sobre el archivo).
Son capas nativas editables, no imágenes.

| Página | Contenido |
|--------|-----------|
| `SIGBI · Foundations` | Roles de color claro/oscuro con contrastes verificados, escala tipográfica, espaciado 4/8, radios, iconografía |
| `SIGBI · Components` | Botones, campos (normal, foco, error, deshabilitado), chips, tabla, snackbar, banner de error, estado vacío |
| `SIGBI · Screens` | `login`, `dashboard`, `book`, `client`, `category`, `reservation-wizard`, `reservation`, `assistant`, `book-dialog` |
| `SIGBI · Responsive` | `book-mobile` — 390 × 844 |

Además, en el archivo:

- 14 estilos de color `SIGBI/…` y 7 estilos de texto `SIGBI/…`
- Colección de variables `SIGBI` con modos **Light** / **Dark** (20 variables)

## Correspondencia con el código

Cada artboard lleva el nombre de su componente Angular:

| Artboard | Componente | Endpoint |
|----------|-----------|----------|
| `dashboard` | `DashboardComponent` | — |
| `book` | `BookComponent` | `/v1/books` |
| `book-dialog` | `BookDialogComponent` | `/v1/books` |
| `client` | `ClientComponent` | `/v1/clients` |
| `category` | `CategoryComponent` | `/v1/categories` |
| `reservation` | `ReservationComponent` | `/v1/reservations` |
| `reservation-wizard` | `ReservationWizardComponent` | `/v1/reservations` |
| `assistant` | `AssistantComponent` | `/v1/agents` |

Los tokens de color usan los nombres de Angular Material 22, así que la traducción a
`material-theme.scss` es directa: `Primary` → `--mat-sys-primary`,
`Surface Container` → `--mat-sys-surface-container`, etc. Las tablas están dibujadas con
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
superficies con tinte índigo. Cada categoría del catálogo lleva su propio tono —índigo,
cian, esmeralda, ámbar, rosa, pizarra— para que la tabla se escanee de un vistazo; el
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

El tema oscuro se validó aparte —no es una inversión— y sus once pares también pasan.

## Regenerar

`figma-plugin/` contiene el mismo diseño como plugin de Figma independiente, por si se
quiere regenerar sin MCP. Ver `figma-plugin/README.md`.

`preview/` guarda renders de referencia exportados del archivo.
