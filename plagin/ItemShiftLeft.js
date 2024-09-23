/*:
 * @plugindesc 特定のメモタグがついたアイテムおよびスキルのテキストを左に寄せるプラグイン
 *
 * @help
 * このプラグインは、<ShiftLeft: -20>のように数値を指定したメモタグがついたアイテムやスキルのテキストを
 * 左に寄せる機能を提供します。
 *
 * 使用方法:
 * アイテムやスキルのメモ欄に <ShiftLeft: 数値> と記述すると、そのテキストが
 * 指定された数値分だけ左に寄せられます。数値は正の値でも負の値でも設定できます。
 * このプラグインをプラグインマネージャに追加し、有効化してください。
 */

(function() {

    // アイテムリストでの処理
    const _Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
    Window_ItemList.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemLineRect(index);
            rect.width -= this.itemPadding();
            this.changePaintOpacity(this.isEnabled(item));
            const shiftValue = item.meta.ShiftLeft ? parseInt(item.meta.ShiftLeft) || 0 : 0;
            this.drawItemName(item, rect.x + shiftValue, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    // スキルリストでの処理
    const _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem;
    Window_SkillList.prototype.drawItem = function(index) {
        const skill = this.itemAt(index);
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemLineRect(index);
            rect.width -= this.itemPadding();
            this.changePaintOpacity(this.isEnabled(skill));
            const shiftValue = skill.meta.ShiftLeft ? parseInt(skill.meta.ShiftLeft) || 0 : 0;
            this.drawItemName(skill, rect.x + shiftValue, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(": " + $gameParty.numItems(item), x, y, width, "right");
        }
    };

})();
