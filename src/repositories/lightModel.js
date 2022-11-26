const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Light', userSchema);