/*
#define trigger1 13
#define Echo1 15
#define trigger2 1
#define Echo2 3
*/
//#define LED 2

long duration;
long inches;

int objCheck(int trigPin, int echoPin){
  
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW); 

  duration = pulseIn(echoPin, HIGH);
  inches= duration/74/2;

  if(inches<18){
    return 1;
  }else{
    return 0;
  }

}

int object(int trig1, int trig2,int echo1, int echo2){
  
  if((objCheck(trig1, echo1)==1) || (objCheck(trig2, echo2)==1)){
    return 1;
  }else{
    return 0;
  }

}

void setup() {
pinMode(13, OUTPUT); 
pinMode(15, OUTPUT);
pinMode(LED_BUILTIN, OUTPUT); 
pinMode(1, INPUT); 
pinMode(3, INPUT);

}

void loop(){

  while(objCheck(13, 15)==1){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
  }

  while(objCheck(13, 15)==0){
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
  }
}
