# ESTÁNDAR DE BACKEND - JAVA / SPRING BOOT

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`EST020` - N.º EST-2026-002

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | EST020 |
| Versión | 1.0 |
| Fecha | 2026-09-11 |
| Autor | Dante Willy Quispe Madueño |
| Estado | Vigente |
| Ámbito | Todo el código de `backend/src/main/java` |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-11 | D. Quispe | Versión inicial. Derivado del código existente, no propuesto desde cero. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

> Este estándar **no es una propuesta nueva**: está derivado del backend existente. Toda
> clase nueva debe seguirlo para encajar con las abstracciones genéricas ya implementadas.
> Complementa a [`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md),
> que norma la persistencia.

---

## 1. Principios

1. **Reutilizar antes que abstraer.** `ICRUD`, `CRUDImpl` e `IGenericRepo` resuelven el
   90 % de un CRUD. Antes de crear una abstracción nueva hay que demostrar que ninguna de
   las tres sirve.
2. **Una responsabilidad por capa.** El controlador traduce HTTP; el servicio decide; el
   repositorio persiste. Ninguna capa hace el trabajo de otra.
3. **La entidad no sale del backend.** La frontera del sistema son los DTOs.
4. **Nada implícito en la configuración.** `nullable`, `length`, códigos de estado y
   validaciones se declaran; no se dejan al valor por defecto.
5. **Identificadores en inglés, texto de usuario en español.** Son dos idiomas y no se
   mezclan. `messages.properties` es el locale por defecto y está en español.
6. **Ningún secreto en el código.** Todo valor sensible entra por variable de entorno.

---

## 2. Estructura del proyecto

Un solo módulo Maven. La separación es por paquete, no por proyecto:

```
com.sigbi
+-- controller     Endpoints REST
+-- service        Interfaces de caso de uso
|   +-- impl       Implementaciones
+-- repo           Interfaces Spring Data
+-- model          Entidades JPA
+-- dto            Contratos de entrada y salida
+-- config         Beans de configuración
+-- exception      Excepciones propias y manejador global
+-- security       Integración con el proveedor de identidad
+-- tool           Herramientas invocables por el agente de IA
+-- util           Utilidades transversales
```

**Dirección de las dependencias, innegociable:**

```
controller -> service -> repo -> model
     +-------> dto <----- (ModelMapper)
```

Un controlador **nunca** inyecta un repositorio. Un servicio **nunca** devuelve un DTO ni
recibe uno: trabaja con entidades; el mapeo ocurre en el controlador.

**Resuelto el 2026-09-15:** el paquete raíz es `com.sigbi` y el `artifactId`,
`sigbi-backend`. Se renombraron en un commit único al cerrar la migración (D-01 de AN020).

---

## 3. El caso de uso (porción vertical)

### 3.1 Anatomía

Una entidad de dominio son seis archivos. Ni uno más:

| Archivo | Contenido |
|---|---|
| `model/Book.java` | Entidad JPA. Ver EST010 sección 6 para la plantilla. |
| `repo/IBookRepo.java` | `extends IGenericRepo<Book, Integer>` |
| `service/IBookService.java` | `extends ICRUD<Book, Integer>` |
| `service/impl/BookServiceImpl.java` | `extends CRUDImpl<Book, Integer> implements IBookService` |
| `dto/BookDTO.java` | Contrato validado |
| `controller/BookController.java` | `@RequestMapping("/v1/books")` |

### 3.2 Repositorio

```java
public interface IBookRepo extends IGenericRepo<Book, Integer> {
}
```

Vacío si no hay consultas propias. Las consultas derivadas se declaran por nombre de
método (`findByIsbn`, `findByCategoryIdCategory`); `@Query` solo cuando el nombre derivado
resultaría ilegible.

### 3.3 Servicio

```java
public interface IBookService extends ICRUD<Book, Integer> {
}
```

```java
@Service
@RequiredArgsConstructor
public class BookServiceImpl extends CRUDImpl<Book, Integer> implements IBookService {

    private final IBookRepo repo;

    @Override
    protected IGenericRepo<Book, Integer> getRepo() {
        return repo;
    }
}
```

Un CRUD sin reglas propias es exactamente eso: un `getRepo()`. Si un servicio nuevo tiene
más código que esto sin una regla de negocio que lo justifique, sobra código.

**Reglas del servicio:**

- Es la **única** capa donde vive una regla de negocio.
- Recibe y devuelve **entidades**, nunca DTOs.
- Los métodos propios se declaran primero en la interfaz, no solo en la implementación.
- Las operaciones que tocan más de una tabla llevan `@Transactional`.
- No conoce HTTP: no devuelve `ResponseEntity` ni lanza `ResponseStatusException` salvo
  para un fallo de validación de recurso externo (por ejemplo, un archivo rechazado).

### 3.4 DTOs

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookDTO {

    private Integer idBook;

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    @Size(max = 100)
    private String author;

    @NotBlank
    @Size(min = 10, max = 13)
    private String isbn;

    @NotNull
    private Boolean available;

    @NotNull
    private Integer idCategory;
}
```

| Regla | Motivo |
|---|---|
| Un DTO por recurso; se reutiliza en entrada y salida salvo que el contrato difiera de verdad | Dos clases casi idénticas se desincronizan |
| `@NotBlank` en `String`, **no** `@NotNull` | `@NotNull` acepta la cadena vacía. Las plantillas heredadas usan `@NotNull` en textos; es un defecto, no el patrón a copiar |
| `@Size(max = ...)` coincidiendo con el `length` de la columna | Un texto más largo que la columna debe dar 400, no 500 |
| Las relaciones viajan como `idCategory`, no como objeto anidado completo | Evita ciclos y respuestas infladas |
| `@JsonInclude(NON_NULL)` | Las respuestas no llevan campos nulos |
| El DTO **no** lleva anotaciones JPA | Es contrato, no persistencia |

### 3.5 Mapeo

ModelMapper, configurado en `config/MapperConfig.java`.

- Si los nombres de campo coinciden, basta el bean `defaultMapper`.
- Si difieren, se declara un bean de mapeador propio con `createTypeMap` **en los dos
  sentidos** (lectura y escritura), como hace `medicMapper`.
- Si el DTO lleva un objeto anidado cuyo tipo renombra campos, el mapeo implícito no lo
  resuelve y deja nulos: hay que declarar las rutas profundas explícitamente
  (ver `consultMapper`).

En SIGBI los nombres se eligen de forma que coincidan. Un mapeador propio es señal de que
el DTO se apartó del modelo sin necesidad.

---

## 4. Nomenclatura Java

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clase | `PascalCase`, singular | `Book`, `ReservationDetail` |
| Interfaz de servicio | `I` + nombre + `Service` | `IBookService` |
| Implementación | nombre + `ServiceImpl` | `BookServiceImpl` |
| Interfaz de repositorio | `I` + nombre + `Repo` | `IBookRepo` |
| Controlador | nombre + `Controller` | `BookController` |
| DTO | nombre + `DTO` | `BookDTO` |
| Método | `camelCase`, verbo primero | `findByIsbn`, `registerReservation` |
| Constante | `UPPER_SNAKE_CASE` | `MAX_BOOKS_PER_RESERVATION` |
| Paquete | minúsculas, sin guiones | `com.sigbi.service.impl` |
| Variable de entorno | `UPPER_SNAKE_CASE` | `OPENAI_API_KEY` |

**Todo en inglés.** Ninguna clase, método, tabla o endpoint en español. El texto que ve el
usuario es lo único en español, y se resuelve por `messages*.properties`.

**Lombok:** `@Data` en entidades y DTOs; `@RequiredArgsConstructor` en servicios,
controladores y componentes; `@Slf4j` donde haya registro. Inyección **por constructor**;
`@Autowired` sobre campo no se usa en código nuevo.

---

## 5. API REST

### 5.1 Reglas

| Aspecto | Regla |
|---|---|
| Ruta | `/v1/<recurso-en-plural>` en inglés y minúsculas |
| Identificador | Siempre en la ruta: `/v1/books/{id}` |
| Verbos | `GET` consulta - `POST` alta - `PUT` reemplazo - `DELETE` baja |
| Sub-recurso | `/v1/reservations/client/{id}` para relaciones de lectura |
| Retorno | Siempre `ResponseEntity<...>`; nunca la entidad ni un tipo desnudo |
| `201 Created` | Devuelve cabecera `Location` construida con `ServletUriComponentsBuilder` |
| `204 No Content` | Respuesta del `DELETE`; sin cuerpo |
| Formato | JSON. `multipart/form-data` solo cuando viaja un archivo |

### 5.2 Controlador canónico

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/books")
public class BookController {

    private final IBookService service;
    private final ModelMapper defaultMapper;

    @GetMapping
    public ResponseEntity<List<BookDTO>> findAll() throws Exception {
        List<BookDTO> list = service.findAll().stream().map(this::convertToDto).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> findById(@PathVariable Integer id) throws Exception {
        return ResponseEntity.ok(convertToDto(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<Void> save(@Valid @RequestBody BookDTO dto) throws Exception {
        Book obj = service.save(convertToEntity(dto));

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(obj.getIdBook()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> update(@PathVariable Integer id,
                                          @Valid @RequestBody BookDTO dto) throws Exception {
        return ResponseEntity.ok(convertToDto(service.update(id, convertToEntity(dto))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Book convertToEntity(BookDTO dto) {
        return defaultMapper.map(dto, Book.class);
    }

    private BookDTO convertToDto(Book obj) {
        return defaultMapper.map(obj, BookDTO.class);
    }
}
```

**Lo que un controlador no hace nunca:** decidir una regla de negocio, tocar el
repositorio, construir SQL, capturar excepciones para convertirlas en respuesta (de eso se
encarga sección 7) ni devolver una entidad.

**Código muerto:** el código base arrastra bloques comentados (constructores manuales,
`@Autowired` antiguos, alternativas descartadas). En código nuevo no se dejan: para eso
está el historial de Git.

---

## 6. Seguridad (innegociable)

| Regla | Detalle |
|---|---|
| Ningún secreto en el repositorio | Ni en código, ni en `application.yaml`, ni en un comentario. Todo por `${VARIABLE}` |
| El backend no guarda contraseñas | La identidad se delega en Supabase Auth |
| El token se valida siempre | OAuth2 Resource Server: firma, emisor y expiración. `issuer-uri` obligatorio |
| CORS restringido | Un único origen, `app.front.url` |
| Consultas parametrizadas | Vía JPA. Nunca concatenación de cadenas en una consulta |
| Fallos de autenticación en JSON | `RestAuthenticationEntryPoint`; nunca una redirección a formulario |
| Sin datos sensibles en el log | Ni token, ni contraseña, ni correo, ni documento de identidad |
| Validación también en el servidor | Saltarse la interfaz y llamar a la API debe producir el mismo rechazo |

---

## 7. Manejo de errores y registro

### 7.1 Manejo

Centralizado en `exception/ResponseExceptionHandler` (`@RestControllerAdvice`). **Un
controlador no captura excepciones para transformarlas en respuesta.**

| Excepción | Estado | Origen |
|---|---|---|
| `MethodArgumentNotValidException` | `400` | Falla `@Valid`. El cuerpo lista `campo: mensaje` por cada error |
| `DateTimeParseException` | `400` | Fecha sin componente horario; debe ser 400, no 500 |
| `ModelNotFoundException` | `404` | La lanza `CRUDImpl` cuando el id no existe |
| `ArithmeticException` | `406` | Heredado del código base |
| `Exception` | `500` | Red de seguridad |

Cuerpo de error uniforme (`CustomErrorTemplate`): marca de tiempo, mensaje y descripción de
la petición.

**Excepción registrada al estándar (E-01).** El manejador de `Exception` devuelve
`ex.getMessage()` al cliente. Para un fallo no previsto eso puede filtrar detalle interno.
Lo correcto es responder un mensaje genérico y dejar el detalle solo en el log. Se corrige
al implementar el dominio de SIGBI; se documenta aquí para que nadie lo copie como patrón.

### 7.2 Excepciones propias

Extienden `RuntimeException`, viven en `exception/` y llevan un nombre que dice qué pasó,
no dónde:

```java
public class ModelNotFoundException extends RuntimeException {
    public ModelNotFoundException(String message) {
        super(message);
    }
}
```

Se crea una excepción nueva solo si necesita un código HTTP distinto de los de arriba.

### 7.3 Registro

`@Slf4j` de Lombok. Niveles:

| Nivel | Uso |
|---|---|
| `error` | Fallo que impide completar la operación |
| `warn` | Operación completada con una anomalía tolerada (por ejemplo, un borrado de archivo que falló después de guardar) |
| `info` | Hitos de arranque y operaciones de negocio relevantes |
| `debug` | Solo en desarrollo |

Con marcadores (`log.warn("PHOTO DELETE FAILED: {}", url, e)`), nunca con concatenación.

---

## 8. Acceso a datos (JPA)

| Regla | Detalle |
|---|---|
| Las entidades cumplen EST010 | PK `Integer id<Clase>` con `IDENTITY`; FK con nombre de restricción explícito |
| `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` | Con `Include` **solo** en la PK. Evita `LazyInitializationException` y la recursión cabecera-detalle |
| `nullable` y `length` siempre declarados | En toda `@Column` |
| Cascada solo de cabecera a detalle | `cascade = CascadeType.ALL` en el `@OneToMany` de `Reservation` |
| Carga perezosa por defecto en colecciones | No se pone `EAGER` para ahorrar una consulta |
| Sin lógica en la base | Ningún procedimiento, función ni disparador |
| El esquema no se toca a mano | Se cambia la entidad y Hibernate lo aplica. Ver AN070 sección 6 |

---

## 9. Pruebas

El enunciado no exige cobertura, pero sí que el sistema funcione. Mínimo razonable:

| Tipo | Herramienta | Qué cubre |
|---|---|---|
| Slice de web | `@WebMvcTest` (`spring-boot-starter-webmvc-test`) | Que un DTO inválido devuelva 400 y que las rutas respondan el código esperado |
| Unitaria de servicio | JUnit 5 + Mockito | Las reglas propias: reserva sin libros, ISBN duplicado, disponibilidad |

Convenciones: la clase se llama `<ClaseBajoPrueba>Test`, el método describe el caso en
inglés (`savedReservationWithoutBooksIsRejected`), y una prueba comprueba una cosa.

Las pruebas se ejecutan bajo petición: la compilación habitual es
`./mvnw -DskipTests compile`.

---

## 10. Flujo de trabajo

1. **Antes de escribir código**, se lee `CLAUDE.md`, este estándar y EST010.
2. **Antes de crear una abstracción**, se comprueba que `ICRUD` / `CRUDImpl` /
   `IGenericRepo` no la resuelven ya.
3. **Antes de crear una entidad**, se verifica el nombre de la PK contra EST010 sección 3.
4. **Se compila** con `./mvnw -DskipTests compile`; no se entrega código con advertencias
   nuevas.
5. **Un cambio de contrato toca las dos piezas** en el mismo commit: DTO del backend e
   interfaz de `model/` del frontend.
6. **Se revisa `.gitignore`** antes de cada commit. Ningún secreto, ningún artefacto de
   compilación.
7. **Si el cambio altera el esquema**, se actualiza AN070 en el mismo commit.

---

## 11. Registro de excepciones al estándar

Lo que hoy incumple esta norma, por qué y cuándo se corrige. Un incumplimiento no
registrado es un defecto; registrado, es una decisión.

| ID | Excepción | Motivo | Cierre |
|---|---|---|---|
| E-01 | El manejador de `Exception` devuelve `ex.getMessage()` al cliente | Heredado del código base | Se corrige al implementar el dominio de SIGBI (sección 7.1) |
| E-02 | `ConsultDetail` declara `idDetail` en vez de `idConsultDetail` | Heredado; no explota porque nunca se actualiza por su propio servicio | Desaparece al retirar el dominio médico |
| E-03 | Los DTOs heredados usan `@NotNull` en campos `String` | Plantilla del curso | No se corrige: esos DTOs se retiran. Los nuevos usan `@NotBlank` |
| E-04 | Bloques de código comentado en controladores y servicios heredados | Material didáctico del curso | Se retiran con sus clases |
| E-05 | Paquete `com.mitocode` y `artifactId: mediapp-backend` | Renombrar durante la migración rompería imports en masa | **Cerrada el 2026-09-15:** `com.sigbi` y `sigbi-backend` |
| E-06 | `spring-hateoas` y JasperReports siguen en el POM | Heredados; fuera del alcance de SIGBI | **Cerrada el 2026-09-15:** retirados con el dominio médico, junto a MCP, pgvector y el lector de PDF |

---

## Referencias

- [`EST010-estándar-de-base-de-datos.md`](EST010-estándar-de-base-de-datos.md) - norma de persistencia.
- [`AN020-arquitectura-del-sistema.md`](AN020-arquitectura-del-sistema.md) - capas y componentes.
- [`AN040-requerimientos-técnicos-trd.md`](AN040-requerimientos-técnicos-trd.md) - requisitos TB verificables.
- `CLAUDE.md` - resumen operativo de estas convenciones para los agentes de IA.
