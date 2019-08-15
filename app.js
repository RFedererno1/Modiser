// Package requires
var express = require("express");
var ejs = require("ejs");
var path = require("path");
var mongoose = require("mongoose");
var multer = require("multer");
var bodyParser = require('body-parser');
var mime = require('mime');
var fs = require('fs');
var crypto = require('crypto');
const argon2 = require('argon2');
const session = require('express-session');
const flash = require('flash');
const MongoStore = require('connect-mongo')(session);

const port = process.env.PORT || 3000;

var app = express();

// Module requires

var schemas = require('./back_ends/schemas.js');

/////////////////////////
// SETTING UP SECTION //
///////////////////////


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Database Connections //
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://cutiakg123:02032014n@database-pd4ta.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("Connection succeeded.");
});


// Configure app
app.use(express.json());
app.use(session({
    secret: 'chouchou-4',
    cookie: { maxAge: 300000 },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const secret = 'abcdefg';


//Models from schemas

var partner_db = mongoose.model('partner_db', schemas.partner_schema);

var category_db = mongoose.model('category_db', schemas.CategorySchema);

var product_db = mongoose.model('product_db', schemas.ProductSchema);

var news_db = mongoose.model('news_db', schemas.news_schema);

var account_db = mongoose.model('account_db', schemas.account_schema);

var about_us_db = mongoose.model('about_us_db', schemas.about_us_schema);

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

var news_upload_path = path.join(__dirname, 'public/uploads/news');
var storage_news = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, news_upload_path)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
})

var upload_news = multer({ storage: storage_news });

var about_us_upload_path = path.join(__dirname, 'public/uploads/aboutUs');
var storage_about_us = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, about_us_upload_path)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
})

var upload_about_us = multer({ storage: storage_about_us })
    /////////////////////////
    //    POST SECTION    //
    ///////////////////////

app.post('/admin/login', function(req, res) {
    account_db.findOne({ email: req.body.email }, async function(err, user) {
        if (!user) {
            req.flash('msg', 'User not found!');
        } else {
            try {
                if (await argon2.verify(user.password, req.body.password)) {
                    console.log(req.session)
                    req.session.email = user.email;
                } else {
                    req.flash('msg', 'Incorrect Password!');
                }
            } catch (err) {
                console.log(err);
            }
        }
        res.redirect('/admin');
    });
})

app.post("/admin/adm-partners/add", upload_partner.single('image'), function(req, res) {
    var _partner = new partner_db(req.body);
    _partner.image_path = '/static/uploads/partners/' + req.file.filename;

    console.log(_partner);
    _partner.save(function(err) {
        if (err) throw err;
        console.log("New partner saved.");
    })
    res.redirect('/admin/adm-partners');
})

app.post('/admin/remove-partner/id=:id', function(req, res) {

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

app.post('/admin/adm-products/add-category', upload_category.single('imageCategory'), function(req, res) {
    var _category = new category_db(req.body);
    _category.imagePathCategory = '/static/uploads/categories/' + req.file.filename;
    console.log(_category);
    _category.save({})
    res.redirect('/admin/adm-products');
})

app.post('/admin/remove-category/id=:id', function(req, res) {

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

app.post("/admin/adm-products/add-product", upload_product.single('ImageProduct'), function(req, res) {
    var _product = new product_db(req.body);
    _product.ImagePathProduct = '/static/uploads/products/' + req.file.filename;

    _product.save(function(err) {
        if (err) throw err;
        category_db.update({ _id: _product.CategoryIdProduct }, { $push: { ProductCountCategory: _product._id } }, function(err) {
            if (err) throw err;
        })
        console.log("New product saved.");
    })
    res.redirect('/admin/adm-products');
})

app.post('/admin/remove-product/id=:id', function(req, res) {

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

app.post('/admin/adm-products/modify-category-id=:id', upload_category.single('imageCategory'), function(req, res) {
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
    res.redirect('/admin/adm-products');
});

app.post('/admin/adm-products/modify-product-id=:id', upload_product.single('ImageProduct'), function(req, res) {
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
    res.redirect('/admin/adm-products');
})

app.post('/admin/adm-news/add', upload_news.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'image', maxCount: 999 }]), function(req, res) {
    _news = new news_db(req.body);

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var d = new Date();
    _news.upload_date = days[d.getDay()] + ", " + month[d.getMonth()] + " - " + d.getDate() + " - " + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    _news.thumbnail_path = '/static/uploads/news/' + req.files['thumbnail'][0].filename;
    if (req.files['image']) {
        for (var i = 0; i < req.files['image'].length; i++) {
            _news.news_image_path.push('/static/uploads/news/' + req.files['image'][i].filename);
        }
    }

    _news.query = crypto.createHmac('sha256', secret).update(_news.title).digest('hex') + '_' + Date.now();
    _news.save(function(err) {
        if (err) throw err;
        console.log("News saved.");
    });
    setTimeout(() => {
        res.redirect('/admin/adm-news');
    }, 1000);
})

app.post('/admin/adm-news/remove-id=:id', function(req, res) {

    news_db.find({ _id: req.params["id"] }, function(err, result) {

        var remove_file_dest = [];
        remove_file_dest.push(news_upload_path + '/' + result[0].thumbnail_path.split("/")[4]);
        if (result.news_image_path) {
            for (var i = 0; i < result.news_image_path.length; i++) {
                remove_file_dest.push(news_upload_path + '/' + result[0].news_image_path[i].split("/")[4]);
            }
        }
        remove_files(remove_file_dest, console.log);
    });

    news_db.deleteOne({ _id: req.params["id"] }, function(err) {
        if (err) throw err;

        res.sendStatus(200);
    })
});

app.post("/admin/adm-news/manage-news-id=:id", upload_news.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'image', maxCount: 999 }]), function(req, res) {
    _news = new news_db(req.body);
    var flow = req.body.flow;
    if (flow == undefined) flow = "a";
    console.log(req.files);
    console.log(_news);
    news_db.find({ _id: req.params["id"] }, function(err, origin) {
        console.log(origin[0]);
        // Image management...
        var remove_file_dest = [];

        // Variable for counting image in images
        var image_count = 0;

        // Variable for counting new images from the clients
        var new_img_count = 0;

        // If there is new thumbnail, update it first
        if (req.body.flow.split('_')[0] == "thumbnail") {
            remove_file_dest.push(news_upload_path + '/' + origin[0].thumbnail_path.split("/")[4]);
            _news.thumbnail_path = '/static/uploads/news/' + req.files["thumbnail"][0].filename;
        }


        if (_news.order) {
            if (origin[0].order) {
                var images = origin[0].order.split('_');
                // Iterate through every old images and see if they're updated or deprecated
                for (var i = 0; i < images.length; i++) {
                    if (images[i][0] == "i") {
                        console.log(image_count);
                        console.log(origin[0].news_image_path[image_count].split("/")[4]);
                        // If they can be stayed...
                        if (!req.body.flow.includes(images[i]) && _news.order.includes(images[i])) {
                            _news.news_image_path.push(origin[0].news_image_path[image_count]);

                            // Else, remove them
                        } else {
                            remove_file_dest.push(news_upload_path + origin[0].news_image_path[image_count].split("/")[4]);
                            // Yet if they're updated...
                            if (req.body.flow.includes(images[i])) {
                                _news.news_image_path.push('/static/uploads/news/' + req.files["image"][new_img_count++].filename);
                            }
                        }
                        image_count++;
                    }
                }
            }
            // And check if there is new images
            if (req.files["image"])
                if (new_img_count < req.files["image"].length) {
                    for (var i = new_img_count; i < req.files["image"].length; i++) {
                        _news.news_image_path.push('/static/uploads/news/' + req.files["image"][new_img_count++].filename);
                    }
                }
        } else {
            if (origin[0].order) {
                var images = origin[0].order.split('_');
                for (var i = 0; i < images.length; i++) {
                    if (images[i][0] == "i") {
                        remove_file_dest.push(origin[0].news_image_path[i]);
                    }
                }
            }
        }

        // Remove all unnecessary files
        remove_files(remove_file_dest, console.log);


        // Update the news
        news_db.update({ _id: req.params["id"] }, _news, function(err) {
            if (err) throw err;
            console.log("News is updated.");
        })
    });

    res.redirect('/admin/adm-news');
})

app.post('/search-page', function(req, res) {
    var thingsToFind = req.body.f.split(" ");
    thingsToFindMerge = thingsToFind.join("|");
    category_db.find({ NameCategory: { $regex: thingsToFindMerge, $options: 'i' } }, 'NameCategory ProductCountCategory _id', function(err, categories) {
        if (err) throw err;
        var productId = [];
        k = 0;
        for (var i = 0; i < categories.length; i++) {
            for (j = 0; j < categories[i].ProductCountCategory.length; j++) {
                productId[k] = categories[i].ProductCountCategory[j];
                k++;
            }
        }
        product_db.find({ '_id': { $in: productId } }, function(err1, product) {
            if (err1) throw err1;
            category_db.count({}, function(err, count) {
                if (err) throw err;
                if (count > categories.length) {
                    category_db.find({ NameCategory: { $not: { $regex: thingsToFindMerge, $options: 'i' } } }, 'NameCategory ProductCountCategory _id', function(err, notCategory) {
                        if (err) throw err;
                        var notProductId = []
                        for (var i = 0; i < notCategory.length; i++) {
                            if (i == 0) {
                                notProductId = notProductId + notCategory[i].ProductCountCategory;
                            } else notProductId = notProductId + ',' + notCategory[i].ProductCountCategory;
                        }
                        var productToFind = notProductId.split(",");
                        product_db.find({ _id: productToFind, $or: [{ NameProduct: { $regex: thingsToFindMerge, $options: 'i' } }, { OriginProduct: { $regex: thingsToFindMerge, $options: 'i' } }, { BarcodeProduct: { $regex: thingsToFindMerge, $options: 'i' } }, { DescriptionProduct: { $regex: thingsToFindMerge, $options: 'i' } }] }, 'NameProduct OriginProduct BarcodeProduct DescriptionProduct ImagePathProduct CategoryIdProduct', function(err, notproduct) {
                            if (err) throw err;
                            partner_db.find({ $or: [{ type: { $regex: thingsToFindMerge, $options: 'i' } }, { name: { $regex: thingsToFindMerge, $options: 'i' } }] }, '_id type name image_path', function(err, partner) {
                                if (err) throw err;
                                news_db.find({ $or: [{ title: { $regex: thingsToFindMerge, $options: 'i' } }, { summary: { $regex: thingsToFindMerge, $options: 'i' } }, { news_text: { $regex: thingsToFindMerge, $options: 'i' } }] }, 'title upload_date thumbnail_path summary order news_text news_image_path query', function(err, news) {
                                    if (err) throw err;
                                    res.render('search_page', { category: categories, products: product, notCategory: notCategory, notproduct: notproduct, partner: partner, news: news });
                                });
                            });
                        });
                    });
                }
            })
        });
    });
})

app.post("/admin/adm-about-us/modify", upload_about_us.fields([{ name: 'introductionImage', maxCount: 1 }, { name: 'founderImage', maxCount: 1 }]), function(req, res) {
        _aboutUs = new about_us_db(req.body);
        let temp_aboutUs = _aboutUs.toObject();
        delete temp_aboutUs._id;
        var remove_file_dest = [];
        about_us_db.find({}, function(err, docs) {
            if (err) throw err;
            if (req.files["introductionImage"] != undefined) {
                remove_file_dest.push(about_us_upload_path + '/' + docs[0].introductionImagePath.split("/")[4]);
                temp_aboutUs.introductionImagePath = '/static/uploads/aboutUs/' + req.files["introductionImage"][0].filename;
            }
            if (req.files["founderImage"] != undefined) {
                remove_file_dest.push(about_us_upload_path + '/' + docs[0].founderImagePath.split("/")[4]);
                temp_aboutUs.founderImagePath = '/static/uploads/aboutUs/' + req.files["founderImage"][0].filename;
            }
            about_us_db.update({ _id: docs[0]._id }, temp_aboutUs, function(err) {
                if (err) throw err;
            })
            remove_files(remove_file_dest, console.log);
        });
        res.redirect('/admin/adm-about-us');
    })
    /////////////////////////
    //     GET SECTION    //
    ///////////////////////

app.get('/', function(req, res) {
    partner_db.find({}, function(err, docs) {
        if (err) throw err;
        res.render('front_page', { partners: docs });
    })
});


app.get('/about-us', function(req, res) {
    about_us_db.find({}, function(err, result) {
        if (err) throw err;
        res.render('about_us', { aboutUs: result });
    })
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
    if (!req.session.email) {
        var message;
        if (res.locals.flash[0] != undefined)
            message = res.locals.flash[0].message;

        if (message != undefined)
            res.render('admin_sign_in', { message: message });
        else
            res.render('admin_sign_in', { message: undefined });
    } else {
        res.render('admin_management', { message: undefined });
    }
});

app.get('/admin/adm-partners', function(req, res) {
    if (req.session.email) {
        partner_db.find({}, function(err, result) {
            if (err) throw err;
            res.render('adm_partners', { partners: result });
        })
    } else {
        res.redirect('/err=access-denied');
    }
});

app.get('/admin/adm-products', function(req, res) {
    if (req.session.email) {
        category_db.find({}, function(err0, result0) {
            if (err0) throw err0;
            product_db.find({}, function(err1, result1) {
                if (err1) throw err1;
                res.render('product_A&R', { category: result0, product: result1 });
            })
        })
    } else {
        res.redirect('/err=access-denied');
    }
});

app.get('/admin/adm-news', function(req, res) {
    if (req.session.email) {
        res.render('adm_news');
    } else {
        res.redirect('/err=access-denied');
    }
})


app.get('/get-news/f-id=:id', function(req, res) {
    news_db.find({ _id: { $lt: req.params["id"] } }).sort({ _id: -1 }).limit(5).exec(function(err, result) {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/news/:query', function(req, res) {
    news_db.find({ query: req.params["query"] }, function(err, docs) {
        if (err) throw err;
        if (docs.length != 0) {
            res.render('news_detail', { detail: docs });
        } else {
            res.redirect('/err=unknown-site');
        }
    })
})

app.get('/admin/adm-news/query=:query', function(req, res) {
    if (req.session.email) {
        news_db.find({ query: req.params["query"] }, function(err, docs) {
            if (err) throw err;
            console.log(docs);
            if (docs.length != 0) {
                res.render('manage_news', { detail: docs });
            } else {
                res.redirect('/err=unknown-site');
            }
        })
    } else {
        res.redirect('/err=access-denied');
    }

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

app.get('/search-page', function(req, res) {
    res.render('search_page');
})

app.get('/admin/adm-about-us', function(req, res) {
    if (req.session.email) {
        about_us_db.find({}, function(err, docs) {
            if (err) throw err;
            console.log(docs);
            res.render('about_us_M', { docs: docs });
        })
    } else {
        res.redirect('/err=access-denied');
    }
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
app.listen(port);
console.log("Server is listening at port " + port + ".");

///////////////////////////
//// FUNCTION SECTION ////
/////////////////////////

function remove_files(files, callback) {
    if (files != undefined) {
        var i = files.length;
        files.forEach(element => {
            fs.unlink(element, function(err) {
                i--;
                if (err) {
                    callback(err);
                    return;
                } else if (i <= 0) {
                    callback(null);
                }
            })
        });
    }
}