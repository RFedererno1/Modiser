// Package requires
var express = require("express");
var ejs = require("ejs");
var path = require("path");
var mongoose = require("mongoose");
var multer = require("multer");
var bodyParser = require('body-parser');
var mime = require('mime');
var fs = require('fs');


var app = express();

// Module requires

var schemas = require('./back_ends/schemas.js');

/////////////////////////
// SETTING UP SECTION //
///////////////////////


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connections //
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/database', { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("Connection succeeded.");
});

//Models from schemas

var partner_db = mongoose.model('partner_db', schemas.partner_schema);

var category_db = mongoose.model('category_db', schemas.CategorySchema);

var product_db = mongoose.model('product_db', schemas.ProductSchema);


// Upload destinations //

var partner_upload_path = path.join(__dirname, 'public/uploads/partners');
var storage_partner = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, partner_upload_path)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
})

var upload_partner = multer({ storage: storage_partner })

var category_upload_path = path.join(__dirname, 'public/uploads/categories');
var storage_category = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, category_upload_path)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
})

var upload_category = multer({ storage: storage_category })

var product_upload_path = path.join(__dirname, 'public/uploads/products');
var storage_product = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, product_upload_path)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
})

var upload_product = multer({ storage: storage_product })

/////////////////////////
//    POST SECTION    //
///////////////////////

app.post("/adm-partners/add", upload_partner.single('image'), function(req, res) {
    var _partner = new partner_db(req.body);
    _partner.image_path = '/static/uploads/partners/' + req.file.filename;

    console.log(_partner);
    _partner.save(function(err) {
        if (err) throw err;
        console.log("New partner saved.");
    })
    res.redirect('/adm-partners');
})

app.post('/remove-partner/id=:id', function(req, res) {

    partner_db.find({ _id: req.params["id"] }, function(err, result) {
        if (err) throw err;

        var remove_file_dest = partner_upload_path + '/' + result[0].image_path.split("/")[4];
        fs.unlink(remove_file_dest, function(error) {
            if (err) throw err;
            console.log("Removed file at path: " + remove_file_dest);
        });
    });

    partner_db.deleteOne({ _id: req.params["id"] }, function(err) {
        if (err) throw err;

        res.sendStatus(200);
    })
})

app.post('/adjust-product/add-category', upload_category.single('imageCategory'), function(req, res) {
    var _category = new category_db(req.body);
    _category.imagePathCategory = '/static/uploads/categories/' + req.file.filename;
    console.log(_category);
    _category.save({})
    res.redirect('/adjust-product');
})

app.post('/remove-category/id=:id', function(req, res) {

    category_db.find({ _id: req.params["id"] }, function(err, result) {
        if (err) throw err;
        var remove_file_dest = category_upload_path + '/' + result[0].imagePathCategory.split("/")[4];
        fs.unlink(remove_file_dest, function(error) {
            if (err) throw err;
            console.log("Removed file at path: " + remove_file_dest);
        });
        if (result[0].ProductCountCategory.length > 0) {
            for (var i = 0; i < result[0].ProductCountCategory.length; i++) {
                product_db.find({ _id: result[0].ProductCountCategory[i] }, function(err, result0) {

                    var remove_file_dest = product_upload_path + '/' + result0[0].ImagePathProduct.split("/")[4];
                    fs.unlink(remove_file_dest, function(error) {
                        if (err) throw err;
                        console.log("Removed file at path: " + remove_file_dest);
                    });
                });

                product_db.deleteOne({ _id: result[0].ProductCountCategory[i] }, function(err) {})
            }
        }
    });

    category_db.deleteOne({ _id: req.params["id"] }, function(err) {
        if (err) throw err;

        res.sendStatus(200);
    })
})

app.post("/adjust-product/add-product", upload_product.single('ImageProduct'), function(req, res) {
    var _product = new product_db(req.body);
    _product.ImagePathProduct = '/static/uploads/products/' + req.file.filename;

    _product.save(function(err) {
        if (err) throw err;
        category_db.update({ _id: _product.CategoryIdProduct }, { $push: { ProductCountCategory: _product._id } }, function(err) {
            if (err) throw err;
        })
        console.log("New product saved.");
    })
    res.redirect('/adjust-product');
})

app.post('/remove-product/id=:id', function(req, res) {

    product_db.find({ _id: req.params["id"] }, function(err, result) {
        if (err) throw err;

        category_db.update({ _id: result[0].CategoryIdProduct }, { $pull: { ProductCountCategory: result[0]._id } }, function(err) {
            if (err) throw err;
        })
        console.log("Product deleted.");

        var remove_file_dest = product_upload_path + '/' + result[0].ImagePathProduct.split("/")[4];
        fs.unlink(remove_file_dest, function(error) {
            if (err) throw err;
            console.log("Removed file at path: " + remove_file_dest);
        });
    });

    product_db.deleteOne({ _id: req.params["id"] }, function(err) {
        if (err) throw err;

        res.sendStatus(200);
    })
})

app.post('/adjust-product/modify-category-id=:id', upload_category.single('imageCategory'), function(req, res) {
    _category = new category_db(req.body);

    if (req.file != undefined) {
        category_db.find({ _id: req.params["id"] }, function(err, result) {
            if (err) throw err;

            if (result[0].imagePathCategory != undefined) {
                var remove_file_dest = category_upload_path + '/' + result[0].imagePathCategory.split("/")[4];
                fs.unlink(remove_file_dest, function(error) {
                    if (err) throw err;
                    console.log("Removed file at path: " + remove_file_dest);
                });
            }
        });

        _category.imagePathCategory = '/static/uploads/categories/' + req.file.filename;
    }

    category_db.update({ _id: req.params["id"] }, _category, function(err) {
        if (err) throw err;
        console.log("Category id " + req.params["id"] + " successfully updated");
    })
    res.redirect('/adjust-product');
});

app.post('/adjust-product/modify-product-id=:id', upload_product.single('ImageProduct'), function(req, res) {
    _product = new product_db(req.body);

    if (req.file != undefined) {
        product_db.find({ _id: req.params["id"] }, function(err, result) {
            if (err) throw err;

            if (result[0].ImagePathProduct != undefined) {
                var remove_file_dest = product_upload_path + '/' + result[0].ImagePathProduct.split("/")[4];
                fs.unlink(remove_file_dest, function(error) {
                    if (err) throw err;
                    console.log("Removed file at path: " + remove_file_dest);
                });
            }
        });

        _product.ImagePathProduct = '/static/uploads/products/' + req.file.filename;
    }

    product_db.update({ _id: req.params["id"] }, _product, function(err) {
        if (err) throw err;
        console.log("Product id " + req.params["id"] + " successfully updated.")
    })
    res.redirect('/adjust-product');
})

/////////////////////////
//     GET SECTION    //
///////////////////////

app.get('/', function(req, res) {
    res.render('front_page');
});


app.get('/about-us', function(req, res) {
    res.render('about_us');
});

app.get('/products', function(req, res) {
    category_db.find({}, function(err, result) {
        if (err) throw err;
        res.render('products', { category: result });
    })
});

app.get('/our-partners', function(req, res) {
    partner_db.find({}, function(err, result) {
        if (err) throw err;
        res.render('our_partners', { partners: result });
    })
});
app.get('/news', function(req, res) {
    res.render('news');
});

app.get('/admin', function(req, res) {
    res.render('admin_sign_in');
});

app.get('/adm-partners', function(req, res) {
    partner_db.find({}, function(err, result) {
        if (err) throw err;
        res.render('adm_partners', { partners: result });
    })
});

app.get('/adjust-product', function(req, res) {
    category_db.find({}, function(err0, result0) {
        if (err0) throw err0;
        product_db.find({}, function(err1, result1) {
            if (err1) throw err1;
            res.render('product_A&R', { category: result0, product: result1 });
        })
    })
});

app.get('/adm-news', function(req, res) {
    res.render('adm_news');
})

app.get('/product-list=:id', function(req, res) {
    var categoryName;
    category_db.find({ _id: req.params["id"] }, function(err, result) {
        if (err) throw err;

        categoryName = result[0].NameCategory;
    });
    product_db.find({}, function(err, result) {
        if (err) throw err;
        res.render('product_list', { products: result, categoryId: req.params["id"], name: categoryName });
    })
});

////////////////////
// Handle Errors //
//////////////////

app.get('/err=:err_name', function(req, res) {
    res.render('error_handler', { message: req.params.err_name })
});




// Handle unknown queries
app.get('/*', function(req, res) {
    res.redirect('/err=unknown-site');
});


////////////////////////////
app.listen(3000);
console.log("Server is listening at port 3000.");