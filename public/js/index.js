const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const posPingRate = 1000 / 10;
const showFPS = true;


import { DrawingTools } from "/public/js/class/drawingTools/DrawingTools.js";
import { MapManager } from "/public/js/class/mapManager/MapManager.js";
import { Player } from "/public/js/class/player/Player.js";
import { Mouse } from "/public/js/class/mouseHandling/Mouse.js";
import { Keyboard } from "/public/js/class/keyboardHandling/Keyboard.js";
import { CollisionDetector } from "/public/js/class/collision/CollisionDetector.js";


let sprites;
let perfProfile;

const fpsProfile = getFPS();
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

Promise.all([spritesFetch, fpsProfile]).then((promiseObjs) => { //waits for all async fetch

    promiseObjs.forEach((obj) => {
        if (obj.hasOwnProperty("fps")) {
            perfProfile = obj.fps > 100 ? "high" : "normal";
        }
    })

    let drawingTools = new DrawingTools(gameCanvas, ctx, sprites);
    let mapManager = new MapManager(gameCanvas, ctx, drawingTools, rndmInteger);
    let map = mapManager.getMap();
    let collisionDetector = new CollisionDetector(map)
    let player = new Player(drawingTools, collisionDetector);
    let mouse = new Mouse(gameCanvas);
    let keyboard = new Keyboard(gameCanvas);
    let curPos = null;



    let ghostPlayers = [];

    let direction = {};
    let playerShots = [];
    let explosions = [];
    let lastRun;
    let playerAngle;
    let screenShake = false;

    let lastKey = { type: "", key: "" };
    let jump = false;

    gameCanvas.addEventListener('mousemove', (evt) => {
        curPos = mouse.getMousePos(evt);
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
        player.update(direction, jump);
        const playerPos = { x: player.x, y: player.y, width: player.width, height: player.height, jumping: player.jumping, vx: player.vx, vy: player.vy };
        mapManager.renderMap(playerPos, map, 0, 0);
        player.draw(mapManager.playerLinc, mapManager.playerRinc);
    }

    setInterval(() => {
        render();
    }, 1000 / 144)

})
