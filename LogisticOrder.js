class LogisticOrder
{
    from;
    to;
    amount;
    assigner;

    constructor(from, to, amount, assigner)
    {   
        this.from     = from;
        this.to       = to;
        this.amount   = amount;
        this.assigner = assigner;
    }
    
    toString()
    {
        return `${this.from}->${this.to}: ${this.amount}`;
    }
} module.exports = LogisticOrder;