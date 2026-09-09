# SIGBI — Estándar de Base de Datos

> Este estándar **no es una propuesta nueva**: está derivado del backend existente
> (`backend/src/main/java/com/mitocode/model/` y `application.yaml`). Toda entidad nueva
> debe seguirlo para funcionar con las abstracciones genéricas ya implementadas.

---

## 1. Motor y generación del esquema

| Aspecto | Valor |
|---------|-------|
| Motor | PostgreSQL (driver `org.postgresql.Driver`) |
| Hosting | Local o Supabase — indistinto |
| Generación del DDL | `spring.jpa.hibernate.ddl-auto: update` |
| Herramienta de migraciones | **Ninguna** (no hay Flyway ni Liquibase) |
| Extensiones | `vector` (pgvector), solo para el módulo RAG |

**Consecuencia:** el esquema es un derivado de las clases `@Entity`. La fuente de verdad
son las entidades Java, no un script SQL. Un script `.sql` externo solo sirve como
referencia de negocio; si llega uno del curso, se traduce a entidades JPA respetando
las reglas de abajo.

Tablas gestionadas por Spring AI y creadas automáticamente:
`vector_store` (pgvector) y `spring_ai_chat_memory` (memoria conversacional).

---

## 2. Nomenclatura

Se usa la estrategia por defecto de Spring Boot,
`CamelCaseToUnderscoresNamingStrategy`. No se declara `@Table` ni `@Column(name=...)`
salvo en las claves foráneas.

| Elemento | Java | PostgreSQL |
|----------|------|------------|
| Tabla | `class Book` | `book` |
| Tabla compuesta | `class ReservationDetail` | `reservation_detail` |
| Columna | `String firstName` | `first_name` |
| Clave primaria | `Integer idBook` | `id_book` |
| Clave foránea | `@JoinColumn(name = "id_category")` | `id_category` |

**Idioma:** identificadores en **inglés** (`Book`, `firstName`, `reservationDate`),
igual que el resto del código base. Los textos visibles al usuario van en español,
resueltos vía `messages*.properties`.

---

## 3. Clave primaria — regla obligatoria

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@EqualsAndHashCode.Include
private Integer idBook;
```

- Tipo **siempre** `Integer`, estrategia **siempre** `IDENTITY` (columna `serial` en PostgreSQL).
- El nombre del campo debe ser exactamente **`id` + el nombre simple de la clase**.

> ### ⚠️ Por qué el nombre de la PK no es negociable
>
> `CRUDImpl.update()` resuelve el setter de la PK **por reflexión**:
>
> ```java
> String methodName = "setId" + entity.getClass().getSimpleName();
> Method setIdMethod = entity.getClass().getMethod(methodName, id.getClass());
> ```
>
> Si la clase `Book` no expone `setIdBook(Integer)`, cualquier `PUT /v1/books/{id}`
> falla en tiempo de ejecución con `NoSuchMethodException` — no lo detecta el
> compilador. `ConsultDetail` ya incumple la regla (declara `idDetail`, no
> `idConsultDetail`); solo no explota porque nunca se actualiza por su propio servicio.

---

## 4. Columnas

Restricciones siempre explícitas; nunca se dejan al valor por defecto:

```java
@Column(nullable = false, length = 150)
private String title;

@Column(length = 250)          // opcional
private String description;

@Column(nullable = false)
private Boolean available;
```

| Tipo Java | Columna PostgreSQL |
|-----------|--------------------|
| `String` | `varchar(length)` |
| `Integer` | `int4` |
| `Boolean` | `bool` |
| `LocalDate` | `date` |
| `LocalDateTime` | `timestamp` |

---

## 5. Relaciones

### Muchos a uno (la FK vive aquí)

```java
@ManyToOne
@JoinColumn(name = "id_category", nullable = false,
            foreignKey = @ForeignKey(name = "FK_BOOK_CATEGORY"))
private Category category;
```

Convención del nombre de la restricción: `FK_<TABLA_HIJA>_<TABLA_PADRE>`, en mayúsculas.

### Uno a muchos (cabecera → detalle)

```java
@OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
private List<ReservationDetail> details;
```

`cascade = CascadeType.ALL` es lo que permite guardar cabecera y detalles en un solo
`save()`, como hace `ConsultServiceImpl`.

### Clave primaria compuesta

Solo cuando la tabla es puramente una relación N:M sin atributos propios. Se usa una
clase `@Embeddable` + `@IdClass` (ver `ConsultExam` / `ConsultExamPK`).
Para SIGBI **no aplica**: `ReservationDetail` tiene id propio.

---

## 6. Plantilla de entidad

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idBook;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String author;

    @Column(nullable = false, length = 13, unique = true)
    private String isbn;

    @Column(nullable = false)
    private Boolean available;

    @ManyToOne
    @JoinColumn(name = "id_category", nullable = false,
                foreignKey = @ForeignKey(name = "FK_BOOK_CATEGORY"))
    private Category category;
}
```

`@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con `@EqualsAndHashCode.Include`
únicamente en la PK evita que Lombok recorra relaciones perezosas y provoque
`LazyInitializationException` o recursión infinita entre cabecera y detalle.

---

## 7. Modelo de SIGBI

Traducción de las entidades del enunciado a este estándar:

| Enunciado | Clase Java | Tabla | PK |
|-----------|-----------|-------|-----|
| Categoría | `Category` | `category` | `id_category` |
| Libro | `Book` | `book` | `id_book` |
| Cliente | `Client` | `client` | `id_client` |
| Reserva | `Reservation` | `reservation` | `id_reservation` |
| DetalleReserva | `ReservationDetail` | `reservation_detail` | `id_reservation_detail` |

### Esquema resultante

```
category                          book
├─ id_category   serial PK        ├─ id_book        serial PK
├─ name          varchar(60)  NN  ├─ title          varchar(150) NN
├─ description   varchar(150) NN  ├─ author         varchar(100) NN
└─ status        bool         NN  ├─ isbn           varchar(13)  NN UNIQUE
                                  ├─ available      bool         NN
                                  └─ id_category    int4 NN → FK_BOOK_CATEGORY

client                            reservation
├─ id_client     serial PK        ├─ id_reservation serial PK
├─ first_name    varchar(70)  NN  ├─ reservation_date timestamp  NN
├─ last_name     varchar(70)  NN  └─ id_client      int4 NN → FK_RESERVATION_CLIENT
├─ dni           varchar(8)   NN
└─ email         varchar(55)  NN  reservation_detail
                                  ├─ id_reservation_detail serial PK
                                  ├─ id_reservation int4 NN → FK_DETAIL_RESERVATION
                                  └─ id_book        int4 NN → FK_DETAIL_BOOK
```

Cardinalidades: `Category 1—N Book`, `Client 1—N Reservation`,
`Reservation 1—N ReservationDetail`, `Book 1—N ReservationDetail`.

**Nota sobre `dni`:** el enunciado lo llama *cedula*. Se mantiene `dni` por coherencia
con `Patient` del código base; el rótulo en pantalla dirá "Cédula".

---

## 8. Reglas de convivencia

1. No se versionan credenciales ni cadenas de conexión: todo por variable de entorno.
2. No se crean tablas a mano en la base: se declara la entidad y Hibernate la genera.
3. `ddl-auto: update` **no borra ni renombra** columnas. Al renombrar un campo, la
   columna vieja queda huérfana; hay que eliminarla manualmente o recrear la base en
   desarrollo.
4. Antes de añadir una abstracción nueva, revisar `CRUDImpl` / `IGenericRepo`: el 90 %
   de un CRUD ya está resuelto.
