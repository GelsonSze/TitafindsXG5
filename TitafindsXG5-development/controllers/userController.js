//Controller for user
import User from "../model/schemas/user.js";
import bcrypt from "bcrypt";

const userController = {
    // The login page
    login: function (req, res) {
        res.render("login", {
            title: "Login",
            styles: ["login.css"],
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
            res.status(500).json(err);
            return;
        }
    },

    // Logs out user
    logoutUser: function (req, res) {
        console.log("Logged out user");
    },

    // Add new user (need to finalize)
    addUser: async function (req, res) {
        try {
            //Check if the user already exists
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                res.status(400).json("User already exists.");
                return;
            }

            //Create a new user
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                isAdmin: false,
            });

            //Hash the password
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(newUser.password, salt);

            //Save the user
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        } catch (error) {
            res.status(500).json(err);
            return;
        }
    },

    // TO BE REMOVED: Add admin user to database
    addAdmin: async function () {
        try {
            //Check if the user already exists
            const user = await User.findOne({ username: "admin" });
            if (user) {
                console.log("Admin already exists.");
                return;
            }

            //Create a new user
            const admin = new User({
                username: "admin",
                password: "admin",
                email: "admin@gmail.com",
                firstName: "admin",
                lastName: "admin",
                isAdmin: true,
            });

            //Hash the password
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(admin.password, salt);

            //Save the user
            await admin.save();
        } catch (error) {
            console.log(error);
        }
    },
};

export default userController;
