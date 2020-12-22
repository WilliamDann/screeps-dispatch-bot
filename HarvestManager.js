// HarvestManager.js

const SpawnManager = require("./SpawnManager");

//  Manage resource collection in a room
class HarvestManager
{
    marker = "HarvestManager"

    room;
    sources;

    CREEPS_PER_SOURCE = 1;

    constructor(room)
    {
        this.room = room;
    }

    initilize()
    {
        let sources = this.room.find(FIND_SOURCES);

        this.sources = [];
        for (let source of sources)
        {
            this.sources.push(source.id);
        }
    }

    pre(overseer) 
    {
        if (!this.sources) 
            this.initilize();
    }

    run(overseer) 
    {
        let creeps = overseer.getCreeps(this.marker);
        
        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                if (creep.store.energy == creep.store.getCapacity(RESOURCE_ENERGY))
                    this.dropoff(creep);
                else
                    this.harvest(creep);

                continue;
            }

            let count = this.countSourceAssignments(creeps);

            let minNum = Number.MAX_VALUE;
            let minId;
            for (let source in count)
            {
                console.log(`${source} : ${count[source]}`)
                if (count[source] < minNum)
                {
                    minNum = count[source];
                    minId  = source;
                }
            }

            let to = overseer.logisticManagers[this.room.name].getFilledContainers()[0];
            if (!to)
                continue;

            creep.memory.order = { from: minId, to: to.id }
        }

        if (creeps.length < this.sources.length*this.CREEPS_PER_SOURCE)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker) == 0)
                overseer.spawnerManagers[this.room.name].request(
                    [WORK, MOVE, CARRY],
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