const SpawnManager = require('./SpawnManager');

class InvasionManager
{
    constructor(room)
    {
        this.room = room;

        this.marker = "InvasionManager";
        
        this.target     = "W35N52";
        this.body       = [ ATTACK, MOVE ];
        this.buildUntil = 10;
    }

    pre(overseer) { }
    run (overseer)
    {
        if (!this.target) return;

        let creeps = overseer.getCreeps(this.marker);
        if (creeps.length < this.buildUntil)
        {
            if (overseer.spawnerManagers[this.room.name].getInQueueWithMarker(this.marker).length == 0)
            {
                overseer.spawnerManagers[this.room.name].force(
                    this.body,
                    SpawnManager.generateName("helper"),
                    { marker: this.marker }
                );
            }
        }

        for (let creep of creeps)
        {
            // move to target
            if (creep.room.name != this.target)
            {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(this.target)));
            }
            
            if (creeps.length >= this.buildUntil)
            {
                let baddies  = room.find(FIND_HOSTILE_CREEPS);
    
                let maxCombatScore = 0;
                let priority       = null;
                for (let baddie in baddies)
                {
                    let score = InvasionManager.getCombatScore(baddie);
                    if (score > maxCombatScore)
                    {
                        maxCombatScore = score;
                        priority = baddie;
                    }
                }
                if (priority == null)
                    priority = baddies[0];
    
                let result = creep.attack(priority);
                if (result == ERR_NOT_IN_RANGE)
                    creep.moveTo(result);
            }
            else
            {
                creep.moveTo(Game.flags["HoldPosition"]);
            }
        }
    }
    post(overseer) { }

    tick(overseer)
    {
        this.pre(overseer);
        this.run(overseer);
        this.post(overseer);
    }

    /// helpers

    // get a numberic representation of a creep's combat ability
    static getCombatScore(creep)
    {
        let score = 0;
        for (let part of creep.body)
            switch (part.type)
            {
                case CLAIM:
                    score += 2;
                    break;
                case ATTACK:
                    score += 5;
                    break;
                case RANGED_ATTACK:
                    score += 6;
                    break;
                case TOUGH:
                    score += 2;
                    break;
                case HEAL:
                    score += 10;
            }
        return score;
    }
} module.exports = InvasionManager;