const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const shortid = require('shortid');
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);
const statAsync = promisify(fs.stat);
const mkdirAsync = promisify(fs.mkdir);
const tools = require('./backend/lib/tools.js');

const Project = require('./backend/class/Project');

const userID = 'user_' + shortid.generate();
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//require('./server/helpers/helpers.js')();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.set('port', 5000);
app.use("/backend/user_projects", express.static(__dirname + "/backend/user_projects"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/mapEditor", express.static(__dirname + "/mapEditor"));
app.use("/editorWorkers", express.static(__dirname + "/mapEditor/js/workers"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/mapEditor', (req, res) => {
    res.sendFile(path.join(__dirname, '/mapEditor/index.html'));
});
app.post('/sceneInfo', (req, res) => {
    console.log('body:', req.body);
    res.sendStatus(200);
})
app.post('/assetsUpload', async (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const project = new Project();

    const data = req.body.infos.map(JSON.parse);
    const files = req.files.filesRaw;

    await project.uploadAssets(data, files, userID);
    const assetsInfo = project.getAssetsInfo();

    res.status(200).send(JSON.stringify({ res: assetsInfo.collectionJSON._, rootDir: assetsInfo.rootDir, fullPath: assetsInfo.fullAssetsPath, projectID: assetsInfo.projectID }));
})
app.get('/getAssets', async (req, res) => {;
    const projectIDget = "project_ECpE8ays0";
    const userIDget = "user_x3mGQ1pey";
    const fullAssetPath = './backend/user_projects/' + userIDget + '/' + projectIDget + '/assets';
    const assets = await tools.getProjectCollectionByID(userIDget, projectIDget);

    res.status(200).send(JSON.stringify({ res: assets._, rootDir: 'assets/', fullPath: fullAssetPath, projectID: projectIDget }));
})
app.listen(5000, () => {
    console.log('Starting server on port 5000');
});
