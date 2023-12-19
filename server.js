import { config } from "dotenv";
import express from "express";
import axios from 'axios';
import qs from "qs";
import cookieParser from "cookie-parser";
import { OAuth2Client } from 'google-auth-library';

config();

// Initializing the application
const app = express();
app.use(cookieParser());
console.log(axios.isCancel('something'));
let songs = {};
app.use(express.static('public'));

// Getting Spotify Credentials stored as Environment Varliables
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.CALLBACK_URL;

// Getting Google Credentials stored as Environment Varliables
const googleCLientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleApiKey = process.env.GOOGLE_API_KEY;
const callbackUri = process.env.GOOGLE_CALLBACK_URL;
const SCOPES = ['https://www.googleapis.com/auth/youtube'];

// Initializing Google OUTH2 Client
const oAuth2Client = new OAuth2Client(googleCLientID, googleClientSecret, callbackUri);
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

// Spotify Authorization Route
app.get('/auth', (req, res) => {
  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize';
  const queryParams = {
    client_id: spotifyClientId, // Spotify Client ID
    response_type: 'code', 
    redirect_uri: redirectUri, // Redirect URL 
    scope: 'user-read-private user-read-email playlist-read-private', // Add desired scopes
  };

  const authUrl = `${spotifyAuthUrl}?${qs.stringify(queryParams)}`;
  res.redirect(authUrl);
});

// Callback Route for Spotify Auth
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange the code for an access token
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const tokenParams = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
  };

  // Access token is obtained
  try {
    const response = await axios.post(tokenUrl, qs.stringify(tokenParams), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Saving access token in cookie for further usage
    const accessToken = response.data.access_token;
    res.cookie('key', accessToken);
    res.redirect("http://localhost:3000/playlist"); // Redirecting to playlist route
  }
  catch (error) {
    console.error('Error exchanging code for token:', error.message);
    res.status(500).send('Error during authentication');
  }
});

// Default Route
app.get("/", (req, res) => {
  res.render("index.ejs")
});

// Google Autentication Route
app.get("/auth/google", (req, res) => {
  res.redirect(authUrl); // authURL is previously initialized via Google OAUTH Client
})

app.get("/auth/google/callback", async (req, res) => {

    // Exchange Code for access token
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    const googleAccessToken = tokens.access_token;
    const playlistID = {};
    const songID = {};

    // Creating empty playlists and storing their playlistID
    for(const key in songs){
        const response = await axios.post('https://www.googleapis.com/youtube/v3/playlists?part=id,snippet', {
          snippet : {
            title : key
          }
        }, {
          headers : {
            Authorization: 'Bearer ' + googleAccessToken,
          }
        })
        playlistID[key] = response.data.id;
    }

    // Getting the videoID of each song 
    for(const key in songs){
      let temp_id = [];
      for(let i = 0; i < songs[key].length; i++){
          const result = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${songs[key][i]}&type=video&key=${googleApiKey}`);
          temp_id.push(result.data.items[0].id);
      }
      songID[key] = temp_id;
    } 

    // Adding songs according to their playlist
    for(const key in songs){
      for(let i = 0; i < songID[key].length; i++){
        const response = await axios.post(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,id&key=${googleApiKey}`, {
          snippet : {
            playlistId : playlistID[key],
            resourceId : songID[key][i]
          }
        }, {
          headers : {
            Authorization: 'Bearer ' + googleAccessToken,
          }
        })
        
      }
    }
    res.render("success.ejs"); 
})

app.get("/playlist", async (req, res) => {

  // Access token is obtained through cookie
  const accessToken = req.cookies.key;
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: 'Bearer ' + accessToken //the token is a variable which holds the token
      }
    });

    // Track URl is obtained for each playlist
    const songItems = response.data.items;
    for(let i=0; i<songItems.length; i++){
      let url = songItems[i].tracks.href;
      songs[songItems[i].name] = [];
      const res = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
      const tracks = res.data.items;

      // Songs are obtained from the tracks URl
      for(let j=0; j<tracks.length; j++){
        songs[songItems[i].name].push(tracks[j].track.name)
      }
    }
    res.render("playlist.ejs", {
      data: songs
    })
  }
  catch (error) {
    console.log(error);
  }

})

// Server listeing at port 3000
app.listen(3000, () => {
  console.log("Server is listening at http://localhost:3000");
})


