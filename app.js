const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const User = require("./models/user");

const rootDir = require("./util/path");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findById("5d9a4ca555b4c5407c7b607a")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/", errorController.get404);

const port = 3000;

mongoose
  .connect(
    "mongodb+srv://Shirmal:300300AzIT@clusters-zklgt.mongodb.net/shop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    const user = User.findOne().then(user => {
      if (!user) {
        user = new User({
          name: "Shirmal",
          email: "shirmal.seneviratne@google.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(port, () => {
      console.log("Running On Port: " + port);
    });
  });
