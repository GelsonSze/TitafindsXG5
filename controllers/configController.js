//Controler for attributes
// import Transaction from "../model/schemas/Transaction.js";
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



};

export default configController;