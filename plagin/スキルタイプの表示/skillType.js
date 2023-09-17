//ステータスウィンドウにスキルタイプを表示

(function() {
    Window_Status.prototype.drawActorFace = function(actor, x, y, width, height) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);

        const skills = actor.skills().filter(skill => skill.stypeId === 3);

        let skillTypeName = $dataSystem.skillTypes[3];
        let offsetX = 600; // ここでX位置を調整
        let offsetY = -30 + this.lineHeight(); // ここでY位置を調整
        this.contents.fontSize = 24;  // スキルタイプ名のフォントサイズ
        this.changeTextColor(ColorManager.textColor(2));  // スキルタイプ名の色
        this.drawText(skillTypeName, offsetX, offsetY);  // スキルタイプ名の描画

        this.contents.fontSize = 20;  // スキル名のフォントサイズ
        this.changeTextColor(ColorManager.textColor(4));  // スキル名の色
        for(let i = 0; i < skills.length; i++) {
            offsetX = 600;  // ここでX位置を調整
            offsetY = -10 + (i+2) * this.lineHeight(); // ここでY位置を調整
            this.drawText(skills[i].name, offsetX, offsetY);  // スキル名の描画
        }

        this.resetFontSettings();  // フォントの設定を元に戻す
    };
})();