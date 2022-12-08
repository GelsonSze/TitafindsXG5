import express from "express";
import itemController from "../controllers/itemController.js";
import loginController from "../controllers/loginController.js";
import adminController from "../controllers/adminController.js";
import transactionController from "../controllers/transactionController.js";
import configController from "../controllers/configController.js";
import { checkAuth, checkNoAuth, viewPage, adminOnly } from "../controllers/authController.js";
import { upload } from "../utils/multer.js";

const app = express();

// The inventory page (currently the home page)
app.get("/", [viewPage, checkAuth, itemController.home]);
app.post("/addItem", [
    checkAuth,
    upload.single("image"),
    itemController.addItem,
    transactionController.addTransaction,
]);
app.post("/restockItem", [
    checkAuth,
    itemController.restockItem,
    transactionController.addTransaction,
]);
app.post("/sellItem", [checkAuth, itemController.sellItem, transactionController.addTransaction]);
app.get("/getItems", [checkAuth, itemController.getItems]);

// The login page
app.get("/login", [viewPage, checkNoAuth, loginController.login]);
app.post("/auth/login", loginController.loginUser);
app.delete("/auth/logout", loginController.logoutUser);

// The Item Page
app.get("/item/:code", [viewPage, checkAuth, itemController.itemDetails]);
app.post("/editItem=:code", [checkAuth, upload.single("image"), itemController.editItem]);
app.delete("/deleteItem=:code", [checkAuth, itemController.deleteItem]);
app.get("/getItem=:code", [checkAuth, itemController.getItem]);
app.get("/getItemById=:id", [checkAuth, itemController.getItemById]);

// The transactions page
app.get("/transactions", [viewPage, checkAuth, transactionController.transactions]);
app.get("/getTransactions", [checkAuth, transactionController.getTransactions]);
app.get("/getItemTransactions=:id", [checkAuth, transactionController.getItemTransactionsById]);
app.get("/getXTransactions=:code&:limit", [checkAuth, transactionController.getXTransactions]);
app.post("/addTransaction", [checkAuth, transactionController.addTransaction]);
app.get("/searchTransactions=:type&:search", [checkAuth, transactionController.searchTransactions]);

// Configure Attributes page
app.get("/configurations", checkAuth, configController.configurations);
app.post("/addAttribute", configController.addAttribute);
app.get("/getAttributes", configController.getAttributes);
app.delete("/deleteAttribute", configController.deleteAttribute);
app.put('/editAttribute', configController.editAttribute);

app.post("/addConfig", configController.addConfig);
app.get('/getConfigs', configController.getConfigs);
app.put("/editConfig", configController.editConfig);

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
