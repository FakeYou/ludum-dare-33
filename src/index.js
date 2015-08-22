'use strict';

console.log('start');

var preload = require('./preload');
var DungeonManager = require('./managers/dungeonManager');

var config = {
	preload: preload,
	create: create,
	update: update,
	render: render
}

var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'ludum-dare-33', config)
window.game = game;

var map;
var layer;
var dungeonManager;

function create() {

	game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);

	dungeonManager = new DungeonManager(game);
	dungeonManager.generate(8, 8);
	console.log(dungeonManager);

}

function update() {

	dungeonManager.update()
;
	// console.log('update');
}

function render() {
	// console.log('render');
}