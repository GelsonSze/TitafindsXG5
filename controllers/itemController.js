//Controller for items
import Item from "../model/schemas/item.js";
import db from "../model/db.js";
import { generateItemCode } from "../utils/helper.js";

const itemController = {
    // The dashboard or inventory page
    home: function (req, res) {
        res.render("index", {
            title: "index",
            styles: ["index.css", "w2ui-overrides.css", "popup.css"],
            scripts: ["index.js", "popup.js"],
        });
    },

    // Redirects to home page
    homeRedirect: function (req, res) {
        res.redirect("/");
    },

    // Adds item passed in a post request into the database
    addItem: async function (req, res) {
        var addedItem = {
            image: req.body.image ?? "test.png",
            code: generateItemCode(req.body.type),
            name: req.body.name,
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
};

export default itemController;
