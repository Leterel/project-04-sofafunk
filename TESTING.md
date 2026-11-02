# Tests und Reproduzierbarkeit — SofaFunk

## Voraussetzungen
Node 24 empfohlen; npm ci nur falls die gepinnten Abhängigkeiten fehlen. Für Browserproben Playwright und vorhandenes Chrome.

## Befehle
```text
npm test
npm run test:e2e
```

Start/Build: npm run demo; die ausgegebene Loopback-Adresse in zwei getrennten Browserprofilen öffnen. Kamera/Mikrofon starten nur bewusst.

## Tatsächlicher Befund vom 02.11.2026
50 Node-Tests: 49 bestanden, 1 Plattformtest ausgelassen. 13 lokale WebRTC-Prüfgruppen bestanden: Chat, synthetisches RTP-Audio/Video/Screen, zustimmungspflichtige Dateiübertragung mit exaktem Download, Größenlimit, Ablehnen, Abbruch, Rejoin und Reconnect. Kein Zwei-Heimnetz-Test.

Bei fehlenden Paketen/Hardware/Betriebssystemen ist das Ergebnis „nicht ausgeführt“, kein Pass. Plattformnachweise aus älteren Detailberichten gelten nur für die dort genannten Versionen. Android-Automatisierung ausschließlich mit expliziter emulator-Seriennummer und bestätigtem ro.kernel.qemu=1. Physische Geräte, persönliche Medien und Produktionskonten sind keine Testfixtures.

## Vor Merge
`git diff --check` ausführen; relevante Funktionstests wiederholen, wenn Codeänderungen ihren Befund entwerten. Speicherdaten/alte Versionen erhalten. Fehlende externe Abnahmen in HANDOFF.md benennen.

## Dateiübertragung

Vier neue Modellgruppen prüfen Zustimmung vor Payload, Mehrblockübertragung mit Prüfsumme, Übergröße, ungültige Reihenfolge, beschädigte Daten, Abbruch, Disconnect, Zeitlimit und Dateinamen. `test/rtc.mjs` prüft zusätzlich einen echten 200001-Byte-Download zwischen zwei isolierten Chrome-Kontexten inklusive SHA-256-Vergleich, keine Payload vor Zustimmung, Übergröße vor Angebot, Ablehnen und verworfene Angebote nach Rejoin. Der Browserlauf nutzte ausschließlich lokale Signalisierung und synthetische Dateien/Medien. 13 Gruppen bestanden. Nachweis: test-results/files-20261102/rtc-results.json. Kein Internet-, Malware- oder physischer Mediengerätetest.
