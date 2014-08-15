'use strict';
var functionTypeArray = ['constuctor', 'method', 'reflectionBuilder'];

var functionTypes = {
    constructorFunction: functionTypeArray[0],
    methodFunction: functionTypeArray[1],
    reflectionBuilderFunction: functionTypeArray[2],
    allTypes: functionTypeArray,
    typeIsValid: function (value) { return functionTypeArray.indexOf(value) >= 0; }
};

module.exports = functionTypes;