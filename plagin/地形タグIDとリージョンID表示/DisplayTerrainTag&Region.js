/*:
 * @plugindesc 地形タグとリージョンIDを表示するプラグインです。

 * @param RegionIDFontSize
 * @text リージョンIDのフォントサイズ
 * @type number
 * @min 1
 * @max 100
 * @default 14
 * @desc リージョンIDの表示で使用するフォントサイズを設定します。
 * 
 * @param RegionIDAlpha
 * @text リージョンIDの透明度
 * @type float
 * @min 0.0
 * @max 1.0
 * @default 0.5
 * @desc リージョンIDの表示で使用する透明度を設定します。0.0（完全に透明）から1.0（完全に不透明）までの範囲です。
 * 
 * @param RegionIDButton
 * @text リージョンID表示のキーコード（F1）
 * @type string
 * @default 112
 * @desc リージョンID表示の有無を切り替えるキーコードを指定します。
 * 
 * @param TerrainTagButton
 * @text 地形タグID表示ののキーコード（F2）
 * @type string
 * @default 113
 * @desc 地形タグ表示の有無を切り替えるキーコードを指定します。
 *
 * @help
 * マップ上で地形タグIDとリージョンIDを表示。
 * 同時に表示できないので、キーをもう一度押して非表示にする。
 */

(() => {
    "use strict";

    const pluginName = 'DisplayTerrainTag&Region';
    const parameters = PluginManager.parameters(pluginName);
    const RegionIDButton = parseInt(parameters.RegionIDButton || "112");
    const TerrainTagButton = parseInt(parameters.TerrainTagButton || "113");
    const RegionIDAlpha = parseFloat(parameters.RegionIDAlpha || "0.5");
    const RegionIDFontSize = parseInt(parameters.RegionIDFontSize || "14");

    Input.keyMapper[RegionIDButton] = 'DisplayRegionID';
    Input.keyMapper[TerrainTagButton] = 'DisplayTerrainTag';

    let isDisplayingRegionID = false;
    let isDisplayingTerrainTag = false;

    function createRegionIDSprite(bitmap = null) {
        const sprite = new Sprite(bitmap);


        sprite.update = function() {
            Sprite.prototype.update.call(this);
            this.updatePosition();
        };

        sprite.updatePosition = function() {
            this.x = -$gameMap.displayX() * $gameMap.tileWidth();
            this.y = -$gameMap.displayY() * $gameMap.tileHeight();
        };

        sprite.displayRegionID = function(alpha) {
            if (this.bitmap) {
                this.bitmap.clear();
            }

            if (!isDisplayingRegionID) {
                return;
            }

            this.bitmap = new Bitmap($gameMap.width() * $gameMap.tileWidth(), $gameMap.height() * $gameMap.tileHeight());

            this.bitmap.fontSize = RegionIDFontSize;  // 新たに追加

            for (let y = 0; y < $gameMap.height(); y++) {
                for (let x = 0; x < $gameMap.width(); x++) {
                    const regionId = $gameMap.regionId(x, y);
                    const color = getColorByRegionId(regionId, RegionIDAlpha);
                    const tileWidth = $gameMap.tileWidth();
                    const tileHeight = $gameMap.tileHeight();
                    const x1 = x * tileWidth;
                    const y1 = y * tileHeight;

                    this.bitmap.fillRect(x1, y1, tileWidth, tileHeight, color);

                    if (regionId !== 0) {

                        // 白い枠を描画
                        const lineWidth = 1; // 枠線の厚み（ピクセル単位）
                        const lineColor = 'rgba(255, 255, 255, 0.3)'; // 半透明の白

                        this.bitmap.fillRect(x1, y1, tileWidth, lineWidth, lineColor);  // 上
                        this.bitmap.fillRect(x1, y1, lineWidth, tileHeight, lineColor);  // 左
                        this.bitmap.fillRect(x1 + tileWidth - lineWidth, y1, lineWidth, tileHeight, lineColor);  // 右
                        this.bitmap.fillRect(x1, y1 + tileHeight - lineWidth, tileWidth, lineWidth, lineColor);  // 下
                        this.bitmap.drawText(regionId.toString(), x1, y1, tileWidth, tileHeight, 'center');
                    }
                }
            }
        };

        sprite.displayTerrainTag = function() {
            if (this.bitmap) {
                this.bitmap.clear();
            }

            if (!isDisplayingTerrainTag) {
                return;
            }

            this.bitmap = new Bitmap($gameMap.width() * $gameMap.tileWidth(), $gameMap.height() * $gameMap.tileHeight());

            this.bitmap.fontSize = 14;

            for (let y = 0; y < $gameMap.height(); y++) {
                for (let x = 0; x < $gameMap.width(); x++) {
                    const terrainTag = $gameMap.terrainTag(x, y);
                    const tileWidth = $gameMap.tileWidth();
                    const tileHeight = $gameMap.tileHeight();
                    const x1 = x * tileWidth;
                    const y1 = y * tileHeight;
                        // 白い枠を描画
                        const lineWidth = 1; // 枠線の厚み（ピクセル単位）
                        const lineColor = 'rgba(255, 255, 255, 0.2)'; // 半透明の白

                        this.bitmap.fillRect(x1, y1, tileWidth, lineWidth, lineColor);  // 上
                        this.bitmap.fillRect(x1, y1, lineWidth, tileHeight, lineColor);  // 左
                        this.bitmap.fillRect(x1 + tileWidth - lineWidth, y1, lineWidth, tileHeight, lineColor);  // 右
                        this.bitmap.fillRect(x1, y1 + tileHeight - lineWidth, tileWidth, lineWidth, lineColor);  // 下

                        this.bitmap.drawText(terrainTag.toString(), x1, y1, tileWidth, tileHeight, 'center');

                }
            }
        };

        return sprite;

    }

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if (!isDisplayingTerrainTag && Input.isTriggered('DisplayRegionID')) {
            isDisplayingRegionID = !isDisplayingRegionID;
            if (!this._regionIDSprite) {
                this._regionIDSprite = createRegionIDSprite();
                this._baseSprite.addChild(this._regionIDSprite);
            }
            this._regionIDSprite.displayRegionID(0.5);
        }


        if (!isDisplayingRegionID && Input.isTriggered('DisplayTerrainTag')) {
            isDisplayingTerrainTag = !isDisplayingTerrainTag;
            if (!this._regionIDSprite) {
                this._regionIDSprite = createRegionIDSprite();
                this._baseSprite.addChild(this._regionIDSprite);
            }
            this._regionIDSprite.displayTerrainTag();
        }

    };

    function getColorByRegionId(regionId, alpha = 0.5) {
        if (regionId === 0) {
            return "rgba(0,0,0,0)"; // 透明
        }

        const colors = [
            '990033',//12
            'FF0000',//1
            'CC6600',//2
            'FFFF00',//3
            '99CC33',//4
            '009933',//5
            '009966',//6
            '33CCCC',//7
            '0066CC',//8
            '330099',//9
            '800080',//10
            'FF00FF' //11
        ];

        const baseColor = colors[regionId % colors.length];
        return `rgba(${parseInt(baseColor.substring(0, 2), 16)}, ${parseInt(baseColor.substring(2, 4), 16)}, ${parseInt(baseColor.substring(4, 6), 16)}, ${alpha})`; 
    }
})();
