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
            styles: ["pages/item.css"],
            scripts: ["item.js"],
        });
    },

    // Adds item passed in a post request into the database
    addItem: async function (req, res) {
        console.log(">>FILE<<");
        console.log(req.file);
        console.log(">>BODY<<");
        console.log(req.body);

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
            db.insertOne(Item, addedItem, function (flag) {
                res.send(flag);
            });
            return;
        }
        res.status(400).json({ message: error, fields: errorFields });
    },
    getItems: function (req, res) {
        db.findMany(Item, {}, null, function (data) {
            res.status(200).json(data);
        });
    },

    getItem: function (req, res) {
        db.findOne(Item, { code: req.query.code }, {}, async function (data) {
            console.log(req.query);
            res.status(200).json(await data);
        });
    },

    // //TO BE REMOVED:
    // addItemSamples: async function (data) {
    //     await Item.insertMany(data);
    // },
};

export default itemController;
