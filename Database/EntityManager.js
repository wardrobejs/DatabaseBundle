const Repository = require('./Repository');

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

    async flush (driver = undefined)
    {
        let obj;
        while (obj = this._queue.shift()) {
            await this.getRepository(obj.constructor, driver).save(obj);
        }
    }

    getRepository (model, driver)
    {
        if (typeof driver === 'undefined') {
            driver = this._driver;
        }

        if (typeof model !== 'function') {
            throw new Error(typeof model, 'function');
        }

        if (typeof model.getSchema === 'undefined') {
            throw new Error(`${model.name} is not an entity, did you forget to add @Entity?`);
        }

        if (typeof this._repositories[driver.constructor.name] === 'undefined') {
            this._repositories[driver.constructor.name] = {};
        }

        if (typeof this._repositories[driver.constructor.name][model.name] === 'undefined') {
            this._repositories[driver.constructor.name][model.name] = new Repository(model, driver);
        }

        return this._repositories[driver.constructor.name][model.name];
    }
}

module.exports = EntityManager;