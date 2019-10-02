const Product = require('../models/product');

exports.getAddProduct = (req,res,next) =>{
    res.render('admin/add-products',{
        pageTitle:'Add Products',
        path:'/admin/add-products',
        activeProduct:true,
        productCSS:true,
        formCSS:true
    });
};

exports.postAddProducts = (req,res,next) =>{
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req,res,next) =>{
    Product.fetchAll(products=>{
        console.log(products)
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'Shop',
            path:'/',hasProducts:products.length>0,
            shopActive:true,
            productCSS:true
        });
    });
    
};

exports.cart = (req,res,next) =>{
    res.render('shop/cart',{
        pageTitle:'Cart',
        path:'/cart'
    });
};