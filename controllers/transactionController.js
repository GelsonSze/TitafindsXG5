//Controller for items
import Transaction from "../model/schemas/Transaction.js";
import db from "../model/db.js";

const transactionController = {
    // The transaction page
    transactions: function (req, res) {
        res.render("transactions", {
            title: "Transactions",
            styles: ["index.css", "w2ui-overrides.css"],
            scripts: ["transaction.js"],
        });
    },

    addTransaction: async function (req, res) {
        try {
            //check if session user exist, if not return error
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }
            var transItem = {
                date: req.body.date,
                type: req.body.type,
                description: req.body.desc,
                quantity: req.body.qty,
                sellingPrice: req.body.sellingPrice,
                transactedBy: req.body.transactedBy,
            };

            console.log("Added transaction: ");
            console.log(transItem);

            db.insertOne(Transaction, transItem, function (data) {
                res.send(data);
            });
        } catch (err) {
            res.status(500).json(err);
            return;
        }
    },

    getTransactions: function (req, res) {
        try {
            //check if session user exist, if not return error
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }

            db.findMany(Transaction, {}, null, function (data) {
                res.status(200).json(data);
            });
        } catch (err) {
            res.status(500).json(err);
            return;
        }
    },
    // UNTESTED
    getTransaction: function (req, res) {
        try {
            //check if session user exist, if not return error
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }

            db.findOne(
                Transaction,
                { description: { $regex: req.query.code, $options: "i" } },
                {},
                async function (data) {
                    console.log(req.query);
                    res.status(200).json(await data);
                }
            );
        } catch (err) {
            res.status(500).json(err);
            return;
        }
    },

    searchTransactions: function (req, res) {
        try {
            if (!req.session.user) {
                res.status(400).json({ error: "User not logged in" });
                return;
            }

            var search = req.params.search;
            var type = req.params.type;
            console.log(req.params);

            if (search == "empty") {
                search = "";
            }

            if (type == "Type") {
                db.findMany(
                    Transaction,
                    {
                        $or: [
                            { description: { $regex: search, $options: "i" } },
                            { name: { $regex: search, $options: "i" } },
                        ],
                    },

                    {},
                    function (data) {
                        console.log(data);
                        res.status(200).json(data);
                    }
                );
            } else {
                db.findMany(
                    Transaction,
                    {
                        $and: [
                            {
                                $or: [
                                    { description: { $regex: search, $options: "i" } },
                                    { name: { $regex: search, $options: "i" } },
                                ],
                            },

                            { type: { $regex: type, $options: "i" } },
                        ],
                    },

                    {},
                    function (data) {
                        console.log(data);
                        res.status(200).json(data);
                    }
                );
            }
        } catch (err) {
            res.status(500).json(err);
            return;
        }
    },
};

export default transactionController;
