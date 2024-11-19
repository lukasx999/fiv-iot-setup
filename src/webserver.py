from typing import Union

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from paho.mqtt.client import MQTTMessage, Client
import paho


BROKER: str = "127.0.0.1"
PORT:   int = 1883


# Wenn das Internet das Netz ist, dann bin ich die Spinne!
app = FastAPI()
client = Client()

def on_message(mosq: Client, msg: MQTTMessage) -> None:
    message: str = msg.payload.decode("UTF-8")
    if message == "1":
        print("on")
    else:
        print("off")


client.connect(BROKER, PORT, 60)
client.subscribe("/fiv/lb/1/state", 0)
client.on_message = on_message


# http://127.0.0.1:8000/light/1?state=on
@app.post("/light/{light_id}")
def light(light_id: int, state: Union[str, None] = None):
    print(f"{light_id=}, {state=}")
    client.publish(f'/fiv/lb/{light_id}/action', 1 if state == "on" else 0, 0)
    # return { "light_id": light_id, "state": state }


app.mount("/", StaticFiles(directory="ui", html=True), name="ui")
