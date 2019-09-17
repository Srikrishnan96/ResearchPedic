const getDb = require('../utilities/database').getDb;
const ObjectId = require('mongodb').ObjectId;

module.exports = class User {
    constructor(userName, password, email, m_id, registeredStudies) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.registeredStudies = registeredStudies?registeredStudies:[];
        this._id = m_id?new ObjectId(m_id):null;
    }

    addUser() {
        const db = getDb();
        db.collection('users').insertOne(this)
        .catch(err => {
            throw err;
        })
    }

    static findUser(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new ObjectId(userId)}).catch(err => { throw err; })
    }

    static userValidationCreation({userName, email, password}) {
        const db = getDb();
        db.collection('users').findOne({email: email}).then( user => {
            if(user) {
                console.log('user already exists');
            } else {
                let newUser = new User(userName, password, email);
                newUser.addUser();
            }
        })
    }

    mySurveys() {
        const db = getDb();
        return db.collection('researchStudies').find({id: {$in: this.registeredStudies}}).toArray().catch(err => {
            console.log(err);
        });
    }
}
