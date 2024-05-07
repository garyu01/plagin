/*:
 * @target MZ
 * @plugindesc ゲーム終了ボタンの表示を制御するプラグイン
 * @author YourName
 *
 * @param Switch ID
 * @type number
 * @desc ボタン表示を制御するスイッチのID
 * @default 1
 */

(() => {
    'use strict';

    if (!Utils.isNwjs()) {
        return;
    }

    const gui = require('nw.gui');
    const win = gui.Window.get();
    const fs = require('fs');
    const path = require('path');

    // プラグインパラメータの取得
    const parameters = PluginManager.parameters('Exitbutton');
    const switchId = Number(parameters['Switch ID'] || 1);

    let exitButton;
    let isExiting = false;

    function addExitButton() {
        if (exitButton) return;

        exitButton = document.createElement('button');
        exitButton.textContent = 'ゲームを終了する';
        exitButton.style.position = 'absolute';
        exitButton.style.right = '10px';
        exitButton.style.top = '10px';
        exitButton.style.zIndex = 1000;

        exitButton.onclick = function(event) {
            event.stopPropagation();
            event.preventDefault();
            isExiting = true;
            $gameTemp.clearDestination();
            exitButton.style.display = 'none'; // ダイアログ表示中はボタンを非表示
            showInitialExitConfirmation();
        };

        document.body.appendChild(exitButton);
    }

    function updateExitButtonVisibility() {
        if ($gameSwitches && $gameSwitches.value(switchId) && !isExiting) {
            exitButton.style.display = 'block';
        } else {
            exitButton.style.display = 'none';
        }
    }

    function showInitialExitConfirmation() {
        const shouldExit = confirm('本当にゲームを終了しますか？');
        if (shouldExit) {
            showSaveConfirmation();
        } else {
            isExiting = false;
            updateExitButtonVisibility(); // ボタンを再表示
        }
    }

    function showSaveConfirmation() {
        const shouldSave = confirm('ゲームを終了する前にセーブしますか？');
        if (shouldSave) {
            autosave(() => {
                displayAndExit('セーブしました。アプリケーションを閉じます。', 1500);
            });
        } else {
            displayAndExit('あーそーですかい、後悔してもしらんからな～。', 1500);
        }
    }

    function autosave(callback) {
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(0)) {
            cleanBackup(0, callback);
        }
    }

    function cleanBackup(savefileId, callback) {
        const dirPath = StorageManager.fileDirectoryPath();
        const filePath = path.join(dirPath, `file${savefileId}.rmmzsave`);
        const backupFilePath = filePath + '.bak';

        if (fs.existsSync(backupFilePath)) {
            fs.unlink(backupFilePath, (err) => {
                if (err) {
                    console.error('Failed to delete backup:', err);
                } else {
                    console.log('Backup deleted successfully。');
                }
                callback();
            });
        } else {
            callback();
        }
    }

    function displayAndExit(message, delay) {
        const msgBox = document.createElement('div');
        msgBox.textContent = message;
        msgBox.style.position = 'fixed';
        msgBox.style.left = '50%';
        msgBox.style.top = '50%';
        msgBox.style.transform = 'translate(-50%, -50%)';
        msgBox.style.padding = '20px';
        msgBox.style.background = 'white';
        msgBox.style.border = '1px solid黒';
        msgBox.style.zIndex = '10001';
        msgBox.style.fontWeight = 'bold';
        msgBox.style.fontSize = '18px';
        document.body.appendChild(msgBox);

        setTimeout(() => {
            document.body.removeChild(msgBox);
            win.close();
        }, delay);
    }

    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        addExitButton();
        updateExitButtonVisibility();
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        updateExitButtonVisibility();
    };
})();
