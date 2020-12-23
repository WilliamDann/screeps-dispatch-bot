const SpawnManager = require('./SpawnManager');

// ConstructionManager.js
//  Construct buildings in a room
class ConstructionManager
{

    constructor(room)
    {
        this.room = room;

        this.MAX_WORKERS = 1;
        this.marker      = "ConstructionManager";
    }

    pre(overseer)
    {

    }

    run(overseer)
    {
        let sites  = ConstructionManager.findSites(this.room.name);
        let creeps = overseer.getCreeps(this.marker);

        for (let creep of creeps)
        {
            if (creep.memory.order)
            {
                this.runOrder(creep);
                continue;
            }
            

            let from;
            from = overseer.logisticManagers[this.room.name].getFilledContainers()[0];
            if (!from)
            {
                from = this.room.find(FIND_SOURCES_ACTIVE)[0];
            }

            if (!sites[0])
                continue;
            
            creep.memory.order = {from: from.id, to: sites[0].id, assigner: this.marker};
        }

        if (creeps.length < this.MAX_WORKERS && sites.length > 0)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker).length == 0)
            {
                overseer.spawnerManagers[this.room.name].request(
                    [WORK, WORK, CARRY, MOVE],
                    SpawnManager.generateName("construct"),
                    { marker: this.marker }
                );
            }
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
        if (creep.store.energy == 0)
            return this.pickup(creep);
        else
            return this.build(creep);
    }

    /// helpers

    // run pickup process
    pickup(creep)
    {
        let order = creep.memory.order;
        let from  = Game.getObjectById(order.from) 
        
        let result;
        if (from.structureType)
            result = creep.withdraw(from, RESOURCE_ENERGY);
        else 
            result = creep.harvest(from);

        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(from);

        if (result == ERR_INVALID_TARGET)
            creep.memory.order = null;

        return result;
    }

    // run build process
    build(creep)
    {
        let order = creep.memory.order;
        let to = Game.getObjectById(order.to);
        
        let result = creep.build(to);
        if (result == ERR_NOT_IN_RANGE)
            result = creep.moveTo(to);
        if (result == ERR_INVALID_TARGET)
            delete creep.memory.order;

        return result;
    }

    // find constuction sites
    static findSites(roomName)
    {
        let sites = [];
        for (let site in Game.constructionSites)
            if (Game.constructionSites[site].room.name == roomName) 
                sites.push(Game.constructionSites[site]);

        return sites;
    }
} module.exports = ConstructionManager;