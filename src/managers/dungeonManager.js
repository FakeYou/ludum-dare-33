'use strict';

var _ = require('underscore');
var TileManager = require('./tileManager');
var Smoke = require('../entities/smoke');
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

	this.group = this.game.add.group();

	this.group.pivot.x = this.width * 32 / 2;
	this.group.pivot.y = this.height * 32 / 2;
	this.group.x = this.game.camera.width / 2;
	this.group.y = this.game.camera.height / 2;

	this._drawLevel();
};

var i = 0;
DungeonManager.prototype.update = function() {

	i++;

	if(i % 400 === 0) {
		var funcs = [
			this.pushTileDown,
			this.pushTileUp,
			this.pushTileLeft,
			this.pushTileRight,
		];

		var func = _.sample(funcs);

		var index = _.random(2, 7);
		func.call(this, index, '#');
	}


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

DungeonManager.prototype.pushTileDown = function(index, character) {
	var self = this;
	var level = transpose(this.level);
	var column = level[index].slice(1, -1);

	column = _.flatten([' ', character, column]);
	level[index] = column;
	this.level = transpose(level);
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(index * 32, undefined, 25);

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

	column = _.flatten([column, character, ' ']);
	level[index] = column;
	this.level = transpose(level);
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(index * 32, undefined, 25);

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

	row = _.flatten([' ', character, row]);
	this.level[index] = row;
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(undefined, index * 32, 25);

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

	row = _.flatten([row, character, ' ']);
	this.level[index] = row;
	this._drawLevel();

	game.plugins.screenShake.shake(30, 40, 0.02);
	this._smoke(undefined, index * 32, 25);

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

		new Smoke(this.game, this.group, _x, _y);
	}
}

module.exports = DungeonManager;