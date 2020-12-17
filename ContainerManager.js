"use strict";
// Containers.ts
//    Instrucions to disbatch on filling containers
exports.__esModule = true;
exports.ContainerManager = void 0;
var Globals = require("./Globals");
var Bot_1 = require("./Bot");
var Funcs_1 = require("./Funcs");
var ContainerManager = /** @class */ (function () {
    function ContainerManager(room, bulletin) {
        this.room = room;
        this.bulletin = bulletin;
    }
    ContainerManager.prototype.run = function (free) {
        if (Funcs_1.creepsOnTask(this.room, "harvest") < Globals.MINE_WORKERS) {
            var assignee = free.pop();
            if (!assignee)
                return;
            var source = this.room.find(FIND_SOURCES)[0];
            var container = Funcs_1.findFillableContainers(this.room)[0];
            var harvest = new Bot_1.Command(source.id, "harvest", Bot_1.CompleteType.InventoryFull);
            var dropoff = void 0;
            if (container)
                dropoff = new Bot_1.Command(container.id, "transfer", Bot_1.CompleteType.InventoryEmpty, RESOURCE_ENERGY);
            else {
                var target = Funcs_1.findConstructionContainer(this.room);
                if (!target) {
                    free.push(assignee);
                    return;
                }
                dropoff = new Bot_1.Command(target.id, "build", Bot_1.CompleteType.InventoryEmpty);
            }
            Bot_1.assignCommand(assignee, harvest, this.bulletin);
            Bot_1.assignCommand(assignee, dropoff, this.bulletin);
        }
    };
    return ContainerManager;
}());
exports.ContainerManager = ContainerManager;
