Conway's Game of Life
======================

This is a simple implementation of a [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life)

It may, should, will grow into a kata space to explore different implementation ideas and compare perf.

Measuring performance
---------------------

```
node --prof gol.js
```

then install https://github.com/sidorares/node-tick
and take a look at the output of node-tick-processor

History of improvements
-----------------------

* Memoization of neighborghs(cell): 2.4x faster
