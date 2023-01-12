#include <ESP8266WiFi.h>
#include "Wire.h"
#include "I2CKeyPad.h"
#include <Adafruit_Fingerprint.h>
#include <LiquidCrystal_I2C.h>

#if (defined(__AVR__) || defined(ESP8266)) && !defined(__AVR_ATmega2560__)
// For UNO and others without hardware serial, we must use software serial...
// pin #2 is IN from sensor (GREEN wire)
// pin #3 is OUT from arduino  (WHITE wire)
// Set up the serial port to use softwareserial..
SoftwareSerial mySerial(D5, D6);

#else
// On Leonardo/M0/etc, others with hardware serial, use hardware serial!
// #0 is green wire, #1 is white
#define mySerial Serial1
#endif

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

const uint8_t KEYPAD_ADDRESS = 0x20;
I2CKeyPad keyPad(KEYPAD_ADDRESS);
LiquidCrystal_I2C lcd(0x27, 16, 2);
#define ER D0

// for add the wifi networks that are used in mcu to connect(add the other networks below)
const char *ssid = "Redmi Note 9 Pro";
const char *password = "12345687";

void setup()
{
    pinMode(ER, OUTPUT);
    digitalWrite(ER, LOW);
    lcd.init();      // initializing the LCD
    lcd.backlight(); // Enable or Turn On the backlight
    int e = componentcheck();
    while (e > 0)
    {
        if (e == 1)
        {
            digitalWrite(ER, HIGH);
            lcd.clear();
            lcd.print("WIFI ERROR");
        }
        else if (e == 2)
        {
            digitalWrite(ER, HIGH);
            lcd.clear();
            lcd.print("KEYPAD ERROR");
        }
        else if (e == 4)
        {
            digitalWrite(ER, HIGH);
            lcd.clear();
            lcd.print("F. ERROR");
        }
        else
        {
            digitalWrite(ER, HIGH);
            lcd.clear();
            lcd.print("Multiple ERRORS");
        }
        delay(2000);
        e = componentcheck();
    }
}

void loop()
{
}

int componentcheck()
{
    // error codes
    //  0   -   No Error
    //  1   -   Wifi Error
    //  2   -   Keypad Error
    //  3   -   Sensor Error
    //  4   -

    int error = 0;
    error += wificonnect(ssid, password);
    error += keypadcheck();

    return error;
}

// Component check functions

int wificonnect(const char *ssid1, const char *password1)
{
    // ERROR Code :
    // 1 : WIFI ERROR
    //   Serial.println("Searching WiFi.....");
    int connected = 1;
    int networks = WiFi.scanNetworks(); // to get the list of all the available networks
    for (int i = 0; i < networks; ++i)
    {
        if (WiFi.SSID(i) == ssid1) // if the ssid is equal to the given ssid
        {
            WiFi.begin(ssid1, password1);
            lcd.print("WIFI Connected");
            connected = 0; // change the status of the connect to 1
            break;
        }
    }
    return connected;
}

int keypadCheck()
{
    // ERROR Code :
    // 2 : Keypad ERROR
    //   Serial.println("Searching WiFi.....");
    int connected = 0;
    Wire.begin();
    if (keyPad.begin() == false)
        connected = 2;

    return connected;
}

int fingerprintCheck()
{
    int connected = 0;
    finger.begin(57600);
    delay(5);
    if (finger.verifyPassword())
    {
        Serial.println("Found fingerprint sensor!");
    }
    else
    {
        Serial.println("Did not find fingerprint sensor :(");
        connected = 4;
    }
    return connected;
}