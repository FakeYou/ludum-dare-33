'use strict';

var _ = require('underscore');
var StateManager = require('./stateManager');

var BuildManager = function(game) {
	this.game = game;

	this.sectionsGroup = game.add.group();
	this.sectionsGroup.x = 700;
	this.sectionsGroup.y = 20;

	this.tilesGroup = game.add.group();
	this.tilesGroup.x = 700;
	this.tilesGroup.y = 20;

	this.selected = null;

	this._drawMenu();
};

BuildManager.Sections = {
	blocks: {
		name: 'blocks',
		top: 0,
		defaultTileIndex: 0,
		tiles: ['wall', 'floor']
	},
	traps: {
		name: 'traps',
		top: 140,
		defaultTileIndex: 1,
		tiles: ['spearTrap']
	},
	monsters: {
		name: 'monsters',
		top: 280,
		defaultTileIndex: 2,
		tiles: []
	},
	treasure: {
		name: 'treasure',
		top: 420,
		defaultTileIndex: 3,
		tiles: []
	}
};

BuildManager.prototype._drawMenu = function() {
	_.each(BuildManager.Sections, function(section, i) {
		var sprite = this.game.add.sprite(0, section.top, 'sections', section.defaultTileIndex);
		this.sectionsGroup.add(sprite);

		_.each(section.tiles, function(tileName, j) {

			var tileInfo = this.game.tileManager.getTileByName(tileName);
			var x = j * 40;
			var y = section.top + 44;

			var sprite = this.game.add.sprite(x, y, 'dungeon', tileInfo.defaultTileIndex);
			sprite.tileInfo = tileInfo;
			sprite.inputEnabled = true;
			sprite.input.useHandCursor = true;
			sprite.alpha = 0.5;
			sprite.events.onInputOver.add(this._spriteOver, sprite);
			sprite.events.onInputOut.add(this._spriteOut, sprite);
			sprite.events.onInputUp.add(this._spriteUp, sprite);
			this.tilesGroup.add(sprite);

		}, this);

	}, this);
};

BuildManager.prototype._spriteOver = function() {
	if(this.game.stateManager.state === StateManager.States.PlayerTurn) {
		this.alpha = 1;
	}
};

BuildManager.prototype._spriteOut = function() {
	if(this.game.buildManager.selected !== this.tileInfo.name) {
		this.alpha = 0.5;
	}
};

BuildManager.prototype._spriteUp = function() {
	if(this.game.stateManager.state === StateManager.States.PlayerTurn) {
		this.game.buildManager.tilesGroup.forEach(function(tile) {
			tile.alpha =0.5;
		});

		this.game.buildManager.selected = this.tileInfo.name;
	}
};

module.exports = BuildManager;