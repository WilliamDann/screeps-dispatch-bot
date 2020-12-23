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
        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                this.runOrder(creep);
                continue;
            }

            this.assignOrder(creep, overseer);
        }

        if (creeps.length < this.MAX_UPGRADERS)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker).length == 0)
                overseer.spawnerManagers[this.room.name].request(
                    [WORK, MOVE, MOVE, CARRY],
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

    runOrder(creep)
    {
        if (creep.store.energy == 0)
            return this.pickup(creep);
        else
            return this.upgrade(creep);
    }

    assignOrder(creep, overseer)
    {
        let container = overseer.logisticManagers[this.room.name].getFilledContainers()[0];
        if (!container)
            return;

        creep.memory.order = { from: container.id, to: this.room.controller.id }
    }

    pickup(creep)
    {
        let order = creep.memory.order;
        let from  = Game.getObjectById(order.from) 
        
        let result = creep.withdraw(from, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(from);
        if (result == ERR_INVALID_TARGET)
            delete creep.memory.order;

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