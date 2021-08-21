const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('mauvais type de image');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });


router.get(`/`, async (req, res) =>{ 
    //http://localhost:3000/api/v1/products?categories=611d0c8bacd7c64388592210,611da9cbbd2c3250316c4ee8
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category'); //.select('name') 

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

router.post(`/`, uploadOptions.single('image'), async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Category invalid') // la je suis entrain de checker si tout est bon pour valider
    const file = req.file;
    if (!file) return res.status(400).send('ya pas une image');
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
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
    if(!category) return res.status(400).send('Category invalide') // la je suis entrain de checker si tout est bon pour valider

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Produit invalide');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }


    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        }, {new: true}
    )
    if(!updatedProduct)
    return res.status(404).send('le produit peut pas etre modifier ')

    res.send(updatedProduct);
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

//j'ai créer cette fonction la pour le front pour mettre en avance des prouits sur la page d'acceuil
router.get(`/get/featured/:count`, async (req, res) =>{   
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count)

    if(!products) {
        res.status(500).json({success: false})
    } 
    res.send(products);
})


router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Id de produit invalid');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!product) return res.status(500).send('la gallery peut pas etre mis a jour');

    res.send(product);
});
module.exports =router;