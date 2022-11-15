//Controller for items
import Transaction from "../model/schemas/Transaction.js";
import db from "../model/db.js";

const transactionController = {
    // The transaction page
    transactions: function (req, res) {
        res.render("transactions", {
            title: "index",
            styles: ["index.css", "w2ui-overrides.css", "popup.css"],
            scripts: ["transaction.js"],
        });
    },

    addTransaction: async function (req, res) {
        var transItem = {
            date: req.body.date,
            type: req.body.type,
            desc: req.body.desc,
             qty: req.body.quantity,
            sellingPrice: req.body.sellingPrice,
            transactedBy: req.body.transactedBy
        }

        console.log('Added transaction: ')
        console.log(transItem)

        db.insertOne(Transaction, transItem, function (flag) {
            res.send(flag);
        });
    },

    getTransactions: function (req, res) {
        db.findMany(Transaction, {}, null, function (data) {
            res.status(200).json(data);
        });
    },

    // UNTESTED
    getTransaction: function (req, res) {
        db.findOne(Transaction, {description: {$regex:req.query.code, $options: 'i'}}, {}, async function(data) {

            console.log(req.query)
            res.status(200).json(await data);
        })

    },

};

export default transactionController;
