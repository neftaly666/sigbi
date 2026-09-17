# `.agents/` - Flujo de trabajo asistido por IA

Artefactos del desarrollo asistido por IA de SIGBI, versionados para que puedan
revisarse (requisito sección 6 del enunciado).

| Carpeta | Contenido |
|---|---|
| `features/` | **Specs**: qué construir, escrito *antes* de construirlo |
| `subagents/` | **Agentes**: instrucciones de cada rol especializado |
| `workflows/` | **Flujos**: secuencias de trabajo repetibles |

## Qué hay

| Artefacto | Estado |
|---|---|
| [`features/FEAT-001-registro-de-reserva.md`](features/FEAT-001-registro-de-reserva.md) | **Implementado y verificado**, backend y frontend |
| [`features/FEAT-002-asistente-de-reserva.md`](features/FEAT-002-asistente-de-reserva.md) | **Implementado y verificado.** La spec detectó cuatro puntos que faltaban |
| [`subagents/writer-code.md`](subagents/writer-code.md) | Activo |
| [`subagents/reviewer-standards.md`](subagents/reviewer-standards.md) | Activo |
| [`workflows/WF-001-porcion-vertical.md`](workflows/WF-001-porcion-vertical.md) | Aplicado a las cinco entidades del dominio |

## Para qué sirvió

No son documentos de adorno. FEAT-002 se escribió antes que su pantalla, y al cotejar el
código contra ella aparecieron **cuatro requisitos que la implementación se había
saltado** -el filtro por categoría del paso 2, el comportamiento al fallar el guardado,
la confirmación al abandonar y el destacado de la reserva nueva-. La pantalla "funcionaba"
sin ellos; sin la spec por delante, habrían pasado por buenos.

## Cómo encaja con el resto

La documentación de análisis vive en `documentacion/` (serie AN/EST) y es la
**fuente**: una spec no inventa requisitos, los traduce a algo accionable y
verificable. Si una spec y un documento AN discrepan, manda el AN y la spec se
corrige.

```
AN010 / AN030  (qué debe hacer)
        |
        v
features/FEAT-xxx  (qué construir ahora, con criterios de aceptación)
        |
        v
subagents/         (quién lo construye y con qué reglas)
        |
        v
código + AN120     (verificación)
```

## Idioma

Estos documentos van en **español**, como el resto de `documentacion/`, porque son
para leerse. Los identificadores que aparecen citados -clases, endpoints, columnas-
van en inglés, que es la convención del código (DA-05 de AN020).
