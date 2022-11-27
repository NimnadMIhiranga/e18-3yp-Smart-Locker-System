import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:slocker/Screens/signin_screen.dart';
import 'package:slocker/constants.dart';
import 'package:sizer/sizer.dart';
import 'package:slocker/net/auth.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Widget currentPage = SignInScreen();
  final storage = new FlutterSecureStorage();
  AuthClass auth = AuthClass();

  @override
  void initState() {
    var d = Duration(seconds: 2);
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
              Image.asset(
                "assets/images/lockericon.png",
                fit: BoxFit.fitWidth,
                width: 35.h,
                height: 35.h,
              ),
              Text(
                "S Locker",
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 4.h,
                    color: mSecondTextColor),
              ),
            ]),
      ),
    );
  }

  void checklogin() async {
    String? token = await auth.getToken();
    // print("Shamod : " + token.toString());
    if (token != null) {
      // print("Shamod : login checking...");
      currentPage = Loading();
      // setState(() {});
    } else {
      currentPage = SignInScreen();
      //setState(() {});
    }
  }
}
