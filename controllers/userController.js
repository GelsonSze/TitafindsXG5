//Controller for user
import User from "../model/schemas/User.js";
import bcrypt from "bcrypt";
import db from "../model/db.js";

const userController = {
    // The login page
    login: function (req, res) {
        res.render("login", {
            title: "Login",
            styles: ["pages/login.css"],
            scripts: ["login.js"],
        });
    },

    // Logs in user passed in a post request
    loginUser: async function (req, res) {
        try {
            //Find the user
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("User not found.");
                return;
            }

            //Check if the password is correct
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                res.status(400).json("Incorrect password.");
                return;
            }
            req.session.user = user;

            //Respond with the user
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Server Error: Login user", details: err });
            return;
        }
    },
    // Logs out user
    logoutUser: function (req, res) {
        console.log("Logged out user");
    },
};

export default userController;
