#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include <TZ.h>
#include <FS.h>
#include <LittleFS.h>
#include <CertStoreBearSSL.h>

// Update these with values suitable for your network.
const char* ssid = "Wifi52";
const char* password = "0959305377!";
const char* mqtt_server = "f60a2c0a48a842058cba081918f3bdd8.s2.eu.hivemq.cloud";

// A single, global CertStore which can be used by all connections.
// Needs to stay live the entire time any of the WiFiClientBearSSLs
// are present.
BearSSL::CertStore certStore;

WiFiClientSecure espClient;
PubSubClient * client;
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (500)
char msg[MSG_BUFFER_SIZE];
int value = 0;
int D7Pin = 13; //fitolamp
int D2Pin = 4; //pump
int D5Pin = 14; // gigrometr
int analogPin = A0;

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void setDateTime() {
  // You can use your own timezone, but the exact time is not used at all.
  // Only the date is needed for validating the certificates.
  configTime(TZ_Europe_Kiev, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for NTP time sync: ");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(100);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println();

  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  Serial.printf("%s %s", tzname[0], asctime(&timeinfo));
}


void callback(char* topic, byte* payload, unsigned int length) {
  //Serial.print("Message arrived [");
  //Serial.print(topic);
  //Serial.print("] ");
  String data = "";
  for (int i = 0; i < length; i++) {
    data += String((char)payload[i]);
  }
  //Serial.println(data);
  //Serial.println(data);
  if(String(topic) == "pomp") {
    digitalWrite(D7Pin, LOW);
    delay(5000);
    digitalWrite(D7Pin, HIGH);
  } else if(String(topic) == "fitolamp") {
    if(data == "1") {
      digitalWrite(D2Pin, LOW);
    } else if (data == "0") {
      digitalWrite(D2Pin, HIGH);
    }
  }
}


void reconnect() {
  // Loop until we’re reconnected
  while (!client->connected()) {
    Serial.print("Attempting MQTT connection…");
    String clientId = "ESP8266Client - MyClient";
    // Attempt to connect
    // Insert your password
    if (client->connect(clientId.c_str(), "nodeMCUclient", "12345678")) {
      Serial.println("connected");
      // Once connected, publish an announcement…
      // client->publish("light", "hello world");
      // … and resubscribe
      client->subscribe("pomp");
      client->subscribe("fitolamp");
    } else {
      Serial.print("failed, rc = ");
      Serial.print(client->state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  delay(500);
  // When opening the Serial Monitor, select 9600 Baud
  Serial.begin(9600);
  delay(500);

  LittleFS.begin();
  setup_wifi();
  setDateTime();

  pinMode(LED_BUILTIN, OUTPUT); // Initialize the LED_BUILTIN pin as an output
  pinMode(D2Pin, OUTPUT);
  pinMode(D7Pin, OUTPUT);
  pinMode(D5Pin, OUTPUT);
  digitalWrite(D2Pin, HIGH);
  digitalWrite(D7Pin, HIGH);
  digitalWrite(D5Pin, LOW);

  // you can use the insecure mode, when you want to avoid the certificates
  //espclient->setInsecure();

  int numCerts = certStore.initCertStore(LittleFS, PSTR("/certs.idx"), PSTR("/certs.ar"));
  Serial.printf("Number of CA certs read: %d\n", numCerts);
  if (numCerts == 0) {
    Serial.printf("No certs found. Did you run certs-from-mozilla.py and upload the LittleFS directory before running?\n");
    return; // Can't connect to anything w/o certs!
  }

  BearSSL::WiFiClientSecure *bear = new BearSSL::WiFiClientSecure();
  // Integrate the cert store with this connection
  bear->setCertStore(&certStore);

  client = new PubSubClient(*bear);

  client->setServer(mqtt_server, 8883);
  client->setCallback(callback);
}

void loop() {
  if (!client->connected()) {
    reconnect();
  }
  client->loop();

  unsigned long now = millis();
  if (now - lastMsg > 59000) {
    digitalWrite(D5Pin, HIGH);
    delay(1000);
    int gigrometrValue = analogRead(analogPin);
    digitalWrite(D5Pin, LOW);
    int gigrometrPercent = map(gigrometrValue, 0, 1023, 50, 0) * 2;
    lastMsg = now;
    ++value;
    snprintf (msg, MSG_BUFFER_SIZE, "%ld", value);
    //Serial.print("Publish message: ");
    //Serial.println(String(gigrometrPercent));
    client->publish("light", msg);
    snprintf (msg, MSG_BUFFER_SIZE, "%ld", gigrometrPercent);
    client->publish("gigrometr", msg);
  }
}