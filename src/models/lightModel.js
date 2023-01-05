const { model, Schema } = require('mongoose');
const { base } = require('./schemaObjects');

module.exports = model('Light', new Schema({
    value: {
        type: String,
        required: true,
        index: true,
    }
},
{ timestamps: true },));