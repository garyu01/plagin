/*:
@plugindesc
ザ・ワールド用

@help
ステート431、430のみ
YEP_BattleEngineCore and YEP_X_VisualStateFX Add-ons
*/
/////////startTurn///////////////////////////////////////////////////////
BattleManager.startTurn = function() {
    this._enteredEndPhase = false;
    this._phase = 'turn';
    this.clearActor();
 if (!$gameActors.actor(1).isStateAffected(430)) { 
    $gameTroop.increaseTurn();
 }
    $gameParty.onTurnStart();
    $gameTroop.onTurnStart();
    this._performedBattlers = [];
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
    this._subject = this.getNextSubject();
};
////////////////rpg_sprites/StateOverlay/////////////////////////////////////////
var Sprite_StateOverlay_prototype_animationWait = Sprite_StateOverlay.prototype.animationWait;
Sprite_StateOverlay.prototype.animationWait = function() {
        Sprite_StateOverlay_prototype_animationWait.call(this);
        let battler = this._battler;
        if (battler && !battler.isStateAffected(431)) { 
         return 8;
        }
};
///////////////YEP_X_VisualStateFX/StateAnimation///////////////////////////////
Sprite_StateAnimation.prototype.update = function() {
  Sprite_Animation.prototype.update.call(this);
  if (this._animation) {
   let battler = this._battler;
   if (battler && !battler.isStateAffected(431)) { 
    this.updateLoop();
   }
  } else {
    this.opacity = 0;
  }
};
/////////////////rpg_sprites/StateIcon//////////////////////////////////////////
Sprite_StateIcon.prototype.animationWait = function() {
   let battler = this._battler;
 if (battler && !battler.isStateAffected(431)) { 
    return 40;
 }
};
////////////////Game_Battler////////////////////////////////////////////////////////
var _Game_Battler_prototype_regenerateAll = Game_Battler.prototype.regenerateAll;
Game_Battler.prototype.regenerateAll = function() {
    if (!this.isStateAffected(431)) {
        _Game_Battler_prototype_regenerateAll.call(this);
    }
};
var _Game_Battler_requestMotion = Game_Battler.prototype.requestMotion;
Game_Battler.prototype.requestMotion = function(motionType) {
    if (!this.isStateAffected(431)) {
      _Game_Battler_requestMotion.call(this, motionType);
    }
};
var _Game_Battler_clearMotion = Game_Battler.prototype.clearMotion;
Game_Battler.prototype.clearMotion = function() {
    if (!this.isStateAffected(431)) {
     _Game_Battler_clearMotion.call(this);
    }
};
Sprite_Actor_updateMotion = Sprite_Actor.prototype.updateMotion;
Sprite_Actor.prototype.updateMotion = function() {
	let battler = this._actor;
	if (battler && !battler.isStateAffected(431)) {
          Sprite_Actor_updateMotion.call(this);
        }
};
Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
Sprite_Actor.prototype.startMotion = function(motionType) {
	let battler = this._actor;
	if (battler && !battler.isStateAffected(431)) {
           Sprite_Actor_startMotion.call(this, motionType);
        }
};
