// UpgradeController
//  upgrade controller in a room
const SpawnManager = require('./SpawnManager');

class UpgradeManager
{
    constructor(room)
    {
        this.room = room;

        this.marker = "UpgradeManager";
        this.MAX_UPGRADERS = 1;
    }

    pre(overseer) { }
    run(overseer)
    {
        let creeps = overseer.getCreeps(this.marker);
        console.log(creeps.length)

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

            creep.memory.order = { from: container.id, to: this.room.controller.id }
        }

        if (creeps.length < this.MAX_UPGRADERS)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker).length == 0)
                overseer.spawnerManagers[this.room.name].request(
                    [WORK, MOVE, CARRY],
                    SpawnManager.generateName("upgrade"),
                    { marker: this.marker }
                );
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
        let to = Game.getObjectById(order.to)

        let result = creep.upgradeController(to);
        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(to);

        return result;
    }

    /// helpers
} module.exports = UpgradeManager;