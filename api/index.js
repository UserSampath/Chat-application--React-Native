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
const multer = require('multer')

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
    const { currentUserId, selectedUserId } = req.body;
    console.log(currentUserId, selectedUserId)
    try {
        //update the recipient's fr array
        await User.findByIdAndUpdate(selectedUserId, { $push: { friendRequests: currentUserId } })

        //update the sender's sent friend request array 
        await User.findByIdAndUpdate(currentUserId, { $push: { sentFriendRequests: selectedUserId } })

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

//endpoit to show all the friend requests of peticler user

app.get("/friend-request/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("friendRequests", "name email image").lean();
        const friendRequests = user.friendRequests;

        res.json(friendRequests);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" })
    }
})


//endpoint to accept a request of a person

app.post("/friend-request/accept", async (req, res) => {

    try {
        const { senderId, recepientId } = req.body;

        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.friends.push(recepientId);
        recepient.friends.push(senderId);

        recepient.friendRequests = recepient.friendRequests.filter((request) => request.toString() !== senderId.toString())
        sender.sentFriendRequests = sender.sentFriendRequests.filter((request) => request.toString() !== recepientId.toString())

        await sender.save();
        await recepient.save();

        res.status(200).json({ message: "friend request accepted" })
    } catch (err) {
        res.status(500).json({ message: "internal error" })
        console.log(err);
    }

})

//endpoint to acces all the friend of the login user
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const user = await User.findById(userId).populate("friends", "name email image");
        const acceptedFriends = user.friends;
        res.json(acceptedFriends);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" })
    }
})




//endpoint to post messages and store it in the backend




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

app.post("/messages",
    upload.single('imageFile'),
    async (req, res) => {
        try {
            const { senderId, recepientId, messageType, messageText } = req.body;
            console.log(messageText, "messageText");

            const newMessage = new Message({ senderId, recepientId, messageType, message: messageText, timeStamp: new Date(), imageUrl: messageType === "image" ? request.file.path : null, });
            await newMessage.save();
            res.status(200).json({ message: "message sent successfully " });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "internal server error" })
        }
    })


//endpoint to get the user information to design the chat room header

app.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        // fetch user data from user id
        const recepientId = await User.findById(userId);
        res.json(recepientId);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" })

    }
})


//endpoint to fetch the messages between two users in the chat room

app.get("/messages/:senderId/:recepientId", async (req, res) => {
    try {

        const { senderId, recepientId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId }
            ]
        }).populate("senderId", "_id name")

        res.json(messages);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" })

    }
})

//endpoint to delete messages 
app.post("/deleteMessages", async (req, res) => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length == 0) {
            return res.status(400).json({ message: "invalid request body" });
        }

        await Message.deleteMany({ _id: { $in: messages } })

        res.json({ message: "messages delete successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" })

    }
})