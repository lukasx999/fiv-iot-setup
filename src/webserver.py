from typing import Union

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from paho.mqtt.client import MQTTMessage, Client



app = FastAPI()


# http://127.0.0.1:8000/light/1?state=on
@app.get("/light/{light_id}")
def light(light_id: int, state: Union[str, None] = None):
    return { "light_id": light_id, "state": state }


app.mount("/", StaticFiles(directory="ui", html=True), name="ui")
