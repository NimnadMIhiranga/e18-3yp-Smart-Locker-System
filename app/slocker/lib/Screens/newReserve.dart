// ignore_for_file: prefer_interpolation_to_compose_strings

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_database/ui/firebase_animated_list.dart';
import 'package:flutter/material.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:cloud_firestore/cloud_firestore.dart' hide Query;

import '../constants.dart';

class newReserve extends StatefulWidget {
  final String locationKey;
  const newReserve(this.locationKey, {Key? key}) : super(key: key);

  @override
  State<newReserve> createState() => _newReserveState(locationKey);
}

class _newReserveState extends State<newReserve> {
  // TimeOfDay time =
  //     TimeOfDay(hour: DateTime.now().hour, minute: DateTime.now().minute);
  String locationKey;
  _newReserveState(this.locationKey);

  TextEditingController _controller = TextEditingController();

  // ignore: prefer_interpolation_to_compose_strings

  @override
  Widget build(BuildContext context) {
    String a = "Lockers/" + locationKey;
    DatabaseReference locations = FirebaseDatabase.instance.ref(a);

    locations.orderByChild("State").equalTo("1");
    // ignore: unused_local_variable

    // Query query =
    //     reference.child("questions").orderByChild("from").equalTo("this");

    return Scaffold(
        appBar: AppBar(
            title: Text("Lockers at " + locationKey),
            backgroundColor: mPrimaryColor,
            actions: <Widget>[
              // IconButton(
              //   icon: Icon(Icons.notifications),
              //   onPressed: () {},
              // ),
              Padding(
                padding: EdgeInsets.only(right: 20.0),
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => Loading()),
                    );
                  },
                  child: Icon(
                    Icons.home,
                    size: 26.0,
                  ),
                ),
              ),
            ]),
        //   body: FutureBuilder(
        //   future: _getData(),
        //   builder: (context, snapshot) {
        //     if (snapshot.connectionState == ConnectionState.done) {
        //       if (snapshot.hasError) {
        //         return Text('Error: ${snapshot.error}');
        //       } else {
        //         return snapshot.data;
        //       }
        //     } else {
        //       return Center(
        //         child: CircularProgressIndicator(),
        //       );
        //     }
        //   },
        // ),

        body: Column(
          children: [
            Expanded(
                child: FirebaseAnimatedList(
                    query: locations.orderByChild('State').equalTo('1'),
                    itemBuilder: ((context, snapshot, animation, index) {
                      return Padding(
                        padding: const EdgeInsets.only(
                            top: 20.0, left: 25.0, right: 25),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Color(0xFF6892c9),
                            borderRadius: BorderRadius.circular(14.5),
                            boxShadow: const [
                              BoxShadow(
                                  offset: Offset(5, 10),
                                  color: Colors.grey,
                                  spreadRadius: 2,
                                  blurRadius: 5),
                            ],
                          ),
                          child: InkWell(
                            onTap: () {
                              showInputDialog(snapshot, locations);
                              // Navigator.push(
                              //     context,
                              //     MaterialPageRoute(
                              //         builder: (context) => Loading()));
                            },
                            child: ListTile(
                              title: Text(
                                "Locker Number: " +
                                    snapshot.child('LockID').value.toString(),
                                style: TextStyle(
                                  fontSize: 15,
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                  //decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    })))
          ],
        ));
  }

  final textController = TextEditingController();

  void showInputDialog(
    DataSnapshot snapshot,
    DatabaseReference locations,
  ) {
    DateTime sdate =
        DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);

    final hours = DateTime.now().hour.toString().padLeft(2, '0');
    final minutes = DateTime.now().minute.toString().padLeft(2, '0');
    final seconds = DateTime.now().second.toString().padLeft(2, '0');
    DatabaseReference bookings = FirebaseDatabase.instance.ref("Bookings/" +
        FirebaseAuth.instance.currentUser!.uid +
        "/" +
        '$hours:$minutes:$seconds' +
        " " +
        sdate.toString().substring(0, 10));

    String BID =
        sdate.toString().substring(0, 10) + " " + '$hours:$minutes:$seconds';
    showDialog(
      context: context,
      builder: (context) {
        return SimpleDialog(
          title: Text("Enter a value"),
          children: [
            TextField(
              controller: textController,
            ),
            TextButton(
              onPressed: () async {
                Navigator.of(context).pop(textController.text);
              },
              child: Text(
                "Reserve",
                style: TextStyle(color: Colors.green),
              ),
            )
          ],
        );
      },
    ).then((value) {
      if (value != null) {
        locations.child(snapshot.child('LockID').value.toString()).update({
          'BookingDate': sdate.toString().substring(0, 10),
          'BookingID': BID,
          'BookinTime': '$hours:$minutes:$seconds',
          'In': '1',
          'LockID': snapshot.key,
          'State': '0',
          'LockPin': value,
          'LockState': '1',
          'UID': FirebaseAuth.instance.currentUser!.uid
        });
        bookings.set({
          //'UID': FirebaseAuth.instance.currentUser!.uid,
          'BookingDate': sdate.toString().substring(0, 10),
          'BookingTime': hours + ":" + minutes + ":" + seconds,
          'BookingID': BID,
          'LocationName': locationKey,
          'LockID': snapshot.key,
          'State': "1"
        });
        setState(() {});
        // Do something with the value entered by the user
      }
    });
  }
}
