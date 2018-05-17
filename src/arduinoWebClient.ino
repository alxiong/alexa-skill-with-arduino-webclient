#include <ArduinoJson.h>
#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
//IPAddress server(74,125,232,128);  // numeric IP for Google (no DNS)
char server[] = "d1wt7yy3y78u4b.cloudfront.net";    // name address for Google (using DNS)
const char* pullingResource = "/puzzle?action=arduinoPull";
const char* updateMovingStatusResource = "/puzzle?action=arduinoMove";

struct PuzzleStatus {
  char action[32];
  bool toMove;
  int startingPos[2];
  int endingPos[2];
};
// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;
PuzzleStatus puzzleStatus;

void initSerial() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ;  // wait for serial port to conect. Needed for native USB port only
  }
  Serial.println("Serial ready");
}

void initEthernet() {
  if (!Ethernet.begin(mac)) {
    Serial.println("Failed to configure Ethernet");
    return;
  }
  Serial.print("Ethernet ready at ");
  Serial.println(Ethernet.localIP());
  delay(1000);
}

bool sendRequest(const char* host, const char* resource) {
  Serial.print("GET ");
  Serial.println(resource);

  client.print("GET ");
  client.print(resource);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(server);
  client.println("Connection: close");
  client.println();

  client.println();
  return true;
}

bool skipResponseHeaders() {
  char endOfHeaders[] = "\r\n\r\n";
  client.setTimeout(10000);

  bool ok = client.find(endOfHeaders);  // HTTP headers end with an empty line

  if (!ok) {
    Serial.println("No response or invalid response!");
  }

  return ok;
}

void readReponseContent(char* content, size_t maxSize) {
  size_t length = client.readBytes(content, maxSize);
  content[length] = 0;
  Serial.println(content);
}

bool parsePuzzleStatus(char* content, PuzzleStatus* puzzleStatus) {
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(content);

  if (!root.success()) {
    Serial.println("JSON parsing failed!");
    return false;
  }

  strcpy(puzzleStatus->action, root["action"]);
  puzzleStatus->toMove = root["toMove"];
  puzzleStatus->startingPos[0] = root["startingPos"][0];
  puzzleStatus->startingPos[1] = root["startingPos"][1];
  puzzleStatus->endingPos[0] = root["endingPos"][0];
  puzzleStatus->endingPos[1] = root["endingPos"][1];

  return true;
}

void printPuzzleStatus(const PuzzleStatus* puzzleStatus) {
  Serial.print("Action = ");
  Serial.println(puzzleStatus->action);
  Serial.print("toMove = ");
  Serial.println(puzzleStatus->toMove);
  Serial.print("startingPos = ");
  Serial.print(puzzleStatus->startingPos[0]);
  Serial.print(" , ");
  Serial.println(puzzleStatus->startingPos[1]);
  Serial.print("endingPos = ");
  Serial.print(puzzleStatus->endingPos[0]);
  Serial.print(" , ");
  Serial.println(puzzleStatus->endingPos[1]);
}

void updateMovingStatus(const PuzzleStatus* puzzleStatus){
  if (client.connect(server, 80)) {
    Serial.println("connected for moving status update!");
    // send an update request informing the moving status.
    if (sendRequest(server, updateMovingStatusResource) && skipResponseHeaders()) {
      char response[512];
      readReponseContent(response, sizeof(response));
    }
    disconnect();
    // MOVE MOVE Move!!!
    // Move robotic arm here based on startingPos and endingPos

  }
}

void disconnect() {
  Serial.println("Disconnect");
  client.stop();
}

void wait() {
  Serial.println("Wait 10 seconds");
  delay(10000);
}

void setup() {
  initSerial();
  initEthernet();
}

void loop() {
  boolean currentLineIsBlank = true;
  if (client.connect(server, 80)) {
    Serial.println("connected for status pulling!");
    if (sendRequest(server, pullingResource) && skipResponseHeaders()) {
      char response[512];
      readReponseContent(response, sizeof(response));

      if (parsePuzzleStatus(response, &puzzleStatus)) {
        printPuzzleStatus(&puzzleStatus);
      }
    }

    disconnect();
  }

  // robotic arm moving based on status
  if (puzzleStatus.toMove) {
    updateMovingStatus(&puzzleStatus);
  }
  wait();
}
