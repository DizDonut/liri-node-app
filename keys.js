console.log('this is loaded');
var Twitter = require("twitter");

exports.client = new Twitter ({
  consumer_key: 'FwbEfB3HEw1TH07u4sRCRKTHS',
  consumer_secret: '43SZptRj0hz7mi2NMwPDe8BdDNdF2vlBjvGTU37kiETwZJJALR',
  access_token_key: '891738465632694279-CEnTw9a1KhtpEtO4GgHd2O2IvoGykBe',
  access_token_secret: 'topkHWFHsTzLRMXbcVUBAQkxBwwNPKSWrUPqnN4IrOIeO',
});

exports.spotifyKeys = {
  id: 'f8dc702494ce4bc48a177579c7bf317b',
  secret: 'bcf325a6b30b4190b8683e98ce6d4c3f'
}
