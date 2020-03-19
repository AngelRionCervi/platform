const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const server = http.Server(app);

//require('./server/helpers/helpers.js')();

app.set('port', 5000);
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/index.html'));
});
server.listen(5000, () => {
    console.log('Starting server on port 5000');
});
