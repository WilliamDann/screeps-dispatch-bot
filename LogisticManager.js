const SpawnManager = require('./SpawnManager');

// LogisticManager.js
//  Manage trnasfer of resources in a room
class LogisticManager
{
    marker = "LogisticManager"
    
    room;
    orders;

    MAX_WORKERS = 2;

    constructor(room)
    {
        this.room   = room;
        this.orders = room.memory.orders;
    }

    initilize()
    {
        this.orders = [];
        this.room.memory.orders = [];
        this.room.memory.creeps = [];
    }

    pre(overseer)
    {
        if (!this.orders) this.initilize();
    }

    run(overseer)
    {
        let creeps = overseer.getCreeps(this.marker);
        if (creeps.length+1 < this.MAX_WORKERS && this.orders.length >= 0)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker) == 0)
            {
                overseer.spawnerManagers[this.room.name].request(
                    [WORK, CARRY, MOVE],
                    SpawnManager.generateName("logi"),
                    { marker: this.marker }
                );
            }
        }

        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                if (creep.store.energy < creep.memory.order.amount)
                    this.pickup(creep);
                else
                    this.dropoff(creep);

                continue;
            }
            
            let order = this.orders.shift();
            if (!order)
                break; // TODO: free un-needed creep

            creep.memory.order = order;
        }
    }

    post(overseer)
    {
        this.room.memory.orders = this.orders;
    }

    tick(overseer)
    {
        this.pre(overseer);
        this.run(overseer);
        this.post(overseer);
    }

    /// helpers
    
    // run pickup process
    pickup(creep)
    {
        let order  = creep.memory.order;
        let amount = creep.store.getCapacity(RESOURCE_ENERGY);

        if (order.amount < amount)
            amount = order.amount;

        let container = Game.getObjectById(order.from);

        let result;
        if (container.structureType)
            result = creep.withdraw(container, RESOURCE_ENERGY, amount);
        else
            result = creep.harvest(container);
        
        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(container);

        return result;
    }

    // run dropoff process
    dropoff(creep)
    {
        let order   = creep.memory.order;
        let carried = creep.store.energy;

        let to = Game.getObjectById(order.to);

        let result = creep.transfer(to, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(to);
        else if (result == OK)
        {
            order.amount -= carried;
        }

        if (order.amount > 0)
            creep.memory.order = order;
        else
            delete creep.memory.order;

        return result;
    }

    // get orders that an assigner assigned
    getAssignerOrders(assigner)
    {
        let orders = [];
        for (let order of this.orders)
            if (order.assigner == assigner)
                orders.push(order);
        return orders

    }

    // get a point where energy can be dropped into the system
    getFillableContainers()
    {
        return this.room.find(FIND_STRUCTURES, { filter: s =>  s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store.energy != s.store.getCapacity(RESOURCE_ENERGY) })
    }

    // get containers with energy
    getFilledContainers()
    {
        return this.room.find(FIND_STRUCTURES, { filter: s =>  s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store.energy != 0 })
    }


    // get extentions to be filled in a room
    getFillableExtentions()
    {
        return this.room.find(FIND_STRUCTURES, { filter: s =>  s.structureType == STRUCTURE_EXTENSION && s.store.energy != s.store.getCapacity(RESOURCE_ENERGY) })
    }

} module.exports = LogisticManager;