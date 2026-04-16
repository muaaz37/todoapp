# Basisimage mit Java 21
FROM amazoncorretto:21-alpine3.21

# Arbeitsverzeichnis im Container
WORKDIR /app

# Keys kopieren in den Container
COPY keys /app/keys

# Kopiere das gebaute JAR in den Container
COPY idp/build/libs/idp-1.0.0-SNAPSHOT-all.jar app.jar

# Set ENV variables
ENV HOST=0.0.0.0
ENV PORT=8080

# Exponiere Port 8080
EXPOSE 8080

# Startbefehl für den IDP
CMD ["java", "-jar", "app.jar"]
