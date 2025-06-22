# CORS-Reflexion

## Warum ist in der Umsetzung der Aufgabe die CORS-Konfiguration notwendig?

Da die Client-Anwendung (Frontend) auf `http://localhost:8080` läuft und die Server-API auf `http://localhost:8081`, handelt es sich um zwei unterschiedliche Ursprünge (Domains mit unterschiedlichem Port).  
Der Browser blockiert standardmäßig sogenannte "Cross-Origin Requests" aus Sicherheitsgründen. Um diese Kommunikation zu ermöglichen, muss der Server eine **CORS-Konfiguration** haben, die Anfragen vom Ursprung `http://localhost:8080` explizit erlaubt. Ohne diese Konfiguration würde der Browser alle API-Anfragen blockieren.

## Was wäre anders, wenn ein Reverse Proxy (z. B. über Nginx) eingesetzt würde?

Ein Reverse Proxy wie **Nginx** kann dafür sorgen, dass sowohl die Client-Dateien als auch die API-Endpunkte **unter derselben Domain und Port** erreichbar sind, z. B. alles unter `http://localhost:8080`.  
In diesem Fall würden **keine Cross-Origin-Requests** mehr stattfinden, da der Browser alles als "gleicher Ursprung" erkennt.  
Die CORS-Konfiguration im Server wäre dann **nicht mehr notwendig**, da der Proxy die Anfragen intern weiterleitet und aus Sicht des Browsers keine Sicherheitsgrenze überschritten wird.

## Welche Variante ist aus Sicht von Sicherheit, Wartbarkeit und Entwicklung empfehlenswert?

| Kriterium        | Direkte CORS-Konfiguration | Reverse Proxy (z. B. Nginx) |
|------------------|----------------------------|------------------------------|
| **Sicherheit**   | Akzeptabel, aber anfälliger für Fehlkonfiguration (z. B. `*` als Origin) | Sicherer, da keine Cross-Origin-Requests notwendig sind |
| **Wartbarkeit**  | Einfacher bei kleinen Projekten | Besser bei mehreren Services oder Microservices |
| **Entwicklung**  | Gut für lokale Entwicklung (Frontend und Backend getrennt startbar) | Aufwendiger initial, aber realitätsnäher für Produktion |

**Fazit:**  
Für kleinere Projekte oder im Entwicklungsumfeld ist die direkte CORS-Konfiguration ausreichend und einfach umzusetzen.  
Für **professionelle, produktionsreife Anwendungen** ist ein **Reverse Proxy** wie Nginx die bessere Wahl – er erhöht Sicherheit, vereinfacht die Infrastruktur und spiegelt reale Deployment-Szenarien besser wider.
