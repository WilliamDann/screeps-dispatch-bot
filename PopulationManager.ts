// Population.ts
//   Instrucitons to disbatch on maintining creep population

import * as Globals from "./Globals";
import { Bulletin } from "./Bulletin";
import { Command, CompleteType, assignCommand } from "./Bot";
import { findFilledContainers } from './Funcs';
import { Manager } from "./Manager";

export class PopulationManager implements Manager
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
        if (!this.room.memory["popMax"])
        this.room.memory["popMax"] = this.calculatePopulationMax();

        let spawner = this.room.find(FIND_MY_SPAWNS)[0];
        let spawned = this.room.find(FIND_MY_CREEPS).length;
        if (spawned < this.room.memory["popMax"])
        {
            let name = this.generateCreepName();
            let body = this.calculateBodyPattern();

            let result = Game.spawns.MainSpawn.spawnCreep(body, name);

            if (result == ERR_NOT_ENOUGH_ENERGY)
                if (this.bulletin.findJobsOut(spawner.id) <= Globals.SPAWN_WORKERS)
                {
                    var assignee = free.pop();
                    if (!assignee)
                        return;

                    let pickupStruct  = findFilledContainers(this.room)[0];
                    let dropoffStruct = this.findEnergyDropoff(spawner);

                    let pickup;
                    if (!pickupStruct)
                    {
                        let source = this.room.find(FIND_SOURCES_ACTIVE)[0];
                        pickup = new Command(source.id, "harvest", CompleteType.InventoryFull);
                    }
                    else
                        pickup  = new Command(pickupStruct.id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
                    
                    let dropoff = new Command(dropoffStruct.id, "transfer", CompleteType.InventoryEmpty, RESOURCE_ENERGY);

                    assignCommand(assignee, pickup, this.bulletin);
                    assignCommand(assignee, dropoff, this.bulletin);
                }
        }
    }

    // find a place to put energy
    findEnergyDropoff(spawner: StructureSpawn): Structure
    {
        if (spawner.store.energy != spawner.energyCapacity) return spawner;
        let extentions = this.room.find(
            FIND_MY_STRUCTURES,
            { filter: (s) => { return s.structureType == STRUCTURE_EXTENSION && s.store.energy != s.energyCapacity }
        });
    
        if (extentions.length != 0)
            return extentions[0]
        else
            return null;
    }
    
    // find the optimal amount of creeps in a room
    calculatePopulationMax(): Number
    {
        let num = 0;
        num += this.room.find(FIND_MY_SPAWNS).length * Globals.SPAWN_WORKERS;
        num += Globals.UPGRADE_WORKERS;
        num += Globals.BUILD_WORKERS;
        num += Globals.MINE_WORKERS;
    
        return num;
    }
    
    // find the optimal body config for a room
    calculateBodyPattern(): BodyPartConstant[]
    {
        let parts: BodyPartConstant[] = [];
    
        let baseParts      = [ MOVE, WORK, CARRY ];
        let toSpend:number = this.room.energyCapacityAvailable;
    
        while (toSpend > 0)
        {
            for (let part of baseParts)
            {
                toSpend -= BODYPART_COST[part];
                if (toSpend >= 0)
                    parts.push(part)
                else
                    break;
            }
        }
    
        return parts;
    }
    
    // generate a name for a creep
    generateCreepName(prefix: string = "bot"): string
    {
        return `${prefix}${Math.round(Math.random() * 1000)}`;
    }
}
