YInherit
========

JavaScript Inheritance
-----------------------

One function is made available- prototypeOf(typeName, type)


prototypeOf is used to start the definition of an inheritance tree. not intended to be called on it's own, but instead
as part of a chain.
exampleCall:
prototypeOf('Foo',Foo).extends({'Bar',Bar});

can also be chained for multiple inheritance:
prototypeOf('Foo',Foo).
extends({'Bar',Bar}).
extends({'Other',Other});

or simply called with an array,
prototypeOf('Foo',Foo).
extends({'Bar',Bar}, {'Other',Other});

or series of containers for extension:
prototypeOf('Foo',Foo).
extends([{'Bar',Bar}, {'Other',Other}]);


When you use "prototypeOf", or 'extends' it adds on to the existing types, also giving them reflection.
Functions and the Constructor are modified to contain __meta, which contains the name, arguments, type of function 
(which could be a constructor, method, or reflectionBuilder)  