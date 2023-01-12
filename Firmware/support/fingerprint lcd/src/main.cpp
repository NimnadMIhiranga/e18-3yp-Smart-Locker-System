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

// variable to store the current menu selection
int selection = 0;

String input;

char lastKey = 'Y';
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t getFingerprintID();
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
  // read input from the keypad
  
  uint8_t idx = keypad.getKey();
  char key = v[idx];
   input = "";

  // navigate through the menu options
  if (key == 'A') {
    // move the selection up
    selection--;
    if (selection < 0) {
      selection = numOptions - 1;
    }
  }
  else if (key == 'B') {
    // move the selection down
    selection++;
    if (selection >= numOptions) {
      selection = 0;
    }
  }

  // display the menu options
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("SET-A   SELECT-D");


  lcd.setCursor(0, 1);
  for (int i = 0; i < numOptions; i++) {
    if (i == selection) {
      lcd.print(">1.PIN  2.FINGER");
    }
    else {
      lcd.print(" 1.PIN >2.FINGER");
    }
  }

  // handle the selected option
  
  if (key == 'D') {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("BACK-C|");
    switch (selection) {
      case 0:
      lcd.print("ENTER PIN");
      lcd.setCursor(0, 1);
      key = v[keypad.getKey()];
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
    lcd.print("Correct PIN");
    
   
   }
  }
  }





      key = v[keypad.getKey()];
    }
      
        break;
      case 1:
      lcd.print("PUT THUMB");
      lcd.setCursor(0, 1);
      // lcd.print("2");
      while(key != 'C'){
        getFingerprintID();
        key = v[keypad.getKey()];
      }
      
    while(key != 'C'){
      key = v[keypad.getKey()];
    } 
        break;
    }

    key = v[keypad.getKey()];
    while(key != 'C'){
      key = v[keypad.getKey()];
    }
  }

  // add a delay to prevent key debouncing
  delay(200);
}


uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
      lcd.clear();
       lcd.setCursor(0, 1);
      lcd.print("NO MATCH");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);
  lcd.clear();
   lcd.setCursor(0, 1);
  lcd.print("FINGER MATCHED");
  return finger.fingerID;
}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  return -1;

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);
  return finger.fingerID;
}