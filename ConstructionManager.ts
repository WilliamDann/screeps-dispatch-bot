// Construction.ts
//    disbatch instructions to buuild 

import * as Globals from './Globals';
import { Bulletin } from "./Bulletin";
import { creepsOnTask, findFilledContainers } from "./Funcs";
import { assignCommand, Command, CompleteType } from './Bot';
import { Manager } from './Manager';

export class ConstructionManager implements Manager
{
    room: Room;
    bulletin: Bulletin;

    constructor(room: Room, bulletin: Bulletin)
    {
        this.room = room;
        this.bulletin = bulletin;
    }

    run(free: Creep[])
    {
        if (creepsOnTask(this.room, "build") < Globals.BUILD_WORKERS)
        {
            let sites = this.room.find(FIND_CONSTRUCTION_SITES);
            if (!sites[0])
                return;
                
            let container = findFilledContainers(this.room)[0];
            if (!container)
                return;
            
            let assignee = free.pop();
            if (!assignee)
                return;
    
    
            let pickup = new Command(container.id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
            let build = new Command(sites[0].id, "build", CompleteType.InventoryEmpty);
            
            assignCommand(assignee, pickup, this.bulletin);
            assignCommand(assignee, build, this.bulletin);
        }    }
}