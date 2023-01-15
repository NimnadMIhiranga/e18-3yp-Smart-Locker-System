

// including header files
#include <ESP8266WiFi.h>
#include "Wire.h"
#include "I2CKeyPad.h"
#include <Adafruit_Fingerprint.h>
#include <LiquidCrystal_I2C.h>
#include <Firebase_ESP_Client.h>
#include <Arduino.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

// global variables

// for the finger print sensor
SoftwareSerial mySerial(D5, D6);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// for the keypad
const uint8_t KEYPAD_ADDRESS = 0x20;
I2CKeyPad keyPad(KEYPAD_ADDRESS);

// for the lcd display
LiquidCrystal_I2C lcd(0x27, 16, 2);
#define ER D0

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

// for the door sensor
const int doorSensor = 2;
int currentDoorState;

// for the firebase
#define DATABASE_URL "slocker-6a0e7-default-rtdb.firebaseio.com/"
#define API_KEY "AIzaSyAZ-1C80ncmZcB7ZreY3lienFpzc8jf3Ys"
unsigned long sendDataPrevMillis = 0;
String locationName = "nishmi";
String lockerID = "1";
String lockStatePath;

/*Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "mcu1@gmail.com"
#define USER_PASSWORD "12345678"

// for add the wifi networks that are used in mcu to connect(add the other networks below)
const char *ssid = "Redmi Note 9 Pro";
const char *password = "12345687";

void setup()
{
  Serial.begin(9600);
  // setting up pin modes
  pinMode(ER, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(doorSensor, INPUT_PULLUP);

  digitalWrite(ER, LOW);
  lcd.init();                                                                // initializing the LCD
  lcd.backlight();                                                           // Enable or Turn On the backlight
  int e = componentcheck();                                                  // to store the component check value
  firebaseSetup();                                                           // setting up the firebase
  lockStatePath = "Lockers/" + locationName + "/" + lockerID + "/LockState"; // to make the lock state path of the locker

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

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 1500 || sendDataPrevMillis == 0))
  {
    sendDataPrevMillis = millis();
    if (doorState() == 1)
    { // when door is open
      Serial.print("Door open----");
      Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (lockStatePath), F("1")) ? "ok" : fbdo.errorReason().c_str());
    }
    else if (doorState() == 0)
    { // when door is closed
      Serial.print("Door close----");
      Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (lockStatePath), F("0")) ? "ok" : fbdo.errorReason().c_str());
    }
  }
}

int componentcheck()
{
  // error codes
  //  0   -   No Error
  //  1   -   Wifi Error
  //  2   -   Keypad Error
  //  4   -   Fingerprint Error

  int error = 0;
  error += wificonnect(ssid, password);
  error += keypadCheck();
  error += fingerprintCheck();

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

int doorState()
{ // function to check door sensor staee
  lcd.clear();
  currentDoorState = digitalRead(doorSensor);

  if (currentDoorState == HIGH)
  {
    lcd.print("open");
    return 1;
  }
  lcd.print("close");
  return 0;
}

void firebaseSetup()
{ // to setup the firebase
  WiFi.begin(ssid, password);

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback;

#if defined(ESP8266)
  fbdo.setBSSLBufferSize(2048, 2048);
#endif

  // Limit the size of response payload to be collected in FirebaseData
  fbdo.setResponseSize(2048);

  Firebase.begin(&config, &auth);

  // Comment or pass false value when WiFi reconnection will control by your code or third party library
  Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);

  config.timeout.serverResponse = 10 * 1000;
}
