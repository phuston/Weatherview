var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Weather = new Schema({
	_id: {type: String},
	precip: Number,
	summary: String,
	temp: Number,
	time: Date,
}, {collection: 'weather'})

module.exports = mongoose.model('Weather',Weather)
mongoose.connect('mongodb://patrick:olinjs@ds047095.mongolab.com:47095/weatherview')