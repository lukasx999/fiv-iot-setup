from typing import Union
import sys
import threading
from threading import Thread

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from starlette.responses import FileResponse 

from paho.mqtt.client import MQTTMessage, Client
import paho


BROKER: str = "127.0.0.1"
PORT:   int = 1883


# Wenn das Internet das Web ist, dann bin ich die Spinne!
app    = FastAPI()
client = Client()
client.connect(BROKER, PORT, 60)


def on_message(mosq: Client, msg: MQTTMessage) -> None:
    message: str = msg.payload.decode("UTF-8")
    print("foo")
    if message == "1":
        print("on")
    else:
        print("off")



def check_led_state() -> None:
    client.subscribe("/fiv/lb/1/state", 0)
    client.on_message = on_message
    while client.loop() == 0:
        pass




# http://127.0.0.1:8000/light/1?state=on
@app.post("/light/{light_id}")
def light(light_id: int, state: Union[str, None] = None):
    print(f"POST: {light_id=}, {state=}")
    client.publish(f'/fiv/lb/{light_id}/action', 1 if state == "on" else 0, 0)



@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print(data)
        await websocket.send_text(f"Message text was: {data}")



app.mount("/", StaticFiles(directory="ui/dist", html=True), name="ui")


# @app.get("/")
# async def root():
#     return FileResponse('ui/index.html')
