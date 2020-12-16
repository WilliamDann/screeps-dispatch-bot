"use strict";
// Disbatch.js
//   assigns commands to creeps in a room
exports.__esModule = true;
exports.run = void 0;
var Construction_1 = require("./Construction");
var Containers_1 = require("./Containers");
var Controller_1 = require("./Controller");
var Population_1 = require("./Population");
function run(room, bulletin) {
    // load information
    var creeps = [];
    for (var _i = 0, _a = room.find(FIND_MY_CREEPS); _i < _a.length; _i++) {
        var creep = _a[_i];
        if (!creep.memory["commands"] || creep.memory["commands"].length == 0)
            creeps.push(creep);
    }
    // maintain creep population
    Population_1.PopulationUpkeep(room, creeps, bulletin);
    // fill containers 
    Containers_1.FillContainers(room, creeps, bulletin);
    // upgrade controller
    Controller_1.ControllerUpgrade(room, creeps, bulletin);
    // build sites
    Construction_1.ConstructSites(room, creeps, bulletin);
    // update bulletin
    room.memory["bulletin"] = bulletin;
}
exports.run = run;
