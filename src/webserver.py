from typing import Union
import sys
import threading
from threading import Thread
import json
import asyncio
from asyncio import AbstractEventLoop

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from starlette.responses import FileResponse 

from paho.mqtt.client import MQTTMessage, Client
import paho


DEVICE_COUNT: int = 4
BROKER: str = "127.0.0.1"
PORT:   int = 1883


app = FastAPI()



class State:
    def __init__(self, websocket: WebSocket) -> None:
        self.websocket   = websocket


def on_message(mosq: Client, state: State, msg: MQTTMessage) -> None:
    message: str = msg.payload.decode("UTF-8")

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    # loop: AbstractEventLoop = asyncio.get_event_loop()
    loop.run_until_complete(state.websocket.send_text(message))

    print(f"Receiving state from device: `{message}`")


def mqtt_thread(client: Client) -> None:
    while client.loop() == 0:
        pass



@app.websocket("/lightctl")
async def websocket_endpoint(websocket: WebSocket):

    state = State(websocket)
    client = Client(userdata=state)
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.subscribe("/fiv/lb/+/state", 0)

    await websocket.accept()

    thread = threading.Thread(target=mqtt_thread, args=(client,))
    thread.start()

    for id in range(1, DEVICE_COUNT+1):
        client.publish(f'/fiv/lb/{id}/action', "get", 0)

    devicelist = { "count": DEVICE_COUNT }
    await websocket.send_text(json.dumps(devicelist))

    while True:
        data: str  = await websocket.receive_text()
        data: dict = json.loads(data)

        id:    int  = data["id"]
        state: bool = data["action"]

        print(f"Receiving from WS: `{id=}, {state=}`")
        client.publish(f'/fiv/lb/{id}/action', "on" if state else "off", 0)


app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")
