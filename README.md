# FIV IoT Setup

## Usage

- Start mosquitto broker
  - `mosquitto`
- Start an arbitrary amount of IoT clients
  - `python lightbulb.py <id>`
- Update device count in webserver.py
- Update IP in index.ts (`hostname -I`)
- Start webserver
  - `fastapi run webserver.py`
