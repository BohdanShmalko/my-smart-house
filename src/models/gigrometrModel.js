const { model, Schema } = require('mongoose');
const { base } = require('./schemaObjects');

module.exports = model('Gigrometr', new Schema(...base));