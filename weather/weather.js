const axios = require('axios');
//DarkSkyAPI secret key: 838420834287d2da59289c6eeaf05a1d
//URL: https://api.darksky.net/forecast/838420834287d2da59289c6eeaf05a1d/LATITUDE,LONGITUDE

var getAddress = (address) => {
  var encodedAddress = `${encodeURIComponent(address)}`;
  var fetchURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodedAddress;

  return new Promise( (resolve, reject) => {
      axios.get(fetchURL)
      .then( (response) => {
          if (response.data.status === "OK" && response.data.status !== "ZERO_RESULTS") {
                var coordinates = {
                  latitude:response.data.results[0].geometry.location.lat,
                  longitude:response.data.results[0].geometry.location.lng,
                  address:response.data.results[0].formatted_address
                };
                resolve(coordinates);
          } else {
            reject('Error: Unable to find the location.');
          }
        }
      );
  });
}


var getWeather = (latitude, longitude) => {
  var weatherURL = `https://api.darksky.net/forecast/838420834287d2da59289c6eeaf05a1d/${latitude},${longitude}`;

  return new Promise( (resolve, reject) => {
    axios.get(weatherURL)
    .then( (response) => {
        if (response.data.latitude === latitude && response.data.longitude === longitude) {
              var weatherData = {
                temperature:response.data.currently.temperature,
                apparentTemperature:response.data.currently.apparentTemperature,
                precipType:response.data.currently.precipType,
                precipProbability:response.data.currently.precipProbability,
                summary:response.data.currently.summary,
                fetchURL:weatherURL
              };
              resolve(weatherData);
        }else{
          reject('Error: Unable to find the weather.');
        }
      }
    );
  });
}



module.exports = {
  getAddress,
  getWeather
};
