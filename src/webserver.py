from typing import Union

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from paho.mqtt.client import MQTTMessage, Client



app = FastAPI()


# http://127.0.0.1:8000/light/1?state=on
@app.get("/light/{light_id}")
def light(light_id: int, state: Union[str, None] = None) -> None:
    return {"light_id": light_id, "state": state}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

app.mount("/", StaticFiles(directory="ui", html=True), name="ui")
