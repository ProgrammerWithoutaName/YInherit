'use strict';
var inheritance = require(__dirname + '/inheritance.js');
// this is really meant to be a base set of object functionality.

var PrototypeDefinition = function (name, type) {
    this.name = name;
    this.type = type;
    if (!this.type.__meta) {
        inheritance.initTypeInheritance(this.name, this.type);
    }
};

PrototypeDefinition.prototype.extends = function (parentContainers) {
    if (parentContainers.isArray) {
        this._extendMulti(parentContainers);
    } else {
        this._extendSingle(parentContainers);
    }
    return this;
};

PrototypeDefinition.prototype._extendSingle = function(parentContainer) {
    if (!parentContainer.type.__meta) {
        inheritance.initTypeInheritance(parentContainer.name, parentContainer.type);
    }

    inheritance.extend(this.name, this.type, parentContainer.type);
};

PrototypeDefinition.prototype._extendMulti = function (parentContainers) {
    var self = this;
    parentContainers.forEach(function (container) {
        self._extendSingle(container);
    });
};

/**
 * ###prototypeOf(typeName, type)
 * This method is used to start the definition of an inheritance tree. not intended to be called on it's own, but instead
 * as part of a chain.
 * exampleCall:
 * prototypeOf('Foo',Foo).extends({'Bar',Bar});
 *
 * can also be chained for multiple inheritance:
 * prototypeOf('Foo',Foo).
 *  extends({'Bar',Bar}).
 *  extends({'Other',Other});
 *
 *  or simply called with an array,
 * * prototypeOf('Foo',Foo).
 *  extends({'Bar',Bar}, {'Other',Other});
 *
 * or series of containers for extension:
 *  prototypeOf('Foo',Foo).
 *  extends([{'Bar',Bar}, {'Other',Other}]);
 *
 * @param typeName - name used for given type
 * @param type - constructor/type definition of Type
 * @returns {*}
 */
var prototypeOf = function (typeName, type) {
    return new PrototypeDefinition(typeName, type);
};

module.exports.prototypeOf = prototypeOf;

