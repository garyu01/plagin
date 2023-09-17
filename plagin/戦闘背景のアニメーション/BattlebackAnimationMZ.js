/*:
* @plugindesc Battle Background Animation
* @author YourName
*
* @help このプラグインは、戦闘背景にスプライトシートベースのアニメーションを提供します。
* 変数106にBattleback1を指定。変数107にBattleback2を指定
* 戦闘背景のアニメーションを使わずデフォルトに戻すときは変数106、107ともに値を0にする
* FRAME_DURATION1 = 60 / 10;で1フレーム0.6秒。1秒にしたいなら600 / 10に変更
*/

(() => {
    const FRAME_COUNT1 = 3;
    const FRAME_COUNT2 = 4;
    const FRAME_DURATION1 = 60 / 10; // change to fit your need for Battleback1
    const FRAME_DURATION2 = 430 / 10; // change to fit your need for Battleback2
    const FRAME_WIDTH = 1140; // フレーム幅に合わせて変更

    let frameIndex1 = 0;
    let frameIndex2 = 0;
    let frameElapsedTime1 = 0;
    let frameElapsedTime2 = 0;

    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);

        // If the variable is 0, use the default battleback
        if ($gameVariables.value(106) != 0) {
            this._back1Sprite.bitmap = ImageManager.loadBattleback1($gameVariables.value(106));
        }

        if ($gameVariables.value(107) != 0) {
            this._back2Sprite.bitmap = ImageManager.loadBattleback2($gameVariables.value(107));
        }

        // Remove the blur effect by clearing the filters
        this._back1Sprite.filters = [];
        this._back2Sprite.filters = [];
    };

    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        this.updateBattlebacks();
    };

    Spriteset_Battle.prototype.updateBattlebacks = function() {
        frameElapsedTime1 += 1; // update every tick
        frameElapsedTime2 += 1;

        if ($gameVariables.value(106) != 0 && frameElapsedTime1 >= FRAME_DURATION1) {
            frameElapsedTime1 -= FRAME_DURATION1;
            frameIndex1 = (frameIndex1 + 1) % FRAME_COUNT1;
            const frameX1 = FRAME_WIDTH * frameIndex1;

            // Update the sprite's frame (adjust y coordinate, width, and height as needed)
            this._back1Sprite.setFrame(frameX1, 0, FRAME_WIDTH, this._back1Sprite.bitmap.height);
        }

        if ($gameVariables.value(107) != 0 && frameElapsedTime2 >= FRAME_DURATION2) {
            frameElapsedTime2 -= FRAME_DURATION2;
            frameIndex2 = (frameIndex2 + 1) % FRAME_COUNT2;
            const frameX2 = FRAME_WIDTH * frameIndex2;

            this._back2Sprite.setFrame(frameX2, 0, FRAME_WIDTH, this._back2Sprite.bitmap.height);
        }
    };
})();