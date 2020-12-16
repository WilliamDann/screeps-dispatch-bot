import * as Bot      from './Bot';
import * as Disbatch from './Disbatch';

import { Bulletin, Posting } from './Bulletin';

export function loop() 
{
    // clear dead creeps
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    var posts: Posting[];
    if (!Game.spawns.MainSpawn.memory["posts"])
        posts = []
    else
        posts = Game.spawns.MainSpawn.memory["posts"];
    var bulletin = new Bulletin(posts);
    
    Disbatch.run(Game.spawns.MainSpawn.room, bulletin);
    for(var name in Game.creeps) {        
        Bot.run(Game.creeps[name], bulletin)        
    }

    Game.spawns.MainSpawn.memory["posts"] = bulletin.posts;
}