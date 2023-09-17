//メニューでアイコンを一つだけ表示
(function() {
    Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
        width = width || 144;
        var icons = actor.allIcons();
        if (icons.length > 0) {
            this.drawIcon(icons[0], x, y);
        }
    };
})();