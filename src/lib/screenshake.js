'use strict';

/**
* Plugin to make screen shake FX (makes number of short camera movements).
*
*/
Phaser.Plugin.ScreenShake = function(game, parent){
  Phaser.Plugin.call(this, game, parent);

  //settings by default
  this._settings = {
    shakesCount: 0,
    shakeX: true,
    shakeY: true,
    cameraX: 0,
    cameraY: 0,
    sensCoef: 0.5
  };
  this.timer = this.game.time.create(false);
  this.game.camera.bounds = null;

  /**
  * screen shake FX.
  */
  this._moveCamera = function(){
    if(this._settings.shakesCount > 0){
      var sens = this._settings.shakesCount * this._settings.sensCoef;
      this._settings.sensCoef += this._settings.sensCoef / 10;

      if(this._settings.shakesCount % 2 === 0){
        this.game.camera.x = this._settings.cameraX + (this._settings.shakeX ? sens : 0);
        this.game.camera.y = this._settings.cameraY + (this._settings.shakeY ? sens : 0);
      }
      else{
        this.game.camera.x = this._settings.cameraX - (this._settings.shakeX ? sens : 0);
        this.game.camera.y = this._settings.cameraY - (this._settings.shakeY ? sens : 0);
      }

      this._settings.shakesCount--;

      if(this._settings.shakesCount === 0){
        this.timer.removeAll();
        this.game.camera.setPosition(0, 0);
      }
    }
  };
};

Phaser.Plugin.ScreenShake.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.ScreenShake.prototype.constructor = Phaser.Plugin.ScreenShake;


/**
* Change default settings object values with passed object value.
*
* @method Phaser.Plugin.ScreenShake#setup
* @param {object} [obj] - Passed object to merge
*/
Phaser.Plugin.ScreenShake.prototype.setup = function(obj){
  this._settings = Phaser.Utils.extend(false, this._settings, obj);
};


/**
* Pass value of count shakes.
*
* @method Phaser.Plugin.ScreenShake#shake
* @param {number} [count] - Value of count shakes
*/
Phaser.Plugin.ScreenShake.prototype.shake = function(count, speed, sensCoef){
  this.timer.removeAll();
  this.timer.loop(speed, this._moveCamera, this);
  this.timer.start();

  this._settings.cameraX = this.game.camera.x;
  this._settings.cameraY = this.game.camera.y;
  this._settings.shakesCount = count;
  this._settings.sensCoef = sensCoef;
};

Phaser.Plugin.ScreenShake.prototype.update = function(){
  // this._moveCamera();
};