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
                icon: Icon(Icons.history),
                text: "History",
              ),
              Tab(
                icon: Icon(Icons.list),
                text: "Reservations",
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
            tab3(),
            tab1(context),
            tab2(),
          ],
        ),
      ),
    );
  }
}

Widget tab1(BuildContext context) {
  return Scaffold(
    body: Column(
      //mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        StreamBuilder(
            stream: FirebaseFirestore.instance
                .collection('Reservations')
                .where('UID', isEqualTo: FirebaseAuth.instance.currentUser!.uid)
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
                                      PopupMenuButton<int>(
                                          itemBuilder: (context) => [
                                                // popupmenu item 1
                                                PopupMenuItem(
                                                  value: 1,
                                                  // row has two child icon and text.
                                                  child: Row(
                                                    children: [
                                                      Icon(Icons.edit),
                                                      SizedBox(
                                                        // sized box with width 10
                                                        width: 10,
                                                      ),
                                                      Text("Edit")
                                                    ],
                                                  ),
                                                ),
                                                // popupmenu item 2
                                                PopupMenuItem(
                                                  value: 2,
                                                  // row has two child icon and text
                                                  child: Row(
                                                    children: [
                                                      Icon(Icons.delete),
                                                      SizedBox(
                                                        // sized box with width 10
                                                        width: 10,
                                                      ),
                                                      Text("Delete")
                                                    ],
                                                  ),
                                                ),
                                              ],
                                          offset: Offset(-20, 15),
                                          color: mNewColor,
                                          elevation: 2,
                                          onSelected: (value) async {
                                            // if (value == 1) {
                                            //  openDialog(document.id,
                                            //       document["Location"]);
                                            // } else if (value == 2) {
                                            //   openDialogDelete(document.id);
                                            // }
                                          }),
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

Widget tab2() {
  return Container(
    child: Center(
      child: Text("Settings"),
    ),
  );
}

Widget tab3() {
  return Container(
    child: Center(
      child: Text("History"),
    ),
  );
}
