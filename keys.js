console.log('this is loaded');
var Twitter = require("twitter");

exports.client = new Twitter ({
  consumer_key: '<key goes here>',
  consumer_secret: '<secret goes here>',
  access_token_key: '<key goes here>',
  access_token_secret: '<secret goes here>',
});

exports.spotifyKeys = {
  id: '<id goes here>',
  secret: '<secret goes here>'
}
