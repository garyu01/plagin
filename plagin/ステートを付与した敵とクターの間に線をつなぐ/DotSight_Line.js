/*:
 * @target MZ
 * @plugindesc ステートを付与した敵1体とアクターの間に線を描画
 *
 * @command SetLineProperties
 * @text Set Line Properties
 * @desc ステートを付与した敵1体とアクターの間に線を描画
 *
 * @arg color
 * @text Line Color
 * @desc 線の色 (16進数、例: 赤の場合は #FF0000).
 * @type string
 * @default #FF0000
 *
 * @arg width
 * @text Line Width
 * @desc 線の太さ
 * @type number
 * @min 1
 * @default 2
 * 
 * @arg alpha
 * @text Line Alpha
 * @desc 透明度 (0.0 - 完全に透明、1.0 - 完全に不透明).
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 1.0
 *
 * @arg offsetXStart
 * @text Start X Offset
 * @desc 線の始まりのX位置
 * @type number
 * @default -40
 *
 * @arg offsetYStart
 * @text Start Y Offset
 * @desc 線の始まりのY位置
 * @type number
 * @default 1
 *
 * @arg offsetXEnd
 * @text End X Offset
 * @desc 線の終わりX位置
 * @type number
 * @default -1
 *
 * @arg offsetYEnd
 * @text End Y Offset
 * @desc 線の終わりY位置
 * @type number
 * @default -55
 *
 * @command SetStateForLine
 * @text Set State for Line
 * @desc 線を描画するステートID
 *
 * @arg stateId
 * @text State ID
 * @desc 線を描画するステートID
 * @type number
 * @default 1
 */
var DotSight = DotSight || {};
DotSight.Line = DotSight.Line || {};
(function(DotSight) {
    DotSight.lineProperties = {
        color: '#FF0000',
        width: 2,
        alpha: 1.0,
        offsetXStart: -40,
        offsetYStart: 1,
        offsetXEnd: -1,
        offsetYEnd: -55,
        stateId: 1 // Default state ID
    };

    PluginManager.registerCommand('DotSight_Line', 'SetLineProperties', args => {
        DotSight.lineProperties.color = args.color;
        DotSight.lineProperties.width = Number(args.width);
        DotSight.lineProperties.alpha = Number(args.alpha);
        DotSight.lineProperties.offsetXStart = Number(args.offsetXStart);
        DotSight.lineProperties.offsetYStart = Number(args.offsetYStart);
        DotSight.lineProperties.offsetXEnd = Number(args.offsetXEnd);
        DotSight.lineProperties.offsetYEnd = Number(args.offsetYEnd);
    });

    PluginManager.registerCommand('DotSight_Line', 'SetStateForLine', args => {
        DotSight.lineProperties.stateId = Number(args.stateId);
    });

    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);
        this.createLineContainer();
    };

    Spriteset_Battle.prototype.createLineContainer = function() {
        this._lineContainer = new PIXI.Container();
        this.addChild(this._lineContainer);
    };

    Spriteset_Battle.prototype.createLineJoint = function(sourceSprite, targetSprite, data) {
        this._lineContainer.removeChildren();
        const sprite = new DotSight.Sprite_LineJoint(sourceSprite, targetSprite, data);
        this._lineContainer.addChild(sprite);
    };

    DotSight.Sprite_LineJoint = function() {
        this.initialize.apply(this, arguments);
    };

    DotSight.Sprite_LineJoint.prototype = Object.create(PIXI.Graphics.prototype);
    DotSight.Sprite_LineJoint.prototype.constructor = DotSight.Sprite_LineJoint;

    DotSight.Sprite_LineJoint.prototype.initialize = function(sourceSprite, targetSprite, data) {
        PIXI.Graphics.call(this);
        this._sourceSprite = sourceSprite;
        this._targetSprite = targetSprite;
        this.data = data;
        this.z = 7;
    };

    DotSight.Sprite_LineJoint.prototype.update = function() {
        this.clear();
        this.draw();
    };

    DotSight.Sprite_LineJoint.prototype.draw = function() {
        const props = DotSight.lineProperties;
        const color = parseInt(props.color.replace('#', ''), 16);
        this.lineStyle(props.width, color, props.alpha);
        const start = { x: this._sourceSprite.x + props.offsetXStart, y: this._sourceSprite.y + props.offsetYStart };
        const end = { x: this._targetSprite.x + props.offsetXEnd, y: this._targetSprite.y + props.offsetYEnd };
        this.moveTo(start.x, start.y);
        this.lineTo(end.x, end.y);
        this.beginFill(color, props.alpha);
        this.drawCircle(end.x, end.y, props.width / 2);
        this.endFill();
    };

    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        this.updateLineJoint();
    };

    Spriteset_Battle.prototype.updateLineJoint = function() {
        if (this._lineContainer) {
            this._lineContainer.children.forEach(child => {
                if (child.update) child.update();
            });
        }
    };

    const _Game_Enemy_addState = Game_Enemy.prototype.addState;
    Game_Enemy.prototype.addState = function(stateId) {
        // Ensure that state is not added if the enemy is already dead
        if (!this.isAlive()) return;
        _Game_Enemy_addState.call(this, stateId);
        if (stateId === DotSight.lineProperties.stateId && !this._stateAdded) {
            this._stateAdded = true;
            this.drawPoisonLine();
        }
    };

    const _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        this.removeLineIfNecessary();
        _Game_Enemy_die.call(this); // Call the original die function
    };

    Game_Enemy.prototype.removeLineIfNecessary = function() {
        if (this._stateAdded) {
            this._stateAdded = false;
            // Ensure that the line container is properly accessed and cleared
            if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._lineContainer) {
                SceneManager._scene._spriteset._lineContainer.removeChildren();
            }
        }
    };

    const _Game_Enemy_removeState = Game_Enemy.prototype.removeState;
    Game_Enemy.prototype.removeState = function(stateId) {
        if (stateId === DotSight.lineProperties.stateId) {
            this.removeLineIfNecessary();
        }
        _Game_Enemy_removeState.call(this, stateId);
    };

    Game_Enemy.prototype.drawPoisonLine = function() {
        const actorSprite = SceneManager._scene._spriteset._actorSprites[0];
        const enemySprite = SceneManager._scene._spriteset._enemySprites.find(sprite => sprite._enemy === this);
        if (actorSprite && enemySprite) {
            SceneManager._scene._spriteset.createLineJoint(actorSprite, enemySprite, {});
        }
    };
})(DotSight.Line);

