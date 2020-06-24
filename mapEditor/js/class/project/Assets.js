import { Asset } from "./Asset.js";

export class Assets {
    constructor() {
        this.assets = [];
        this.areReady = false;
    }

    async createCollection(assetsInfo) {
        await Promise.all(assetsInfo.res.map(async (info) => {
            const asset = new Asset();
            await asset.build(info);
            this.assets.push(asset);
        }))
        this.areReady = true;
    }

    getByID(id) {
        this.checksReady();
        return this.assets.find(el => el.id === id);
    }

    checksReady() {
        if (!this.areReady) throw new Error('Assets not loaded')
    }
}
