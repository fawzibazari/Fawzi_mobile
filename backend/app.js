const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors());


//middleware NARUTO 
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler);

//les routes 
const categoriesRoutes = require('./routers/categories');
const productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');


const api = process.env.API_URL

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);


const Product = require('./models/product');


//connection BDD
mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Fawzi'
})
.then(()=>{
    console.log('connection Réussi');
})
.catch((err) => {
    console.log(err);
})

//serveur
app.listen(3000, ()=>{
    console.log('server de naruto http://localhost:3000');
})