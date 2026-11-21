/**
 * @description 破棄するHTMLCanvasElementをプールに保管
 *              Store the HTMLCanvasElement to be destroyed in the pool
 *
 * @param  {HTMLCanvasElement[]} pool
 * @param  {object} object
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    pool: HTMLCanvasElement[],
    object: any
): void => {

    if (!object || typeof object !== "object") {
        return ;
    }

    if ("canvas" in object) {

        const canvas: HTMLCanvasElement = object.canvas;

        // canvas reset
        // 大きさを設定するとキャンバスの内容と描画状態は初期化されるので、先に clearRect で
        // 全面を消す必要は無い (消すと、捨てる直前のキャンバス全体をもう 1 度書き換えることになる)。
        // Setting the size resets the bitmap and the drawing state, so clearing the whole
        // canvas first is not needed (it would rewrite the entire canvas right before discarding it).
        canvas.width = canvas.height = 1;

        // pool
        pool.push(canvas);
    }
};