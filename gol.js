!function () {
  "use strict";

  var gol = function (global) {

    var fromDead  = [ 0,0,0,1 ] // Dead  [0] rules
      , fromAlive = [ 0,0,1,1 ] // Alive [1] rules

    function cellToCoords (cell) {
      return cell.split(',').map(Number)
    }

    var memoize = {}

    function neighbors (cell) {
      if (cell in memoize) return memoize[cell];

      var coords = cellToCoords(cell)
      var neighbors_computed = [ [coords[0]-1, coords[1]-1].toString()
                               , [coords[0]-1, coords[1]  ].toString()
                               , [coords[0]-1, coords[1]+1].toString()
                               , [coords[0]  , coords[1]-1].toString()
                               , [coords[0]  , coords[1]+1].toString()
                               , [coords[0]+1, coords[1]-1].toString()
                               , [coords[0]+1, coords[1]  ].toString()
                               , [coords[0]+1, coords[1]+1].toString()
                               ];
      memoize[cell] = neighbors_computed;
      return neighbors_computed;
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


  function assertPopulation ( population, c1, c2 /*,...*/) {
    [].slice.call(arguments,1).forEach(function (cell) {
      console.assert(population[cell], 'Missing : ' + cell)
    })
  }

  function strToPopulation ( r1, r2 /*,rn*/) {
    var population = {}
      , x
      , y = arguments.length
      , row;

    while (y--) {
      x = arguments[y].length
      while (x--)
        if ( 'O' === arguments[y][x] ) population[[x,y].toString()] = true;

    }

    return population
  }

  console.log("Population :: ", strToPopulation( "O.."
                                               , ".O."
                                               , "..O"
                                               ))

  // Assumes population are alway in positive space
  function populationToStr (population) {
    var rows = [[]]
    Object.keys(population).forEach(function (cell) {
      var p = cell.split(',').map(Number)
      rows[p[1]] = rows[p[1]] || [];
      rows[p[1]][p[0]] = true;
    })

    var max = rows.reduce(function (max, r,i) {
                            return r.length > max ? r.length : max;
                          }, 0)
    //rows.forEach(function (r) {r.length = max})
    var row
      , r = rows.length
      , c
    while (r--) {
      row = (rows[r] = rows[r] || [])
      c = (row.length = max)

      while(c--) row[c] = row[c] ? 'O' : '.' ;
      rows[r] = row.join('')
    }
    return rows.join('\n')

  }

  console.log("str Population :: \n", populationToStr( { '0,1' : 1
                                                       , '0,3' : 1
                                                       , '1,0' : 1
                                                       , '2,1' : 1
                                                       }
                                                     ))

  // for profiling
  ;!function profilingRun () {
    var population = gol.next({ '0,1' : 1
                              , '0,3' : 1
                              , '1,0' : 1
                              , '2,1' : 1
                              });
    var steps = 100000;
    console.log('Doing ' + steps + ' for profiling...');
    while(steps--) {
      population = gol.next(population);
    }
    console.log('Done!');
  }()

  // Create a game population
  ;!function testBlinker () {
    // From      to
    // .O.       ...
    // .O.   x1  OOO
    // .O.       ...
    var population = gol.next( { '1,0' : true
                               , '1,1' : true
                               , '1,2' : true
                               }
                             );

    assertPopulation(population, '0,1', '1,1', '2,1')

    population = gol.next(population)

    assertPopulation(population, '1,0', '1,1', '1,2')

    console.log('Blinker assertion done!');
  }()



  ;!function testGlidderTranslation () {
    // From       To
    // ....       OOO.
    // .OOO       O...
    // .O..  x4   .O..
    // ..O.       ....

    var population = strToPopulation( '....'
                                    , '.OOO'
                                    , '.O..'
                                    , '..O.'
                                    )

    console.log('Start ====================')
    console.log('\n%s',populationToStr(population))
    population = gol.next(population)
    console.log('\n',populationToStr(population))
    population = gol.next(population)
    console.log('\n%s',populationToStr(population))
    population = gol.next(population)
    console.log('\n%s',populationToStr(population))
    population = gol.next(population)
    console.log('\n%s',populationToStr(population))

    assertPopulation( population
                    , '0,0' ,'1,0' ,'2,0'
                    , '0,1'   /*  */  /*  */
                      /*  */,'1,2'   /*  */

                    )


    console.log('Glidder translation done!');
  }()

  ;!function testGlidderTranslation () {
    "use strict";
    // From       To
    // ....       OOO.
    // .OOO       O...
    // .O..  x4   .O..
    // ..O.       ....

    var population = { '0,0' :1,'1,0' :1,'2,0' :1
                     , '0,1' :1
                               ,'1,2' :1
                     }


    population = gol.next(population)
    population = gol.next(population)
    population = gol.next(population)
    population = gol.next(population)

    assertPopulation( population
                    , '-1,-1' ,'0,-1' ,'1,-1'
                    , '-1,0'   /*  */  /*  */
                      /*  */  ,'0,1'   /*  */

                    )


    console.log('Glidder translation done!');
  }()

}()
