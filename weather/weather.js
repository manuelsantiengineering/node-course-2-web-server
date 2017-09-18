
const axios = require('axios');
//DarkSkyAPI secret key: 838420834287d2da59289c6eeaf05a1d
//URL: https://api.darksky.net/forecast/838420834287d2da59289c6eeaf05a1d/LATITUDE,LONGITUDE

var restGETWeather = (weatherURL) => {
  return (axios.get(weatherURL) );
};

var getWeatherResults = (latitude, longitude) => {
  var weatherURL = `https://api.darksky.net/forecast/838420834287d2da59289c6eeaf05a1d/${latitude},${longitude}`;
  var weatherGet = restGETWeather(weatherURL);
  var weatherData = {result:'OK'};

  weatherGet.then(
      (response) => {
        if (response.data.latitude === latitude && response.data.longitude === longitude) {
          weatherData.temperature = response.data.currently.temperature;
          weatherData.apparentTemperature = response.data.currently.apparentTemperature;
          weatherData.precipType = response.data.currently.precipType;
          weatherData.precipProbability = response.data.currently.precipProbability;
          weatherData.summary = response.data.currently.summary;
          console.log(response.data.currently.summary);
          return weatherData;
        }else{
          throw new Error('Error: Unable to find the weather.');
        }
      }
    )
    .catch(
      (error) => {
        console.log(error.message);
        weatherData.results = error.message;
        return weatherData;
      }
    );
};

module.exports = {
  restGETWeather,
  getWeatherResults
};
