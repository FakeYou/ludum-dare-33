'use strict';

var _ = require('underscore');

var StateManager = function(game) {
	this.game = game;
	this.state = 0;

	this.listeners = [];
}

StateManager.States = {
	Begin: 0,
	PlayerTurn: 1,
	HeroesTurn: 2,
	MonsterTurn: 3,
	DungeonTransform: 4
};

StateManager.prototype.setState = function(state) {
	this.state = state;

	_.each(this.listeners, function(listener) {
		listener(this.state);
	}, this);
};

StateManager.prototype.onStateChange = function(func, context) {
	this.listeners.push(_.bind(func, context));
};

module.exports = StateManager;