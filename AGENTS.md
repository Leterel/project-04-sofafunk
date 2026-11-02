# Agentenleitfaden — SofaFunk

## Einstieg
WebRTC-Kommunikation für genau zwei Personen; Signalisierung im Arbeitsspeicher, keine permanente zentrale Chatdatenbank.

Lies README.md, TESTING.md und HANDOFF.md. Anforderungen und vorhandene Funktionen unterscheiden. Technische Grundlagen: ARCHITECTURE-P2P.md. Die bestehenden Detaildokumente bleiben maßgeblich; keine leeren SPEC-/ARCHITECTURE-/TODO-Kopien erzeugen. Offene Arbeit und Verlauf: PROGRESS.md; konkrete Einnahmegrenzen: MONETIZATION.md, soweit vorhanden.

## Umgebung und Start
Node 24 empfohlen; npm ci nur falls die gepinnten Abhängigkeiten fehlen. Für Browserproben Playwright und vorhandenes Chrome.

npm run demo; die ausgegebene Loopback-Adresse in zwei getrennten Browserprofilen öffnen. Kamera/Mikrofon starten nur bewusst.

Tests: `npm test; npm run test:e2e`. Bei mehreren Befehlen einzeln ausführen und jeden Exitcode prüfen. Vorhandene Installationen verwenden; fehlende Voraussetzungen melden statt automatisch globale Pakete oder Modelle zu installieren.

## Grenzen
- Größere Änderungen auf einem eigenen Branch; zuerst git status und fremde Änderungen prüfen. Keine parallelen widersprüchlichen Arbeiten am selben Branch.
- Keine Dateien/Repos löschen oder verschieben, keine Historien umschreiben, kein Force-Push. Keine Lizenzänderungen ohne konkrete Freigabe.
- Keine Secrets, privaten Daten, echten Nutzerinhalte oder großen generierten Dateien committen. Keine Sichtbarkeitsänderungen oder zusätzlichen Veröffentlichungen ohne Freigabe.
- Keine bezahlten Dienste, Werbenetzwerke, Zahlungsanbieter oder externe Nachrichten aktivieren.
- Keine zentrale Nachrichtenspeicherung einführen. Keine echten Kamera-/Mikrofon-/Desktopquellen für Automatisierung. Raumschlüssel nicht protokollieren.
- Projektwerkzeuge ändern keine anderen Projektquellen. Build-/Testartefakte in isolierten, ignorierten Arbeitsordnern halten. Vorhandene Ausgaben nicht unbesehen überschreiben.

## Nächste sichere Etappe
Begrenzte, abbrechbare Dateiübertragung mit Empfängerzustimmung planen und separat testen; Internet-/TURN-Praxistest bleibt offen.

## Übergabe
HANDOFF.md aktualisieren: Ausgangscommit/Branch, konkrete Änderungsliste, ausgeführte Befehle, Ergebnis, ausgelassene Tests samt Grund, Risiken und nächste Etappe. Nur tatsächlich ausgeführte Tests als bestanden ausweisen. Vor Merge Diff und Tests prüfen; externe Freigaben bleiben offen.
