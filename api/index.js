const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()
const port = 8000;
const cors = require('cors')
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');


mongoose.connect("mongodb+srv://sampath:sampath@cluster0.vtnflrx.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database ")
}).catch((err) => {
    console.log("Error connecting to db")
})

app.listen(port, () => {
    console.log("server running on port " + port)
});


const User = require("./models/user");
const Message = require("./models/message")

