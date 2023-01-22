/*
PIns
D3 - Door lock
D1 , D2 - Keypad & LCD
D4 - Door Sensor(remove when uploading)
D7 - trig 1 (remove when uploading)
D8 - echo 1 (remove when uploading)
RXD0 - buzzer
TXD0 - red LED

*/

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

// to cancel the user bookings
String uid;
String bookid;
String uidStatePath;
String bookidStatePath;
String bookCancelPath;

// to check reservation state  0 - reserved , 1 - available , 2 - booked and in use
String state;
String bookStatePath;
String pin;
String pinStatePath;

// for the finger print sensor
SoftwareSerial mySerial(D5, D6);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
uint8_t getFingerprintID();
uint8_t id;

// for the keypad
const uint8_t KEYPAD_ADDRESS = 0x20;
I2CKeyPad keyPad(KEYPAD_ADDRESS);
// define the menu options
const int numOptions = 2;
String options[numOptions] = {"Opt. 1", "Opt. 2"};
char v[19] = "123A456B789C*0#DNF";
uint32_t lastKeyPressed = 0;
uint32_t value = 0;
char key;
int val = 0;
// variable to store the current menu selection
int selection = 0;
String input = "NULL";
char lastKey = 'Y';

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
int prevDoorState = 0;

// door lock
int door = 0;
int unlockLocked = 0;

// biuzzer pins
const unsigned char buzzer = 3;
const unsigned char led = 1;

// Ultrasonic Sensor
const int trig1 = 13; // D7
const int echo1 = 15; // D8
long duration;
int inches, sensor1;

// for the firebase
#define DATABASE_URL "slocker-6a0e7-default-rtdb.firebaseio.com/"
#define API_KEY "AIzaSyAZ-1C80ncmZcB7ZreY3lienFpzc8jf3Ys"
unsigned long sendDataPrevMillis = 0;
String locationName = "Library";
String lockerID = "1";
String lockStatePath;

/*Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "mcu1@gmail.com"
#define USER_PASSWORD "12345678"

// for add the wifi networks that are used in mcu to connect(add the other networks below)
const char *ssid = "Mi 11 Lite";
const char *password = "denuwan55";

void setup()
{
  Serial.begin(9600);
  // setting up pin modes
  pinMode(ER, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(doorSensor, INPUT_PULLUP);
  pinMode(door, OUTPUT);
  pinMode(trig1, OUTPUT); // Sets the trigPin as an Output
  pinMode(echo1, INPUT);  // Sets the echoPin as an Input

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }

  digitalWrite(door, HIGH);
  digitalWrite(ER, LOW);
  lcd.init();      // initializing the LCD
  lcd.backlight(); // Enable or Turn On the backlight
  lcd.print("Setting up...");
  // delay(20000);
  // int e = componentcheck();
  int e = 0;                                                                   // to store the component check value
  firebaseSetup();                                                             // setting up the firebase
  lockStatePath = "Lockers/" + locationName + "/" + lockerID + "/LockState";   // to make the lock state path of the locker
  pinStatePath = "Lockers/" + locationName + "/" + lockerID + "/LockPin";      // to make the pin state path of the locker
  bookStatePath = "Lockers/" + locationName + "/" + lockerID + "/State";       // to make the book state path of the locker
  uidStatePath = "Lockers/" + locationName + "/" + lockerID + "/UID";          // to make the book state path of the locker
  bookidStatePath = "Lockers/" + locationName + "/" + lockerID + "/BookingID"; // to make the book state path of the locker

  int suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
  state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
  Serial.println("State:" + state);
  sendDataPrevMillis = millis();
  // Firebase.getString(&fbdo, (pinStatePath);

  suc += Firebase.RTDB.getString(&fbdo, pinStatePath);
  pin = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
  Serial.println("Pin:" + pin);
  sendDataPrevMillis = millis();
  // pin = ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
  while (suc != 2)
  {
    // suc = 0;
    firebaseSetup();

    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    sendDataPrevMillis = millis();

    Serial.println("State:" + state);
    // Firebase.getString(&fbdo, (pinStatePath);

    suc += Firebase.RTDB.getString(&fbdo, pinStatePath);
    sendDataPrevMillis = millis();

    pin = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    Serial.println("Pin:" + pin);
  }

  // Serial.println(state);
  // lcd.clear();
  // lcd.print(state);
  Wire.begin();
  Wire.setClock(400000);

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
  finger.begin(57600);
}

void loop()
{
  int suc = 0;
  doorLock(door);
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
  {
    // int e = componentcheck();
    // if (e)
    // {
    //   while (e > 0)
    //   {
    //     if (e == 1)
    //     {
    //       digitalWrite(ER, HIGH);
    //       lcd.clear();
    //       lcd.print("WIFI ERROR");
    //     }
    //     else if (e == 2)
    //     {
    //       digitalWrite(ER, HIGH);
    //       lcd.clear();
    //       lcd.print("KEYPAD ERROR");
    //     }
    //     else if (e == 4)
    //     {
    //       digitalWrite(ER, HIGH);
    //       lcd.clear();
    //       lcd.print("F. ERROR");
    //     }
    //     else
    //     {
    //       digitalWrite(ER, HIGH);
    //       lcd.clear();
    //       lcd.print("Multiple ERRORS");
    //     }
    //     delay(2000);
    //     e = componentcheck();
    //   }
    // }
    // else
    // {
    lcd.clear();
    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    sendDataPrevMillis = millis();
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    Serial.println("State:" + state);
    while (suc != 1)
    {
      // suc = 0;
      firebaseSetup();
      suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
      state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      sendDataPrevMillis = millis();

      Serial.println("State:" + state);
    }

    // state = Firebase.RTDB.getString(&fbdo, bookStatePath) ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    lcd.clear();
    while (state == "1")
    {
      lcd.setCursor(0, 0);
      lcd.print("USE S-LOCKER APP");
      lcd.setCursor(0, 1);
      lcd.print("FOR RESERVATIONS");
      suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
      sendDataPrevMillis = millis();
      state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      Serial.println("State:" + state);
      while (suc != 1)
      {
        // suc = 0;
        firebaseSetup();

        suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
        state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
        sendDataPrevMillis = millis();

        Serial.println("State:" + state);
      }
    }
    while (state == "0" || state == "3")
    { // if there is a reservation avaible to the locker or the locker is already in use
      // Serial.println("Pin:" + pin);
      int suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
      suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
      sendDataPrevMillis = millis();
      state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      Serial.println("State:" + state);
      suc += Firebase.RTDB.getString(&fbdo, uidStatePath);
      sendDataPrevMillis = millis();
      uid = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      Serial.println("UID:" + uid);
      suc += Firebase.RTDB.getString(&fbdo, bookidStatePath);
      sendDataPrevMillis = millis();
      bookid = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      Serial.println("Book ID:" + bookid);
      suc += Firebase.RTDB.getString(&fbdo, pinStatePath);
      pin = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      Serial.println("Pin:" + pin);
      sendDataPrevMillis = millis();
      ;
      while (suc != 4)
      {
        // suc = 0;
        firebaseSetup();

        suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
        state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
        sendDataPrevMillis = millis();

        Serial.println("State:" + state);
        suc += Firebase.RTDB.getString(&fbdo, uidStatePath);
        sendDataPrevMillis = millis();
        uid = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
        Serial.println("UID:" + uid);
        suc += Firebase.RTDB.getString(&fbdo, bookidStatePath);
        sendDataPrevMillis = millis();
        bookid = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
        Serial.println("Book ID:" + bookid);
        suc += Firebase.RTDB.getString(&fbdo, pinStatePath);
        pin = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
        Serial.println("Pin:" + pin);
        sendDataPrevMillis = millis();
      }
      if (state == "0")
      { // first time user is using the app
        unlockOp();
        Serial.println("door unlocking.......");
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("PUT YOUR THINGS");
        lcd.setCursor(0, 1);
        lcd.print(" & CLOSE DOOR");
        doorUnlock(door);
        while (Firebase.RTDB.setString(&fbdo, (bookStatePath), F("3")) != 1)
          ;
        sendDataPrevMillis = millis();

        delay(8000);
        while (!unlockLocked)
        {
          // doorUnlock(door);
          Serial.println("unlock = 0");
          while (doorState() == 1)
            ;
          delay(2000);
          Serial.println("unlock = 1");
          doorLock(door);
          while (Firebase.RTDB.setString(&fbdo, (lockStatePath), F("0")) != 1)
            ;
          sendDataPrevMillis = millis();

          Serial.print("firebase updated with lockstate 0 and state 3");
          unlockLocked = 1;
          state = "3";
        }
      }
      else if (state == "3")
      { // locker is in use
        int mVal = menu();
        if (mVal == 1)
        {
          unlockLocked = 0;
          doorUnlock(door);
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("GET YOUR THINGS");
          lcd.setCursor(0, 1);
          lcd.print(" & CLOSE DOOR");
          delay(8000);
          while (!unlockLocked)
          {
            // doorUnlock(door);
            Serial.println("unlock = 0");
            while (doorState() == 1)
              ;
            delay(2000);
            Serial.println("unlock = 1");
            doorLock(door);
            while (Firebase.RTDB.setString(&fbdo, (lockStatePath), F("0")) != 1)
              ;
            sendDataPrevMillis = millis();
            if (objCheck() == 1)
            { // when door is open
              Serial.println("object is there");
              while (Firebase.RTDB.setString(&fbdo, (bookStatePath), F("3")) != 1)
                ;
              state = "3";
              Serial.print("firebase updated with lockstate 0 and state 3");
              // Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (path), F("1")) ? "ok" : fbdo.errorReason().c_str());
            }
            else if (objCheck() == 0)
            { // when door is closed
              Serial.println("no object");
              while (Firebase.RTDB.setString(&fbdo, (bookStatePath), F("1")) != 1)
                ;
              state = "1";
              bookCancelPath = "Bookings/" + uid + "/" + bookid + "/" + "State";
              while (Firebase.RTDB.setString(&fbdo, (bookCancelPath), F("1")) != 1)
                ; // to cancel the booking in booking collection
              if (finger.verifyPassword())
              {
                Serial.println("Found fingerprint sensor!");
              }
              else
              {
                Serial.println("Did not find fingerprint sensor :(");
                while (1)
                  ;
              }

              finger.emptyDatabase();
              Serial.print("firebase updated with lockstate 0 and state 1");
              // Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (path), F("0")) ? "ok" : fbdo.errorReason().c_str());
            }

            unlockLocked = 1;
            mVal = 0;
          }
        }
        // if (Firebase.ready() && (millis() - sendDataPrevMillis > 1500 || sendDataPrevMillis == 0))
        // {
        //   sendDataPrevMillis = millis();
        //   if (doorState() == 1)
        //   { // when door is open
        //     // Serial.print("Door open----");
        //     Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (lockStatePath), F("1")) ? "ok" : fbdo.errorReason().c_str());
        //   }
        //   else if (doorState() == 0)
        //   { // when door is closed
        //     // Serial.print("Door close----");
        //     Serial.printf("Set string... %s\n", Firebase.RTDB.setString(&fbdo, (lockStatePath), F("0")) ? "ok" : fbdo.errorReason().c_str());
        //   }
        // }
      }
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
      // lcd.print("WIFI Connected");
      Serial.println("WIFI Connected");
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
  // lcd.clear();
  delay(100);
  currentDoorState = digitalRead(doorSensor);

  if (currentDoorState == HIGH)
  {
    // lcd.print("open");
    Serial.println("Door Open");
    return 1;
  }
  // lcd.print("close");
  Serial.println("Door Close");

  return 0;
}

void firebaseSetup()
{ // to setup the firebase

  // Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(ssid, password);
    Serial.print(".");
    delay(300);
  }
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

uint8_t getFingerprintID()
{
  uint8_t p = finger.getImage();
  switch (p)
  {
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
  switch (p)
  {
  case FINGERPRINT_OK:
    Serial.println("Image converted");
    break;
  case FINGERPRINT_IMAGEMESS:
    Serial.println("Image too messy");
    getFingerprintEnroll();
    return p;
  case FINGERPRINT_PACKETRECIEVEERR:
    Serial.println("Communication error");
    getFingerprintEnroll();
    return p;
  case FINGERPRINT_FEATUREFAIL:
    Serial.println("Could not find fingerprint features");
    getFingerprintEnroll();
    return p;
  case FINGERPRINT_INVALIDIMAGE:
    Serial.println("Could not find fingerprint features");
    getFingerprintEnroll();
    return p;
  default:
    Serial.println("Unknown error");
    getFingerprintEnroll();
    return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK)
  {
    Serial.println("Found a print match!");
    getFingerprintEnroll();
  }
  else if (p == FINGERPRINT_PACKETRECIEVEERR)
  {
    Serial.println("Communication error");
    getFingerprintEnroll();
    return p;
  }
  else if (p == FINGERPRINT_NOTFOUND)
  {
    Serial.println("Did not find a match");
    lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("NO MATCH");
    return p;
  }
  else
  {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);
  lcd.clear();
  lcd.setCursor(0, 1);
  lcd.print("FINGER MATCHED");
  return finger.fingerID;
}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez()
{
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)
    return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)
    return -1;

  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);
  return finger.fingerID;
}

void openMenu()
{

  int suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
  sendDataPrevMillis = millis();
  state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
  Serial.println("State when in the open menu:" + state);
  while (suc != 1)
  {
    // suc = 0;
    firebaseSetup();

    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    sendDataPrevMillis = millis();

    Serial.println("State when in the open menu:" + state);
  }
  while (state != "1")
  {
    // read input from the keypad

    uint8_t idx = keyPad.getKey();
    char key = v[idx];
    input = "";

    // navigate through the menu options
    if (key == 'A')
    {
      // move the selection up
      selection--;
      if (selection < 0)
      {
        selection = numOptions - 1;
      }
    }
    else if (key == 'B')
    {
      // move the selection down
      selection++;
      if (selection >= numOptions)
      {
        selection = 0;
      }
    }

    // display the menu options
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("SET-A   SELECT-D");

    lcd.setCursor(0, 1);
    for (int i = 0; i < numOptions; i++)
    {
      if (i == selection)
      {
        lcd.print(">1.PIN  2.FINGER");
      }
      else
      {
        lcd.print(" 1.PIN >2.FINGER");
      }
    }

    // handle the selected option

    if (key == 'D')
    {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("BACK-C|");
      switch (selection)
      {
      case 0:
        lcd.print("ENTER PIN");
        lcd.setCursor(0, 1);
        key = v[keyPad.getKey()];
        while (key != 'C')
        {

          uint32_t now = millis();

          if (now - lastKeyPressed >= 100)
          {
            lastKeyPressed = now;

            if (key && lastKey != key)
            {
              lastKey = key;
              lcd.setCursor(0, 1);
              Serial.print(key + '\n');
              if (key == 35)
              {
                Serial.print("Hash Occured\n");
                input = "";
                // lcd.print(input);
                lcd.print("                ");
              }
              else if (key == 42)
              {
                input = input.substring(0, input.length() - 1);
                Serial.print("Star Occured\n");
                lcd.print(input);
                lcd.print("                ");
                lcd.setCursor(input.length(), 1);
              }
              else
              {
                Serial.print("Number Occured\n");
                if (key != 'N' && key != 'A' && key != 'B' && key != 'D')
                  input += key;

                lcd.print(input);
              }
              if (input == pin)
              {
                // lcd.clear();
                lcd.print("Correct PIN");
                input = "NULL";
              }
            }
          }

          key = v[keyPad.getKey()];
        }

        break;
      case 1:
        lcd.print("PUT THUMB");
        lcd.setCursor(0, 1);
        // lcd.print("2");
        while (key != 'C')
        {
          getFingerprintID();
          key = v[keyPad.getKey()];
        }

        while (key != 'C')
        {
          key = v[keyPad.getKey()];
        }
        break;
      }

      key = v[keyPad.getKey()];
      while (key != 'C')
      {
        key = v[keyPad.getKey()];
      }
    }

    // add a delay to prevent key debouncing
    delay(200);
    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    sendDataPrevMillis = millis();
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    Serial.println("State when in the use menu:" + state);
    while (suc != 1)
    {
      // suc = 0;
      firebaseSetup();

      suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
      state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      sendDataPrevMillis = millis();

      Serial.println("State when in the use menu:" + state);
    }
  }
}

void unlockOp()
{
  // int e = componentcheck();
  // if (e)
  // {
  //   if (e == 1)
  //   {
  //     digitalWrite(ER, HIGH);
  //     lcd.clear();
  //     lcd.print("WIFI ERROR");
  //   }
  //   else if (e == 2)
  //   {
  //     digitalWrite(ER, HIGH);
  //     lcd.clear();
  //     lcd.print("KEYPAD ERROR");
  //   }
  //   else if (e == 4)
  //   {
  //     digitalWrite(ER, HIGH);
  //     lcd.clear();
  //     lcd.print("F. ERROR");
  //   }
  //   else
  //   {
  //     digitalWrite(ER, HIGH);
  //     lcd.clear();
  //     lcd.print("Multiple ERRORS");
  //   }
  //   delay(2000);
  //   e = componentcheck();
  // }
  int suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
  sendDataPrevMillis = millis();
  state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
  Serial.println("State when in the open menu:" + state);
  while (suc != 1)
  {
    // suc = 0;
    firebaseSetup();

    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    sendDataPrevMillis = millis();

    Serial.println("State when in the open menu:" + state);
  }
  // while (state != "1")
  // {
  lcd.clear();
  lcd.print("ENTER PIN");
  lcd.setCursor(0, 1);
  key = v[keyPad.getKey()];
  String input = "";
  while (key != 'C')
  {

    // Serial.println(pin);
    uint32_t now = millis();

    if (now - lastKeyPressed >= 100)
    {
      lastKeyPressed = now;

      if (key && lastKey != key)
      {
        lastKey = key;
        lcd.setCursor(0, 1);
        // Serial.print(key + '\n');
        if (key == 35)
        {
          // Serial.print("Hash Occured\n");
          input = "";
          // lcd.print(input);
          lcd.print("                ");
        }
        else if (key == 42)
        {
          input = input.substring(0, input.length() - 1);
          // Serial.print("Star Occured\n");
          lcd.print(input);
          lcd.print("                ");
          lcd.setCursor(input.length(), 1);
        }
        else
        {
          // Serial.print("Number Occured\n");
          if (key != 'N' && key != 'A' && key != 'B' && key != 'D')
            input += key;

          lcd.print(input);
        }
        if (input == pin)
        {
          Serial.print(input);
          Serial.print(pin);
          lcd.clear();
          lcd.print("Correct PIN");
          input = "NULL";
          delay(3000);
          val = 0;
          if (getFingerprintEnroll() == 1)
          {
            lcd.clear();
            lcd.print("FINGER STORED");
            return;
          }
        }
      }
    }

    key = v[keyPad.getKey()];
  }
  // e = componentcheck();
  // }
  // }
}

void doorUnlock(int pin)
{
  digitalWrite(pin, LOW);
}

void doorLock(int pin)
{
  digitalWrite(pin, HIGH);
}

int menu()
{

  int suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
  sendDataPrevMillis = millis();
  state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
  Serial.println("State when in the open menu:" + state);
  while (suc != 1)
  {
    // suc = 0;
    firebaseSetup();

    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    sendDataPrevMillis = millis();

    Serial.println("State when in the open menu:" + state);
  }
  while (state != "1")
  { // loop to check wether user unlock from the mobile phone
    // menu option
    // read input from the keypad

    uint8_t idx = keyPad.getKey();
    char key = v[idx];
    input = "";

    // navigate through the menu options
    if (key == 'A')
    {
      // move the selection up
      selection--;
      if (selection < 0)
      {
        selection = numOptions - 1;
      }
    }
    else if (key == 'B')
    {
      // move the selection down
      selection++;
      if (selection >= numOptions)
      {
        selection = 0;
      }
    }

    // display the menu options
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("SET-A   SELECT-D");

    lcd.setCursor(0, 1);
    for (int i = 0; i < numOptions; i++)
    {
      if (i == selection)
      {
        lcd.print(">1.PIN  2.FINGER");
      }
      else
      {
        lcd.print(" 1.PIN >2.FINGER");
      }
    }

    // handle the selected option

    if (key == 'D')
    {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("BACK-C|");
      switch (selection)
      {
      case 0:
        lcd.print("ENTER PIN");
        lcd.setCursor(0, 1);
        key = v[keyPad.getKey()];
        while (key != 'C')
        {

          uint32_t now = millis();

          if (now - lastKeyPressed >= 100)
          {
            lastKeyPressed = now;

            if (key && lastKey != key)
            {
              lastKey = key;
              lcd.setCursor(0, 1);
              Serial.print(key + '\n');
              if (key == 35)
              {
                Serial.print("Hash Occured\n");
                input = "";
                // lcd.print(input);
                lcd.print("                ");
              }
              else if (key == 42)
              {
                input = input.substring(0, input.length() - 1);
                Serial.print("Star Occured\n");
                lcd.print(input);
                lcd.print("                ");
                lcd.setCursor(input.length(), 1);
              }
              else
              {
                Serial.print("Number Occured\n");
                if (key != 'N' && key != 'A' && key != 'B' && key != 'D')
                  input += key;

                lcd.print(input);
              }
              if (input == pin)
              {
                // lcd.clear();
                lcd.print("Correct PIN");
                input = "NULL";
                return 1;
              }
            }
          }

          key = v[keyPad.getKey()];
        }

        break;
      case 1:
        lcd.print("PUT THUMB");
        lcd.setCursor(0, 1);
        // lcd.print("2");
        while (key != 'C')
        {
          int fID = getFingerprintID();
          if (fID == 10)
            return 1;
          key = v[keyPad.getKey()];
        }

        while (key != 'C')
        {
          key = v[keyPad.getKey()];
        }
        break;
      }

      key = v[keyPad.getKey()];
      while (key != 'C')
      {
        key = v[keyPad.getKey()];
      }
    }

    // add a delay to prevent key debouncing
    delay(200);
    suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
    sendDataPrevMillis = millis();
    state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    Serial.println("State when in the open menu:" + state);
    while (suc != 1)
    {
      // suc = 0;
      firebaseSetup();

      suc = Firebase.RTDB.getString(&fbdo, bookStatePath);
      state = suc ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
      sendDataPrevMillis = millis();

      Serial.println("State when in the open menu:" + state);
    }
  }
  if (state == "1")
  {
    return 0;
  }

  return 1; // unlocked from  a mobile phone
}

uint8_t getFingerprintEnroll()
{

  key = v[keyPad.getKey()];

  while (key != 'C')
  {
    int p = -1;
    lcd.clear();
    lcd.print("Waiting for finger ");
    lcd.print(10);
    while (p != FINGERPRINT_OK)
    {
      p = finger.getImage();
      switch (p)
      {
      case FINGERPRINT_OK:
        lcd.clear();
        lcd.print("Image taken");
        break;
      case FINGERPRINT_NOFINGER:
        lcd.clear();
        lcd.print("NO FINGER");
        key = v[keyPad.getKey()];
        if (key == 'C')
          return 2;
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
    switch (p)
    {
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
    while (p != FINGERPRINT_NOFINGER)
    {
      p = finger.getImage();
    }
    lcd.clear();
    lcd.print("ID ");
    lcd.print(10);
    p = -1;
    lcd.clear();
    lcd.print("Place same finger again");
    while (p != FINGERPRINT_OK)
    {
      p = finger.getImage();
      switch (p)
      {
      case FINGERPRINT_OK:
        lcd.clear();
        lcd.print("Image taken");
        break;
      case FINGERPRINT_NOFINGER:
        lcd.clear();
        lcd.print("NO FINGER");
        key = v[keyPad.getKey()];
        if (key == 'C')
          return 2;

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
    switch (p)
    {
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
    lcd.print("Creating model for #");
    lcd.print(10);

    p = finger.createModel();
    if (p == FINGERPRINT_OK)
    {
      lcd.clear();
      lcd.print("Prints matched!");
    }
    else if (p == FINGERPRINT_PACKETRECIEVEERR)
    {
      lcd.clear();
      lcd.print("Communication error");
      getFingerprintEnroll();
      // return p;
    }
    else if (p == FINGERPRINT_ENROLLMISMATCH)
    {
      lcd.clear();
      lcd.print("Fingerprints did not match");
      getFingerprintEnroll();
      // return p;
    }
    else
    {
      lcd.clear();
      lcd.print("Unknown error");
      getFingerprintEnroll();
      // return p;
    }

    lcd.clear();
    lcd.print("ID ");
    lcd.print(10);
    p = finger.storeModel(10);
    if (p == FINGERPRINT_OK)
    {
      lcd.clear();
      lcd.print("Stored!");
      val = 1;
      return 1;
    }
    else if (p == FINGERPRINT_PACKETRECIEVEERR)
    {
      lcd.clear();
      lcd.print("Communication error");
      return p;
    }
    else if (p == FINGERPRINT_BADLOCATION)
    {
      lcd.clear();
      lcd.print("Could not store in that location");
      return p;
    }
    else if (p == FINGERPRINT_FLASHERR)
    {
      lcd.clear();
      lcd.print("Error writing to flash");
      return p;
    }
    else
    {
      lcd.print("Unknown error");
      lcd.clear();
      return p;
    }

    key = v[keyPad.getKey()];
  }
  return val;
}

void sonarSensor(int trig, int echo)
{ // function to get the distance value from the sensor
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  duration = pulseIn(echo, HIGH);
  inches = duration / 74 / 2;
}

int objCheck()
{ // function to check whether goods are in the locker
  sonarSensor(trig1, echo1);
  sensor1 = inches;
  delay(200);
  // sonarSensor(trig2, echo2);
  // sensor2 = inches;

  if (sensor1 < 12)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

void buzzerTone(int state)
{
  if (state == 1)
  {
    digitalWrite(led, LOW);     // Turn on the built in led
    digitalWrite(buzzer, HIGH); // Turn on active buzzer
    delay(200);

    digitalWrite(led, HIGH);   // Turn off the built in led
    digitalWrite(buzzer, LOW); // Turn off active buzzer
    delay(200);
  }
}