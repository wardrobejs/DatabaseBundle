const Schema = require('./Schema');

class Repository
{
    constructor (model, driver)
    {
        if (!(model.getSchema() instanceof Schema)) {
            throw new Error(`Entity does not contain a schema`);
        }

        return new Proxy(this, {
            get: function (invoker, target, args) {

                if(target.startsWith('findBy')) {
                    let by = target.substr(6).lcfirst();
                    // validate by
                    return async function () {
                        return await driver['findBy'](model, by, ...arguments);
                    }
                }

                if(target.startsWith('findOneBy')) {
                    let by = target.substr(9).lcfirst();
                    return async function () {
                        return await driver['findOneBy'](model, by, ...arguments);
                    }
                }

                if(target.startsWith('countBy')) {
                    let by = target.substr(7).lcfirst();
                    return async function () {
                        return await driver['count'](model, by, ...arguments);
                    }
                }

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