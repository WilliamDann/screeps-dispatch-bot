// HarvestManager.js

const SpawnManager = require("./SpawnManager");

//  Manage resource collection in a room
class HarvestManager
{
    constructor(room)
    {
        this.room = room;
        this.sources = this.room.memory.sources;

        this.CREEPS_PER_SOURCE = 1;
        this.marker            = "HarvestManager";
    }

    initilize()
    {
        let sources = this.room.find(FIND_SOURCES);

        this.sources = [];
        for (let source of sources)
        {
            this.sources.push(source.id);
        }
        this.room.memory.sources = this.sources;
    }

    pre(overseer) 
    {
        if (!this.room.memory.sources) 
            this.initilize();
    }

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

        if (creeps.length < this.sources.length*this.CREEPS_PER_SOURCE)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker).length == 0)
                overseer.spawnerManagers[this.room.name].force(
                    SpawnManager.getBestBody(this.room, { WORK: 3, CARRY: 1 }),
                    SpawnManager.generateName("harv"),
                    { marker: this.marker }
                );
        }
    }

    post(overseer)
    {

    }

    tick(overseer)
    {
        this.pre(overseer);
        this.run(overseer);
        this.post(overseer);
    }

    runOrder(creep)
    {
        if (creep.store.energy == creep.store.getCapacity(RESOURCE_ENERGY))
            return this.dropoff(creep);
        else
            return this.harvest(creep);
    }

    assignOrder(creep, overseer)
    {
        let to = overseer.logisticManagers[this.room.name].getFillableContainers()[0];
        creep.memory.order = { from: this.sources[0], to: to.id }
    }

    harvest(creep)
    {
        let source = Game.getObjectById(creep.memory.order.from);
        let result = creep.harvest(source);

        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(source);

        return result;
    }

    dropoff(creep)
    {
        let drop = Game.getObjectById(creep.memory.order.to);
        let result = creep.transfer(drop, RESOURCE_ENERGY);

        if (result = ERR_NOT_IN_RANGE)
            result = creep.moveTo(drop);
        if (result == ERR_INVALID_TARGET)
            delete creep.memory.order;

        if (drop && drop.store.energy == drop.store.getCapacity(RESOURCE_ENERGY))
            delete creep.memory.order;
        
        return result;
    }

    /// helpers
    countSourceAssignments(creeps)
    {
        let count = { };
        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                if (!count[creep.memory.order.from])
                    count[creep.memory.order.from] = 1;
                else
                    count[creep.memory.order.from]++;
            }
        }

        for (let source of this.sources)
        {
            if (!count[source])
                count[source] = 0;
        }
        return count;
    }
} module.exports = HarvestManager;