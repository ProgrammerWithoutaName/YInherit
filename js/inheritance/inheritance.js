'use strict';

var functionTypes = require(__dirname + '/../enums/functionTypes.js');
var methodExtension = require(__dirname + '/methodExtension.js');
var metaBuilder = require(__dirname + '/meta.js');


var buildMetaForType = function (name, typeFunction) {
    var prop;

    metaBuilder.assignMeta(name, 'constructor', typeFunction, typeFunction);

    for (prop in typeFunction.prototype) {
        if (typeFunction.prototype.hasOwnProperty(prop)) {
            if (typeof typeFunction.prototype[prop] === 'function' &&
                    prop !== 'constructor' &&
                    !typeFunction.prototype[prop].__meta) {
                metaBuilder.assignMeta(prop, 'method', typeFunction.prototype[prop], typeFunction);
                typeFunction.__meta.owned.push(typeFunction.prototype[prop].__meta);
            }
        }
    }
};

// adds the reflection properties to set up for __base calls.
var addParentsMeta = function (Child, Parent) {
    var prop;

    // setup constructor
    methodExtension.inheritMethod(Child, Parent);

    // setup inheritable methods
    for (prop in Parent.prototype) {
        if (Parent.prototype.hasOwnProperty(prop)) {
            methodExtension.setupMethodInheritance(Child, Parent, prop);
        }
    }
};

// Adds the Parent methods not defined in child
var addMissingParentMethods = function (Child, Parent) {
    var prop;
    for (prop in Parent.prototype) {
        if (Parent.prototype.hasOwnProperty(prop) && methodExtension.containsMethod(Parent, prop)) {
            if (!Child.prototype[prop]) {
                Child.prototype[prop] = Parent.prototype[prop];
            }
        }
    }
};

// possibly still just a prototype (not JS type prototype, I mean more like experiment that could be cleaned up.)
// stupid vocabulary overlaps.
var extend = function (name, Child, Parent) {
    if (!Child.__meta) {
        buildMetaForType(name, Child);
    }

    addParentsMeta(Child, Parent);
    addMissingParentMethods(Child, Parent);

    methodExtension.addBuildSuperFunction(Child);
    metaBuilder.assignMeta('buildSuper', 'reflectionBuilder', Child.prototype.buildSuper, Child);
};

var initTypeInheritance = function (name, Type) {
    buildMetaForType(name, Type);
    methodExtension.addBuildSuperFunction(Type);
    metaBuilder.assignMeta('buildSuper', functionTypes.reflectionBuilderFunction, Type.prototype.buildSuper, Type);
};

module.exports.extend = extend;
module.exports.initTypeInheritance = initTypeInheritance;


