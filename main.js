const Overseer = require('./Overseer');
const SpawnManager = require('./SpawnManager');

module.exports.loop = () => {
    // clear dead creeps
    for (let creep in Memory.creeps)
        if (!Game.creeps[creep])
            delete Memory.creeps[creep];


    let overseer = new Overseer();
    overseer.loadAll();
    overseer.tick();
}