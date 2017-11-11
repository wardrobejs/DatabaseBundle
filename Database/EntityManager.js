const Repository = require('./Repository');

const InvalidArgumentException = require('../../Wardrobe/Exception/InvalidArgumentException');

class EntityManager
{
    constructor (container, config)
    {
        this._container = container;
        this._config    = config;

        this._queue        = [];
        this._repositories = {};

        if (typeof this._config.database === 'undefined') {
            throw new Error('database key missing in config');
        }

        if (typeof this._config.database.driver === 'undefined') {
            throw new Error('No driver selected');
        }

        let driver = this._config.database.driver;

        this._driver = container.has(driver) ? container.get(driver) : container.get(`database.driver.${driver}`);

    }

    persist (obj)
    {
        this._queue.push(obj);
    }

    flush ()
    {
        return new Promise(async (resolve, reject) => {
            let errors = [];

            let obj;
            while (obj = this._queue.shift()) {
                try {
                    await this._promisify(obj);
                } catch (e) {
                    errors.push(e);
                }
            }

            if (errors.length) {
                reject(errors);
                return;
            }

            resolve();
        });
    }

    getRepository (model, driver)
    {
        if (typeof driver === 'undefined') {
            driver = this._driver;
        }

        if (typeof model !== 'function') {
            throw new InvalidArgumentException(typeof model, 'function');
        }

        if (typeof model.prototype.getSchema === 'undefined') {
            throw new InvalidArgumentException(`${model.name} is not an entity, did you forget to add @Entity?`);
        }

        if (typeof this._repositories[driver.constructor.name] === 'undefined') {
            this._repositories[driver.constructor.name] = {};
        }

        if (typeof this._repositories[driver.constructor.name][model.name] === 'undefined') {
            this._repositories[driver.constructor.name][model.name] = new Repository(model, driver);
        }

        return this._repositories[driver.constructor.name][model.name];
    }

    _promisify (obj)
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // simulate database save callback thingy

                // find active driver
                resolve();
            }, 0);
        });
    }
}

module.exports = EntityManager;