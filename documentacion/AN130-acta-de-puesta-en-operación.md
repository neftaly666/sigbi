# ACTA DE PUESTA EN OPERACIÓN

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN130` - N.º AN-2026-013

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN130 |
| Versión | 1.0 |
| Fecha | 2026-09-14 |
| Autor | Dante Willy Quispe Madueño |
| Estado | **Plantilla** - se cumplimenta y se firma en el pase |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial de la plantilla, alineada con los componentes de AN110 y el resultado de AN120. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

> **Cómo se usa este documento.** Es una plantilla: se rellena **durante y después del
> pase**, no antes. Un acta cumplimentada de antemano no acredita nada.
>
> Requisitos previos para abrirla:
>
> - La instalación está hecha según [`AN110`](AN110-manual-de-instalación.md).
> - [`AN120`](AN120-guía-de-prueba-de-aceptación.md) se ha ejecutado **entero** y su sección 7.3
>   está firmado.
>
> Si AN120 no está firmado, este acta no se abre.

---

## 1. Identificación del pase

| Campo | Valor |
|---|---|
| Fecha del pase | ____ / ____ / ________ |
| Hora de inicio | ______ : ______ |
| Hora de fin | ______ : ______ |
| Tipo de pase | [ ] Primera puesta en operación [ ] Actualización [ ] Reinstalación |
| Entorno | [ ] Local [ ] Servidor propio [ ] Nube |
| Responsable del pase | ______________________________________ |
| Solicitado por | ______________________________________ |
| Ventana de indisponibilidad prevista | ______________________________________ |
| Procedimiento seguido | `AN110-manual-de-instalación.md` v______ |

### 1.1 Alcance funcional puesto en operación

Marque lo que **queda operativo** al cierre del pase:

| | Funcionalidad | RF | Estado |
|---|---|---|---|
| [ ] | Mantenimiento de categorías | RF-01, RF-02 | |
| [ ] | Mantenimiento de libros | RF-03 - RF-05 | |
| [ ] | Mantenimiento de clientes | RF-06, RF-07 | |
| [ ] | Registro de reservas | RF-08, RF-09 | |
| [ ] | Listado de reservas y consulta por cliente | RF-10, RF-11 | |
| [ ] | Validación de entrada y manejo global de errores | RF-12, RF-13 | |
| [ ] | Asistente conversacional | RF-14 | |
| [ ] | Control de disponibilidad | RF-15 | |
| [ ] | Búsqueda y filtro de libros | RF-16 | |
| [ ] | Panel de resumen | RF-17 | |
| [ ] | Autenticación | RF-18 | |
| [ ] | RAG sobre documentos | RF-19 | |

Lo no marcado se justifica en sección 5.2. **Un requisito de prioridad A sin marcar impide firmar
como conforme** (sección 6.2).

---

## 2. Componentes y versiones desplegados

### 2.1 Aplicación

| Componente | Artefacto | Versión / commit | Ubicación |
|---|---|---|---|
| Backend | `*.jar` | | |
| Frontend | `dist/` | | |
| Documentación | `documentacion/` | | |

| Campo | Valor |
|---|---|
| Repositorio | ______________________________________ |
| Rama | ______________________________________ |
| Commit desplegado (SHA corto) | ______________________________________ |
| Repositorio público | [ ] Sí [ ] No |

### 2.2 Plataforma

| Elemento | Versión requerida | Versión instalada |
|---|---|---|
| JDK | 25 | |
| Node.js | 20+ | |
| PostgreSQL | 15+ | |
| Extensión `vector` | Solo si hay RAG | [ ] Habilitada [ ] No procede |

### 2.3 Parámetros de ejecución

**No se anota ningún valor secreto en este acta.** De las variables sensibles solo se
registra si están definidas.

| Variable | Valor / estado |
|---|---|
| `DB_URL` | |
| `DB_USERNAME` | |
| `DB_PASSWORD` | [ ] Definida (valor no registrado) |
| `SERVER_PORT` | ______ - **debe ser 8080** |
| `FRONT_URL` | |
| `AUTH_MODE` (backend) | [ ] `bearer` [ ] `cookie` |
| `AUTH_MODE` (frontend) | [ ] `bearer` [ ] `cookie` - **debe coincidir con el anterior** |
| `HOST` (frontend) | |
| `SUPABASE_ISSUER_URI` | [ ] Definida |
| `OPENAI_API_KEY` | [ ] Definida [ ] No procede |

| Comprobación de configuración | OK |
|---|---|
| `SERVER_PORT` es `8080` y `HOST` del frontend apunta ahí | [ ] |
| Los dos `AUTH_MODE` dicen lo mismo | [ ] |
| `FRONT_URL` coincide exactamente con el origen desde el que se sirve la SPA | [ ] |
| Ningún secreto figura en `application.yaml` ni en un fichero versionado | [ ] |

Estas cuatro son las trampas de AN110 sección 4.2 y sección 5. Las cuatro dejan el sistema arrancado y
sin funcionar.

### 2.4 Servicios externos

| Servicio | Estado | Observación |
|---|---|---|
| PostgreSQL | [ ] Local [ ] Supabase | |
| Supabase Auth | [ ] Activo [ ] No usado | |
| OpenAI | [ ] Activo [ ] No usado | |

---

## 3. Verificación posterior al pase

### 3.1 Verificación técnica - AN110 sección 7

| # | Comprobación | Resultado |
|---|---|---|
| 1 | Las cinco tablas de dominio existen en la base | [ ] OK [ ] Falla |
| 2 | `GET /v1/books` responde `200` o `401` | [ ] OK [ ] Falla |
| 3 | La SPA carga en su dirección | [ ] OK [ ] Falla |
| 4 | Los seis destinos del menú abren sin banner de error | [ ] OK [ ] Falla |
| 5 | Se crea una categoría desde la interfaz | [ ] OK [ ] Falla |
| 6 | Se crea un libro con esa categoría | [ ] OK [ ] Falla |
| 7 | Se registra una reserva de dos libros y aparece en el listado | [ ] OK [ ] Falla |
| 8 | El asistente responde o avisa de que no está configurado | [ ] OK [ ] N/A |

### 3.2 Verificación funcional - AN120

| Campo | Valor |
|---|---|
| Fecha de ejecución de AN120 | ____ / ____ / ________ |
| Ejecutado por | ______________________________________ |
| Pasos en OK | ______ de 67 |
| Pasos en FALLA | ______ |
| Pasos en N/A | ______ |
| Resultado de AN120 sección 7.3 | [ ] Conforme [ ] Conforme con recortes [ ] No conforme |

**Los dos pasos que no admiten excepción** (AN120 sección 7.2):

| Paso | Qué demuestra | Resultado |
|---|---|---|
| 4.2.1 - `POST /v1/reservations` con `details: []` | La regla vive en el backend, no en el formulario | [ ] OK [ ] Falla |
| 4.2.5 - Reserva con un libro inexistente | La transacción es real: no se graba nada | [ ] OK [ ] Falla |

Si alguno está en Falla, el resultado de sección 6 es **No conforme**, con independencia del resto.

### 3.3 Requisitos de entrega

| # | Requisito | Origen | Estado |
|---|---|---|---|
| 1 | Al menos una spec versionada en `backend/.agents/` | Enunciado sección 6 | [ ] |
| 2 | Al menos un agente definido y versionado | Enunciado sección 6 | [ ] |
| 3 | Cero secretos en el repositorio | RNF-04 - ME-06 | [ ] |
| 4 | El sistema se levanta siguiendo solo el README | RNF-06 - ME-07 | [ ] |
| 5 | Repositorio público | Enunciado sección 8 | [ ] |
| 6 | Interfaz en español, identificadores en inglés | RNF-03 | [ ] |

> El punto 4 se comprueba **con el repositorio clonado en otra carpeta o en otra máquina**,
> nunca en el entorno de desarrollo: una variable exportada semanas atrás en la terminal de
> trabajo no existe para quien evalúa.

---

## 4. Carga inicial de datos

| Campo | Valor |
|---|---|
| Método | [ ] Por la API / interfaz [ ] Otro: ____________________ |
| Ejecutado por | ______________________________________ |
| Fecha y hora | ____ / ____ / ________ ______ : ______ |

| Elemento | Esperado | Cargado |
|---|---|---|
| Categorías | 6 (una inactiva) | |
| Libros | 24 | |
| Clientes | 5 | |
| Reservas | 3 | |
| Libros no disponibles tras la carga | 6 | |

| Comprobación | Resultado |
|---|---|
| La carga se hizo por la API, no con `INSERT` directos | [ ] Sí [ ] No |
| Ningún dato corresponde a una persona real | [ ] Confirmado |
| El recuento final coincide con lo esperado | [ ] Sí [ ] No |

> **Si los libros no disponibles son 0 en lugar de 6**, RF-15 no está operativo. No es un
> error de carga: anótelo en sección 1.1 y en sección 5.2.

---

## 5. Incidencias y desviaciones

### 5.1 Incidencias del pase

| # | Descripción | Gravedad | Resolución | Estado |
|---|---|---|---|---|
| 1 | | [ ] Alta [ ] Media [ ] Baja | | [ ] Resuelta [ ] Abierta |
| 2 | | [ ] Alta [ ] Media [ ] Baja | | [ ] Resuelta [ ] Abierta |
| 3 | | [ ] Alta [ ] Media [ ] Baja | | [ ] Resuelta [ ] Abierta |

### 5.2 Funcionalidad no desplegada

Solo para lo que se dejó fuera **a propósito**. Cada línea debe citar el recorte de AN080
Sección 7.2 o la decisión que la justifica.

| RF | Qué no está | Justificación | Documento |
|---|---|---|---|
| | | | |
| | | | |

### 5.3 Deuda conocida que se traslada

| ID | Asunto | Origen |
|---|---|---|
| D-01 | Paquete `com.mitocode` y `artifactId: mediapp-backend` | **Cerrada el 2026-09-15:** `com.sigbi` / `sigbi-backend` (AN020 sección 10) |
| D-02 | Dominio médico heredado presente en el repositorio | AN020 sección 10 |
| | | |

Marque las que **siguen abiertas** al cierre del pase y añada las nuevas.

### 5.4 Plan de retorno

| Campo | Valor |
|---|---|
| ¿Hay copia previa de la base de datos? | [ ] Sí [ ] No [ ] No procede (primera instalación) |
| Commit anterior al que volver | ______________________________________ |
| Procedimiento de vuelta atrás | Detener backend y frontend - restaurar la copia - desplegar el commit anterior - repetir sección 3.1 |

> `ddl-auto: update` **no deshace cambios de esquema** (TD-08). Si el pase añadió columnas,
> volver al commit anterior no las elimina: quedan huérfanas y hay que retirarlas a mano.
> Sin copia previa de la base, **el retorno no es completo**; anótelo antes de empezar, no
> después.

---

## 6. Resultado y firmas

### 6.1 Resumen

| Bloque | Resultado |
|---|---|
| sección 2.3 Comprobaciones de configuración (4) | ______ / 4 |
| sección 3.1 Verificación técnica (8) | ______ / 8 |
| sección 3.2 Verificación funcional (AN120) | [ ] Conforme [ ] Con recortes [ ] No conforme |
| sección 3.3 Requisitos de entrega (6) | ______ / 6 |
| sección 5.1 Incidencias abiertas | ______ |

### 6.2 Condiciones para declarar conforme

| # | Condición |
|---|---|
| 1 | Las 8 comprobaciones de sección 3.1 en OK |
| 2 | AN120 firmado como **Conforme** o **Conforme con recortes** |
| 3 | Los pasos 4.2.1 y 4.2.5 de AN120 en **OK**, sin excepción |
| 4 | Los 6 requisitos de entrega de sección 3.3 cumplidos |
| 5 | Ninguna incidencia de gravedad **Alta** abierta |
| 6 | Todo RF de **prioridad A** marcado como operativo en sección 1.1 |
| 7 | Toda funcionalidad no desplegada justificada en sección 5.2 con su documento |

### 6.3 Declaración

| | |
|---|---|
| **Resultado del pase** | [ ] **CONFORME** [ ] **CONFORME CON RESERVAS** [ ] **NO CONFORME** |
| Fecha de entrada en operación | ____ / ____ / ________ |

**Reservas** (si el resultado es *Conforme con reservas*):

```
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
```

**Motivo** (si el resultado es *No conforme*) y fecha del nuevo intento:

```
_______________________________________________________________
_______________________________________________________________
```

### 6.4 Firmas

| Rol | Nombre | Firma | Fecha |
|---|---|---|---|
| Responsable del pase | | | |
| Ejecutor de la prueba de aceptación | | | |
| Responsable funcional | | | |

Con la firma de este acta, SIGBI queda en operación con el alcance declarado en sección 1.1 y las
reservas de sección 6.3.

---

## Referencias

- [`AN110-manual-de-instalación.md`](AN110-manual-de-instalación.md) - procedimiento del pase y verificación técnica (sección 7).
- [`AN120-guía-de-prueba-de-aceptación.md`](AN120-guía-de-prueba-de-aceptación.md) - verificación funcional y su acta de conformidad.
- [`AN080-plan-de-implementación.md`](AN080-plan-de-implementación.md) - sección 7.2: recortes que justifican una funcionalidad no desplegada.
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - prioridades de los RF y métricas de entrega.
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - sección 10: deuda conocida que se traslada.
- `evaluación-final/EvFinal_Java_AI_Full_Stack_MitoCode.pdf` - requisitos sección 6 y sección 8.
