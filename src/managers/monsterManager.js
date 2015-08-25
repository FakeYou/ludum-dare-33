'use strict';

var _ = require('underscore');
var StateManager = require('./stateManager');
var Monster = require('../entities/monster');

var MonsterManager = function(game) {
	this.game = game;

	this.group = game.add.group();
	this.group.z = 2;
	this.group.pivot.x = this.game.dungeonManager.width * 32 / 2;
	this.group.pivot.y = this.game.dungeonManager.height * 32 / 2;
	this.group.x = (this.game.camera.width - 300) / 2;
	this.group.y = this.game.camera.height / 2;

	this.group.enableBody = true;
	this.group.physicsBodyType = Phaser.Physics.ARCADE;

	this.monsters = [];

	this.game.stateManager.onStateChange(this.onStateChange, this);
};

MonsterManager.Monsters = {
	spider: {
		name: 'spider',
		defaultTileIndex: 69,
		numSteps: 7,
		speed: 300,
		attackSpeed: 300,
		health: 10,
		strength: 8,
		defence: 6
	}
};

MonsterManager.prototype.update = function() {
	if(this.game.stateManager.state === StateManager.States.HeroesTurn ||
		this.game.stateManager.state === StateManager.States.MonsterTurn) {
		_.invoke(this.monsters, 'update');
	}

	if(this.game.stateManager.state === StateManager.States.MonsterTurn) {
		if(!_.some(_.pluck(this.monsters, 'busy'))) {
			this.game.stateManager.setState(StateManager.States.PlayerTurn);
		}
	}
};

MonsterManager.prototype.onStateChange = function(state) {
	if(state !== StateManager.States.MonsterTurn) {
		return;
	}

	// remove dead monsters
	this.monsters = _.filter(this.monsters, function(monster) { return monster.health > 0; });

	this.heroes = this.game.heroManager.heroes;

	if(this.monsters.length < 2) {
		var spawn = _.sample(this.game.dungeonManager.getTilesByName('floor'));

		var monster = new Monster(
			this.game,
			this.group,
			MonsterManager.Monsters.spider,
			spawn.tileX,
			spawn.tileY
		);

		this.monsters.push(monster);
	}

	_.each(this.monsters, function(monster, n) {
		monster.turn(n);
	});
};

MonsterManager.prototype.closestHero = function(monster) {
	var closestDistance = Infinity;
	var closest;

	_.each(this.heroes, function(hero) {
		var distance = Math.abs(monster.tileX, hero.tileX) + Math.abs(monster.tileY, hero.tileY);

		if(distance < closestDistance) {
			closest = hero;
		}
	});

	return closest;
};

module.exports = MonsterManager;
