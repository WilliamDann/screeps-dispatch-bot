"use strict";
exports.__esModule = true;
exports.loop = void 0;
var Bot = require("./Bot");
var Disbatch = require("./Disbatch");
var Bulletin_1 = require("./Bulletin");
function loop() {
    // clear dead creeps
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    var posts;
    if (!Game.spawns.MainSpawn.memory["posts"])
        posts = [];
    else
        posts = Game.spawns.MainSpawn.memory["posts"];
    var bulletin = new Bulletin_1.Bulletin(posts);
    Disbatch.run(Game.spawns.MainSpawn.room, bulletin);
    for (var name in Game.creeps) {
        Bot.run(Game.creeps[name], bulletin);
    }
    Game.spawns.MainSpawn.memory["posts"] = bulletin.posts;
}
exports.loop = loop;
