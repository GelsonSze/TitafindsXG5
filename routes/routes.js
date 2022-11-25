import express from "express";
import itemController from "../controllers/itemController.js";
import userController from "../controllers/userController.js";
import adminController from "../controllers/adminController.js";
import { checkAuth, checkNoAuth, viewPage } from "../controllers/authController.js";
import { upload } from "../utils/multer.js";

const app = express();

// The inventory page (currently the home page)
app.get("/", [viewPage, checkAuth, itemController.home]);
app.post("/addItem", [checkAuth, upload.single("image"), itemController.addItem]);
app.post("/restockItem", [itemController.restockItem]);
app.post("/sellItem", [itemController.sellItem]);
app.get("/getItems", [checkAuth, itemController.getItems]);

// The login page
app.get("/login", [viewPage, checkNoAuth, userController.login]);
app.post("/auth/login", userController.loginUser);
app.delete("/auth/logout", userController.logoutUser);

// The Item Page
app.get("/item/:code", [viewPage, checkAuth, itemController.itemDetails]);
app.get("/getItem=:code", [checkAuth, itemController.getItem]);

//The Account Management page
app.get("/accountManagement", [viewPage, checkAuth, adminController.accountManagement]);
app.get("/auth/getUsers", [checkAuth, adminController.getUsers]);
app.get("/auth/getUser=:id", [checkAuth, adminController.getUser]);
app.post("/auth/addUser", [checkAuth, adminController.addUser]);
app.put("/auth/updateUser", adminController.updateUser);
app.put("/auth/suspendUser", adminController.suspendUser);
app.put("/auth/resumeUser", adminController.resumeUser);
app.put("/auth/resetPassword", adminController.resetPassword);

export default app;
