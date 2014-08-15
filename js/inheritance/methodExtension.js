'use strict';

var containsMethod = function (Type, methodName) {
    return Type[methodName] && Type[methodName].__meta && Type[methodName].__meta.type === 'method';
};

var createSuperCallForMethod = function (superContainer, meta, nameOverride) {
    nameOverride = nameOverride || meta.name;
    superContainer[nameOverride] = function () {
        meta.callAllParents(superContainer);
    };
    meta.parentCalls.forEach(function (parentCall) {
        superContainer[nameOverride][parentCall.name] = function () {
            parentCall.method(superContainer, arguments);
        };
    });
};

var addBuildSuperFunction = function (type) {
    var meta = type.__meta;

    // have to call this in constructor... oh crap, this doesn't work.
    type.prototype.buildSuper = function () {
        // this is the only thing I could think of.
        var self = this;
        if (!this.super) {
            this.super = {self: self};
            // base methods
            meta.owned.forEach(function (ownedMeta) {
                createSuperCallForMethod(self.super, ownedMeta);
            });

            // constructor
            createSuperCallForMethod(self.super, meta, 'constructors');
        }
    };
};

var checkIfAlreadyInheriting = function (meta, name) {
    meta.parents.forEach(function (parent) {
        if (parent.name === name) {
            throw new TypeError("Prototype '" + meta.name + "' is already inheriting type '" + name + "'");
        }
    });
};

var inheritMethod = function (childMethod, parentMethod) {
    checkIfAlreadyInheriting(childMethod.__meta, parentMethod.__meta.name);
    childMethod.__meta.parents.push(parentMethod.__meta);
    childMethod.__meta.parentCalls.push({
        name: parentMethod.__meta.name,
        method: function (superContainer, args) {
            parentMethod.apply(superContainer.self, args);
        }
    });
};

var setupMethodInheritance = function (Child, Parent, methodName) {
    if (containsMethod(Child, methodName) &&
            containsMethod(Parent, methodName)) {
        inheritMethod(Child.prototype[methodName], Parent.prototype[methodName]);
    }
};

var defineCallAllParents = function (meta) {
    meta.callAllParents = function (superContainer, args) {
        this.parentCalls.forEach(function (parentCall) {
            parentCall.method(superContainer, args);
        });
    };
};

module.exports.addBuildSuperFunction = addBuildSuperFunction;
module.exports.defineCallAllParents = defineCallAllParents;
module.exports.inheritMethod = inheritMethod;
module.exports.setupMethodInheritance = setupMethodInheritance;
module.exports.containsMethod = containsMethod;