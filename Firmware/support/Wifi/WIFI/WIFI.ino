#include <ESP8266WiFi.h>
#include "Wire.h"
#include <LiquidCrystal_I2C.h>
// #include <FirebaseArduino.h>

// #define FIREBASE_HOST "slocker-6a0e7-default-rtdb.firebaseio.com"
// #define FIREBASE_AUTH "SPhQWoIM4wj8z1oWsxH2mJCA9NFt1leLTPusnUaO"

// for add the wifi networks that are used in mcu to connect(add the other networks below)
const char *ssid1 = "ACES_Coders";
const char *password1 = "Coders@2022";

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define led D4
int wificonnect(const char *ssid1, const char *password1)
{
    //   Serial.println("Searching WiFi.....");
    int connected = 0;
    int networks = WiFi.scanNetworks(); // to get the list of all the available networks
    for (int i = 0; i < networks; ++i)
    {
        if (WiFi.SSID(i) == ssid1) // if the ssid is equal to the given ssid
        {
            WiFi.begin(ssid1, password1);
            connected = 1; // change the status of the connect to 1
            break;
        }
    }
    return connected;
}
int c;
void setup()
{
    Serial.begin(9600);
    lcd.init();      // initializing the LCD
    lcd.backlight(); // Enable or Turn On the backlight
    c = wificonnect(ssid1, password1);
    pinMode(LED_BUILTIN, OUTPUT);
    if (c == 1)
    {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("Successfully Connected ");
        // lcd.print("Wifi Error!"); // Start Printing
        c = wificonnect(ssid1, password1);
    }
    else
    {
        digitalWrite(LED_BUILTIN, LOW);
        Serial.println("Successfully not Connected ");
    }
}
void loop()
{
    while (c == 0)
    {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("Successfully not Connected ");
        lcd.clear();
        lcd.print("Wifi Error!"); // Start Printing
        c = wificonnect(ssid1, password1);
    }
}
