import type { Shape } from "../../Shape";

/**
 * @description BitmapBufferの設定をクリア
 *              Clear the BitmapBuffer settings
 *
 * @param  {Shape} shape
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shape: Shape): void =>
{
    shape.isBitmap      = false;
    shape.$bitmapBuffer = null;

    // graphics clear
    // キャッシュ破棄と changed の伝搬は clear() 内の
    // GraphicsInvalidateOwnerCacheUseCase で行われる
    shape.graphics.clear();
};