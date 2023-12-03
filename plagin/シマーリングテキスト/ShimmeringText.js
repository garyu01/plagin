(() => {
    const pluginName = "ShimmeringText";
    const shimmerColors = ["#FF0000", "#ff6600", "#FFFF00", "#66ff00", "#00bfff", "#0066ff", "#ff00ff"];
    const shimmerSpeed = 3;
    const switchId = 100; // 色が変わる条件となるスイッチのID

    // Window_ActorCommandのupdateメソッドをオーバーライド
    const _Window_ActorCommand_update = Window_ActorCommand.prototype.update;
    Window_ActorCommand.prototype.update = function() {
        _Window_ActorCommand_update.call(this);
        this.refreshShimmering();
    };

    // シマーリングエフェクトを更新するメソッド
    Window_ActorCommand.prototype.refreshShimmering = function() {
        // 指定されたスイッチがONの場合にのみ処理
        if ($gameSwitches.value(switchId)) {
            const frameCount = Graphics.frameCount;
            const colorIndex = Math.floor(frameCount / shimmerSpeed) % shimmerColors.length;

            if (this._shimmerColorIndex !== colorIndex) {
                this._shimmerColorIndex = colorIndex;
                this.refresh(); // ウィンドウの内容を再描画
            }
        }
    };

    // Window_ActorCommandのdrawItemメソッドをオーバーライド
    const _Window_ActorCommand_drawItem = Window_ActorCommand.prototype.drawItem;
    Window_ActorCommand.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        const commandName = this.commandName(index);

        // 特定の項目（例: 最初の項目）にのみ効果を適用
        if (index === 0 && this._shimmerColorIndex !== undefined && $gameSwitches.value(switchId)) {
            const color = shimmerColors[this._shimmerColorIndex];
            this.changeTextColor(color);
        }
        if (commandName.length >= 7) {
            const xOffset = -15; // テキストを右に移動させるピクセル数
            
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(commandName, rect.x + xOffset, rect.y, rect.width, 'left');
            this.resetTextColor();
        } else {
            this.drawText(commandName, rect.x, rect.y, rect.width, 'left');
            this.resetTextColor();
        }
    };
})();


