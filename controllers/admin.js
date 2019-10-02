const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(result => {
        console.log('Product Created');
        res.redirect('/admin/products');

    }).catch(err => {
        console.log(err);

    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    if (!editMode) {
        return res.redirect('/')
    }
    req.user.getProducts({ where: { id: prodId } }).
        then(product => {
            product = product[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Products',
                path: '/admin/edit-product',
                editing: true,
                product: product
            });
        }).catch(err => {
            console.log(err);

        });

};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(id, title, imageUrl, description, price);
    Product.findById(id).then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
    }).then(result => {
        console.log('Updated the Product');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);

    });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.findById(id).then(product => {
        return product.destroy();
    }).then(result => {
        console.log('Destroy the Product');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);

    })

};

exports.getProducts = (req, res, next) => {
    req.user.getProducts().
        then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        }).catch(err => {
            console.log(err);

        });
};