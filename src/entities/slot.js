'use strict';

var StateManager = require('../managers/stateManager');

var Slot = function(game, group, x, y, dir) {

	this.game = game;
	this.dungeonManager = game.dungeonManager;
	this.x = x;
	this.y = y;
	this.dir = dir;

	this.sprite = game.add.sprite(x, y, 'dungeon', 78);
	group.add(this.sprite);

	this.sprite.inputEnabled = true;

	this.sprite.animations.add('idle', [78], 10, true);
	this.sprite.animations.add('highlight', [84, 85, 86, 87, 88], 10, true);

	this.sprite.events.onInputOver.add(this.onInputOver, this);
	this.sprite.events.onInputOut.add(this.onInputOut, this);
	this.sprite.events.onInputUp.add(this.onInputUp, this);

	this.sprite.update = this.update.bind(this);
};

Slot.prototype.onInputOver = function(e) {
	this.sprite.animations.play('highlight');
};

Slot.prototype.onInputOut = function(e) {
	this.sprite.animations.play('idle');
};

Slot.prototype.onInputUp = function(e) {
	if(this.dir === 'down') {
		this.dungeonManager.pushTileDown(this.x / 32, '#');
	}
	else if(this.dir === 'up') {
		this.dungeonManager.pushTileUp(this.x / 32, '#');
	}
	else if(this.dir === 'left') {
		this.dungeonManager.pushTileLeft(this.y / 32, '#');
	}
	else if(this.dir === 'right') {
		this.dungeonManager.pushTileRight(this.y / 32, '#');
	}
};

Slot.prototype.update = function() {
	if(this.game.stateManager.state === StateManager.States.PlayerTurn) {
		this.sprite.visible = true;
	}
	else {
		this.sprite.visible = false;
	}
}

module.exports = Slot;