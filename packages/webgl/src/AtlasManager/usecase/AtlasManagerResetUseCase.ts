import { execute as frameBufferManagerReleaseAttachmentObjectUseCase } from "../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase"
import {
    $rootNodes,
    $setActiveAtlasIndex,
    $getAtlasAttachmentObjects
} from "../../AtlasManager";

/**
 * @description アトラス専用の座標マップ、フレームバッファをリセット
 *              Reset the coordinate map and frame buffer dedicated to the atlas
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $rootNodes.length = 0;
    $setActiveAtlasIndex(0);
    
    const atlasAttachmentObjects = $getAtlasAttachmentObjects();
    for (let idx = 0; idx < atlasAttachmentObjects.length; idx++) {
        frameBufferManagerReleaseAttachmentObjectUseCase(
            atlasAttachmentObjects[idx]
        );
    }
    atlasAttachmentObjects.length = 0;
};