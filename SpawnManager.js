const LogisticOrder = require('./LogisticOrder');

// Spawnmanager.js
//  Manage a spawner
class SpawnManager
{
    constructor(spawner)
    {
        this.spawner    = spawner;
        this.spawnQueue = spawner.memory.spawnQueue;

        this.MAX_QUEUE    = 100;
        this.FATAL_ERRORS = [ ERR_NAME_EXISTS, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH ]
        this.marker       = "SpawnManager";

    }

    pre(overseer)
    {
        if (!this.spawnQueue) this.initilize(); 
    }

    run(overseer)
    {
        let request = this.spawnQueue[0];
        if (!request)
            return;

        let result = this.spawner.spawnCreep(request.body, request.name, { memory: request.memory });
        if (this.FATAL_ERRORS.indexOf(result) != -1)
        {
            console.log(`Spawn order cancelled: (${request.body}, ${request.name}): ${result}`);
            this.spawnQueue.shift();
        }

        if (result == ERR_NOT_ENOUGH_ENERGY)
        {
            let logisticManager = overseer.logisticManagers[this.spawner.room.name];
            let from;
            let to;

            // pick a source container/source
            let containers = logisticManager.getFilledContainers();
            if (containers[0])
                from = containers[0];
            else
                from = logisticManager.room.find(FIND_SOURCES_ACTIVE)[0];

            // pick spawner/extention
            if (this.spawner.store.energy != this.spawner.store.getCapacity(RESOURCE_ENERGY))
                to = this.spawner;
            else
                to = logisticManager.getFillableExtentions()[0];

            // assign fill order
            if (logisticManager.getAssignerOrders(this.marker) == 0)
                logisticManager.orders.push(new LogisticOrder(from.id, to.id, 50, this.marker));
        }

        if (result == OK)
            this.spawnQueue.shift();
    }

    post(overseer)
    {
        this.spawner.memory.spawnQueue = this.spawnQueue;
    }

    // run a tick of the manager
    tick(overseer)
    {
        this.pre(overseer);
        this.run(overseer);
        this.post(overseer);
    }

    // set up memory
    initilize()
    {
        this.spawnQueue = [];
        this.spawner.memory.spawnQueue = [];
    }

    // determine if it is possable to spawn a creep
    canSpawnCreep(body, name)
    {
        if (SpawnManager.totalBodyCost(body) > this.spawner.room.getCapacityAvalible)
            return ERR_NOT_ENOUGH_EXTENSIONS;
        
        if (this.spawnQueue.length > this.MAX_QUEUE)
            return ERR_FULL;

        let result = this.spawner.spawnCreep(body, name, { dryRun: true });
        if (this.FATAL_ERRORS.indexOf(result) != -1)
            return result;

        return OK;
    }

    // add creep to spawn queue
    request(body, name, memory=null)
    {
        let result = this.canSpawnCreep(body, name);
        if (result == OK)
            this.spawnQueue.push({ body: body, name: name, memory: memory });
        
        return result;
    }

    // add a creep to top of spawn queue
    force(body, name, memory=null)
    {
        let result = this.canSpawnCreep(body, name);
        if (result == OK)
            this.spawnQueue.unshift({ body: body, name: name, memory: memory });

        return result;
    }

    getInQueueWithMarker(marker)
    {
        let orders = [];
        for (let order in this.spawnQueue)
        {
            if (this.spawnQueue[order].memory.marker == marker)
                orders.push(order);

        }

        return orders;
    }

    // get cost of a creep body
    static totalBodyCost(body)
    {
        let total = 0;
        for (let part in body)
        {
            total += BODYPART_COST[total];
        }
        return total;
    }

    static generateName(prefix="bot")
    {
        return `${prefix}${Game.time}`;
    }
} module.exports = SpawnManager;