"use strict";
// RepairManager
//   disbatch insteuctions to repair structures
exports.__esModule = true;
exports.RepairManager = void 0;
var Globals = require("./Globals");
var Funcs_1 = require("./Funcs");
var Bot_1 = require("./Bot");
var RepairManager = /** @class */ (function () {
    function RepairManager(room, bulletin) {
        this.room = room;
        this.bulletin = bulletin;
    }
    RepairManager.prototype.run = function (free) {
        if (Funcs_1.creepsOnTask(this.room, "repair") >= Globals.REPAIR_WORKERS)
            return;
        var assignee = free.pop();
        if (!assignee)
            return;
        var containers = Funcs_1.findFilledContainers(this.room);
        var struct = this.findRepairable();
        if (!struct[0] || !containers[0]) {
            free.push(assignee);
            return;
        }
        var pickup = new Bot_1.Command(containers[0].id, "withdraw", Bot_1.CompleteType.InventoryFull, RESOURCE_ENERGY);
        var repair = new Bot_1.Command(struct[0].id, "repair", Bot_1.CompleteType.TargetRepaired);
        Bot_1.assignCommand(assignee, pickup, this.bulletin);
        Bot_1.assignCommand(assignee, repair, this.bulletin);
    };
    RepairManager.prototype.findRepairable = function () {
        return this.room.find(FIND_STRUCTURES, { filter: function (s) { return s.hits != s.hitsMax; } });
    };
    return RepairManager;
}());
exports.RepairManager = RepairManager;
