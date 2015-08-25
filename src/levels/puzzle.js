'use strict';

var _ = require('underscore');

var levels = [
	[
	'  oooooo  ',
	'o####....o',
	'o#..#.#..o',
	' #..###.X ',
	'o#..#....o',
	' D..#.... ',
	'  oooooo  ',
	],

	[
	' oooooo ooooo oooo  ',
	'o.......  .  ......o',
	'o##........ .......o',
	' #D....I..........X ',
	' #D..........I....X ',
	'o##.....  .........o',
	'o........   .......o',
	' oooooo ooooo oooo  ',
	]
];

levels = _.map(levels, function(level) { return _.map(level, function(line) { return line.split(''); }) });

module.exports = levels;