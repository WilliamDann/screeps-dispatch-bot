// Containers.ts
//    Instrucions to disbatch on filling containers

import * as Globals from './Globals';
import { Bulletin } from "./Bulletin";
import { assignCommand, Command, CompleteType } from './Bot';
import { creepsOnTask, findFillableContainers, findConstructionContainer } from './Funcs';
import { Manager } from './Manager';

export class ContainerManager implements Manager
{
    room : Room;
    bulletin: Bulletin;

    constructor(room: Room, bulletin: Bulletin)
    {
        this.room = room;
        this.bulletin = bulletin;
    }

    run(free: Creep[])
    {
        if (creepsOnTask(this.room, "harvest") < Globals.MINE_WORKERS)
        {
            let assignee = free.pop();
            if (!assignee) 
            return;
            
            let source = this.room.find(FIND_SOURCES)[0];
            let container = findFillableContainers(this.room)[0];
    
            
            let harvest = new Command(source.id, "harvest", CompleteType.InventoryFull);
            
            let dropoff;
            if (container)
                dropoff = new Command(container.id, "transfer", CompleteType.InventoryEmpty, RESOURCE_ENERGY);
            else
            {
                let target = findConstructionContainer(this.room);
                if (!target)
                {
                    free.push(assignee);
                    return;
                }
                dropoff = new Command(target.id, "build", CompleteType.InventoryEmpty);
            }
        
            assignCommand(assignee, harvest, this.bulletin);
            assignCommand(assignee, dropoff, this.bulletin);
        }
    
    }
}