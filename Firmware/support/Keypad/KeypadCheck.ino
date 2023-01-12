#include "Wire.h"
#include "I2CKeyPad.h"
#include <LiquidCrystal_I2C.h>

const uint8_t KEYPAD_ADDRESS = 0x20;

I2CKeyPad keyPad(KEYPAD_ADDRESS);
LiquidCrystal_I2C lcd(0x27, 16, 2);

int keypadcheck()
{
    //   Serial.println("Searching WiFi.....");
    int connected = 0;
    Wire.begin();
    if (keyPad.begin() != false)
        connected = 1;

    return connected;
}

int c;

void setup()
{
    Serial.begin(9600);
    lcd.init();      // initializing the LCD
    lcd.backlight(); // Enable or Turn On the backlight
    c = keypadcheck();
    pinMode(LED_BUILTIN, OUTPUT);
    if (c == 1)
    {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("Successfully Connected ");
    }
    else
    {
        digitalWrite(LED_BUILTIN, LOW);
        Serial.println("Keypad ERROR!");
    }
}
void loop()
{
    while (c == 0)
    {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("Keypad not connected!");
        lcd.clear();
        lcd.print("Keypad ERROR!"); // Start Printing
        delay(1000);
        c = keypadcheck();
    }
}
