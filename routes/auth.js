const express = require("express");

const { check, body } = require("express-validator");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .normalizeEmail(),
    body("password", "Please enter a valid password")
      .isLength({ min: 3 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw Error("This is Email Address is Forbidden");
        // }
        // return true;
        return User.findOne({
          email: value
        }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Email Already Exists");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter a valid password")
      .isLength({ min: 3 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassowrd")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw Error("Password do not match");
        }
        return true;
      })
      .trim()
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
