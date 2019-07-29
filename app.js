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

        var remove_file_dest = partner_upload_path + '\\' + result[0].image_path.split("/")[4];
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
    res.render('products');
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