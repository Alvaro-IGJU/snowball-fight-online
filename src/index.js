const express = require("express");
const { createServer } = require("http");
const { resolve } = require("path");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
const tmx = require('tmx-parser');

async function main() {
    const map = await new Promise((resolve, reject) => {
        tmx.parseFile('./src/map.tmx', function (err, loadedMap) {
            if (err) throw err;
            resolve(loadedMap);
        })
    });

    const layer = map.layers[0];
    const tiles = layer.tiles;
    const map2D = [];
    for (let row = 0; row <= map.height; row++) {
        const tileRow = [];
        for (let col = 0; col <= map.width; col++) {
            const tile = tiles[row * map.height + col];
            tileRow.push(tile);
        }
        map2D.push(tileRow);
    }

    console.log(map2D);

    io.on("connect", (socket) => {
        console.log("user connected", socket.id);

        io.emit('map', map2D);
    })

    app.use(express.static("public"));


    httpServer.listen(5000);

}

main();