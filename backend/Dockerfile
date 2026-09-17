# Imagen del backend de SIGBI. Dos etapas: se compila con el JDK y se ejecuta con el JRE,
# para que la imagen final no lleve Maven ni el código fuente.
#
# Java 25 y Spring Boot 4.1 son recientes: los "buildpacks" automáticos de varias
# plataformas todavía no los reconocen, y por eso se despliega con Dockerfile.

FROM eclipse-temurin:25-jdk AS compilacion
WORKDIR /origen

# Primero el descriptor: si no cambia, la capa de dependencias se reaprovecha entre
# despliegues y la compilación baja de minutos a segundos.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
# El `|| true` es a propósito: bajar dependencias por adelantado es una optimización, no
# un requisito. Si `go-offline` tropieza con algún BOM, el `package` de abajo baja lo que
# falte y el despliegue no se cae por un atajo.
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline || true

COPY src/ src/
RUN ./mvnw -B clean package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /aplicacion

# Usuario sin privilegios: si alguien entra por una vulnerabilidad, no entra como root.
RUN useradd --system --create-home sigbi
USER sigbi

COPY --from=compilacion /origen/target/*.jar aplicacion.jar

# La plataforma decide el puerto con la variable PORT; en local manda SERVER_PORT.
ENV SERVER_PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75 -jar aplicacion.jar"]
