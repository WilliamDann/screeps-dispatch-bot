import * as Bot      from './Bot';

import { Disbatch } from './Disbatch';
import { Bulletin } from './Bulletin';

import { PopulationManager }   from './PopulationManager';
import { ContainerManager }    from './ContainerManager';
import { ControllerManager }   from './ControllerManager';
import { ConstructionManager } from './ConstructionManager';
import { RepairManager } from './RepairManager';

export function loop() 
{
    // clear dead creeps
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    var bulletin = Bulletin.loadFromMemory(Game.spawns.MainSpawn.memory);
    
    // find free creeps
    var freeCreeps: Creep[] = [];
    for (let creepID of Object.keys(Game.creeps))
    {
        let creep = Game.creeps[creepID];
        if (!creep.memory["commands"] || !creep.memory["commands"][0])
            freeCreeps.push(creep);
    }

    var room = Game.spawns.MainSpawn.room;
    var disbatch = new Disbatch(
        [
            new PopulationManager(room, bulletin),
            new ContainerManager(room, bulletin),
            new ConstructionManager(room, bulletin),
            new RepairManager(room, bulletin),
            new ControllerManager(room, bulletin),
        ]);

    disbatch.run(freeCreeps);
    for(var name in Game.creeps) {        
        Bot.run(Game.creeps[name], bulletin)        
    }

    for (var creep of freeCreeps)
    {
        creep.moveTo(Game.spawns.MainSpawn);
        creep.say("idle");
    }

    Game.spawns.MainSpawn.memory["posts"] = bulletin.posts;
}