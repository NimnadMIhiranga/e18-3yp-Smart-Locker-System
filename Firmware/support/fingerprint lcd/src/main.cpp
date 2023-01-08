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

// variable to store the current menu selection
int selection = 0;

void setup() {
  // initialize the LCD
  lcd.init();
  lcd.backlight(); // Enable or Turn On the backlight 
 Wire.begin();
 Wire.setClock(400000);
  // clear the LCD
  lcd.clear();
}

void loop() {
  // read input from the keypad
  char v[19] = "123A456B789C*0#DNF"; 
  uint8_t idx = keypad.getKey();
  char key = v[idx];


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
  lcd.print("SET -A SELECT -D");


  lcd.setCursor(0, 1);
  for (int i = 0; i < numOptions; i++) {
    if (i == selection) {
      // highlight the selected option
      // lcd.setCursor(i*7, 1);
      // lcd.print("> ");
      lcd.print(">1.PIN  2.FINGER");
    }
    else {
      // lcd.setCursor(i*7+7*(1-i), 1);
      // lcd.print("  ");
      //lcd.print(options[i]);
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
       lcd.print("1"); // PIN  reading function here
        // do something for option 1
        break;
      case 1:
      lcd.print("PUT THUMB");
      lcd.setCursor(0, 1);
       lcd.print("2"); // fingerprint function here
        // do something for option 2
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