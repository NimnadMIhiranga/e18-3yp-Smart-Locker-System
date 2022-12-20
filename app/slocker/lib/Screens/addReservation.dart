import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:sizer/sizer.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:slocker/Screens/pass_reset.dart';
import 'package:slocker/Screens/signup_screen.dart';
import 'package:slocker/Screens/verifyemail.dart';
import 'package:slocker/net/auth.dart';
import 'package:slocker/reusable.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import '../constants.dart';

class addReservation extends StatefulWidget {
  final String locationName;
  final String locationID;
  const addReservation(this.locationName, this.locationID, {Key? key})
      : super(key: key);

  @override
  State<addReservation> createState() =>
      _addReservationState(locationName, locationID);
}

class _addReservationState extends State<addReservation> {
  String locationName;
  String locationID;
  _addReservationState(this.locationName, this.locationID);

  String? selectedItem;
  DateTime sdate =
      DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
  TimeOfDay time = TimeOfDay(hour: 10, minute: 30);
  //GlobalKey<FormState> formKey = GlobalKey<FormState>();
  //late String _username,_password;

  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _timeController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final hours = time.hour.toString().padLeft(2, '0');
    final minutes = time.minute.toString().padLeft(2, '0');

    return Form(
      child: Scaffold(
        //key: formKey,
        body: Container(
          height: double.infinity,
          width: double.infinity,
          child: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                  20,
                  MediaQuery.of(context).size.height * 0.1,
                  20,
                  MediaQuery.of(context).size.height * 0.1),
              child: Column(
                children: <Widget>[
                  Text(
                    "Add Reservation".tr,
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 30,
                        color: mPrimaryColor),
                  ),
                  const SizedBox(height: 40),
                  Image.asset(
                    "assets/images/reservations.png",
                    fit: BoxFit.fitWidth,
                    width: 300,
                    height: 300,
                    //color: Colors.purple,
                  ),
                  const SizedBox(
                    height: 50,
                  ),
                  // reusableTextField("Text".tr, Icons.house, false,
                  //     _NameController, null),

// time time time
                  Row(
                    //mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6.0, vertical: 15.0),
                          child: reusableTextField3(
                              sdate.toString().substring(0, 10),
                              Icons.date_range,
                              false,
                              _startDateController,
                              null,
                              false),
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6.0, vertical: 15.0),
                          child: ElevatedButton(
                            onPressed: () async {
                              DateTime? ndate = await showDatePicker(
                                context: context,
                                initialDate: sdate,
                                firstDate: DateTime.now(),
                                lastDate: DateTime.now().add(Duration(days: 3)),
                                builder: (context, child) {
                                  return Theme(
                                    data: Theme.of(context).copyWith(
                                      colorScheme: ColorScheme.light(
                                        primary: mNewColor,
                                        onPrimary: Colors.white, // <-- SEE HERE
                                        onSurface: mSecondColor, // <-- SEE HERE
                                      ),
                                      textButtonTheme: TextButtonThemeData(
                                        style: TextButton.styleFrom(
                                          primary:
                                              mPrimaryColor, // button text color
                                        ),
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (ndate == null) return;
                              setState(() => sdate = ndate);
                            },
                            style: ElevatedButton.styleFrom(
                              fixedSize: const Size(180, 50),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(30.0),
                                  side: BorderSide(
                                    width: 2.0,
                                    color: mPrimaryColor,
                                  )),
                              primary: mBackgroundColor,
                              elevation: 20,
                              shadowColor: Colors.transparent,
                              textStyle: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            child: Text(
                              "Set Date".tr,
                              style: TextStyle(color: Colors.black38),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Row(
                    //mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6.0, vertical: 15.0),
                          child: reusableTextField3('$hours:$minutes',
                              Icons.watch, false, _timeController, null, false),
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6.0, vertical: 15.0),
                          child: ElevatedButton(
                            onPressed: () async {
                              TimeOfDay? nTime = await showTimePicker(
                                context: context,
                                initialTime: time,
                                builder: (context, child) {
                                  return Theme(
                                    data: Theme.of(context).copyWith(
                                      colorScheme: ColorScheme.light(
                                        primary: mNewColor,
                                        onPrimary: Colors.white, // <-- SEE HERE
                                        onSurface: mSecondColor, // <-- SEE HERE
                                      ),
                                      textButtonTheme: TextButtonThemeData(
                                        style: TextButton.styleFrom(
                                          primary:
                                              mPrimaryColor, // button text color
                                        ),
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (nTime == null) return;
                              setState(() => time = nTime);
                            },
                            style: ElevatedButton.styleFrom(
                              fixedSize: const Size(180, 50),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(30.0),
                                  side: BorderSide(
                                    width: 2.0,
                                    color: mPrimaryColor,
                                  )),
                              primary: mBackgroundColor,
                              elevation: 20,
                              shadowColor: Colors.transparent,
                              textStyle: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            child: Text(
                              "Set Time".tr,
                              style: TextStyle(color: Colors.black38),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  Container(
                    width: MediaQuery.of(context).size.width,
                    height: 50,
                    margin: const EdgeInsets.fromLTRB(0, 10, 0, 20),
                    decoration:
                        BoxDecoration(borderRadius: BorderRadius.circular(90)),
                    child: ElevatedButton(
                      onPressed: () async {
                        await addReservation(
                                locationID,
                                sdate.toString().substring(0, 10),
                                '$hours:$minutes')
                            .then((value) {
                          Fluttertoast.showToast(
                              msg: 'Reservation Added',
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              timeInSecForIosWeb: 1,
                              backgroundColor: mSecondColor,
                              textColor: Colors.black);

                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => Loading()));
                        });
                        //Navigator.of(context).pop();
                      },
                      child: Text(
                        "Reserve".tr,
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16),
                      ),
                      style: ButtonStyle(
                          backgroundColor:
                              MaterialStateProperty.resolveWith((states) {
                            if (states.contains(MaterialState.pressed)) {
                              return Colors.white;
                            }
                            return mPrimaryColor;
                          }),
                          shape:
                              MaterialStateProperty.all<RoundedRectangleBorder>(
                                  RoundedRectangleBorder(
                                      borderRadius:
                                          BorderRadius.circular(30)))),
                    ),
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  const SizedBox(
                    height: 300,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

//database functions for farms registration
  Future<bool> addReservation(String Location, String Date, String Time) async {
    try {
      String uid = FirebaseAuth.instance.currentUser!.uid;

      DocumentReference<Map<String, dynamic>> documentReference =
          FirebaseFirestore.instance.collection('Reservations').doc();
      FirebaseFirestore.instance.runTransaction((transaction) async {
        DocumentSnapshot<Map<String, dynamic>> snapshot =
            await transaction.get(documentReference);
        if (!snapshot.exists) {
          documentReference.set({
            'Location': Location,
            'Date': Date,
            'Time': Time,
            'UID': uid,
            'Status': "ongoing"
          });
          return true;
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
