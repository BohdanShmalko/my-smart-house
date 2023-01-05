const { model, Schema } = require('mongoose');
const { withPins } = require('./schemaObjects');

module.exports = model('Pomp', new Schema(...withPins));