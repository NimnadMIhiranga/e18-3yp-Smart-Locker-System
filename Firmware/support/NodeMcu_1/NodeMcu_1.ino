#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

#define FIREBASE_HOST "slocker-6a0e7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "SPhQWoIM4wj8z1oWsxH2mJCA9NFt1leLTPusnUaO"


const char *ssid1 = "Starlink";
const char *password1 = "jemisbaba";

const char *ssid2 = "doenets.lk";
const char *password2 = "hoshikagEweb512LUCI";

#define led D2


#define TCP_MSS whatever
#define LWIP_IPV6 whatever
#define LWIP_FEATURES whatever
#define LWIP_OPEN_SRC whatever
int a = 3;
int nodemcu1 = 3;
void setup() {
  Serial.begin(9600);
  while (WiFi.status() != WL_CONNECTED) {
    mynetwork();
  }

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Serial.println("Successfully Connected ");

 //Firebase.setInt("nodemcu1",0);
  pinMode(led, OUTPUT);
 

}
void mynetwork() {
  Serial.println("Searching WiFi.....");
  int networks = WiFi.scanNetworks();
  for (int i = 0; i < networks; ++i) {
    if (WiFi.SSID(i) == ssid1 ) {
      WiFi.begin(ssid1, password1);
      Serial.println("\nWiFi Found");
      delay(2000);
      Serial.println("Connecting Please Wait");
      break;
    }
    else if (WiFi.SSID(i) == ssid2) {
      WiFi.begin(ssid2, password2);
      Serial.println("\nWiFi Found");
      delay(2000);
      Serial.println("Connecting Please Wait");
      break;
    } else {
      Serial.println("Unable to Find Authenticated WiFi ");
    }
  }
  delay(8000);
}


void loop() {
  if (WiFi.status() == WL_DISCONNECTED) {
    Serial.println("WiFi Disconnected");
    setup();
  } else {
    Serial.println("Connected");

    nodemcu1 = Firebase.getInt("nodemcu1");
    a = nodemcu1;

    //////////////////////////////////////LED/////////////////////////////////////////

    if (nodemcu1 == 1)
    {
      digitalWrite(led, HIGH);
    } else if(nodemcu1 == 0){
      digitalWrite(led, LOW);
    }
  }
}
