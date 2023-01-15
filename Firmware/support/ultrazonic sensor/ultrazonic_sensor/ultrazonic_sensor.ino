// defining pins
const int trig1 = 13; //D7
const int echo1 = 15; //D8
const int trig2 = 1; //TX
const int echo2 = 3; //RX

// variables to store time and distance
long duration;
long inches;

// function to check distance from one sensor
int objCheck(int trigPin, int echoPin){
  
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW); 

  duration = pulseIn(echoPin, HIGH);
  inches= duration/74/2;
  Serial.println(inches);

  if(inches<18){
    return 1;
  }else{
    return 0;
  }

}

// function to check object from both sensors
int object(){
  if(objCheck(trig1, echo1)==1){
    return 1;
    delay(2000);
  }else if(objCheck(trig2, echo2)==1){
    return 1;
    delay(2000);
  }else{
    return 0;
  }

}


void setup() {
pinMode(trig1, OUTPUT); 
pinMode(echo1, INPUT);
pinMode(LED_BUILTIN, OUTPUT); 
pinMode(trig2, OUTPUT); 
pinMode(echo2, INPUT);
Serial.begin(9600); 

}

void loop(){

  if(object()==1){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
  }else{
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
  }

}
