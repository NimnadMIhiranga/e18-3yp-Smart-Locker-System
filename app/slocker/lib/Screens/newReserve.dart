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
  String locationKey;
  _newReserveState(this.locationKey);

  TextEditingController _controller = TextEditingController();

  // ignore: prefer_interpolation_to_compose_strings

  @override
  Widget build(BuildContext context) {
    String a = "Lockers/" + locationKey;
    DatabaseReference locations = FirebaseDatabase.instance.ref(a);
    DatabaseReference bookings = FirebaseDatabase.instance
        .ref("Bookings/" + FirebaseAuth.instance.currentUser!.uid)
        .push();

    locations.orderByChild("State").equalTo("1");
    // ignore: unused_local_variable

    // Query query =
    //     reference.child("questions").orderByChild("from").equalTo("this");

    return Scaffold(
        appBar: AppBar(
          title: Text(a),
          backgroundColor: mPrimaryColor,
        ),
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
                      return InkWell(
                        onTap: () {
                          showInputDialog(snapshot, locations, bookings);
                          // Navigator.push(
                          //     context,
                          //     MaterialPageRoute(
                          //         builder: (context) => Loading()));
                        },
                        child: ListTile(
                          title: Text("Locker Number: " +
                              snapshot.child('LockID').value.toString()),
                        ),
                      );
                    })))
          ],
        ));
  }

  final textController = TextEditingController();

  void showInputDialog(
      DataSnapshot snapshot, DatabaseReference locations, bookings) {
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
          'State': '0',
          'Pin': value,
          'UID': FirebaseAuth.instance.currentUser!.uid
        });
        bookings.set({
          //'UID': FirebaseAuth.instance.currentUser!.uid,
          'BookingDate': "13/1/2023",
          'BookingTime': "17:12:59",
          'LocationName': "Akbar",
          'LockID': "1",
          'State': "1"
        });
        // Do something with the value entered by the user
      }
    });
  }
}
