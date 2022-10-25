import express from 'express';
import itemController from '../controllers/itemController.js'
const app = express();

app.get('/', itemController.getIndex);
app.post('/addItem', itemController.addItem);
app.get('/showTable',itemController.showTable);
export default app;
