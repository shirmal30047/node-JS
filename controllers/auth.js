const bcrypt = require("bcryptjs");
const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    csrfToken: req.csrfToken()
  });
};

exports.getSignup = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Siginup",
    isAuthenticated: false,
    csrfToken: req.csrfToken()
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      if (!user) {
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
          if (result) res.redirect("/login");
        });
    })

    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
