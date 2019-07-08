// Package requires
var express = require("express");
var ejs = require("ejs");
var path = require("path");


var app = express();

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
})

app.get('/products', function(req, res) {
    res.render('products');
})
app.get('/our-partners', function(req, res) {
    res.render('our_partners');
})
app.get('/news', function(req, res) {
    res.render('news');
})


////////////////////////////
app.listen(3000);
console.log("Server is listening at port 3000.");