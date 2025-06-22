## Beobachtungen

### Was passiert, wenn die Speichergrenze erreicht wird?

Wenn die Speichergrenze (z.B. 256 MB) erreicht wird, reagiert der Container langsamer und hängt sich auf. Weitere Speicherallokationen führen dazu, dass der Container nicht mehr auf Anfragen reagiert. Der Prozess im Container wird vom Docker automatisch beendet. 

Dadurch ist der Dienst nicht mehr verfügbar, bis der Container neu gestartet wird.

### Wie verhält sich der Container bei einem Speicherüberlauf?

Wird weiterhin versucht, Speicher zu allokieren, obwohl die Grenze erreicht ist, kommt es zu einem Speicherüberlauf. In der Container-Konsole erscheint dann eine Fehlermeldung:

    <--- JS stacktrace ---> 
    FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory

Diese Meldung weist darauf hin, dass der Node.js-Prozess keine weiteren Objekte im Heap anlegen konnte, da der gesamte zur Verfügung stehende Speicher bereits belegt war. 

Der Prozess stürzt daraufhin ab, und der Container wird entweder gestoppt oder beendet sich selbst.

### Was macht die Option `--memory-swap` und wie beeinflusst sie die Ausführung des Containers?

Die Option `--memory-swap` gibt an, wie viel **gesamter Speicher** (RAM + Swap) einem Container maximal zur Verfügung stehen darf. Beispielsweise bedeutet `--memory=256m --memory-swap=512m`, dass der Container 256 MB RAM und zusätzlich bis zu 256 MB Swap-Speicher verwenden darf, also insgesamt 512 MB.

Wenn `--memory-swap` denselben Wert wie `--memory` hat (z. B. `--memory=256m --memory-swap=256m`), ist **kein Swap erlaubt**. In diesem Fall ist der Container auf den physischen Speicher begrenzt, was zu einem früheren Absturz führen kann, wenn der Speicherverbrauch steigt.

**Anmerkung:** Swap-Speicher ist langsamer als echter Arbeitsspeicher.
