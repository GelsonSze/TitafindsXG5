//Controller for admin
import User from "../model/schemas/User.js";
import bcrypt from "bcrypt";
import db from "../model/db.js";

const adminController = {
    accountManagement: function (req, res) {
        res.render("accountManagement", {
            title: "Account Management",
            styles: [
                "pages/accountManagement.css",
                "pages/index.css",
                "general/w2ui-overrides.css",
                "general/popup.css",
            ],
            scripts: ["accountManagement.js", "index.js"],
            user: { isAdmin: req.session.user.isAdmin, username: req.session.user.username },
        });
    },

    // Get all users
    getUsers: async function (req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Server Error: Get Users", details: err });
        }
    },
    // Get a user
    getUser: async function (req, res) {
        try {
            const user = await User.findById(req.params.username);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Server Error: Get User", details: err });
        }
    },

    // Add new user
    addUser: async function (req, res) {
        try {
            //Check if the user already exists
            const user = await User.findOne({ username: req.body.username });
            if (user) {
                res.status(403).json({ message: "User already exists" });
                return;
            }
            var err = ""
            //Create a new user
            const newUser = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                isAdmin: false,
            };

            if (newUser.username.length > 100){
                err = "Username exceeds 100 characters!";
                errorFields = ["code"];
            }
            if (newUser.password.length < 10){
                err = "Password length is less than 10 characters!";
                errorFields = ["code"];
            }

            //Hash the password
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);
            //Save the user
            db.insertOne(User, newUser, function (data) {
                res.send(data);
            });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Add User", details: err});
            return;
        }
    },
};

export default adminController;
