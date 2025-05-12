# Prozess- und Speicherverwaltung in Betriebssystemen

## Aufgabe 1: Prozesse und Prozesszustände

---

### 1. Prozesse: Verwaltung und Rolle des Prozesskontrollblocks (PCB)

#### Was ist ein Prozess?
Ein **Prozess** ist ein laufendes Programm im Speicher. Genauer gesagt ist es die Ausführung eines Programmcodes zusammen mit dessen aktuellem Zustand (z. B. Speicherinhalte, CPU-Register, geöffnete Dateien). Prozesse sind nicht nur Programme – sie sind aktive Instanzen dieser Programme.

Beispiel: Wenn ein Benutzer zweimal denselben Texteditor öffnet, entstehen zwei unterschiedliche Prozesse mit eigener Prozess-ID, obwohl sie denselben Programmcode verwenden.

#### Verwaltung von Prozessen durch das Betriebssystem
Das **Betriebssystem** (OS) verwaltet alle Prozesse, indem es:
- Prozesse erstellt (z. B. beim Programmstart),
- Prozesse plant (Scheduling),
- Ressourcen zuweist (z. B. Speicher, CPU-Zeit),
- Prozesse beendet und
- Kontextwechsel durchführt (Wechsel zwischen Prozessen).

Dies erfordert die Speicherung und Verwaltung vieler Zustände und Daten – genau das übernimmt der sogenannte **Prozesskontrollblock (PCB)**.

#### Was ist ein PCB?
Der **Prozesskontrollblock** ist eine Datenstruktur, die das Betriebssystem für jeden aktiven Prozess anlegt. Er enthält alle Informationen, die notwendig sind, um den Prozess zu verwalten und später ggf. wieder aufzunehmen.

Ein PCB beinhaltet typischerweise folgende Felder:

| Kategorie            | Beschreibung |
|----------------------|--------------|
| **Prozess-ID (PID)** | Eindeutige Kennung, mit der das OS den Prozess identifiziert |
| **Prozesszustand**   | Zustand wie „bereit“, „laufend“, „wartend“, „beendet“ |
| **Programmzähler**   | Adresse der nächsten auszuführenden Instruktion |
| **CPU-Register**     | Alle Register der CPU, z. B. Akkumulator, Stack-Pointer |
| **Speicherverwaltung** | Informationen über Speicherbereiche (z. B. Stack, Heap, Code) |
| **Scheduling-Informationen** | Priorität, Zeitscheibenverbrauch, Warteschlangenstatus |
| **I/O-Status**        | Welche Geräte der Prozess nutzt, offener Dateizugriff etc. |
| **Benutzerinformationen** | z. B. Eigentümer, Berechtigungen |

#### Rolle des PCB im Prozessmanagement
Wenn das Betriebssystem einen **Kontextwechsel (Context Switch)** durchführt – also von einem laufenden Prozess zu einem anderen wechselt – sichert es den aktuellen Zustand des Prozesses im PCB. Später kann der Prozess exakt an dieser Stelle fortgesetzt werden.

##### Beispiel:
Wenn Prozess A unterbrochen wird, weil seine Zeitscheibe abläuft, speichert das OS seinen Status im PCB von A. Anschließend lädt es den PCB von Prozess B und stellt dessen Kontext her. So kann Multitasking effizient umgesetzt werden.

#### Reflexion:
Die PCB ist ein zentrales Element in der Prozessverwaltung. Sie macht Prozesse „wiederaufnahmefähig“. Wichtig ist zu verstehen, dass der PCB nicht nur zum Speichern des Zustands dient, sondern auch als **Schnittstelle zwischen Betriebssystem und Prozessen** fungiert. Ohne diese Struktur wäre modernes Multitasking nicht möglich.

---

### 2. Prozesszustände und Zustandsübergänge

#### Typische Prozesszustände
Ein Prozess durchläuft verschiedene **Zustände**, die durch das Betriebssystem verwaltet werden. Die wichtigsten Zustände sind:

1. **New (Neu)**  
   Der Prozess wurde gerade erstellt, ist aber noch nicht bereit zur Ausführung. Initialisierung durch das OS.

2. **Ready (Bereit)**  
   Der Prozess wartet darauf, vom Scheduler der CPU zugewiesen zu werden. Er ist ausführbar, aber aktuell nicht aktiv.

3. **Running (Laufend)**  
   Der Prozess wird derzeit von der CPU ausgeführt. Nur ein Prozess pro CPU-Kern kann gleichzeitig in diesem Zustand sein.

4. **Waiting (Wartend / Blockiert)**  
   Der Prozess wartet auf ein Ereignis, z. B. eine Eingabe vom Benutzer oder eine Antwort von der Festplatte. Er wird nicht ausgeführt, bis das Ereignis eintritt.

5. **Terminated (Beendet)**  
   Der Prozess hat seine Arbeit abgeschlossen oder wurde vom Betriebssystem oder Nutzer beendet. Ressourcen werden freigegeben.

#### Erweiterte Zustände (je nach Betriebssystem):
- **Suspended**: Ein gestoppter Prozess, der aus dem Hauptspeicher ausgelagert wurde.
- **Zombie**: Ein beendeter Prozess, dessen Rückgabewert noch nicht vom übergeordneten Prozess abgeholt wurde.

#### Übergänge zwischen Zuständen:

```text
+-------+      +---------+      +----------+
| New   | ---> | Ready   | ---> | Running  |
+-------+      +---------+      +----------+
                                  ^    |
                                  |    v
                               +--------+
                               | Waiting|
                               +--------+
                                  |
                                  v
                             +------------+
                             | Terminated |
                             +------------+

```
## Aufgabe 3: Prozess-Scheduling – Präemptiv vs. Nicht-Präemptiv

### Was ist Prozess-Scheduling?
Prozess-Scheduling bezeichnet den Mechanismus, mit dem das Betriebssystem entscheidet, **welcher Prozess als Nächstes auf der CPU ausgeführt wird**. Dies ist notwendig, da auf einem Prozessor meist mehr Prozesse gleichzeitig laufen wollen, als Kerne vorhanden sind.

### Präemptives vs. Nicht-Präemptives Scheduling

#### Präemptives Scheduling
Beim **präemptiven Scheduling** kann das Betriebssystem einen laufenden Prozess **unterbrechen**, um einem anderen Prozess die CPU zuzuweisen. Dies geschieht beispielsweise bei Ablauf einer Zeitscheibe (Time Slice).

- **Beispiel**: Round-Robin oder Multilevel-Queue-Scheduling.

##### Vorteile:
- Bessere Reaktionszeit bei interaktiven Anwendungen (z. B. Benutzeroberflächen, Webbrowser).
- Keine Gefahr, dass Prozesse die CPU dauerhaft blockieren (CPU-Hogging).
- Bessere Ausnutzung von Mehrkernsystemen und Prioritäten.

##### Nachteile:
- **Komplexität**: Erfordert Kontextwechsel (Context Switching), was Overhead verursacht.
- Kann bei häufiger Unterbrechung zu Performanceverlust führen.
- Schwieriger vorhersehbar für zeitkritische Systeme.

#### Nicht-Präemptives Scheduling
Beim **nicht-präemptiven Scheduling** bleibt ein Prozess so lange auf der CPU, bis er **freiwillig** abgibt – z. B. durch Beenden oder Warten auf I/O.

- **Beispiel**: First-Come-First-Serve (FCFS), Shortest Job First (SJF).

##### Vorteile:
- Einfacher zu implementieren und vorhersehbar.
- Kein Kontextwechsel-Overhead durch erzwungene Unterbrechungen.
- Gut geeignet für eingebettete oder deterministische Systeme.

##### Nachteile:
- Prozesse mit langer Laufzeit können die CPU blockieren.
- Geringere Reaktionszeit für neue Prozesse.
- Ungünstig für Multitasking-Umgebungen.

#### Reflexion:
In modernen Betriebssystemen dominiert das präemptive Scheduling, weil es dynamischer und fairer ist. Allerdings wird nicht-präemptives Scheduling in eingebetteten oder zeitkritischen Systemen weiterhin genutzt, da es dort besser vorhersagbar ist.

---

## Aufgabe 4: Virtueller Speicher

### Was ist virtueller Speicher?
**Virtueller Speicher** ist eine Technik, bei der das Betriebssystem jedem Prozess **den Eindruck vermittelt, er habe den gesamten Speicher für sich allein**, obwohl in Wirklichkeit viele Prozesse den gleichen physischen RAM nutzen.

Dabei wird der **logische Adressraum** (virtuelle Adressen) vom **physischen Adressraum** (RAM) getrennt. Eine sogenannte **Speicherverwaltungseinheit (MMU)** in der Hardware übersetzt virtuelle Adressen zu physischen Adressen.

### Wie funktioniert virtueller Speicher?

1. Der Speicher wird in gleich große Blöcke unterteilt:
   - **Seiten (Pages)** im virtuellen Speicher.
   - **Rahmen (Frames)** im physischen Speicher.

2. Eine **Seitentabelle** (Page Table) merkt sich, welche virtuelle Seite welchem physischen Rahmen zugeordnet ist.

3. Falls eine benötigte Seite nicht im RAM liegt, löst dies einen **Page-Fault** aus. Das Betriebssystem lädt die Seite aus dem **Sekundärspeicher** (z. B. Festplatte).

4. Optional können **nicht benötigte Seiten ausgelagert** (Swapping) und später wieder geladen werden.

### Vorteile von virtuellem Speicher

| Vorteil | Beschreibung |
|--------|--------------|
| **Prozessisolation** | Prozesse greifen nicht unabsichtlich auf den Speicher anderer Prozesse zu. |
| **Mehr Prozesse möglich** | Prozesse können ausgeführt werden, auch wenn der physische RAM nicht reicht – durch Auslagerung. |
| **Flexibler Speicherzugriff** | Programme können so tun, als ob sie am selben Speicherort liegen – Vereinfachung des Programmierens. |
| **Effizienteres Speicherlayout** | Durch Paging können nur benötigte Teile geladen werden (Demand Paging). |

### Nachteile und Herausforderungen

- **Performance-Einbußen** durch Page-Faults, vor allem wenn viele Seiten ausgelagert sind.
- **Komplexität** in der Speicherverwaltung und MMU-Steuerung.
- **Thrashing**: Wenn zu viele Page-Faults auftreten, verbringt das System mehr Zeit mit Laden/Schreiben als mit echter Arbeit.

## Aufgabe 5: Paging – Speicherverwaltung mit Seiten und Seitenrahmen

### Was ist Paging?
**Paging** ist eine Technik der **virtuellen Speicherverwaltung**, bei der der Adressraum eines Prozesses in **gleich große Blöcke** (sogenannte **Seiten**, engl. *Pages*) unterteilt wird. Gleichzeitig wird auch der **physische Speicher** in gleich große Blöcke, sogenannte **Seitenrahmen** (*Page Frames*), aufgeteilt.

### Wie funktioniert Paging?

1. **Virtueller Speicher** eines Prozesses wird in Seiten aufgeteilt (z. B. 4 KB groß).
2. **Physischer RAM** ist in gleich große Page Frames unterteilt.
3. Eine **Seitentabelle (Page Table)** wird für jeden Prozess geführt. Sie enthält die Zuordnung:
   - *Virtuelle Seite → Physischer Seitenrahmen*
4. Wenn ein Prozess eine virtuelle Adresse nutzt:
   - Die Adresse wird in **Seitenzahl + Offset** aufgeteilt.
   - Die MMU (Memory Management Unit) sucht in der Seitentabelle nach dem zugehörigen Page Frame.
   - Der Offset bleibt gleich, nur die Basisadresse wird angepasst.
5. Falls die Seite nicht im RAM liegt → **Page Fault**, und die Seite wird von der Festplatte (z. B. SSD) nachgeladen.

### Seitenrahmen (Page Frames)
Dies sind die kleinsten Einheiten im physischen RAM, in die Seiten geladen werden. Typischerweise 4 KB groß.

### Seitentabellen (Page Tables)
Sie enthalten für jede virtuelle Seite:
- Ob die Seite geladen ist (Present Bit),
- Welcher Frame zugeordnet ist,
- Schutzrechte (Read/Write/Execute),
- Dirty Bit (geändert?),
- und ggf. Zeitstempel (für LRU-Scheduling).

#### Vorteile von Paging
- Kein **externer Fragmentierungsverlust** (da alle Seiten gleich groß sind).
- Einfache Verwaltung durch fixe Blockgrößen.
- Schutz und Isolation durch Seitentabellen.

#### Nachteile
- **Interne Fragmentierung** (nicht jede Seite wird vollständig genutzt).
- Performance-Verlust durch **mehrfache Speicherzugriffe** (z. B. beim Nachladen von Seiten).

#### Reflexion
Paging bietet eine effiziente und sichere Methode zur Speicherverwaltung. Moderne Betriebssysteme nutzen oft **mehrstufige Seitentabellen** oder **invertierte Page Tables**, um große Adressräume (z. B. bei 64-Bit-Systemen) effizient verwalten zu können.

---

## Aufgabe 6: Speicherfragmentierung

### Was ist Speicherfragmentierung?
**Speicherfragmentierung** bezeichnet die ineffiziente Nutzung des Hauptspeichers, bei der freier Speicher zwar vorhanden ist, aber nicht zusammenhängend genug, um größere Speicheranforderungen zu erfüllen.

Es gibt **zwei Hauptarten**:

### 1. Externe Fragmentierung
- Tritt bei **variabler Speicherzuteilung** auf (z. B. bei malloc in C).
- Freie Speicherbereiche entstehen zwischen belegten Bereichen.
- Beispiel: 10 MB frei, aber in 3 nicht zusammenhängenden Stücken → Prozess mit 6 MB Bedarf kann nicht geladen werden.
- Problem: Speicher ist "verstreut".

#### Lösungsmöglichkeiten:
- **Kompaktion**: Speicher wird „aufgeräumt“, belegte Blöcke werden verschoben (aufwendig!).
- **Paging/Segmentierung**: Vermeidung durch feste Einheiten (z. B. Pages).

### 2. Interne Fragmentierung
- Tritt auf, wenn **fixe Speicherblöcke** verwendet werden (z. B. bei Paging).
- Der Prozess bekommt z. B. 4 KB, nutzt aber nur 2.5 KB → 1.5 KB werden verschwendet.
- Ursache: Speicherblock größer als der tatsächliche Bedarf.

#### Lösungsmöglichkeiten:
- Kleinere Blockgrößen → weniger Verschwendung, aber mehr Verwaltungsaufwand.
- **Buddy-System**: Speicher wird in Blöcke nach Zweierpotenzen geteilt, um Flexibilität zu erhöhen.

### Reflexion
Speicherfragmentierung ist ein zentrales Problem der Speicherverwaltung. Moderne Systeme versuchen, beide Arten durch Techniken wie Paging, Heap-Optimierung oder Garbage Collection in Hochsprachen zu minimieren. Dennoch bleibt es eine Herausforderung bei der effizienten Ressourcennutzung.
