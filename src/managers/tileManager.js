'use strict';

var _ = require('underscore');

var TileManager = function(game) {
	this.game = game;
};

TileManager.Tiles = {
	empty: {
		name: 'empty',
		character: ' ',
		number: 0,
		defaultTileIndex: 0,
		rules: []
	},

	fixed: {
		name: 'column',
		character: 'I',
		number: 0,
		defaultTileIndex: 90,
		rules: []
	},

	slot: {
		name: 'slot',
		character: 'o',
		number: 0,
		defaultTileIndex: 0,
		rules: []
	},

	floor: {
		name: 'floor',
		character: '.',
		number: 1,
		defaultTileIndex: 1,
		rules: []
	},

	gate: {
		name: 'gate',
		character: 'D',
		number: 2,
		defaultTileIndex: 130,
		rules: [
			{ tileIndex: 110, map: { s: 'gate' } },
			{ tileIndex: 120, map: { n: 'gate' } },
		]
	},

	exit: {
		name: 'exit',
		character: 'X',
		number: 3,
		defaultTileIndex: 131,
		rules: [
			{ tileIndex: 111, map: { s: 'exit' } },
			{ tileIndex: 121, map: { n: 'exit' } },
		]
	},

	treasure: {
		name: 'treasure',
		character: '@',
		number: 4,
		defaultTileIndex: 9,
		rules: []
	},

	spider: {
		name: 'spider',
		character: 'x',
		number: 0,
		defaultTileIndex: 1,
		rules: [],
		monster: 'spider'
	},

	spearTrap: {
		name: 'spearTrap',
		character: '!',
		number: 5,
		defaultTileIndex: 94,
		rules: [],
		animations: {
			trigger: [94, 95, 96, 97, 98]
		}
	},

	wall: {
		name: 'wall',
		character: '#',
		number: 2,
		defaultTileIndex: 25,
		rules: [
			{ tileIndex: 22, map: { n: 'wall', ne: 'wall', e: 'wall', se: 'wall', s: 'wall', sw: 'wall', w: 'wall', nw: 'wall' } },

			{ tileIndex: 17, map: { n: 'wall', ne: 'wall', e: 'wall', s: 'wall', sw: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 19, map: { n: 'wall', ne: 'wall', e: 'wall', se: 'wall', s: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 37, map: { n: 'wall', e: 'wall', se: 'wall', s: 'wall', sw: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 39, map: { n: 'wall', ne: 'wall', e: 'wall', se: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },

			{ tileIndex: 18, map: { n: 'wall', ne: 'wall', e: 'wall', s: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 27, map: { n: 'wall', e: 'wall', s: 'wall', sw: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 29, map: { n: 'wall', ne: 'wall', e: 'wall', se: 'wall', s: 'wall', w: 'wall' } },
			{ tileIndex: 38, map: { n: 'wall', e: 'wall', se: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },

			{ tileIndex: 52, map: { n: 'wall', e: 'wall', se: 'wall', s: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 53, map: { n: 'wall', ne: 'wall', e: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },

			{ tileIndex: 48, map: { n: 'wall', e: 'wall', s: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 49, map: { n: 'wall', ne: 'wall', e: 'wall', s: 'wall', w: 'wall' } },
			{ tileIndex: 58, map: { n: 'wall', e: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },
			{ tileIndex: 59, map: { n: 'wall', e: 'wall', se: 'wall', s: 'wall', w: 'wall' } },

			{ tileIndex: 12, map: { e: 'wall', se: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },
			{ tileIndex: 21, map: { n: 'wall', ne: 'wall', e: 'wall', se: 'wall', s: 'wall' } },
			{ tileIndex: 23, map: { n: 'wall', s: 'wall', sw: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 32, map: { n: 'wall', ne: 'wall', e: 'wall', w: 'wall', nw: 'wall' } },

			{ tileIndex: 44, map: { e: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },
			{ tileIndex: 45, map: { n: 'wall', s: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 46, map: { n: 'wall', ne: 'wall', e: 'wall', s: 'wall' } },
			{ tileIndex: 47, map: { e: 'wall', se: 'wall', s: 'wall', w: 'wall' } },

			{ tileIndex: 54, map: { n: 'wall', e: 'wall', se: 'wall', s: 'wall' } },
			{ tileIndex: 55, map: { n: 'wall', ne: 'wall', e: 'wall', w: 'wall' } },
			{ tileIndex: 56, map: { n: 'wall', e: 'wall', w: 'wall', nw: 'wall' } },
			{ tileIndex: 57, map: { n: 'wall', s: 'wall', sw: 'wall', w: 'wall' } },

			{ tileIndex: 28, map: { n: 'wall', e: 'wall', s: 'wall', w: 'wall' } },

			{ tileIndex: 11, map: { e: 'wall', se: 'wall', s: 'wall' } },
			{ tileIndex: 13, map: { w: 'wall', sw: 'wall', s: 'wall' } },
			{ tileIndex: 31, map: { n: 'wall', ne: 'wall', e: 'wall' } },
			{ tileIndex: 33, map: { n: 'wall', w: 'wall', nw: 'wall' } },

			{ tileIndex: 15, map: { e: 'wall', s: 'wall', w: 'wall' } },
			{ tileIndex: 24, map: { n: 'wall', e: 'wall', s: 'wall' } },
			{ tileIndex: 26, map: { n: 'wall', s: 'wall', w: 'wall' } },
			{ tileIndex: 35, map: { n: 'wall', e: 'wall', w: 'wall' } },

			{ tileIndex: 20, map: { n: 'wall', s: 'wall' } },
			{ tileIndex: 42, map: { e: 'wall', w: 'wall' } },

			{ tileIndex: 14, map: { e: 'wall', s: 'wall' } },
			{ tileIndex: 16, map: { s: 'wall', w: 'wall' } },
			{ tileIndex: 34, map: { n: 'wall', e: 'wall' } },
			{ tileIndex: 36, map: { n: 'wall', w: 'wall' } },

			{ tileIndex: 10, map: { s: 'wall' } },
			{ tileIndex: 30, map: { n: 'wall' } },
			{ tileIndex: 41, map: { e: 'wall' } },
			{ tileIndex: 43, map: { w: 'wall' } },

			{ tileIndex: 25, map: { } },
		]
	}
};

TileManager.Directions = {
	n : { x:  0, y: -1 },
	ne: { x:  1, y: -1 },
	e : { x:  1, y:  0 },
	se: { x:  1, y:  1 },
	s : { x:  0, y:  1 },
	sw: { x: -1, y:  1 },
	w : { x: -1, y:  0 },
	nw: { x: -1, y: -1 }
};

TileManager.prototype.getTileByChar = function(character) {
	if(!this.charTileMap) {
		this.charTileMap = {};

		_.each(TileManager.Tiles, function(tileInfo) {
			this.charTileMap[tileInfo.character] = tileInfo;
		}, this);
	}

	return this.charTileMap[character];
};

TileManager.prototype.getTileByName = function(name) {
	return TileManager.Tiles[name];
};;

TileManager.prototype.resolveRules = function(tileInfo, x, y, map) {
	var neighbours = _.mapObject(TileManager.Directions, function(coords, dir) {

		var _x = x + coords.x;
		var _y = y + coords.y;

		if(_x < 0 || _y < 0 || _x >= map[0].length || _y >= map.length) {
			return false;
		}

		var tile = this.getTileByChar(map[_y][_x]);
		return tile.name;

	}, this);

	// remove falsy values
	neighbours = _.pick(neighbours, _.identity);

	var tileIndex = tileInfo.defaultTileIndex;
	for(var i = 0; i < tileInfo.rules.length; i++) {
		var rule = tileInfo.rules[i];

		var criteria = _.pick(neighbours, _.keys(rule.map));

		if(_.isEqual(rule.map, criteria)) {
			tileIndex = rule.tileIndex;
			break;
		}
	} 

	return tileIndex;
};

TileManager.prototype.translateToGrid = function(level) {
	var grid = _.map(level, function(row) {
		return _.map(row, function(tile) {
			var tileInfo = this.getTileByChar(tile);
			return tileInfo.number;
		}, this);
	}, this);

	return grid;
};

module.exports = TileManager;