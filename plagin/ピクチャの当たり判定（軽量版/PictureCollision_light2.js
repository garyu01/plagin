//ピクチャ同士の当たり判定を追加したバージョン
//PictureCollision.checkCollisionById(PictureId, $gamePlayer);
//PictureCollision.checkCollisionById(PictureId, $gameMap.event(id));
//PictureCollision.checkPictureCollisionById(1, 2)

var PictureCollision = (() => {
  class PictureCollision {
    static hiddenCanvas = document.createElement("canvas");
    static hiddenContext = PictureCollision.hiddenCanvas.getContext("2d");

    static checkCollisionById(pictureId, object) {
      const pictureSprite = SceneManager._scene._spriteset._pictureContainer.children[pictureId - 1];
      if (pictureSprite) {
        return this.checkCollision(pictureSprite, object);
      }
      return false;
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
/////////////////////////////////////////////////////////////////////////////////////////////////////
    static getPictureSprite(pictureId) {
      const scene = SceneManager._scene;
      if (scene instanceof Scene_Map && scene._spriteset && scene._spriteset._pictureContainer) {
        return scene._spriteset._pictureContainer.children[pictureId - 1];
      }
      return null;
    }

    static checkPictureCollision(picture1, picture2) {
      const [p1X, p1Y, p1Width, p1Height] = [picture1.x, picture1.y, picture1.width, picture1.height];
      const [p2X, p2Y, p2Width, p2Height] = [picture2.x, picture2.y, picture2.width, picture2.height];

      if (p1X < p2X + p2Width && p1X + p1Width > p2X && p1Y < p2Y + p2Height && p1Y + p1Height > p2Y) {
        const startX = Math.max(p1X, p2X);
        const startY = Math.max(p1Y, p2Y);
        const endX = Math.min(p1X + p1Width, p2X + p2Width);
        const endY = Math.min(p1Y + p1Height, p2Y + p2Height);

        for (let x = startX; x < endX; x++) {
          for (let y = startY; y < endY; y++) {
            const p1LocalX = x - p1X;
            const p1LocalY = y - p1Y;
            const p2LocalX = x - p2X;
            const p2LocalY = y - p2Y;

            if (this.isPixelOpaque(picture1, p1LocalX, p1LocalY) && this.isPixelOpaque(picture2, p2LocalX, p2LocalY)) {
              return true;
            }
          }
        }
      }

      return false;
    }

    static checkPictureCollisionById(pictureId1, pictureId2) {
      const pictureSprite1 = this.getPictureSprite(pictureId1);
      const pictureSprite2 = this.getPictureSprite(pictureId2);
      if (pictureSprite1 && pictureSprite2) {
        const picture1Bounds = {
          x: pictureSprite1.x,
          y: pictureSprite1.y,
          width: pictureSprite1.width,
          height: pictureSprite1.height,
        };
        const picture2Bounds = {
          x: pictureSprite2.x,
          y: pictureSprite2.y,
          width: pictureSprite2.width,
          height: pictureSprite2.height,
        };
        if (
          picture1Bounds.x < picture2Bounds.x + picture2Bounds.width &&
          picture1Bounds.x + picture1Bounds.width > picture2Bounds.x &&
          picture1Bounds.y < picture2Bounds.y + picture2Bounds.height &&
          picture1Bounds.y + picture1Bounds.height > picture2Bounds.y
        ) {
          return true;
        }
      }
      return false;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  return PictureCollision;
})();