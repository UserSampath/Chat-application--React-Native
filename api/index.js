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


mongoose.connect("mongodb://localhost:27017", {
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

//end points for registering users
app.post("/register", (req, res) => {
    const { name, email, password, image } = req.body;
    console.log("Registering user " + name)
    //create a new user object
    const newUser = new User({ name, email, password, image })
    //save the user to the db
    newUser.save().then(() => {
        res.status(200).json({ message: 'User saved successfully' });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error saving user' });
    });
})

//function to create token

const createToken = (userId) => {
    const payload = {
        userId: userId,
    }
    const token = jwt.sign(payload, "sampa", { expiresIn: "1h" });
    return token;
}

//endpoint for login
app.post("/login", (req, res) => {
    console.log()
    const { email, password } = req.body;
    console.log(email, password)
    //check imaail and password provided
    if (!email || !password) {
        return res.status(404).json({ message: 'email and password are required' });
    }
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        if (user.password !== password) {
            return res.status(404).json({ message: 'Invalid password' })
        }
        const token = createToken(user._id);
        res.status(200).json({ token })
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ message: "internal server error" })
    })

})

//endpoit to access all the user except the current user

app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
    console.log(loggedInUserId)
    User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
        res.status(200).json(users)
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "error retrieving users " })
    })
})


//endpoint to send a request to the user

app.post("/friend-request", async (req, res) => {
    
 })