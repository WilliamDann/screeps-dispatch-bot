const SpawnManager = require('./SpawnManager');

class InvasionManager
{
    constructor(room)
    {
        this.room = room;

        this.marker = "InvasionManager";
        
        this.target     = new RoomPosition(32, 38, "W35N52");
        this.body       = [ ATTACK, MOVE ];
        this.buildUntil = 5;
    }

    pre(overseer) { if (!this.room.memory.invasion) this.room.memory.invasion = {} }
    run (overseer)
    {
        let creeps = overseer.getCreeps(this.marker);
        if (creeps.length >= this.buildUntil)
        {
            this.room.memory.invasion.attacking = true;
        }
        if (creeps.length <= Math.ceil(this.buildUntil / 4))
        {
            this.room.memory.invasion.attacking = false;
        }

        if (creeps.length < this.buildUntil)
        {
            console.log(`Invasion Building... (${creeps.length}/${this.buildUntil})`);

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
            let baddies  = creep.room.find(FIND_HOSTILE_CREEPS);
            if (baddies.length > 0)
            {
                this.attackInRoom(creep, baddies);
            }

            // move to target
            
            if (this.room.memory.invasion.attacking)
            {
                let result = this.attackInRoom(creep);
                if (creep.room.name != this.target.roomName)
                {
                    console.log(creep.name)
                    creep.moveTo(this.target);
                }
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

    attackInRoom(creep, baddies)
    {
        if (!baddies || baddies.length == 0) return;

        let maxCombatScore = 0;
        let priority       = null;
        for (let baddie of baddies)
        {
            let score = InvasionManager.getCombatScore(baddie);
            console.log(`${score}:${baddie.name}`)
            if (score > maxCombatScore)
            {
                maxCombatScore = score;
                priority = baddie;
            }
        }
        if (priority == null)
            priority = baddies[0];

        let result = creep.attack(priority);
        if (result == ERR_NOT_IN_RANGE || result == ERR_NO_BODYPART)
            result = creep.moveTo(priority)

        return result;
    }

    // get a numberic representation of a creep's combat ability
    static getCombatScore(creep)
    {
        let score = 0;
        for (let part in creep.body)
        {
            switch (creep.body[part].type)
            {
                case CLAIM:
                    score += 100;
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
        }
        return score;
    }
} module.exports = InvasionManager;