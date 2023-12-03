/*:
 * @target MZ
 * @plugindesc 戦闘中にアクターステータスウィンドウとアクターコマンドウィンドウを非アクティブにする。
 * @author [あなたの名前]
 *
 * @help KeepBattleWindow.js
 *
 * このプラグインは戦闘中にアクターコマンドウィンドウが常に表示されるようにし、
 * アクターステータスウィンドウも右に動かないようにします。
 */

(function() {
    // Window_BattleStatusのupdateメソッドをオーバーライド
    const _Window_BattleStatus_update = Window_BattleStatus.prototype.update;
    Window_BattleStatus.prototype.update = function() {
        _Window_BattleStatus_update.call(this);
        this.x = 0; // ステータスウィンドウのX座標を固定
    };

    Scene_Battle.prototype.closeCommandWindows = function() {
        this._partyCommandWindow.deactivate();
        this._actorCommandWindow.deactivate();
    };

    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
        if ($gameMessage.isBusy()) {
        } else if (this.shouldOpenStatusWindow()) {
            this._statusWindow.open();
        }
        this.updateStatusWindowPosition();
    };

    Scene_Battle.prototype.stop = function() {
        Scene_Message.prototype.stop.call(this);
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else {
            this.startFadeOut(this.fadeSpeed(), false);
        }

    };
})();

