# Zwei Personen, Session-to-Session — verbindlicher Zielstand

SofaFunk verbindet genau zwei Personen. Sprache, Video und Bildschirm werden
über WebRTC übertragen; Text läuft über den geordneten RTCDataChannel.
Es gibt keine dauerhaft zentrale Chat-Datenbank als Voraussetzung.

## Vorhandene Umsetzung

- `public/app.js`: RTCPeerConnection, DataChannel, Medienstart/-stop und Rejoin.
- `server/signal.mjs`: WebSocket-Signalisierung, Räume nur im Arbeitsspeicher,
  maximal zwei authentifizierte Plätze, Ablauf-/Schließlogik und optional
  kurzlebige TURN-Credentials. Kein Nachrichtendatenbankzugriff im Signalserver.
- `server/demo.mjs`: isolierter lokaler Start mit frischem Raumgeheimnis.
- Browser/Desktop-Clients verwenden dieselbe Signalisierungs-/WebRTC-Logik.

## Verbindungsmodell

Die Clients benötigen zunächst einen Weg, Sitzungsbeschreibung und ICE-Kandidaten
auszutauschen. Der vorhandene kleine Signalserver erfüllt diese Aufgabe; für
Internetbetrieb mit HTTPS/WSS und bewusstem Betreiber. Selbsthosting auf vorhandener
Hardware ist vorgesehen, wird hier aber nicht eingerichtet.

Direkte Verbindung ist bevorzugt. Bei manchen NAT-/Firewall-Konstellationen ist
ein TURN-Relay nötig. Es transportiert dann die WebRTC-Verbindung; es ist keine
Chat-Datenbank. Relay-Bandbreite und erreichbare Ports sind reale Betriebsfragen,
deshalb kein Versprechen „ohne jede Infrastruktur immer kostenlos erreichbar“.
Ohne konfigurierte TURN-Werte werden keine Relay-Zugangsdaten erzeugt.

## Nächste abnehmbare Schritte

1. Zwei reale Rechner mit derselben selbst kontrollierten Signalisierung verbinden.
2. Direktpfad und optional bewusst konfigurierten Relay-Pfad getrennt nachweisen.
3. Session-Abbruch, Wiederbeitritt und Abweisung einer dritten Person testen.
4. Einen optionalen Verlauf ausschließlich clientseitig planen; Aufbewahrung,
   Export und Löschen bewusst bedienbar. Kein zentraler Verlauf als Voraussetzung.
5. Dateiübertragung mit Begrenzung/Abbruch über DataChannel entwickeln.

Aktuell ist kein öffentlicher Signalserver bereitgestellt. Lokale Tests und alte
synthetische RTC-Nachweise ersetzen keinen aktuellen Zwei-Heimnetz-Praxistest.
