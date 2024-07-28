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

    if ("canvas" in object
        && object instanceof CanvasRenderingContext2D
    ) {

        const canvas: HTMLCanvasElement = object.canvas;
        const width: number  = canvas.width;
        const height: number = canvas.height;

        object.clearRect(0, 0, width + 1, height + 1);

        // canvas reset
        canvas.width = canvas.height = 1;

        // pool
        pool.push(canvas);
    }
};