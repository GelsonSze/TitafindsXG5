import express from "express";
import itemController from "../controllers/itemController.js";
import userController from "../controllers/userController.js";
import { checkAuth, checkNoAuth } from "../controllers/authController.js";
import { generateItemCode } from "../utils/helper.js";

const app = express();

// The dashboard or inventory page
app.get("/", checkAuth, itemController.home);
app.post("/addItem", itemController.addItem);
app.get("/getItems", itemController.getItems);

// The login page
app.get("/login", checkNoAuth, userController.login);
app.post("/auth/addUser", userController.addUser);
app.post("/auth/login", userController.loginUser);
app.delete("/auth/logout", userController.logoutUser);

// The Item Page
app.get("/item/:code", checkAuth, itemController.itemDetails);
app.get("/getItem", itemController.getItem);


// TO BE REMOVED
if (process.env.NODE_ENV === "development") {
    //Add admin user to database
    console.log("Development mode: Adding admin user to database");
    userController.addAdmin();

    //Add sample items to database
    console.log("Development mode: Adding sample items to database");
    var samples = [
        {
            image: "test.png",
            code: generateItemCode("Necklace"),
            name: "Phoenix Necklace",
            type: "Necklace",
            brand: "Cartier",
            classification: "14 karat",
            design: "regular",
            size: 16,
            weight: 10,
            quantity: 100,
            sellingType: "per gram",
            purchasePrice: 5000,
            sellingPrice: 10000,
            status: "Available",
            dateAdded: "10/1/2022",
            dateUpdated: "10/31/2022",
            addedBy: "admin",
        },
        {
            image: "test.png",
            code: generateItemCode("Necklace"),
            name: "Saudi Gold Tiffany Necklace",
            type: "Necklace",
            brand: "Tiffany",
            classification: "18 karat",
            design: "regular",
            size: 18,
            weight: 20,
            quantity: 140,
            sellingType: "per gram",
            purchasePrice: 8000,
            sellingPrice: 18000,
            status: "Available",
            dateAdded: "10/2/2022",
            dateUpdated: "10/31/2022",
            addedBy: "admin",
        },
        {
            image: "test.png",
            code: generateItemCode("Chain"),
            name: "VVsplChristian Dior Saudi Gold Cadena Chain",
            type: "Chain",
            brand: "Swarovski",
            classification: "18 karat",
            design: "regular",
            size: 22,
            weight: 18,
            quantity: 0,
            sellingType: "per gram",
            purchasePrice: 20000,
            sellingPrice: 40000,
            status: "Unvailable",
            dateAdded: "10/21/2022",
            dateUpdated: "10/31/2022",
            addedBy: "admin",
        },
    ];
    itemController.addItemSamples(samples);
}

export default app;
