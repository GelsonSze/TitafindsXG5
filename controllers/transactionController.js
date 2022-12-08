//Controller for items
import Transaction from "../model/schemas/Transaction.js";
import db from "../model/db.js";

const transactionController = {
    // The transaction page
    transactions: function (req, res) {
        res.render("transactions", {
            title: "Transactions",
            styles: ["pages/index.css", "general/w2ui-overrides.css"],
            scripts: ["transaction.js"],
            user: { isAdmin: req.session.user.isAdmin, username: req.session.user.username },
        });
    },

    addTransaction: async function (req, res) {
        try {
            var transItem = {
                date: req.body.date,
                type: req.body.type,
                description: req.body.description,
                quantity: req.body.quantity,
                sellingPrice: req.body.sellingPrice,
                transactedBy: req.body.transactedBy,
                code: req.body.code,
                name: req.body.name,
            };

            console.log("Added transaction: ");
            console.log(transItem);

            db.insertOne(Transaction, transItem, function (data) {
                res.send(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Add Transaction",
                details: error.message,
            });
            return;
        }
    },

    getTransactions: function (req, res) {
        try {
            db.findMany(Transaction, {}, null, function (data) {
                res.status(200).json(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Get Transactions",
                details: error.message,
            });
            return;
        }
    },

    getItemTransactionsById: function (req, res) {
        try {
            db.findMany(Transaction, { description: req.params.id }, {}, async function (data) {
                // console.log(data);
                res.status(200).json(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Get Transaction By Id",
                details: error.message,
            });
            return;
        }
    },

    getXTransactions: function (req, res) {
        try {
            var code = req.params.code;
            var limit = req.params.limit;
            db.findLastX(Transaction, { code: code }, null, limit, function (data) {
                res.status(200).json(data);
            });
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Get Transactions",
                details: error.message,
            });
            return;
        }
    },

    // UNTESTED
    // getTransaction: function (req, res) {
    //     try {
    //         db.findOne(
    //             Transaction,
    //             { description: { $regex: req.query.code, $options: "i" } },
    //             {},
    //             async function (data) {
    //                 res.status(200).json(await data);
    //             }
    //         );
    //     } catch (error) {
    //         res.status(500).json({
    //             message: "Server Error: Get Transaction",
    //             details: error.message,
    //         });
    //         return;
    //     }
    // },

    searchTransactions: function (req, res) {
        try {
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
                            { code: { $regex: search, $options: "i" } },
                            { name: { $regex: search, $options: "i" } },
                        ],
                    },

                    {},
                    function (data) {
                        // console.log(data);
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
                                    { code: { $regex: search, $options: "i" } },
                                    { name: { $regex: search, $options: "i" } },
                                ],
                            },

                            { type: { $regex: type, $options: "i" } },
                        ],
                    },

                    {},
                    function (data) {
                        // console.log(data);
                        res.status(200).json(data);
                    }
                );
            }
        } catch (error) {
            res.status(500).json({
                message: "Server Error: Search Transactions",
                details: error.message,
            });
            return;
        }
    },
};

export default transactionController;
