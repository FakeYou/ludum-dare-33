'use strict';

console.log('start');

var preload = require('./preload');
var DungeonManager = require('./managers/dungeonManager');
var StateManager = require('./managers/stateManager');

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

	game.stateManager = new StateManager(game);

	game.dungeonManager = new DungeonManager(game);
	game.dungeonManager.generate(8, 8);

	game.stateManager.setState(StateManager.States.PlayerTurn);
	console.log(game.dungeonManager);

}

function update() {

	// console.log('update');
}

function render() {
	// console.log('render');
}