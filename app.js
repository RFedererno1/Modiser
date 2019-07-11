// Package requires
var express = require("express");
var ejs = require("ejs");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');


var app = express();

// Module requires

var schemas = require('./back_ends/schemas.js');

/////////////////////////
// SETTING UP SECTION //
///////////////////////


app.use('/static', express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/////////////////////////
//    POST SECTION    //
///////////////////////



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
    res.render('our_partners');
});
app.get('/news', function(req, res) {
    res.render('news');
});

app.get('/admin', function(req, res) {
    res.render('admin_sign_in');
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