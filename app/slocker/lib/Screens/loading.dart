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
          title: const Text('Hi, Shamod !'),
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

  return Scaffold(
    body: Column(
      //mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        StreamBuilder(
            stream: FirebaseFirestore.instance
                .collection('Reservations')
                .where('UID', isEqualTo: FirebaseAuth.instance.currentUser!.uid)
                .where('Status', isEqualTo: "ongoing")
                .snapshots(),
            builder:
                (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
              if (!snapshot.hasData) {
                return Center(
                  child: CircularProgressIndicator(),
                );
              }

              return ListView(
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                children: snapshot.data!.docs.map((document) {
                  return GestureDetector(
                      onTap: () {
                        // Navigator.push(
                        //   context,
                        //   MaterialPageRoute(
                        //       builder: (context) => screen(
                        //           document['Name'], document.id)),
                        // );
                      },
                      child: Padding(
                        padding: const EdgeInsets.only(
                            top: 20.0, left: 25.0, right: 25),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14.5),
                            boxShadow: const [
                              BoxShadow(
                                  offset: Offset(5, 10),
                                  color: Colors.grey,
                                  spreadRadius: 2,
                                  blurRadius: 5),
                            ],
                          ),
                          child: Padding(
                              padding:
                                  EdgeInsets.only(top: 0, left: 0, right: 0),
                              child: Container(
                                  height:
                                      MediaQuery.of(context).size.height / 12,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(14.5),
                                    color: mSecondColor,
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      SizedBox(),
                                      Text(
                                        " ${document['Date']}",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 18,
                                        ),
                                      ),
                                      Text(
                                        " ${document['Time']}",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 18,
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.cancel),
                                        //tooltip: 'Increase volume by 10',
                                        onPressed: () {
                                          openDialogDelete(
                                              document.id,
                                              document["Date"],
                                              document["Time"],
                                              context);
                                          // setState(() {

                                          // });
                                        },
                                      ),
                                      SizedBox()
                                      // PopupMenuButton<int>(
                                      //     itemBuilder: (context) => [
                                      //           // popupmenu item 1
                                      //           PopupMenuItem(
                                      //             value: 1,
                                      //             // row has two child icon and text.
                                      //             child: Row(
                                      //               children: [
                                      //                 Icon(Icons.edit),
                                      //                 SizedBox(
                                      //                   // sized box with width 10
                                      //                   width: 10,
                                      //                 ),
                                      //                 Text("Edit")
                                      //               ],
                                      //             ),
                                      //           ),
                                      //           // popupmenu item 2
                                      //           PopupMenuItem(
                                      //             value: 2,
                                      //             // row has two child icon and text
                                      //             child: Row(
                                      //               children: [
                                      //                 Icon(Icons.cancel),
                                      //                 SizedBox(
                                      //                   // sized box with width 10
                                      //                   width: 10,
                                      //                 ),
                                      //                 Text("Cancel")
                                      //               ],
                                      //             ),
                                      //           ),
                                      //         ],
                                      //     offset: Offset(-20, 15),
                                      //     color: mNewColor,
                                      //     elevation: 2,
                                      //     onSelected: (value) async {
                                      //       if (value == 1) {
                                      //         openDialog(
                                      //             document.id,
                                      //             document["Location"],
                                      //             context);
                                      //       } else if (value == 2) {
                                      //         openDialogDelete(
                                      //             document.id,
                                      //             document["Date"],
                                      //             document["Time"],
                                      //             context);
                                      //       }
                                      //     }),
                                    ],
                                  ))),
                        ),
                      ));
                }).toList(),
              );
            }),

        // Text(
        //   '$_counter',
        //   style: Theme.of(context).textTheme.headline4,
        // ),
      ],
    ),
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

Future openDialogDelete(
        String id, String date, String time, BuildContext context) =>
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
            "Want to cancel reservation on " + date + " at " + time + " ?"),
        actions: [
          TextButton(
              onPressed: () async {
                // delete function here
                removeReservation(id);
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
      child: Text("Settings"),
    ),
  );
}

Widget tab2() {
  return Scaffold(
    body: Column(
      //mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        StreamBuilder(
            stream: FirebaseFirestore.instance
                .collection('Reservations')
                .where('UID', isEqualTo: FirebaseAuth.instance.currentUser!.uid)
                .where('Status', isEqualTo: "canceled")
                .snapshots(),
            builder:
                (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
              if (!snapshot.hasData) {
                return Center(
                  child: CircularProgressIndicator(),
                );
              }

              return ListView(
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                children: snapshot.data!.docs.map((document) {
                  return GestureDetector(
                      onTap: () {
                        // Navigator.push(
                        //   context,
                        //   MaterialPageRoute(
                        //       builder: (context) => screen(
                        //           document['Name'], document.id)),
                        // );
                      },
                      child: Padding(
                        padding: const EdgeInsets.only(
                            top: 20.0, left: 25.0, right: 25),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14.5),
                            boxShadow: const [
                              BoxShadow(
                                  offset: Offset(5, 10),
                                  color: Colors.grey,
                                  spreadRadius: 2,
                                  blurRadius: 5),
                            ],
                          ),
                          child: Padding(
                              padding:
                                  EdgeInsets.only(top: 0, left: 0, right: 0),
                              child: Container(
                                  height:
                                      MediaQuery.of(context).size.height / 12,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(14.5),
                                    color: mSecondColor,
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      SizedBox(),
                                      Text(
                                        " ${document['Date']}",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 18,
                                        ),
                                      ),
                                      Text(
                                        " ${document['Time']}",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 18,
                                        ),
                                      ),
                                      Text(
                                        " ${document['Status']}",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 18,
                                        ),
                                      ),
                                      SizedBox(),
                                    ],
                                  ))),
                        ),
                      ));
                }).toList(),
              );
            }),

        // Text(
        //   '$_counter',
        //   style: Theme.of(context).textTheme.headline4,
        // ),
      ],
    ),
  );
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
