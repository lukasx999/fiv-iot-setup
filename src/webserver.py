from typing import Union
import sys
import threading
from threading import Thread
import json

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from starlette.responses import FileResponse 

from paho.mqtt.client import MQTTMessage, Client
import paho


BROKER: str = "127.0.0.1"
PORT:   int = 1883


app = FastAPI()



# TODO: return current amount of lightbulbs
# @app.get("/get_lights")
# def light(light_id: int, state: Union[str, None] = None):
#     ...


# # http://127.0.0.1:8000/light/1?state=on
# @app.post("/light/{light_id}")
# def light(light_id: int, state: Union[str, None] = None):
#     print(f"POST: {light_id=}, {state=}")
#     client.publish(f'/fiv/lb/{light_id}/action', 1 if state == "on" else 0, 0)


class State:
    def __init__(self, websocket: WebSocket) -> None:
        self.websocket = websocket


async def on_message(mosq: Client, state: State, msg: MQTTMessage) -> None:
    message: str = msg.payload.decode("UTF-8")
    await state.websocket.send_text(message)
    # response: dict = json.loads(message)
    print(f"state: {message}!")



@app.websocket("/lightctl")
async def websocket_endpoint(websocket: WebSocket):

    state = State(websocket)

    client = Client(userdata=state)
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.subscribe("/fiv/lb/+/state", 0)

    # TODO: send lightbulb state and amount at start of connection

    await websocket.accept()
    while client.loop() == 0:  # Keep connection alive as long as the mqtt client is active
        data: str  = await websocket.receive_text()
        data: dict = json.loads(data)

        id:    int  = data["id"]
        state: bool = data["action"]

        # client.user_data_set()

        print(f"{id=}, {state=}")
        client.publish(f'/fiv/lb/{id}/action', 1 if state else 0, 0)

        # await websocket.send_text(f"Message text was: {data}")



app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")


# @app.get("/")
# async def root():
#     return FileResponse('ui/index.html')
