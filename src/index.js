'use strict';

console.log('start');

var preload = require('./preload');
var DungeonManager = require('./managers/dungeonManager');
var StateManager = require('./managers/stateManager');
var PathManager = require('./managers/pathManager');
var BuildManager = require('./managers/buildManager');
var HeroManager = require('./managers/heroManager');
var MonsterManager = require('./managers/monsterManager');
var TileManager = require('./managers/tileManager');

var config = {
	preload: preload,
	create: create,
	update: update,
	render: render
}

var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'ludum-dare-33', config);
window.game = game;

var map;
var layer;
var dungeonManager;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);

	game.stateManager = new StateManager(game);
	game.pathManager = new PathManager(game);
	game.tileManager = new TileManager(game);

	game.dungeonManager = new DungeonManager(game);
	game.dungeonManager.generate();

	// game.heroManager = new HeroManager(game);
	// game.monsterManager = new MonsterManager(game);

	// game.buildManager = new BuildManager(game);

	game.stateManager.setState(StateManager.States.PlayerTurn);

	setTimeout(function() {
		game.world.children.sort(function(child) {
			return -child.z;
		});
	}, 500);
}

function update() {
	// game.monsterManager.update();
	// game.heroManager.update();

	game.world.sort('z', Phaser.Group.SORT_ASCENDING);

	// console.log('update');
}

function render() {
	// console.log('render');
}