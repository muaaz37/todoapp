## Aufgabe 2: Architekturvorschlag für ein verteiltes System
Entwerfen Sie einen Architekturvorschlag, wie die To-Do-App als erweitertes verteiltes System umgesetzt
werden könnte. Berücksichtigen Sie dabei verschiedene Architekturstile und Kommunikationsmuster.
Gehen Sie auf folgende Punkte ein:
#### 2.1 Beschreiben Sie die umgesetzten Architekturen und erläutern Sie, warum Sie sich für diese Architekturen entschieden haben. Gehen Sie auf Vor- und Nachteile sowie auf die Eignung für die To-Do-App ein.
### 📌 Gewählte Architektur: Microservices-Architektur

Für die Umsetzung meiner To-Do-App habe ich mich für die **Microservices-Architektur** entschieden. Ziel ist es, die Anwendung als **verteiltes System** zu gestalten, das **skalierbar**, **modular** und **wartbar** bleibt – auch bei zukünftiger Erweiterung um neue Features wie Benachrichtigungen oder Benutzerverwaltung.


### 🧱 Aufbau der Microservices

Die Anwendung ist in mehrere logisch getrennte Microservices unterteilt:

| Microservice            | Funktion                                                            |
|-------------------------|---------------------------------------------------------------------|
| **Task-Service**        | Verwalten von Aufgaben (CRUD: Create, Read, Update, Delete)         |
| **User-Service**        | Registrierung, Login, Authentifizierung                             |
| **Notification-Service**| Erinnerungen senden (z. B. per E-Mail oder Push-Nachricht)          |
| **Filter-Service**      | Filterung und Sortierung nach Status, Datum, Priorität              |

Jeder dieser Services wird als **eigenständiger Container** entwickelt, versioniert und deployt.


### 🔌 Kommunikation zwischen den Services

Die Services kommunizieren untereinander **asynchron über HTTP REST-APIs**.

**Beispiel:**  
Wenn der Task-Service eine Aufgabe anlegt, kann er über die API des User-Service prüfen, ob der Nutzer authentifiziert ist.

### 🗄️ Datenbankarchitektur

Jeder Microservice verwendet eine eigene Datenbank (→ *Database per Service*).  
Das vermeidet enge Kopplungen und verbessert die Datenintegrität innerhalb des jeweiligen Kontexts:

- **Task-Service:** MongoDB (NoSQL – flexibel für Aufgabenstruktur)
- **User-Service:** PostgreSQL (relational – gut für Benutzerverwaltung)
- **Notification-Service:** Redis oder eine Warteschlange für geplante Benachrichtigungen


### 🚀 Deployment-Strategie
Alle Services werden mithilfe von **Docker** containerisiert.  
Das bedeutet, jeder Microservice läuft in einem eigenen Container mit seinen individuellen Abhängigkeiten und Konfigurationen.

**Vorteile durch Docker:**
- **Unabhängige Ausführung:** Jeder Service funktioniert isoliert vom Rest – keine Konflikte durch Bibliotheken oder Laufzeitumgebungen.
- **Einfaches Deployment:** Die gesamte Anwendung kann mit `docker-compose` gemeinsam gestartet werden.
- **Gleiche Umgebung:** Egal ob lokal oder im Server – Docker sorgt für konsistente Ausführung.
- **Schneller Austausch:** Neue Versionen eines Services können einfach durch neue Images ersetzt werden.

### ⚖️ Begründung für diese Architektur

#### ✅ Vorteile für meine To-Do-App:
- **Skalierbarkeit:** z. B. gezielte Lastverteilung nur auf den Task-Service
- **Wartbarkeit:** Änderungen am Notification-Service betreffen keinen anderen Code
- **Teamarbeit:** Entwickler:innen können parallel an verschiedenen Services arbeiten
- **Zukunftssicherheit:** Neue Features lassen sich unabhängig ergänzen

#### ⚠️ Nachteile (bewusst in Kauf genommen):
- **Mehr technisches Grundwissen nötig:** Umgang mit Docker, Netzwerken, APIs etc.
- **Komplexere Fehleranalyse:** Fehler können zwischen Services passieren und sind schwerer zu debuggen als in einem Monolithen.
- **Mehr Konfigurationsaufwand:** Jeder Service braucht eigene Ports, Umgebungsvariablen, Dockerfiles usw.
- **Kommunikationsaufwand:** Alle Services müssen über HTTP miteinander sprechen.Dadurch entstehen mögliche Latenzen oder Fehlerquellen.

#### 2.2 Skizzieren Sie die wichtigsten Komponenten und deren Aufgaben (z.B. Authentifizierungs-Service, separater Service für das Ausliefern des Clients, To-Do-Service, ggf. Benachrichtigungs-Service, ...).


#### 2.3 Welche Kommunikationsmuster und Protokolle würden Sie zwischen den Komponenten einsetzen und warum?

### 📡 1. Kommunikation per Request-Response über HTTP (REST)

#### Was ist das?

Bei diesem Kommunikationsmuster schickt ein Service (z. B. das Frontend oder ein anderer Microservice) eine **Anfrage (Request)** an einen anderen Service – und dieser antwortet mit einer **Antwort (Response)**.

Diese Kommunikation läuft meist über das **HTTP-Protokoll**, das auch für Webseiten verwendet wird.  
Die Daten werden in der Regel im **JSON-Format** übertragen, das leicht lesbar und standardisiert ist.


#### 🛠️ Wo wird es in der To-Do-App verwendet?

- **Frontend → Backend**:  
  Das Web-Frontend ruft REST-APIs des Backends auf, z. B.:
  - „Zeig mir alle Aufgaben des Benutzers“
  - „Erstelle eine neue Aufgabe“

- **Task-Service ⇄ User-Service**:  
  Beispiel: Der Task-Service überprüft beim Erstellen einer Aufgabe, ob der Benutzer existiert oder eingeloggt ist.

#### 2.4 Welche Infrastrukturkomponenten wären sinnvoll und welche Aufgaben ¨ubernehmen sie in Ihrer System-Architektur?
## 🏗️ Infrastrukturkomponenten für die To-Do-App

Damit die verteilte To-Do-App zuverlässig funktioniert, braucht es neben dem Code auch verschiedene **Infrastrukturkomponenten**, die den Betrieb, die Kommunikation und die Verwaltung der Microservices unterstützen.


### 1. 🐳 Docker

**Aufgabe:**
- Verpackt jeden Microservice in einen eigenen Container.
- Sorgt dafür, dass die App überall gleich funktioniert – egal ob lokal oder auf einem Server.

**Warum sinnvoll?**
- Vermeidet „funktioniert nur auf meinem Rechner“-Probleme.
- Einfaches Starten/Stoppen der Services mit `docker-compose`.


### 2. 📦 API Gateway

**Aufgabe:**
- Zentraler Einstiegspunkt für alle Anfragen von außen.
- Leitet Anfragen an den passenden Microservice weiter (z. B. `/users` an User-Service).
- Kann Authentifizierung, Ratenbegrenzung und Logging übernehmen.

**Warum sinnvoll?**
- Sicherheit: Nur ein Eingang statt viele offene Ports.
- Kontrolle: Leichtes Einführen von Regeln, Versionen oder Zugangskontrolle.


### 3. 🗃️ Datenbanken (je Microservice eine eigene)

**Beispiele:**
- PostgreSQL für User-Service
- MongoDB für Task-Service

**Aufgabe:**
- Speichern der Anwendungsdaten getrennt nach Fachbereichen.
- Jeder Service verwaltet seine eigenen Daten selbst.

**Warum sinnvoll?**
- Trennung sorgt für Unabhängigkeit.
- Änderungen in einer Datenbank betreffen keine anderen Services.


### 4. 📬 Nachrichtendienst / Message Queue 

**Beispiel:** RabbitMQ

**Aufgabe:**
- Ermöglicht, dass Services Nachrichten schicken können, ohne direkt auf eine Antwort zu warten.
- Beispiel: Der Task-Service informiert den Notification-Service über eine neue Aufgabe.

**Warum sinnvoll?**
- Verbesserte Skalierbarkeit und Entkopplung.
- Services können unabhängig voneinander arbeiten.


Erstellen Sie eine Skizze oder ein Diagramm zur Veranschaulichung Ihrer Architektur und erläutern Sie
Ihre Entscheidungen. Dokumentieren Sie Ihren Architekturvorschlag und die zugehörigen Erläuterungen
in einer Markdown-Datei (z.B. distributed-system-architecture.md) in Ihrem Git-Repository.
Hinweis: Falls Sie andere Architekturstile, Kommunikationsmuster oder Infrastrukturkomponenten
verwenden als in der Vorlesung behandelt, begründen Sie Ihre Auswahl bitte ausführlich und nachvollziehbar.