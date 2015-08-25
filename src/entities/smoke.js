'use strict';

var _ = require('underscore');

var Smoke = function(game, group, x, y) {
	var sprite = game.add.sprite(x, y, 'dungeon', 74);
	sprite.visible = false;
	group.add(sprite);

 	var speed = Math.random() * 2 + 0.5;
	var start = Math.random() * 10;
	var direction = [-1, 1][Math.round(Math.random())];
	var sideway = Math.random() * 10 + 10;
	var damping = Math.random() * 4 + 3;

	sprite.tint = _.sample([0xcedcd6, 0xffffff, 0xb0cec3]);

	var animation = sprite.animations.add('dissipate', [77, 75, 74, 75, 76, 77, 0], speed, false);

	sprite.update = function() {
		start += 1;

		if(start > 15 && !sprite.visible) {
			sprite.visible = true;
			sprite.animations.play('dissipate', speed, false);
		}

		this.x += (Math.sin(start / sideway) / damping) * direction;
		this.y -= 0.1;

		if(start > 1000) {
			sprite.destroy();
		}
	}
};

module.exports = Smoke;