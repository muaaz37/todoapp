import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
import org.gradle.api.tasks.testing.logging.TestLogEvent.*

plugins {
  java
  application
  id("com.github.johnrengelman.shadow") version "7.1.2"
}

group = "de.thm.mni"
version = "1.0.0-SNAPSHOT"

repositories {
  mavenCentral()
}

val vertxVersion = "5.0.0"
val junitJupiterVersion = "5.9.1"

val mainClassFCN = "de.thm.mni.ip.Start"

application {
  mainClass.set(mainClassFCN)
}

dependencies {
  implementation(platform("io.vertx:vertx-stack-depchain:$vertxVersion"))
  implementation("io.vertx:vertx-web:$vertxVersion")

  implementation("com.fasterxml.jackson.core:jackson-databind:2.19.0") // jackson for json serialization
  implementation("com.auth0:java-jwt:4.4.0") // jwt for creation
  implementation("io.vertx:vertx-auth-jwt:$vertxVersion") // jwt for authentication

  implementation("org.apache.logging.log4j:log4j-slf4j2-impl:2.22.1")
  implementation("org.apache.logging.log4j:log4j-api:2.22.1")
  implementation("org.apache.logging.log4j:log4j-core:2.22.1")

  implementation("org.springframework.security:spring-security-crypto:6.4.4") // spring security for password hashing
  implementation("commons-logging:commons-logging:1.2") // required by spring security

  testImplementation("io.vertx:vertx-junit5:$vertxVersion")
  testImplementation("org.junit.jupiter:junit-jupiter:$junitJupiterVersion")
}

java {
  sourceCompatibility = JavaVersion.VERSION_21
  targetCompatibility = JavaVersion.VERSION_21
}
