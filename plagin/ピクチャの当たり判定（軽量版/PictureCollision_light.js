//PictureCollision.jsの接触方向の判定を省いた軽量版
//ピクチャに接触した場合のスクリプト
//PictureCollision.checkCollisionById(PictureId, $gamePlayer);
//PictureCollision.checkCollisionById(PictureId, $gameMap.event(id));

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
  }

  return PictureCollision;
})();