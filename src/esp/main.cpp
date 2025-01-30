#include <TFT_eSPI.h> 
#include <SPI.h>
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* wifi_ssid = "HTL-Weiz";          // Replace "HTL-Weiz" with your WiFi network name
const char* wifi_password = "HTL-Weiz";      // Replace "HTL-Weiz" with your WiFi password

// MQTT credentials and configuration
const char* mqtt_server = "172.31.182.46";   // Replace with the IP or URL of your MQTT server
const uint16_t mqtt_port = 1883;             // Default MQTT port
const char* mqtt_user = "rw";                // MQTT username
const char* mqtt_password = "readwrite";     // MQTT password

WiFiClient espClient;
PubSubClient mqtt_client(espClient);

// GPIO pins for LEDs
const int ledPin1 = 2; // For topic 1
const int ledPin2 = 3; // For topic 2
const int ledPin3 = 4; // For topic 3

void connectToWiFi() {
    Serial.print("Connecting to WiFi...");
    WiFi.begin(wifi_ssid, wifi_password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }

    Serial.println("\nConnected to WiFi.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void reconnectMQTT() {
    while (!mqtt_client.connected()) {
        Serial.print("Attempting MQTT connection...");

        // Attempt to connect
        if (mqtt_client.connect("ESP32Client", mqtt_user, mqtt_password)) {
            Serial.println("connected");

            // Subscribe to the topics
            mqtt_client.subscribe("/fiv/lb/1/action");
            mqtt_client.subscribe("/fiv/lb/2/action");
            mqtt_client.subscribe("/fiv/lb/3/action");

            Serial.println("Subscribed to topics: /fiv/lb/1/action, /fiv/lb/2/action, /fiv/lb/3/action");

        } else {
            Serial.print("failed, rc=");
            Serial.print(mqtt_client.state());
            Serial.println(". Trying again in 5 seconds.");
            delay(5000);
        }
    }
}

void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message arrived on topic: ");
    Serial.print(topic);
    Serial.print(". Message: ");

    // Extract the message from the payload
    String message = "";
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.println(message);

    // Check the topic and message content
    if (String(topic) == "/fiv/lb/1/action") {
        if (message == "on") {
            digitalWrite(ledPin1, HIGH); // Turn on LED1
            Serial.println("LED1 turned ON");
        } else if (message == "off") {
            digitalWrite(ledPin1, LOW); // Turn off LED1
            Serial.println("LED1 turned OFF");
        }
    } else if (String(topic) == "/fiv/lb/2/action") {
        if (message == "on") {
            digitalWrite(ledPin2, HIGH); // Turn on LED2
            Serial.println("LED2 turned ON");
        } else if (message == "off") {
            digitalWrite(ledPin2, LOW); // Turn off LED2
            Serial.println("LED2 turned OFF");
        }
    } else if (String(topic) == "/fiv/lb/3/action") {
        if (message == "on") {
            digitalWrite(ledPin3, HIGH); // Turn on LED3
            Serial.println("LED3 turned ON");
        } else if (message == "off") {
            digitalWrite(ledPin3, LOW); // Turn off LED3
            Serial.println("LED3 turned OFF");
        }
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("foo");

    // Initialize the LED pins as output
    pinMode(ledPin1, OUTPUT);
    pinMode(ledPin2, OUTPUT);
    pinMode(ledPin3, OUTPUT);

    // Ensure all LEDs are off initially
    digitalWrite(ledPin1, LOW);
    digitalWrite(ledPin2, LOW);
    digitalWrite(ledPin3, LOW);

    // Connect to WiFi
    connectToWiFi();

    // Configure MQTT client
    mqtt_client.setServer(mqtt_server, mqtt_port);
    mqtt_client.setCallback(callback);
}

void loop() {
    if (!mqtt_client.connected()) {
        reconnectMQTT(); // Reconnect to MQTT if the connection is lost
    }

    mqtt_client.loop(); // Process MQTT messages
}
