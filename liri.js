//set items that we need to require
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var request = require("request");
var Twitter = require("twitter");

//declare variable to capture the type of function the user can call
var userInputType = process.argv[2];

//enter if-else if statements to determine which functions to run
if(userInputType === "movie-this"){
  var movieInput = "";
  var nodeArgs = process.argv;

  //enter loop to build songInput variable that we can pass to the
  //omdbapi query
  for (var i = 3; i < nodeArgs.length; i++) {
    if(i > 3 && i < nodeArgs.length){
      //concatenate with + if variable is more than two words
      movieInput = movieInput + "+" + nodeArgs[i];
    }
    else {
      movieInput += nodeArgs[i];
    }
  }
  //call movieThis function
  movieThis(movieInput);
} else if (userInputType === "spotify-this-song") {
  var songInput = "";
  var nodeArgs = process.argv;

  //enter loop to build songInput variable that we can pass to the
  //spotify query
  for (var i = 3; i < nodeArgs.length; i++) {
    if(i > 3 && i < nodeArgs.length){
      //concatenate songInput if more than 1 word
      songInput = songInput + " " + nodeArgs[i];
    }
    else {
        songInput += nodeArgs[i];
      }
    } //end for loop for songInput

    //call spotifyThis function, passing param
    spotifyThis(songInput);
  } else if (userInputType === "my-tweets") {
    //call tweet function
    tweet();
  } else if (userInputType === "do-what-it-says") {
    //call random function
    random();
  } else {
    //display message to user
    console.log("I'm sorry, I don't recognize that command.  Please try again.");
  };

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
      //assign variables to data we want to log
      var title = JSON.parse(body).Title;
      var plot = JSON.parse(body).Plot;

      // Then log data
      console.log(`Title: ${title}`);
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
      console.log(`Plot: ${plot}`);
      console.log(`Actors: ${JSON.parse(body).Actors}`);

      append("Movies", title, plot);
    }

    console.log("Movie content added to log file.");
  }); //end ombdapi request
}; //end movieThis function

/*
  spotifyThis function accepts one argument and utilizes the spotify search API to pull
  back details of a given song Title

  @param songName = the value assigned to the songInput variable from user input via
    process.argv
*/

function spotifyThis(songName){
  var id = keys.spotifyKeys.id;
  var sec = keys.spotifyKeys.secret;

  var spotify = new Spotify({
    id: id,
    secret: sec
  })

  spotify.search({type: "track", query: songName}, function(err, data) {
    if (err) {
      return console.log(`Error occured: ${err}`);
    }
    //declare objData variable and assign the first three steps of the object
    var objData = data.tracks.items;

    //loop through the objData and assign values as noted below
    for (var i = 0; i < objData.length; i++) {
      //declare and initialize values within the track object
      var song = objData[i].name;
      var album = objData[i].album.name;
      var linky = objData[i].preview_url;
      var artists = objData[i].artists[0].name;

      //log out results
      console.log(`\nArtist Name: ${artists}`);
      console.log(`Song: ${song}`);
      console.log(`Spotify Link: ${linky}`);
      console.log(`Album Name: ${album}\n`);

      append("Songs", song, artists);
    }//end for loop

    console.log("Spotify content added to the log file.");
  }); //end spotify search
};//end spotifyThis function

/*
  tweet function takes no parameters and displays recent tweets, given
  a specific screen name and twitter object.  The twitter object will hold
  the user keys and secret authorization codes
*/

function tweet(){
  var params = {screen_name: 'rubinTheDogge'};
  keys.client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        //create var to store data
        var text = tweets[i].text;
        var date = tweets[i].created_at;

        console.log(`\nTweet: ${text}`);
        console.log(`Date Created: ${date}\n`);

        //call append function to log our requests
        append("Tweet", text, date);
      }//end for loop

      console.log("Tweet content added to log file.");

    } else {
      console.log(error);
    }
  })//end GET request
} //end tweet function

function random(){
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error) {
      console.log(error);
    }
    //find text in file, split out via comma
    var dataArr = data.split(",");
    //grab the song name that sits at index 1 and assign to the song variable
    var song = dataArr[1];
    //call spotifyThis function, passing the song var as a param
    spotifyThis(song);
  })//end readFile
}//end random function

function append(searchType, data1, data2){
  fs.appendFile("log.txt", `\n${searchType} Requested:\n${data1}\n${data2}\n`, function(err){
    if (err) {
      console.log(err);
      }
    });//end appendFile
}//end append function
