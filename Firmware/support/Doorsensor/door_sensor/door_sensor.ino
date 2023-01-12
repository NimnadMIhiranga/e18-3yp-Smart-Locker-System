#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

int sensor = 5;

void doorsensor(){
  while(digitalRead(sensor) == 1){
      digitalWrite(LED_BUILTIN, LOW); 
  }
  while(digitalRead(sensor) != 1){
    digitalWrite(LED_BUILTIN, HIGH);
  }
}

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(sensor, INPUT_PULLUP);
}

void loop(){
  doorsensor();
}