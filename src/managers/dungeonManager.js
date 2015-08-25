'use strict';

var _ = require('underscore');
var TileManager = require('./tileManager');
var StateManager = require('./stateManager');
var Smoke = require('../entities/smoke');
var Slot = require('../entities/slot');
var transpose = require('../utils/transpose');
var levelToString = require('../utils/levelToString');
var levels ={
	test: require('../levels/test'),
	puzzle: require('../levels/puzzle')
};

var DungeonManager = function(game) {
	this.game = game;
};

DungeonManager.prototype.generate = function() {
	this.level = levels.puzzle[0];
	// this._padLevel(5);

	this.width = this.level[0].length;
	this.height = this.level.length;

  this.timer = this.game.time.create(false);

	this.tileGroup = this.game.add.group();
	this.tileGroup.z = 1;
	this.tileGroup.pivot.x = this.width * 32 / 2;
	this.tileGroup.pivot.y = this.height * 32 / 2;
	this.tileGroup.x = (this.game.camera.width - 0) / 2;
	this.tileGroup.y = this.game.camera.height / 2;

	this.slotGroup = this.game.add.group();
	this.slotGroup.z = 0;
	this.slotGroup.pivot.x = this.width * 32 / 2;
	this.slotGroup.pivot.y = this.height * 32 / 2;
	this.slotGroup.x = (this.game.camera.width - 0) / 2;
	this.slotGroup.y = this.game.camera.height / 2;

	this.smokeGroup = this.game.add.group();
	this.smokeGroup.z = 5;
	this.smokeGroup.pivot.x = this.width * 32 / 2;
	this.smokeGroup.pivot.y = this.height * 32 / 2;
	this.smokeGroup.x = (this.game.camera.width - 0) / 2;
	this.smokeGroup.y = this.game.camera.height / 2;

	this._drawLevel();
	// this._drawSlots();
};

DungeonManager.prototype.update = function() {

}

DungeonManager.prototype._padLevel = function(padding) {
	var line = new Array(padding * 2 + this.level[0].length + 1).join(' ').split('');
	var pad = new Array(padding + 1).join(' ').split('');

	console.log(levelToString(this.level));

	this.level = _.map(this.level, function(line) {
		return [].concat(pad, line, pad);
	});

	_.times(padding, function() {
		this.level.unshift(line);
		this.level.push(line);
	}, this);

	console.log(levelToString(this.level));
	// console.log(line);
}

DungeonManager.prototype._drawLevel = function() {


	this.tileGroup.removeAll();

	this.game.pathManager.setGrid(this.game.tileManager.translateToGrid(this.level));

	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {

			var character = this.level[y][x];

			var tileInfo = this.game.tileManager.getTileByChar(character);
			var tileIndex = this.game.tileManager.resolveRules(tileInfo, x, y, this.level);

			if(_.isArray(tileIndex)) {
				tileIndex = _.sample(tileIndex);
			}

			if(tileInfo.name === 'slot') {
				var dir;

				if(x === 0) { dir = 'right'; }
				if(y === 0) { dir = 'down'; }
				if(x === this.width - 1) { dir = 'left'; }
				if(y === this.height - 1) { dir = 'up'; }

				new Slot(this.game, this.slotGroup, x, y, dir);
			}

			var tile = game.add.sprite(x * 32, y * 32, 'dungeon', tileIndex);
			tile.tileX = x;
			tile.tileY = y;
			this.tileGroup.add(tile);
		}
	}
};

// DungeonManager.prototype._drawSlots = function() {
// 	for(var x = 1; x < this.width - 1; x++) {
// 		var slot = new Slot(this.game, this.slotGroup, x, 0, 'down');
// 		var slot = new Slot(this.game, this.slotGroup, x, this.height - 1, 'up');
// 	}

// 	for(var y = 1; y < this.height - 1; y++) {
// 		var slot = new Slot(this.game, this.slotGroup, 0, y, 'right');
// 		var slot = new Slot(this.game, this.slotGroup, this.width - 1, y, 'left');
// 	}
// };

DungeonManager.prototype.pushTileDown = function(index, name) {
	var self = this;
	var level = transpose(this.level);
	var column = level[index].slice(1, -1);

	if(name) {
		var character = this.game.tileManager.getTileByName(name).character;
	}
	else {
		character = column[column.length - 1];
	}

	game.stateManager.setState(StateManager.States.DungeonTransform);

	column = _.flatten([' ', character, column]);
	level[index] = column;
	this.level = transpose(level);
	this._drawLevel();

	this._pushLine(index, 'y', -1);
};

DungeonManager.prototype.pushTileUp = function(index, name) {
	var self = this;
	var level = transpose(this.level);
	var column = level[index].slice(1, -1);

	if(name) {
		var character = this.game.tileManager.getTileByName(name).character;
	}
	else {
		character = column[0];
	}

	game.stateManager.setState(StateManager.States.DungeonTransform);

	column = _.flatten([column, character, ' ']);
	level[index] = column;
	this.level = transpose(level);
	this._drawLevel();

	this._pushLine(index, 'y', 1);
};

DungeonManager.prototype.pushTileRight = function(index, name) {
	var self = this;
	var row = this.level[index].slice(1, -1);

	if(name) {
		var character = this.game.tileManager.getTileByName(name).character;
	}
	else {
		character = row[row.length - 1];
	}

	game.stateManager.setState(StateManager.States.DungeonTransform);

	row = _.flatten([' ', character, row]);
	this.level[index] = row;
	this._drawLevel();

	this._pushLine(index, 'x', -1);
};

DungeonManager.prototype.pushTileLeft = function(index, name) {
	var self = this;
	var row = this.level[index].slice(1, -1);

	if(name) {
		var character = this.game.tileManager.getTileByName(name).character;
	}
	else {
		character = row[0];
	}

	game.stateManager.setState(StateManager.States.DungeonTransform);

	row = _.flatten([row, character, ' ']);
	this.level[index] = row;
	this._drawLevel();

	this._pushLine(index, 'x', 1);
};

DungeonManager.prototype._pushLine = function(index, axis, direction) {
	game.plugins.screenShake.shake(30, 40, 0.02);

	if(axis === 'x') {
		this._smoke(undefined, index * 32, 40);
		var where = { tileY: index };
	}
	else {
		this._smoke(index * 32, undefined, 40);
		var where = { tileX: index };
	}

	this.timer.add(3000, this._afterDungeonTransform, this);
	this.timer.start();

	_.chain(this.tileGroup.children)
		.where(where)
		.each(function(tile) {
			tile[axis] += 32 * direction;
			
			var to = {};
			to[axis] = tile[axis] + 32 * direction * -1;

			self.game.add.tween(tile)
				.to(to, 2500, Phaser.Easing.Cubic.InOut, true);
		});

	// _.chain(this._getEntities())
	// 	.where(where)
	// 	.each(function(entity) {
	// 		var to = {};
	// 		to[axis] = entity[axis] + 32 * direction  * -1;

	// 		self.game.add.tween(entity)
	// 			.to(to, 2500, Phaser.Easing.Cubic.InOut, true);
	// 	});
}

DungeonManager.prototype.getTilesByName = function(name) {
	var character = this.game.tileManager.getTileByName(name).character;
	var tiles = [];

	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			if(this.level[y][x] === character) {
				tiles.push(_.findWhere(this.tileGroup.children, { tileX: x, tileY: y }));
			}
		}
	}

	return tiles;
};

DungeonManager.prototype._getEntities = function() {
	return [].concat(
		this.game.heroManager.group.children,
		this.game.monsterManager.group.children
	);
}

DungeonManager.prototype._smoke = function(x, y, amount) {
	for(var i = 0; i < amount; i++) {
		var _x = x;
		var _y = y;

		if(x === undefined) {
			_x = Math.random() * (this.width - 3) * 32 + 32;
		}
		
		if(y === undefined) {
			_y = Math.random() * (this.height - 3) * 32 + 32;
		}

		_x += (Math.random() - 0.5) * 16;
		_y += (Math.random() - 0.5) * 16;

		new Smoke(this.game, this.smokeGroup, _x, _y);
	}
};

DungeonManager.prototype._afterDungeonTransform = function() {
	// var emptyRow = Array(this.width + 1).join(' ').split('');

	// this.level[0] = emptyRow;
	// this.level[this.height - 1] = emptyRow;

	// for(var i = 1; i < this.height - 1; i++) {
	// 	this.level[i][0] = ' ';
	// 	this.level[i][this.width - 1] = ' ';
	// }

	this._drawLevel();
	this.timer.removeAll();



	game.stateManager.setState(StateManager.States.PlayerTurn);
};

module.exports = DungeonManager;