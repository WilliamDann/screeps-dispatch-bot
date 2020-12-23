const LogisticOrder = require('./LogisticOrder');
const SpawnManager = require('./SpawnManager');

// LogisticManager.js
//  Manage trnasfer of resources in a room
class LogisticManager
{
    constructor(room)
    {
        this.room   = room;
        this.orders = room.memory.orders;

        this.MAX_WORKERS = 2;
        this.marker      = "LogisticManager"
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
        if (creeps.length < this.MAX_WORKERS)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker).length == 0)
            {
                overseer.spawnerManagers[this.room.name].force(
                    SpawnManager.getBestBody(this.room, { MOVE: 3, CARRY: 1 }, 0.15),
                    SpawnManager.generateName("logi"),
                    { marker: this.marker }
                );
            }
        }

        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                this.runOrder(creep);

                continue;
            }
            
            this.assignOrder(creep);
        }

        // tower logic
        let enimies = this.room.find(FIND_HOSTILE_CREEPS);
        let unrepaired = this.room.find(FIND_STRUCTURES, {filter: s => s.hits != s.hitsMax })

        let tower = this.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER })[0];
        if (tower)
        {
            if (enimies.length > 0)
                tower.attack(enimies[0]);
            if (unrepaired.length > 0)
                tower.repair(unrepaired[0]);
    
            if (tower.energy <= tower.energyCapacity / 2)
            {
                if (this.getTargetOrders(tower.id).length == 0)
                {
                    let from = this.getFilledContainers()[0];
                    this.orders.push(new LogisticOrder(from.id, tower.id, tower.energyCapacity - tower.energy, this.marker));
                }
            }
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
    
    runOrder(creep)
    {
        if (creep.store.energy == 0)
            this.pickup(creep);
        else
            this.dropoff(creep);
    }

    assignOrder(creep)
    {
        let order = this.orders.shift();
        if (!order)
            return; // TODO: free un-needed creep

        creep.memory.order = order;
    }

    pickup(creep)
    {
        let order  = creep.memory.order;
        let amount = creep.store.getCapacity(RESOURCE_ENERGY);

        if (order.amount < amount)
            amount = order.amount;

        let container = Game.getObjectById(order.from);
        if (!container)
            return delete creep.memory.order;

        let result;

        if (container.structureType)
            result = creep.withdraw(container, RESOURCE_ENERGY, amount);
        else
            result = creep.harvest(container);
        
        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(container);

        creep.say(result);
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
        if (result == ERR_FULL)
            delete creep.memory.order;

        if (order.amount > 0)
            creep.memory.order = order;
        else
            delete creep.memory.order;

        if (result == ERR_FULL)
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

    // get orders pointed at a target
    getTargetOrders(target)
    {
        let orders = [];
        for (let order of this.orders)
            if (order.to == target)
                orders.push(order);
        return orders;
    }

    // get a point where energy can be dropped into the system
    getFillableContainers()
    {
        return this.room.find(FIND_STRUCTURES, { filter: s =>  (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.energy != s.store.getCapacity(RESOURCE_ENERGY) })
    }

    // get containers with energy
    getFilledContainers()
    {
        return this.room.find(FIND_STRUCTURES, { filter: s =>  (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.energy != 0 })
    }


    // get extentions to be filled in a room
    getFillableExtentions()
    {
        return this.room.find(FIND_STRUCTURES, { filter: s =>  s.structureType == STRUCTURE_EXTENSION && s.store.energy != s.store.getCapacity(RESOURCE_ENERGY) })
    }

} module.exports = LogisticManager;