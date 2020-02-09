const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Siginup",
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email.");
        return res.redirect("/login");
      }
      return bcrypt.compare(password, user.password).then(doMatch => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save(err => {
            res.redirect("/");
          });
        }
        req.flash("error", "Invalid password.");
        res.redirect("./login");
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassowrd = req.body.confirmPassowrd;
  User.findOne({
    email
  })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "Email Already Exists ");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then(hashPassword => {
          const user = new User({
            email,
            password: hashPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          if (result)
            return transporter
              .sendMail({
                to: email,
                from: "shop@node.com",
                subject: "Signup Succeeded",
                html: "<h1>You Successfully Signed Up!<h1>"
              })
              .then(result => res.redirect("/login"));
        });
    })

    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("./reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then(result => {
          res.redirect("/");
          transporter.sendMail({
            to: req.body.email,
            from: "shop@node.com",
            subject: "Password Reset",
            html: `<p. You requested a password rest</P>
                  <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.`
          });
        });
      })

      .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: false,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  return User.findOne({
    resetToken: passwordToken,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashPassword => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => res.redirect("/login"))
    .catch(err => console.log(err));
};
