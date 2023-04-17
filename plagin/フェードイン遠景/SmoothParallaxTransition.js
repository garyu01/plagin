/*:
 * @plugindesc SmoothParallaxTransition
 * @author YourName
 * @target MZ
 *
 * @command transition
 * @text 遠景のフェードイン変更
 * @desc マップ遠景をフェードインさせながら変更
 *
 * @arg fileName
 * @type file
 * @dir img/parallaxes
 * @text ファイル名
 * @desc 変更する遠景名
 *
 * @arg duration
 * @type number
 * @text フレーム数
 * @desc フェードインにかかる時間 (60フレーム = 1秒).
 * @default 60
 *
 * @help
 * このプラグインは、遠景間のスムーズな移行を提供します。
 */

(() => {
  const pluginName = 'SmoothParallaxTransition';

  PluginManager.registerCommand(pluginName, 'transition', (args) => {
    const fileName = args.fileName;
    const duration = parseInt(args.duration) || 60;
    $gameScreen.startSmoothParallaxTransition(fileName, duration);
  });

  // Game_Map prototype modifications
  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this._parallaxName = $dataMap.parallaxName;
  };

  Game_Map.prototype.setParallaxName = function(parallaxName) {
    this._parallaxName = parallaxName;
    this.requestRefresh();
  };



  const _Game_Screen_initialize = Game_Screen.prototype.initialize;
  Game_Screen.prototype.initialize = function() {
    _Game_Screen_initialize.call(this);
    this._smoothParallaxTransition = {};
  };

  Game_Screen.prototype.startSmoothParallaxTransition = function(fileName, duration) {
    this._smoothParallaxTransition.fileName = fileName;
    this._smoothParallaxTransition.duration = duration;
    this._smoothParallaxTransition.progress = 0;
  };

  const _Game_Screen_update = Game_Screen.prototype.update;
  Game_Screen.prototype.update = function() {
    _Game_Screen_update.call(this);
    if (this._smoothParallaxTransition.progress !== undefined) {
      this._smoothParallaxTransition.progress++;
      const opacity = (this._smoothParallaxTransition.progress / this._smoothParallaxTransition.duration) * 255;
      if (this._smoothParallaxTransition.progress >= this._smoothParallaxTransition.duration) {
        $gameMap.setParallaxName(this._smoothParallaxTransition.fileName);
        this._smoothParallaxTransition = {};
      } else {
        this._smoothParallaxTransition.opacity = Math.min(opacity, 255);
      }
    }
  };

  const _Spriteset_Map_createParallax = Spriteset_Map.prototype.createParallax;
  Spriteset_Map.prototype.createParallax = function() {
    _Spriteset_Map_createParallax.call(this);
    this._parallaxTransitionSprite = new TilingSprite();
    this._parallaxTransitionSprite.z = -100;
    this._baseSprite.addChild(this._parallaxTransitionSprite);
  };

  const _Spriteset_Map_updateParallax = Spriteset_Map.prototype.updateParallax;
  Spriteset_Map.prototype.updateParallax = function() {
    _Spriteset_Map_updateParallax.call(this);
    this._parallax.bitmap = ImageManager.loadParallax($gameMap._parallaxName);
    const transition = $gameScreen._smoothParallaxTransition;
    if (transition.fileName && transition.opacity !== undefined) {
      this._parallaxTransitionSprite.bitmap = ImageManager.loadParallax(transition.fileName);
      this._parallaxTransitionSprite.opacity = transition.opacity;
      this._parallaxTransitionSprite.move(0, 0, Graphics.width, Graphics.height);
      this._parallaxTransitionSprite.origin.x = this._parallax.origin.x; // 追加
      this._parallaxTransitionSprite.origin.y = this._parallax.origin.y; // 追加
    } else {
      this._parallaxTransitionSprite.opacity = 0;
    }
  };

})();