#!/usr/bin/env node
const request = require('request');

var geocodeAddress = (address, callback) => {
  var encodedAddress = `${encodeURIComponent(address)}`;
  var fetchURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodedAddress;

  request({
    url:fetchURL,
    json:true
  }, (error, response, body) => {
    if(error){
      callback('Error: Unable to connect to Google servers.');
    }else if (body.status === 'ZERO_RESULTS') {
      callback('Error: Unable to find the address.');
    }else if(body.status === 'OK'){
      callback(undefined, {
        adress:body.results[0].formatted_address,
        latitude:body.results[0].geometry.location.lat,
        longitude:body.results[0].geometry.location.lng,
        fetchURL:fetchURL
      })
    }
  });

};

module.exports = {
  geocodeAddress
};
