//Controller for items
import Item from "../model/schemas/Item.js";
import db from "../model/db.js";
import { generateItemCode, isEmptyOrSpaces } from "../utils/helper.js";
import { ImageDirectory } from "../utils/multer.js";

const itemController = {
    // The dashboard or inventory page
    home: function (req, res) {
        var error = "";
        if (req.session.error) {
            error = req.session.error;
            delete req.session.error;
        }

        res.render("index", {
            title: "Inventory",
            styles: ["pages/index.css", "general/w2ui-overrides.css", "general/popup.css"],
            scripts: ["index.js", "restockPopup.js", "sellPopup.js", "addPopup.js"],
            inventory: true,
            user: { isAdmin: req.session.user.isAdmin, username: req.session.user.username },
            error: error,
        });
    },

    itemDetails: function (req, res) {
        try {
            db.findOne(Item, { code: req.params.code }, {}, async function (data) {
                if (data != null) {
                    res.render("item", {
                        title: `${data.name} (${data.code})`,
                        name: data.name,
                        code: data.code,
                        desc: data.description,
                        type: data.type,
                        sellingType: data.sellingType,
                        available: data.available ?? 0,
                        damaged: data.damaged ?? 0,
                        styles: [
                            "pages/item.css",
                            "general/w2ui-overrides.css",
                            "general/popup.css",
                        ],
                        scripts: ["item.js", "restockPopup.js", "sellPopup.js", "removeDamagedPopup.js"],
                        user: {
                            isAdmin: req.session.user.isAdmin,
                            username: req.session.user.username,
                        },
                    });
                } else {
                    res.redirect("/");
                }
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Get Item Details",
                details: error.message,
            });
            return;
        }
    },

    // Adds item passed in a post request into the database
    addItem: async function (req, res, next) {
        try {
            console.log(">>FILE<<");
            console.log(req.file);
            console.log(">>BODY<<");
            console.log(req.body);

            // Placeholder for price value in global config setting
            var price = 1;
            var image = "product-images/default.png";
            var error = "";
            var errorFields = [];

            var codeExists = await Item.findOne({ code: req.body.code });

            if (req.file) {
                image = req.file;
                image = image.destination.replaceAll("./public/img/", "") + image.filename;
            }

            var addedItem = {
                image: image ?? "product-images/default.png",
                code: req.body.code,
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                brand: req.body.brand,
                classification: req.body.classification,
                design: req.body.design,
                size: req.body.size,
                unit: req.body.unit,
                weight: req.body.weight,
                available: req.body.available,
                sellingType: req.body.sellingType,
                purchasePrice: req.body.purchasePrice,
                sellingPrice: req.body.sellingPrice,
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
            } else if (isNaN(addedItem.available)) {
                error = "Available quantity inputted is not a number";
                errorFields = ["available"];
            } else if (!isNaN(addedItem.available) && addedItem.available % 1 != 0) {
                error = "Available quantity inputted is not a whole number";
                errorFields = ["available"];
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
                            quantity: data.available,
                            sellingPrice: data.sellingPrice,
                            transactedBy: data.addedBy,
                            code: req.body.code,
                            name: req.body.name,
                        };
                        next();
                    }
                });
                return;
            }
            res.status(400).json({ message: error, fields: errorFields });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Add Item", details: error.message });
            return;
        }
    },

    // edits item passed in a post request into the database
    editItem: async function (req, res, next) {
        try {
            var image = "product-images/default.png";
            var error = "";
            var errorFields = [];

            var codeExists = await Item.findOne({ code: req.body.code });

            if (req.file) {
                image = req.file;
                image = image.destination.replaceAll("./public/img/", "") + image.filename;
            }

            var editedItem = {
                image: image ?? "product-images/default.png",
                code: req.body.code,
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                brand: req.body.brand,
                classification: req.body.classification,
                design: req.body.design,
                size: req.body.size,
                unit: req.body.unit,
                weight: req.body.weight,
                sellingType: req.body.sellingType,
                purchasePrice: req.body.purchasePrice,
                sellingPrice: req.body.sellingPrice,
                dateUpdated: req.body.dateUpdated,
            };
            if (req.body.noEdit) delete editedItem.image;
            //console.log(editedItem);

            // Selling price default to 0 if field is empty and selling type is per design
            if (editedItem.sellingType == "per design" && isEmptyOrSpaces(editedItem.sellingPrice))
                editedItem.sellingPrice = "0";
            //Selling price defaults to price * item weight if field is empty and selling type is per gram
            else if (
                editedItem.sellingType == "per gram" &&
                isEmptyOrSpaces(editedItem.sellingPrice)
            )
                editedItem.sellingPrice = editedItem.weight * price;

            // Purchase price is default to 0 if field is empty
            if (isEmptyOrSpaces(editedItem.purchasePrice)) editedItem.purchasePrice = "0";

            console.log(editedItem);
            //  Errors
            if (!req.body.noNewCode && codeExists) {
                error = "Item code already exists";
                errorFields = ["code"];
            } else if (editedItem.code.length > 100) {
                error = "Item code exceeds maximum character limit";
                errorFields = ["code"];
            } else if (editedItem.name.length > 255) {
                error = "Name exceeds maximum character limit";
                errorFields = ["name"];
            } else if (editedItem.size != null && isNaN(editedItem.size)) {
                error = "Size inputted is not a number";
                errorFields = ["size"];
            } else if (editedItem.weight != null && isNaN(editedItem.weight)) {
                error = "Weight inputted is not a number";
                errorFields = ["weight"];
            } else if (editedItem.sellingPrice != null && isNaN(editedItem.sellingPrice)) {
                error = "Selling price inputted is not a number";
                errorFields = ["selling-price"];
            } else if (editedItem.purchasePrice != null && isNaN(editedItem.purchasePrice)) {
                error = "Purchase price inputted is not a number";
                errorFields = ["purchase-price"];
            } else {
                db.updateOne(
                    Item,
                    {
                        code: req.params.code,
                    },
                    editedItem,
                    function (data) {
                        res.status(200).json({ message: "Item edited successfully" });
                    }
                );
                return;
            }
            res.status(400).json({
                message: error,
                fields: errorFields,
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Update Item",
                details: error.message,
            });
            return;
        }
    },

    //delete item from database
    deleteItem: function (req, res) {
        try {
            db.deleteOne(Item, { code: req.params.code }, function (data) {
                res.send(data);
            });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Delete Item", details: error.message });
            return;
        }
    },

    getItems: function (req, res) {
        try {
            db.findMany(Item, {}, null, function (data) {
                res.status(200).json(data);
            });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Get Items", details: error.message });
            return;
        }
    },

    getItem: function (req, res) {
        try {
            db.findOne(Item, { code: req.params.code }, {}, async function (data) {
                if (data) {
                    res.status(200).json(await data);
                } else {
                    res.status(400).json({ message: "Invalid Product Code.", fields: ["code"] });
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Get Item", details: error.message });
            return;
        }
    },

    getItemById: function (req, res) {
        try {
            console.log("in item id");
            console.log(req.params.id);
            db.findById(Item, req.params.id, "name code", async function (data) {
                // console.log(data);
                res.status(200).json(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Get Item By Id",
                details: error.message,
            });
            return;
        }
    },

    restockItem: async function (req, res, next) {
        try {
            var error = "";
            var quantity = req.body.quantity;
            var item = await Item.findOne({ code: req.body.code });
            console.log(quantity);

            if (isNaN(quantity)) {
                error = "Quantity inputted is not a number";
            } else if (!isNaN(quantity) && quantity % 1 != 0) {
                error = "Quantity inputted is not a whole number";
            } else if (quantity == 0) {
                error = "Quantity is 0";
            } else {
                db.updateOne(
                    Item,
                    { code: req.body.code },
                    { $inc: { available: req.body.quantity } },
                    function (data) {
                        req.body = {
                            date: req.body.dateRestocked,
                            type: "Restock",
                            description: item._id.toString(),
                            quantity: quantity,
                            sellingPrice: item.sellingPrice,
                            transactedBy: req.session.user.username,
                            code: item.code,
                            name: item.name,
                        };
                        next();
                    }
                );
                return;
            }
            res.status(400).json({ message: error, fields: ["restock-quantity"] });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Restock Item", details: error.message });
            return;
        }
        res.status(400).json({ message: error, fields: ["quantity"] });
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

    sellItem: async function (req, res, next) {
        try {
            var error = "";
            var errorFields = [];
            var quantity = req.body.quantity;
            var sellingPrice = req.body.sellingPrice;
            var item = await Item.findOne({ code: req.body.code });

            //validation for selling price
            if (isNaN(sellingPrice)) {
                error = "Selling price inputted is not a number";
                errorFields = ["sell-selling-price"];
            } else if (sellingPrice < 0) {
                error = "Selling price is negative";
                errorFields = ["sell-selling-price"];
            } else if (isNaN(quantity)) {
                error = "Quantity inputted is not a number";
                errorFields = ["sell-quantity"];
            } else if (!isNaN(quantity) && quantity % 1 != 0) {
                error = "Quantity inputted is not a whole number";
                errorFields = ["sell-quantity"];
            } else if (quantity == 0) {
                error = "Quantity is 0";
                errorFields = ["sell-quantity"];
            } else if (item.available == 0) {
                error = "No available stock";
                errorFields = ["sell-quantity"];
            } else if (item.available - quantity < 0) {
                error = "Insufficient stock";
                errorFields = ["sell-quantity"];
            } else {
                quantity = -Math.abs(req.body.quantity);
                db.updateOne(
                    Item,
                    { code: req.body.code },
                    { $inc: { available: quantity } },
                    function (data) {
                        req.body = {
                            date: req.body.dateSold,
                            type: "Sell",
                            description: item._id.toString(),
                            quantity: quantity,
                            sellingPrice: sellingPrice,
                            transactedBy: req.session.user.username,
                            code: item.code,
                            name: item.name,
                        };
                        next();
                    }
                );
                return;
            }
            res.status(400).json({ message: error, fields: errorFields });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Sell Item", details: error.message });
            return;
        }
    },

    editDynamicAttributes: async function (req, res) {
        try {
            db.findOne(Item, { code: req.body.code }, {mixed: req.body.mixed}, async function (data) {
                if (data) {
                    res.status(200).json(await data);
                } else {
                    res.status(400).json({ message: "Invalid Product Code.", fields: ["code"] });
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Server Error: Edit Item Dynamic Attributes", details: error.message });
            return;
        }
    },
};

export default itemController;
