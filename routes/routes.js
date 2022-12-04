import express from "express";
import itemController from "../controllers/itemController.js";
import userController from "../controllers/userController.js";
import { checkAuth, checkNoAuth } from "../controllers/authController.js";
import { generateItemCode } from "../utils/helper.js";
import { upload } from "../utils/multer.js";
import transactionController from "../controllers/transactionController.js";
import configController from "../controllers/configController.js";

const app = express();

// Authentication and Authorization
app.post("/auth/addUser", userController.addUser);
app.post("/auth/login", userController.loginUser);
app.delete("/auth/logout", userController.logoutUser);

// The dashboard or inventory page
app.get("/", checkAuth, itemController.home);
app.post(
    "/addItem",
    upload.single("image"),
    itemController.addItem,
    transactionController.addTransaction
);
app.post(
    "/restockItem",
    upload.any(),
    itemController.restockItem,
    transactionController.addTransaction
);
app.post("/sellItem", upload.any(), itemController.sellItem, transactionController.addTransaction);
app.get("/getItems", itemController.getItems);

// The login page
app.get("/login", checkNoAuth, userController.login);

// The Item Page
app.get("/item/:code", checkAuth, itemController.itemDetails);
app.get("/getItem=:code", itemController.getItem);
app.get("/getItemById=:id", itemController.getItemById);

// The transactions page
app.get("/transactions", checkAuth, transactionController.transactions);
app.get("/getTransactions", transactionController.getTransactions);
app.get("/getItemTransactions=:id", transactionController.getItemTransactionsById);
app.get("/getXTransactions=:code&:limit", transactionController.getXTransactions);
app.post("/addTransaction", transactionController.addTransaction);
app.get("/getTransaction", transactionController.getTransaction);
app.get("/searchTransactions=:type&:search", transactionController.searchTransactions);

// Configure Attributes page
app.get("/configurations", checkAuth, configController.configurations);
app.post("/addAttribute", configController.addAttribute);
app.get("/getAttributes", configController.getAttributes)

// TO BE REMOVED
// if (process.env.NODE_ENV === "development") {
//     //Add admin user to database
//     console.log("Development mode: Adding admin user to database");
//     userController.addAdmin();

//     //Add sample items to database
//     console.log("Development mode: Adding sample items to database");
//     var samples = [
//         {
//             image: "items/default.png",
//             code: generateItemCode("Necklace"),
//             name: "Phoenix Necklace",
//             type: "Necklace",
//             brand: "Cartier",
//             classification: "14 karat",
//             design: "regular",
//             size: 16,
//             weight: 10,
//             quantity: 100,
//             sellingType: "per gram",
//             purchasePrice: 5000,
//             sellingPrice: 10000,
//             status: "Available",
//             dateAdded: "10/1/2022",
//             dateUpdated: "10/31/2022",
//             addedBy: "admin",
//         },
//         {
//             image: "items/default.png",
//             code: generateItemCode("Necklace"),
//             name: "Saudi Gold Tiffany Necklace",
//             type: "Necklace",
//             brand: "Tiffany",
//             classification: "18 karat",
//             design: "regular",
//             size: 18,
//             weight: 20,
//             quantity: 140,
//             sellingType: "per gram",
//             purchasePrice: 8000,
//             sellingPrice: 18000,
//             status: "Available",
//             dateAdded: "10/2/2022",
//             dateUpdated: "10/31/2022",
//             addedBy: "admin",
//         },
//         {
//             image: "items/default.png",
//             code: generateItemCode("Chain"),
//             name: "VVsplChristian Dior Saudi Gold Cadena Chain",
//             type: "Chain",
//             brand: "Swarovski",
//             classification: "18 karat",
//             design: "regular",
//             size: 22,
//             weight: 18,
//             quantity: 0,
//             sellingType: "per gram",
//             purchasePrice: 20000,
//             sellingPrice: 40000,
//             status: "Unvailable",
//             dateAdded: "10/21/2022",
//             dateUpdated: "10/31/2022",
//             addedBy: "admin",
//         },
//     ];
//     itemController.addItemSamples(samples);
// }

export default app;
