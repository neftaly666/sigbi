# MANUAL DE USUARIO

**Sistema de Gestión Bibliotecaria Inteligente - SIGBI**
Trabajo final del curso Java AI Full Stack - MitoCode

`AN100` - N.º AN-2026-010

## Datos principales

| Campo | Valor |
|---|---|
| Proyecto / Sistema | Sistema de Gestión Bibliotecaria Inteligente (SIGBI) |
| Código del documento | AN100 |
| Versión | 1.0 |
| Fecha | 2026-09-14 |
| Autor | Dante Willy Quispe Madueño |
| Estado | **Provisional** - se verifica contra la aplicación al cerrar H-2 (2026-09-25) |
| Dirigido a | Bibliotecario (usuario operativo) |
| Fecha máxima de entrega | 2026-09-30 |

## Control de versiones

| Versión | Fecha | Autor | Descripción del cambio |
|---|---|---|---|
| 1.0 | 2026-09-14 | D. Quispe | Versión inicial, redactada sobre el comportamiento especificado en AN010, AN050 y AN060. Pendiente de contraste con la aplicación construida. |

## Aprobación

| Rol | Nombre | Firma / Fecha |
|---|---|---|
| Autor | Dante Willy Quispe Madueño | |
| Revisor | Docente del curso - MitoCode | |

---

> **Aviso sobre el estado de este manual.** Al 2026-09-17 las pantallas **están construidas y
> verificadas** contra el backend, así que este manual ya no describe un comportamiento
> especificado sino uno comprobado.
>
> Lo que queda pendiente son las **capturas**: las de este documento proceden del archivo
> de Figma, no de la aplicación en ejecución. Se sustituyen por capturas reales al cerrar
> el hito H-2, el 2026-09-25 (AN050 sección 7.2).
>
> Las capturas de pantalla se incorporan tras esa verificación.

---

## 1. Qué es SIGBI y quién lo usa

SIGBI registra tres cosas y las relaciona: **los libros** de la biblioteca, **los clientes**
que los solicitan y **las reservas** que unos hacen de los otros.

Con SIGBI puede saber, en cualquier momento y sin preguntar a nadie:

- si un título está disponible o ya está apartado;
- qué tiene reservado una persona concreta;
- qué se reservó un día determinado, y qué libros incluía cada reserva.

**Lo que SIGBI no hace**, y conviene saberlo desde el principio:

| No hace | Qué significa en el mostrador |
|---|---|
| Préstamos y devoluciones | SIGBI registra que un libro **queda apartado**, no que salga y vuelva. No hay fecha de devolución |
| Multas ni pagos | No hay importes en ninguna pantalla |
| Control de ejemplares | Un título es un registro. Si hay tres ejemplares del mismo libro, son tres registros con ISBN distinto o uno solo: el sistema no los cuenta |
| Caducidad ni lista de espera | Una reserva no vence sola. Se quita cuando usted la elimina |
| Avisos por correo o mensaje | El sistema no notifica a nadie |

Esto no es una carencia por resolver: es el alcance acordado. Un sistema que hiciera todo
eso sería otro producto.

**Quién lo usa.** Hay un solo perfil operativo: el **bibliotecario**. Todo el que entra ve
las mismas pantallas y puede hacer lo mismo. No hay permisos diferenciados ni jefes de
turno con opciones extra.

---

## 2. Ingreso al sistema

Abra el navegador en la dirección que le haya indicado el responsable de la instalación -
en una instalación local, `http://localhost:4200`.

**Si el acceso está activado**, verá la pantalla de ingreso: escriba su correo y su
contraseña y pulse *Entrar*. Las credenciales las gestiona el proveedor de identidad, no
SIGBI: si olvidó la contraseña, tiene que restablecerla allí. Hable con el responsable de
la instalación.

**Si el acceso está desactivado** -es una opción de la instalación-, entrará directamente
al panel sin pedirle nada. Es normal y no significa que el sistema esté mal configurado.

Para salir, use el botón de la esquina inferior izquierda, junto a su nombre.

> **Si de pronto todo deja de funcionar y vuelve a la pantalla de ingreso**, su sesión ha
> caducado. Vuelva a entrar; no ha perdido nada de lo que ya estaba guardado.

---

## 3. Cómo está organizada la pantalla

Todas las pantallas se ven igual:

- A la **izquierda**, el menú fijo con los seis destinos: *Panel*, *Libros*, *Categorías*,
  *Clientes*, *Reservas* y *Asistente*. Abajo, su nombre y el botón de salir.
- **Arriba**, el título de la pantalla en la que está y, a la derecha, su acción principal
  (*Nuevo libro*, *Nueva reserva*...).
- En el **centro**, un panel con tres partes: la barra de búsqueda y filtros, la tabla, y
  el paginador al pie.

**En una pantalla estrecha** -un móvil o una tableta- el menú lateral se convierte en una
barra de botones abajo y la tabla se convierte en una lista de tarjetas. La barra inferior
lleva cinco destinos; *Categorías* se abre desde la pantalla de *Libros*.

---

## 4. El panel

Es lo primero que ve al entrar. Solo informa: aquí no se modifica nada.

Cuatro cifras:

| Indicador | Qué cuenta |
|---|---|
| **Libros en catálogo** | Todos los títulos registrados |
| **Libros disponibles** | Los que no están apartados por ninguna reserva |
| **Clientes** | Personas registradas en el padrón |
| **Reservas** | Reservas registradas |

Debajo, un gráfico de barras con los libros que hay en cada categoría, cada una con su
color.

La forma rápida de detectar un problema: si **libros en catálogo** y **libros disponibles**
son iguales y usted sabe que hay reservas registradas, algo no está marcando los libros
como apartados. Avise al responsable.

Desde aquí también puede empezar una reserva con el botón *Nueva reserva*.

---

## 5. El catálogo

### 5.1 Categorías

Una categoría es la clasificación temática de un libro: *Narrativa*, *Ciencia*, *Historia*...
Cada libro pertenece **a una sola**. Conviene crearlas antes que los libros, porque el
formulario de libro le pedirá elegir una.

Vaya a **Categorías**. La tabla muestra el nombre -con su color delante-, la descripción,
cuántos libros contiene y si está activa.

**Para crear una:** pulse *Nueva categoría*, escriba el nombre (hasta 60 caracteres) y la
descripción (hasta 150), deje el interruptor en *Activa* y guarde.

**Para modificarla:** pulse el lápiz de su fila.

**Para retirarla del uso:** edítela y ponga el interruptor en *Inactiva*. Una categoría
inactiva deja de ofrecerse al clasificar libros nuevos, pero **los libros que ya tenía la
conservan**. Nada se pierde.

**Para eliminarla:** pulse la papelera y confirme.

> **Si tiene libros, el sistema no la dejará eliminar** y le dirá cuántos lo impiden. No es
> un fallo: borrarla dejaría esos libros sin clasificar. Si de verdad quiere deshacerse de
> ella, cambie primero esos libros de categoría; si solo quiere dejar de usarla, márquela
> como inactiva, que es para lo que está.

### 5.2 Libros

Vaya a **Libros**. La tabla muestra título, autor, ISBN, categoría y estado.

**Para buscar:** escriba en la caja de búsqueda -encuentra por título, autor o ISBN- o use
los filtros: *Disponibles*, *Reservados* o una categoría concreta.

**Para registrar un libro:** pulse *Nuevo libro*. Se abre una ventana sobre la tabla con
cinco campos:

| Campo | Qué poner |
|---|---|
| Título | Hasta 150 caracteres |
| Autor | Hasta 100. Si son varios, el principal |
| ISBN | Entre 10 y 13 dígitos. **No puede repetirse** |
| Categoría | Una de las activas |
| Disponible | Déjelo activado salvo que el libro ya esté apartado |

Guarde. La ventana se cierra, la tabla se actualiza y aparece un aviso breve abajo.

> **Si el ISBN ya existe**, el sistema lo rechaza y marca ese campo en rojo con el motivo.
> Es intencionado: el ISBN es lo que impide tener el mismo libro dos veces con el título
> escrito de forma distinta. Compruebe si el libro ya está en el catálogo antes de
> insistir.

**Para modificar o eliminar:** el lápiz y la papelera de la fila. Un libro que aparece en
alguna reserva **no se puede eliminar**; el sistema se lo dirá. Quite antes esa reserva, o
deje el libro y márquelo como no disponible.

---

## 6. Los clientes

El padrón de personas que pueden reservar. Vaya a **Clientes**.

**Para registrar a alguien:** pulse *Nuevo cliente*:

| Campo | Qué poner |
|---|---|
| Nombres | Hasta 70 caracteres |
| Apellidos | Hasta 70 |
| Documento | Exactamente 8 dígitos |
| Correo | Una dirección válida, hasta 55 caracteres |

**Para ver qué tiene reservado una persona:** en su fila, pulse *Ver reservas*. Le lleva al
listado de reservas mostrando solo las suyas. Es la forma rápida de responder a alguien que
pregunta en el mostrador.

Un cliente con reservas registradas **no se puede eliminar**. Elimine antes sus reservas, o
consérvelo: un padrón con clientes antiguos no molesta a nadie.

---

## 7. Registrar una reserva

Es la operación principal del sistema y la única que se hace por pasos. Empiece desde
*Nueva reserva*, en el panel o en la pantalla de Reservas.

### Paso 1 - Elegir el cliente

Busque por nombre o por documento y selecciónelo. Solo uno.

Si la persona no está en el padrón, tiene que registrarla antes en **Clientes**. El
asistente no crea clientes.

### Paso 2 - Elegir los libros

Busque en el catálogo. Puede filtrar por categoría.

**Solo aparecen los libros disponibles.** Un libro apartado por otra reserva no está en la
lista: no es que no exista, es que no se puede reservar.

Pulse los títulos que quiera: se van acumulando arriba como etiquetas. Para quitar uno,
pulse su aspa. Un libro ya elegido aparece marcado y no se puede añadir dos veces.

Hace falta **al menos un libro** para continuar.

### Paso 3 - Confirmar

Verá el resumen: el cliente, los libros elegidos y la fecha.

**La fecha no se puede cambiar.** La pone el sistema en el momento de guardar, con su hora.
Está a la vista para que sepa qué va a quedar registrado, no para editarla. Así la fecha de
una reserva siempre es la real.

Pulse *Confirmar reserva*. Irá al listado de reservas con la suya destacada.

> **Todo se guarda junto o no se guarda nada.** Si algo falla al confirmar, el sistema se
> lo dirá y **volverá a intentarlo con su selección intacta**: no tiene que rehacer el
> recorrido. Y no habrá quedado una reserva a medias - no existe la reserva con la mitad de
> los libros.

Si abandona el asistente a medias, el sistema le pedirá confirmación. Es el único sitio
donde se le pregunta al salir, porque es el único donde puede perder trabajo.

---

## 8. Consultar y eliminar reservas

Vaya a **Reservas**. La tabla muestra, de la más reciente a la más antigua: la fecha con su
hora, el cliente y **los libros de cada reserva en la propia fila**, como etiquetas. Si la
reserva tiene más de tres, verá los tres primeros y un *+N*; páselo por encima para ver el
resto.

No hace falta abrir nada para saber qué se reservó.

**Para filtrar:** por cliente o por rango de fechas.

**Para eliminar una reserva:** la papelera de su fila. El sistema le pedirá confirmación y
le dirá exactamente qué va a pasar - por ejemplo: *"Se eliminará la reserva del 15/09/2026
de Ana Rojas. Sus 2 libros volverán a estar disponibles."*

> **Eliminar una reserva devuelve sus libros al catálogo.** Es lo que se hace cuando alguien
> ya no quiere lo que apartó, o cuando pasó a recogerlo. **No se puede deshacer:** léase la
> confirmación antes de aceptarla.

---

## 9. El asistente

Vaya a **Asistente**. Escriba una pregunta en español, como se la haría a un compañero:

- *¿Qué libros de historia hay disponibles?*
- *¿Cuántas reservas se registraron esta semana?*
- *¿Qué tiene reservado María Fernández?*

El asistente **consulta y responde; no registra nada**. No puede crear una reserva, dar de
alta un libro ni cambiar un dato. Si le pide algo así, le dirá que lo haga en la pantalla
que corresponde.

Recuerda lo que se ha hablado en la conversación, así que puede preguntar *"¿y de
narrativa?"* después de otra pregunta y entenderá a qué se refiere.

> **Si el asistente avisa de que no está configurado**, es que la instalación no tiene clave
> del proveedor de IA. **El resto del sistema funciona con normalidad**: el asistente es un
> añadido, no una pieza imprescindible.

---

## 10. Mensajes del sistema

| Lo que ve | Qué significa | Qué hacer |
|---|---|---|
| Aviso breve abajo tras guardar | Se guardó correctamente | Nada |
| Texto rojo bajo un campo | Ese dato concreto no es válido | Corrija **ese** campo. El mensaje dice el motivo |
| *Ya existe un libro con ese ISBN* | El libro probablemente ya está en el catálogo | Búsquelo antes de volver a registrarlo |
| *No se puede eliminar: tiene N libros* | La categoría está en uso | Márquela inactiva, o cambie de categoría esos libros |
| *No se puede eliminar: tiene reservas registradas* | El libro o el cliente aparece en una reserva | Elimine antes esa reserva, si de verdad quiere borrarlo |
| Franja roja arriba de la tabla con *Reintentar* | No se pudo hablar con el servidor | Pulse *Reintentar*. Si sigue, avise al responsable: el servidor puede estar apagado |
| *El registro ya no existe* | Alguien lo borró mientras usted lo miraba | La tabla se refresca sola |
| Vuelve a la pantalla de ingreso | La sesión caducó | Vuelva a entrar. No ha perdido nada guardado |
| *Aún no hay...* con una ilustración | La tabla está vacía | Use el botón que aparece para crear el primero |
| *Ningún resultado coincide* | Hay datos, pero el filtro no encuentra nada | Borre el filtro o la búsqueda |

Los dos últimos se parecen y no son lo mismo: uno dice que **no hay nada**, el otro que **no
hay nada *que coincida***. Si acaba de escribir en la caja de búsqueda, es el segundo.

**Nunca verá** una pantalla con texto técnico en inglés ni una lista de líneas de código. Si
la ve, es un fallo del sistema: anote qué estaba haciendo y avise.

---

## 11. Preguntas que surgen en el mostrador

**¿Cuándo caduca una reserva?**
Nunca. Se queda hasta que alguien la elimina. Si su biblioteca tiene una política de plazos,
llévela por su cuenta: el sistema no la aplica.

**Un cliente se llevó el libro. ¿Qué hago?**
El sistema no registra préstamos. Lo habitual es eliminar la reserva -lo que devuelve el
libro al catálogo- y marcarlo como no disponible mientras esté fuera, editándolo en
*Libros*.

**Tengo tres ejemplares del mismo título. ¿Cómo lo registro?**
Como tres libros, cada uno con su propio ISBN, o como uno solo si le basta con saber que el
título existe. El sistema no cuenta ejemplares de un mismo registro.

**¿Puedo reservar un libro que ya está apartado?**
No. No aparecerá en el paso 2 del asistente. Si de verdad lo necesita, elimine antes la
reserva que lo tiene.

**Me he equivocado al registrar una reserva.**
Elimínela y vuelva a hacerla. Los libros vuelven al catálogo al eliminarla.

**¿Se pueden recuperar los datos borrados?**
No desde la aplicación. Si hay copia de seguridad de la base de datos, la restaura el
responsable de la instalación.

---

## Referencias

- [`AN010-análisis-técnico-funcional.md`](AN010-análisis-técnico-funcional.md) - comportamiento especificado de cada pantalla (sección 6) y reglas RN-01 a RN-14.
- [`AN050-diseño-ui-ux.md`](AN050-diseño-ui-ux.md) - pantallas, rótulos y estados.
- [`AN060-flujos-de-navegación-appflow.md`](AN060-flujos-de-navegación-appflow.md) - recorridos y qué ocurre ante un error.
- [`AN110-manual-de-instalación.md`](AN110-manual-de-instalación.md) - para el responsable de la instalación.
- [`AN120-guía-de-prueba-de-aceptación.md`](AN120-guía-de-prueba-de-aceptación.md) - recorrido de verificación.
