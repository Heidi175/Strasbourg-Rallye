# Straßburg-Rallye als Web-App

## Enthalten
- 10 zweisprachige Stationen
- Antworten werden lokal auf dem Smartphone gespeichert
- Punktestand und Abschlussansicht
- Kartenlinks zu OpenStreetMap
- installierbar als PWA
- offline nutzbar, nachdem die App einmal geladen wurde

## Lokal testen
Im Ordner einen lokalen Webserver starten:

python -m http.server 8000

Dann im Browser öffnen:
http://localhost:8000

## Kostenlos veröffentlichen
Geeignet sind z. B. GitHub Pages, Netlify oder Cloudflare Pages.
Den gesamten Ordner hochladen. Danach erhältst du eine öffentliche HTTPS-Adresse.

## QR-Code
Sobald die öffentliche Adresse feststeht, einen QR-Code für genau diese URL erzeugen.
Ein QR-Code kann erst nach Veröffentlichung endgültig erstellt werden, weil er die Webadresse enthalten muss.

## Datenschutz
Alle Antworten und Fortschritte bleiben im Browser des jeweiligen Geräts.
Die App sendet keine Formulardaten an einen Server.
