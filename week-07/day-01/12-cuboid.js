'use strict';

// Write a program that stores 3 sides of a cuboid as variables (floats)
// The program should write the surface area and volume of the cuboid like:
//
// Surface Area: 600
// Volume: 1000

let height = 10;
let length = 10;
let width = 10;

console.log('Surface Area: ' + 2 * (height * length + length * width + height * width));
console.log('Volume: ' + height * length * width);
