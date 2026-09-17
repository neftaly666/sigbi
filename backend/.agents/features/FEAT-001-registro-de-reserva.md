# FEAT-001 - Registro de una reserva

| | |
|---|---|
| **Estado** | **Implementado y verificado**, backend y frontend. Ver sección 7 |
| **Fuente** | `documentacion/AN010-análisis-técnico-funcional.md` sección 4, sección 6.2.4, sección 6.3 |
| **Requerimientos** | RF-08, RF-09, RF-15 - enunciado sección 4 |
| **Reglas** | RN-03 a RN-10 |
| **Escrita** | 2026-09-15, antes de implementar el servicio |

## 1. Qué se construye

El registro de una reserva: un bibliotecario elige un cliente, elige uno o más
libros disponibles y confirma. El sistema graba cabecera y detalles en una sola
operación y marca esos libros como no disponibles.

**Por qué es la funcionalidad relevante del proyecto.** SIGBI tiene cuatro áreas:
categorías, libros, clientes y reservas. Las tres primeras son mantenimientos -una
tabla, un formulario, cuatro operaciones- y su comportamiento se deriva del modelo
de datos. La reserva es la única que:

1. escribe en **más de una tabla** (cabecera y detalles),
2. tiene **reglas de negocio propias**,
3. **modifica** datos de otra entidad como efecto (`book.available`).

Todo lo demás del backend es `getRepo()`.

## 2. Alcance

**Dentro:** validar cliente y libros, grabar la reserva de forma atómica, fijar la
fecha en el servidor, marcar los libros como no disponibles, y deshacer ese marcado
al eliminar la reserva.

**Fuera, por enunciado sección 2:** préstamos, devoluciones, multas, pagos, inventario por
ejemplar, caducidad, cola de espera y notificaciones. **Una reserva no vence**: se
queda hasta que alguien la elimina.

## 3. Reglas, y qué las hace cumplir

| Regla | Enunciado | Dónde vive |
|---|---|---|
| RN-03 | La reserva pertenece a un cliente, que debe existir | `ReservationServiceImpl.resolveClient()` + FK no nulable |
| RN-04 | Al menos un libro | `@NotEmpty` en `ReservationDTO.details` **y** `resolveBooks()` |
| RN-05 | Cada detalle referencia un libro | `@NotNull` en `idBook` + FK no nulable |
| RN-06 | Un libro no disponible no entra en una reserva nueva | `resolveBooks()`, con el título en el mensaje |
| RN-07 | Al reservar, sus libros pasan a no disponibles | `save()`, tras el `insert` |
| RN-08 | El mismo libro no se repite en una reserva | `resolveBooks()`, con un `Set` de control |
| RN-09 | Cabecera y detalles se graban juntos o no se graban | `@Transactional` + `cascade = ALL` |
| RN-10 | La fecha la pone el servidor | `save()`; si llega en la petición se ignora |

**La regla doble no es redundancia.** RN-04 se valida en el DTO *y* en el servicio
a propósito: la anotación da un 400 limpio por campo, y la comprobación del
servicio garantiza que la regla existe aunque alguien llame a la API construyendo
la entidad por otra vía. Es lo que verifica CP-25.

### 3.1 El orden importa

Todas las comprobaciones van **antes del primer `insert`**:

```
resolveClient()   RN-03
resolveBooks()    RN-04 -> RN-05 -> RN-08 -> RN-06
repo.save()       RN-09 (cascade)
marcar libros     RN-07
```

Así, el caso de CP-19 -una reserva con un libro válido y otro inexistente- ni
siquiera llega a escribir. `@Transactional` cubre lo que se escape.

## 4. Contrato

`POST /v1/reservations`

```json
{ "idClient": 3, "details": [ { "idBook": 12 }, { "idBook": 27 } ] }
```

`reservationDate` **no viaja en la petición**. Si llega, se ignora (RN-10).

Respuesta: `201 Created` con cabecera `Location: /v1/reservations/{id}`.

`GET /v1/reservations` devuelve cliente y títulos **ya resueltos**:

```json
[{
  "idReservation": 5,
  "reservationDate": "2026-09-15T10:32:00",
  "client":  { "idClient": 3, "firstName": "Ana", "lastName": "Rojas" },
  "details": [ { "idReservationDetail": 9, "book": { "idBook": 12, "title": "Los ríos profundos" } } ]
}]
```

RF-10 exige verlos sin navegación adicional, y resolverlos en el cliente con N
peticiones sería peor. Se traen con `JOIN FETCH` en la misma consulta: con carga
perezosa el mapeo a DTO ocurre fuera de la sesión y falla.

`DELETE /v1/reservations/{id}` -> `204`, y **devuelve los libros al catálogo** (RN-13).

## 5. Criterios de aceptación

Verificables desde la API, sin interfaz. Referencia a `AN120` sección 4.2.

| # | Caso | Esperado | CP |
|---|---|---|---|
| 1 | Reserva con 3 libros disponibles | `201`; 1 cabecera y 3 detalles | CP-12 |
| 2 | `details: []` | `400` con mensaje explícito, **nunca 201 ni 500** | **CP-25** |
| 3 | Sin `idClient` | `400` señalando el campo | CP-14 |
| 4 | El mismo `idBook` dos veces | `400` explícito | CP-16 |
| 5 | Un libro con `available = false` | Rechazo **con el título** en el mensaje | CP-15 |
| 6 | Un libro válido y otro inexistente | **No se graba nada**: 0 cabeceras, 0 detalles | **CP-19** |
| 7 | `reservationDate` en el pasado | Se ignora; queda la del servidor | CP-18 |
| 8 | Tras reservar 2 libros | Los 2 quedan `available = false` | CP-17 |
| 9 | Eliminar la reserva | Detalles borrados y libros disponibles otra vez | CP-22 |
| 10 | `GET /v1/reservations/client/{id}` | Solo las de ese cliente | CP-21 |

Los casos **2 y 6 no admiten excepción**: el primero demuestra que la regla vive en
el backend y no en el formulario; el segundo, que la transacción es real.

## 6. Fuera de esta spec

La pantalla que consume este contrato está en
[`FEAT-002-asistente-de-reserva.md`](FEAT-002-asistente-de-reserva.md).

---

## 7. Estado de la implementación

> Añadido el 2026-09-15, después de implementar. El texto de arriba es el original y no
> se ha retocado: una spec que se reescribe para encajar con el código deja de ser una
> spec y pasa a ser documentación.

**Implementado y verificado. Sin divergencias.** Lo que se construyó es lo que dice el
contrato de sección 4 y cumple las diez reglas de sección 3.

| Pieza | Dónde |
|---|---|
| Contrato | `controller/ReservationController.java`, `dto/ReservationDTO.java` |
| Reglas | `service/impl/ReservationServiceImpl.java` |
| Consultas con detalles resueltos | `repo/IReservationRepo.java` |
| Pantalla que lo consume | `frontend/src/app/pages/reservation/` |

### Verificación

Los diez criterios de sección 5 se ejecutaron contra la API el 2026-09-15 y pasaron,
incluidos los dos que la spec marcó como innegociables:

- **Caso 2** (`details: []` da 400): la regla vive en el servicio, no en el formulario.
- **Caso 6** (un libro inexistente no graba nada): la transacción revierte de verdad.

Los casos 8 y 9 se comprobaron además desde la interfaz: al reservar, el libro pasó a
`Disponible = false`; al eliminar la reserva, volvió al catálogo.
