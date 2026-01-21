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

# Variabile de mediu default pentru rulare locala
ENV DB-PASSWORD=shop_password \
    DB_URL=Jdbc:postgresql://host.docker.internal:5432/shop_db \
    DB_USERNAME=shop_user \
    JWT_EXPIRATION=3600 \
    JT_SECRET=secret256B1tKeyPentruDev123456789812345678901234567890 \
    PORT=8080 \
    REDIS_HOST=host.docker.internal \
    REDIS_PASSWORD= \
    REDIS_PORT=6379 \
    REDIS_SSL=false

ENTRYPOINT ["java","-jar","/app/app.jar"]