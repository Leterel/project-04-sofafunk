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
46 Node-Tests: 45 bestanden, 1 Plattformtest ausgelassen. Echter lokaler WebRTC-Test bestand: Chat, synthetisches RTP-Audio/Video/Screen, Abbruch und Rejoin. Kein Zwei-Heimnetz-Test.

Bei fehlenden Paketen/Hardware/Betriebssystemen ist das Ergebnis „nicht ausgeführt“, kein Pass. Plattformnachweise aus älteren Detailberichten gelten nur für die dort genannten Versionen. Android-Automatisierung ausschließlich mit expliziter emulator-Seriennummer und bestätigtem ro.kernel.qemu=1. Physische Geräte, persönliche Medien und Produktionskonten sind keine Testfixtures.

## Vor Merge
`git diff --check` ausführen; relevante Funktionstests wiederholen, wenn Codeänderungen ihren Befund entwerten. Speicherdaten/alte Versionen erhalten. Fehlende externe Abnahmen in HANDOFF.md benennen.
