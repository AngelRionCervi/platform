const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const server = http.Server(app);
const bodyParser = require('body-parser');

//require('./server/helpers/helpers.js')();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', 5000);
app.use("/public", express.static(__dirname + "/public"));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.post('/sceneInfo', (req, res) => {
    console.log('body:', req.body);
    res.sendStatus(200);
})
server.listen(5000, () => {
    console.log('Starting server on port 5000');
});
