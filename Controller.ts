// Controller.ts
//  disbatch instructions for controller upgrades

import * as Globals from "./Globals";
import { Bulletin } from "./Bulletin";
import { assignCommand, Command, CompleteType } from "./Bot";
import { creepsOnTask, findFilledContainers } from './Funcs';

export function ControllerUpgrade(room: Room, free: Creep[], bulletin: Bulletin)
{
    if (creepsOnTask(room, "upgradeController") < Globals.UPGRADE_WORKERS)
    {
        let assignee = free.pop();
        if (!assignee)
            return;

        let container = findFilledContainers(room)[0];
        if (!container)
        {
            free.push(assignee);
            return;
        }

        let pickup = new Command(container.id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
        let upgrade = new Command(room.controller.id, "upgradeController", CompleteType.InventoryEmpty);

        assignCommand(assignee, pickup, bulletin);
        assignCommand(assignee, upgrade, bulletin);
    }
}