const doctrine         = require('doctrine'),
      AnnotationParser = require('@wardrobe/wardrobe').AnnotationParser;

const Schema = require('../Database/Schema');

class Entity
{
    constructor ()
    {
        this._annotation_parser = new AnnotationParser(null);
    }

    compile (data, _module)
    {
        let source = _module.exports.toString();

        let instance = new _module.exports();
        let props    = this._resolveProperties(instance.constructor.toString());

        let schema = {};

        for (let prop in props) {
            if (!props.hasOwnProperty(prop)) {
                continue;
            }

            schema[props[prop].Column.value || prop] = {
                key: prop,
                type: this._getType(props[prop]),
                unique: (typeof props[prop].Id !== 'undefined') || (typeof props[prop].Column.unique !== 'undefined'),
                primary: (typeof props[prop].Id !== 'undefined')
            };
        }

        schema = new Schema(_module.exports.name, schema);

        _module.exports.getSchema = function (){
            return schema;
        };

    }

    _getType (prop)
    {
        let type = 'string';

        if (typeof prop.Column.type === 'string') {
            type = prop.Column.type;
        } else if (typeof prop.Column.default !== 'undefined') {
            type = typeof prop.Column.default;
        } else if (typeof prop.type !== 'undefined') {
            type = prop.type.name;
        }

        return global[type.ucfirst()].apply().constructor;
    }

    _resolveProperties (source)
    {
        let _props = {};

        let match, regexp = /(\/\*{2}[\s\S]+?\*\/)\s+([\w.]+)\)?/g;
        while (match = regexp.exec(source)) {
            // match = match.map((r => typeof r === 'string' ? r.trim() : r));

            if (typeof match[1] !== 'string' || typeof match[2] !== 'string') {
                continue;
            }
            let props = doctrine.parse(match[1].trim(), {sloppy: true, unwrap: true});
            let tags  = props.tags;
            let prop  = match[2].trim();

            if (prop.indexOf('this.') !== 0) {
                continue;
            }

            _props[prop.replace('this.', '')] = {};
            for (let tag of tags) {
                _props[prop.replace('this.', '')][tag.title] = tag.description ? this._annotation_parser.parseDescription(tag.description) : tag[tag.title] || {};
            }
        }

        return _props;
    }
}

module.exports = Entity;