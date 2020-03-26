export class MapManager {
    constructor(canvas, ctx, drawingTools, viewport) {
        this.et = new EventTarget();
        this.events = {
            rCamBlock: new CustomEvent('rCamBlock', { detail: { x: 'lol' } }),
        };
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawingTools = drawingTools;
        this.blockColor = "black";
        this.spriteSize = 32;
        this.groundTileSize = 320;
        this.totalGroundType = 3;
        this.rXstart = 0;
        this.rYstart = 0;
        this.playerRinc = 0;
        this.playerLinc = 0;
        this.playerYinc = 0;
        this.map = {"width":3040,"height":768,"coords":[{"x":3008,"y":576,"w":32,"h":128},{"x":1120,"y":480,"w":64,"h":64},{"x":1120,"y":576,"w":64,"h":32},{"x":1120,"y":448,"w":32,"h":32},{"x":1120,"y":544,"w":32,"h":32},{"x":1120,"y":672,"w":32,"h":32},{"x":2208,"y":256,"w":32,"h":32},{"x":2208,"y":416,"w":32,"h":32},{"x":2624,"y":128,"w":32,"h":32},{"x":2624,"y":640,"w":96,"h":32},{"x":2240,"y":160,"w":64,"h":32},{"x":2592,"y":160,"w":64,"h":32},{"x":2272,"y":192,"w":64,"h":32},{"x":2272,"y":736,"w":256,"h":32},{"x":2560,"y":256,"w":32,"h":32},{"x":2560,"y":192,"w":64,"h":32},{"x":2560,"y":672,"w":96,"h":32},{"x":2304,"y":224,"w":64,"h":32},{"x":2304,"y":352,"w":160,"h":32},{"x":2528,"y":448,"w":32,"h":32},{"x":2528,"y":224,"w":64,"h":32},{"x":2208,"y":704,"w":64,"h":32},{"x":2208,"y":384,"w":96,"h":32},{"x":2336,"y":256,"w":192,"h":32},{"x":1984,"y":352,"w":128,"h":32},{"x":2720,"y":352,"w":64,"h":32},{"x":1056,"y":384,"w":64,"h":32},{"x":1920,"y":384,"w":96,"h":32},{"x":2432,"y":384,"w":96,"h":32},{"x":2752,"y":384,"w":96,"h":32},{"x":1088,"y":416,"w":64,"h":32},{"x":1888,"y":448,"w":32,"h":32},{"x":1888,"y":416,"w":64,"h":32},{"x":1888,"y":736,"w":256,"h":32},{"x":2496,"y":416,"w":64,"h":32},{"x":2496,"y":704,"w":96,"h":32},{"x":2816,"y":416,"w":64,"h":32},{"x":1120,"y":704,"w":128,"h":32},{"x":2176,"y":448,"w":64,"h":32},{"x":2848,"y":448,"w":64,"h":32},{"x":2880,"y":480,"w":32,"h":32},{"x":896,"y":512,"w":96,"h":32},{"x":1152,"y":608,"w":96,"h":32},{"x":800,"y":672,"w":32,"h":32},{"x":800,"y":640,"w":192,"h":32},{"x":1504,"y":640,"w":128,"h":32},{"x":2144,"y":640,"w":64,"h":32},{"x":960,"y":672,"w":32,"h":32},{"x":960,"y":704,"w":64,"h":32},{"x":1472,"y":672,"w":64,"h":32},{"x":1600,"y":672,"w":96,"h":32},{"x":2112,"y":704,"w":32,"h":32},{"x":2112,"y":672,"w":128,"h":32},{"x":2688,"y":672,"w":128,"h":32},{"x":768,"y":704,"w":64,"h":32},{"x":1440,"y":704,"w":64,"h":32},{"x":1664,"y":704,"w":256,"h":32},{"x":2784,"y":704,"w":160,"h":32},{"x":2976,"y":704,"w":64,"h":32},{"x":0,"y":736,"w":320,"h":32},{"x":480,"y":736,"w":320,"h":32},{"x":992,"y":736,"w":160,"h":32},{"x":1216,"y":736,"w":256,"h":32},{"x":1760,"y":736,"w":64,"h":32},{"x":2912,"y":736,"w":96,"h":32},{"x":0,"y":0,"w":1,"h":3040},{"x":0,"y":768,"w":3040,"h":1},{"x":0,"y":0,"w":3040,"h":1},{"x":3040,"y":0,"w":1,"h":768}],"debugColliders":[[{"type":"yWall","x":3011,"y":576,"w":29,"h":3},{"type":"yWall","x":3011,"y":701,"w":29,"h":3},{"type":"xWall","x":3008,"y":576,"w":3,"h":128},{"type":"xWall","x":3037,"y":576,"w":3,"h":128}],[{"type":"yWall","x":1123,"y":480,"w":61,"h":3},{"type":"yWall","x":1123,"y":541,"w":61,"h":3},{"type":"xWall","x":1120,"y":480,"w":3,"h":64},{"type":"xWall","x":1181,"y":480,"w":3,"h":64}],[{"type":"yWall","x":1123,"y":576,"w":61,"h":3},{"type":"yWall","x":1123,"y":605,"w":61,"h":3},{"type":"xWall","x":1120,"y":576,"w":3,"h":32},{"type":"xWall","x":1181,"y":576,"w":3,"h":32}],[{"type":"yWall","x":1123,"y":448,"w":29,"h":3},{"type":"yWall","x":1123,"y":477,"w":29,"h":3},{"type":"xWall","x":1120,"y":448,"w":3,"h":32},{"type":"xWall","x":1149,"y":448,"w":3,"h":32}],[{"type":"yWall","x":1123,"y":544,"w":29,"h":3},{"type":"yWall","x":1123,"y":573,"w":29,"h":3},{"type":"xWall","x":1120,"y":544,"w":3,"h":32},{"type":"xWall","x":1149,"y":544,"w":3,"h":32}],[{"type":"yWall","x":1123,"y":672,"w":29,"h":3},{"type":"yWall","x":1123,"y":701,"w":29,"h":3},{"type":"xWall","x":1120,"y":672,"w":3,"h":32},{"type":"xWall","x":1149,"y":672,"w":3,"h":32}],[{"type":"yWall","x":2211,"y":256,"w":29,"h":3},{"type":"yWall","x":2211,"y":285,"w":29,"h":3},{"type":"xWall","x":2208,"y":256,"w":3,"h":32},{"type":"xWall","x":2237,"y":256,"w":3,"h":32}],[{"type":"yWall","x":2211,"y":416,"w":29,"h":3},{"type":"yWall","x":2211,"y":445,"w":29,"h":3},{"type":"xWall","x":2208,"y":416,"w":3,"h":32},{"type":"xWall","x":2237,"y":416,"w":3,"h":32}],[{"type":"yWall","x":2627,"y":128,"w":29,"h":3},{"type":"yWall","x":2627,"y":157,"w":29,"h":3},{"type":"xWall","x":2624,"y":128,"w":3,"h":32},{"type":"xWall","x":2653,"y":128,"w":3,"h":32}],[{"type":"yWall","x":2627,"y":640,"w":93,"h":3},{"type":"yWall","x":2627,"y":669,"w":93,"h":3},{"type":"xWall","x":2624,"y":640,"w":3,"h":32},{"type":"xWall","x":2717,"y":640,"w":3,"h":32}],[{"type":"yWall","x":2243,"y":160,"w":61,"h":3},{"type":"yWall","x":2243,"y":189,"w":61,"h":3},{"type":"xWall","x":2240,"y":160,"w":3,"h":32},{"type":"xWall","x":2301,"y":160,"w":3,"h":32}],[{"type":"yWall","x":2595,"y":160,"w":61,"h":3},{"type":"yWall","x":2595,"y":189,"w":61,"h":3},{"type":"xWall","x":2592,"y":160,"w":3,"h":32},{"type":"xWall","x":2653,"y":160,"w":3,"h":32}],[{"type":"yWall","x":2275,"y":192,"w":61,"h":3},{"type":"yWall","x":2275,"y":221,"w":61,"h":3},{"type":"xWall","x":2272,"y":192,"w":3,"h":32},{"type":"xWall","x":2333,"y":192,"w":3,"h":32}],[{"type":"yWall","x":2275,"y":736,"w":253,"h":3},{"type":"yWall","x":2275,"y":765,"w":253,"h":3},{"type":"xWall","x":2272,"y":736,"w":3,"h":32},{"type":"xWall","x":2525,"y":736,"w":3,"h":32}],[{"type":"yWall","x":2563,"y":256,"w":29,"h":3},{"type":"yWall","x":2563,"y":285,"w":29,"h":3},{"type":"xWall","x":2560,"y":256,"w":3,"h":32},{"type":"xWall","x":2589,"y":256,"w":3,"h":32}],[{"type":"yWall","x":2563,"y":192,"w":61,"h":3},{"type":"yWall","x":2563,"y":221,"w":61,"h":3},{"type":"xWall","x":2560,"y":192,"w":3,"h":32},{"type":"xWall","x":2621,"y":192,"w":3,"h":32}],[{"type":"yWall","x":2563,"y":672,"w":93,"h":3},{"type":"yWall","x":2563,"y":701,"w":93,"h":3},{"type":"xWall","x":2560,"y":672,"w":3,"h":32},{"type":"xWall","x":2653,"y":672,"w":3,"h":32}],[{"type":"yWall","x":2307,"y":224,"w":61,"h":3},{"type":"yWall","x":2307,"y":253,"w":61,"h":3},{"type":"xWall","x":2304,"y":224,"w":3,"h":32},{"type":"xWall","x":2365,"y":224,"w":3,"h":32}],[{"type":"yWall","x":2307,"y":352,"w":157,"h":3},{"type":"yWall","x":2307,"y":381,"w":157,"h":3},{"type":"xWall","x":2304,"y":352,"w":3,"h":32},{"type":"xWall","x":2461,"y":352,"w":3,"h":32}],[{"type":"yWall","x":2531,"y":448,"w":29,"h":3},{"type":"yWall","x":2531,"y":477,"w":29,"h":3},{"type":"xWall","x":2528,"y":448,"w":3,"h":32},{"type":"xWall","x":2557,"y":448,"w":3,"h":32}],[{"type":"yWall","x":2531,"y":224,"w":61,"h":3},{"type":"yWall","x":2531,"y":253,"w":61,"h":3},{"type":"xWall","x":2528,"y":224,"w":3,"h":32},{"type":"xWall","x":2589,"y":224,"w":3,"h":32}],[{"type":"yWall","x":2211,"y":704,"w":61,"h":3},{"type":"yWall","x":2211,"y":733,"w":61,"h":3},{"type":"xWall","x":2208,"y":704,"w":3,"h":32},{"type":"xWall","x":2269,"y":704,"w":3,"h":32}],[{"type":"yWall","x":2211,"y":384,"w":93,"h":3},{"type":"yWall","x":2211,"y":413,"w":93,"h":3},{"type":"xWall","x":2208,"y":384,"w":3,"h":32},{"type":"xWall","x":2301,"y":384,"w":3,"h":32}],[{"type":"yWall","x":2339,"y":256,"w":189,"h":3},{"type":"yWall","x":2339,"y":285,"w":189,"h":3},{"type":"xWall","x":2336,"y":256,"w":3,"h":32},{"type":"xWall","x":2525,"y":256,"w":3,"h":32}],[{"type":"yWall","x":1987,"y":352,"w":125,"h":3},{"type":"yWall","x":1987,"y":381,"w":125,"h":3},{"type":"xWall","x":1984,"y":352,"w":3,"h":32},{"type":"xWall","x":2109,"y":352,"w":3,"h":32}],[{"type":"yWall","x":2723,"y":352,"w":61,"h":3},{"type":"yWall","x":2723,"y":381,"w":61,"h":3},{"type":"xWall","x":2720,"y":352,"w":3,"h":32},{"type":"xWall","x":2781,"y":352,"w":3,"h":32}],[{"type":"yWall","x":1059,"y":384,"w":61,"h":3},{"type":"yWall","x":1059,"y":413,"w":61,"h":3},{"type":"xWall","x":1056,"y":384,"w":3,"h":32},{"type":"xWall","x":1117,"y":384,"w":3,"h":32}],[{"type":"yWall","x":1923,"y":384,"w":93,"h":3},{"type":"yWall","x":1923,"y":413,"w":93,"h":3},{"type":"xWall","x":1920,"y":384,"w":3,"h":32},{"type":"xWall","x":2013,"y":384,"w":3,"h":32}],[{"type":"yWall","x":2435,"y":384,"w":93,"h":3},{"type":"yWall","x":2435,"y":413,"w":93,"h":3},{"type":"xWall","x":2432,"y":384,"w":3,"h":32},{"type":"xWall","x":2525,"y":384,"w":3,"h":32}],[{"type":"yWall","x":2755,"y":384,"w":93,"h":3},{"type":"yWall","x":2755,"y":413,"w":93,"h":3},{"type":"xWall","x":2752,"y":384,"w":3,"h":32},{"type":"xWall","x":2845,"y":384,"w":3,"h":32}],[{"type":"yWall","x":1091,"y":416,"w":61,"h":3},{"type":"yWall","x":1091,"y":445,"w":61,"h":3},{"type":"xWall","x":1088,"y":416,"w":3,"h":32},{"type":"xWall","x":1149,"y":416,"w":3,"h":32}],[{"type":"yWall","x":1891,"y":448,"w":29,"h":3},{"type":"yWall","x":1891,"y":477,"w":29,"h":3},{"type":"xWall","x":1888,"y":448,"w":3,"h":32},{"type":"xWall","x":1917,"y":448,"w":3,"h":32}],[{"type":"yWall","x":1891,"y":416,"w":61,"h":3},{"type":"yWall","x":1891,"y":445,"w":61,"h":3},{"type":"xWall","x":1888,"y":416,"w":3,"h":32},{"type":"xWall","x":1949,"y":416,"w":3,"h":32}],[{"type":"yWall","x":1891,"y":736,"w":253,"h":3},{"type":"yWall","x":1891,"y":765,"w":253,"h":3},{"type":"xWall","x":1888,"y":736,"w":3,"h":32},{"type":"xWall","x":2141,"y":736,"w":3,"h":32}],[{"type":"yWall","x":2499,"y":416,"w":61,"h":3},{"type":"yWall","x":2499,"y":445,"w":61,"h":3},{"type":"xWall","x":2496,"y":416,"w":3,"h":32},{"type":"xWall","x":2557,"y":416,"w":3,"h":32}],[{"type":"yWall","x":2499,"y":704,"w":93,"h":3},{"type":"yWall","x":2499,"y":733,"w":93,"h":3},{"type":"xWall","x":2496,"y":704,"w":3,"h":32},{"type":"xWall","x":2589,"y":704,"w":3,"h":32}],[{"type":"yWall","x":2819,"y":416,"w":61,"h":3},{"type":"yWall","x":2819,"y":445,"w":61,"h":3},{"type":"xWall","x":2816,"y":416,"w":3,"h":32},{"type":"xWall","x":2877,"y":416,"w":3,"h":32}],[{"type":"yWall","x":1123,"y":704,"w":125,"h":3},{"type":"yWall","x":1123,"y":733,"w":125,"h":3},{"type":"xWall","x":1120,"y":704,"w":3,"h":32},{"type":"xWall","x":1245,"y":704,"w":3,"h":32}],[{"type":"yWall","x":2179,"y":448,"w":61,"h":3},{"type":"yWall","x":2179,"y":477,"w":61,"h":3},{"type":"xWall","x":2176,"y":448,"w":3,"h":32},{"type":"xWall","x":2237,"y":448,"w":3,"h":32}],[{"type":"yWall","x":2851,"y":448,"w":61,"h":3},{"type":"yWall","x":2851,"y":477,"w":61,"h":3},{"type":"xWall","x":2848,"y":448,"w":3,"h":32},{"type":"xWall","x":2909,"y":448,"w":3,"h":32}],[{"type":"yWall","x":2883,"y":480,"w":29,"h":3},{"type":"yWall","x":2883,"y":509,"w":29,"h":3},{"type":"xWall","x":2880,"y":480,"w":3,"h":32},{"type":"xWall","x":2909,"y":480,"w":3,"h":32}],[{"type":"yWall","x":899,"y":512,"w":93,"h":3},{"type":"yWall","x":899,"y":541,"w":93,"h":3},{"type":"xWall","x":896,"y":512,"w":3,"h":32},{"type":"xWall","x":989,"y":512,"w":3,"h":32}],[{"type":"yWall","x":1155,"y":608,"w":93,"h":3},{"type":"yWall","x":1155,"y":637,"w":93,"h":3},{"type":"xWall","x":1152,"y":608,"w":3,"h":32},{"type":"xWall","x":1245,"y":608,"w":3,"h":32}],[{"type":"yWall","x":803,"y":672,"w":29,"h":3},{"type":"yWall","x":803,"y":701,"w":29,"h":3},{"type":"xWall","x":800,"y":672,"w":3,"h":32},{"type":"xWall","x":829,"y":672,"w":3,"h":32}],[{"type":"yWall","x":803,"y":640,"w":189,"h":3},{"type":"yWall","x":803,"y":669,"w":189,"h":3},{"type":"xWall","x":800,"y":640,"w":3,"h":32},{"type":"xWall","x":989,"y":640,"w":3,"h":32}],[{"type":"yWall","x":1507,"y":640,"w":125,"h":3},{"type":"yWall","x":1507,"y":669,"w":125,"h":3},{"type":"xWall","x":1504,"y":640,"w":3,"h":32},{"type":"xWall","x":1629,"y":640,"w":3,"h":32}],[{"type":"yWall","x":2147,"y":640,"w":61,"h":3},{"type":"yWall","x":2147,"y":669,"w":61,"h":3},{"type":"xWall","x":2144,"y":640,"w":3,"h":32},{"type":"xWall","x":2205,"y":640,"w":3,"h":32}],[{"type":"yWall","x":963,"y":672,"w":29,"h":3},{"type":"yWall","x":963,"y":701,"w":29,"h":3},{"type":"xWall","x":960,"y":672,"w":3,"h":32},{"type":"xWall","x":989,"y":672,"w":3,"h":32}],[{"type":"yWall","x":963,"y":704,"w":61,"h":3},{"type":"yWall","x":963,"y":733,"w":61,"h":3},{"type":"xWall","x":960,"y":704,"w":3,"h":32},{"type":"xWall","x":1021,"y":704,"w":3,"h":32}],[{"type":"yWall","x":1475,"y":672,"w":61,"h":3},{"type":"yWall","x":1475,"y":701,"w":61,"h":3},{"type":"xWall","x":1472,"y":672,"w":3,"h":32},{"type":"xWall","x":1533,"y":672,"w":3,"h":32}],[{"type":"yWall","x":1603,"y":672,"w":93,"h":3},{"type":"yWall","x":1603,"y":701,"w":93,"h":3},{"type":"xWall","x":1600,"y":672,"w":3,"h":32},{"type":"xWall","x":1693,"y":672,"w":3,"h":32}],[{"type":"yWall","x":2115,"y":704,"w":29,"h":3},{"type":"yWall","x":2115,"y":733,"w":29,"h":3},{"type":"xWall","x":2112,"y":704,"w":3,"h":32},{"type":"xWall","x":2141,"y":704,"w":3,"h":32}],[{"type":"yWall","x":2115,"y":672,"w":125,"h":3},{"type":"yWall","x":2115,"y":701,"w":125,"h":3},{"type":"xWall","x":2112,"y":672,"w":3,"h":32},{"type":"xWall","x":2237,"y":672,"w":3,"h":32}],[{"type":"yWall","x":2691,"y":672,"w":125,"h":3},{"type":"yWall","x":2691,"y":701,"w":125,"h":3},{"type":"xWall","x":2688,"y":672,"w":3,"h":32},{"type":"xWall","x":2813,"y":672,"w":3,"h":32}],[{"type":"yWall","x":771,"y":704,"w":61,"h":3},{"type":"yWall","x":771,"y":733,"w":61,"h":3},{"type":"xWall","x":768,"y":704,"w":3,"h":32},{"type":"xWall","x":829,"y":704,"w":3,"h":32}],[{"type":"yWall","x":1443,"y":704,"w":61,"h":3},{"type":"yWall","x":1443,"y":733,"w":61,"h":3},{"type":"xWall","x":1440,"y":704,"w":3,"h":32},{"type":"xWall","x":1501,"y":704,"w":3,"h":32}],[{"type":"yWall","x":1667,"y":704,"w":253,"h":3},{"type":"yWall","x":1667,"y":733,"w":253,"h":3},{"type":"xWall","x":1664,"y":704,"w":3,"h":32},{"type":"xWall","x":1917,"y":704,"w":3,"h":32}],[{"type":"yWall","x":2787,"y":704,"w":157,"h":3},{"type":"yWall","x":2787,"y":733,"w":157,"h":3},{"type":"xWall","x":2784,"y":704,"w":3,"h":32},{"type":"xWall","x":2941,"y":704,"w":3,"h":32}],[{"type":"yWall","x":2979,"y":704,"w":61,"h":3},{"type":"yWall","x":2979,"y":733,"w":61,"h":3},{"type":"xWall","x":2976,"y":704,"w":3,"h":32},{"type":"xWall","x":3037,"y":704,"w":3,"h":32}],[{"type":"yWall","x":3,"y":736,"w":317,"h":3},{"type":"yWall","x":3,"y":765,"w":317,"h":3},{"type":"xWall","x":0,"y":736,"w":3,"h":32},{"type":"xWall","x":317,"y":736,"w":3,"h":32}],[{"type":"yWall","x":483,"y":736,"w":317,"h":3},{"type":"yWall","x":483,"y":765,"w":317,"h":3},{"type":"xWall","x":480,"y":736,"w":3,"h":32},{"type":"xWall","x":797,"y":736,"w":3,"h":32}],[{"type":"yWall","x":995,"y":736,"w":157,"h":3},{"type":"yWall","x":995,"y":765,"w":157,"h":3},{"type":"xWall","x":992,"y":736,"w":3,"h":32},{"type":"xWall","x":1149,"y":736,"w":3,"h":32}],[{"type":"yWall","x":1219,"y":736,"w":253,"h":3},{"type":"yWall","x":1219,"y":765,"w":253,"h":3},{"type":"xWall","x":1216,"y":736,"w":3,"h":32},{"type":"xWall","x":1469,"y":736,"w":3,"h":32}],[{"type":"yWall","x":1763,"y":736,"w":61,"h":3},{"type":"yWall","x":1763,"y":765,"w":61,"h":3},{"type":"xWall","x":1760,"y":736,"w":3,"h":32},{"type":"xWall","x":1821,"y":736,"w":3,"h":32}],[{"type":"yWall","x":2915,"y":736,"w":93,"h":3},{"type":"yWall","x":2915,"y":765,"w":93,"h":3},{"type":"xWall","x":2912,"y":736,"w":3,"h":32},{"type":"xWall","x":3005,"y":736,"w":3,"h":32}],[{"type":"yWall","x":3,"y":0,"w":-2,"h":3},{"type":"yWall","x":3,"y":3037,"w":-2,"h":3},{"type":"xWall","x":0,"y":0,"w":3,"h":3040},{"type":"xWall","x":-2,"y":0,"w":3,"h":3040}],[{"type":"yWall","x":3,"y":768,"w":3037,"h":3},{"type":"yWall","x":3,"y":766,"w":3037,"h":3},{"type":"xWall","x":0,"y":768,"w":3,"h":1},{"type":"xWall","x":3037,"y":768,"w":3,"h":1}],[{"type":"yWall","x":3,"y":0,"w":3037,"h":3},{"type":"yWall","x":3,"y":-2,"w":3037,"h":3},{"type":"xWall","x":0,"y":0,"w":3,"h":1},{"type":"xWall","x":3037,"y":0,"w":3,"h":1}],[{"type":"yWall","x":3043,"y":0,"w":-2,"h":3},{"type":"yWall","x":3043,"y":765,"w":-2,"h":3},{"type":"xWall","x":3040,"y":0,"w":3,"h":768},{"type":"xWall","x":3038,"y":0,"w":3,"h":768}]]};
        this.groundTilesNbr = [];
        this.rCamToggle = false;
        this.viewPortWidth = viewport.w;
        this.viewPortHeight = viewport.h;
        this.canvas.width = this.viewPortWidth;
        this.canvas.height = this.viewPortHeight;
        /*
                for (let i = 0; i < this.map.width; i += this.groundTileSize) {
                    for (let j = 0; j < this.map.height; j += this.groundTileSize) {
                        this.groundTilesNbr.push(0);
                    }
                }
                this.groundTilesNbr.push(0) // we actually need 1 more;*/
    }

    renderMap(player, map, shakeX, shakeY, xOffset, yOffset) {

        this.ctx.imageSmoothingEnabled = false;

        let endSceneX = (player.x - xOffset + this.viewPortWidth) - this.map.width;
        //let endSceneY = (player.y + yOffset + this.viewPortHeight) - this.map.height;

        let scDrawXstart;

        if (endSceneX < 0) {
            scDrawXstart = player.x - xOffset;
        } else {
            this.playerLinc = 0;
            this.playerRinc = endSceneX;
            scDrawXstart = this.map.width - this.viewPortWidth;
        }

        if (scDrawXstart <= 0) {
            this.playerRinc = 0;
            this.playerLinc = scDrawXstart;
            scDrawXstart = 0;
        }

        let scDrawYstart = player.y - (this.viewPortHeight - player.height - yOffset);
        let scDrawYend = player.y + player.height + yOffset - this.map.height;

        if (scDrawYstart <= 0) {
            this.playerYinc = scDrawYstart;
            scDrawYstart = 0;
        } else if (scDrawYend > 0) {
            this.playerYinc = scDrawYend;
            scDrawYstart = this.map.height - this.viewPortHeight;
        }

        for (let i = -scDrawXstart; i < this.viewPortWidth; i += this.groundTileSize) {
            for (let j = -scDrawYstart; j < this.viewPortHeight; j += this.groundTileSize) {
                this.drawingTools.drawSprite('ground_' + 1, i + shakeX, j + shakeY);
            }
        }

        map.coords.forEach(v => {
            if (v.w > 1 && v.h > 1) {
                for (let i = v.x - scDrawXstart; i < v.x - scDrawXstart + v.w; i += this.spriteSize) {
                    for (let j = v.y - scDrawYstart; j < v.y - scDrawYstart + v.h; j += this.spriteSize) {
                        this.drawingTools.drawSprite('wall', i + shakeX, j + shakeY);
                    }
                }
            }
        });
        this.debugColliders(map.debugColliders, scDrawXstart, scDrawYstart);
    }

    debugColliders(colliders, xOff, yOff) {

        colliders.forEach((collider) => {
            collider.forEach((v) => {
                let fillStyle;
                if (v.type === "yWall") {
                    fillStyle = "red";
                } else {
                    fillStyle = "green";
                }
                this.ctx.beginPath();
                this.ctx.rect(v.x - xOff, v.y - yOff, v.w, v.h);
                this.ctx.fillStyle = fillStyle;
                this.ctx.closePath();
                this.ctx.fill();
            })
        })
    }

    getMap() {
        return this.map;
    }
}