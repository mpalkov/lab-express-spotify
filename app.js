require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
require("dotenv").config();

// require spotify-web-api-node package here:
const spotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials/");

// setting the spotify-api goes here:
const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .then(()=> console.log("Got Spotify Access Token - OK."))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/artist-search", (req, res) => {
    const searchTitle = req.query.searchText;
    spotifyApi
        // .searchArtists({title: { $regex: new RegExp(searchTitle, "i") } })
        .searchArtists(searchTitle)
        .then((data) => {
            //console.log("This is body of our response: ", data.body.artists);
            const artistsList = data.body.artists.items;
           //console.log({artistsList});
            res.render("artist-search-results", {artistsList});
        })
        .catch((error) => console.log(error))
    
});

app.get("/", (req, res) => {
    res.render("homepage")
})

app.get('/albums/:artist', (req, res, next) => {
    // .getArtistAlbums() code goes here
    //console.log("QUERY: ", req.params.artist);
    spotifyApi.getArtistAlbums(req.params.artist)
    .then((data)=> {
        //console.log("ALBUM OBJECT: ", data.body.items);
        const albumsList = data.body.items;
        res.render("albums", {albumsList})
    })
    .catch((error) => console.log(error))
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
