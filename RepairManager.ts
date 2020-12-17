// RepairManager
//   disbatch insteuctions to repair structures

import * as Globals from "./Globals";

import { Bulletin } from "./Bulletin";
import { creepsOnTask, findFilledContainers } from "./Funcs";
import { Manager } from "./Manager";
import { assignCommand, Command, CompleteType } from "./Bot";

export class RepairManager implements Manager
{
    room     : Room;
    bulletin : Bulletin;

    constructor(room: Room, bulletin: Bulletin)
    {
        this.room     = room;
        this.bulletin = bulletin;
    }

    run(free: Creep[])
    {
        if (creepsOnTask(this.room, "repair") >= Globals.REPAIR_WORKERS)
            return;

        let assignee = free.pop();
        if (!assignee)
            return;
        
        let containers = findFilledContainers(this.room);
        let struct    = this.findRepairable();
        if (!struct[0] || !containers[0])
        {
            free.push(assignee);
            return;
        }

        let pickup = new Command(containers[0].id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
        let repair = new Command(struct[0].id, "repair", CompleteType.TargetRepaired);

        assignCommand(assignee, pickup, this.bulletin);
        assignCommand(assignee, repair, this.bulletin);
    }

    findRepairable(): Structure[]
    {
        return this.room.find(FIND_STRUCTURES, { filter: (s) => { return s.hits != s.hitsMax; }})
    }
}