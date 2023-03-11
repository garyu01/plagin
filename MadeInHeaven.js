//=============================================================================
// MadeInHeaven.js
//=============================================================================

/*:
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:
 * @plugindesc 演出用 (YEP_BattleEngineCore Add-ons) 
 * @author garyu
 * 
 * @help アクターステート（12）のみ
 * スクリプト
 * BattleManager.madeInHeavenStart();
 * BattleManager.madeInHeavenStop();
 * 
 */

(function() {

//////////////////////////////////////////////////////////////////////////////////////////////
  BattleManager.isMadeInHeaven = function() {
    return this._madeInHeaven;
  };

  BattleManager.madeInHeavenStart = function() {
    this._madeInHeaven = true;
  };

  BattleManager.madeInHeavenStop = function(){
    this._madeInHeaven = false;
  };

　Scene_Battle.prototype.MadeInHeavenStart = function(){
　　BattleManager.madeInHeavenStart();

　};

　Scene_Battle.prototype.MadeInHeavenStop = function(){
　　BattleManager.madeInHeavenStop();

　};


　var Window_BattleLog_updateWaitCount = Window_BattleLog.prototype.updateWaitCount;
　Window_BattleLog.prototype.updateWaitCount = function() {
　　if (BattleManager.isMadeInHeaven() && this._waitCount > 0){
　　　　　this._waitCount = 1;
　　}	
　　　　　return Window_BattleLog_updateWaitCount.call(this);
　};

　var Window_BattleLog_updateWaitMode = Window_BattleLog.prototype.updateWaitMode;
　Window_BattleLog.prototype.updateWaitMode = function() {
　　if (BattleManager.isMadeInHeaven() && this._waitMode === 'effect') {
	　this._waitMode = '';
	　return false;
　　}
　　　　　return Window_BattleLog_updateWaitMode.call(this);
　};


        var Sprite_Battler_updateMove = Sprite_Battler.prototype.updateMove;
        Sprite_Battler.prototype.updateMove = function(x, y, duration) {
         let battler = this._actor; 
        if (BattleManager.isMadeInHeaven() && battler && battler.isStateAffected(12)){
                duration = 4;
        }
                Sprite_Battler_updateMove.call(this,x,y,duration);
        };


	var Sprite_Battler_startMove = Sprite_Battler.prototype.startMove;
	Sprite_Battler.prototype.startMove = function(x, y, duration) {
            	let battler = this._actor; 
        if (BattleManager.isMadeInHeaven() && battler && battler.isStateAffected(12)){
    		duration = 4;
    	}
    	        Sprite_Battler_startMove.call(this,x,y,duration);
	};




 var _Sprite_Actor_motionSpeed = Sprite_Actor.prototype.motionSpeed;
Sprite_Actor.prototype.motionSpeed = function() {
      let battler = this._actor;
      if (BattleManager.isMadeInHeaven() && battler && battler.isStateAffected(12)){
    	    return 2;
    	} else {
          return _Sprite_Actor_motionSpeed.call(this);
      }
};

////framesを任意の値に変更////////////
if (Imported.YEP_X_ActSeqPack2) {

BattleManager.actionMove = function(name, actionArgs) {

    if (!$gameSystem.isSideView()) return true;
    var movers = this.makeActionTargets(name);
    if (movers.length < 1) return true;
    var cmd = actionArgs[0].toUpperCase();
    if (['HOME', 'ORIGIN'].contains(cmd)) {
      var frames = actionArgs[1] || 12;
      movers.forEach(function(mover) {
      if (BattleManager.isMadeInHeaven()) {
        mover.battler().startMove(0, 0, 60);
      } else {
        mover.battler().startMove(0, 0, frames);
      }
        mover.requestMotion('walk');
        mover.spriteFaceHome();
      });
    } else if (['RETURN'].contains(cmd)) {
      var frames = actionArgs[1] || 12;
      movers.forEach(function(mover) {
        mover.battler().startMove(0, 0, frames);
        mover.requestMotion('evade');
        mover.spriteFaceForward();
      });
    } else if (['FORWARD', 'FORWARDS', 'BACKWARD',
    'BACKWARDS'].contains(cmd)) {
      var distance = actionArgs[1] || Yanfly.Param.BECStepDist;
      if (['BACKWARD', 'BACKWARDS'].contains(cmd)) distance *= -1;
      var frames = actionArgs[2] || 12;
      movers.forEach(function(mover) {
        mover.battler().moveForward(distance, frames);
        mover.requestMotion('walk');
        if (['FORWARD', 'FORWARDS'].contains(cmd)) {
          mover.spriteFaceForward();
        } else {
          mover.spriteFaceBackward();
        }
      });
    } else if (['POINT', 'POSITION', 'COORDINATE', 'SCREEN', 'SCREEN POS',
    'COORDINATES'].contains(cmd)) {
      var destX = eval(actionArgs[1]) || 0;
      var destY = eval(actionArgs[2]) || 0;
      var frames = actionArgs[3] || 12;
      movers.forEach(function(mover) {
        var offsetX = BattleManager.actionMoveOffsetX(actionArgs, mover, mover);
        var offsetY = BattleManager.actionMoveOffsetY(actionArgs, mover, mover);
        mover.battler().moveToPoint(destX + offsetX, destY + offsetY, frames);
        mover.requestMotion('walk');
        mover.spriteFacePoint(destX, destY);
      });
    } else {
      var targets = this.makeActionTargets(actionArgs[0]);
      var frames = actionArgs[2] || 12;
      var type = actionArgs[1].toUpperCase();
      if (targets.length < 1) return false;
      for (var i = 0; i < movers.length; ++i) {
      	var mover = movers[i];
      	if (!mover) continue;
      	if (['BASE', 'FOOT', 'FEET'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'center');
	        var destY = this.actionMoveY(mover, targets, 'foot');
	      } else if (['CENTER', 'MIDDLE'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'center');
	        var destY = this.actionMoveY(mover, targets, 'center');
	      } else if (['HEAD', 'TOP'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'center');
	        var destY = this.actionMoveY(mover, targets, 'head');
	      } else if (['FRONT BASE', 'FRONT FOOT', 'FRONT FEET',
	      'FRONT'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'front');
	        var destY = this.actionMoveY(mover, targets, 'foot');
	      } else if (['BACK BASE', 'BACK FOOT', 'BACK FEET',
	      'BACK'].contains(type)) {
	      	var destX = this.actionMoveX(mover, targets, 'back');
	        var destY = this.actionMoveY(mover, targets, 'foot');
	      } else if (['FRONT CENTER', 'FRONT MIDDLE'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'front');
	        var destY = this.actionMoveY(mover, targets, 'center');
	      } else if (['BACK CENTER', 'BACK MIDDLE',].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'back');
	        var destY = this.actionMoveY(mover, targets, 'center');
	      } else if (['FRONT HEAD', 'FRONT TOP'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'front');
	        var destY = this.actionMoveY(mover, targets, 'head');
	      } else if (['BACK HEAD', 'BACK TOP'].contains(type)) {
	        var destX = this.actionMoveX(mover, targets, 'back');
	        var destY = this.actionMoveY(mover, targets, 'head');
	      }
        var offsetX = this.actionMoveOffsetX(actionArgs, mover, targets[0]);
        var offsetY = this.actionMoveOffsetY(actionArgs, mover, targets[0]);


 	if (BattleManager.isMadeInHeaven()) {
           	    mover.battler().moveToPoint(destX + offsetX, destY + offsetY, 64);
        mover.spriteFacePoint(destX, destY);
 
        } else {
                    mover.battler().moveToPoint(destX + offsetX, destY + offsetY, frames);
        mover.spriteFacePoint(destX, destY);
        }

      }
    }
    return true;

};

}
  var Sprite_Animation_setupRate = Sprite_Animation.prototype.setupRate;
  Sprite_Animation.prototype.setupRate = function() {
    if (BattleManager.isMadeInHeaven()) {
       this._rate = 1;
    }else{
	 Sprite_Animation_setupRate.call(this);
    }
  };

  ///////////ゲーム内変数でアニメーション速度を変更///////////////
  //var Sprite_Animation_setupRate = Sprite_Animation.prototype.setupRate;
  //Sprite_Animation.prototype.setupRate = function() {
  //  if (BattleManager.isMadeInHeaven()) {
  //    if ($gameVariables.value(2)) == 6
  //     this._rate = 3;
  //    }
  //    if ($gameVariables.value(2).clamp(4,5) == $gameVariables.value(2)) {
  //     this._rate = 2;
  //    }
  //    if ($gameVariables.value(2).clamp(1,3) == $gameVariables.value(2)) {
  //     this._rate = 1;
  //    }
  //  }else{
  //     Sprite_Animation_setupRate.call(this);
  //  }
  //};
  /////////////////////////////////////////////////////////////////

	var Spriteset_Battle_isBusy = Spriteset_Battle.prototype.isBusy;
	Spriteset_Battle.prototype.isBusy = function() {
	     if (BattleManager.isMadeInHeaven()){
    	         return false
	     } else {
    	         return Spriteset_Battle_isBusy.call(this);
	     }
	};

})();
