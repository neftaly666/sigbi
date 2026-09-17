# WF-001 - Porción vertical de una entidad

| | |
|---|---|
| **Cuándo** | Al añadir una entidad de dominio al backend |
| **Agente** | [`writer-code`](../subagents/writer-code.md), revisado por [`reviewer-standards`](../subagents/reviewer-standards.md) |
| **Aplicado a** | `Category`, `Book`, `Client`, `Reservation`, `ReservationDetail` |

## Principio

**Vertical antes que horizontal.** No se construyen las cinco entidades y después
los cinco controladores: se construye **una entera** y se comprueba. La segunda
cuesta la mitad porque el camino ya está abierto y los errores de convención ya
salieron.

Si la convención de la clave primaria está mal, conviene descubrirlo el día 1 con
una entidad, no el día 4 con cinco.

## Los seis archivos, en orden

| # | Archivo | Contenido |
|---|---|---|
| 1 | `model/X.java` | Entidad JPA. `nullable` y `length` **siempre explícitos** |
| 2 | `repo/IXRepo.java` | `extends IGenericRepo<X, Integer>`. Vacío si no hay consultas propias |
| 3 | `service/IXService.java` | `extends ICRUD<X, Integer>`. Los métodos propios se declaran **aquí** primero |
| 4 | `service/impl/XServiceImpl.java` | `extends CRUDImpl`. Solo `getRepo()` si no hay reglas |
| 5 | `dto/XDTO.java` | Contrato validado. Sin anotaciones JPA |
| 6 | `controller/XController.java` | `@RequestMapping("/v1/xs")` |

El orden no es casual: cada archivo depende del anterior, así que escribirlos al
revés obliga a volver atrás.

## Paso a paso

1. **Leer la spec** de `features/` y los documentos AN que cite. El esquema físico
   está en `AN070` sección 2; no se improvisa.
2. **Entidad.** Comprobar contra `AN070` columna por columna: tipo, longitud,
   nulabilidad y nombre de la clave foránea (`FK_<HIJA>_<PADRE>`).
3. **Repositorio.** Consultas derivadas por nombre de método. `@Query` solo cuando
   el nombre derivado resultaría ilegible - un `GROUP BY`, por ejemplo - o cuando
   hace falta `JOIN FETCH`.
4. **Servicio.** Aquí y solo aquí viven las reglas. Cada una, con su identificador
   `RN-xx` en un comentario, para que se pueda rastrear desde `AN010` sección 4.
5. **DTO.** Un DTO por recurso, reutilizado en entrada y salida. `@Size(max)`
   coincidiendo con el `length` de la columna: un texto largo debe dar **400, no 500**.
6. **Controlador.** El canónico de `EST020` sección 5.2. Si el DTO y la entidad no
   coinciden en nombres, mapear a mano.
7. **Compilar:** `./mvnw -DskipTests compile`.
8. **Verificar la regla contra la API**, no solo desde la interfaz. Una validación
   que solo vive en el formulario no es una regla: es una sugerencia.

## Criterio de terminado

| # | Criterio |
|---|---|
| 1 | Compila sin advertencias nuevas |
| 2 | Los cinco endpoints responden con el código de `AN040` sección 5.1 |
| 3 | Cada regla se verifica **contra la API** |
| 4 | Ningún error devuelve traza de Java |
| 5 | Ningún texto visible en inglés |
| 6 | Cada regla implementada cita su `RN-xx` en el código |

## Precedente

Las cinco entidades del dominio se construyeron con este flujo el 2026-09-15.
`Category` y `Book` primero -para validar la convención de la clave primaria con
una antes de replicarla-, y después `Client`, `Reservation` y `ReservationDetail`.

El resultado: 20 endpoints y las reglas RN-01 a RN-14 cubiertas. La única con
lógica propia es la reserva; las otras cuatro son `getRepo()` más un `delete` que
valida una restricción.
