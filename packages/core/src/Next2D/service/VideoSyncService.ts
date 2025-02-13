import type { DisplayObject, DisplayObjectContainer } from "@next2d/display";

/**
 * @description DisplayObject の子要素に Video が含まれている場合、ロードが完了するまで待機します。
 *              If the child element of DisplayObject contains Video, wait until the loading is complete.
 *
 * @param  {DisplayObject} display_object
 * @return {Promise<void>}
 * @method
 * @protected
 */
export const execute = async <D extends DisplayObject> (display_object: D): Promise<void> =>
{
    switch (true) {

        case display_object.isVideo:
            break;

        case display_object.isContainerEnabled:
            {
                const children = (display_object as unknown as DisplayObjectContainer).children;
                for (let idx = 0; idx < children.length; ++idx) {

                    const displayObject = children[idx];
                    if (!displayObject) {
                        continue;
                    }

                    if (displayObject.isVideo) {
                        await displayObject.play();
                        displayObject.pause();

                        await new Promise<void>((resolve) =>
                        {
                            const wait = async (): Promise<void> =>
                            {
                                if (displayObject.loaded) {
                                    displayObject.seek(0);
                                    resolve();
                                } else {
                                    requestAnimationFrame(wait);
                                }
                            };
                            requestAnimationFrame(wait);
                        });
                    }

                    if (displayObject.isContainerEnabled) {
                        await execute(displayObject as DisplayObjectContainer);
                    }
                }
            }
            break;

        default:
            break;

    }
};