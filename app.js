const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const app = express();
const sessionStore = new MongoSessionStore({
    uri: 'mongodb+srv://Chennai:Andymama1@cluster0-kvh0o.mongodb.net/Research-pedic?retryWrites=true&w=majority',
    collection: 'sessions'
});

const studiesRoutes = require('./routes/studies');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const mainViewRoute = require('./routes/mainView');

const User = require('./models/Users');
const Admin = require('./models/Admin');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: '925Sr66ik7ris06hn92a',
cookie: {maxAge: 1000*60*60*24}, resave: false, saveUninitialized: false, store: sessionStore}));

app.use(function(req, res, next) {
    if(req.session.admin_id) {
        Admin.findById(req.session.admin_id)
        .then(function(admin) {
            req.session.admin = admin;
            next();
        })
        .catch(function(err) {
            console.log(err);
        });
    } else next();
});

app.use(function(req, res, next) {
    if(req.session.user_id) {
        User.findOne({_id: req.session.user_id})
        .then(function(user) {
            req.session.user = user; 
            next();
        })
        .catch(function(err) {
                throw err;
        });
    } else next();
});

app.use('/admin', adminRoutes);

app.use('/all-researches', studiesRoutes);

app.use('/user', usersRoutes);

app.use('/', mainViewRoute);

mongoose
    .connect('mongodb+srv://Chennai:Andymama1@cluster0-kvh0o.mongodb.net/Research-pedic?retryWrites=true&w=majority', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true})
    .then(function(res) {
        app.listen(3050);
    })
    .catch(function(err) {
        throw err;
    });