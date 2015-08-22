'use strict';

var preload = function() {
	console.log('preload');

	// this.game.load.tilemap('test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.spritesheet('dungeon', 'assets/tilesets/dungeon.png', 32, 32, undefined, 2, 2);
};

module.exports = preload;