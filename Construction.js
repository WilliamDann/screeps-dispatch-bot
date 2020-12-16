"use strict";
// Construction.ts
//    disbatch instructions to buuild 
exports.__esModule = true;
exports.ConstructSites = void 0;
var Globals = require("./Globals");
var Funcs_1 = require("./Funcs");
var Bot_1 = require("./Bot");
function ConstructSites(room, free, bulletin) {
    if (Funcs_1.creepsOnTask(room, "build") < Globals.BUILD_WORKERS) {
        var sites = room.find(FIND_CONSTRUCTION_SITES);
        if (!sites[0])
            return;
        var container = Funcs_1.findFilledContainers(room)[0];
        if (!container)
            return;
        var assignee = free.pop();
        if (!assignee)
            return;
        var pickup = new Bot_1.Command(container.id, "withdraw", Bot_1.CompleteType.InventoryFull, RESOURCE_ENERGY);
        var build = new Bot_1.Command(sites[0].id, "build", Bot_1.CompleteType.InventoryEmpty);
        Bot_1.assignCommand(assignee, pickup, bulletin);
        Bot_1.assignCommand(assignee, build, bulletin);
    }
}
exports.ConstructSites = ConstructSites;
