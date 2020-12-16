// Containers.ts
//    Instrucions to disbatch on filling containers

import * as Globals from './Globals';
import { Bulletin, Posting } from "./Bulletin";
import { assignCommand, Command, CompleteType } from './Bot';
import { creepsOnTask, findFillableContainers, findConstructionContainer } from './Funcs';

export function FillContainers(room: Room, free: Creep[], bulletin: Bulletin)
{
    if (creepsOnTask(room, "harvest") < Globals.MINE_WORKERS)
    {
        let assignee = free.pop();
        if (!assignee) 
        return;
        
        let source = room.find(FIND_SOURCES_ACTIVE)[0];
        let container = findFillableContainers(room)[0];

        
        let harvest = new Command(source.id, "harvest", CompleteType.InventoryFull);
        
        let dropoff;
        if (container)
            dropoff = new Command(container.id, "transfer", CompleteType.InventoryEmpty, RESOURCE_ENERGY);
        else
        {
            let target = findConstructionContainer(room);
            dropoff = new Command(target.id, "build", CompleteType.InventoryEmpty);
        }
    
        assignCommand(assignee, harvest, bulletin);
        assignCommand(assignee, dropoff, bulletin);
    }
}