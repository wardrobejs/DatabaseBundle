class Schema
{
    constructor (name, data)
    {
        Object.defineProperty(this, '__name', {
            configurable: false,
            writeable: false,
            value: name
        });

        for (let attribute in data) {
            if(data.hasOwnProperty(attribute)) {
                this[attribute] = data[attribute];
            }
        }
    }

    getName() {
        return this.__name;
    }

    getPrimary (key = false)
    {
        for (let attribute in this) {
            if(this.hasOwnProperty(attribute)) {
                if(typeof this[attribute].primary !== 'undefined') {
                    if(key) {
                        return this[attribute].key;
                    }
                    return attribute;
                }
            }
        }

        throw new Error(`Schema does not contain primary key`);
    }
}

module.exports = Schema;