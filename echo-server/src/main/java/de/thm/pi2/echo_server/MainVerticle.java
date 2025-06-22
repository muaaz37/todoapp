package de.thm.pi2.echo_server;

// Importiere die EchoApi-Klasse, die die API-Routen definiert
import echo.api.EchoApi;

// Vert.x Future für asynchrone Programmierung importieren
import io.vertx.core.Future;

// VerticleBase ist die Basisklasse für Vert.x Verticles
import io.vertx.core.VerticleBase;

// Router für HTTP-Routenimportieren
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;

public class MainVerticle extends VerticleBase {

  // Überschreibt die start-Methode, die ausgeführt wird, wenn das Verticle gestartet wird
  @Override
  public Future<?> start() {

    // Erstelle einen neuen Router, der HTTP-Anfragen verwalten wird
    Router router = Router.router(vertx);
    // BodyHandler aktivieren (wichtig!)
    router.route().handler(BodyHandler.create());
    // Erstelle eine Instanz der EchoApi, die unsere API-Endpunkte enthält
    EchoApi echoApi = new EchoApi();

    // Füge dem Router die Routen aus EchoApi hinzu
    echoApi.appendRouting(router);

    // Erstelle und starte den HTTP-Server mit dem Router als Anfragen-Handler
    // Der Server lauscht auf Port 8888
    return vertx.createHttpServer()
      .requestHandler(router)
      .listen(8888)
      // Wenn der Server erfolgreich gestartet wurde, gib eine Meldung auf der Konsole aus
      .onSuccess(server -> System.out.println("HTTP server started on port 8888"));
  }
}

