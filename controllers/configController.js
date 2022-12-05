//Controler for attributes
import Attribute from "../model/schemas/Attribute.js";
import db from "../model/db.js";

const configController = {
    // The config page
    configurations: function (req, res) {
        res.render("configurations", {
            title: "Configurations",
            styles: ["pages/configurations.css"],
            scripts: ["configurations.js"],
            user: { isAdmin: req.session.user.isAdmin, username: req.session.user.username },
        })
    },

    addAttribute: async function (req, res) {
        console.log(req.body)
        console.log(req.query)
        try {
            var newAttrib = {
                name: req.body.name,
                dataType: req.body.dataType,
                options: req.body.options,
            };

            console.log("Added attribute: ");
            console.log(newAttrib);

            db.insertOne(Attribute, newAttrib, function (data) {
                res.send(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Add Attribute",
                details: error.message,
            });
            return;
        }
    },

    getAttributes: async function (req, res) {
        try {
            db.findMany(Attribute, {}, null, function (data) {
                res.status(200).json(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Get Attributes",
                details: error.message,
            });
            return;
        }
    }

};

export default configController;