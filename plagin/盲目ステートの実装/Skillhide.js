/*:
* @target MZ
* @plugindesc 盲目ステートの実装
*
* @param blindStateId
* @text 盲目ステートID
* @type state
* @desc スキルを隠す盲目ステートのIDを設定します。
* @default 4
*
* @help
* このプラグインは、指定されたステートが付与されているとき、スキル名を「????」
* に変更し、スキルの説明やコストを非表示にします。
*/

(() => {
    const parameters = PluginManager.parameters('Skillhide');
    const blindStateId = Number(parameters['blindStateId'] || 4);

    Window_SkillList.prototype.drawItem = function(index) {
        const skill = this.itemAt(index);
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            if (this._actor.isStateAffected(blindStateId)){
                this.drawCustomSkillName("????", rect.x + 200, rect.y, rect.width - costWidth);
            } else {
                this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
                this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            }
            this.changePaintOpacity(1);
        }
    };

    Window_SkillList.prototype.drawCustomSkillName = function(name, x, y, width) {
        this.resetTextColor();
        this.drawText(name, x, y, width);
    };

    Window_BattleSkill.prototype.show = function() {
        if (this._actor.isStateAffected(blindStateId)){
            // 盲目ステートの場合、ヘルプウィンドウを非表示にします。
        } else {
            this.showHelpWindow();
        }
        this.selectLast();
        Window_SkillList.prototype.show.call(this);
    };
})();