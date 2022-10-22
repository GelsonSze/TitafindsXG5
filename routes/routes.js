import express from 'express';
import itemController from '../controllers/itemController.js'

const app = express();

app.get('/', itemController.getIndex);
app.post('/addItem', itemController.addItem);

export default app;
