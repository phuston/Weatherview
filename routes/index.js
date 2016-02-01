var express = require('express');
var router = express.Router();

var Weather = require('../db/db.js');
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/all', function(req, res, next) {
	Weather.find({}).sort({temp: 'asc'}).limit(8000).exec(function(err, weathers) {
		res.render('index', { title: 'Weatherview', Weathers: weathers });
	});
});

router.get('/data/sort/:season', function(req, res, next) {
	var season = req.params.season;

	var spring15 = new Date(2015, 2, 20);
	var spring16 = new Date(2016, 2, 20);
	var summer = new Date(2015, 5, 20);
	var fall = new Date(2015, 8, 22);
	var winter = new Date(2015, 11, 21);

	switch(season) {
	    case 'winter':
	        var greater_than = winter;
	        var less_than = spring16;
	        break;
	    case 'spring':
	        var greater_than = spring15;
	        var less_than = summer;
	        break;
	    case 'summer':
	    	var greater_than = summer;
	    	var less_than = fall;
	    	break
		case 'fall':
			var greater_than = fall;
			var less_than = winter;
			break
	    default:
	        var greater_than = winter;
	        var less_than = spring;
	}

	console.log(less_than)
	console.log(greater_than)

	Weather.find({time: {$lt: less_than, $gt: greater_than}}).sort({time:'asc'}).limit(8000).exec(function(err, weathers){
		res.render('index', {title: 'Weatherview', Weathers: weathers });
	});


})

router.post('/add', function(req, res, next) {
	var weather = new Weather({
		_id: new ObjectID(),
		precip: Number(req.body.precip),
		summary: req.body.summary,
		temp: Number(req.body.temp),
		time: new Date()
	})

	console.log(weather);

	Weather.create(weather, function(err, weather){
		if (err) return console.error(err);
		res.render('add', { title: 'WeatherView', Weather: weather})
	})
})

router.delete('/delete', function(req, res, next) {
	var id = req.body.id;

	Weather.remove({_id:id}, function(err, removed){
		if(err){
			console.error(err);
		} else {
			console.log(removed);
		}
	})
})

router.options('/delete', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'DELETE');
	res.end();
});

router.get('/visualize', function(req, res, next){
	res.render('visualize');
});

router.get('/data/json', function(req, res, next){
	Weather.find({}).sort({time: 'asc'}).exec(function(err, weathers) {
		res.json(weathers);
		// res.json(weathers.map(function(weather){
		// 	return weather.temp
		// }));
	});
});

module.exports = router;
