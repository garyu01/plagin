/*:
 * @target MZ
 * @plugindesc 特定の条件でMISSアニメーションを表示するプラグイン
 *
 * @param TriggerWeapons
 * @text トリガー武器ID
 * @desc MISSアニメーションがトリガーされる武器ID
 * @type number[]
 * @default ["1","2","3","4","5"]
 * 
 * @param TriggerWeapons2
 * @text トリガー武器ID2
 * @desc 2番目の条件でMISSアニメーションがトリガーされる武器ID
 * @type number[]
 * @default ["6","7","8","9","10"]
 */

(function() { 
    const parameters = PluginManager.parameters('MISS_effect');
    const triggerWeapons = JSON.parse(parameters['TriggerWeapons']).map(Number);
    const triggerWeapons2 = JSON.parse(parameters['TriggerWeapons2']).map(Number);

    function isValidTargetIndex() {
        const subject = BattleManager._subject;
        const index = subject?._lastTargetIndex;
        const members = $gameTroop.members();
        return subject && index >= 0 && index < members.length && members[index].isEnemy() && members[index].enemyId() !== 20;
    }

    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        if (isValidTargetIndex()) {
            const actorWeapons = $gameActors.actor(1).weapons();
            const missedOrEvaded = result.missed || result.evaded;
            const triggerAnimation = (weaponIds, animations) => {
                if (actorWeapons.some(weapon => weaponIds.includes(weapon.id)) && missedOrEvaded) {
                    if (BattleManager._subject._actorId === 1) {
                        const animationId = animations[Math.floor(Math.random() * animations.length)];
                        $gameTemp.requestAnimation([target], animationId);
                    }
                }
            };

            // 1番目のトリガー条件
            triggerAnimation(triggerWeapons, [44, 45, 46, 47]);

            // 2番目のトリガー条件
            triggerAnimation(triggerWeapons2, [67, 68, 67, 68]);

            if (result.hpAffected) {
                this._colorType = result.hpDamage >= 0 ? 0 : 1;
                this.createDigits(result.hpDamage);
            } else if (target.isAlive() && result.mpDamage !== 0) {
                this._colorType = result.mpDamage >= 0 ? 2 : 3;
                this.createDigits(result.mpDamage);
            }
            if (result.critical) {
                this.setupCriticalEffect();
            }
        }
    };
})();
