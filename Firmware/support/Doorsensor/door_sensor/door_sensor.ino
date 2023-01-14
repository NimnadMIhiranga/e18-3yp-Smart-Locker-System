#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <FirebaseArduino.h>

#define FIREBASE_HOST "slocker-6a0e7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "SPhQWoIM4wj8z1oWsxH2mJCA9NFt1leLTPusnUaO"
#define WIFI_SSID "Nisala Induwara"
#define WIFI_PASSWORD "gango99ns"


int sensor = 5;

int doorsensor(){
  while(digitalRead(sensor) == 1){
      digitalWrite(LED_BUILTIN, LOW); 
      return 1;
  }
  while(digitalRead(sensor) != 1){
    digitalWrite(LED_BUILTIN, HIGH);
    return 0;
  }
}

void firebaseSetup(){
   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
   //Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
   Serial.print(Firebase.failed());
}

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(sensor, INPUT_PULLUP);
  Serial.begin(9600);  
  firebaseSetup();
  
  
}

void loop(){
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  if(doorsensor()==1){
    Firebase.pushString("https://slocker-6a0e7-default-rtdb.firebaseio.com/doorsensor/status", "Opened");
    Serial.print(Firebase.failed());
    
  }else if(doorsensor()==0){
    Firebase.pushString("https://slocker-6a0e7-default-rtdb.firebaseio.com/doorsensor/status", "closed");  
    Serial.print(Firebase.failed());
     
  }
  delay(2000);
}