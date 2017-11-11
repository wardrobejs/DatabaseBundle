class Repository
{
    constructor (model, driver)
    {
        if (typeof model !== 'function') {
            throw new Error('Cannot initialize repository on instantiated entities');
        }

        return new Proxy(this, {
            get: function (invoker, target, args) {

                return async function () {

                    if(typeof driver[target] === 'undefined') {
                        throw new TypeError(`${driver.constructor.name}.${target} is not a function`);
                    }

                    return await driver[target](model, ...arguments);
                };

            }
        });

    }

}

module.exports = Repository;