export class Bulletin
{
    maxLength : Number;
    posts     : Posting[];

    constructor(posts=null, maxLength=30)
    {
        if (posts == null)
            posts = [];

        this.posts     = posts;
        this.maxLength = maxLength;
    }

    add(posting: Posting)
    {
        console.log(posting)
        
        this.posts.unshift(posting);
        if (this.posts.length > this.maxLength)
            this.posts.pop();
    }

    clear()
    {
        this.posts = [];
    }

    findMentions(target: string): Posting[]
    {
        var referenced = [];

        for (var post of this.posts)
            if (post.target == target)
                referenced.push(post);

        return referenced;
    }

    findJobsOut(target: string): number
    {
        let mentions = this.findMentions(target);
        let diff = 0;
    
        for (let mention of mentions)
        {
            if (mention.data == "job_assign") diff++;
            if (mention.data == "job_complete") diff--;
        }
    
        return diff;
    }

    output()
    {
        for (let post of this.posts)
            console.log(`. ${post.target}: ${post.data} by ${post.poster}`)
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