//敵選択ウィンドウ表示中もアクターステータスウィンドウを表示し続ける
(function() {


    // 敵選択の開始時にステータスウィンドウを非表示にしないようにオーバーライド
    const _Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;
    Scene_Battle.prototype.startEnemySelection = function() {
        _Scene_Battle_startEnemySelection.call(this);
        this._statusWindow.show(); // ステータスウィンドウを表示し続ける
    };

    // 敵が選択された際の処理をオーバーライド
    const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function() {
        _Scene_Battle_onEnemyOk.call(this);
        this._statusWindow.show();
    };

    // 敵選択がキャンセルされた際の処理をオーバーライド
    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        _Scene_Battle_onEnemyCancel.call(this);
        this._statusWindow.show();
    };
})();
