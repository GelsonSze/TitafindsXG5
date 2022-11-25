// Database model
import mongoose from "mongoose";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/TitafindsXG5";

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

const db = {
    connectDB: async () => {
        try {
            await mongoose.connect(url, options);

            const db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error: "));
            db.once("open", function () {
                console.log("Database connected successfully");
            });
            console.log("Connected to: " + url);
        } catch (error) {
            console.log(error);
        }
    },

    insertOne: function (model, doc, callback) {
        const newDoc = new model(doc);
        newDoc.save(function (err, doc) {
            if (err) {
                console.log(err);
                return;
            }
            callback(doc);
        });

        // model.create(doc, function(error, result) {
        //     if(error) return callback(false);
        //     console.log('Added ' + result);
        //     return callback(true);
        // });
    },

    insertMany: function (model, docs, callback) {
        model.insertMany(docs, function (error, result) {
            if (error) return callback(false);
            console.log("Added " + result);
            return callback(true);
        });
    },

    findById: function (model, id, projection, callback) {
        model.findById(id, projection, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
    },

    findOne: function (model, query, projection, callback) {
        model.findOne(query, projection, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
    },

    findMany: function (model, query, projection, callback) {
        model.find(query, projection, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
    },

    findLastX: function (model, query, projection, limit, callback) {
        model
            .find(query, projection, function (error, result) {
                if (error) return callback(false);
                return callback(result);
            })
            .sort({ _id: -1 })
            .limit(limit);
    },

    updateOne: function (model, filter, update, callback) {
        model.updateOne(filter, update, function (error, result) {
            if (error) return callback(false);
            console.log("Document modified: " + result.nModified);
            return callback(true);
        });
    },

    updateMany: function (model, filter, update, callback) {
        model.updateMany(filter, update, function (error, result) {
            if (error) return callback(false);
            console.log("Documents modified: " + result.nModified);
            return callback(true);
        });
    },

    deleteOne: function (model, conditions, callback) {
        model.deleteOne(conditions, function (error, result) {
            if (error) return callback(false);
            console.log("Document deleted: " + result.deletedCount);
            return callback(true);
        });
    },

    deleteMany: function (model, conditions, callback) {
        model.deleteMany(conditions, function (error, result) {
            if (error) return callback(false);
            console.log("Document deleted: " + result.deletedCount);
            return callback(true);
        });
    },
};

function signalHandler() {
    console.log("Closing MongoDB connection...");
    mongoose.connection.close();
    process.exit();
}

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);
process.on("SIGQUIT", signalHandler);

export default db;
