/*:
 * @target MZ
 * @plugindesc MISSエフェクト
 * @author 
 * @help 
 * MISSエフェクト
 */


(function() { 
Sprite_Damage.prototype.setup = function(target) {
    const result = target.result();

    if ($gameActors.actor(1).weapons().some(weapon => [1, 2, 3, 4, 5].contains(weapon.id)) && result.missed || $gameActors.actor(1).weapons().some(weapon => [1, 2, 3, 4, 5].contains(weapon.id)) && result.evaded) {
    if (BattleManager._subject._actorId === 1) {
     $gameVariables.setValue(111,Math.floor(Math.random() * 4))
     if ($gameVariables.value(111) == 0) {
       $gameTemp.requestAnimation([target], 44);
     }
     if ($gameVariables.value(111) == 1) {
       $gameTemp.requestAnimation([target], 45);
     }
     if ($gameVariables.value(111) == 2) {
       $gameTemp.requestAnimation([target], 46);
     }
     if ($gameVariables.value(111) == 3) {
       $gameTemp.requestAnimation([target], 47);
     }

    }
        this._colorType = 0;
        this.createMiss();
    } else if (result.hpAffected) {
        this._colorType = result.hpDamage >= 0 ? 0 : 1;
        this.createDigits(result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this._colorType = result.mpDamage >= 0 ? 2 : 3;
        this.createDigits(result.mpDamage);
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};


})(); 