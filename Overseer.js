// Overseer.js
//  Oversee managers
const LogisticManager = require('./LogisticManager');
const SpawnManager    = require('./SpawnManager');
const ConstructionManager = require('./ConstructionManager');
const HarvestManager = require('./HarvestManager');
const UpgradeManager = require('./UpgradeManager');
const InvasionManager = require('./InvasionManager');

class Overseer
{
    // get creeps with a specific marker
    getCreeps(marker)
    {
        let creeps = [];
        for (let creep in Game.creeps)
            if (Game.creeps[creep].memory.marker == marker)
                creeps.push(Game.creeps[creep]);

        return creeps;
    }

    loadAll()
    {
        this.loadSpawners();
        this.loadLogistics();
        this.loadConstruction();
        this.loadHarvest();
        this.loadUpgrade();
        this.loadInvasion();
    }

    // load logistic managers
    loadLogistics()
    {
        this.logisticManagers = { };
        for (let spawn in Game.spawns)
            this.logisticManagers[Game.spawns[spawn].room.name] = new LogisticManager(Game.spawns[spawn].room);
    }

    // load spawn managers
    loadSpawners()
    {
        this.spawnerManagers = { };
        for (let spawn in Game.spawns)
            this.spawnerManagers[Game.spawns[spawn].room.name] = new SpawnManager(Game.spawns[spawn].room.find(FIND_MY_SPAWNS)[0]);
    }

    loadConstruction()
    {
        this.constructionManagers = { };
        for (let spawn in Game.spawns)
            this.constructionManagers[Game.spawns[spawn].room.name] = new ConstructionManager(Game.spawns[spawn].room);
    }

    loadUpgrade()
    {
        this.upgradeManagers = { };
        for (let spawn in Game.spawns)
            this.upgradeManagers[Game.spawns[spawn].room.name] = new UpgradeManager(Game.spawns[spawn].room);
    }

    loadHarvest()
    {
        this.harvestManagers = { };
        for (let spawn in Game.spawns)
            this.harvestManagers[Game.spawns[spawn].room.name] = new HarvestManager(Game.spawns[spawn].room);
    }

    loadInvasion()
    {
        this.invasionManagers = { };
        for (let spawn in Game.spawns)
            this.invasionManagers[Game.spawns[spawn].room.name] = new InvasionManager(Game.spawns[spawn].room);
    }

    // run managers
    tick()
    {
        for (let spawner in this.spawnerManagers)
            this.spawnerManagers[spawner].tick(this);

        for (let room in this.logisticManagers)
            this.logisticManagers[room].tick(this);

        for (let construction in this.constructionManagers)
            this.constructionManagers[construction].tick(this);

        for (let harvest in this.harvestManagers)
            this.harvestManagers[harvest].tick(this);

        for (let upgrade in this.upgradeManagers)
            this.upgradeManagers[upgrade].tick(this);

        for (let invade in this.invasionManagers)
            this.invasionManagers[invade].tick(this);
    }
} module.exports = Overseer;