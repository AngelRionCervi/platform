const shortid = require('shortid');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);
const statAsync = promisify(fs.stat);
const mkdirAsync = promisify(fs.mkdir);
const tools = require('../lib/tools');

module.exports = class Project {
    constructor(id) {
        this.id = id;
        this.assetsInfo;
    }

    async uploadAssets(data, files, userID) {
        const assets = [];
        const rootDirs = './backend/user_projects';
        const projectID = 'project_' + shortid.generate();
        const rootProject = rootDirs + '/' + userID + '/' + projectID;

        await mkdirAsync(rootProject, { recursive: true });

        files.forEach((file, index) => {
            const assetInfo = { path: '', folder: '', name: '', id: shortid.generate() };
            const fullClientPath = data[index].fullPath;

            const upperFold = tools.getUpperDir(fullClientPath);

            const getPath_ = fullClientPath.substring(1); // remove the '.' // replace main dir with /assets
            const getPath = '/assets' + getPath_.slice(getPath_.indexOf('/'), getPath_.length);
            file.mv(rootProject + '/' + getPath);

            assetInfo.name = file.name;
            assetInfo.folder = upperFold;
            assetInfo.path = rootProject.substring(1) + getPath;
            assets.push(assetInfo);
        });

        const collection = { _: assets };
        await writeFileAsync(rootProject + '/asset_collection.json', JSON.stringify(collection, null, 4));

        this.assetsInfo = {
            collectionJSON: collection,
            collectionJSONpath: rootProject + '/asset_collection.json',
            fullAssetsPath: rootProject + '/assets',
            rootDir: 'assets/',
            projectID: projectID,
        };
    }

    getAssetsInfo() {
        return this.assetsInfo;
    }
}