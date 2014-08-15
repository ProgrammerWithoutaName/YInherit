'use strict';

var functionReflection = require(__dirname + '/functionReflection.js');
var functionTypes = require(__dirname + '/../enums/functionTypes.js');
var methodExtension = require(__dirname + '/../inheritance/methodExtension.js');

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

var defineTypeGetters = function (meta) {
    Object.defineProperty(meta, 'isConstructor', {
        enumerable:     true,
        configurable:   false,
        get: function () {
            return this.type === functionTypes.constructorFunction;
        }
    });

    Object.defineProperty(meta, 'isMethod', {
        enumerable:     true,
        configurable:   false,
        get: function () {
            return this.type === functionTypes.methodFunction;
        }
    });

    Object.defineProperty(meta, 'isReflectionBuilder', {
        enumerable:     true,
        configurable:   false,
        get: function () {
            return this.type === functionTypes.reflectionBuilderFunction;
        }
    });
};

// add this to the Type, then use it to add to the sub-types.
var Meta = function (name, fn, owner, type) {
    if (!owner) {
        owner = fn;
        type = functionTypes.constructorFunction;
    } else if (!type) {
        type = functionTypes.methodFunction;
    }

    this.name = name;
    this.type = type;
    this.method = fn;
    this.owner = owner;
    this.args = functionReflection.getFunctionArguments(fn);

    // this may need to get filled out more in the future. I'm just putting it here as a place holder.
    // it's meant to hold flags, really, Meta could be considered "attributes"
    this.attributes = {};
    this.owned = [];
    this.parents = [];
    this.parentCalls = [];

    defineOwnerProperty(this, fn);
    defineOwnerNameProperty(this);
    defineTypeGetters(this);

    fn.__meta = this;
};

Meta.prototype.containsMethod = function (methodName) {
    return this.method[methodName] && this.method[methodName].type === functionTypes.methodFunction;
};

Meta.prototype.addMethod = function (methodName, methodType, method) {

    if (!this.method[methodName]) {
        this.method.prototype[methodName] = method;
    }

    var ownedMeta = new Meta(methodName, method, this.fn, methodType);
    this.owned.push(ownedMeta);
};

Meta.prototype.addParent = function (parentMeta) {
    if (!this.isConstructor) {
        if (this.name !== parentMeta.name) {
            return;
        }
    }
    methodExtension.inheritMethod(this.method, parentMeta.method);
};