const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connection;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://ammar:vJEAsya7hII0lEL0@ammar.z1dmemi.mongodb.net/myLoginRegisterDB?retryWrites=true&w=majority')
db.on("error", console.error.bind(console, "Connection failed:"));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)



app.post('/login', (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }).then((result) => {
        if (result === null) {
            res.send({ message: "User not registered" })
        } else {
            if (password === result.password) {
                res.send({ message: "User Succesfully logged in", user: result })
            } else {
                res.send({ message: "wrong password" })
            }
        }
    }).catch((err) => {
        res.send({ message: "failed to get data from database" })
    });
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    User.findOne({ email: email }).then((result) => {
        if (result === null) {
            const newUser = new User({
                name,
                email,
                password,
            })
            newUser.save().then((result) => {
                res.send({ message: "User registered Succesfully" })
            }).catch((err) => {
                res.send({ message: "Failed to save user on database, contact developer at knowtalpur@gmail.com" })
            });
        } else {
            res.send({ message: "user already registered" })
        }
    }).catch((err) => {
        res.send({ message: "failed to get data from database" })
    });

})


db.once("open", function () {
    console.log("Database Connected Succesfully");
    app.listen(process.env.PORT, () => {
        console.log(`The server is running on port: ${process.env.PORT}`);
    })
})