# 📦 Aufbau der ToDo-App

Die Anwendung ist eine klassische **To-Do-App** mit **Frontend und Backend**, geschrieben in **JavaScript/TypeScript**. Für das Paketmanagement wird **npm** verwendet.

---

## 🔧 Was ist npm Paketmanagement?

**npm (Node Package Manager)** ist ein Tool, das in der JavaScript-Welt genutzt wird, um:

- 📦 Pakete (z. B. Bibliotheken, Frameworks) zu installieren
- 🔄 Abhängigkeiten zu verwalten und zu aktualisieren
- 🧾 die Datei `package.json` zu pflegen (dort stehen alle Abhängigkeiten und Skripte)
- 📁 Pakete lokal im Ordner `node_modules` zu speichern

👉 Mit dem Befehl `npm install` werden alle benötigten Pakete aus dem zentralen Repository [npmjs.com](https://npmjs.com) heruntergeladen.

---

## 🖼️ Übersicht: Aufbau der App

### 📁 Frontend – `client_app/`

- Liegt im Verzeichnis `client_app`
- Wird mit Node.js gebaut (`npm run build`)
- Enthält:
  - `src/` – Quellcode der App
  - `build/` – fertige Dateien nach dem Build
  - `package.json` – Konfiguration & Abhängigkeiten
- Die fertige Version wird später im Docker-Container verwendet und als **statische Website** angezeigt.

---

### 🖥️ Backend – `server_api/`

- Liegt im Verzeichnis `server_api`
- Verantwortlich für:
  - Verarbeiten der API-Anfragen (CRUD auf ToDos)
  - Speichern der Daten in einer Datei (`db.json`)
- Enthält:
  - `src/` – Quellcode (inkl. `start.js`)
  - `build/` – gebaute Backend-Dateien
  - `package.json` – Konfiguration & Abhängigkeiten

---

### 🐳 Docker & Container

- Die Anwendung wird komplett in einem **Docker-Container** ausgeführt
- Die Datei `docker-compose.yml` regelt:
  - Welches Image verwendet wird
  - Wie Container gestartet werden
  - Wo Daten gespeichert werden
- Das **Volume `todo-data`** sorgt dafür, dass die Datei `db.json` **persistent bleibt**, also **auch nach einem Neustart des Containers erhalten bleibt**

---

## ▶️ Startprozess der App

1. Docker startet das Backend (`server_api/build/start.js`)
2. Das Backend läuft auf Port `8080`
3. Das Frontend wird als **statische HTML/JS/CSS-Dateien** ausgeliefert
4. Der Benutzer sieht im Browser die Oberfläche, um ToDos zu verwalten

---

## ✅ Fazit: Was macht was?

- 🔍 **Frontend**: Zeigt die Benutzeroberfläche für die ToDos
- 🔧 **Backend**: Nimmt Anfragen entgegen (z. B. "Neues ToDo erstellen") und speichert die Daten in der Datei `db.json`
- 📦 **npm**: Verwaltet alle Pakete und Abhängigkeiten
- 🐳 **Docker**: Packt alles in Container und sorgt für einfache Ausführung + persistente Daten

# ✅ Vorgegebene Fragen zur TypeScript ToDo-App

---

## 1. Allgemeine Code-Struktur: Wie wurden Kohäsion und Kopplung im Projekt berücksichtigt?

### 🧩 Was bedeuten die Begriffe?

**Kohäsion** beschreibt, wie eng die Funktionen innerhalb eines Moduls zusammengehören – also ob alles, was in einem Modul ist, wirklich auch thematisch zusammenpasst.

**Kopplung** beschreibt, wie stark verschiedene Module voneinander abhängig sind. Ziel: Möglichst **niedrige Kopplung**, damit Module unabhängig änderbar bleiben.

### 🧠 Zusammenhang:
- Hohe Kohäsion → Alles in einem Modul gehört logisch zusammen.
- Niedrige Kopplung → Module funktionieren unabhängig voneinander.
- ✅ Ideal: **Stark zusammenhängende Module**, die **wenig voneinander abhängig sind**.

### 🛠 Anwendung im Projekt:

#### Kohäsion:
- **Frontend (`client_app`)** und **Backend (`server_api`)** sind klar voneinander getrennt.
- Jedes Modul (z. B. Datenbank, API, UI) hat eine eigene, klare Aufgabe.
- Die Trennung zwischen `src/` (Quellcode) und `build/` (fertige Dateien) zeigt, dass die Struktur durchdacht und kohärent ist.

#### Kopplung:
- Die Kommunikation zwischen Frontend und Backend erfolgt über **HTTP-Anfragen** (REST API), nicht durch direktes Code-Sharing → **lose Kopplung**
- **Docker-Container** trennen die Umgebungen voneinander, wodurch auch technische Abhängigkeiten minimiert werden.
- Gemeinsame Schnittstellen (z. B. `docker-compose.yml`) sind klar definiert, aber flexibel austauschbar.

---

## 2. Modulsystem in JavaScript: Wie werden Module importiert und exportiert?

### 📦 Was ist ein Modul?

Ein **Modul** ist eine eigene JavaScript-Datei, die Variablen, Funktionen oder Klassen **bereitstellt** (exportiert), damit andere Dateien diese **verwenden** können (importieren).  
Das hilft, den Code sauber, wiederverwendbar und wartbar zu strukturieren.

## Unterschied zwischen ES-Modulen (ESM) und CommonJS (CJS)

### ✅ ES-Module (ESM)
- **Moderner Standard** in JavaScript
- Verwendet `import` und `export`
- Unterstützt in modernen Browsern und Node.js (ab Version 14+)
- Dateiendung häufig `.mjs` oder `.js` mit `"type": "module"` in `package.json`

**Beispiel:**

### 📤 Exportieren eines Moduls (ESM):
```js
// Datei: rechner.mjs
export function addiere(a, b) {
  return a + b;
}
### Importieren eines Moduls (ESM):
// Datei: app.mjs
import { addiere } from './rechner.mjs';
console.log(addiere(2, 3)); // 5
```
### 🟡 CommonJS (CJS)

- Klassisches Modulsystem in **Node.js**
- Verwendet `require` und `module.exports`
- Standard in **älteren Node.js-Projekten**
- Dateiendung meist `.cjs` oder `.js` mit `"type": "commonjs"` in der `package.json`

#### 📄 Beispiel:

```js
// Datei: rechner.cjs
function addiere(a, b) {
  return a + b;
}
module.exports = { addiere };
```
```js
// Datei: app.cjs
const { addiere } = require('./rechner.cjs');
console.log(addiere(2, 3)); // 5
```

### Warum muss `.js` beim Import explizit geschrieben werden?

Früher hat JavaScript die Dateiendung automatisch ergänzt.  
Heute (v. a. in **Node.js** oder im **Browser mit ES-Modulen**) **muss** sie angegeben werden, weil:

- Der JavaScript-Loader **genau wissen will**, welche Datei du meinst.
- `.js`, `.mjs` oder `.cjs` **unterschiedlich behandelt werden**.

---

### Unterschiede der Dateiendungen

#### 1. `.js` → normale JavaScript-Datei

- **Standard-Endung**
- Kann **modernes** (`import/export`) oder **klassisches** System (`require/module.exports`) verwenden – je nach `package.json`

```js
// Modernes ES-Modul
export function test() {}

// Oder klassisch (CommonJS)
module.exports = { test };
```
### 2. `.mjs` → „modernes JavaScript Modul“ (ESM)
- Wird **immer** als modernes Modul behandelt.
- Man **muss** `import` und `export` verwenden.
- Wird z. B. im **Browser** oder in **modernen Node.js-Projekten** verwendet.

### 3. `.cjs` → „CommonJS Modul“ (alt, Node.js-Stil)
- Wird **immer** als **altes Node.js-Modul** behandelt.
- Man **muss** `require` und `module.exports` verwenden.
- Wird in vielen **älteren Node.js-Projekten** benutzt.

### Frage 3. Datenintegrität: Warum wurde ein eigener Parser implementiert? Welche Aufgaben übernimmt dieser? Was genau wird eigentlich geparst?

Ein Parser ist ein kleines Programm (oder Teil des Codes), das Daten liest und richtig in ein Format bringt, mit dem dein Programm arbeiten kann.

Ein eigener Parser wurde geschrieben, weil die ToDo-Daten (z. B. aus Dateien oder Benutzereingaben) genau geprüft und verarbeitet werden müssen.

**Gründe dafür:**

- **Validierung:**  
  Er prüft, ob die eingehenden Daten dem erwarteten Format und den Regeln entsprechen.

- **Transformation:**  
  Er wandelt die Rohdaten (z. B. aus JSON, CSV oder benutzerdefinierten Formaten) in interne Datenstrukturen um.

- **Fehlerbehandlung:**  
  Er erkennt und meldet fehlerhafte oder manipulierte Daten frühzeitig.

---

**Was wird geparst?**

Der Parser verarbeitet z. B.:

- JSON- oder Textdaten, die eine ToDo-Liste darstellen  
- Eingabedaten von Formularen (z. B. Titel, Datum, erledigt: ja/nein)  
- Daten aus einer Datei oder einem Server (z. B. beim Laden von gespeicherten ToDos)  

Geparst werden typischerweise **Nutzereingaben, API-Requests oder externe Datenquellen**, die in die Anwendung gelangen. Ziel ist es, sicherzustellen, dass **nur korrekte und erwartete Daten** weiterverarbeitet werden, um die **Datenintegrität und Sicherheit** der Anwendung zu gewährleisten.

### 🧩 Was macht `todo-dto-parser.ts`?

Das ist eine **TypeScript-Klasse**: `TodoDtoParser`.

Sie hat zwei Funktionen:

1. `parseCreateTodo(...)` → Für das **Erstellen** eines ToDos  
2. `parseUpdateTodo(...)` → Für das **Bearbeiten** eines ToDos  

Beide Funktionen nehmen ein **JSON-Objekt** (meist vom Client) und wandeln es in ein sicheres **TypeScript-Objekt** um (entweder `CreateTodo` oder `UpdateTodo`).

Zusätzlich:

3. ✂️ Der Titel muss mindestens **3 Zeichen lang** sein  
4. 📅 Es wird geprüft, ob das **Datum im ISO-Format** ist, z. B. `"2024-12-01"`  
5. ✅ Das Ergebnis ist ein **gültiges ToDo-Objekt**, das im Backend weiterverarbeitet werden kann (z. B. speichern)

---

### 🧪 `TodoFilterOptionsParser`

Der `TodoFilterOptionsParser` prüft die **Filterwerte aus der URL** (wie `title=...` oder `status=...`) und wandelt sie in ein sicheres `TodoFilterOptions`-Objekt um.  
Er schützt das System vor ungültigen Eingaben.

---

### 🔃 `TodoSortOptionsParser`

Der `TodoSortOptionsParser` prüft, ob die **Sortierangaben aus der URL** gültig sind, z. B.:

- `sort=dueDate`
- `order=desc`

Er verwendet eigene Parser für das **Sortierfeld** und die **Reihenfolge**, um ungültige Eingaben zu vermeiden.  
Wenn keine Angaben gemacht werden, verwendet er **Standardwerte**:

- Sortierfeld: `createdAt`
- Reihenfolge: `asc`

---

### 🟢 `TodoStatusParser`

Der `TodoStatusParser` prüft, ob der übergebene **Status** (z. B. `"open"` oder `"done"`) gültig ist.  
Wenn der Status **fehlt oder falsch** ist, wird ein Fehler ausgelöst.

Die Methode `parseOptional(...)` erlaubt auch, dass der Status **leer bleibt**, z. B. bei **optionalem Update** eines ToDos.

### Frage 4. Persistenz: Wie erfolgt die persistente Datenspeicherung in der Anwendung?

Die persistente Datenspeicherung erfolgt in der Anwendung über die Klasse `TodoDb`, die im Backend unter  
`server_api/src/todo/store/todo-db.js`  verwendet wird.

Die `TodoService`-Klasse nutzt diese Datenbankklasse, um:

- To-Do-Objekte zu **speichern**
- **abzurufen**
- **zu aktualisieren**
- **zu löschen**

oder:
Die persistente Datenspeicherung erfolgt über die Klasse `TodoFileDb`, die das Interface TodoDb implementiert. Sie nutzt die Datei-basierte Bibliothek `lowdb`, um die ToDos in einer JSON-Datei zu speichern. Alle CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen) werden direkt auf dieser Datei ausgeführt, was die Daten dauerhaft speichert.

---

**Alternative (konkrete Umsetzung):**

Die persistente Datenspeicherung erfolgt über die Klasse `TodoFileDb`, die das Interface `TodoDb` implementiert.  
Sie nutzt die Datei-basierte Bibliothek **`lowdb`**, um die ToDos in einer **JSON-Datei** zu speichern.

Alle CRUD-Operationen (Create, Read, Update, Delete) werden direkt auf dieser Datei ausgeführt, was die Daten **dauerhaft speichert**.

🔒 **Vorteil:**  
Auch nach einem Neustart des Servers oder Containers bleiben die Daten erhalten.

### Frage 5. Eindeutige Identifikation: Was ist eine UUID? Warum wird sie im Projekt verwendet? Welche Vorteile bietet sie gegenüber anderen Identifiern?

Eine UUID (Universally Unique Identifier) ist ein 128-Bit-Wert, der weltweit eindeutig ist. Sie wird meist als hexadezimale Zeichenkette dargestellt (z. B. `550e8400-e29b-41d4-a716-446655440000`). 

Im Projekt wird die UUID verwendet, um To-Do-Objekte eindeutig zu identifizieren. Das bedeutet, jede Aufgabe erhält eine eigene, unverwechselbare ID, die auch bei verteilten Systemen oder paralleler Datenerzeugung keine Kollisionen verursacht.

**Vorteile gegenüber anderen Identifiern:**
- **Globale Eindeutigkeit:** Auch bei mehreren Servern oder Clients entstehen keine doppelten IDs.
- **Keine zentrale Vergabestelle nötig:** IDs können dezentral generiert werden.
- **Sicher gegen Vorhersagen:** Im Gegensatz zu fortlaufenden Zahlen sind UUIDs schwer vorherzusagen, was Manipulationen erschwert.
- **Skalierbarkeit:** Besonders geeignet für große, verteilte Systeme.

Dadurch wird die Datenintegrität und Nachvollziehbarkeit im System verbessert.

#### Wo im Projekt wird das implementiert?
In der Datei `server_api/src/todo/store/todo-db.ts` wird das Interface `TodoDb` definiert. Dieses Interface legt fest, welche Methoden eine To-Do-Datenbank bereitstellen muss (z.B. `getAll`, `get`, `create`, `update`, `remove`). Es handelt sich nur um die Schnittstelle, nicht um eine konkrete Implementierung. 

Die Vergabe der UUID (eindeutige ID) erfolgt hier nicht. Die UUID wird typisiert (`UUID`), aber die eigentliche Generierung und Zuweisung einer UUID zu einem To-Do-Objekt passiert in der Regel bei der Erstellung eines neuen To-Do-Eintrags, meist in der Service- oder DTO-Parser-Schicht, nicht im Interface selbst. 

Die konkrete Implementierung und Vergabe findet man in unserem Fall in der Klasse `TodoFileDb`.


### Frage 6. Resilienz: Wie wird sichergestellt, dass der Server bei einem fehlerhaften Request nicht abstürzt? Was passiert stattdessen?

**Resilienz** bedeutet in der Softwareentwicklung, dass ein System auch bei unerwarteten oder fehlerhaften Situationen (z. B. ungültige Eingaben, fehlerhafte Anfragen) stabil bleibt und nicht abstürzt.

#### Wie wird Resilienz im Projekt sichergestellt?

Die Resilienz des Servers wird durch **zentrales Fehler-Handling** erreicht. In der Datei `server_api/src/todo/api/todo-api.ts` werden alle API-Routen mit dem `RequestHandler.handle`-Wrapper versehen.

Dieser Wrapper übernimmt automatisch das Abfangen von Fehlern, die in den asynchronen Handlerfunktionen auftreten. Dadurch wird verhindert, dass der Server bei fehlerhaften Requests nicht abstürzt.

#### Was passiert stattdessen?

- Bei einem Fehler wird eine passende HTTP-Fehlermeldung (z. B. `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`) an den Client zurückgegeben.
- Der Server bleibt dabei stabil und kann weiterhin andere Anfragen verarbeiten.

#### Was ist der RequestHandler?

Der `RequestHandler` ist ein Wrapper, der bei der Definition der API-Endpunkte verwendet wird. Er sorgt dafür, dass:

- Fehler, die in den API-Funktionen auftreten, automatisch abgefangen werden.
- Eine standardisierte Fehlermeldung zurückgegeben wird.
- Kein manuelles `try-catch` in jeder API-Funktion notwendig ist.
- Der Server auch bei Fehlern stabil weiterläuft.

### Frage 7. Graceful Shutdown: Wie kann der Server ordentlich gestoppt werden? Warum sollte man dies gezielt im Code steuern? Wo wird das in der Anwendung adressiert?

Ein **Graceful Shutdown** bedeutet, dass ein Server nicht abrupt, sondern **kontrolliert und geordnet** heruntergefahren wird. Dadurch wird sichergestellt, dass:

- laufende Anfragen abgeschlossen werden,
- Ressourcen wie Datenbankverbindungen freigegeben werden,
- und keine Daten verloren gehen.

#### Warum sollte man das gezielt im Code steuern?

Ein gezieltes Herunterfahren des Servers verhindert:

- **Datenverlust** bei noch nicht abgeschlossenen Prozessen
- **abgebrochene Verbindungen** für Clients
- **unvollständige Logs** oder nicht gespeicherte Zustände

Es ist besonders wichtig bei Deployments, in Containern (z. B. Docker) oder bei Systemen, die viele gleichzeitige Verbindungen verarbeiten.

#### Wie ist das im Projekt umgesetzt?

In der Datei `start.ts` wird der **Graceful Shutdown** wie folgt implementiert:

```ts
// Register signal handlers to stop the server gracefully
function stopServer() {
  todoServer.stop();       // Stoppt den Express-Server
  process.exit(0);         // Beendet den Node.js-Prozess sauber
}

// SIGINT: Manuelle Unterbrechung durch den Benutzer (z. B. Ctrl + C)
process.on('SIGINT', stopServer);

// SIGTERM: Systemisches Beenden, z. B. durch Docker oder einen Systemdienst
process.on('SIGTERM', stopServer);
```

Die Funktion **stopServer()** sorgt dafür, dass der Server (über todoServer.stop()) ordentlich herunterfährt, bevor der Prozess beendet wird.
- Was sind **SIGINT** und **SIGTERM**?
    - SIGINT (Signal Interrupt): Wird ausgelöst, wenn im Terminal Ctrl + C gedrückt wird.
    - SIGTERM (Signal Terminate): Wird vom System gesendet, z. B. beim Stoppen eines Docker-Containers oder durch einen Systemdienst (wie systemd).

### Frage 8. Fehlerbehandlung: Wie wird mit Fehlern umgegangen? Wo werden diese behandelt? Welche Rolle spielt die entsprechende Middleware in diesem Zusammenhang?

Fehler werden zentral durch eine **Error-Handling-Middleware** im Express-Server behandelt. Die Error-Handling-Middleware prüft den Fehlertyp (z.B. ValidationError, HttpError) und sendet eine passende HTTP-Fehlermeldung an den Client zurück.

Fehler in den API-Routen werden durch den RequestHandler.handle-Wrapper automatisch an die Middleware weitergeleitet. Dadurch muss in den einzelnen API-Funktionen kein eigenes Fehler-Handling implementiert werden. Funktion der Error-Handling-Middleware 
- Prüft den Fehlertyp (z. B. ValidationError, HttpError).
- Sendet eine passende HTTP-Fehlermeldung an den Client zurück (z. B. 400, 404, 500).

In der Anwendung ist das die Methode `TodoServer.errorHandler`, die in der Datei  
`server_api/src/todo-server.ts` definiert und am Ende der Middleware-Kette mit folgendem Befehl registriert wird:

```ts
app.use(TodoServer.errorHandler);
```
