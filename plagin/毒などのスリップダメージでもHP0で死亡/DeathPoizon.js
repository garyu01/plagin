/*:
 * @target MZ
 * @plugindesc 毒などのスリップダメージでもHP0で死亡させる
 */

(function() {
    'use strict';

    // オリジナルの maxSlipDamage 関数をバックアップ
    var _Game_Battler_maxSlipDamage = Game_Battler.prototype.maxSlipDamage;

    // maxSlipDamage 関数をオーバーライド
    Game_Battler.prototype.maxSlipDamage = function() {
        // スリップダメージの計算をオリジナルのメソッドを使って行う
        let originalDamage = _Game_Battler_maxSlipDamage.call(this);
        // HPが1の場合でもダメージが適用されるように、0であれば1を返す
        return Math.max(originalDamage, this.hp > 1 ? 0 : 1);
    };

})();