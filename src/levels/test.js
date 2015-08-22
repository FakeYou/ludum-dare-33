'use strict';

var _ = require('underscore');

var level = [
	'            ',
	' ########## ',
	' #........# ',
	' #......#.# ',
	' #....#.#.# ',
	' #...###..# ',
	' #.#####..# ',
	' #...###..# ',
	' #...#....# ',
	' #........# ',
	' ########## ',
	'            ',
];

level = _.map(level, function(line) { return line.split(''); });

module.exports = level;