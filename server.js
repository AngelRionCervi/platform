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
const tools = require('./backend/lib/tools.js');

const plshelp = require('./backend/lib/tools.js');

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//require('./server/helpers/helpers.js')();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.set('port', 5000);
app.use("/userData", express.static(__dirname + "/userData"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/mapEditor", express.static(__dirname + "/mapEditor"));

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
app.post('/assetsUpload', (req, res) => {

    const data = req.body.infos.map(JSON.parse);
    const files = req.files.filesRaw;
    const assets = [];

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    files.forEach((file) => {
        const assetInfo = { path: '', name: '' };
        const fullClientPath = data.find(el => el.name === file.name).fullPath;
        const upperFold = plshelp.getUpperDir(fullClientPath);
        console.log(upperFold, fullClientPath)

        const serverPath = './userData/me/project1/assets' + upperFold + '/' + file.name;
        const getPath = serverPath.substring(1); // remove the '.'
        file.mv(serverPath);

        assetInfo.id = shortid.generate();
        assetInfo.name = file.name;
        assetInfo.folder = upperFold;
        assetInfo.path = getPath;
        assets.push(assetInfo);
    });

    res.status(200).send(JSON.stringify({ res: assets, rootDir: 'assets/' }));
})
app.get('/getAssets', async (req, res) => {
    const fullPath = './userData/me/project1/assets';
    const assets = await tools.getDirContent(fullPath);

    res.status(200).send(JSON.stringify({ res: assets, rootDir: 'assets/', fullPath: fullPath }));
})
app.listen(5000, () => {
    console.log('Starting server on port 5000');
});
