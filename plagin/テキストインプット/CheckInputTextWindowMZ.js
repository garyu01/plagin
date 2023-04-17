/*:
 * @target MZ
 * @plugindesc 文字入力ウィンドウプラグイン
 * @author Your Name
 * @command ShowCheckInputTextWindow
 * @arg variableId
 * @type number
 * @min 1
 * @text 変数ID
 * @desc 入力したテキストを格納する変数ID
 * @arg maxLength
 * @type number
 * @min 1
 * @text 最大文字数
 * @desc 入力できるテキストの最大文字数
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * 文字入力ウィンドウプラグイン
 *
 * ============================================================================
 * Instructions
 * ============================================================================
 *
 * イベントエディタでプラグインコマンドを使用して、文字入力ウィンドウを表示します。
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * ShowCheckInputTextWindow
 *  - variableId: 入力文字を格納する変数ID
 *  - maxLength: 最大入力文字数
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.0:
 * - Initial release
 *
 */

(() => {
    const pluginName = "CheckInputTextWindowMZ";

    PluginManager.registerCommand(pluginName, "ShowCheckInputTextWindow", args => {
        const variableId = parseInt(args.variableId);
        const maxLength = parseInt(args.maxLength);

        SceneManager.push(Scene_CheckInputText);
        SceneManager.prepareNextScene(variableId, maxLength);
    });

    class Window_CheckInputText extends Window_NameEdit {
        setMaxLength(maxLength) {
            this._maxLength = maxLength;
        }

        refresh() {
            this.contents.clear();
            this.resetTextColor();
            const text = this.name();
            const y = (this.contentsHeight() - this.lineHeight()) / 5; // 縦方向の中央揃えの計算
            this.drawText(text, this.left(), y);
        }


        left() {
    　　　return 0;
        }


    }


    class Scene_CheckInputText extends Scene_Name {
        constructor() {
            super();
            this._variableId = 0;
            this._maxLength = 0;
        }

        prepare(variableId, maxLength) {
            this._variableId = variableId;
            this._maxLength = maxLength;
        }

        create() {
            super.create();
            this._editWindow.setMaxLength(this._maxLength);
        }

        createEditWindow() {
            const x = (Graphics.boxWidth - 480) / 2;
            const y = (Graphics.boxHeight - (this.calcWindowHeight(1, false) + 8)) / 2 - 250; // Y座標を変更
            this._editWindow = new Window_CheckInputText(new Rectangle(x, y, 480, this.calcWindowHeight(1, false)));
            this.addWindow(this._editWindow);
        }

        onInputOk() {
            const compareText = $gameVariables.value(this._variableId);
            const inputText = this._editWindow.name();
            const isMatch = compareText === inputText;
            $gameVariables.setValue(this._variableId, isMatch);
            this.popScene();
        }
    }
})();
