const { model, Schema } = require('mongoose');
const { withPins } = require('./schemaObjects');

module.exports = model('Fitolamp', new Schema(...withPins));