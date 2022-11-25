// Environment module
import "dotenv/config";

// Express modules
import express from "express";
import expresshbs from "express-handlebars";
import morgan from "morgan";
import helmet from "helmet";
import { expressCspHeader } from "express-csp-header";
import session from "express-session";
import passport from "passport";
import connectMongo from "connect-mongo";
import mongoSanitize from "express-mongo-sanitize";
import { EventEmitter } from "events";

// Database module
import db from "./model/db.js";

// Import directory path and url
import { fileURLToPath } from "url";
import { dirname } from "path";

//Route modules
import routes from "./routes/routes.js";

//limit EventEmitter to 100
EventEmitter.defaultMaxListeners = 100;

const app = express();

const port = process.env.PORT || 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(__dirname + "/public"));

// Set handlebars as the app's view engine.
app.engine(
    "hbs",
    expresshbs.engine({
        extname: "hbs",
        defaultLayout: "main",
    })
);

// Set express' default file extension for views as .hbs
app.set("view engine", "hbs");

// Set the directory for the views
app.set("views", __dirname + "/views");

// Use helmet to secure Express headers
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));

// Use morgan to log HTTP requests
app.use(morgan("dev"));

// Use express-csp-header to secure Express headers
app.use(
    expressCspHeader({
        policies: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "https://kit.fontawesome.com/e5cabd2361.js"],
        },
    })
);

// Use express-session to manage sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        maxAge: new Date(Date.now() + 3600000),
        store: connectMongo.create({ mongoUrl: process.env.MONGODB_URI }),
    })
);

// Use passport to manage authentication
app.use(passport.initialize());
app.use(passport.session());

// Use express-mongo-sanitize to sanitize data
app.use(mongoSanitize());

// Assign routes
app.use("/", routes);

// 404 not found page
app.use((req, res, err) => {
    res.status(404).render("404", {
        title: "404 Not Found",
        styles: ["pages/404.css"],
    });
});

// Connect to MongoDB
db.connectDB();

//setup for image upload and indicates where image should be saved

app.listen(port, function () {
    console.log("Server is running at port: " + port);
});

// Get samples
import sample from "./sample/samples.js";

if (process.env.NODE_ENV === "development") {
    sample.initializeSamples();
}
