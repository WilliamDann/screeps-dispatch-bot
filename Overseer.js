// Overseer.js
//  Oversee managers
const LogisticManager = require('./LogisticManager');
const SpawnManager    = require('./SpawnManager');
const ConstructionManager = require('./ConstructionManager');
const HarvestManager = require('./HarvestManager');
const UpgradeManager = require('./UpgradeManager');

class Overseer
{
    logisticManagers;
    spawnerManagers;
    constructionManagers;
    harvestManagers;
    upgradeManagers;

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
    }

    // load logistic managers
    loadLogistics()
    {
        this.logisticManagers = { };
        for (let room in Game.rooms)
            this.logisticManagers[room] = new LogisticManager(Game.rooms[room]);
    }

    // load spawn managers
    loadSpawners()
    {
        this.spawnerManagers = { };
        for (let name in Game.rooms)
            this.spawnerManagers[name] = new SpawnManager(Game.rooms[name].find(FIND_MY_SPAWNS)[0]);
    }

    loadConstruction()
    {
        this.constructionManagers = { };
        for (let name in Game.rooms)
            this.constructionManagers[name] = new ConstructionManager(Game.rooms[name]);
    }

    loadUpgrade()
    {
        this.upgradeManagers = { };
        for (let name in Game.rooms)
            this.upgradeManagers[name] = new UpgradeManager(Game.rooms[name]);
    }

    loadHarvest()
    {
        this.harvestManagers = { };
        for (let name in Game.rooms)
            this.harvestManagers[name] = new HarvestManager(Game.rooms[name]);
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
    }
} module.exports = Overseer;