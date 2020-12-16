// Disbatch.js
//   assigns commands to creeps in a room

import { Manager }  from "./Manager";

export class Disbatch
{
    managers: Manager[];

    constructor(managers: Manager[])
    {
        this.managers = managers;
    }

    run(free: Creep[])
    {
        for (let manager of this.managers)
            manager.run(free);
    }
}