'use strict';

var _ = require('underscore');
var StateManager = require('./stateManager');
var Hero = require('../entities/hero');

var HeroManager = function(game) {
	this.game = game;

	this.group = game.add.group();
	this.group.z = 2;
	this.group.pivot.x = this.game.dungeonManager.width * 32 / 2;
	this.group.pivot.y = this.game.dungeonManager.height * 32 / 2;
	this.group.x = (this.game.camera.width - 300) / 2;
	this.group.y = this.game.camera.height / 2;

	this.group.enableBody = true;
	this.group.physicsBodyType = Phaser.Physics.ARCADE;

	this.entrances = [];
	this.treasures = [];
	this.heroes = [];

	this.game.stateManager.onStateChange(this.onStateChange, this);
};

HeroManager.Heroes = {
	paladin: {
		name: 'paladin',
		defaultTileIndex: 68,
		numSteps: 2,
		speed: 1000,
		attackSpeed: 1000,
		health: 30,
		strength: 10,
		defence: 15
	}
};

HeroManager.prototype.update = function() {
	if(this.game.stateManager.state === StateManager.States.HeroesTurn ||
		this.game.stateManager.state === StateManager.States.MonsterTurn) {
		_.invoke(this.heroes, 'update');
	}

	if(this.game.stateManager.state === StateManager.States.HeroesTurn) {
		if(!_.some(_.pluck(this.heroes, 'busy'))) {
			this.game.stateManager.setState(StateManager.States.MonsterTurn);
		}
	}	
};

HeroManager.prototype.onStateChange = function(state) {
	if(state !== StateManager.States.HeroesTurn) {
		return;
	}

	// remove dead heroes
	this.heroes = _.filter(this.heroes, function(hero) { return hero.health > 0; });

	this.entrances = this.game.dungeonManager.getTilesByName('entrance');
	this.treasures = this.game.dungeonManager.getTilesByName('treasure');

	if(this.heroes.length === 0) {
		var entrance = _.sample(this.entrances);

		var hero = new Hero(
			this.game, 
			this.group, 
			HeroManager.Heroes.paladin, 
			entrance.tileX, 
			entrance.tileY
		);

		this.heroes.push(hero);
	}

	_.each(this.heroes, function(hero, n) {
		hero.turn(n);
	});
};

HeroManager.prototype.closestTreasure = function(hero) {
	var closestDistance = Infinity;
	var closest;

	_.each(this.treasures, function(treasure) {
		var distance = Math.abs(hero.tileX, treasure.tileX) + Math.abs(hero.tileY, treasure.tileY);

		if(distance < closestDistance) {
			closest = treasure
		}
	});

	return closest;
};

module.exports = HeroManager;