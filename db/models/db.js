// Database model
import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/TitafindsXG5'; //process.env.MONGODB_URI || 'mongodb://localhost:27017/TitafindsXG5';

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

export const connectDB = async () => {
    try{
        await mongoose.connect(url, options);
        
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", function () {
            console.log("Database connected successfully");
        });
        console.log('Connected to: ' + url);

    } catch(error){
        console.log(error);
    }
}