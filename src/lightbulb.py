from paho.mqtt.client import MQTTMessage, Client
import paho
import sys
import json


BROKER: str = "127.0.0.1"
PORT:   int = 1883


class State:
    def __init__(self, id: int, initial_state: bool) -> None:
        self.id      = id
        self.enabled = initial_state



# TODO: jsòn/protobuf
def on_message(mosq: Client, state: State, msg: MQTTMessage) -> None:
    message: str = msg.payload.decode("UTF-8")
    state.enabled = True if message == '1' else False

    if state.enabled:
        print("LED is on")
    else:
        print("LED is off")

    response = { "id": state.id, "state": state.enabled }
    mosq.publish(f'/fiv/lb/{state.id}/state', json.dumps(response), 0)





def main() -> int:

    if len(sys.argv) == 1:
        print(f"usage: {sys.argv[0]} <id>")
        return 1

    state = State(int(sys.argv[1]), False)

    client = Client(userdata=state)
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.subscribe(f"/fiv/lb/{state.id}/action", 0)

    try:
        while client.loop() == 0:
            pass
    except KeyboardInterrupt:
        return 0

    return 0


if __name__ == '__main__':
    sys.exit(main())
