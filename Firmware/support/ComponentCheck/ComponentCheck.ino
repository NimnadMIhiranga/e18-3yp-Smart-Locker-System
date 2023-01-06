#include <ESP8266WiFi.h>
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
}

void loop()
{
}

int componentcheck()
{
    // error codes
    //  0   -   No Error
    //  1   -   Keyboard Error
    //  2   -   LCD Error
    //  3   -   Sensor Error
    //  4   -

    int error = 0;

    return error;
}