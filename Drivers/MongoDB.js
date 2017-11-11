class MongoDB
{
    constructor (config)
    {
        if(typeof config.database.mongodb === 'undefined') {
            throw new Error('database.mongodb not configured')
        }

        this._config = config.database.mongodb;

        console.log(this._config);
    }
    
    find(model, id) {
        console.log(model, id);
    }
    
}

module.exports = MongoDB;