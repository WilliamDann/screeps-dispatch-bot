// Disbatch.js
//   assigns commands to creeps in a room

import { Bulletin }          from "./Bulletin";
import { ConstructSites }    from "./Construction";
import { FillContainers }    from "./Containers";
import { ControllerUpgrade } from "./Controller";
import { Manager } from "./Manager";
import { PopulationUpkeep }  from './Population';

export function run(room: Room, bulletin: Bulletin)
{
    // load information
    let creeps  : Creep[]  = [];
    for (let creep of room.find(FIND_MY_CREEPS))
    {
        if (!creep.memory["commands"] || creep.memory["commands"].length == 0)
            creeps.push(creep);
    }

    
    // maintain creep population
    PopulationUpkeep(room, creeps, bulletin);
    
    // fill containers 
    FillContainers(room, creeps, bulletin);

    // upgrade controller
    ControllerUpgrade(room, creeps, bulletin);

    // build sites
    ConstructSites(room, creeps, bulletin);

    // update bulletin
    room.memory["bulletin"] = bulletin;
}