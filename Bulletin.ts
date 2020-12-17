export class Bulletin
{
    maxLength : Number;
    posts     : { [location: string]: Posting[] };

    constructor(posts: { [location: string]: Posting[] }=null, maxLength=40)
    {
        if (posts == null)
            posts = {};

        this.posts     = posts;
        this.maxLength = maxLength;
    }

    static loadFromMemory(memoryObj: SpawnMemory): Bulletin
    {
        if (!memoryObj["posts"]) return new Bulletin();
        else return new Bulletin(memoryObj["posts"]);
    }

    add(posting: Posting)
    {
        console.log(posting);
        this.posts[posting.target].unshift(posting);

        if (this.posts[posting.target].length > this.maxLength)
            this.posts[posting.target].pop();
    }

    clear()
    {
        this.posts = {};
    }

    findAssigned(target: string): number
    {
        let mentions = this.posts[target];
        let diff = 0;
    
        for (let mention of mentions)
        {
            if (mention.data == "job_assign") diff++;
            if (mention.data == "job_complete") diff--;
        }
    
        return diff;
    }
}

export class Posting
{
    target : string;
    data   : any;
    poster : string;

    constructor(target:string, data:any, poster:string)
    {
        this.target = target;
        this.data   = data;
        this.poster = poster;
    }

    toString()
    {
        return `${this.target}: ${this.data} by ${this.poster}`;
    }
}