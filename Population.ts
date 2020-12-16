// Population.ts
//   Instrucitons to disbatch on maintining creep population

import * as Globals from "./Globals";
import { Bulletin } from "./Bulletin";
import { Command, CompleteType, assignCommand } from "./Bot";
import { findFilledContainers } from './Funcs';

export function PopulationUpkeep(room: Room, free: Creep[], bulletin: Bulletin)
{
    if (!room.memory["popMax"])
        room.memory["popMax"] = calculatePopulationMax(room);

    let spawner = room.find(FIND_MY_SPAWNS)[0];
    let spawned = room.find(FIND_MY_CREEPS).length;
    if (spawned < room.memory["popMax"])
    {
        let name = generateName();
        let body = calculateBodyPattern(room);

        let result = Game.spawns.MainSpawn.spawnCreep(body, name);

        if (result == ERR_NOT_ENOUGH_ENERGY)
            if (bulletin.findJobsOut(spawner.id) <= Globals.SPAWN_WORKERS)
            {
                var assignee = free.pop();
                if (!assignee)
                    return;

                let pickupStruct  = findFilledContainers(room)[0];
                let dropoffStruct = findEnergyDropoff(room, spawner);

                let pickup;
                if (!pickupStruct)
                {
                    let source = room.find(FIND_SOURCES_ACTIVE)[0];
                    pickup = new Command(source.id, "harvest", CompleteType.InventoryFull);
                }
                else
                    pickup  = new Command(pickupStruct.id, "withdraw", CompleteType.InventoryFull, RESOURCE_ENERGY);
                
                let dropoff = new Command(dropoffStruct.id, "transfer", CompleteType.InventoryEmpty, RESOURCE_ENERGY);

                assignCommand(assignee, pickup, bulletin);
                assignCommand(assignee, dropoff, bulletin);
            }
    }
}

// find a place to put energy
function findEnergyDropoff(room: Room, spawner: StructureSpawn): Structure
{
    if (spawner.store.energy != spawner.energyCapacity) return spawner;
    let extentions = room.find(
        FIND_MY_STRUCTURES,
        { filter: (s) => { return s.structureType == STRUCTURE_EXTENSION && s.store.energy != s.energyCapacity }
    });

    if (extentions.length != 0)
        return extentions[0]
    else
        return null;
}

// find the optimal amount of creeps in a room
function calculatePopulationMax(room: Room): Number
{
    let num = 0;
    num += room.find(FIND_MY_SPAWNS).length * Globals.SPAWN_WORKERS;
    num += Globals.UPGRADE_WORKERS;
    num += Globals.BUILD_WORKERS;
    num += Globals.MINE_WORKERS;

    return num;
}

// find the optimal body config for a room
function calculateBodyPattern(room: Room): BodyPartConstant[]
{
    let parts: BodyPartConstant[] = [];

    let baseParts      = [ MOVE, WORK, CARRY ];
    let toSpend:number = room.energyCapacityAvailable;

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
function generateName(prefix: string = "bot"): string
{
    return `${prefix}${Math.round(Math.random() * 1000)}`;
}