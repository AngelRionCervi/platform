const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const framerate = 1000 / 144;
const viewport = { w: 1200, h: 760 };


import { DrawingTools } from "/public/js/class/drawingTools/DrawingTools.js";
import { MapManager } from "/public/js/class/mapManager/MapManager.js";
import { Player } from "/public/js/class/player/Player.js";
import { Mouse } from "/public/js/class/mouseHandling/Mouse.js";
import { Keyboard } from "/public/js/class/keyboardHandling/Keyboard.js";
import { CollisionDetector } from "/public/js/class/collision/CollisionDetector.js";


let sprites;


const spritesFetch = new Promise((resolve, reject) => {
    fetch("/public/assets/sprites.json")
        .then(response => response.json())
        .then(json => {
            sprites = json;
            resolve({ playerSprites: "done" });
        })
        .catch(err => {
            console.log(err);
            reject();
        });
})

Promise.all([spritesFetch]).then((promiseObjs) => { //waits for all async fetch


    let drawingTools = new DrawingTools(gameCanvas, ctx, sprites);
    let mapManager = new MapManager(gameCanvas, ctx, drawingTools, viewport);
    let map = mapManager.getMap();
    let collisionDetector = new CollisionDetector(map)
    let player = new Player(drawingTools, collisionDetector, viewport);
    let mouse = new Mouse(gameCanvas);
    let keyboard = new Keyboard(gameCanvas);


    let direction = {};
    let screenShake = false;

    let lastKey = { type: "", key: "" };
    let jump = false;

    gameCanvas.addEventListener('mousemove', (evt) => {
        //curPos = mouse.getMousePos(evt);
    });

    gameCanvas.addEventListener('mousedown', () => {

    });

    document.addEventListener('keydown', (evt) => {
        if (lastKey.type !== evt.type || lastKey.key !== evt.key) {
            direction = keyboard.getDirection(evt);
            lastKey.type = evt.type;
            lastKey.key = evt.key;
            jump = keyboard.getSpaceBar();
        }
    });

    document.addEventListener('keyup', (evt) => {
        if (lastKey.type !== evt.type || lastKey.key !== evt.key) {
            direction = keyboard.getDirection(evt);
            lastKey.type = evt.type;
            lastKey.key = evt.key;
            jump = keyboard.getSpaceBar();
        }
    });

    function render() {
        ctx.fillRect(0, 0, viewport.w, viewport.h)
        player.update(direction, jump);
        const playerPos = { x: player.x, y: player.y, width: player.width, height: player.height, jumping: player.jumping, vx: player.vx, vy: player.vy ,xOffset: player.xOffset, direction: direction};
        
        mapManager.renderMap(playerPos, map, 0, 0, player.xOffset, player.yOffset);
        player.draw(mapManager.playerLinc, mapManager.playerRinc, mapManager.playerYinc);
    }

    setInterval(() => {
        render();
    }, framerate)

})
