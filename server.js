/*
  To push into horok:
  1) git add .
  2) git commit -m 'message for git repository'
  3) git push origin
  4) git push heroku
  5) heroku open (or just go the the website in the console output)
*/


const axios = require('axios');
const express = require('express');
const hbs = require('hbs');//handlebars
const fs = require('fs');

const geocode = require('./weather/geocode.js');
const weather = require('./weather/weather.js');

const port = process.env.PORT || 3000; //If proces does not find any port, use 3000
var app = express();

var address = '00791';

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use((request, response, next)=>{ //next tells express when the Middleware function is done
  var timeNow = new Date().toString();
  var log = `${timeNow} : ${request.method} : ${request.url}`;
  fs.appendFile('server.log', log +'\n', (error) => {
    if(error){
      console.log('Error: Unable to append to server.log');
    }
  });
  next();
});

app.use(express.static(__dirname+'/public'));//Middleware that tells express how to behave

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text)=> {
  return text.toUpperCase();
})
app.get('/', (request, response) => {

  var locationResults;
  var weatherResults;
  geocode.geocodeAddress(address, (errorMessage, locationResults) =>{
    if(errorMessage){
      console.log(errorMessage);
    }else {
      locationResults.pageTitle = 'Home Page';
      locationResults.message = 'This is my home page';
      
      response.render('home.hbs', locationResults);

      console.log(JSON.stringify(locationResults, undefined, 2));
      var weatherURL = `https://api.darksky.net/forecast/838420834287d2da59289c6eeaf05a1d/${locationResults.latitude},${locationResults.longitude}`;
      weather.restGETWeather(weatherURL, (errorMessage, weatherResults) => {
        if(errorMessage){
          console.log(errorMessage);
        }else {
          // weatherResults.pageTitle = 'Home Page';
          // weatherResults.message = 'This is the home page';
          console.log(JSON.stringify(weatherResults, undefined, 2));
          // response.render('home.hbs', {
          //   pageTitle: 'Home Page',
          //   message:'This is the home page'
          // });
        }
      });

    }
  });

  // response.render('home.hbs', {
  //   pageTitle: 'Home Page',
  //   message:'This is the home page'
  // });

});


// app.get('/', (req, res) => {
//
//   var locationResults;
//   var weatherResults;
//   var encodedAddress = `${encodeURIComponent(address)}`;
//   var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodedAddress;
//
//   axios.get(geocodeURL)
//   .then(
//     (response) => {
//       if(response.data.status === 'ZERO_RESULTS'){
//         throw new Error('Error: Unable to find the address.');
//       }else if (response.data.status === 'OK') {
//             console.log(JSON.stringify(response.data.results[0].geometry.location, undefined, 5));
//             var location = response.data.results[0].geometry.location;
//             var weatherData = weather.getWeatherResults(location.lat, location.lng)
//             .then( (data) => {
//               console.log(data);
//               data.pageTitle = 'Home Page';
//               data.message = 'This is the home page';
//               res.render('home.hbs',data);
//             }, (err) => {
//               console.log(err);
//             });
//             // console.log(weatherData);
//             // weatherData.pageTitle = 'Home Page';
//             // weatherData.message = 'This is the home page';
//             // res.render('home.hbs',weatherData);
//
//       }
//     }
//   )
//   .catch(
//     (error) => {
//       if(error.code === 'ENOTFOUND'){
//         console.log('Error: Unable to connect to API servers.');
//       }else{
//         console.log(error.message);
//       }
//     }
//   );
//
//
// });


app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page',
    message:'This is the about page'
  });
});

app.get('/experience', (request, response) => {
  response.render('experience.hbs',{
    pageTitle: 'Experience Page',
    message:'This is the experience page'
  });
});
app.get('/projects', (request, response) => {
  response.render('projects.hbs',{
    pageTitle: 'Projects Page',
    message:'This is the projects page'
  });
});
app.get('/bad', (request, response) => {
  response.send({
    errorMessage:'Not able to connect'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
}); //3000 = Common port for the server
