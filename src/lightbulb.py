import paho.mqtt.client as paho
from paho.mqtt.client import MQTTMessage, Client
import sys


BROKER: str = "127.0.0.1"
PORT:   int = 1883



def on_message(mosq: Client, obj, msg: MQTTMessage):
    message: str = msg.payload.decode("UTF-8")
    print(message)
    mosq.publish('/fiv/', 'ack', 0)




def main() -> int:
    client = Client()
    client.on_message = on_message

    client.connect(BROKER, PORT, 60)

    id: int = sys.argv[1]
    client.subscribe(f"/fiv/lb/{id}/action", 0)

    while client.loop() == 0:
        pass

    return 0


if __name__ == '__main__':
    sys.exit(main())
