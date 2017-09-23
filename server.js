/*
  To push into heroku:
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
var Promise = require('promise');

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
});


app.get('/', (request, response) => {
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    message:'This is the home page'
  });
});

app.get('/weather', (request, response) => {
  weather.getAddress(address)
  .then( (locationData) => {
      console.log(`Afuera: ${JSON.stringify(locationData)}`);
      var wheatherData = weather.getWeather(locationData.latitude, locationData.longitude)
      wheatherData.address = locationData.address;
      return (wheatherData);
  })
  .then( (wheaterData) => {
    wheaterData.pageTitle = 'Weather Page';
    wheaterData.message = 'This is the weather page';
    console.log(wheaterData);
    response.render('weather.hbs', wheaterData);
  })
  .catch( (error) => {
    console.log(error);
    response.render('error.hbs', {
      pageTitle: 'Error!',
      message:error
    });
  });
});

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
