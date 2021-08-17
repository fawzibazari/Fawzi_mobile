const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');



const api = process.env.API_URL

//middleware NARUTO 
app.use(express.json());
app.use(morgan('tiny'));

const productSchema = mongoose.Schema ({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, (req, res) =>{
    const product = {
        id: 1,
        name: "hair dresser",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/48/Argentina_celebrando_copa_%28cropped%29.jpg"
    }

    res.send(product);
})

app.post(`${api}/products`, (req, res) =>{
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,

    });

    product.save().then((createdProduct => {
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error: err,
            success: false
        })

    })
}) 

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

app.listen(3000, ()=>{
    console.log('server de naruto http://localhost:3000');
})