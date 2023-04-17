/*:
 * @target MZ
 * @plugindesc 戦闘アニメーションの強制終了
 * @author YourName
 *
 * @help
 * 戦闘アニメーションの強制終了
 * $gameTemp.setForceEndBattleAnimation(true);
 */

(() => {
  'use strict';

  const resetDelay = 30; // フレーム単位での遅延

  const _Sprite_Animation_update = Sprite_Animation.prototype.update;
  Sprite_Animation.prototype.update = function () {
    if (this.forceEndBattleAnimation() && this._playing) {
      this.visible = false;
      if (this._frames) {
        this._frameIndex = this._frames.length;
        this.updateAnimationFrame();
        this._playing = false;
        this._delay = 0;
      }
      if (!$gameTemp.resetDelay) {
        $gameTemp.resetDelay = resetDelay;
      }
    }
    _Sprite_Animation_update.call(this);
  };

  const _Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function () {
    _Scene_Base_update.call(this);
    $gameTemp.update();
  };

  Game_Temp.prototype.update = function () {
    if (this.resetDelay > 0) {
      this.resetDelay--;
      if (this.resetDelay === 0) {
        this.setForceEndBattleAnimation(false);
      }
    }
  };

  Sprite_Animation.prototype.forceEndBattleAnimation = function () {
    return $gameTemp.forceEndBattleAnimation;
  };

  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this.forceEndBattleAnimation = false;
    this.resetDelay = 0;
  };

  Game_Temp.prototype.setForceEndBattleAnimation = function (value) {
    this.forceEndBattleAnimation = value;
  };
})();
