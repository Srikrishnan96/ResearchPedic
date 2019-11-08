const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studySchema = new Schema({
    subject: {type: String, required: true},
    location: {type: String, required: true},
    gender: {type: String, required: true},
    age: {type: Number, required: true},
    payout: {type: Number, required: true},
    expiry: {type: Date, required: true},
    description: {type: String, required: true},
    studyAdmin: {type: Schema.Types.ObjectId, required: true, ref: 'Admin'},
    published: {type: Date, required: true}
});

module.exports = mongoose.model('Study', studySchema);

