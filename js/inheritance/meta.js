'use strict';

var functionReflection = require(__dirname + '/../reflection/functionReflection.js');

var defineOwnerProperty = function (meta, methodOwner) {
    Object.defineProperty(meta, "owner", {
        enumerable:     true,
        configurable:   false,
        get: function () {
            return methodOwner.__meta;
        }
    });
};

var defineOwnerNameProperty = function (meta) {
    Object.defineProperty(meta, 'ownerName', {
        enumerable:     true,
        configurable:   false,
        get: function () {
            return this.owner.name;
        }
    });
};

var buildMeta = function (name, method, methodOwner, type) {

    var meta = {
        name: name,
        method: method,
        type: type,
        args: functionReflection.getFunctionArguments(method),
        parents: [],
        parentCalls: [],
        attributes: {},
        owned: []
    };

    defineOwnerProperty(meta, methodOwner);
    defineOwnerNameProperty(meta);

    return meta;
};

var assignMeta = function (name, type, method, owner) {
    method.__meta = buildMeta(name, method, owner, type);
};

module.exports.buildMeta = buildMeta;
module.exports.assignMeta = assignMeta;