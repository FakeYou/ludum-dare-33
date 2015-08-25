'use strict';

var StateManager = require('../managers/stateManager');

var Slot = function(game, group, x, y, dir) {

	this.game = game;
	this.dungeonManager = game.dungeonManager;
	this.tileX = x;
	this.tileY = y;
	this.dir = dir;

	this.sprite = game.add.sprite(x  * 32, y * 32, 'dungeon', 78);
	group.add(this.sprite);

	this.sprite.inputEnabled = true;
	this.sprite.input.useHandCursor = true;

	this.sprite.animations.add('idle', [78], 10, true);
	this.sprite.animations.add('inactive', [79], 10, true);
	this.sprite.animations.add('highlight', [84, 85, 86, 87, 88], 10, true);

	this.sprite.events.onInputOver.add(this.onInputOver, this);
	this.sprite.events.onInputOut.add(this.onInputOut, this);
	this.sprite.events.onInputUp.add(this.onInputUp, this);

	this.game.stateManager.onStateChange(this.onStateChange, this);
};

Slot.prototype.onInputOver = function(e) {
	this.sprite.animations.play('highlight');
};

Slot.prototype.onInputOut = function(e) {
	this.sprite.animations.play('idle');
};

Slot.prototype.onInputUp = function(e) {
	if(this.dir === 'down') {
		this.dungeonManager.pushTileDown(this.tileX);
	}
	else if(this.dir === 'up') {
		this.dungeonManager.pushTileUp(this.tileX);
	}
	else if(this.dir === 'left') {
		this.dungeonManager.pushTileLeft(this.tileY);
	}
	else if(this.dir === 'right') {
		this.dungeonManager.pushTileRight(this.tileY);
	}
};

Slot.prototype.onStateChange = function(state) {
	
	if(state === StateManager.States.PlayerTurn) {
		this.sprite.inputEnabled = true;
		this.sprite.animations.play('idle');
	}
	else {
		this.sprite.inputEnabled = false;
		this.sprite.animations.play('inactive');
	}
}

module.exports = Slot;