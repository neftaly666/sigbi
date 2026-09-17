# PLAN DE IMPLEMENTACIÓN

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN080` - N.º AN-2026-008

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN080 |
| Versión | 1.1 |
| Fecha | 2026-09-15 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Horizonte | 2026-09-14 -> 2026-09-30 - 13 días laborables - 52 horas efectivas |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial. Convierte la estimación de AN010 (Anexo A) en dos productos entregables y una etapa de cierre, con criterios de terminado y orden de recorte. |
| 1.1 | 2026-09-15 | D. Quispe | RF-14 reclasificado a prioridad B (ver AN030 v1.1): el asistente entra en la lista de recortes y RF-15 sale de ella por estar ya implementado. Se registra el estado real del Producto 1. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

## 1. Estado actual

Verificado contra el árbol del repositorio el 2026-09-14.

| Área | Estado |
|---|---|
| Documentación AN/EST | **Cerrada.** AN010-AN130 y EST010/EST020 escritos. Los que describen el sistema en marcha (AN100, AN120, AN130) quedan a la espera de verificación |
| Diseño | **Cerrado.** Archivo de Figma con foundations, componentes, nueve pantallas y la variante móvil; contrastes calculados |
| Esquema de base de datos | **Creado y verificado.** Las cinco tablas de dominio existen en Supabase con sus claves e índices (AN070 v1.1) |
| Backend - infraestructura | **Heredada y operativa.** `CRUDImpl`, `IGenericRepo`, `ICRUD`, `ResponseExceptionHandler`, seguridad OAuth2, Spring AI |
| Backend - dominio | **Completo.** Las cinco entidades con su CRUD, las reglas RN-01 a RN-14 y el control global de excepciones |
| Frontend - infraestructura | **Heredada y operativa.** `GenericService<T>`, patrón store con signals, interceptores, guarda, layout |
| Frontend - pantallas | **Completas.** Las seis de gestión más los dos asistentes; las de MediApp salieron del repositorio |
| IA | **Readaptada.** El asistente (RF-14) responde sobre catálogo y reservas con herramientas de solo lectura. El RAG (RF-19) se retiró con MediApp |
| `backend/.agents/` | **Creado.** Dos specs, dos agentes y un workflow, con su README. Cubre el requisito sección 6 del enunciado, que pide una spec y un agente |
| Repositorio público | **Sin publicar.** Requisito sección 8 |

El punto de partida se resume en una frase: **está todo decidido y no hay nada construido**.
El plan no tiene que resolver incógnitas de diseño; tiene que caber en el calendario.

### 1.1 El calendario

| | |
|---|---|
| Desde | lunes 2026-09-14 |
| Hasta | miércoles 2026-09-30 |
| Días laborables | 13 |
| Horas efectivas (4 h/día) | **52** |
| Estimación de AN010 sección A.2 | **54** |
| Diferencia | **-2 h** |

No hay holgura. El margen no sale de trabajar más rápido: sale de la lista de recortes de
Sección 7.2, que está decidida de antemano para no tener que decidirla con prisa.

---

## 2. Principio rector

**Primero lo que se evalúa, y de punta a punta.**

Tres consecuencias operativas:

1. **Vertical antes que horizontal.** No se construyen las cinco entidades y después las
   cinco pantallas: se construye `Book` entero -entidad, repositorio, servicio, DTO,
   controlador, servicio de frontend, store, pantalla- y se comprueba que funciona. La
   segunda entidad tarda la mitad porque el camino ya está abierto y los errores de
   convención ya salieron.
2. **Lo heredado no se toca hasta el final.** `CRUDImpl`, los interceptores y el módulo de
   IA se usan tal cual. Mejorar infraestructura que ya funciona no suma un punto en la
   evaluación y consume horas del núcleo.
3. **Lo sacrificable se identifica antes de empezar.** El panel, la retirada del dominio
   médico y el control de disponibilidad están marcados como recortables desde hoy (sección 7.2).
   Un recorte planificado es una decisión; un recorte el día 29 es un accidente.

**Lo que este principio prohíbe:** renombrar el paquete `com.mitocode` al empezar -se hizo al final, ver D-01-, añadir
Flyway, introducir una librería de estado, escribir pruebas unitarias de la infraestructura
heredada, o "aprovechar para" cualquier cosa. Todo eso está fuera hasta que H-2 esté cerrado.

---

## 3. Producto 1 - la API responde (14-18 sep - 20 h)

**Objetivo:** que los 21 endpoints de AN010 sección 6.3 respondan correctamente y que las reglas
RN-01 a RN-14 se cumplan aunque nadie use la interfaz.

**Hito H-1 - viernes 2026-09-18.**

| # | Actividad | Horas | Detalle |
|---|---|---|---|
| 1.1 | Entidades JPA | 4 | `Category`, `Book`, `Client`, `Reservation`, `ReservationDetail`. PK `id<Clase>` de tipo `Integer` con `IDENTITY` (TB-03), `nullable` y `length` explícitos, `cascade = ALL` en la cabecera, `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` |
| 1.2 | Repositorios y servicios | - | Incluido en 1.1: cada uno es una interfaz que extiende `IGenericRepo` / `ICRUD` y una implementación que solo declara `getRepo()` |
| 1.3 | DTOs y validaciones | 3 | Jakarta Validation con las longitudes de AN070. Los mensajes salen de `messages.properties`, en español |
| 1.4 | Controladores CRUD | 3 | Categorías, libros y clientes. `/v1/<recurso>`, `ResponseEntity`, `@Valid`, `Location` en el 201 |
| 1.5 | Servicio y controlador de reserva | 6 | **La pieza crítica.** RN-04, RN-06, RN-08, RN-09, RN-10 y el marcado de RN-07, todo en una transacción |
| 1.6 | Verificación de la API | 4 | CP-01 a CP-25 ejecutados contra la API, sin interfaz |
| | **Total** | **20** | |

### 3.1 Orden dentro de la semana

```
lun 14   Category + Book completos (entidad -> controlador) -- se valida la convención
mar 15   Client + Reservation + ReservationDetail
mié 16   DTOs, validaciones y controladores CRUD
jue 17   Servicio de reserva: transacción, RN-04/06/08/09/10
vie 18   CP-01 a CP-25 contra la API  ----------------------- H-1
```

El lunes se construye **una sola entidad de punta a punta**. Si la convención de la PK está
mal, se descubre el día 1 con una entidad, no el día 4 con cinco.

### 3.2 Criterio de aceptación de H-1

- Los 21 endpoints responden con el código correcto de AN040 sección 5.1.
- `POST /v1/reservations` con tres libros deja **una** cabecera y **tres** detalles.
- `POST /v1/reservations` con `details: []` devuelve 400, no 500 (CP-13).
- Una reserva con un libro inexistente **no graba nada** (CP-19).
- Ningún error devuelve una traza de Java (CP-23, CP-24).
- `./mvnw -DskipTests compile` sin advertencias nuevas (TB-14).

Si H-1 se retrasa, **el plan se desvía y hay que aplicar sección 7.2 inmediatamente**, no la
semana siguiente.

---

## 4. Producto 2 - la aplicación se usa (21-25 sep - 20 h)

**Objetivo:** que un bibliotecario registre una reserva de tres libros desde el navegador y
la vea en el listado, sin tocar la API.

**Hito H-2 - viernes 2026-09-25.**

| # | Actividad | Horas | Detalle |
|---|---|---|---|
| 2.1 | Servicios, modelos y stores | 4 | Un servicio por recurso extendiendo `GenericService<T>`; un store con `httpResource` que expone `$datos`, `$loading`, `$error` y `reload()` (TW-03, TW-04) |
| 2.2 | Pantallas de mantenimiento | 8 | `category`, `book` + `book-dialog`, `client`. Tabla, filtros, diálogo, confirmación de borrado y los cinco estados de AN050 sección 6 |
| 2.3 | Asistente de reserva | 6 | `reservation-wizard`: tres pasos, reglas de avance, envío único, conservación de la selección ante error |
| 2.4 | Listado de reservas | 3 | Títulos como chips en la fila (RF-10) y filtro por cliente (RF-11) |
| 2.5 | Panel | 2 | Cuatro indicadores y gráfico por categoría. **Recortable** |
| | **Total** | **23** | |

> 23 horas estimadas en una semana de 20. El desajuste es real y su salida es sección 7.2: el
> panel (2 h) sale primero y deja la semana en 21 h. La hora restante sale de que la
> segunda y la tercera pantalla de mantenimiento cuestan menos que la primera.

### 4.1 Orden dentro de la semana

```
lun 21   Servicios, modelos y stores de los cuatro recursos
mar 22   Pantalla de categorías completa -- plantilla de las demás
mié 23   Libros + book-dialog - Clientes
jue 24   reservation-wizard
vie 25   Listado de reservas - recorrido completo desde la interfaz ---- H-2
```

### 4.2 Criterio de aceptación de H-2

- Se registra una reserva de tres libros desde la interfaz y aparece en el listado.
- Los títulos de una reserva se ven **en la fila**, sin abrir un detalle (RF-10).
- "Ver reservas" desde un cliente devuelve solo las suyas (RF-11).
- Un error del backend se muestra bajo el campo que lo provocó, en español.
- La pantalla de libros no desborda horizontalmente a 390 px (RNF-07).
- Ningún componente inyecta `HttpClient` (TW-03).

---

## 5. Etapa de cierre (28-30 sep - 12 h)

**Objetivo:** convertir una aplicación que funciona en una entrega evaluable.

**Hito H-3 - miércoles 2026-09-30.**

| # | Actividad | Horas | Requisito |
|---|---|---|---|
| 3.1 | Readaptación del asistente de IA al dominio | 3 | RF-14, prioridad **B**. **Recortable** - no lo exige el enunciado |
| 3.2 | Specs y agentes en `backend/.agents/` | 3 | **Requisito sección 6 del enunciado**, no un extra |
| 3.3 | Retirada del dominio médico y renombrado del paquete | 3 | Higiene. **Recortable** |
| 3.4 | Carga de datos y recorrido de aceptación (AN120) | 2 | Verifica AN100 y cierra AN130 |
| 3.5 | README final, revisión de `.gitignore` y publicación | 2 | **Requisito sección 8 del enunciado** |
| | **Total** | **13** | |

### 5.1 El orden aquí no es negociable

3.2 y 3.5 son **requisitos explícitos del enunciado**: sin ellos la entrega está incompleta
por definición, aunque la aplicación funcione perfectamente. Van antes que 3.1 y 3.3, que
son respectivamente un extra y limpieza.

**Cuidado con confundir 3.1 y 3.2.** El sección 6 del enunciado pide *specs y agentes de
desarrollo* -eso es 3.2, y es obligatorio- **no** un asistente dentro de la aplicación.
3.1 es un añadido propio del proyecto. Esta confusión mantuvo RF-14 clasificado como
prioridad A hasta el 2026-09-15; ver la corrección en AN030 sección 3.1.

```
lun 28   Asistente readaptado + specs y agentes  (3.1, 3.2)
mar 29   Retirada del dominio médico              (3.3)  -- lo primero que se recorta
mié 30   Aceptación, README, publicación          (3.4, 3.5) -- H-3
```

**Si el día 29 no está hecho 3.3**, se publica con el dominio médico dentro y el README
explica en un párrafo qué es SIGBI y qué es base heredada en retirada. Es feo y es
aceptable; no publicar, no lo es.

---

## 6. Definición de terminado (DoD)

### 6.1 Una unidad de trabajo está terminada cuando...

| # | Criterio |
|---|---|
| 1 | Compila sin advertencias nuevas (`./mvnw -DskipTests compile`, `npm run build`) |
| 2 | Cumple el estándar que le aplica: EST010 para persistencia, EST020 para el backend, TW-* para el frontend |
| 3 | Su regla de negocio se verifica **contra la API**, no solo desde la interfaz (RNF-10) |
| 4 | Sus cinco estados están cubiertos si es una pantalla de datos: cargando, con datos, vacío, error, filtrado sin resultados |
| 5 | No introduce ningún texto visible en inglés ni ningún identificador en español (RNF-03) |
| 6 | No versiona ningún secreto (RNF-04) |
| 7 | Está en un commit con mensaje que dice qué cambia, no "avances" |

### 6.2 La entrega está terminada cuando...

| # | Criterio | Origen |
|---|---|---|
| 1 | Los RF de prioridad A están implementados y verificados | ME-01 |
| 2 | Las 8 funcionalidades del enunciado sección 4 están cubiertas | ME-02 |
| 3 | Las 7 funcionalidades del enunciado sección 5 están cubiertas | ME-03 |
| 4 | Hay al menos una spec y un agente versionados | ME-04, ME-05 - enunciado sección 6 |
| 5 | El repositorio contiene **cero** secretos | ME-06 |
| 6 | Un tercero levanta el sistema siguiendo solo el README, sin preguntar nada | ME-07 - RNF-06 |
| 7 | El repositorio es público | enunciado sección 8 |
| 8 | AN120 se ha ejecutado entero y AN130 está firmado | - |

El criterio 6 es el que más se subestima: se comprueba **en una máquina limpia o con el
repositorio clonado en otra carpeta**, no en el entorno donde se desarrolló. Una variable
exportada hace tres semanas en la terminal de trabajo no existe para el evaluador.

---

## 7. Riesgos y recortes

### 7.1 Riesgos vivos

| ID | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R-01 | 54 h estimadas contra 52 disponibles | Alta | Alto | Lista de recortes cerrada de antemano (sección 7.2). Revisión en H-1 y H-2 |
| R-02 | El servicio de reserva se complica y H-1 se pasa del 18 | Media | Alto | Es la ruta crítica: se aborda el jueves 17, con el miércoles como colchón. Si el viernes no está, se recorta el mismo viernes |
| R-03 | El dominio médico confunde al evaluador | Media | Medio | 3.3 lo retira. Si se recorta, el README lo explica explícitamente |
| R-04 | `ddl-auto: update` no borra ni renombra columnas | Media | Medio | En desarrollo se recrea la base tras un renombrado. Documentado en AN070 sección 6.1 y TD-08 |
| R-05 | `AUTH_MODE` desalineado entre frontend y backend: todo responde 401 | Media | Medio | Documentado en README, TC-07 y AN110 sección 7. Ante cualquier duda, la seguridad se desactiva: es opcional |
| R-06 | `backend/.agents/` no existe y es requisito sección 6 | Alta | **Alto** | 3.2 lo crea el lunes 28. No se recorta bajo ninguna circunstancia |
| R-07 | El repositorio sigue privado | Alta | **Alto** | 3.5, el día 30. Es requisito sección 8 |
| R-08 | Dependencia de OpenAI para RF-14 | Baja | Bajo | El núcleo (RF-01 a RF-13) opera sin clave. El asistente informa de que no está configurado |

R-06 y R-07 comparten una característica: **no son riesgos técnicos, son olvidos posibles**.
Su mitigación es que estén escritos aquí y en el DoD, no una solución de ingeniería.

### 7.2 Orden de recorte

Decidido hoy. Si hay que recortar, se recorta **en este orden y sin volver a discutirlo**:

| Orden | Qué se recorta | Horas | Qué se pierde |
|---|---|---|---|
| 1.º | Panel (`dashboard`) - RF-17, prioridad B | 2 | Un resumen agradable. El enunciado sección 5 pide cinco pantallas y el panel no está entre ellas |
| 2.º | Asistente de IA - RF-14, prioridad B (tarea 3.1) | 3 | La función más vistosa del producto, pero **el enunciado no la pide**. Su posición es la más discutible de la lista: el curso es de *Java AI Full Stack* y un evaluador puede valorarla. Si el tiempo alcanza, se conserva |
| 3.º | Retirada del dominio médico - 3.3 | 3 | Higiene del repositorio. Se compensa con un párrafo del README |

**Total recortable: 8 h** - frente a las 7 h de la versión 1.0.

**RF-15 sale de esta lista.** El control de disponibilidad ya está implementado
(RN-06, RN-07 y RN-13 en `ReservationServiceImpl`), así que recortarlo ya no ahorra
tiempo: habría que borrar código.

**Lo que no se recorta nunca:** los 13 RF de prioridad A, las specs y agentes (sección 6 del
enunciado), el README verificado y la publicación del repositorio (sección 8). Antes se entrega
sin panel, sin asistente y sin limpieza que sin ellos.

---

## 8. Gobernanza

| Aspecto | Regla |
|---|---|
| Responsable | Dante Willy Quispe Madueño. Un solo desarrollador: no hay reparto ni dependencias entre personas |
| Ritmo | 4 horas efectivas por día laborable |
| Punto de control | Al cierre de cada hito (H-1, H-2, H-3), contra el criterio de aceptación de su sección |
| Decisión de recorte | En el punto de control, aplicando sección 7.2 en orden. Nunca a mitad de semana ni "sobre la marcha" |
| Control de cambios | Un cambio de alcance se escribe en el documento que le corresponde (AN010, AN030 o AN050) **antes** de programarlo. Lo que no está en la documentación, no se implementa |
| Versionado | Monorepo. Un cambio de contrato toca backend y frontend en el mismo commit (DA-04) |
| Trazabilidad | Cada actividad de sección 3-sección 5 referencia su RF, su RN o su requisito del enunciado. Una actividad sin origen documental no entra en el plan |

### 8.1 Seguimiento

| Hito | Fecha | Criterio | Estado |
|---|---|---|---|
| **H-1** | 2026-09-18 | sección 3.2 - la API responde y las reglas se cumplen | **En curso, adelantado** |
| **H-2** | 2026-09-25 | sección 4.2 - el flujo completo funciona desde la interfaz | Pendiente |
| **H-3** | 2026-09-30 | sección 6.2 - la entrega está terminada | Pendiente |

**Estado real al 2026-09-15** (segundo día de las cinco jornadas del Producto 1):

| Actividad de sección 3 | Horas previstas | Estado |
|---|---|---|
| 1.1 Entidades JPA | 4 | Las cinco, verificadas contra el esquema real |
| 1.3 DTOs y validaciones | 3 | |
| 1.4 Controladores CRUD | 3 | |
| 1.5 Servicio de reserva | 6 | RN-03 a RN-10 y RN-13 |
| 1.6 Verificación CP-01...CP-25 | 4 | **Bloqueada**: la API responde 401 y hace falta decidir PA-02 |

La aplicación arranca contra Supabase y Hibernate creó las cinco tablas conforme a AN070.
Lo único que falta de H-1 es la verificación, y su bloqueo **no es técnico sino de
decisión**: mientras la seguridad esté activa no se puede ejecutar AN120 sección 4.2 sin un
token. También se adelantó la tarea 3.2 de la etapa de cierre: `backend/.agents/` ya existe.

### 8.2 Ruta crítica

```
Entidades -> Servicio de reserva -> Asistente de reserva -> Aceptación -> Publicación
   4 h            6 h                      6 h                  2 h           2 h
```

Todo lo demás se puede reordenar. **El servicio de reserva es el cuello de botella**: es lo
único transaccional, lo único con reglas propias y lo que alimenta la pantalla más cara. El
indicador de alarma es concreto - si el viernes 18 `POST /v1/reservations` no graba cabecera
y detalles correctamente, el plan está desviado y sección 7.2 se aplica ese mismo día.

---

## Referencias

- `evaluación-final/EvFinal_Java_AI_Full_Stack_MitoCode.pdf` - enunciado; origen de los requisitos sección 4, sección 5, sección 6 y sección 8.
- [`AN010-análisis-técnico-funcional.md`](AN010-análisis-técnico-funcional.md) - Anexo A: estimación, cronograma y ruta crítica.
- [`AN030-requerimientos-del-producto-prd.md`](AN030-requerimientos-del-producto-prd.md) - prioridades de los RF y métricas ME-01 a ME-08.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - requisitos TW/TB/TD/TC verificables.
- [`AN050-diseño-ui-ux.md`](AN050-diseño-ui-ux.md) - [`AN060-flujos-de-navegación-appflow.md`](AN060-flujos-de-navegación-appflow.md) - lo que hay que construir en el producto 2.
- [`AN120-guía-de-prueba-de-aceptación.md`](AN120-guía-de-prueba-de-aceptación.md) - recorrido de verificación de la etapa de cierre.
