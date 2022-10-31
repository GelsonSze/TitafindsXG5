import express from "express";
import itemController from "../controllers/itemController.js";
import userController from "../controllers/userController.js";
import { checkAuth, checkNoAuth } from "../controllers/authController.js";

const app = express();

// The dashboard or inventory page
app.get("/", checkAuth, itemController.home);
app.get("/home", checkAuth, itemController.homeRedirect);
app.post("/addItem", itemController.addItem);

// The login page
app.get("/login", checkNoAuth, userController.login);
app.post("/auth/addUser", userController.addUser);
app.post("/auth/login", userController.loginUser);
app.delete("/auth/logout", userController.logoutUser);

// TO BE REMOVED: Add admin user to database
if (process.env.NODE_ENV === "development") {
    console.log("Development mode: Adding admin user to database");
    userController.addAdmin();
}

export default app;
