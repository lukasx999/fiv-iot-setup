# fiv-iot-setup

## Project

### Goal

An IoT-Setup with MQTT as middleware.
 
**Components**:
- MQTT-Broker (e.g. mosquitto in VM)
- n "receiver" (e.g. simulated lightbulb which can be toggled)
- A minimum of one controlling device ((T)GUI which communicates with the user)
- Allows depositing of commands
- Displays current status
- Web interface for handling using a mobile device.
  - Variant 1: Server sided MQTT communication with broker, with client using websockets.
  - Variant 2: Using websockets to directly commnunicate from client to broker.


### Usage

panes:
- `mosquitto`
- `mosquitto_sub -t "/fiv/lb/<id>/state"`
- `mosquitto_pub -t "/fiv/lb/<id>/action" -m <1 | 0>`
- `python lightbulb.py <id>`
