// UpgradeController
//  upgrade controller in a room
const SpawnManager = require('./SpawnManager');

class UpgradeManager
{
    marker = "UpgradeManager";
    
    room;

    MAX_UPGRADERS = 1;

    constructor(room)
    {
        this.room = room;
    }

    pre(overseer) { }
    run(overseer)
    {
        let creeps = overseer.getCreeps(this.mark);

        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                if (creep.store.energy == 0)
                    this.pickup(creep);
                else
                    this.upgrade(creep);

                continue;
            }

            let container = overseer.logisticManagers[this.room.name].getFilledContainers()[0];
            if (!container)
                continue;

            creep.memory.order = { from: container.id, to: this.room.controller }
        }

        if (creeps.length < this.MAX_UPGRADERS)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker) == 0)
            {
                overseer.spawnerManagers[this.room.name].request(
                    [WORK, CARRY, MOVE],
                    SpawnManager.generateName("upgrader"),
                    { marker: this.marker }
                );
            }
        }
    }
    post(overseer) { }

    tick(overseer)
    {
        this.pre(overseer);
        this.run(overseer);
        this.post(overseer);
    }

    pickup(creep)
    {
        let order = creep.memory.order;
        let from  = Game.getObjectById(order.from) 
        
        let result = creep.withdraw(from, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(from);

        return result;
    }

    upgrade(creep)
    {
        let order = creep.memory.order;

        let result = creep.upgradeController(this.room.controller);
        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(this.room.controller);

        return result;
    }

    /// helpers
} module.exports = UpgradeManager;