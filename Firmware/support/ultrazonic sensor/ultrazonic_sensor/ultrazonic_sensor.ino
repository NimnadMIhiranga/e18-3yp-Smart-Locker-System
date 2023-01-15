#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Arduino.h>

const int trig1 = 13;  //D7
const int echo1 = 15;  //D8
const int trig2 = 0;  //d3
const int echo2 = 4;  //d4

long duration;
int inches, sensor1, sensor2;

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

#define DATABASE_URL "slocker-6a0e7-default-rtdb.firebaseio.com/" 
#define API_KEY "AIzaSyAZ-1C80ncmZcB7ZreY3lienFpzc8jf3Ys"

/* 1. Define the WiFi credentials */
#define WIFI_SSID "Nisala Induwara"
#define WIFI_PASSWORD "gango99ns"

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


unsigned long sendDataPrevMillis = 0;

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

void setup() {
pinMode(trig1, OUTPUT); // Sets the trigPin as an Output
pinMode(echo1, INPUT); // Sets the echoPin as an Input
pinMode(trig2, OUTPUT); // Sets the trigPin as an Output
pinMode(echo2, INPUT); // Sets the echoPin as an Input
Serial.begin(9600); // Starts the serial communication
firebaseSetup();
path = "Lockers/"+locationName+"/"+lockerID+"/objState";


}

void sonarSensor(int trig, int echo){
    digitalWrite(trig, LOW);
    delayMicroseconds(2);
    digitalWrite(trig, HIGH);
    delayMicroseconds(10);
    digitalWrite(trig, LOW);
    duration = pulseIn(echo, HIGH);
    inches= duration/74/2;
}

int objCheck(){
  sonarSensor(trig1, echo1);
  sensor1 = inches;
  delay(2000);
  sonarSensor(trig2, echo2);
  sensor2 = inches;  

  if(sensor1<18 || sensor2<18){
    return 1;
  }else{
    return 0;
  }
  
}



void loop() {
  
 if (Firebase.ready() && (millis() - sendDataPrevMillis > 1500 || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();
      if(objCheck()==1){ //when door is open
        Serial.print("object is there");
        Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (path), F("1")) ? "ok" : fbdo.errorReason().c_str());
      }
      else if(objCheck()==0){ //when door is closed
        Serial.print("no object");
        Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (path), F("0")) ? "ok" : fbdo.errorReason().c_str());        
      }
  }
  
}

