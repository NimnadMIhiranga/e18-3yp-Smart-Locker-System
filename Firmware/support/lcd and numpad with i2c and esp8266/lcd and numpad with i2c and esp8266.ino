//
//    FILE: I2CKeyPad_demo03.ino
//  AUTHOR: Rob Tillaart
// PURPOSE: demo reading a larger value from the keyPad
//     URL: https://github.com/RobTillaart/I2CKeyPad
//
// PCF8574
//    pin p0-p3 rows
//    pin p4-p7 columns
// 4x4 or smaller keypad.


#include "Wire.h"
#include "I2CKeyPad.h"

#include <LiquidCrystal_I2C.h>

const uint8_t KEYPAD_ADDRESS = 0x20;

I2CKeyPad keyPad(KEYPAD_ADDRESS);


LiquidCrystal_I2C lcd(0x27, 16, 2);

uint32_t start, stop;
uint32_t lastKeyPressed = 0;
uint32_t value = 0;


void setup()
{
  Serial.begin(115200);
 
  Wire.begin();
  lcd.init();   // initializing the LCD
  lcd.backlight(); // Enable or Turn On the backlight 
  lcd.print(" Hello Makers "); // Start Printing


  
  Wire.setClock(400000);

  
  
  if (keyPad.begin() == false)
  {
    Serial.println("\nERROR: cannot communicate to keypad.\nPlease reboot.\n");
    while(1);
  }
}


void loop()
{
  uint32_t now = millis();

  if (now - lastKeyPressed >= 100)
  {
    lastKeyPressed = now;

    
    handleKeyPadValue(value);
    if (value > 9999999999) value = 0;  // some sample max.
    lcd.clear();
    lcd.print(value);
  }
  
    
  
}


// handleKeyPadValue is used to read a uint32_t from the keypad
// every digit must be pressed separately
// the last key pressed is also returned.
//
// 0..9 adds to the number
// * means remove last digit
// # resets to zero
// ABCD are not mapped.
char handleKeyPadValue(uint32_t &value)
{
  char v[19] = "123A456B789C*0#DNF";  // N = NoKey, F = Fail
  static uint8_t lastKey = 0;

  uint8_t idx = keyPad.getKey();
  char c = v[idx];

  if (lastKey != c)
  {
    lastKey = c;
    switch (c)
    {
      case '0' ... '9':
        value *= 10;
        value += c - '0';
        break;
      case '*':
        if (value > 0) value /= 10;
        break;
      case '#':
        value = 0;
        break;
      case 'A' ... 'D':
        // e.g. store value in EEPROM
        break;
      case 'F':
        //Serial.println("FAIL");
        break;
      case 'N':
        //Serial.println("NOKEY");
        break;
      default:
        break;
    }
  }
  return c;
}


// -- END OF FILE --