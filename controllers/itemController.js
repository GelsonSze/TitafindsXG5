//Controller for items
import Item from "../model/schemas/Item.js";
import db from "../model/db.js";
import { generateItemCode, isEmptyOrSpaces } from "../utils/helper.js";
import { upload } from "../utils/multer.js";

const itemController = {
    // The dashboard or inventory page
    home: function (req, res) {
        res.render("index", {
            title: "index",
            styles: ["pages/index.css", "general/w2ui-overrides.css", "general/popup.css"],
            scripts: ["index.js"],
        });
    },

    // Redirects to home page
    homeRedirect: function (req, res) {
        res.redirect("/");
    },

    itemDetails: function (req, res) {
        res.render("item", {
            title: "Product",
            code: req.body.code,
            styles: ["pages/item.css", "general/w2ui-overrides.css"],
            scripts: ["item.js"],
        });
    },

    // Adds item passed in a post request into the database
    addItem: async function (req, res, next) {
        try {
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }

            console.log(">>FILE<<");
            console.log(req.file);
            console.log(">>BODY<<");
            console.log(req.body);

            // Placeholder for price value in global config setting
            var price = 1;
            var image = "test.png";
            var error = "";
            var errorFields = [];

            var codeExists = await Item.findOne({ code: req.body.code });

            if (req.file) {
                image = req.file;
                image = image.destination.replaceAll("./public/img/", "") + image.filename;
            }

            var addedItem = {
                image: image ?? "test.png",
                code: req.body.code,
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                brand: req.body.brand,
                classification: req.body.classification,
                design: req.body.design,
                size: req.body.size,
                weight: req.body.weight,
                quantity: req.body.quantity,
                sellingType: req.body.sellingType,
                purchasePrice: req.body.purchasePrice,
                sellingPrice: req.body.sellingPrice,
                status: req.body.status,
                dateAdded: req.body.dateAdded,
                dateUpdated: req.body.dateUpdated,
                addedBy: req.session.user.username,
            };

            //console.log(addedItem);

            // Selling price default to 0 if field is empty and selling type is per design
            if (addedItem.sellingType == "per design" && isEmptyOrSpaces(addedItem.sellingPrice))
                addedItem.sellingPrice = "0";
            //Selling price defaults to price * item weight if field is empty and selling type is per gram
            else if (addedItem.sellingType == "per gram" && isEmptyOrSpaces(addedItem.sellingPrice))
                addedItem.sellingPrice = addedItem.weight * price;

            // Purchase price is default to 0 if field is empty
            if (isEmptyOrSpaces(addedItem.purchasePrice)) addedItem.purchasePrice = "0";

            console.log(addedItem);
            //  Errors
            if (codeExists) {
                error = "Item code already exists";
                errorFields = ["code"];
            } else if (addedItem.code.length > 100) {
                error = "Item code exceeds maximum character limit";
                errorFields = ["code"];
            } else if (addedItem.name.length > 255) {
                error = "Name exceeds maximum character limit";
                errorFields = ["name"];
            } else if (addedItem.size != null && isNaN(addedItem.size)) {
                error = "Size inputted is not a number";
                errorFields = ["size"];
            } else if (addedItem.weight != null && isNaN(addedItem.weight)) {
                error = "Weight inputted is not a number";
                errorFields = ["weight"];
            } else if (isNaN(addedItem.quantity)) {
                error = "Quantity inputted is not a number";
                errorFields = ["quantity"];
            } else if (!isNaN(addedItem.quantity) && addedItem.quantity % 1 != 0) {
                error = "Quantity inputted is not a whole number";
                errorFields = ["quantity"];
            } else if (addedItem.sellingPrice != null && isNaN(addedItem.sellingPrice)) {
                error = "Selling price inputted is not a number";
                errorFields = ["selling-price"];
            } else if (addedItem.purchasePrice != null && isNaN(addedItem.purchasePrice)) {
                error = "Purchase price inputted is not a number";
                errorFields = ["purchase-price"];
            } else {
                db.insertOne(Item, addedItem, function (data) {
                    if (data) {
                        req.body = {
                            date: req.body.dateAdded,
                            type: "Added",
                            description: data._id.toString(),
                            quantity: data.quantity,
                            sellingPrice: data.sellingPrice,
                            transactedBy: data.addedBy,
                        };
                        next();
                    }
                });
                return;
            }
            res.status(400).json({ message: error, fields: errorFields });
        } catch (err) {
            res.status(500).json({ message: "Server Error: Add Item", details: err });
            return;
        }
    },
    getItems: function (req, res) {
        try {
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }

            db.findMany(Item, {}, null, function (data) {
                res.status(200).json(data);
            });
        } catch (err) {
            res.status(500).json({ message: "Server Error: Get Items", details: err });
            return;
        }
    },

    getItem: function (req, res) {
        try {
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }

            db.findOne(Item, { code: req.params.code }, {}, async function (data) {
                console.log(req.query);
                res.status(200).json(await data);
            });
        } catch (err) {
            res.status(500).json({ message: "Server Error: Get Item", details: err });
            return;
        }
    },

    getItemById: function (req, res) {
        try {
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }
            db.findById(Item, req.params.id, "name code", async function (data) {
                console.log(data);
                res.status(200).json(data);
            });
        } catch (err) {
            res.status(500).json({ message: "Server Error: Get Item By Id", details: err });
            return;
        }
    },

    // //TO BE REMOVED:
    // addItemSamples: async function (data) {
    //     await Item.insertMany(data);
    // },
};

export default itemController;
