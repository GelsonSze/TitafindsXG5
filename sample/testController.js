//Controller for sample data
import Item from "../model/schemas/Item.js";
import db from "../model/db.js";
import User from "../model/schemas/User.js";
import bcrypt from "bcrypt";

const testController = {
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

    addItemSamples: async function (data) {
        try {
            //Check if sample data already exists
            data.forEach(async function (sampleItem, index) {
                var data = await Item.findOne({ code: sampleItem.code });
                if (data) {
                    console.log("Sample item already exists");
                } else {
                    var newSampleItem = new Item(sampleItem);
                    newSampleItem.save();
                }
            });
        } catch (err) {
            console.log(err);
        }
    },
};

export default testController;
