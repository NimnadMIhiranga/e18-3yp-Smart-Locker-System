import 'package:flutter/material.dart';

import 'package:slocker/Screens/signin_screen.dart';
import 'package:slocker/net/auth.dart';

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
                icon: Icon(Icons.settings),
                text: "Settings",
              ),
              Tab(
                icon: Icon(Icons.history),
                text: "History",
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
  return Scaffold(
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text(
            'Your Reservations Here',
          ),
          // Text(
          //   '$_counter',
          //   style: Theme.of(context).textTheme.headline4,
          // ),
        ],
      ),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SignInScreen(),
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
