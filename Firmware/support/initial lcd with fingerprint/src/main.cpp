#include <Arduino.h>
#include <Adafruit_Fingerprint.h>
#include "Wire.h"
#include "I2CKeyPad.h"
#include <LiquidCrystal_I2C.h>

SoftwareSerial mySerial(D5, D6);
const uint8_t KEYPAD_ADDRESS = 0x20;

I2CKeyPad keypad(KEYPAD_ADDRESS);

LiquidCrystal_I2C lcd(0x27, 16, 2);

// define the menu options
const int numOptions = 2;
String options[numOptions] = {"Opt. 1", "Opt. 2"};
char v[19] = "123A456B789C*0#DNF"; 
uint32_t lastKeyPressed = 0;
uint32_t value = 0;
char key;
int val =0;


// variable to store the current menu selection
int selection = 0;

String pin = "1234";

char lastKey = 'Y';
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

bool  reservation = true;
bool unlock = true;
bool in = true;
void check();
void unlockOp();
void lockOp();
void unlockNClaer();
uint8_t getFingerprintEnroll();


void setup() {
  // initialize the LCD
  finger.begin(57600);
  lcd.init();
  lcd.backlight(); // Enable or Turn On the backlight 
  Wire.begin();
  Wire.setClock(400000);
  Serial.begin(9600);
  // clear the LCD
  lcd.clear();
}

void loop() {
  check();
  // NO RESERVATION
  if(!reservation){
    lcd.setCursor(0,0);
     lcd.print("USE S-LOCKER APP");
     lcd.setCursor(0,1);
     lcd.print("FOR RESERVATIONS");
  }else{
    if(unlock){
       if(in){
        unlockOp();


      }else{ // out
        unlockNClaer();
      }
    }else{
     
      lockOp();
    }
  }
  
 
    /* code */

  
  
}

void check(){
  delay(500);
}

void unlockOp(){
  lcd.clear();
  lcd.print("ENTER PIN");
  lcd.setCursor(0, 1);
  key = v[keypad.getKey()];
  String input = "";
    while(key != 'C'){

        uint32_t now = millis();

  if (now - lastKeyPressed >= 100)
  {
    lastKeyPressed = now;

    
    if (key &&  lastKey != key) {
      lastKey = key;
    lcd.setCursor(0, 1);
    Serial.print(key+'\n');
    if (key == 35) {
      Serial.print("Hash Occured\n");
      input = "";
       //lcd.print(input);
      lcd.print("                ");
    } else if (key == 42) {
      input = input.substring(0, input.length()-1);
      Serial.print("Star Occured\n");
      lcd.print(input);
      lcd.print("                ");
      lcd.setCursor(input.length(), 1);
      
   
     
     }
     else {
      Serial.print("Number Occured\n");
      if(key !='N' && key !='A' && key !='B' && key !='D')
      input += key;
      
      lcd.print(input);
    }
   if(input == "1234"){
    //lcd.clear();
    //lcd.print("Correct PIN");
    val =0;
   if(getFingerprintEnroll()==1){
  lcd.clear();
  lcd.print("FINGER STORED");
  
   
   }
 
   }
  }
  }





      key = v[keypad.getKey()];
    }
}

void lockOp(){
  delay(300);
}

void unlockNClaer(){

}



uint8_t getFingerprintEnroll() {
 
    key = v[keypad.getKey()];
  
    while(key != 'C'){
  int p = -1;
  lcd.clear();
  lcd.print("Waiting for finger "); lcd.print(10);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
    lcd.clear();
      lcd.print("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
    lcd.clear();
      lcd.print("NO FINGER");
      key = v[keypad.getKey()];
      if(key == 'C') return 2;
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
    lcd.clear();
      lcd.print("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
    lcd.clear();
      lcd.print("Imaging error");
      break;
    default:
    lcd.clear();
      lcd.print("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
    lcd.clear();
      lcd.print("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
    lcd.clear();
      lcd.print("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
    lcd.clear();
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
    lcd.clear();
      lcd.print("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
    lcd.clear();
      lcd.print("Could not find fingerprint features");
      return p;
    default:
    lcd.clear();
      lcd.print("Unknown error");
      return p;
  }

lcd.clear();
  lcd.print("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  lcd.clear();
  lcd.print("ID "); lcd.print(10);
  p = -1;
  lcd.clear();
  lcd.print("Place same finger again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
    lcd.clear();
      lcd.print("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
    lcd.clear();
      lcd.print("NO FINGER");
       key = v[keypad.getKey()];
      if(key == 'C') return 2;
      
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
    lcd.clear();
      lcd.print("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
    lcd.clear();
      lcd.print("Imaging error");
      break;
    default:
    lcd.clear();
      lcd.print("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
    lcd.clear();
      lcd.print("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
    lcd.clear();
      lcd.print("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
    lcd.clear();
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
    lcd.clear();
      lcd.print("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
    lcd.clear();
      lcd.print("Could not find fingerprint features");
      return p;
    default:
    lcd.clear();
      lcd.print("Unknown error");
      return p;
  }

  // OK converted!
  lcd.clear();
  lcd.print("Creating model for #");  lcd.print(10);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    lcd.clear();
    lcd.print("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    lcd.clear();
    lcd.print("Communication error");
    getFingerprintEnroll();
    //return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    lcd.clear();
    lcd.print("Fingerprints did not match");
    getFingerprintEnroll();
    //return p;
  } else {
    lcd.clear();
    lcd.print("Unknown error");
    getFingerprintEnroll();
    //return p;
  }

lcd.clear();
  lcd.print("ID "); lcd.print(10);
  p = finger.storeModel(10);
  if (p == FINGERPRINT_OK) {
    lcd.clear();
    lcd.print("Stored!");
    val =1;
    return 1;
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    lcd.clear();
    lcd.print("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    lcd.clear();
    lcd.print("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    lcd.clear();
    lcd.print("Error writing to flash");
    return p;
  } else {
    lcd.print("Unknown error");
    lcd.clear();
    return p;
  }

  key = v[keypad.getKey()];
 
}
return val;
 
}