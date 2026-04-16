# Reflexion zu Authentifizierung und Sicherheit

## Vorteile eines zentralen Identity Providers (IDP)
Ein zentraler Identity Provider (IDP) bietet eine zentrale Verwaltung von Benutzeridentitäten und Berechtigungen. Dies bringt sowohl für die Wartbarkeit als auch für die Sicherheit erhebliche Vorteile:

| **Aspekt**               | **Beschreibung**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| 🔧 **Wartbarkeit**         | Änderungen an Authentifizierungsmechanismen erfolgen zentral, was die Verwaltung vereinfacht und konsistent hält. |
| 🛡️ **Sicherheit**          | Standardisierte Protokolle wie OAuth2 und OpenID Connect sorgen für eine robuste und einheitliche Sicherheitsbasis. |
| 📉 **Reduzierte Angriffsfläche** | Durch die Konsolidierung der Sicherheitsmaßnahmen wird die Angriffsfläche minimiert. |

---

## JWT vs. klassische Session-Cookies: Vorteile und Grenzen

### Vorteile von JWT
JSON Web Tokens (JWT) bieten gegenüber klassischen Session-Cookies mehrere Vorteile, insbesondere in Bezug auf Skalierbarkeit und Performance:

| **Vorteil**              | **Beschreibung**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| 🌐 **Stateless**           | Kein Server-seitiger Speicher erforderlich, da alle Informationen im Token enthalten sind. |
| 🔄 **Portabilität**        | Einfach zwischen verschiedenen Diensten und APIs übertragbar, was die Integration erleichtert. |
| ⚡ **Performance**         | Reduziert den Server-Overhead durch Wegfall des Session-Managements. |

### Grenzen von JWT
Trotz der Vorteile gibt es auch Einschränkungen, die bei der Verwendung von JWT berücksichtigt werden müssen:

| **Grenze**               | **Beschreibung**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| 📏 **Größe**              | JWTs sind größer als Session-Cookies, was die Netzwerkbelastung erhöhen kann.   |
| 🚫 **Kein Widerruf**       | Ein ausgestelltes JWT kann nur durch Ablaufzeit ungültig gemacht werden, was bei kompromittierten Tokens problematisch ist. |

---

## Risiken und Alternativen beim Speichern von JWTs

### Risiken im Local Storage
Das Speichern von JWTs im Local Storage birgt Sicherheitsrisiken, insbesondere durch Cross-Site Scripting (XSS):

| **Risiko**               | **Beschreibung**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| ⚠️ **XSS-Angriffe**        | Angreifer können über Cross-Site Scripting Zugriff auf Tokens erhalten und diese missbrauchen. |

### Alternativen
Es gibt sicherere Alternativen zum Speichern von JWTs, die jedoch unterschiedliche Vor- und Nachteile mit sich bringen:

| **Alternative**          | **Vorteile**                              | **Nachteile**                          |
|--------------------------|-------------------------------------------|----------------------------------------|
| 🍪 **Cookies mit HttpOnly** | Schutz vor XSS                          | Anfällig für CSRF                      |
| 🔒 **Secure Storage APIs** | Höhere Sicherheit                       | Weniger flexibel und komplexer in der Implementierung |

### Vergleich: Sicherheit vs. Usability
- **Sicherheit**: Cookies mit HttpOnly bieten besseren Schutz gegen XSS, erfordern jedoch zusätzliche Maßnahmen gegen CSRF.
- **Usability**: Local Storage ist einfacher zu implementieren, aber weniger sicher.

---

## Schutz durch Signatur und Rolle des Public Keys

Die Signatur eines JWT und die Verwendung eines Public Keys spielen eine zentrale Rolle bei der Sicherstellung der Integrität und Authentizität des Tokens:

| **Aspekt**               | **Beschreibung**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| ✍️ **Schutz durch Signatur** | Die Signatur garantiert, dass der Inhalt des JWT nicht manipuliert wurde, da jede Veränderung die Signatur ungültig macht. |
| 🔑 **Rolle des Public Keys** | Der Public Key wird benötigt, um die Signatur zu validieren, da nur der Private Key die Signatur erzeugen kann. Dies ermöglicht eine sichere Überprüfung ohne Zugriff auf den Private Key. |

---

## Verschlüsselung und Signaturen: Sicherer Datenaustausch

### Rolle von Signaturen und Verschlüsselung
Signaturen und Verschlüsselung sind essenziell für die sichere Kommunikation zwischen Client und API:

| **Aspekt**               | **Beschreibung**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| 🖋️ **Signaturen**         | Gewährleisten die Integrität und Authentizität der Daten, indem sie Manipulationen verhindern. |
| 🔐 **Verschlüsselung**     | Schützt die Daten vor unbefugtem Zugriff, insbesondere bei der Übertragung sensibler Informationen. |

### Wann ist Verschlüsselung zusätzlich sinnvoll?
- Verschlüsselung ist zusätzlich zur Signatur notwendig, wenn sensible Daten übertragen werden, die nicht öffentlich einsehbar sein sollen, z. B. persönliche Informationen oder Zahlungsdaten.