/*:
 * @target MZ
 * @plugindesc アイテム欄の武器リストにある個数表示と「：」を削除する
 * 
 */

(() => {
    'use strict';

    // Window_ItemListのdrawItemNumberメソッドをオーバーライド
    const _Window_ItemList_drawItemNumber = Window_ItemList.prototype.drawItemNumber;
    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (!item) return;

        // アイテムが武器や鎧の場合、数量を描画しない
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            return;
        }

        // それ以外のアイテムの場合は、元のメソッドを使用して数量を描画
        _Window_ItemList_drawItemNumber.call(this, item, x, y, width);
    };
})();