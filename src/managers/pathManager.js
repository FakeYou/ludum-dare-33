'use strict';

var EasyStar = require('easystarjs');

var PathManager = function(game) {
	this.easystar = new EasyStar.js();

	// this.easystar.enableDiagonals();
	// this.easystar.enableCornerCutting(false);

	this.easystar.setAcceptableTiles([1, 3, 4]);

	this.game = game;
};

PathManager.prototype.setGrid = function(grid) {
	this.easystar.setGrid(grid);
};

PathManager.prototype.findPath = function(x1, y1, x2, y2, cb) {
	this.easystar.findPath(x1, y1, x2, y2, cb);
	this.easystar.calculate();
}

module.exports = PathManager;