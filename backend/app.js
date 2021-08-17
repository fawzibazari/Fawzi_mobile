const express = require('express');
const app = express();
require('dotenv/config');
const morgan = require('morgan');
const mongoose = require('mongoose');



const api = process.env.API_URL

//middleware NARUTO 
app.use(express.json());
app.use(morgan('tiny'));

app.get(`${api}/products`, (req, res) =>{
    const product = {
        id: 1,
        name: "hair dresser",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/48/Argentina_celebrando_copa_%28cropped%29.jpg"
    }

    res.send(product);
})

app.post(`${api}/products`, (req, res) =>{
    const newProduct = req.body;
    console.log(newProduct);
    res.send(newProduct);
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