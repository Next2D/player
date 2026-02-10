import type { IAttachmentObject } from "../../interface/IAttachmentObject";

/**
 * @description フレーム終了時に保留中のテクスチャを解放
 *              Release pending textures at end of frame (after submit)
 *
 * @param  {IAttachmentObject[]} pendingReleases
 * @return {void}
 * @method
 * @protected
 */
export const execute = (pendingReleases: IAttachmentObject[]): void => {
    for (const att of pendingReleases) {
        if (att.texture) {
            att.texture.resource.destroy();
        }
        if (att.stencil) {
            att.stencil.resource.destroy();
        }
    }
};
