'use strict';

var levelToString = function(level) {
	var string = '';

	for(var y = 0; y < level.length; y++ ) {
		for(var x = 0; x < level[y].length; x++) {
			string += level[y][x];
		}
		string += '\n';
	}

	return string;
}

module.exports = levelToString;