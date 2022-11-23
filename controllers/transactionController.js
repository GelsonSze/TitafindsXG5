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
        var transItem = {
            date: req.body.date,
            type: req.body.type,
            description: req.body.desc,
            quantity: req.body.qty,
            sellingPrice: req.body.sellingPrice,
            transactedBy: req.body.transactedBy
        }

        console.log('Added transaction: ')
        console.log(transItem)

        db.insertOne(Transaction, transItem, function (data) {
            res.send(data);
        });
    },

    getTransactions: function (req, res) {
        db.findMany(Transaction, {}, null, function (data) {
            res.status(200).json(data);
        });
    },

    getXTransactions: function (req, res) {
        var code = req.params.code
        var limit = req.params.limit
        db.findLastX(Transaction, {description: {$regex:code, $options: 'i'}}, {}, limit, function(data) {
            
            res.status(200).json(data);
        })
    },

    // UNTESTED
    getTransaction: function (req, res) {
        db.findOne(Transaction, {description: {$regex:req.query.code, $options: 'i'}}, {}, async function(data) {

            console.log(req.query)
            res.status(200).json(await data);
        })

    },

    searchTransactions: function (req, res) {
        var search = req.params.search
        var type = req.params.type
        console.log(req.params)

        if (search == 'empty') {search = ''}

        if (type == 'Type')
        {
            db.findMany(Transaction, 
                {$or: [
                    { description: {$regex: search, $options: 'i'} },
                    { name:        {$regex: search,   $options: 'i'} },
                    
                ]},
            
                {}, function(data) 
                {
                console.log(data)
                res.status(200).json(data);
                }
            )
        }
        else
        {
            db.findMany(Transaction, 
                {$and: [
                    {$or: [
                        { description: {$regex: search, $options: 'i'} },
                        { name:        {$regex: search, $options: 'i'} },
                        
                    ]},
        
                    { type:        {$regex: type,   $options: 'i'}}
                ]}, 
            
                {}, function(data) 
                {
                console.log(data)
                res.status(200).json(data);
                }
            )
        }
        
    }


};

export default transactionController;
