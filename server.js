
const express = require('express');
const hbs = require('hbs');//handlebars
const fs = require('fs');

var app = express();

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
// app.use((request, response)=>{ //next tells express when the Middleware function is done
//   response.render('maintenance.hbs',{
//     pageTitle: 'Maintenance',
//     message:'The page is under construction'
//   });
// });
app.use(express.static(__dirname+'/public'));//Middleware that tells express how to behave

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text)=> {
  return text.toUpperCase();
})

app.get('/', (request, response) => {
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    message:'This is the home page'
  });
});

app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page',
    message:'This is the about page'
  });
});

app.get('/bad', (request, response) => {
  response.send({
    errorMessage:'Not able to connect'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port: 3000');
}); //3000 = Common port for the server
