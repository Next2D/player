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
        const width  = canvas.width;
        const height = canvas.height;

        object.clearRect(0, 0, width + 1, height + 1);

        // canvas reset
        canvas.width = canvas.height = 1;

        // pool
        pool.push(canvas);
    }
};