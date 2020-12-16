// Bot.js
//   carries out commands given to creeps

import { Bulletin, Posting } from "./Bulletin";

export enum CompleteType
{
    InventoryFull,
    InventoryEmpty,
}

function complete(creep: Creep, bulletin: Bulletin)
{
    var commands = creep.memory["commands"];
    let command:Command  = commands.shift();

    bulletin.add(new Posting(command.target, "job_complete", creep.name));

    creep.memory["commands"] = commands;
}

function reset(creep: Creep)
{
    for (let res of RESOURCES_ALL)
        creep.drop(res);
}

function handleResult(creep: Creep, result: number, bulletin: Bulletin)
{
    if (result != OK)
        if (!creep.memory["errors"]) 
            creep.memory["errors"] = 1;
        else 
            creep.memory["errors"] += 1
    else
        creep.memory["errors"] = 0;
        
    if (creep.memory["errors"] > 10)
    {
        complete(creep, bulletin);
        // reset(creep);

        // creep.say("cancelled due to errors")        
        creep.memory["errors"] = 0;
    }
}

export function assignCommand(creep: Creep, command: Command, bulletin: Bulletin)
{
    if (creep.memory["commands"] == undefined || !creep.memory["commands"].length)
        creep.memory["commands"] = [];

    bulletin.add(new Posting(command.target, "job_assign", "disbatch"));
    creep.memory["commands"].push(command);
}

export function run(creep: Creep, bulletin: Bulletin) 
{
    if (creep.memory["commands"] == undefined) return;
    if (creep.memory["commands"].length == 0)  return;
    
    var commands = creep.memory["commands"] as Command[];
    var command  = commands[0];

    var target:any = Game.getObjectById(command.target);

    // run command
    var result;
    if (command.arg)
        result = creep[command.action](target, command.arg);
    else
        result = creep[command.action](target);

    if (result == ERR_NOT_IN_RANGE)
        result = creep.moveTo(target);

    // check complete
    switch (command.complete) {
        case CompleteType.InventoryFull:
            if (creep.store.getFreeCapacity() == 0)
                complete(creep, bulletin);
            break;

        case CompleteType.InventoryEmpty:
            if (creep.store.getFreeCapacity() == creep.store.getCapacity())
                complete(creep, bulletin);
            break;
    }

    handleResult(creep, result, bulletin);
    // creep.say(`${command.action[0]} : ${result}`);

    return result;
}

export class Command
{
    target   : string;
    action   : string;
    complete : CompleteType;

    arg? : any;

    constructor(target: string, action: string, complete: CompleteType, arg?: any)
    {
        this.target = target;
        this.action = action;
        this.complete = complete;

        this.arg = arg;
    }
}