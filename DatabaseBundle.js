const Bundle = require('@wardrobe/wardrobe').Bundle;

class DatabaseBundle extends Bundle
{

    static get Driver ()
    {
        return require('./Driver/Driver');
    }

}

module.exports = DatabaseBundle;