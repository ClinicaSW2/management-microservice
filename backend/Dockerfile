# Establece la imagen base para el backend
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo JAR a la imagen
COPY clinica-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto en el que Spring Boot escucha (por defecto 8080)
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "app.jar"]
