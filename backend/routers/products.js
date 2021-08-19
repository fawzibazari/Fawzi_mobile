const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) =>{  //mon get de tout les produit 
    const productList = await Product.find(); //.select('name') 

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})

router.get(`/:id`, async (req, res) =>{  //mon get pour un seul produit 
    const product = await Product.findById(req.params.id).populate('category'); // j'ai mis params parceque le parametre et dans l'url

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
})

router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Category invalid') // la je suis entrain de checker si tout est bon pour valider

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save();
    
    if(!product)
    return res.status(500).send('Produits pas créer')

    res.send(product);
})

router.put(`/:id`, async (req, res) =>{
   if (!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send('Mauvais id')

   }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Category invalid') // la je suis entrain de checker si tout est bon pour valider

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        }, {new: true}
    )
    if(!product)
    return res.status(404).send('le produit peut pas etre modifier ')

    res.send(product);
})

router.delete('/:id', (req, res) =>{ 
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'categorie supprimmer'})
        } else {
            return res.status(404).json({success: false, message: 'categorie pas trouver'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})

    })
})

router.get(`/get/count`, async (req, res) =>{  
    const productCount = await Product.countDocuments((count) => count )

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
})

module.exports =router;