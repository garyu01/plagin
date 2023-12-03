/*:
 * @target MZ
 * @plugindesc 戦闘中のパーティコマンドウィンドウとアクターコマンドウィンドウの位置を調整する
 * @author ChatGPT
 *
 * @param PartyCommandX
 * @text パーティコマンドウィンドウX
 * @type number
 * @desc パーティコマンドウィンドウのX座標
 * @default 0
 *
 * @param PartyCommandY
 * @text パーティコマンドウィンドウY
 * @type number
 * @desc パーティコマンドウィンドウのY座標
 * @default 0
 *
 * @param ActorCommandX
 * @text アクターコマンドウィンドウX
 * @type number
 * @desc アクターコマンドウィンドウのX座標
 * @default 0
 *
 * @param ActorCommandY
 * @text アクターコマンドウィンドウY
 * @type number
 * @desc アクターコマンドウィンドウのY座標
 * @default 0
 *
 * @help
 * このプラグインは、戦闘中のパーティコマンドウィンドウとアクターコマンドウィンドウの位置を調整します。
 * プラグインパラメータでX座標とY座標を設定してください。
 */

(() => {
    const pluginName = "BattleCommandPosition";
    const parameters = PluginManager.parameters(pluginName);

    const partyCommandX = Number(parameters['PartyCommandX'] || 0);
    const partyCommandY = Number(parameters['PartyCommandY'] || 0);
    const actorCommandX = Number(parameters['ActorCommandX'] || 0);
    const actorCommandY = Number(parameters['ActorCommandY'] || 0);

    // パーティコマンドウィンドウの位置を変更
    const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        _Scene_Battle_startPartyCommandSelection.call(this);
        this._partyCommandWindow.x = partyCommandX;
        this._partyCommandWindow.y = partyCommandY;
    };

    // アクターコマンドウィンドウの位置を変更
    const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        _Scene_Battle_startActorCommandSelection.call(this);
        this._actorCommandWindow.x = actorCommandX;
        this._actorCommandWindow.y = actorCommandY;
    };
})();