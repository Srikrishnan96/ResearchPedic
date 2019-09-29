const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoConnect = require('./utilities/database').mongoConnect;
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const getDb = require('./utilities/database').getDb;
const ObjectId = require('mongodb').ObjectID; 

const app = express();
const sessionStore = new MongoSessionStore({
    uri: 'mongodb+srv://Chennai:Andymama1@cluster0-kvh0o.mongodb.net/Research-pedic?retryWrites=true&w=majority',
    collection: 'sessions'
});

const studiesRoutes = require('./routes/studies');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const mainViewRoute = require('./routes/mainView');

const Users = require('./models/Users');
const Admin = require('./models/Admin');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: '925Sr66ik7ris06hn92a',
cookie: {maxAge: 1000*60*60*24}, resave: false, saveUninitialized: false, store: sessionStore}));

app.use(function(req, res, next) {
    if(req.session.admin_id) {
        const db = getDb();
        db.collection('adminUser').findOne({_id: new ObjectId(req.session.admin_id)})
        .then(function(admin) { 
            const {userName, email, password, _id, postedStudies} = admin;
            req.session.admin = new Admin(userName, email, password, postedStudies, _id);
            next();
        })
        .catch(function(err) {
                console.log(err);
        });
    }
    else {
        next();
    }
});

app.use(function(req, res, next) {
    if(req.session.user_id) {
        const db = getDb();
        db.collection('users').findOne({_id: new ObjectId(req.session.user_id)})
        .then(function(user) { 
            const {userName, email, password, _id, registeredStudies} = user
            req.session.user = new Users(userName, email, password, _id, registeredStudies);
            next();
        })
        .catch(function(err) {
                throw err;
        });
    }
    else {
        next();
    }
});

app.use('/admin', adminRoutes);

app.use('/all-researches', studiesRoutes);

app.use('/user', usersRoutes);

app.use('/', mainViewRoute);

mongoConnect(()=>{
    app.listen(3040);
});