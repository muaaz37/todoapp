# Aufgabe 1: Analyse der To-Do-App

## 1. Ziele verteilter Systeme im Kontext der To-Do-Anwendung

### Ziele verteilter Systeme:
- **Skalierbarkeit**: Die Fähigkeit, die Anwendung bei steigender Last durch Hinzufügen von Ressourcen zu erweitern.
- **Fehlertoleranz**: Sicherstellung, dass das System auch bei Ausfällen einzelner Komponenten funktionsfähig bleibt.
- **Verfügbarkeit**: Die Anwendung sollte jederzeit erreichbar sein.
- **Leistungsfähigkeit**: Effiziente Verarbeitung von Anfragen, auch bei hoher Nutzeranzahl.
- **Transparenz**: Verbergen der Komplexität des Systems für den Nutzer (z. B. Standorttransparenz, Zugriffstransparenz).
- **Offenheit**: Die Möglichkeit, neue Komponenten oder Dienste einfach hinzuzufügen.

### Analyse der To-Do-App:
- **Erfüllte Ziele**:
  - **Skalierbarkeit**: Die Nutzung von Docker und Docker Compose ermöglicht eine einfache horizontale Skalierung.
  - **Transparenz**: Die Anwendung bietet eine einfache Benutzeroberfläche, die die Komplexität der zugrunde liegenden Architektur verbirgt.
- **Missachtete Ziele**:
  - **Fehlertoleranz**: Es gibt keine Hinweise auf Mechanismen zur Wiederherstellung nach Ausfällen (z. B. Datenreplikation oder Backup-Strategien).
  - **Verfügbarkeit**: Ohne Load-Balancing oder Redundanz könnte die Anwendung bei Serverausfällen nicht verfügbar sein.
- **Zukünftige relevante Ziele**:
  - **Leistungsfähigkeit**: Optimierung der Datenbankabfragen und Minimierung der Latenz bei hoher Nutzeranzahl.
  - **Fehlertoleranz**: Einführung von Replikation und Monitoring-Tools zur Fehlererkennung und -behebung.

---

## 2. Typische Fehlannahmen in verteilten Systemen

### Fehlannahmen:
1. Das Netzwerk ist zuverlässig.
2. Die Latenz ist null.
3. Die Bandbreite ist unendlich.
4. Das Netzwerk ist sicher.
5. Die Topologie ändert sich nicht.
6. Es gibt nur einen Administrator.
7. Transportkosten sind null.
8. Das Netzwerk ist homogen.

### Analyse der To-Do-App:
- **Berücksichtigte Fehlannahmen**:
  - Die Nutzung von Docker und Docker Compose folgt den Ziel, dass die Topologie flexibel gestaltet werden kann.
- **Nicht berücksichtigte Fehlannahmen**:
  - Es gibt keine Mechanismen zur Sicherstellung der Netzwerksicherheit (z. B. Verschlüsselung).
  - Die Anwendung geht von einer stabilen Netzwerkverbindung aus, ohne Mechanismen zur Fehlerbehandlung bei Verbindungsabbrüchen.

---

## 3. Architekturstile in der To-Do-Anwendung

### Typische Architekturstile:
- **Client-Server**: Trennung von Client und Server, wobei der Server die Hauptlogik bereitstellt.
- **Microservices**: Aufteilung der Anwendung in kleine, unabhängige Dienste.
- **Event-basierte Architektur**: Kommunikation über Ereignisse und Nachrichten.
- **Peer-to-Peer**: Gleichberechtigte Knoten ohne zentralen Server.

### Analyse der To-Do-App:
- **Vorhandener Architekturstil**:
  - Die Anwendung folgt dem **Client-Server-Modell**, da sie eine klare Trennung zwischen Frontend (Client) und Backend (Server) aufweist.
- **Potenzial für andere Architekturstile**:
  - **Microservices** könnten eingeführt werden, um die Skalierbarkeit und Fehlertoleranz zu verbessern.
  - **Event-basierte Architektur** könnte für Echtzeit-Updates der To-Do-Liste genutzt werden.

---

## 4. Kommunikationsmuster in der To-Do-Anwendung

### Genutzte Kommunikationsmuster:
- **Request-Response**: Der Client sendet Anfragen an den Server, der daraufhin Antworten liefert.

### Vor- und Nachteile:
- **Vorteile**:
  - Einfach zu implementieren und zu verstehen.
  - Geeignet für synchrone Kommunikation.
- **Nachteile**:
  - Höhere Latenz bei langsamen Netzwerken.
  - Nicht geeignet für Echtzeit-Updates oder asynchrone Kommunikation.

### Alternative Kommunikationsmuster:
- **Publish-Subscribe**:
  - **Vorteile**: Ermöglicht Echtzeit-Updates und asynchrone Kommunikation.
  - **Einsatzmöglichkeit**: Für Benachrichtigungen über Änderungen in der To-Do-Liste.
- **Message Queue**:
  - **Vorteile**: Erhöht die Fehlertoleranz durch Zwischenspeicherung von Nachrichten.
  - **Einsatzmöglichkeit**: Für die Verarbeitung von Aufgaben im Hintergrund.

---

## Evaluierung und Anpassungen

Die Antworten wurden auf Basis der gegebenen Informationen und allgemeiner Konzepte verteilter Systeme erstellt. Zur Evaluierung wurden die Anforderungen der To-Do-App mit den Zielen und Herausforderungen verteilter Systeme abgeglichen. Anpassungen könnten erforderlich sein, wenn weitere Details zur Architektur oder den Anforderungen der Anwendung bekannt werden.
