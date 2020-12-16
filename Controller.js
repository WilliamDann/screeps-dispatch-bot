"use strict";
// Controller.ts
//  disbatch instructions for controller upgrades
exports.__esModule = true;
exports.ControllerUpgrade = void 0;
var Globals = require("./Globals");
var Bot_1 = require("./Bot");
var Funcs_1 = require("./Funcs");
function ControllerUpgrade(room, free, bulletin) {
    if (Funcs_1.creepsOnTask(room, "upgradeController") < Globals.UPGRADE_WORKERS) {
        var assignee = free.pop();
        if (!assignee)
            return;
        var container = Funcs_1.findFilledContainers(room)[0];
        if (!container) {
            free.push(assignee);
            return;
        }
        var pickup = new Bot_1.Command(container.id, "withdraw", Bot_1.CompleteType.InventoryFull, RESOURCE_ENERGY);
        var upgrade = new Bot_1.Command(room.controller.id, "upgradeController", Bot_1.CompleteType.InventoryEmpty);
        Bot_1.assignCommand(assignee, pickup, bulletin);
        Bot_1.assignCommand(assignee, upgrade, bulletin);
    }
}
exports.ControllerUpgrade = ControllerUpgrade;
