"use strict";
import express from "express";
import rateLimit from "express-rate-limit";
import itemController from "../controllers/itemController.js";
import loginController from "../controllers/loginController.js";
import adminController from "../controllers/adminController.js";
import transactionController from "../controllers/transactionController.js";
import { checkAuth, checkNoAuth, viewPage, adminOnly } from "../controllers/authController.js";
import { upload } from "../utils/multer.js";

const app = express();

// Rate limiter
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 10 minutes",
    requestPropertyName: "rateLimitDetails",
    handler: function (req, res, next, options) {
        res.status(options.statusCode).json({
            message: `Try again ${new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                (req.rateLimitDetails.resetTime - Date.now()) / 1000,
                "minutes"
            )}"`,
            details: {
                longMessage: options.message,
                limit: options.max,
                current: req.rateLimitDetails.current,
            },
        });
    },
});

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per `window` (here, per a minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 1 minute",
    requestPropertyName: "rateLimitDetails",
    handler: function (req, res, next, options) {
        res.status(options.statusCode).json({
            message: `Try again ${new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                Math.floor((req.rateLimitDetails.resetTime - Date.now()) / 1000),
                "seconds"
            )}`,
            details: {
                longMessage: options.message,
                limit: options.max,
                current: req.rateLimitDetails.current,
            },
        });
    },
});

// The inventory page (currently the home page)
app.get("/", [viewPage, apiLimiter, checkAuth, itemController.home]);
app.post("/addItem", [
    apiLimiter,
    checkAuth,
    upload.single("image"),
    itemController.addItem,
    transactionController.addTransaction,
]);
app.post("/restockItem", [
    apiLimiter,
    checkAuth,
    itemController.restockItem,
    transactionController.addTransaction,
]);
app.post("/sellItem", [
    apiLimiter,
    checkAuth,
    itemController.sellItem,
    transactionController.addTransaction,
]);
app.get("/getItems", [apiLimiter, checkAuth, itemController.getItems]);
app.post("/importFromCSV", [apiLimiter, checkAuth, itemController.importFromCSV]);

// The login page
app.get("/login", [viewPage, checkNoAuth, loginController.login]);
app.post("/auth/login", [loginLimiter, loginController.loginUser]);
app.delete("/auth/logout", loginController.logoutUser);

// The Item Page
app.get("/item/:code", [viewPage, checkAuth, itemController.itemDetails]);
app.post("/removeDamagedItem", [apiLimiter, checkAuth, itemController.removeDamagedItem]);
app.post("/editItem=:code", [
    apiLimiter,
    checkAuth,
    upload.single("image"),
    itemController.editItem,
]);
app.delete("/deleteItem=:code", [apiLimiter, checkAuth, itemController.deleteItem]);
app.get("/getItem=:code", [checkAuth, itemController.getItem]);
app.get("/getItemById=:id", [checkAuth, itemController.getItemById]);

// The Transactions page
app.get("/transactions", [viewPage, checkAuth, transactionController.transactions]);
app.get("/getTransactions", [apiLimiter, checkAuth, transactionController.getTransactions]);
app.get("/getItemTransactions=:id", [
    apiLimiter,
    checkAuth,
    transactionController.getItemTransactionsById,
]);
app.post("/addTransaction", [apiLimiter, checkAuth, transactionController.addTransaction]);
app.get("/searchTransactions=:type&:search", [
    apiLimiter,
    checkAuth,
    transactionController.searchTransactions,
]);

//The Account Management page
app.get("/accountManagement", [
    viewPage,
    adminOnly,
    apiLimiter,
    checkAuth,
    adminController.accountManagement,
]);
app.get("/changePassword", [viewPage, checkAuth, adminController.changePassword]);
app.put("/changeOwnPassword", [apiLimiter, checkAuth, adminController.changeOwnPassword]);

app.get("/auth/getUsers", [adminOnly, apiLimiter, checkAuth, adminController.getUsers]);
app.get("/auth/getUser=:id", [adminOnly, apiLimiter, checkAuth, adminController.getUser]);
app.post("/auth/addUser", [adminOnly, apiLimiter, checkAuth, adminController.addUser]);
app.put("/auth/updateUser", [adminOnly, apiLimiter, checkAuth, adminController.updateUser]);
app.put("/auth/suspendUser", [adminOnly, apiLimiter, checkAuth, adminController.suspendUser]);
app.put("/auth/resumeUser", [adminOnly, apiLimiter, checkAuth, adminController.resumeUser]);
app.put("/auth/resetPassword", [adminOnly, apiLimiter, checkAuth, adminController.resetPassword]);

export default app;
