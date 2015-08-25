'use strict';

var _ = require('underscore');

var Hero = function(game, group, heroInfo, x, y) {
	this.game = game;

	this.heroInfo = heroInfo;
	this.busy = false;
	this.attacking = false;
  this.health = heroInfo.health;

  this.timer = this.game.time.create(false);

	this.sprite = game.add.sprite(x * 32, y * 32, 'dungeon', heroInfo.defaultTileIndex);
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.name = heroInfo.name;
	this.sprite.body.immovable = true;
	this.sprite.hero = this;

	this.tileX = this.sprite.tileX = x;
	this.tileY = this.sprite.tileY = y;
	
	group.add(this.sprite);
};

Hero.prototype.update = function() {
	if(!this.attacking && this.health > 0) {
		game.physics.arcade.overlap(this.sprite, this.game.monsterManager.group, this.onCollision, null, this);
	}
};

Hero.prototype.turn = function(n) {
	var self = this;

	this.tileX = this.sprite.tileX = Math.round(this.sprite.x / 32);
	this.tileY = this.sprite.tileY = Math.round(this.sprite.y / 32);

	this.timer.removeAll();
	this.busy = true;

	if(!this.target) {
		var treasure = this.game.heroManager.closestTreasure(this);

		if(treasure) {
			this.target = { x: treasure.tileX, y: treasure.tileY };
		}
	}

	var numSteps = this.heroInfo.numSteps;
	var speed = this.heroInfo.speed;

	this.game.pathManager.findPath(this.tileX, this.tileY, this.target.x, this.target.y, function(path) {
		if(path && path.length > 0) {

			var steps = path.splice(1, numSteps);

			self.tileX = self.sprite.tileX = steps[steps.length - 1].x;
			self.tileY = self.sprite.tileY = steps[steps.length - 1].y;

			self.tween = self.game.add.tween(self.sprite)
			self.tween.to({}, speed * n, Phaser.Easing.Linear.None);

			_.each(steps, function(step) {
				self.tween.to({ x: step.x * 32, y: step.y * 32 }, speed, Phaser.Easing.Linear.None)
			});

			self.tween.to({}, speed * 2, Phaser.Easing.Linear.None);
			self.tween.onComplete.add(self.finished, self);
			self.tween.start();
		}
		else {
			self.target = null;
			self.finished();
		}
	});
};

Hero.prototype.onCollision = function(sprite, monster) {
	this.startAttack(monster.monster);
};

Hero.prototype.startAttack = function(enemy) {
	this.attacking = true;
	this.enemy = enemy;

	if(this.tween) {
		this.tween.pause();
	}

	var attack = this.timer.loop(this.heroInfo.attackSpeed, function() {
		var isAlive = this.enemy.receiveDamage(this.heroInfo.strength);

		if(!isAlive) {
			this.stopAttack();
		}
	}, this);
	
	this.timer.start();
};

Hero.prototype.stopAttack = function() {
		if(this.tween) {
			this.tween.resume();
		}

		this.attacking = false;
		this.enemy = null;

		this.timer.stop(true);
		this.finished();
}

Hero.prototype.finished = function() {
	this.busy = false;
};

Hero.prototype.receiveDamage = function(strength) {
	var damage = strength * strength / this.heroInfo.defence;

	this.health -= damage;

	if(this.health <= 0) {
		this.health = 0;
		this.sprite.destroy();
		this.stopAttack();
		this.game.dungeonManager._smoke(this.sprite.x, this.sprite.y, 3);
	}

	return this.health > 0;
};

module.exports = Hero;