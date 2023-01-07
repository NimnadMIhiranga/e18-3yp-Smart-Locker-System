// ignore_for_file: prefer_interpolation_to_compose_strings

import 'package:cloud_firestore/cloud_firestore.dart';
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
    locations.orderByChild("State").equalTo("Available");
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
                    query: locations.orderByChild('State').equalTo('available'),
                    itemBuilder: ((context, snapshot, animation, index) {
                      return InkWell(
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => Loading()));
                        },
                        child: ListTile(
                          title: Text("Locker Number: " +
                              snapshot.child('lockID').value.toString()),
                        ),
                      );
                    })))
          ],
        ));
  }

  // Future<Widget> _getData() async {
  //   DatabaseReference ref =
  //       FirebaseDatabase.instance.reference().child('your-node');
  //   DataSnapshot snapshot =
  //       (await ref.orderByChild('your-field').equalTo('your-value').once()) as DataSnapshot;
  //   List<Widget> list = [];
  //   snapshot.value.forEach((key, value) {
  //     list.add(
  //       InkWell(
  //         onTap: () {
  //           // handle the tap event
  //         },
  //         child: Text(value['your-field']),
  //       ),
  //     );
  //   });
  //   return ListView.builder(
  //     itemCount: list.length,
  //     itemBuilder: (context, index) {
  //       return list[index];
  //     },
  //   );
  // }
}
