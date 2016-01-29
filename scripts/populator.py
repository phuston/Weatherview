import forecastio
import os
from pymongo import MongoClient
from datetime import datetime
from datetime import timedelta
import pprint

client = MongoClient('mongodb://patrick:olinjs@ds047095.mongolab.com:47095/weatherview')
db = client.get_default_database()

weather = db['weather']

lat = 42.293013
lon = -71.263049

api_key = os.environ['FORECASTIO_KEY']

start_date = datetime(2015,1,1,0,0)

for day in (start_date + timedelta(n) for n in range(365)):
	forecast = forecastio.load_forecast(api_key, lat, lon, day)

	byHour = forecast.hourly()

	for hourlyData in byHour.data:
		print hourlyData
		weatherJson = {}
		weatherJson['time'] = hourlyData.time
		try:
			weatherJson['temp'] = hourlyData.temperature
		except:
			weatherJson['temp'] = None
		try:
			weatherJson['precip'] = hourlyData.precipProbability
		except:
			weatherJson['precip'] = None
		try:
			weatherJson['summary'] = hourlyData.summary
		except:
			weatherJson['summary'] = None

		db.weather.insert(weatherJson)
		# pprint.pprint(weatherJson)
		# print hourlyData.time, "  |  ", hourlyData.temperature, "  |  ", hourlyData.precipProbability

