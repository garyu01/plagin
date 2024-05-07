/*:
 * @target MZ
 * @plugindesc ステートを付与した敵1体とアクターの間に線を描画
 *
 * @command SetLineProperties
 * @text Set Line Properties
 * @desc Sets the properties of the line to be drawn between characters.
 *
 * @arg color
 * @text Line Color
 * @desc The color of the line (hexadecimal, e.g., #FF0000 for red).
 * @type string
 * @default #FF0000
 *
 * @arg width
 * @text Line Width
 * @desc The width of the line.
 * @type number
 * @min 1
 * @default 2
 * 
 * @arg alpha
 * @text Line Alpha
 * @desc The alpha (transparency) of the line (0.0 - fully transparent, 1.0 - fully opaque).
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 1.0
 *
 * @arg offsetXStart
 * @text Start X Offset
 * @desc The X offset for the start of the line.
 * @type number
 * @default -40
 *
 * @arg offsetYStart
 * @text Start Y Offset
 * @desc The Y offset for the start of the line.
 * @type number
 * @default 1
 *
 * @arg offsetXEnd
 * @text End X Offset
 * @desc The X offset for the end of the line.
 * @type number
 * @default -1
 *
 * @arg offsetYEnd
 * @text End Y Offset
 * @desc The Y offset for the end of the line.
 * @type number
 * @default -55
 *
 * @command SetStateForLine
 * @text Set State for Line
 * @desc Sets the state ID that triggers line drawing between characters.
 *
 * @arg stateId
 * @text State ID
 * @desc The ID of the state that triggers line drawing.
 * @type number
 * @default 1
 */
var DotSight = DotSight || {}; 
DotSight.Line = DotSight.Line || {};
(function($) {
    $.lineProperties = {
        color: '#FF0000',
        width: 2,
        alpha: 1.0,
        offsetXStart: -40,
        offsetYStart: 1,
        offsetXEnd: -1,
        offsetYEnd: -55,
        stateId: 0
    };

    // Plugin Command to Set Line Properties
    PluginManager.registerCommand('DotSight_Line', 'SetLineProperties', args => {
        $.lineProperties.color = args.color;
        $.lineProperties.width = Number(args.width);
        $.lineProperties.alpha = Number(args.alpha);
        $.lineProperties.offsetXStart = Number(args.offsetXStart);
        $.lineProperties.offsetYStart = Number(args.offsetYStart);
        $.lineProperties.offsetXEnd = Number(args.offsetXEnd);
        $.lineProperties.offsetYEnd = Number(args.offsetYEnd);
    });

    // Plugin Command to Set State ID for Line Drawing
    PluginManager.registerCommand('DotSight_Line', 'SetStateForLine', args => {
        $.lineProperties.stateId = Number(args.stateId);
    });



    // Spriteset_Battle modifications
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
        
        const sprite = new $.Sprite_LineJoint(sourceSprite, targetSprite, data);
        this._lineContainer.addChild(sprite);
    };

    // Sprite_LineJoint definition
    $.Sprite_LineJoint = function() {
        this.initialize.apply(this, arguments);
    };

    $.Sprite_LineJoint.prototype = Object.create(PIXI.Graphics.prototype);
    $.Sprite_LineJoint.prototype.constructor = $.Sprite_LineJoint;

    $.Sprite_LineJoint.prototype.initialize = function(sourceSprite, targetSprite, data) {
        PIXI.Graphics.call(this);
        this._sourceSprite = sourceSprite;
        this._targetSprite = targetSprite;
        this.data = data;
        this.z = 7;
    };

    $.Sprite_LineJoint.prototype.update = function() {
        this.clear();
        this.draw();
    };

    $.Sprite_LineJoint.prototype.draw = function() {
        const props = $.lineProperties;
        const color = parseInt(props.color.replace('#', ''), 16);
        this.lineStyle(props.width, color, props.alpha);
        // Adjusting start and end positions based on the offset properties
        const start = { x: this._sourceSprite.x + props.offsetXStart, y: this._sourceSprite.y + props.offsetYStart };
        const end = { x: this._targetSprite.x + props.offsetXEnd, y: this._targetSprite.y + props.offsetYEnd };
        this.moveTo(start.x, start.y);
        this.lineTo(end.x, end.y);
        this.beginFill(color, props.alpha);
        this.drawCircle(end.x, end.y, props.width / 2);
        this.endFill();
    };

    // Spriteset_Battleの更新処理に線の更新処理を追加
    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        this.updateLineJoint();
    };

    Spriteset_Battle.prototype.updateLineJoint = function() {
        if (this._lineContainer) {
            this._lineContainer.children.forEach(child => {
                if (child.update) {
                    child.update();
                }
            });
        }
    };

    // Override to handle state addition and check for specific state ID
    const _Game_Enemy_addState = Game_Enemy.prototype.addState;
    Game_Enemy.prototype.addState = function(stateId) {
        _Game_Enemy_addState.call(this, stateId);
        if ($.lineProperties.stateId !== 0 && stateId === $.lineProperties.stateId && !this._stateAdded) {
            this._stateAdded = true;
            this.drawPoisonLine();
        }
    };

    // Game_Enemyからステートが削除されたときの処理をオーバーライド
    const _Game_Enemy_removeState = Game_Enemy.prototype.removeState;
    Game_Enemy.prototype.removeState = function(stateId) {
        if (stateId === $.lineProperties.stateId) {
            this._stateAdded = false;
            // 線を削除する前に、_lineContainerが存在するかどうかをチェック
            if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._lineContainer) {
                SceneManager._scene._spriteset._lineContainer.removeChildren();
            }
        }
        _Game_Enemy_removeState.call(this, stateId);
    };

    Game_Enemy.prototype.drawPoisonLine = function() {
        if (!this._stateAdded) return;  // 線を描画する前に_stateAddedを確認
        const actorSprite = SceneManager._scene._spriteset._actorSprites[0];
        const enemySprite = SceneManager._scene._spriteset._enemySprites.find(sprite => sprite._enemy === this);
        if (actorSprite && enemySprite) {
            SceneManager._scene._spriteset.createLineJoint(actorSprite, enemySprite, {});
        }
    };

})(DotSight.Line);


