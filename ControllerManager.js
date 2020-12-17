"use strict";
// Controller.ts
//  disbatch instructions for controller upgrades
exports.__esModule = true;
exports.ControllerManager = void 0;
var Globals = require("./Globals");
var Bot_1 = require("./Bot");
var Funcs_1 = require("./Funcs");
var ControllerManager = /** @class */ (function () {
    function ControllerManager(room, bulletin) {
        this.room = room;
        this.bulletin = bulletin;
    }
    ControllerManager.prototype.run = function (free) {
        if (Funcs_1.creepsOnTask(this.room, "upgradeController") < Globals.UPGRADE_WORKERS) {
            var assignee = free.pop();
            if (!assignee)
                return;
            var container = Funcs_1.findFilledContainers(this.room)[0];
            if (!container) {
                free.push(assignee);
                return;
            }
            var pickup = new Bot_1.Command(container.id, "withdraw", Bot_1.CompleteType.InventoryFull, RESOURCE_ENERGY);
            var upgrade = new Bot_1.Command(this.room.controller.id, "upgradeController", Bot_1.CompleteType.InventoryEmpty);
            Bot_1.assignCommand(assignee, pickup, this.bulletin);
            Bot_1.assignCommand(assignee, upgrade, this.bulletin);
        }
    };
    return ControllerManager;
}());
exports.ControllerManager = ControllerManager;
