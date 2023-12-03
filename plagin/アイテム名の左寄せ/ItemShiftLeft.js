/*:
 * @plugindesc 特定のメモタグがついたアイテムのテキストを左に寄せるプラグイン
 *
 * @help
 * このプラグインは、<ShiftLeft>メモタグがついたアイテムのテキストを
 * 左に寄せる機能を提供します。
 *
 * 使用方法:
 * アイテムのメモ欄に <ShiftLeft> と記述すると、そのアイテムのテキストが
 * 左に寄せられます。
 * このプラグインをプラグインマネージャに追加し、有効化してください。
 */

(function() {

    Window_ItemList.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemLineRect(index);
            rect.width -= this.itemPadding();
            this.changePaintOpacity(this.isEnabled(item));
            if (item.meta.ShiftLeft) {
                // メモタグがある場合はテキストを左にずらす
                this.drawItemName(item, rect.x - 20, rect.y, rect.width - numberWidth);
            } else {
                // メモタグがない場合は通常通りに描画
                this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            }
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(": " + $gameParty.numItems(item), x, y, width, "right");
        }
    };

})();

