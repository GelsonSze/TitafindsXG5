//Express modules
import express from 'express';
import expresshbs from 'express-handlebars';
import bodyParser from 'body-parser';

//Database module
import mongoose from 'mongoose';
import { connectDB } from './model/db.js';

//Import directory path and url
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//Route modules
import routes from './routes/routes.js';

const app = express();

const port = 3000;//process.env.PORT || 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

//set handlebars as view engine
app.engine("hbs", 
    expresshbs.engine({
        extname: 'hbs',
        defaultLayout: 'main'
    })
);

app.set('view engine', 'hbs');

//set the views folder as view directory
app.set('views', __dirname + '/views');

//assign routes 
app.use('/', routes);

//connect to MongoDB
connectDB();

app.listen(port, function () {
    console.log('Server is running at port: ' + port);
});
