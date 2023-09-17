/*:
* @plugindesc Encounter Time Based
* @author OpenAI Assistant
*
* @command setEncounterTimeRange
* @text Set encounter time range
* @desc エンカウントが発生する時間の範囲を設定
*
* @arg min
* @type number
* @min 0
* @default 600
* @text Min time
* @desc エンカウントが発生するまでの最小時間 (フレーム単位)
*
* @arg max
* @type number
* @min 0
* @default 1800
* @text Max time
* @desc エンカウントが発生するまでの最大時間 (フレーム単位)
*
* @help
* このプラグインは敵のエンカウントをタイムベースにします。
* エンカウンターの時間範囲を変更するには、プラグインコマンドを使用して時間範囲を設定。
* スクリプト:$gameSystem._nextEncounterで次のエンカウントするまでの時間を取得。
*/

(() => {
    var encounterTimeRange = [600, 1800]; // 10秒から30秒の範囲をフレーム数で表現
    var nextEncounter = 0;
    var encounterEffecting = false;

    const pluginName = 'Encounter_TimeBased';
    const encounterEffectDuration = 60; // エンカウントエフェクトのフレーム数（ここでは2秒）

    PluginManager.registerCommand(pluginName, 'setEncounterTimeRange', args => {
        encounterTimeRange = [Number(args.min), Number(args.max)];
        nextEncounter = Math.randomInt(encounterTimeRange[1] - encounterTimeRange[0]) + encounterTimeRange[0];
        $gameSystem._nextEncounter = nextEncounter;
    });

    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (!$gamePlayer.isMoving() && $dataMap.encounterList.length > 0 && !encounterEffecting) {
            if (nextEncounter <= 0) {
                var encounterList = $gameMap.encounterList();
                var encounter = encounterList[Math.floor(Math.random() * encounterList.length)].troopId;
                if ($dataTroops[encounter]) {
                    encounterEffecting = true;
                    BattleManager.setup(encounter);
                    BattleManager.onEncounter();
                    SceneManager.push(Scene_Battle);
                }
                nextEncounter = encounterEffectDuration + Math.randomInt(encounterTimeRange[1] - encounterTimeRange[0]) + encounterTimeRange[0];
            } else {
                nextEncounter--;
            }
        }
        $gameSystem._nextEncounter = nextEncounter;
    };

    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        encounterEffecting = false;
        nextEncounter = encounterEffectDuration + ($gameSystem._nextEncounter || Math.randomInt(encounterTimeRange[1] - encounterTimeRange[0]) + encounterTimeRange[0]);
        $gameSystem._nextEncounter = nextEncounter;
    };

    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.call(this);
        $gameSystem._nextEncounter = nextEncounter;
    };
})();

