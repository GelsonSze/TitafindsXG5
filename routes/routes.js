import express from "express";
import itemController from "../controllers/itemController.js";
import userController from "../controllers/userController.js";
import adminController from "../controllers/adminController.js";
import { checkAuth, checkNoAuth, viewPage, adminOnly } from "../controllers/authController.js";
import { upload } from "../utils/multer.js";
import transactionController from "../controllers/transactionController.js";

const app = express();

// The inventory page (currently the home page)
app.get("/", [viewPage, checkAuth, itemController.home]);
app.post("/addItem", [checkAuth, upload.single("image"), itemController.addItem, transactionController.addTransaction]);
app.post("/restockItem", [checkAuth, itemController.restockItem, transactionController.addTransaction]);
app.post("/sellItem", [checkAuth, itemController.sellItem, transactionController.addTransaction]);
app.get("/getItems", [checkAuth, itemController.getItems]);

// The login page
app.get("/login", [viewPage, checkNoAuth, userController.login]);
app.post("/auth/login", userController.loginUser);
app.delete("/auth/logout", userController.logoutUser);

// The Item Page
app.get("/item/:code", [viewPage, checkAuth, itemController.itemDetails]);
app.get("/getItem=:code", [checkAuth, itemController.getItem]);
app.get("/getItemById=:id", [checkAuth, itemController.getItemById]);

// The transactions page
app.get("/transactions", [viewPage, checkAuth, transactionController.transactions]);
app.get("/getTransactions", [checkAuth, transactionController.getTransactions]);
app.get("/getItemTransactions=:id", [checkAuth, transactionController.getItemTransactionsById]);
app.get("/getXTransactions=:code&:limit", [checkAuth, transactionController.getXTransactions]);
app.post("/addTransaction", [checkAuth, transactionController.addTransaction]);
app.get("/getTransaction", [checkAuth, transactionController.getTransaction]);
app.get("/searchTransactions=:type&:search", [checkAuth, transactionController.searchTransactions]);

//The Account Management page
app.get("/accountManagement", [viewPage, adminOnly, checkAuth, adminController.accountManagement]);
app.get("/changePassword", [viewPage, checkAuth, adminController.changePassword]);
app.put("/changeOwnPassword", [checkAuth, adminController.changeOwnPassword]);

app.get("/auth/getUsers", [adminOnly, checkAuth, adminController.getUsers]);
app.get("/auth/getUser=:id", [adminOnly, checkAuth, adminController.getUser]);
app.post("/auth/addUser", [adminOnly, checkAuth, adminController.addUser]);
app.put("/auth/updateUser", [adminOnly, checkAuth, adminController.updateUser]);
app.put("/auth/suspendUser", [adminOnly, checkAuth, adminController.suspendUser]);
app.put("/auth/resumeUser", [adminOnly, checkAuth, adminController.resumeUser]);
app.put("/auth/resetPassword", [adminOnly, checkAuth, adminController.resetPassword]);

export default app;
