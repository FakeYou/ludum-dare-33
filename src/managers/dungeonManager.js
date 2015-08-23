'use strict';

var _ = require('underscore');
var TileManager = require('./tileManager');
var StateManager = require('./stateManager');
var Smoke = require('../entities/smoke');
var Slot = require('../entities/slot');
var transpose = require('../utils/transpose');
var levelToString = require('../utils/levelToString');
var levels ={
	test: require('../levels/test')
};

var DungeonManager = function(game) {
	this.game = game;
	this.tileManager = new TileManager();
};

DungeonManager.prototype.generate = function() {
	this.level = levels.test;
	this.width = this.level[0].length;
	this.height = this.level.length;

  this.timer = this.game.time.create(false);

	this.group = this.game.add.group();
	this.slotGroup = this.game.add.group();
	this.smokeGroup = this.game.add.group();

	this.group.pivot.x = this.width * 32 / 2;
	this.group.pivot.y = this.height * 32 / 2;
	this.group.x = this.game.camera.width / 2;
	this.group.y = this.game.camera.height / 2;

	this.slotGroup.pivot.x = this.width * 32 / 2;
	this.slotGroup.pivot.y = this.height * 32 / 2;
	this.slotGroup.x = this.game.camera.width / 2;
	this.slotGroup.y = this.game.camera.height / 2;

	this.smokeGroup.pivot.x = this.width * 32 / 2;
	this.smokeGroup.pivot.y = this.height * 32 / 2;
	this.smokeGroup.x = this.game.camera.width / 2;
	this.smokeGroup.y = this.game.camera.height / 2;

	this._drawLevel();
	this._drawSlots();
};

DungeonManager.prototype.update = function() {

}

DungeonManager.prototype._drawLevel = function() {
	this.group.removeAll();

	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {

			var character = this.level[y][x];

			var tileInfo = this.tileManager.getTileByChar(character);
			var tileIndex = this.tileManager.resolveRules(tileInfo, x, y, this.level);

			this.group.add(game.add.sprite(x * 32, y * 32, 'dungeon', tileIndex));
		}
	}
};

DungeonManager.prototype._drawSlots = function() {
	for(var x = 1; x < this.width - 1; x++) {
		var slot = new Slot(this.game, this.slotGroup, x * 32, 0, 'down');
		var slot = new Slot(this.game, this.slotGroup, x * 32, (this.height - 1) * 32, 'up');
	}

	for(var y = 1; y < this.height - 1; y++) {
		var slot = new Slot(this.game, this.slotGroup, 0, y * 32, 'right');
		var slot = new Slot(this.game, this.slotGroup, (this.width - 1) * 32, y * 32, 'left');
	}
}

DungeonManager.prototype.pushTileDown = function(index, character) {
	var self = this;
	var level = transpose(this.level);
	var column = level[index].slice(1, -1);

	game.stateManager.setState(StateManager.States.DungeonTransform);

	column = _.flatten([' ', character, column]);
	level[index] = column;
	this.level = transpose(level);
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(index * 32, undefined, 25);

	this.timer.add(2500, this._afterDungeonTransform, this);
	this.timer.start();

	_.chain(this.group.children)
		.where({ x: index * 32 })
		.each(function(tile) {
			tile.y -= 32;
			self.game.add.tween(tile)
				.to({ y: tile.y + 32 }, 2500, Phaser.Easing.Cubic.InOut, true);
		});
};

DungeonManager.prototype.pushTileUp = function(index, character) {
	var self = this;
	var level = transpose(this.level);
	var column = level[index].slice(1, -1);

	game.stateManager.setState(StateManager.States.DungeonTransform);

	column = _.flatten([column, character, ' ']);
	level[index] = column;
	this.level = transpose(level);
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(index * 32, undefined, 25);

	this.timer.add(2500, this._afterDungeonTransform, this);
	this.timer.start();

	_.chain(this.group.children)
		.where({ x: index * 32 })
		.each(function(tile) {
			tile.y += 32;
			self.game.add.tween(tile)
				.to({ y: tile.y - 32 }, 2500, Phaser.Easing.Cubic.InOut, true);
		});
};

DungeonManager.prototype.pushTileRight = function(index, character) {
	var self = this;
	var row = this.level[index].slice(1, -1);

	game.stateManager.setState(StateManager.States.DungeonTransform);

	row = _.flatten([' ', character, row]);
	this.level[index] = row;
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(undefined, index * 32, 25);

	this.timer.add(2500, this._afterDungeonTransform, this);
	this.timer.start();

	_.chain(this.group.children)
		.where({ y: index * 32 })
		.each(function(tile) {
			tile.x -= 32;
			self.game.add.tween(tile)
				.to({ x: tile.x + 32 }, 2500, Phaser.Easing.Cubic.InOut, true);
		});
};

DungeonManager.prototype.pushTileLeft = function(index, character) {
	var self = this;
	var row = this.level[index].slice(1, -1);

	game.stateManager.setState(StateManager.States.DungeonTransform);

	row = _.flatten([row, character, ' ']);
	this.level[index] = row;
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(undefined, index * 32, 25);

	this.timer.add(2500, this._afterDungeonTransform, this);
	this.timer.start();

	_.chain(this.group.children)
		.where({ y: index * 32 })
		.each(function(tile) {
			tile.x += 32;
			self.game.add.tween(tile)
				.to({ x: tile.x - 32 }, 2500, Phaser.Easing.Cubic.InOut, true);
		});
};

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
	var emptyRow = Array(this.width + 1).join(' ').split('');

	this.level[0] = emptyRow;
	this.level[this.height - 1] = emptyRow;

	for(var i = 1; i < this.height - 2; i++) {
		this.level[i][0] = ' ';
		this.level[i][this.width - 1] = ' ';
	}

	this._drawLevel();
	this.timer.removeAll();

	game.stateManager.setState(StateManager.States.PlayerTurn);
};

module.exports = DungeonManager;