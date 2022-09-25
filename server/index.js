require('dotenv').config();
const path = require('path');
const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');
const request = require('request');
const app = express();

const ISLOCAL = process.env.PORT===null||process.env.PORT===undefined;
const PORT = ISLOCAL ? 8888 : process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SERVERHOST = ISLOCAL ? 'http://localhost:'+PORT:'https://spotify-pixelfy.herokuapp.com';
const CLIENTHOST = ISLOCAL ? 'http://localhost:3000':'https://spotify-pixelfy.herokuapp.com';
const IMAGEMESHHOST = 'https://image-mesh-server.herokuapp.com';
const IMAGEMESHAPI = IMAGEMESHHOST+'/image-mesh/api';

let spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: SERVERHOST+'/callback'
});

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build'))); 

app.get('/login', (req, res) => {
  const scopes = ['user-read-private','user-read-email','user-top-read'];
  const state = getRandomStr();
  const authURL = spotifyApi.createAuthorizeURL(scopes, state);
  
  res.cookie('spotify_auth_state',state);
  res.redirect(authURL);
});

app.get('/callback', (req, res) => {
  spotifyApi.authorizationCodeGrant(req.query.code || null).then(
    (data) => {
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      const queryData = [
        ['access_token', data.body['access_token']],
        ['refresh_token', data.body['refresh_token']],
        ['expires_in', data.body['expires_in']],
      ];

      const queryParams = new URLSearchParams(queryData).toString();

      res.redirect(CLIENTHOST+'/?'+queryParams);
    },
    (err) => console.log('ERROR AUTH CALLBACK:', err)
  );
});

app.get('/refresh_token', (req, res) => {
  spotifyApi.refreshAccessToken().then(
    (data) => {
      spotifyApi.setAccessToken(data.body['access_token']);

      const resData = {
        'access_token': data.body['access_token'],
        'refresh_token': data.body['refresh_token'],
        'expires_in': data.body['expires_in'],
      };

      res.json(resData);
    },
    (err) => console.log('ERROR REFRESH TOKEN: ', err)
  );
});

app.get('/api/get/server', (req, res) => {
  res.json({'url':SERVERHOST});
}); 

app.get('/api/get/artists', (req, res) => {
  spotifyApi.getMyTopArtists().then(
    (data) => res.json(data.body.items), 
    (err) => console.log('ERROR GET ARTISTS:', err));
}); 

app.get('/api/get/profile', (req, res) => {
  spotifyApi.getMe().then(
    (data) => res.json(data.body), 
    (err) => console.log('ERROR GET PROFILE:', err));
}); 

app.get('/api/get/access_token', (req, res) => {
  res.json({'access_token':spotifyApi.getAccessToken()});
}); 

app.get('/api/set/access_token', (req, res) => {
  spotifyApi.setAccessToken(req.query.access_token);
  res.json({'access_token':spotifyApi.getAccessToken()});
}); 

app.get('/api/IM/wake_up',(req,res) => getUrlData(IMAGEMESHAPI).then(data=>res.json(data)));

app.get('/api/IM/get/image',(req,res) => {
  const queryData = [['url', req.query.url]];
  const queryParams = new URLSearchParams(queryData).toString();
  let apiCall = IMAGEMESHAPI+'/get/image/quickEdit/?'+queryParams;
  getUrlData(apiCall).then(data=>res.json(data));
});
  
app.get('/', (req, res) => res.json({ message: 'Hello from the server on port '+PORT })); 

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'))); 

app.listen(PORT, () => console.log(`SERVER: Listening in a ${ISLOCAL?'local':'production'} environment on ${PORT}`));

const getRandomStr = (length=16) => {
  let str = '';
  let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i=0; i<length; i++) 
    str += s.charAt(Math.floor(Math.random()*s.length));
  return str;
};

const getUrlData =async (url) => new Promise (resolve => 
  request.get(url, (error, response, body) => resolve(JSON.parse(body))));
