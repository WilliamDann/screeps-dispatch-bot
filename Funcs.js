"use strict";
exports.__esModule = true;
exports.findConstructionContainer = exports.findFilledContainers = exports.findFillableContainers = exports.creepsOnTask = void 0;
function creepsOnTask(room, task) {
    var num = 0;
    for (var _i = 0, _a = Object.keys(Game.creeps); _i < _a.length; _i++) {
        var id = _a[_i];
        var creep = Game.creeps[id];
        if (creep.room.name != room.name)
            continue;
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
