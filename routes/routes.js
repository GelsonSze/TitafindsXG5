import express from "express";
import itemController from "../controllers/itemController.js";
import userController from "../controllers/userController.js";
import { checkAuth, checkNoAuth } from "../controllers/authController.js";

const app = express();

// The dashboard or inventory page
app.get("/", checkAuth, itemController.home);
app.post("/addItem", itemController.addItem);
app.get("/getItem", itemController.getItem);

// The login page
app.get("/login", checkNoAuth, userController.login);
app.post("/auth/addUser", userController.addUser);
app.post("/auth/login", userController.loginUser);
app.delete("/auth/logout", userController.logoutUser);

// TO BE REMOVED
if (process.env.NODE_ENV === "development") {
    //Add admin user to database
    console.log("Development mode: Adding admin user to database");
    userController.addAdmin();

    //Add sample items to database
    console.log("Development mode: Adding sample items to database");
    var samples= [
        { 
            

        }

    ]

    itemController.addItemSamples(samples);
}



export default app;
