import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:sizer/sizer.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:slocker/Screens/loading.dart';
import 'package:slocker/Screens/signin_screen.dart';
import 'package:slocker/Screens/verifyemail.dart';
import 'package:slocker/reusable.dart';

import '../constants.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({Key? key}) : super(key: key);

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final GlobalKey<FormState> _key2 = GlobalKey<FormState>();
  String errorMessage = '';

  TextEditingController _passwordTextController = TextEditingController();
  TextEditingController _emailTextController = TextEditingController();
  TextEditingController _userNameTextController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
      child: Form(
        key: _key2,
        child: Scaffold(
          body: Container(
            height: double.infinity,
            width: double.infinity,
            child: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.fromLTRB(4.w, 2.h, 4.w, 2.h),
                child: Column(
                  children: <Widget>[
                    SizedBox(
                      height: 2.h,
                    ),
                    //language(context, () {}),
                    Text(
                      "Register User".tr,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 4.h,
                        color: mSecondTextColor,
                      ),
                    ),
                    SizedBox(
                      height: 2.h,
                    ),
                    Image.asset(
                      "assets/images/reg.png",
                      fit: BoxFit.fitWidth,
                      width: 35.h,
                      height: 35.h,
                      color: Color(0xFF6892c9),
                      // /color: mNewColor,
                    ),
                    SizedBox(
                      height: 2.h,
                    ),

                    reusableTextField("Enter Username".tr, Icons.person_sharp,
                        false, _userNameTextController, null, "username-field"),
                    SizedBox(
                      height: 2.h,
                    ),

                    reusableTextField("Enter the e-mail".tr, Icons.email, false,
                        _emailTextController, validateEmail, "email-field"),
                    SizedBox(
                      height: 2.h,
                    ),
                    reusableTextField(
                        "Enter the password".tr,
                        Icons.lock_sharp,
                        true,
                        _passwordTextController,
                        validatePassword,
                        "password-field"),
                    firebaseUIButton(context, "SIGN UP".tr, () async {
                      if (_key2.currentState!.validate()) {
                        try {
                          await FirebaseAuth.instance
                              .createUserWithEmailAndPassword(
                            email: _emailTextController.text,
                            password: _passwordTextController.text,
                          )
                              .then((value) {
                            FirebaseFirestore.instance
                                .collection('User Data')
                                .add({
                              "email": _emailTextController.text,
                              "userName": _userNameTextController.text,
                              "uid": FirebaseAuth.instance.currentUser!.uid,
                            });
                            Fluttertoast.showToast(
                                msg: 'User Account Created!',
                                toastLength: Toast.LENGTH_SHORT,
                                gravity: ToastGravity.BOTTOM,
                                timeInSecForIosWeb: 1,
                                backgroundColor: mSecondColor,
                                textColor: Colors.white);

                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => verifyemail()));
                          });
                          errorMessage = '';
                        } on FirebaseAuthException catch (error) {
                          errorMessage = error.message!;
                          Fluttertoast.showToast(
                              msg: errorMessage,
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.CENTER,
                              timeInSecForIosWeb: 1,
                              backgroundColor: mSecondColor,
                              textColor: Colors.black);
                        }
                        setState(() {});
                      }
                    }),
                    signUpOption(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Row signUpOption() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text("Have an acoount? ".tr,
            style: TextStyle(color: mPrimaryTextColor, fontSize: 13)),
        GestureDetector(
          onTap: () {
            Navigator.push(context,
                MaterialPageRoute(builder: (context) => SignInScreen()));
          },
          child: Text(
            "SIGN IN".tr,
            style: TextStyle(
                color: mPrimaryTextColor,
                fontWeight: FontWeight.bold,
                fontSize: 13),
          ),
        )
      ],
    );
  }
}
