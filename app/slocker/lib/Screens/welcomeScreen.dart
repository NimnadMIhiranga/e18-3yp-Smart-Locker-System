import 'package:flutter/material.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:slocker/Screens/signin_screen.dart';
import 'package:slocker/constants.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Widget currentPage = SignInScreen();

  @override
  void initState() {
    var d = Duration(seconds: 3);
    // delayed 3 seconds to next page
    Future.delayed(d, () {
      // to next page and close this page
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) {
            //return SignInScreen();
            return currentPage;
          },
        ),
        (route) => false,
      );
    });
    super.initState();
    checklogin();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        width: double.infinity,
        decoration: BoxDecoration(
            // image: DecorationImage(
            //     image: AssetImage('assets/images/sample.jpeg'),
            //     fit: BoxFit.cover),
            ),
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              // Image.asset(
              //   "assets/images/sample.png",
              //   fit: BoxFit.fitWidth,
              //   width: 35,
              //   height: 35,
              // ),
              Text(
                "S Locker",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 4,
                    color: mTitleTextColor),
              ),
            ]),
      ),
    );
  }

  void checklogin() async {
    //   String? token = await auth.getToken();
    //   // print("Shamod : " + token.toString());
    //   if (token != null) {
    //     // print("Shamod : login checking...");
    //     currentPage = SelectionScreen();
    //     // setState(() {});
    //   } else {
    //     currentPage = SignInScreen();
    //     //setState(() {});
    //   }
  }
}
