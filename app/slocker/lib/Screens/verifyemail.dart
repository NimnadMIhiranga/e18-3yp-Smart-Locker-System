import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:slocker/Screens/signup_screen.dart';
import 'package:slocker/constants.dart';
import 'dart:async';

import 'package:slocker/net/auth.dart';

class verifyemail extends StatefulWidget {
  const verifyemail({super.key});

  @override
  State<verifyemail> createState() => _verifyemailState();
}

class _verifyemailState extends State<verifyemail> {
  AuthClass auth = AuthClass();

  bool ismailverified = false;
  bool canResendEmail = false;
  Timer? timer;
  @override
  void initState() {
    super.initState();

    ismailverified = FirebaseAuth.instance.currentUser!.emailVerified;

    if (!ismailverified) {
      sendVerificationMail();

      timer = Timer.periodic(Duration(seconds: 3), (_) => checkEmailVerified());
    }
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
  }

  Future checkEmailVerified() async {
    await FirebaseAuth.instance.currentUser!.reload();
    setState(() {
      ismailverified = FirebaseAuth.instance.currentUser!.emailVerified;
    });

    if (ismailverified) {
      timer?.cancel();
    }
  }

  Future sendVerificationMail() async {
    try {
      final user = FirebaseAuth.instance.currentUser!;
      await user.sendEmailVerification();

      setState(() => canResendEmail = false);
      await Future.delayed(Duration(seconds: 5));
      setState(() => canResendEmail = true);
    } catch (e) {
      Fluttertoast.showToast(
          msg: e.toString(),
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.CENTER,
          timeInSecForIosWeb: 1,
          backgroundColor: mSecondColor,
          textColor: Colors.black);
    }
  }

  @override
  Widget build(BuildContext context) => ismailverified
      ? Loading()
      : Scaffold(
          appBar: AppBar(
            title: Text("verify email"),
          ),
          body: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "A verification email has been sent to your email account",
                  style: TextStyle(fontSize: 20),
                  textAlign: TextAlign.center,
                ),
                SizedBox(
                  height: 24,
                ),
                ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                        minimumSize: Size.fromHeight(50)),
                    onPressed: canResendEmail ? sendVerificationMail : null,
                    icon: Icon(
                      Icons.email,
                      size: 32,
                    ),
                    label: Text(
                      "Resent Email",
                      style: TextStyle(fontSize: 24),
                    )),
                SizedBox(
                  height: 24,
                ),
                TextButton(
                    onPressed: () async {
                      //await auth.logout();
                      FirebaseAuth.instance.signOut();
                      Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                              builder: (builder) => SignUpScreen()),
                          (route) => false);
                    },
                    child: Text(
                      'Cancel',
                      style: TextStyle(fontSize: 24),
                    ))
              ],
            ),
          ));
}
