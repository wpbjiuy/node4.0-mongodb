var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressSession = require('express-session')
var mongoStore = require('connect-mongo')(expressSession)
var mongoose = require('mongoose')
var db = mongoose.connect('mongodb://localhost:27017/cm')
require('./models/model.js')
var app = express()
app.engine('.html', require('ejs').__express)
app.set('views', __dirname + '/views')
app.set('view engine','html')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressSession({
    secret:'SECRET',
    cookie:{maxAge: 60*60*1000},
    store:new mongoStore({
        // db:mongoose.connection.db,
        // collection:'users'
        url:'mongodb://localhost:27017/cm'
    })
}))
require('./routes.js')(app)
app.listen(80)