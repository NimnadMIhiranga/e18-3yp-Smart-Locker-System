#include <ESP8266WiFi.h>
//#include <BlynkSimpleEsp8266.h>
#include <Firebase_ESP_Client.h>
#include <Arduino.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

#define DATABASE_URL "slocker-6a0e7-default-rtdb.firebaseio.com/" 
#define API_KEY "AIzaSyAZ-1C80ncmZcB7ZreY3lienFpzc8jf3Ys"

/* 1. Define the WiFi credentials */
#define WIFI_SSID "Eng-Student"
#define WIFI_PASSWORD "3nG5tuDt"

/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "mcu1@gmail.com"
#define USER_PASSWORD "12345678"

String locationName= "nishmi";
String lockerID= "1";
String path;

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;


const int doorSensor = 5;
int currentDoorState;


unsigned long sendDataPrevMillis = 0;

int doorState(){
   
  currentDoorState = digitalRead(doorSensor);

  if(currentDoorState == HIGH){
      return 1;  
  }

  return 0;

  
   
}

void firebaseSetup(){
   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
   
    /* Assign the api key (required) */
    config.api_key = API_KEY;

    /* Assign the user sign in credentials */
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    /* Assign the RTDB URL (required) */
    config.database_url = DATABASE_URL;

    /* Assign the callback function for the long running token generation task */
    config.token_status_callback = tokenStatusCallback; 

    #if defined(ESP8266)
      fbdo.setBSSLBufferSize(2048, 2048 );
    #endif

    // Limit the size of response payload to be collected in FirebaseData
    fbdo.setResponseSize(2048);

    Firebase.begin(&config, &auth);

    // Comment or pass false value when WiFi reconnection will control by your code or third party library
    Firebase.reconnectWiFi(true);

    Firebase.setDoubleDigits(5);

    config.timeout.serverResponse = 10 * 1000;
}

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(doorSensor, INPUT_PULLUP);
  Serial.begin(9600); 
  firebaseSetup();
  path = "Lockers/"+locationName+"/"+lockerID+"/LockState";
  
  
}

void loop(){

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 1500 || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();
      if(doorState()==1){ //when door is open
        Serial.print("Door open----");
        Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (path), F("1")) ? "ok" : fbdo.errorReason().c_str());
      }
      else if(doorState()==0){ //when door is closed
        Serial.print("Door close----");
        Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (path), F("0")) ? "ok" : fbdo.errorReason().c_str());        
      }
  }

}