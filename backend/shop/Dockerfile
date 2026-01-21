# Stage 1: Build
FROM gradle:8.5-jdk21 AS build
WORKDIR /app

# Copiem DOAR fișierele de configurare gradle prima dată (pentru caching)
COPY build.gradle settings.gradle ./
COPY src ./src

# Facem build-ul
RUN gradle build -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]