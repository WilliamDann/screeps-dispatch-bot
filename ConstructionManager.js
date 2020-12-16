"use strict";
// Construction.ts
//    disbatch instructions to buuild 
exports.__esModule = true;
exports.ConstructionManager = void 0;
var Globals = require("./Globals");
var Funcs_1 = require("./Funcs");
var Bot_1 = require("./Bot");
var ConstructionManager = /** @class */ (function () {
    function ConstructionManager(room, bulletin) {
        this.room = room;
        this.bulletin = bulletin;
    }
    ConstructionManager.prototype.run = function (free) {
        if (Funcs_1.creepsOnTask(this.room, "build") < Globals.BUILD_WORKERS) {
            var sites = this.room.find(FIND_CONSTRUCTION_SITES);
            if (!sites[0])
                return;
            var container = Funcs_1.findFilledContainers(this.room)[0];
            if (!container)
                return;
            var assignee = free.pop();
            if (!assignee)
                return;
            var pickup = new Bot_1.Command(container.id, "withdraw", Bot_1.CompleteType.InventoryFull, RESOURCE_ENERGY);
            var build = new Bot_1.Command(sites[0].id, "build", Bot_1.CompleteType.InventoryEmpty);
            Bot_1.assignCommand(assignee, pickup, this.bulletin);
            Bot_1.assignCommand(assignee, build, this.bulletin);
        }
    };
    return ConstructionManager;
}());
exports.ConstructionManager = ConstructionManager;
