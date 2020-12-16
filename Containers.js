"use strict";
// Containers.ts
//    Instrucions to disbatch on filling containers
exports.__esModule = true;
exports.FillContainers = void 0;
var Globals = require("./Globals");
var Bot_1 = require("./Bot");
var Funcs_1 = require("./Funcs");
function FillContainers(room, free, bulletin) {
    if (Funcs_1.creepsOnTask(room, "harvest") < Globals.MINE_WORKERS) {
        var assignee = free.pop();
        if (!assignee)
            return;
        var source = room.find(FIND_SOURCES_ACTIVE)[0];
        var container = Funcs_1.findFillableContainers(room)[0];
        var harvest = new Bot_1.Command(source.id, "harvest", Bot_1.CompleteType.InventoryFull);
        var dropoff = void 0;
        if (container)
            dropoff = new Bot_1.Command(container.id, "transfer", Bot_1.CompleteType.InventoryEmpty, RESOURCE_ENERGY);
        else {
            var target = Funcs_1.findConstructionContainer(room);
            dropoff = new Bot_1.Command(target.id, "build", Bot_1.CompleteType.InventoryEmpty);
        }
        Bot_1.assignCommand(assignee, harvest, bulletin);
        Bot_1.assignCommand(assignee, dropoff, bulletin);
    }
}
exports.FillContainers = FillContainers;
