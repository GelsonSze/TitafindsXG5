//Controller for items
import Item from "../model/schemas/Item.js";
import db from "../model/db.js";
import { generateItemCode } from "../utils/helper.js";

const itemController = {
    // The dashboard or inventory page
    home: function (req, res) {
        res.render("index", {
            title: "index",
            styles: ["index.css", "w2ui-overrides.css", "popup.css"],
            scripts: ["index.js"],
        });
    },

    // Redirects to home page
    homeRedirect: async function (req, res) {
        res.redirect("/");
    },

    itemDetails: function (req, res) {
        res.render("item", {
            code: req.body.code,
            styles: ["item.css"],
            scripts: ["item.js"],
        });
    },

    // Adds item passed in a post request into the database
    addItem: async function (req, res) {
        var addedItem = {
            image: req.body.image ?? "test.png",
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
        console.log(addedItem);

        db.insertOne(Item, addedItem, function (flag) {
            res.send(flag);
        });
    },
    getItem: function (req, res) {
        db.findMany(Item, {}, null, function (data) {
            res.status(200).json(data);
        });
    },

    //TO BE REMOVED:
    addItemSamples: async function (data) {
        await Item.insertMany(data);
    },
};

export default itemController;
