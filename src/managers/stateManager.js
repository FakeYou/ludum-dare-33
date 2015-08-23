'use strict';

var StateManager = function(game) {
	this.game = game;
	this.state = 0;
}

StateManager.States = {
	Begin: 0,
	PlayerTurn: 1,
	EnemyTurn: 2,
	DungeonTransform: 3
};

StateManager.prototype.setState = function(state) {
	this.state = state;
}

module.exports = StateManager;