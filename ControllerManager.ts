// Controller.ts
//  disbatch instructions for controller upgrades

import * as Globals from "./Globals";
import { Bulletin } from "./Bulletin";
import { assignCommand, Command, CompleteType } from "./Bot";
import { creepsOnTask, findFilledContainers } from './Funcs';
import { Manager } from "./Manager";

export class ControllerManager implements Manager
{
    room: Room;
    bulletin: Bulletin;

    constructor(room: Room, bulletin: Bulletin)
    {
        this.room = room;
        this.bulletin = bulletin;
    }

    run (free: Creep[])
    {
        if (creepsOnTask(this.room, "upgradeController") < Globals.UPGRADE_WORKERS)
        {
            let assignee = free.pop();
            if (!assignee)
                return;
    
            let container = findFilledContainers(this.room)[0];
            if (!container)
            {
                free.push(assignee);
                return;
            }
    
            let pickup = new Command(container.id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
            let upgrade = new Command(this.room.controller.id, "upgradeController", CompleteType.InventoryEmpty);
    
            assignCommand(assignee, pickup, this.bulletin);
            assignCommand(assignee, upgrade, this.bulletin);
        }
        }
}