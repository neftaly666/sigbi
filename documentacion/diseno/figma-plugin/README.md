# SIGBI · Generador de diseño para Figma

Plugin que crea el sistema de diseño y las pantallas de SIGBI como **capas nativas
y editables** dentro de tu cuenta de Figma.

No es una imagen ni una importación: genera frames, auto-layout, textos, estilos de
color y de texto, y variables con modos Claro/Oscuro.

## Por qué un plugin y no el MCP

La API REST de Figma es de **solo lectura** para el contenido de los archivos: permite
leer un diseño, no crear frames ni capas. El servidor MCP oficial expone exactamente eso
(leer una selección y generar código a partir de ella). Lo único que puede escribir
dentro de un archivo es un plugin ejecutándose en el editor. De ahí este paquete.

## Instalación (una sola vez)

1. Abre **Figma Desktop** (los plugins en desarrollo no funcionan en el navegador).
2. Crea o abre el archivo donde quieras el diseño.
3. Menú **Plugins → Development → Import plugin from manifest…**
4. Selecciona el archivo `manifest.json` de esta carpeta.

## Uso

**Plugins → Development → SIGBI Design System**

Tarda unos segundos y deja el archivo con cuatro páginas:

| Página | Contenido |
|--------|-----------|
| `SIGBI · Foundations` | Paleta clara y oscura con contrastes verificados, escala tipográfica, espaciado 4/8, radios, iconografía |
| `SIGBI · Components` | Botones, campos (normal, foco, error, deshabilitado), chips, tabla, snackbar, banner de error, estado vacío |
| `SIGBI · Screens` | `login`, `dashboard`, `book`, `book-dialog`, `client`, `category`, `reservation-wizard`, `reservation`, `assistant` |
| `SIGBI · Responsive` | `book-mobile` — 390 × 844 con navegación inferior |

## Nomenclatura

Sigue la convención del código base, que está **íntegramente en inglés**, incluidas las
etiquetas visibles (`Filter`, `NAME`, `DESCRIPTION`, `ACTIONS`, `Edit`, `Delete`).

Cada artboard de pantalla lleva el nombre del componente Angular equivalente, de modo que
la correspondencia diseño ↔ código es directa:

| Artboard | Componente Angular | Endpoint REST |
|----------|--------------------|---------------|
| `dashboard` | `DashboardComponent` | — |
| `book` | `BookComponent` | `/v1/books` |
| `book-dialog` | `BookDialogComponent` | `/v1/books` |
| `client` | `ClientComponent` | `/v1/clients` |
| `category` | `CategoryComponent` | `/v1/categories` |
| `reservation` | `ReservationComponent` | `/v1/reservations` |
| `reservation-wizard` | `ReservationWizardComponent` | `/v1/reservations` |
| `assistant` | `AssistantComponent` | `/v1/agents` |

Los únicos textos en español son datos de muestra: nombres de personas y títulos de libros.

Además crea en el archivo:

- **Estilos de color** `SIGBI/…` y **estilos de texto** `SIGBI/…`
- Una **colección de variables** `SIGBI` con modos *Claro* y *Oscuro*

## Fuentes

Usa **Lora** (títulos), **IBM Plex Sans** (interfaz) e **IBM Plex Mono** (ISBN y cifras).
Las tres vienen con Figma. Si alguna faltara, el plugin sustituye por Inter y te lo
avisa al terminar en vez de fallar.

## Relación con el frontend

Los tokens de color están nombrados como sus equivalentes de Angular Material 22, de modo
que la traducción a `material-theme.scss` es directa:

| Figma | Angular Material |
|-------|------------------|
| Primary | `--mat-sys-primary` |
| Primary Container | `--mat-sys-primary-container` |
| Surface / Surface Container | `--mat-sys-surface` / `--mat-sys-surface-container` |
| On Surface / On Surface Variant | `--mat-sys-on-surface` / `--mat-sys-on-surface-variant` |
| Outline / Outline Variant | `--mat-sys-outline` / `--mat-sys-outline-variant` |

Las tablas están dibujadas con filas de 48 px, que es `mat.theme(density: -1)`.

## Volver a ejecutarlo

Cada ejecución **añade** cuatro páginas nuevas; no borra ni sobrescribe las anteriores.
Si quieres regenerar, elimina antes las páginas `SIGBI · …` a mano.
