var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var request = require("request");
var userInputType = process.argv[2];

if(userInputType === "movie-this"){
  var movieInput = "";
  var nodeArgs = process.argv;
  for (var i = 3; i < nodeArgs.length; i++) {
    if(i > 3 && i < nodeArgs.length){
      movieInput = movieInput + "+" + nodeArgs[i];
    }
    else {
      movieInput += nodeArgs[i];
    }
  }
  movieThis(movieInput);
} else if (userInputType === "spotify-this-song") {
  var songInput = "";
  var nodeArgs = process.argv;
  for (var i = 3; i < nodeArgs.length; i++) {
    if(i > 3 && i < nodeArgs.length){
      songInput = songInput + " " + nodeArgs[i];
    }
    else {
        songInput += nodeArgs[i];
      }
    }
    spotifyThis(songInput);
  }

/*
  movieThis function accepts 1 argument and makes a reqest to the omdbapi
  The function will then display various items about the input from the user
  including title, plot, year, ratings, etc

  @param movieName = the value assigned to the movieInput variable, retrieved via
    process.argv
*/
function movieThis(movieName){
  var queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=40e9cece`;
  console.log(queryUrl);
  // Create a request to the queryUrl
  request(queryUrl, function(error, response, body){
    // If the request is successful
    if(!error && response.statusCode === 200){
      // Then log data
      console.log(`Title: ${JSON.parse(body).Title}`);
      console.log(`Year: ${JSON.parse(body).Year}`);

        //loop through the rating array to determine if rating for IMBD or RT exists
        //Ratings sit in [0] and [1] respectively, so we set the iteration to 2
        //This prevents undefined errors if RT ratings do not exist for given movie
        for (var i = 0; i < 2; i++) {
          var source = JSON.parse(body).Ratings[i].Source;
          var value = JSON.parse(body).Ratings[i].Value;
          console.log(source + ": " + value);
        }

      console.log(`Country: ${JSON.parse(body).Country}`);
      console.log(`Language: ${JSON.parse(body).Language}`);
      console.log(`Plot: ${JSON.parse(body).Plot}`);
      console.log(`Actors: ${JSON.parse(body).Actors}`);
    }
  }); //end ombdapi request
}; //end movieThis function

function spotifyThis(songName){
  var id = keys.spotifyKeys.id;
  var sec = keys.spotifyKeys.secret;

  var spotify = new Spotify({
    id: id,
    secret: sec
  })

  spotify.search({type: "track", query: songName}, function(err, data) {
    if (err) {
      return console.log('Error occured: ' + err);
    }
    var objData = data.tracks.items;

    for (var i = 0; i < objData.length; i++) {
      var song = objData[i].name;
      var artists = objData[i].artists[i].name;
      var album = objData[i].album.name;
      var linky = objData[i].preview_url;
      console.log(`\nArtist Name: ${artists}`);
      console.log(`Song: ${song}`);
      console.log(`Spotify Link: ${linky}`);
      console.log(`Album Name: ${album}\n`);
    }
  }); //end spotify search

};//end spotifyThis function
