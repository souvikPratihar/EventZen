# Stage 1: Build the Spring Boot application
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom first for better build caching
COPY pom.xml .

# Download dependencies first
RUN mvn dependency:go-offline

# Copy the source code
COPY src ./src

# Build the jar
RUN mvn clean package -DskipTests

# Stage 2: Run the built jar
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy jar from build stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]