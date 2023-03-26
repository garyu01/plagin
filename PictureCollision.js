//ピクチャに接触した場合のスクリプト
//PictureCollision.checkCollisionById(PictureID, $gamePlayer)
//PictureCollision.checkCollisionById(PictureID, $gameMap.event(1))

//ピクチャに接触した方向で判定するスクリプト
//PictureCollision.getCollisionDirection(PictureID, $gamePlayer) === "left"
//PictureCollision.getCollisionDirection(PictureID, $gamePlayer) === "right"
//PictureCollision.getCollisionDirection(PictureID, $gamePlayer) === "up"
//PictureCollision.getCollisionDirection(PictureID, $gamePlayer) === "down"
//PictureCollision.getCollisionDirection(1, $gameMap.event(id)) === "left"
//PictureCollision.getCollisionDirection(1, $gameMap.event(id)) === "right"
//PictureCollision.getCollisionDirection(1, $gameMap.event(id)) === "down"
//PictureCollision.getCollisionDirection(1, $gameMap.event(id)) === "up"

(() => {
  class PictureCollision {
    static hiddenCanvas = document.createElement("canvas");
    static hiddenContext = PictureCollision.hiddenCanvas.getContext("2d");

    static getPictureSprite(pictureId) {
      const scene = SceneManager._scene;
      if (scene instanceof Scene_Map) {
        return scene._spriteset._pictureContainer.children[pictureId - 1];
      }
      return null;
    }

    static checkCollision(picture, object) {
      const objectX = object.screenX();
      const objectY = object.screenY();
      const pictureX = picture.x;
      const pictureY = picture.y;
      const pictureWidth = picture.width;
      const pictureHeight = picture.height;

      if (
        objectX >= pictureX &&
        objectX <= pictureX + pictureWidth &&
        objectY >= pictureY &&
        objectY <= pictureY + pictureHeight
      ) {
        const localX = objectX - pictureX;
        const localY = objectY - pictureY;
        return this.isPixelOpaque(picture, localX, localY);
      }

      return false;
    }

    static checkCollisionById(pictureId, object) {
      const pictureSprite = this.getPictureSprite(pictureId);
      return pictureSprite && this.checkCollision(pictureSprite, object);
    }

    static getCollisionDirection(pictureId, object) {
      const pictureSprite = this.getPictureSprite(pictureId);
      if (pictureSprite && this.checkCollision(pictureSprite, object)) {
        const objectX = object.screenX();
        const objectY = object.screenY();
        const pictureX = pictureSprite.x;
        const pictureY = pictureSprite.y;
        const pictureWidth = pictureSprite.width;
        const pictureHeight = pictureSprite.height;

        const leftDist = Math.abs(objectX - pictureX);
        const rightDist = Math.abs(objectX - (pictureX + pictureWidth));
        const upDist = Math.abs(objectY - pictureY);
        const downDist = Math.abs(objectY - (pictureY + pictureHeight));

        const minDist = Math.min(leftDist, rightDist, upDist, downDist);

        if (minDist === leftDist) return "left";
        if (minDist === rightDist) return "right";
        if (minDist === upDist) return "up";
        if (minDist === downDist) return "down";
      }

      return null;
    }

    static isPixelOpaque(picture, x, y) {
      const context = this.hiddenContext;
      context.clearRect(0, 0, 1, 1);
      context.drawImage(
        picture.bitmap.canvas,
        x,
        y,
        1,
        1,
        0,
        0,
        1,
        1
      );
      const imageData = context.getImageData(0, 0, 1, 1);
      return imageData.data[3] !== 0;
    }
  }

  window.PictureCollision = PictureCollision;
})();