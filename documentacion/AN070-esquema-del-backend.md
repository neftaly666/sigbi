# ESQUEMA DEL BACKEND

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN070` - N.º AN-2026-007

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN070 |
| Versión | 1.1 |
| Fecha | 2026-09-15 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Motor | PostgreSQL 15+ |
| Base de datos | `sigbi` |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-11 | D. Quispe | Versión inicial. Esquema de cinco tablas de dominio derivado del enunciado. |
| 1.1 | 2026-09-15 | D. Quispe | Se ajusta el inventario a la base real tras retirar MediApp y el RAG: las dos tablas de Spring AI dejan de existir y se documentan las cinco de seguridad, que sí existen. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

## 1. Principios del esquema

1. **La fuente de verdad son las entidades Java.** El DDL lo genera Hibernate con
   `spring.jpa.hibernate.ddl-auto: update`. No hay script de creación versionado ni
   herramienta de migraciones; este documento describe el esquema **resultante**, no lo
   define.
2. **Mínimo suficiente.** Cinco tablas de dominio. El enunciado excluye préstamos,
   devoluciones, multas, pagos, inventario avanzado y notificaciones, y el esquema no deja
   columnas "preparadas" para ellos.
3. **Nombres derivados por convención.** Se usa `CamelCaseToUnderscoresNamingStrategy`, la
   estrategia por defecto de Spring Boot. No se declara `@Table` ni `@Column(name = ...)`
   salvo en las claves foráneas.
4. **Identificadores en inglés.** Tablas, columnas y restricciones. Los rótulos que ve el
   usuario van en español y se resuelven en la capa de presentación.
5. **Restricciones explícitas.** `nullable` y `length` se declaran siempre; nunca se dejan
   al valor por defecto de Hibernate.
6. **Sin lógica en la base.** Ningún procedimiento almacenado, función ni disparador. Las
   reglas viven en la capa de servicio (DEC-02 del TRD).

Las reglas de nomenclatura y tipado están normadas en
[`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md); aquí solo se
aplican.

---

## 2. Dominios y tablas

Diez tablas en total: **cinco de dominio** y **cinco de seguridad**.

| Dominio | Tablas | Origen |
|---|---|---|
| 2.1 Catálogo | `category`, `book` | Dominio SIGBI |
| 2.2 Clientes y reservas | `client`, `reservation`, `reservation_detail` | Dominio SIGBI |
| 2.3 Seguridad | `user_data`, `role`, `user_role`, `menu`, `menu_role` | Heredadas del proyecto base |

**Las cinco de dominio son las que contienen datos.** Las de seguridad están vacías porque
RF-18 es de prioridad C y no se ha implementado; se conservan porque el modelo de
autorización del backend depende de ellas (ver sección 2.3).

**No hay tablas de inteligencia artificial.** La versión 1.0 de este documento
contaba dos, `vector_store` y `spring_ai_chat_memory`, creadas automáticamente por Spring
AI. Se eliminaron el 2026-09-15 junto con sus dependencias: RF-19 (RAG) no entra en la
entrega, y la memoria conversacional del asistente vive en el proceso, no en la base.

### 2.1 Catálogo (2)

#### `category`

| Columna | Tipo | Nulo | Regla |
|---|---|---|---|
| `id_category` | `serial` | NO | PK, `IDENTITY` |
| `name` | `varchar(60)` | NO | Nombre de la clasificación |
| `description` | `varchar(150)` | NO | Texto descriptivo |
| `status` | `bool` | NO | Categoría activa o retirada del uso |

`status` no borra: una categoría desactivada deja de ofrecerse al clasificar libros
nuevos, pero los libros ya clasificados conservan su referencia.

#### `book`

| Columna | Tipo | Nulo | Regla |
|---|---|---|---|
| `id_book` | `serial` | NO | PK, `IDENTITY` |
| `title` | `varchar(150)` | NO | Título |
| `author` | `varchar(100)` | NO | Autor principal |
| `isbn` | `varchar(13)` | NO | **UNIQUE** |
| `available` | `bool` | NO | Disponibilidad para reservar |
| `id_category` | `int4` | NO | FK -> `category` |

`isbn` es único a nivel de base, no solo validado en el servicio (TD-04): la unicidad debe
resistir dos altas simultáneas.

`available` es el estado que hace útil al catálogo (MN-01). Lo mueve la capa de servicio al
registrar una reserva, nunca el cliente.

### 2.2 Clientes y reservas (3)

#### `client`

| Columna | Tipo | Nulo | Regla |
|---|---|---|---|
| `id_client` | `serial` | NO | PK, `IDENTITY` |
| `first_name` | `varchar(70)` | NO | Nombres |
| `last_name` | `varchar(70)` | NO | Apellidos |
| `dni` | `varchar(8)` | NO | Documento de identidad |
| `email` | `varchar(55)` | NO | Correo electrónico |

**Nota de nomenclatura.** El enunciado llama *cedula* a este campo. Se mantiene `dni` por
coherencia con `Patient` del código base, y el rótulo en pantalla dice **"Documento"**, que
no presupone el tipo de documento ni el país. Es la
separación deliberada entre identificador en inglés y texto visible en español.

#### `reservation`

| Columna | Tipo | Nulo | Regla |
|---|---|---|---|
| `id_reservation` | `serial` | NO | PK, `IDENTITY` |
| `reservation_date` | `timestamp` | NO | Fecha y hora del registro |
| `id_client` | `int4` | NO | FK -> `client` |

Cabecera de la reserva. No lleva estado ni fecha de vencimiento: la caducidad y la
devolución están fuera de alcance.

#### `reservation_detail`

| Columna | Tipo | Nulo | Regla |
|---|---|---|---|
| `id_reservation_detail` | `serial` | NO | PK, `IDENTITY` |
| `id_reservation` | `int4` | NO | FK -> `reservation` |
| `id_book` | `int4` | NO | FK -> `book` |

Una línea por libro reservado. Tiene clave primaria propia y **no** clave compuesta: el
patrón `@Embeddable` + `@IdClass` de `ConsultExam` solo aplica a relaciones N:M puras sin
atributos propios, y aquí la línea es una entidad con identidad.

### 2.3 Seguridad (5)

| Tabla | Contenido | Estado |
|---|---|---|
| `user_data` | Usuario local, enlazado al de Supabase Auth por `supabase_user_id`. No guarda contraseñas | Vacía |
| `role` | Roles de la aplicación | Vacía |
| `user_role` | Qué roles tiene cada usuario | Vacía |
| `menu` | Destinos de navegación autorizables | Vacía |
| `menu_role` | Qué roles ven cada destino | Vacía |

**Las contraseñas no están aquí.** La identidad se delega en Supabase Auth; `user_data`
solo enlaza ese usuario con los roles locales, de modo que cambiar un permiso sea un
`UPDATE` y no reemitir un token.

**Por qué siguen existiendo estando vacías.** `WebSecurityConfig` consulta `user_data` en
cada petición para resolver los roles locales del token. Con `app.auth.enabled` en `false`
-que es como se ejecuta la demostración- ese código no llega a ejecutarse, pero eliminar
las tablas dejaría el arranque roto en cuanto alguien active la seguridad.

**Deuda abierta.** El frontend ya no consume `menu`: su navegación son los seis destinos
fijos de AN050 sección 3.3. Si RF-18 entra, el permiso se resolverá sobre esa lista y
`menu` y `menu_role` sobrarán; si RF-18 se descarta, sobran las cinco.

---

## 3. Diagrama de relaciones

```
        category                              client
    +---------------+                    +---------------+
    | id_category PK|                    | id_client  PK |
    | name          |                    | first_name    |
    | description   |                    | last_name     |
    | status        |                    | dni           |
    +-------+-------+                    | email         |
            | 1                          +-------+-------+
            |                                    | 1
            | N                                  | N
    +-------v-------+                    +-------v-------------+
    | book          |                    | reservation         |
    | id_book    PK |                    | id_reservation   PK |
    | title         |                    | reservation_date    |
    | author        |                    | id_client        FK |
    | isbn   UNIQUE |                    +-------+-------------+
    | available     |                            | 1
    | id_category FK|                            | N
    +-------+-------+                    +-------v------------------+
            | 1                          | reservation_detail       |
            |                            | id_reservation_detail PK |
            +------------ N -------------| id_reservation        FK |
                                         | id_book               FK |
                                         +--------------------------+
```

Cardinalidades: `Category 1-N Book` - `Client 1-N Reservation` -
`Reservation 1-N ReservationDetail` - `Book 1-N ReservationDetail`.

---

## 4. Claves e integridad destacadas

### 4.1 Claves primarias

Todas siguen la misma regla, sin excepción:

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@EqualsAndHashCode.Include
private Integer idBook;
```

El nombre del campo es exactamente `id` + el nombre simple de la clase. **No es estilo.**
`CRUDImpl.update()` resuelve el setter por reflexión:

```java
String methodName = "setId" + entity.getClass().getSimpleName();
Method setIdMethod = entity.getClass().getMethod(methodName, id.getClass());
```

Si `Book` no expone `setIdBook(Integer)`, todo `PUT /v1/books/{id}` falla en ejecución con
`NoSuchMethodException`, y el compilador no avisa.

### 4.2 Claves foráneas

| Restricción | Tabla hija | Tabla padre | Nulable |
|---|---|---|---|
| `FK_BOOK_CATEGORY` | `book` | `category` | NO |
| `FK_RESERVATION_CLIENT` | `reservation` | `client` | NO |
| `FK_DETAIL_RESERVATION` | `reservation_detail` | `reservation` | NO |
| `FK_DETAIL_BOOK` | `reservation_detail` | `book` | NO |

Declaración canónica:

```java
@ManyToOne
@JoinColumn(name = "id_category", nullable = false,
            foreignKey = @ForeignKey(name = "FK_BOOK_CATEGORY"))
private Category category;
```

Ninguna es nulable: un libro sin categoría, una reserva sin cliente o un detalle sin libro
no son estados válidos del negocio.

### 4.3 Restricciones de unicidad

| Restricción | Tabla | Columna | Motivo |
|---|---|---|---|
| ISBN único | `book` | `isbn` | Un ISBN identifica un título; duplicarlo rompe la búsqueda y el catálogo |

### 4.4 Cascada

```java
@OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
private List<ReservationDetail> details;
```

`cascade = ALL` en la relación cabecera -> detalle es lo que permite grabar la reserva
completa con un solo `save()`, dentro de una transacción (TB-09). Es el mismo patrón que
usa `ConsultServiceImpl` en el código heredado.

### 4.5 Integridad referencial en el borrado

| Operación | Comportamiento |
|---|---|
| Borrar una `category` con libros | La FK lo impide. Se desactiva con `status = false`, no se borra. |
| Borrar un `book` con detalles de reserva | La FK lo impide. |
| Borrar un `client` con reservas | La FK lo impide. |
| Borrar una `reservation` | Arrastra sus `reservation_detail` por la cascada. |

El rechazo llega al cliente como un error controlado por `ResponseExceptionHandler`, nunca
como una traza de Hibernate.

---

## 5. Datos semilla

No hay migración de un sistema previo. Para poder probar el sistema recién instalado se
carga un mínimo:

| Tabla | Volumen | Contenido |
|---|---|---|
| `category` | 6 | Índigo, cian, esmeralda, ámbar, rosa y pizarra son los tonos que el diseño asigna a las seis categorías de muestra |
| `book` | 20-30 | Títulos repartidos entre las seis categorías, todos `available = true` |
| `client` | 5 | Personas de prueba con documento y correo ficticios |
| `reservation` | 2-3 | Con dos o tres detalles cada una, para que el listado muestre el caso de varios libros |

La carga se hace por la propia API, no con `INSERT` a mano: así los datos de prueba pasan
por las mismas validaciones que los reales y sirven de verificación del despliegue.

Ningún dato semilla contiene información personal real.

---

## 6. Cómo se cambia el esquema

Regla operativa, en este orden:

1. **Se edita la entidad JPA.** Nunca la base directamente.
2. **Se comprueba contra EST010** antes de compilar: nombre de la PK, nombre de la FK,
   `nullable` y `length` explícitos.
3. **Se arranca el backend.** Hibernate aplica el cambio con `ddl-auto: update`.
4. **Si el cambio fue un renombrado o un borrado, se limpia a mano.** `update` solo añade:
   la columna antigua queda huérfana en la tabla. En desarrollo lo razonable es recrear la
   base.
5. **Se actualiza este documento** en el mismo commit que la entidad. Un esquema
   documentado que no coincide con el código es peor que no documentarlo.

### 6.1 Lo que `ddl-auto: update` no hace

| No hace | Consecuencia |
|---|---|
| Borrar columnas | La columna eliminada del modelo sigue en la tabla |
| Renombrar columnas | Crea la nueva y deja la vieja con sus datos |
| Cambiar el tipo de una columna existente | El cambio se ignora en silencio |
| Añadir una restricción a una tabla con datos que la incumplen | Falla el arranque |
| Borrar tablas | La tabla de una entidad eliminada permanece |

Por eso el punto 4 no es opcional.

**Ocurrió, y así se resolvió.** Al retirar el dominio médico el 2026-09-15, sus siete
tablas siguieron en Supabase pese a no quedar ninguna entidad que las mapeara -exactamente
lo que anticipa la fila de arriba-. Se eliminaron a mano, junto a las dos de Spring AI,
con un `DROP ... CASCADE` dentro de una transacción que comprueba que cada tabla esté
vacía antes de tocarla y aborta con `rollback` si alguna tiene filas. Nueve tablas, cero
filas perdidas, y el inventario pasó de diecinueve a diez.

---

## 7. Correspondencia con el enunciado

| Enunciado (sección 3, entidades mínimas) | Clase Java | Tabla | Campos del enunciado cubiertos |
|---|---|---|---|
| Categoría - id, nombre, descripción, estado | `Category` | `category` | Los cuatro |
| Libro - id, título, autor, isbn, disponible, categoría | `Book` | `book` | Los seis |
| Cliente - id, nombres, apellidos, cedula, email | `Client` | `client` | Los cinco (`cedula` -> `dni`) |
| Reserva - id, fechaReserva, cliente, detalleReserva | `Reservation` | `reservation` | Los cuatro |
| DetalleReserva - id, reserva, libro | `ReservationDetail` | `reservation_detail` | Los tres |

Relaciones exigidas por el enunciado, todas presentes: un libro pertenece a una categoría;
una reserva pertenece a un cliente; una reserva contiene uno o más detalles; cada detalle
referencia un libro.

---

## Referencias

- [`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md) - norma de nomenclatura, tipos y plantilla de entidad.
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - dónde encaja la persistencia.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - requisitos TD verificables.
- `evaluación-final/EvFinal_Java_AI_Full_Stack_MitoCode.pdf` - entidades y relaciones mínimas exigidas.
