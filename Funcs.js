"use strict";
exports.__esModule = true;
exports.findConstructionContainer = exports.findFilledContainers = exports.findFillableContainers = exports.creepsOnTask = void 0;
function creepsOnTask(room, task) {
    var num = 0;
    var creeps = room.find(FIND_MY_CREEPS);
    for (var _i = 0, creeps_1 = creeps; _i < creeps_1.length; _i++) {
        var creep = creeps_1[_i];
        if (!creep.memory["commands"])
            continue;
        if (!creep.memory["commands"][0])
            continue;
        if (creep.memory["commands"][0].action == task)
            num++;
    }
    return num;
}
exports.creepsOnTask = creepsOnTask;
function findFillableContainers(room) {
    var containers = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER && s.store.energy != s.store.getCapacity(RESOURCE_ENERGY); }
    });
    return containers;
}
exports.findFillableContainers = findFillableContainers;
function findFilledContainers(room) {
    var containers = room.find(FIND_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER && s.store.energy != 0; }
    });
    return containers;
}
exports.findFilledContainers = findFilledContainers;
function findConstructionContainer(room) {
    var sites = room.find(FIND_CONSTRUCTION_SITES, { filter: function (s) { return s.structureType == STRUCTURE_CONTAINER; } });
    return sites[0];
}
exports.findConstructionContainer = findConstructionContainer;
