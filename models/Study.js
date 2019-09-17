const timestamp = require('time-stamp');
const ObjectId = require('mongodb').ObjectId;
const getDb = require('../utilities/database').getDb;

function findResearchStudy(oneId, idArr) {
    const db = getDb();
    let findParam;
    oneId? findParam = {id: oneId} :idArr? findParam = {id: {$in: idArr}} : '';
    if(findParam) {
        return db.collection('researchStudies').find(findParam).toArray()
        .catch(err =>  { 
            throw err 
        });
    }
    return db.collection('researchStudies').find().toArray()
    .catch(err => {
        throw err;
    });
}

module.exports = class Study {
    constructor(subject, location, gender, age, payout, expiry, description, studyAdmin, m_id) {
        this.subject = subject;
        this.location = location;
        this.gender = gender;
        this.age = age;
        this.payout = payout;
        this.expiry = expiry;
        this.description = description;
        this.id = timestamp('YYMMDDHHmmssms')
        this._id = m_id?new ObjectId(m_id):null;
        this.studyAdmin = studyAdmin;
    }

    saveStudy(admin) {
        const db = getDb();
        if(!this._id)
        {
            db.collection('researchStudies').insertOne(this).catch(err => {
                console.log(err);
            });
            const postedStudies = admin.postedStudies;
            postedStudies.push(this);
            db.collection('adminUser')
            .updateOne({_id: new ObjectId(admin._id)}, {$set: {postedStudies: postedStudies}});
        } 
        else 
        {
            const studyIndex = admin.postedStudies.findIndex(study => {
                return study._id.toString() === this._id.toString()
             });
            admin.postedStudies[studyIndex].gender = this.gender;
            admin.postedStudies[studyIndex].age = this.age;
            admin.postedStudies[studyIndex].payout = this.payout;
            admin.postedStudies[studyIndex].expiry = this.expiry;
            admin.postedStudies[studyIndex].description = this.description;
            db.collection('researchStudies').updateOne({_id: this._id}, {$set: {age: this.age, gender: this.gender, expiry: this.expiry, description: this.description, payout: this.payout}}).catch(err => {
            console.log(err);
            });
            db.collection('adminUser').updateOne({_id: new ObjectId(admin._id)}, {$set: {postedStudies: admin.postedStudies}}).catch(err => {
                console.log(err);
            });
        }
    }

    static showAll(cb) {
        return findResearchStudy();
    }

    static findById(studyId) {
        const db = getDb();
        return db.collection('researchStudies').findOne({_id: new ObjectId(studyId)}).catch(err => {
            console.log(err);
        });
    }

    static deleteById(studyId, admin) {
        const db = getDb();
        db.collection('researchStudies').deleteOne({_id: new ObjectId(studyId)}).catch(err => {
            console.log(err);
        });
        const studyIndex = admin.postedStudies.findIndex(study => {
            return study._id.toString() === studyId.toString()
        });
        admin.postedStudies.splice(studyIndex, 1);
        return db.collection('adminUser').updateOne({_id: new ObjectId(admin._id)}, {$set: {postedStudies: admin.postedStudies}}).catch(err => {
            console.log(err);
        });
    }
}