
var gol = function (global) {

  "use strict";

  var fromDead  = [ 0,0,0,1 ] // Dead  [0] rules
    , fromAlive = [ 0,0,1,1 ] // Alive [1] rules

  function cellToCoords (cell) {
    return cell.split(',').map(Number)
  }

  // function populationToCoords (population) {
  //   return Object.keys(population).map(cellToCoords)
  // }

  function neighbors (cell) {
    var coords = cellToCoords(cell)

    // Memoize
    return  [ [coords[0]-1, coords[1]-1].toString()
            , [coords[0]-1, coords[1]  ].toString()
            , [coords[0]-1, coords[1]+1].toString()
            , [coords[0]  , coords[1]-1].toString()
            , [coords[0]  , coords[1]+1].toString()
            , [coords[0]+1, coords[1]-1].toString()
            , [coords[0]+1, coords[1]  ].toString()
            , [coords[0]+1, coords[1]+1].toString()
            ]
  }



  function next ( population ) {

    var _next     = {} // The _next generation
      , deadites  = {} // The dead neighbors encountered

    // Run all the living cell
    Object.keys(population).forEach(function (cell) {
      var alive = 0

      neighbors(cell).forEach(function (cell) {
        cell in population ? alive++
                           : deadites[cell] = false // Deadcell, schedule for visit
      })
      // Apply to the _next cell
      if (fromAlive[alive] ) _next[cell] = true;
    })

    // Run all the deadites
    Object.keys(deadites).forEach(function (cell) {
      var livings = neighbors(cell).filter(function (cell) { return population[cell] })
      if (fromDead[livings.length]) _next[cell] = true;
    })

    return _next;


  }

  return  { next : next}

}();


// Create a game population
var population = gol.next( { '1,0' : true
                           , '1,1' : true
                           , '1,2' : true
                           }
                         );

console.log(population)
var assert = require('assert')
// [1,0]
// [1,1]
// [1,2]

console.assert(population['0,1'], 'Missing : 0,1')
console.assert(population['1,1'], 'Missing : 1,1')
console.assert(population['2,1'], 'Missing : 2,1')

population = gol.next(population)

console.assert(population['1,0'], 'Missing : 1,0')
console.assert(population['1,1'], 'Missing : 1,1')
console.assert(population['1,2'], 'Missing : 1,2')







