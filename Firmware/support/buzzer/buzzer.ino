const unsigned char buzzer = 2;
const unsigned char led = 1;

void buzzerTone(int state){
    if(state == 1){
      digitalWrite(led,LOW) ; //Turn on the built in led
      digitalWrite(buzzer,HIGH) ; //Turn on active buzzer
      delay (200);
 
      digitalWrite(led,HIGH) ; //Turn off the built in led
      digitalWrite(buzzer,LOW) ; //Turn off active buzzer
      delay (200);       
    }
}

void setup () {
// pinMode (Passive_buzzer,OUTPUT) ;
pinMode (buzzer,OUTPUT) ;
pinMode (led,OUTPUT) ;
}

void loop () {
      buzzerTone(1);

}



