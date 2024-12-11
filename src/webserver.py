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


BROKER: str = "127.0.0.1"
PORT:   int = 1883


app = FastAPI()


# # http://127.0.0.1:8000/light/1?state=on
# @app.post("/light/{light_id}")
# def light(light_id: int, state: Union[str, None] = None):
#     print(f"POST: {light_id=}, {state=}")
#     client.publish(f'/fiv/lb/{light_id}/action', 1 if state == "on" else 0, 0)


class State:
    def __init__(self, websocket: WebSocket) -> None:
        self.websocket   = websocket


def on_message(mosq: Client, state: State, msg: MQTTMessage) -> None:
    message: str = msg.payload.decode("UTF-8")

    # BUG: for some reason the websocket connection is already closed at this point

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


    # TODO: send lightbulb state and amount at start of connection
    # TODO: mqtt topic: server asking lightbulb client to send initial state to /fiv/lb/{}/state
    # TODO: let websocket loop run in second thread, mqtt client should run in main thread for asyncio

    thread = threading.Thread(target=mqtt_thread, args=(client,))
    thread.start()


    await websocket.accept()
    while True:
        data: str  = await websocket.receive_text()
        data: dict = json.loads(data)

        id:    int  = data["id"]
        state: bool = data["action"]

        # client.user_data_set()

        print(f"Receiving from WS: `{id=}, {state=}`")
        client.publish(f'/fiv/lb/{id}/action', 1 if state else 0, 0)

        # await websocket.send_text(f"Message text was: {data}")


app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")
