// Construction.ts
//    disbatch instructions to buuild 

import * as Globals from './Globals';
import { Bulletin } from "./Bulletin";
import { creepsOnTask, findFilledContainers } from "./Funcs";
import { assignCommand, Command, CompleteType } from './Bot';

export function ConstructSites(room: Room, free: Creep[], bulletin: Bulletin)
{
    if (creepsOnTask(room, "build") < Globals.BUILD_WORKERS)
    {
        let sites = room.find(FIND_CONSTRUCTION_SITES);
        if (!sites[0])
            return;
            
        let container = findFilledContainers(room)[0];
        if (!container)
            return;
        
        let assignee = free.pop();
        if (!assignee)
            return;


        let pickup = new Command(container.id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
        let build = new Command(sites[0].id, "build", CompleteType.InventoryEmpty);
        
        assignCommand(assignee, pickup, bulletin);
        assignCommand(assignee, build, bulletin);
    }
}