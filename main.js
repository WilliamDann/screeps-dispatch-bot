"use strict";
exports.__esModule = true;
exports.loop = void 0;
var Bot = require("./Bot");
var Disbatch_1 = require("./Disbatch");
var Bulletin_1 = require("./Bulletin");
var PopulationManager_1 = require("./PopulationManager");
var ContainerManager_1 = require("./ContainerManager");
var ControllerManager_1 = require("./ControllerManager");
var ConstructionManager_1 = require("./ConstructionManager");
function loop() {
    // clear dead creeps
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    var bulletin = Bulletin_1.Bulletin.loadFromMemory(Game.spawns.MainSpawn.memory);
    // find free creeps
    var freeCreeps = [];
    for (var _i = 0, _a = Object.keys(Game.creeps); _i < _a.length; _i++) {
        var creepID = _a[_i];
        var creep = Game.creeps[creepID];
        if (!creep.memory["commands"] || !creep.memory["commands"][0])
            freeCreeps.push(creep);
    }
    var room = Game.spawns.MainSpawn.room;
    var disbatch = new Disbatch_1.Disbatch([
        new PopulationManager_1.PopulationManager(room, bulletin),
        new ContainerManager_1.ContainerManager(room, bulletin),
        new ControllerManager_1.ControllerManager(room, bulletin),
        new ConstructionManager_1.ConstructionManager(room, bulletin)
    ]);
    disbatch.run(freeCreeps);
    for (var name in Game.creeps) {
        Bot.run(Game.creeps[name], bulletin);
    }
    Game.spawns.MainSpawn.memory["posts"] = bulletin.posts;
}
exports.loop = loop;
