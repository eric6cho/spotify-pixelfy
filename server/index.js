
require('dotenv').config();
const u = require('./scripts/utils.js');
const path = require('path');
const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

const ISLOCAL = process.env.PORT===null||process.env.PORT===undefined;
const PORT = ISLOCAL ? 8888 : process.env.PORT;
const IMAGEMESHHOST = 'https://image-mesh-server.herokuapp.com';
const IMAGEMESHAPI = IMAGEMESHHOST+'/image-mesh/api';
const SERVERHOST = ISLOCAL ? 'http://localhost:'+PORT:'https://spotify-pixelfy.herokuapp.com';
const CLIENTHOST = ISLOCAL ? 'http://localhost:3000':'https://spotify-pixelfy.herokuapp.com';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const REDIRECT_URI = SERVERHOST+'/callback';

const FRONTEND_URI = CLIENTHOST;

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build'))); 

app.get('/api/test', (req, res) => {
  console.log('THIS MESSAGE SHOULD SHOW UP ON THE SERVER CONSOLE');
  res.json({ message: 'THIS MESSAGE SHOULD SHOW UP ON THE CLIENT CONSOLE' });
}); 

app.get('/api/get/server', (req, res) => {
  res.json({url:SERVERHOST});
}); 


let spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

app.get('/api/get/artists', (req, res) => {
  spotifyApi.getMyTopArtists().then(
    (data) => res.json(data.body.items), 
    (err) => console.log('Something went wrong!', err));
}); 

app.get('/api/set/access_token', (req, res) => {
  
  spotifyApi.setAccessToken(req.query.access_token);

  let data = {'access_token':getAccessToken()};
  res.json(data);
}); 

app.get('/api/get/access_token', (req, res) => {
  let data = {'access_token':getAccessToken()};
  res.json(data);
}); 

const getAccessToken = () => spotifyApi.getAccessToken();

app.get('/api/get/profile', (req, res) => {
  spotifyApi.getMe().then(
    (data) => res.json(data.body), 
    (err) => console.log('Something went wrong!', err));
}); 

app.get('/api/IM/wake_up',(req,res) => u.getUrlData(IMAGEMESHAPI).then(data=>res.json(data)));

app.get('/api/IM/get/image',(req,res) => {
  const queryData = [['url', req.query.url]];
  const queryParams = new URLSearchParams(queryData).toString();
  let apiCall = IMAGEMESHAPI+'/get/image/quickEdit/?'+queryParams;
  u.getUrlData(apiCall).then(data=>res.json(data));
});
  

app.get('/login', (req, res) => {
  console.log('/LOGIN');
  const scopes = ['user-read-private','user-read-email','user-top-read'];
  const state = u.getRandomStr();
  const authURL = spotifyApi.createAuthorizeURL(scopes, state);
  
  res.cookie('spotify_auth_state',state);

  console.log('/LOGIN REDIRECT');
  res.redirect(authURL);
});

app.get('/callback', (req, res) => {
  console.log('/CALLBACK');
  spotifyApi.authorizationCodeGrant(req.query.code || null).then(
    (data) => {

      console.log('/CALLBACK AFTER GET AUTH CODE')

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      const queryData = [
        ['access_token', data.body['access_token']],
        ['refresh_token', data.body['refresh_token']],
        ['expires_in', data.body['expires_in']],
      ];

      const queryParams = new URLSearchParams(queryData).toString();

      console.log('/CALLBACK REDIRECT')

      res.redirect(FRONTEND_URI+'/?'+queryParams);

    },
    (err) => console.log('ERROR AUTH CALLBACK:', err)
  );
});

app.get('/refresh_token', (req, res) => {
  console.log('/REFRESH_TOKEN');
  spotifyApi.refreshAccessToken().then(
    (data) => {
      console.log('/REFRESH_TOKEN The access token has been refreshed!');
  
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);

      const resData = {
        'access_token': data.body['access_token'],
        'refresh_token': data.body['refresh_token'],
        'expires_in': data.body['expires_in'],
      };

      console.log('/REFRESH_TOKEN SEND DATA BACK');
      res.json(resData);
    },
    (err) => console.log('ERROR REFRESH TOKEN: ', err)
  );
});


app.get('/', (req, res) => res.json({ message: 'Hello from the server on port '+PORT })); 

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'))); 

app.listen(PORT, () => console.log(`SERVER: Listening in a ${ISLOCAL?'local':'production'} environment on ${PORT}`));
