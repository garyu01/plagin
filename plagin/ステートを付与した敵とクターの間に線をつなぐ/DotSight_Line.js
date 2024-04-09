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
        stateId: 1 // Default state ID
    };

    PluginManager.registerCommand('DotSight_Line', 'SetLineProperties', args => {
        $.lineProperties.color = args.color;
        $.lineProperties.width = Number(args.width);
        $.lineProperties.alpha = Number(args.alpha);
        $.lineProperties.offsetXStart = Number(args.offsetXStart);
        $.lineProperties.offsetYStart = Number(args.offsetYStart);
        $.lineProperties.offsetXEnd = Number(args.offsetXEnd);
        $.lineProperties.offsetYEnd = Number(args.offsetYEnd);
    });

    PluginManager.registerCommand('DotSight_Line', 'SetStateForLine', args => {
        $.lineProperties.stateId = Number(args.stateId);
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
        const sprite = new $.Sprite_LineJoint(sourceSprite, targetSprite, data);
        this._lineContainer.addChild(sprite);
    };

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
        _Game_Enemy_addState.call(this, stateId);
        if (stateId === $.lineProperties.stateId && !this._stateAdded) {
            this._stateAdded = true;
            this.drawPoisonLine();
        }
    };

    const _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        _Game_Enemy_die.call(this);
        if (SceneManager._scene && SceneManager._scene._spriteset && SceneManager._scene._spriteset._lineContainer) {
            SceneManager._scene._spriteset._lineContainer.removeChildren();
        }
    };

    Game_Enemy.prototype.drawPoisonLine = function() {
        const actorSprite = SceneManager._scene._spriteset._actorSprites[0];
        const enemySprite = SceneManager._scene._spriteset._enemySprites.find(sprite => sprite._enemy === this);
        if (actorSprite && enemySprite) {
            SceneManager._scene._spriteset.createLineJoint(actorSprite, enemySprite, {});
        }
    };

})(DotSight.Line);
