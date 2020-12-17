"use strict";
// Bot.js
//   carries out commands given to creeps
exports.__esModule = true;
exports.Command = exports.run = exports.assignCommand = exports.CompleteType = void 0;
var Bulletin_1 = require("./Bulletin");
var CompleteType;
(function (CompleteType) {
    CompleteType[CompleteType["InventoryFull"] = 0] = "InventoryFull";
    CompleteType[CompleteType["InventoryEmpty"] = 1] = "InventoryEmpty";
    CompleteType[CompleteType["TargetRepaired"] = 2] = "TargetRepaired";
})(CompleteType = exports.CompleteType || (exports.CompleteType = {}));
function complete(creep, bulletin) {
    var commands = creep.memory["commands"];
    var command = commands.shift();
    bulletin.add(new Bulletin_1.Posting(command.target, "job_complete", creep.name));
    creep.memory["commands"] = commands;
}
function handleResult(creep, result, bulletin) {
    if (result != OK)
        if (!creep.memory["errors"])
            creep.memory["errors"] = 1;
        else
            creep.memory["errors"] += 1;
    else
        creep.memory["errors"] = 0;
    if (creep.memory["errors"] > 3) {
        complete(creep, bulletin);
        creep.memory["errors"] = 0;
    }
}
function assignCommand(creep, command, bulletin) {
    if (creep.memory["commands"] == undefined || !creep.memory["commands"].length)
        creep.memory["commands"] = [];
    bulletin.add(new Bulletin_1.Posting(command.target, "job_assign", "disbatch"));
    creep.memory["commands"].push(command);
}
exports.assignCommand = assignCommand;
function run(creep, bulletin) {
    if (creep.memory["commands"] == undefined)
        return;
    if (creep.memory["commands"].length == 0)
        return;
    var commands = creep.memory["commands"];
    var command = commands[0];
    var target = Game.getObjectById(command.target);
    // run command
    var result;
    if (command.arg)
        result = creep[command.action](target, command.arg);
    else
        result = creep[command.action](target);
    if (result == ERR_NOT_IN_RANGE)
        result = creep.moveTo(target);
    // check complete
    switch (command.complete) {
        case CompleteType.InventoryFull:
            if (creep.store.getFreeCapacity() == 0)
                complete(creep, bulletin);
            break;
        case CompleteType.InventoryEmpty:
            if (creep.store.getFreeCapacity() == creep.store.getCapacity())
                complete(creep, bulletin);
            break;
        case CompleteType.TargetRepaired:
            if (target.hits == target.hitsMax)
                complete(creep, bulletin);
            break;
    }
    handleResult(creep, result, bulletin);
    // creep.say(`${command.action[0]} : ${result}`);
    return result;
}
exports.run = run;
var Command = /** @class */ (function () {
    function Command(target, action, complete, arg) {
        this.target = target;
        this.action = action;
        this.complete = complete;
        this.arg = arg;
    }
    return Command;
}());
exports.Command = Command;
