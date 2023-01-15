import 'dart:io';

import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_database/ui/firebase_animated_list.dart';
import 'package:flutter/material.dart';
import 'package:slocker/Screens/locationView.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:slocker/Screens/signin_screen.dart';
import 'package:slocker/net/auth.dart';
import '../constants.dart';

class Loading extends StatefulWidget {
  Loading({Key? key}) : super(key: key);

  @override
  _ItemViewState createState() => _ItemViewState();
}

class _ItemViewState extends State<Loading> {
  @override
  Widget build(BuildContext context) {
    //final TextEditingController _controller = TextEditingController();
    AuthClass auth = AuthClass();

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text('S - Locker'),
          automaticallyImplyLeading: false,
          actions: <Widget>[
            // IconButton(
            //   icon: Icon(Icons.notifications),
            //   onPressed: () {},
            // ),
            Padding(
              padding: EdgeInsets.only(right: 20.0),
              child: GestureDetector(
                onTap: () {},
                child: Icon(
                  Icons.notifications,
                  size: 26.0,
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.only(right: 20.0),
              child: GestureDetector(
                onTap: () async {
                  await auth.logout();
                  Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (builder) => SignInScreen()),
                      (route) => false);
                },
                child: Icon(
                  Icons.logout,
                  size: 26.0,
                ),
              ),
            ),
          ],
          bottom: const TabBar(
            tabs: [
              Tab(
                icon: Icon(Icons.list),
                text: "Reservations",
              ),
              Tab(
                icon: Icon(Icons.history),
                text: "History",
              ),
              Tab(
                icon: Icon(Icons.settings),
                text: "Settings",
              ),
            ],
          ),
          elevation: 10.0,
          backgroundColor: Color(0xFF6892c9),
        ),
        body: TabBarView(
          children: [
            tab1(context),
            tab2(),
            tab3(),
          ],
        ),
      ),
    );
  }
}

Widget tab1(BuildContext context) {
  //final TextEditingController _controller = TextEditingController();
  // Future openDialog(String id, String Date, BuildContext context) => showDialog(
  //       context: context,
  //       builder: (context) => AlertDialog(
  //         title: Text("Edit Reservation Date"),
  //         content: TextField(
  //           controller: _controller,
  //           autofocus: true,
  //           decoration: InputDecoration(hintText: Date),
  //         ),
  //         actions: [
  //           TextButton(
  //               onPressed: () async {
  //                 //_controller.text = location;
  //                 //  await updateReservation(id, _controller.text);
  //                 //  _controller.clear();
  //                 // ignore: use_build_context_synchronously
  //                 Navigator.of(context).pop();
  //               },
  //               child: Text("Change"))
  //         ],
  //       ),
  //     );
  DatabaseReference locations = FirebaseDatabase.instance.ref("Bookings");
  DatabaseReference lockers = FirebaseDatabase.instance.ref("Lockers");

  return Scaffold(
    body: Column(
      children: [
        SizedBox(
          height: 10,
        ),
        Text(
          "Reservations",
          style: TextStyle(
            fontSize: 16,
            color: Colors.blue,
            fontWeight: FontWeight.bold,
            //decoration: TextDecoration.underline,
          ),
        ),
        Expanded(
            child: FirebaseAnimatedList(
                query: locations
                    .child(FirebaseAuth.instance.currentUser!.uid)
                    //.orderByChild('UID')
                    //.equalTo(FirebaseAuth.instance.currentUser!.uid)
                    .orderByChild('State')
                    .equalTo('3'),
                itemBuilder: ((context, snapshot, animation, index) {
                  return Padding(
                    padding:
                        const EdgeInsets.only(top: 20.0, left: 25.0, right: 25),
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
                            // onTap: () {

                            // },
                            child: PopupMenuButton(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8)),
                          offset: Offset(1, 30),
                          onSelected: (value) => _onPopupMenuSelected(
                              value,
                              snapshot.key!,
                              snapshot.child('LocationName').value.toString(),
                              snapshot.child('LockID').value.toString()),
                          itemBuilder: (context) => [
                            PopupMenuItem(
                              child: Row(
                                children: <Widget>[
                                  Icon(Icons.lock),
                                  SizedBox(width: 8.0),
                                  Text('Lock'),
                                ],
                              ),
                              value: 'Menu 1',
                            ),
                            PopupMenuItem(
                              child: Row(
                                children: <Widget>[
                                  Icon(Icons.key),
                                  SizedBox(width: 8.0),
                                  Text('Unlock'),
                                ],
                              ),
                              value: 'Menu 2',
                            ),

                            // PopupMenuItem(value: 'Menu 1', child: Text('Lock')),
                            // PopupMenuItem(
                            //     value: 'Menu 2', child: Text('Unlock')),
                            // PopupMenuItem(
                            //     value: 'Menu 3', child: Text('Menu 3')),
                          ],

                          //padding: EdgeInsets.all(8),
                          child: ListTile(
                            title: Center(
                              child: Text(
                                "Time: " +
                                    snapshot
                                        .child('BookingTime')
                                        .value
                                        .toString()
                                        .substring(0, 5) +
                                    "  Place: " +
                                    snapshot
                                        .child('LocationName')
                                        .value
                                        .toString() +
                                    "  Locker: " +
                                    snapshot.child('LockID').value.toString(),
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black,
                                  fontWeight: FontWeight.bold,
                                  //decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ),
                        )

                            //child:
                            )),
                  );
                }))),
        SizedBox(
          height: 10,
        ),
        Text(
          "Upcomming Reservations",
          style: TextStyle(
            fontSize: 16,
            color: Colors.blue,
            fontWeight: FontWeight.bold,
            //decoration: TextDecoration.underline,
          ),
        ),
        Expanded(
            child: FirebaseAnimatedList(
                query: locations
                    .child(FirebaseAuth.instance.currentUser!.uid)
                    //.orderByChild('UID')
                    //.equalTo(FirebaseAuth.instance.currentUser!.uid)
                    .orderByChild('State')
                    .equalTo('1'),
                itemBuilder: ((context, snapshot, animation, index) {
                  return Padding(
                    padding:
                        const EdgeInsets.only(top: 20.0, left: 25.0, right: 25),
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
                          // onTap: () {

                          // },

                          //padding: EdgeInsets.all(8),
                          child: ListTile(
                            title: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  "Time: " +
                                      snapshot
                                          .child('BookingTime')
                                          .value
                                          .toString()
                                          .substring(0, 5) +
                                      "  Place: " +
                                      snapshot
                                          .child('LocationName')
                                          .value
                                          .toString() +
                                      "  Locker: " +
                                      snapshot.child('LockID').value.toString(),
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                    //decoration: TextDecoration.underline,
                                  ),
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                IconButton(
                                    icon: Icon(Icons.cancel),
                                    onPressed: () {
                                      openDialogDelete(snapshot, context,
                                          lockers, locations);
                                      print("Button pressed");
                                    })
                              ],
                            ),
                          ),
                        )),
                  );
                }))),
      ],
    )

    //
    ,
    floatingActionButton: FloatingActionButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LocationView(),
          ),
        );
      },
      child: const Icon(Icons.add),
    ),
  );
}

void _onPopupMenuSelected(
    String value, String key, String locatinName, String lockID) {
  DatabaseReference bookings = FirebaseDatabase.instance
      .ref("Bookings/" + FirebaseAuth.instance.currentUser!.uid + "/" + key);
  DatabaseReference lockers =
      FirebaseDatabase.instance.ref("Lockers/" + locatinName + "/" + lockID);
  //print(value);
  stderr.writeln("debugshamma: " + lockers.toString());

  if (value == 'Menu 1') {
    // bookings.set({
    //   //'UID': FirebaseAuth.instance.currentUser!.uid,

    //   'State': "1"
    // });
    lockers.update({
      //'UID': FirebaseAuth.instance.currentUser!.uid,

      'LockState': "1"
    });
    //call function 1
  } else if (value == 'Menu 2') {
    lockers.update({
      //'UID': FirebaseAuth.instance.currentUser!.uid,

      'LockState': "0"
    });
    //call function 2
  }
  // else if (value == 'Menu 3') {
  //   //call function 3
  // }
}

Future openDialogDelete(DataSnapshot snapshot, BuildContext context,
        DatabaseReference lockers, DatabaseReference bookings) =>
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Want to cancel reservation at " +
            snapshot.child('BookingTime').value.toString().substring(0, 5) +
            " ?"),
        actions: [
          TextButton(
              onPressed: () async {
                // delete function here
                //removeReservation(id);
                lockers
                    .child(snapshot.child('LocationName').value.toString() +
                        "/" +
                        snapshot.child('LockID').value.toString())
                    .update({
                  'BookingDate': "",
                  'BookingID': "",
                  'BookingTime': "",
                  'In': '1',
                  //'LockID': snapshot.key,
                  'State': '1',
                  'LockPin': "",
                  'LockState': '1',
                  'UID': ""
                });
                bookings
                    .child(FirebaseAuth.instance.currentUser!.uid +
                        "/" +
                        snapshot.key.toString())
                    .update({'State': "2"});
                Navigator.of(context).pop();
              },
              child: Text(
                "Yes",
                style: TextStyle(color: Colors.red),
              )),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
            },
            child: Text(
              "No",
              style: TextStyle(color: Colors.green),
            ),
          )
        ],
      ),
    );

Widget tab3() {
  return Container(
    child: Center(
      child: ListView(
        children: <Widget>[
          ListTile(
            title: Text('Profile'),
            leading: Icon(Icons.person),
            onTap: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => ProfileScreen()),
              // );
            },
          ),
          ListTile(
            title: Text('Account'),
            leading: Icon(Icons.account_box),
            onTap: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => AccountScreen()),
              // );
            },
          ),
          ListTile(
            title: Text('Security'),
            leading: Icon(Icons.security),
            onTap: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => SecurityScreen()),
              // );
            },
          ),
          ListTile(
            title: Text('Display'),
            leading: Icon(Icons.display_settings),
            onTap: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => DisplayScreen()),
              // );
            },
          ),
          ListTile(
            title: Text('Language'),
            leading: Icon(Icons.language),
            onTap: () {
              // Navigator.push(
              //   context,
              //   MaterialPageRoute(builder: (context) => LanguageScreen()),
              // );
            },
          ),
        ],
      ),
    ),
  );
}

Widget tab2() {
  DatabaseReference locations = FirebaseDatabase.instance.ref("Bookings");
  return Scaffold(
      body:
          // body: Column(
          //   //mainAxisAlignment: MainAxisAlignment.center,
          //   children: <Widget>[
          //     StreamBuilder(
          //         stream: FirebaseFirestore.instance
          //             .collection('Reservations')
          //             .where('UID', isEqualTo: FirebaseAuth.instance.currentUser!.uid)
          //             .where('Status', isEqualTo: "canceled")
          //             .snapshots(),
          //         builder:
          //             (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
          //           if (!snapshot.hasData) {
          //             return Center(
          //               child: CircularProgressIndicator(),
          //             );
          //           }

          //           return ListView(
          //             scrollDirection: Axis.vertical,
          //             shrinkWrap: true,
          //             children: snapshot.data!.docs.map((document) {
          //               return GestureDetector(
          //                   onTap: () {
          //                     // Navigator.push(
          //                     //   context,
          //                     //   MaterialPageRoute(
          //                     //       builder: (context) => screen(
          //                     //           document['Name'], document.id)),
          //                     // );
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
          //                                     MainAxisAlignment.spaceBetween,
          //                                 children: [
          //                                   SizedBox(),
          //                                   Text(
          //                                     " ${document['Date']}",
          //                                     style: TextStyle(
          //                                       color: Colors.white,
          //                                       fontSize: 18,
          //                                     ),
          //                                   ),
          //                                   Text(
          //                                     " ${document['Time']}",
          //                                     style: TextStyle(
          //                                       color: Colors.white,
          //                                       fontSize: 18,
          //                                     ),
          //                                   ),
          //                                   Text(
          //                                     " ${document['Status']}",
          //                                     style: TextStyle(
          //                                       color: Colors.white,
          //                                       fontSize: 18,
          //                                     ),
          //                                   ),
          //                                   SizedBox(),
          //                                 ],
          //                               ))),
          //                     ),
          //                   ));
          //             }).toList(),
          //           );
          //         }),

          //     // Text(
          //     //   '$_counter',
          //     //   style: Theme.of(context).textTheme.headline4,
          //     // ),
          //   ],
          // ),
          Column(
    children: [
      Expanded(
          child: FirebaseAnimatedList(
              query: locations
                  .child(FirebaseAuth.instance.currentUser!.uid)
                  //.orderByChild('UID')
                  //.equalTo(FirebaseAuth.instance.currentUser!.uid)
                  .orderByChild('State')
                  .equalTo('2'),
              itemBuilder: ((context, snapshot, animation, index) {
                return Padding(
                  padding:
                      const EdgeInsets.only(top: 20.0, left: 25.0, right: 25),
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
                          // showMenu(
                          //   context: context,
                          //   position: RelativeRect.fromLTRB(200, 200, 200, 200),
                          //   items: [
                          //     PopupMenuItem(child: Text('Menu 1')),
                          //     PopupMenuItem(child: Text('Menu 2')),
                          //     PopupMenuItem(child: Text('Menu 3')),
                          //   ],
                          // );
                        },
                        // onTap: () {
                        //   //showInputDialog(snapshot, locations);
                        //   // Navigator.push(
                        //   //     context,
                        //   //     MaterialPageRoute(
                        //   //         builder: (context) => Loading()));
                        // },
                        child: ListTile(
                          title: Text(
                            "Date: " +
                                snapshot.child('BookingDate').value.toString() +
                                "   Time: " +
                                snapshot
                                    .child('BookingTime')
                                    .value
                                    .toString()
                                    .substring(0, 5) +
                                "   Location: " +
                                snapshot
                                    .child('LocationName')
                                    .value
                                    .toString() +
                                "   Locker: " +
                                snapshot.child('LockID').value.toString(),
                            style: TextStyle(
                              fontSize: 15,
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              //decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      )),
                );
              })))
    ],
  ));
}

Future<bool> removeReservation(String id) async {
  // try {
  //   if (FirebaseAuth.instance.currentUser != null) {
  //     //String uid = FirebaseAuth.instance.currentUser!.uid;
  //     FirebaseFirestore.instance.collection('Reservations').doc(id).delete();
  //     return true;
  //   } else {
  //     throw ("This is my first general exception");
  //   }
  // } catch (e) {
  //   rethrow;
  // }
  try {
    // String uid = FirebaseAuth.instance.currentUser!.uid;

    DocumentReference<Map<String, dynamic>> documentReference =
        FirebaseFirestore.instance.collection('Reservations').doc(id);
    FirebaseFirestore.instance.runTransaction((transaction) async {
      DocumentSnapshot<Map<String, dynamic>> snapshot =
          await transaction.get(documentReference);

      try {
        //double newAmount = value;
        transaction.update(documentReference, {'Status': "canceled"});
        return true;
      } catch (e) {
        rethrow;
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}
