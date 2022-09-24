
require('dotenv').config();
const u = require('./scripts/utils.js');
const path = require('path');
const express = require("express");

const app = express();

const ISLOCAL = process.env.PORT===null||process.env.PORT===undefined;
const PORT = ISLOCAL ? 8888 : process.env.PORT;
const IMAGEMESHHOST = ISLOCAL ? 'http://localhost:5000':'https://image-mesh-server.herokuapp.com';
const IMAGEMESHAPI = IMAGEMESHHOST+'/image-mesh/api';
const SERVERAPI = '/api';

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/build'))); 

app.get(SERVERAPI+'/test', (req, res) => {
  console.log('THIS MESSAGE SHOULD SHOW UP ON THE SERVER CONSOLE');
  res.json({ message: 'THIS MESSAGE SHOULD SHOW UP ON THE CLIENT CONSOLE' });
}); 

app.get(SERVERAPI, (req, res) => res.json({ message: 'Hello from the server on port '+PORT })); 

app.get('/', (req, res) => res.json({ message: 'Hello from the server on port '+PORT })); 

app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'))); 

app.listen(PORT, () => console.log(`SERVER: Listening in a ${ISLOCAL?'local':'production'} environment on ${PORT}`));
