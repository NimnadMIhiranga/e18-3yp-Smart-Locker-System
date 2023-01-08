import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_database/ui/firebase_animated_list.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:sizer/sizer.dart';
import 'package:slocker/Screens/addReservation.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:slocker/Screens/newReserve.dart';
import 'package:slocker/Screens/pass_reset.dart';
import 'package:slocker/Screens/signup_screen.dart';
import 'package:slocker/Screens/verifyemail.dart';
import 'package:slocker/net/auth.dart';
import 'package:slocker/reusable.dart';

import '../constants.dart';

class LocationView extends StatefulWidget {
  LocationView({Key? key}) : super(key: key);

  @override
  _LocationViewState createState() => _LocationViewState();
}

class _LocationViewState extends State<LocationView> {
  TextEditingController _controller = TextEditingController();

  DatabaseReference locations = FirebaseDatabase.instance.ref("Lockers");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Select Location".tr),
          backgroundColor: mPrimaryColor,

          // this button is for developing purpose only
          // actions: <Widget>[
          //   IconButton(
          //     icon: Icon(Icons.language),
          //     onPressed: () {
          //       builddialog(context);
          //     },
          //   ),
          //   IconButton(
          //     icon: Icon(Icons.home),
          //     onPressed: () {
          //       Navigator.of(context).push(
          //           MaterialPageRoute(builder: (context) => SelectionScreen()));
          //     },
          //   ),
          // ]
        ),
        body: Column(
          children: [
            Expanded(
                child: FirebaseAnimatedList(
                    query: locations,
                    itemBuilder: ((context, snapshot, animation, index) {
                      return InkWell(
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      newReserve(snapshot.key!)));
                          // .child('Name')
                          // .value
                          // .toString())));
                        },
                        child: ListTile(
                          title: Text(snapshot.key!),
                          //title: Text(snapshot.child('Name').value.toString()),
                        ),
                      );
                    })))
          ],
        ) // body: Container(
        //   decoration: BoxDecoration(
        //     color: Colors.white,
        //   ),
        //   height: MediaQuery.of(context).size.height,
        //   width: MediaQuery.of(context).size.width,
        //   child: Center(
        //     child: StreamBuilder(
        //         stream: FirebaseFirestore.instance
        //             .collection('Locations')
        //             .snapshots(),
        //         builder: (BuildContext context,
        //             AsyncSnapshot<QuerySnapshot> snapshot) {
        //           if (!snapshot.hasData) {
        //             return Center(
        //               child: CircularProgressIndicator(),
        //             );
        //           }

        //           return ListView(
        //             children: snapshot.data!.docs.map((document) {
        //               return GestureDetector(
        //                   onTap: () {
        //                     Navigator.push(
        //                       context,
        //                       MaterialPageRoute(
        //                           builder: (context) => addReservation(
        //                               document['Name'], document.id)),
        //                     );
        //                   },
        //                   child: Padding(
        //                     padding: const EdgeInsets.only(
        //                         top: 20.0, left: 25.0, right: 25),
        //                     child: Container(
        //                       decoration: BoxDecoration(
        //                         color: Colors.white,
        //                         borderRadius: BorderRadius.circular(14.5),
        //                         boxShadow: const [
        //                           BoxShadow(
        //                               offset: Offset(5, 10),
        //                               color: Colors.grey,
        //                               spreadRadius: 2,
        //                               blurRadius: 5),
        //                         ],
        //                       ),
        //                       child: Padding(
        //                           padding:
        //                               EdgeInsets.only(top: 0, left: 0, right: 0),
        //                           child: Container(
        //                               height:
        //                                   MediaQuery.of(context).size.height / 12,
        //                               decoration: BoxDecoration(
        //                                 borderRadius: BorderRadius.circular(14.5),
        //                                 color: mSecondColor,
        //                               ),
        //                               child: Row(
        //                                 mainAxisAlignment:
        //                                     MainAxisAlignment.center,
        //                                 children: [
        //                                   Text(
        //                                     " ${document['Name']}",
        //                                     style: TextStyle(
        //                                       color: Colors.white,
        //                                       fontSize: 18,
        //                                     ),
        //                                   ),
        //                                 ],
        //                               ))),
        //                     ),
        //                   ));
        //             }).toList(),
        //           );
        //         }),
        //   ),
        // ),
        );
  }
}
