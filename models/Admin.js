const getDb = require('../utilities/database').getDb;
const ObjectId = require('mongodb').ObjectId;

module.exports = class Admin {
    constructor(userName, email, password, postedStudies, m_id) {
        this.name = userName;
        this.email = email;
        this.password = password;
        this.postedStudies = postedStudies?postedStudies:[];
        this._id = m_id?new ObjectId(m_id):null;
    }

    addAdmin() {
        const db = getDb();
        db.collection('adminUser').insertOne(this).catch(err => {
            throw err;
        });
    }

    static findAdmin(adminId) {
        const db = getDb();
        return db.collection('adminUser').findOne({_id: new ObjectId(adminId)})
        .catch(err => {
            throw err;
        });
    }
}