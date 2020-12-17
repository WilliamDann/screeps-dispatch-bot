"use strict";
// Population.ts
//   Instrucitons to disbatch on maintining creep population
exports.__esModule = true;
exports.PopulationManager = void 0;
var Globals = require("./Globals");
var Bot_1 = require("./Bot");
var Funcs_1 = require("./Funcs");
var PopulationManager = /** @class */ (function () {
    function PopulationManager(room, bulletin) {
        this.room = room;
        this.bulletin = bulletin;
    }
    PopulationManager.prototype.run = function (free) {
        if (!this.room.memory["popMax"])
            this.room.memory["popMax"] = this.calculatePopulationMax();
        var spawner = this.room.find(FIND_MY_SPAWNS)[0];
        var spawned = this.room.find(FIND_MY_CREEPS).length;
        if (spawned < this.room.memory["popMax"]) {
            var name_1 = this.generateCreepName();
            var body = this.calculateBodyPattern();
            var result = Game.spawns.MainSpawn.spawnCreep(body, name_1);
            if (result == ERR_NOT_ENOUGH_ENERGY)
                if (this.bulletin.findJobsOut(spawner.id) <= Globals.SPAWN_WORKERS) {
                    var assignee = free.pop();
                    if (!assignee)
                        return;
                    var pickupStruct = Funcs_1.findFilledContainers(this.room)[0];
                    var dropoffStruct = this.findEnergyDropoff(spawner);
                    var pickup = void 0;
                    if (!pickupStruct) {
                        var source = this.room.find(FIND_SOURCES_ACTIVE)[0];
                        pickup = new Bot_1.Command(source.id, "harvest", Bot_1.CompleteType.InventoryFull);
                    }
                    else
                        pickup = new Bot_1.Command(pickupStruct.id, "withdraw", Bot_1.CompleteType.InventoryFull, RESOURCE_ENERGY);
                    var dropoff = new Bot_1.Command(dropoffStruct.id, "transfer", Bot_1.CompleteType.InventoryEmpty, RESOURCE_ENERGY);
                    Bot_1.assignCommand(assignee, pickup, this.bulletin);
                    Bot_1.assignCommand(assignee, dropoff, this.bulletin);
                }
        }
    };
    // find a place to put energy
    PopulationManager.prototype.findEnergyDropoff = function (spawner) {
        if (spawner.store.energy != spawner.energyCapacity)
            return spawner;
        var extentions = this.room.find(FIND_MY_STRUCTURES, { filter: function (s) { return s.structureType == STRUCTURE_EXTENSION && s.store.energy != s.energyCapacity; }
        });
        if (extentions.length != 0)
            return extentions[0];
        else
            return null;
    };
    // find the optimal amount of creeps in a room
    PopulationManager.prototype.calculatePopulationMax = function () {
        var num = 0;
        num += this.room.find(FIND_MY_SPAWNS).length * Globals.SPAWN_WORKERS;
        num += Globals.UPGRADE_WORKERS;
        num += Globals.BUILD_WORKERS;
        num += Globals.MINE_WORKERS;
        num += Globals.REPAIR_WORKERS;
        return num;
    };
    // find the optimal body config for a room
    PopulationManager.prototype.calculateBodyPattern = function () {
        var parts = [];
        var baseParts = [WORK, MOVE, CARRY];
        var toSpend = this.room.energyCapacityAvailable;
        while (toSpend > 0) {
            for (var _i = 0, baseParts_1 = baseParts; _i < baseParts_1.length; _i++) {
                var part = baseParts_1[_i];
                toSpend -= BODYPART_COST[part];
                if (toSpend >= 0)
                    parts.push(part);
                else
                    break;
            }
        }
        return parts;
    };
    // generate a name for a creep
    PopulationManager.prototype.generateCreepName = function (prefix) {
        if (prefix === void 0) { prefix = "bot"; }
        return "" + prefix + Math.round(Math.random() * 1000);
    };
    return PopulationManager;
}());
exports.PopulationManager = PopulationManager;
