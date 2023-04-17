/*:
 * @target MZ
 * @plugindesc 天候の表示順位と色を変更する
 * @author YourName
 *
 * @help
 * 天候エフェクトの表示順を変更
 *
 * @command changeWeatherZIndex
 * @text Change Weather Z Index
 * @desc 天候エフェクトの表示順を変更
 *
 * @arg target
 * @text 天候より下に表示する
 * @desc Picture=ピクチャ　Message=メッセージウィンドウ
 * Default=元に戻す
 * @type select
 * @option Picture
 * @value picture
 * @option Message
 * @value message
 * @option Default
 * @value default
 * @default picture
 *
 * @command changeWeatherColor
 * @text Change Weather Color
 * @desc 天候の色を変更
 *
 * @arg red
 * @text Red
 * @desc 赤(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @arg green
 * @text Green
 * @desc 緑(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 0
 *
 * @arg blue
 * @text Blue
 * @desc 青(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @arg alpha
 * @text Alpha
 * @desc アルファ(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 */

(() => {
  const pluginName = "ChangeWeatherZIndex";
  const _weatherZIndexData = {
    target: "default",
    color: {
      red: 0,
      green: 0,
      blue: 255,
      alpha: 128,
    },
  };

  const changeWeatherZIndex = (weather, targetZIndex) => {
    const parent = weather.parent;
    parent.removeChild(weather);
    parent.addChildAt(weather, targetZIndex);
  };

  const applyWeatherZIndex = () => {
    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) return;

    const weather = scene._spriteset._weather;
    const baseSprite = scene._spriteset._baseSprite;

    if (_weatherZIndexData.target === "picture") {
      const pictureZIndex = baseSprite.z + 2;
      changeWeatherZIndex(weather, pictureZIndex);
    } else if (_weatherZIndexData.target === "message") {
      const messageZIndex = scene._windowLayer.children.length;
      scene._windowLayer.addChildAt(weather, messageZIndex);
    } else {
      const defaultZIndex = baseSprite.z + 1;
      changeWeatherZIndex(weather, defaultZIndex);
    }
  };

  const applyWeatherColor = () => {
    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) return;

    const weather = scene._spriteset._weather;
    const { red, green, blue, alpha } = _weatherZIndexData.color;
    weather.setColor(red, green, blue, alpha);
  };

  PluginManager.registerCommand(pluginName, "changeWeatherZIndex", args => {
    _weatherZIndexData.target = args.target;
    applyWeatherZIndex();
  });

  PluginManager.registerCommand(pluginName, "changeWeatherColor", args => {
    _weatherZIndexData.color.red = Number(args.red);
    _weatherZIndexData.color.green = Number(args.green);
    _weatherZIndexData.color.blue = Number(args.blue);
    _weatherZIndexData.color.alpha = Number(args.alpha);
    applyWeatherColor();
  });

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    applyWeatherZIndex();
    applyWeatherColor();
  };

  const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function () {
    _Spriteset_Map_createLowerLayer.call(this);
    this._baseSprite = new Sprite();
    this._baseSprite.z = 0;
    this._tilemap.addChild(this._baseSprite);
  };



  Weather.prototype.setColor = function (red, green, blue, alpha) {
    const colorTone = [red, green, blue, alpha];
    this._colorTone = colorTone;
  };

  const _Weather_updateSprite = Weather.prototype._updateSprite;
  Weather.prototype._updateSprite = function (sprite) {
    _Weather_updateSprite.call(this, sprite);

    if (this._colorTone && Array.isArray(this._colorTone)) {
      const blendColor = [
        this._colorTone[0],
        this._colorTone[1],
        this._colorTone[2],
        255 - this._colorTone[3]
      ];
      sprite.setBlendColor(blendColor);
    }
  };
})();