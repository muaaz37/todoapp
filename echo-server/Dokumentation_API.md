# Echo Service API Dokumentation

---

## Projektübersicht

Der **Echo Service** ist ein leichter HTTP-Server, entwickelt mit dem reaktiven Framework [Vert.x](https://vertx.io/), der einfache Echo-Funktionalitäten bereitstellt. Er verarbeitet eingehende HTTP-Anfragen und bietet folgende Hauptfunktionen:

- Echo einer übergebenen Nachricht (`/echo`)
- Verarbeitung und Rückgabe von Benutzerdaten im JSON-Format (`/echoUser`)

Das Projekt ist modular aufgebaut, klar strukturiert und dient als Grundlage für Microservices oder als Lernprojekt für moderne Java-Webservices.

---

## Projektstruktur

| Paket / Klasse             | Beschreibung                                             |
|---------------------------|----------------------------------------------------------|
| `de.thm.pi2.echo_server`  | Enthält die Main-Klasse `MainVerticle` zum Starten des Servers |
| `echo.api`                | Beinhaltet die API-Routen und Handler (`EchoApi.java`)   |
| `echo.dto`                | Enthält Datenklassen (Records) für Request und Response  |

---

## Technologien & Frameworks

- **Vert.x:** Asynchrones, nicht-blockierendes Framework für die JVM
- **Java Records:** Für einfache DTOs (Data Transfer Objects)
- **Jackson Databind:** Für JSON (De-)Serialisierung
- **HTTP Server:** Lauscht standardmäßig auf Port 8888

---

## Starten des Servers

Der HTTP-Server wird in der Klasse `MainVerticle` gestartet.

```java
public class MainVerticle extends VerticleBase {

  @Override
  public Future<?> start() {
    Router router = Router.router(vertx);
    // BodyHandler aktiviert das Lesen von Request Bodies
    router.route().handler(BodyHandler.create());

    EchoApi echoApi = new EchoApi();
    echoApi.appendRouting(router);

    return vertx.createHttpServer()
      .requestHandler(router)
      .listen(8888)
      .onSuccess(server -> System.out.println("HTTP server started on port 8888"));
  }
}
```

---

## API Endpunkte

### 1. GET `/echo`

**Beschreibung:**
Dieser Endpoint gibt die übergebene Nachricht (`msg` als Query-Parameter) als einfachen Text zurück.

**Request Beispiel:**
```
GET /echo?msg=Hallo
```

**Antwort:**
- Status Code: `200 OK`
- Content-Type: `text/plain`
- Body: `Echo: Hallo`

**Fehler:**
Wenn der Query-Parameter `msg` fehlt, antwortet der Server mit:
- Status Code: `400 Bad Request`
- Content-Type: `application/json`
- Body:
```json
{
  "error": "Missing query parameter 'msg'"
}
```

---

### 2. POST `/echoUser`

**Beschreibung:**
Dieser Endpoint nimmt JSON-kodierte Benutzerdaten entgegen und antwortet mit einer generierten User-ID und dem Benutzernamen im JSON-Format.

**Request Beispiel:**
```http
POST /echoUser
Content-Type: application/json

{
  "username": "muaa",
  "password": "geheim"
}
```

**Antwort:**
- Status Code: `200 OK`
- Content-Type: `application/json`
- Body Beispiel:
```json
{
  "id": "871d6b63-6e64-4b7c-a707-8c46bcc41239",
  "username": "muaa"
}
```

**Fehlerfälle:**
- Fehlender oder leerer `username`:
  - Status Code: `400 Bad Request`
  - Body:
  ```json
  {
    "error": "Missing or empty username"
  }
  ```
- Ungültiges JSON oder interne Serverfehler:
  - Status Code: `500 Internal Server Error`
  - Body:
  ```json
  {
    "error": "Internal server error"
  }
  ```

---

## Implementierungsdetails

### EchoApi.java

Diese Klasse definiert die HTTP-Routen und die zugehörigen Handler.

```java
package echo.api;

import echo.dto.UserRequest;
import echo.dto.UserResponse;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import java.util.Map;
import java.util.UUID;

public class EchoApi {

  public void appendRouting(Router router) {
    router.get("/echo").handler(this::handleEcho);
    router.post("/echoUser").handler(this::handleEchoUser);
  }

  private void handleEcho(RoutingContext rc) {
    String msg = rc.request().getParam("msg");
    if (msg == null) {
      rc.response()
        .setStatusCode(400)
        .putHeader("Content-Type", "application/json")
        .end(Json.encode(Map.of("error", "Missing query parameter 'msg'")));
      return;
    }
    rc.response()
      .putHeader("Content-Type", "text/plain")
      .end("Echo: " + msg);
  }

  private void handleEchoUser(RoutingContext rc) {
    try {
      UserRequest req = rc.body().asPojo(UserRequest.class);

      if (req == null || req.username() == null || req.username().isEmpty()) {
        rc.response()
          .setStatusCode(400)
          .putHeader("Content-Type", "application/json")
          .end(Json.encode(Map.of("error", "Missing or empty username")));
        return;
      }

      UserResponse res = new UserResponse(UUID.randomUUID().toString(), req.username());
      rc.response()
        .putHeader("Content-Type", "application/json")
        .end(Json.encode(res));
    } catch (Exception e) {
      rc.response()
        .setStatusCode(500)
        .putHeader("Content-Type", "application/json")
        .end(Json.encode(Map.of("error", "Internal server error")));
    }
  }
}
```

---

### DTOs (Data Transfer Objects)

Die Datenobjekte, die für die API verwendet werden:

```java
package echo.dto;

// Request-Daten von Client zu Server
public record UserRequest(String username, String password) {}

// Response-Daten vom Server zum Client
public record UserResponse(String id, String username) {}
```

- `UserRequest`: Repräsentiert die vom Client gesendeten Benutzerdaten.
- `UserResponse`: Enthält die Antwort mit einer generierten UUID und dem Benutzernamen.

---

## Beispielaufrufe mit `curl`

- **Echo Nachricht senden**

```bash
curl "http://localhost:8888/echo?msg=Hallo Welt"
```

Antwort:

```
Echo: Hallo Welt
```

- **Benutzer erstellen**

```bash
curl -X POST http://localhost:8888/echoUser   -H "Content-Type: application/json"   -d '{"username":"muaa","password":"geheim"}'
```

Antwort:

```json
{
  "id": "871d6b63-6e64-4b7c-a707-8c46bcc41239",
  "username": "muaa"
}
```

- **Fehlerfall: fehlender Username**

```bash
curl -X POST http://localhost:8888/echoUser   -H "Content-Type: application/json"   -d '{"password":"geheim"}'
```

Antwort:

```json
{
  "error": "Missing or empty username"
}
```

---

## Fehlerbehandlung

- Fehlende oder ungültige Eingaben werden mit aussagekräftigen HTTP-Statuscodes (400) und JSON-Fehlermeldungen beantwortet.
- Interne Fehler werden mit einem 500er Statuscode behandelt, ohne detaillierte Fehlerinfos im Response-Body, um Sicherheit zu gewährleisten.

---

## Weiterführende Hinweise

- Die Verwendung des `BodyHandler` im Router ist essentiell, damit Vert.x den Request-Body lesen und in POJOs umwandeln kann.
- UUIDs dienen als eindeutige Benutzer-IDs und werden bei jeder erfolgreichen POST-Anfrage neu generiert.



*Ende der Dokumentation*
