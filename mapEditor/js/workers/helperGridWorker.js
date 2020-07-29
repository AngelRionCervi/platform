
/*
self.onmessage = ({ data: { buffer, camCoord, gw, gh, xs, ys, zoom, vpWidth, vpHeight, color, dashes } }) => {
    const ctx = buffer.getContext("2d");
    const ts = (n) => Math.floor(n * zoom);
    buffer.width = vpWidth;
    buffer.height = vpHeight;

    ctx.setLineDash(dashes);
    ctx.strokeStyle = color;

    for (let u = 0, len = xs.length; u < len; u++) {
        ctx.beginPath();
        ctx.moveTo(camCoord.x + ts(xs[u]) + 0.5, camCoord.y);
        ctx.lineTo(camCoord.x + ts(xs[u]) + 0.5, camCoord.y + ts(gh));
        ctx.stroke();
    }

    for (let u = 0, len = ys.length; u < len; u++) {
        ctx.beginPath();
        ctx.moveTo(camCoord.x, camCoord.y + ts(ys[u]) + 0.5);
        ctx.lineTo(camCoord.x + ts(gw), camCoord.y + ts(ys[u]) + 0.5);
        ctx.stroke();
    }

    self.postMessage({ buffer });
};*/

let buffer;
let ctx;

const drawGrid = ({ camCoord, gw, gh, xs, ys, zoom, vpWidth, vpHeight, color, dashes }) => {
    const ts = (n) => Math.floor(n * zoom);
    
    ctx.clearRect(0, 0, buffer.width, buffer.height);

    ctx.setLineDash(dashes);
    ctx.strokeStyle = color;

    for (let u = 0, len = xs.length; u < len; u++) {
        ctx.beginPath();
        ctx.moveTo(camCoord.x + ts(xs[u]) + 0.5, camCoord.y);
        ctx.lineTo(camCoord.x + ts(xs[u]) + 0.5, camCoord.y + ts(gh));
        ctx.stroke();
    }

    for (let u = 0, len = ys.length; u < len; u++) {
        ctx.beginPath();
        ctx.moveTo(camCoord.x, camCoord.y + ts(ys[u]) + 0.5);
        ctx.lineTo(camCoord.x + ts(gw), camCoord.y + ts(ys[u]) + 0.5);
        ctx.stroke();
    }
    /*
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 500, 500);*/

    self.postMessage("done");
}

self.onmessage = (evt) => {
    switch (evt.data.type) {
        case "init": {
            
            buffer = evt.data.offscreen;
            ctx = buffer.getContext("2d");
            console.log("init msg", buffer)
            break;
        }
        case "drawGrid": {
            drawGrid(evt.data.load);
        }
    }
}
