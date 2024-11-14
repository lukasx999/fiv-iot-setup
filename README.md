# fiv-iot-setup

## Projekt

### Ziel

Ein IoT-Setup mit MQTT als middleware.
 
**Komponenten**:
- MQTT-Broker (z.b. mosquitto in VM)
- n "Endgeräte" (zb simulierte Glühbirnen die man ein und ausschalten kann)
- mind. ein "Steuergerät" ((T)GUI die mit dem Benutzer kommuniziert)
- Erlaubt absetzen von Befehlen
- Zeigt aktuellen Status an
- Web Oberfläche für die Bedienung über ein mobiles Gerät (Handy)
  - Variante 1: Auf der Serverseite MQTT mit dem Broker sprechen, mit dem Client über Websockets
  - Variante 2: Vom Client direkt via WebSockets mit dem Broker kommunizieren.


### Usage

panes:
- `mosquitto`
- `mosquitto_sub -t "/fiv/lb/<id>/state"`
- `mosquitto_pub -t "/fiv/lb/<id>/action" -m <1 | 0>`
- `python lightbulb.py <id>`
