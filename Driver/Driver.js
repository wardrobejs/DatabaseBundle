class Driver
{
    constructor ()
    {
        let methods = ['find', 'findAll', 'findBy', 'findOneBy', 'count', 'save', 'remove'];
        let missing = [];
        for (let method of methods) {
            if (!Object.getPrototypeOf(this).hasOwnProperty(method)) {
                missing.push(method);
            }
        }

        if (missing.length) {
            throw new Error(`"${this.constructor.name}" does not implement all required methods. Missing "${missing.join('", "')}"`);
        }
    }
}

module.exports = Driver;