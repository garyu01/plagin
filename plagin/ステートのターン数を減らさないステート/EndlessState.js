/*:
 * @target MZ
 * @plugindesc ステートターン数が特定のステートに影響されている間は減らないようにする
 * @author ChatGPT
 *
 * @param targetStateId
 * @text 無効化するステートID
 * @type state
 * @desc ステートターンを減らさないために影響するステートのIDを設定します。
 * @default 1
 *
 * @help
 * このプラグインは、特定のステートが適用されている間、そのバトラーの
 * すべてのステートのターン数が減少しないようにします。
 */

(() => {
    const parameters = PluginManager.parameters('EndlessState');
    const targetStateId = Number(parameters['targetStateId'] || 1);

    // Game_Battler クラスの updateStateTurns メソッドを上書き
    const originalUpdateStateTurns = Game_Battler.prototype.updateStateTurns;
    Game_Battler.prototype.updateStateTurns = function() {
        if (this.isStateAffected(targetStateId)) {
            return;  // 指定されたステートに影響されている場合は、ターン更新をスキップ
        }
        originalUpdateStateTurns.call(this);  // それ以外の場合は、元の処理を実行
    };
})();
