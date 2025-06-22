package echo.api;

import echo.dto.UserRequest;
import echo.dto.UserResponse;
import io.vertx.core.json.Json;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import java.util.Map;
import java.util.UUID;

public class EchoApi {

  // Diese Methode registriert zwei Routen (GET und POST) beim übergebenen Router
  public void appendRouting(Router router) {
    // GET-Anfrage auf /echo wird von handleEcho() verarbeitet
    router.get("/echo").handler(this::handleEcho);
    // POST-Anfrage auf /echoUser wird von handleEchoUser() verarbeitet
    router.post("/echoUser").handler(this::handleEchoUser);
  }

  // Verarbeitet GET-Anfragen auf /echo?msg=deinText
  private void handleEcho(RoutingContext rc) {
    // Liest den Wert des Query-Parameters "msg"
    String msg = rc.request().getParam("msg");

    // Wenn kein "msg" übergeben wurde, sende einen Fehler (400 Bad Request)
    if (msg == null) {
      rc.response()
        .setStatusCode(400) // HTTP-Statuscode: Fehlerhafte Anfrage
        .putHeader("Content-Type", "application/json")
        .end(Json.encode(Map.of("error", "Missing query parameter 'msg'")));
      return;
    }

    // Antwortet mit dem übergebenen Text, prefix mit "Echo:"
    rc.response()
      .putHeader("Content-Type", "text/plain")
      .end("Echo: " + msg);
  }

  // Verarbeitet POST-Anfragen auf /echoUser mit JSON-Daten im Body
  private void handleEchoUser(RoutingContext rc) {
    try {
      // Wandelt den Request-Body in ein UserRequest-Objekt um
      UserRequest req = rc.body().asPojo(UserRequest.class);

      // Überprüft, ob ein gültiger Benutzername übergeben wurde
      if (req == null || req.username() == null || req.username().isEmpty()) {
        rc.response()
          .setStatusCode(400)
          .putHeader("Content-Type", "application/json")
          .end(Json.encode(Map.of("error", "Missing or empty username")));
        return;
      }

      // Erzeugt eine UserResponse mit einer zufälligen UUID und dem Nutzernamen
      UserResponse res = new UserResponse(UUID.randomUUID().toString(), req.username());

      // Antwortet mit den Benutzerdaten im JSON-Format
      rc.response()
        .putHeader("Content-Type", "application/json")
        .end(Json.encode(res));

    } catch (Exception e) {
      // Falls beim Verarbeiten ein Fehler passiert, sende einen Serverfehler
      rc.response()
        .setStatusCode(500)
        .putHeader("Content-Type", "application/json")
        .end(Json.encode(Map.of("error", "Internal server error")));
    }
  }
}
