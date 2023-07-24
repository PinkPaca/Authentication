//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.unsubscribe(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", async(req, res) => {
  res.render("home");
});

app.get("/login", async(req, res) => {
  res.render("login");
});

app.get("/register", async(req, res) => {
  res.render("register");
});

app.post("/register", async(req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save();
  res.render("secrets");
});

app.post("/login", async(req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const foundUser = await User.findOne({email: username});

  if(foundUser) {
    if(foundUser.password === password) {
      res.render("secrets");
    } else {
      res.send("Your password is wrong");
    }
  } else {
    res.send("Your e-mail doesn't exist")
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
