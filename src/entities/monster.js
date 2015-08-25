'use strict';

var _ = require('underscore');

var Monster = function(game, group, monsterInfo, x, y) {
	this.game = game;

	this.monsterInfo = monsterInfo;
	this.busy = false;
	this.attacking = false;
  this.health = monsterInfo.health;

	this.timer = this.game.time.create(false);

	this.sprite = game.add.sprite(x * 32, y * 32, 'dungeon', monsterInfo.defaultTileIndex);
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.name = monsterInfo.name;
	this.sprite.body.immovable = true;
	this.sprite.monster = this;

	this.tileX = this.sprite.tileX = x;
	this.tileY = this.sprite.tileY = y;
	
	group.add(this.sprite);
};

Monster.prototype.update = function() {
	if(!this.attacking && this.health > 0) {
		game.physics.arcade.overlap(this.sprite, this.game.heroManager.group, this.onCollision, null, this);
	}
};

Monster.prototype.turn = function(n) {
	var self = this;

	this.tileX = this.sprite.tileX = Math.round(this.sprite.x / 32);
	this.tileY = this.sprite.tileY = Math.round(this.sprite.y / 32);

	this.timer.removeAll();
	this.busy = true;

	var hero = this.game.monsterManager.closestHero(this);

	if(hero) {
		this.target = { x: hero.tileX, y: hero.tileY };
	}

	var numSteps = this.monsterInfo.numSteps;
	var speed = this.monsterInfo.speed;

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

Monster.prototype.onCollision = function(sprite, hero) {
	this.startAttack(hero.hero);
};

Monster.prototype.startAttack = function(enemy) {
	this.attacking = true;
	this.enemy = enemy;

	if(this.tween) {
		this.tween.pause();
	}

	var attack = this.timer.loop(this.monsterInfo.attackSpeed, function() {
		var isAlive = this.enemy.receiveDamage(this.monsterInfo.strength);

		if(!isAlive) {
			this.stopAttack();
		}
	}, this);
	
	this.timer.start();
};

Monster.prototype.stopAttack = function() {
	if(this.tween) {
		this.tween.resume();
	}

	this.attacking = false;
	this.enemy = null;

	this.timer.stop(true);
	this.finished();
}

Monster.prototype.finished = function() {
	this.busy = false;
};

Monster.prototype.receiveDamage = function(strength) {
	var damage = strength * strength / this.monsterInfo.defence;

	this.health -= damage;

	if(this.health <= 0) {
		this.health = 0;
		this.sprite.destroy();
		this.stopAttack();
		this.game.dungeonManager._smoke(this.sprite.x, this.sprite.y, 3);
	}

	return this.health > 0;
};


module.exports = Monster;