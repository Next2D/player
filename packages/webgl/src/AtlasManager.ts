import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { TexturePacker } from "@next2d/texture-packer";
import type { ITextureObject } from "./interface/ITextureObject";
import { execute as textureManagerCreateAtlasTextureUseCase } from "./TextureManager/usecase/TextureManagerCreateAtlasTextureUseCase";
import { execute as frameBufferManagerGetAttachmentObjectUseCase } from "./FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase";
import { $RENDER_MAX_SIZE } from "./WebGLUtil";

const $MAX_VALUE: number = Number.MAX_VALUE;
const $MIN_VALUE: number = -Number.MAX_VALUE;

export let $activeAtlasIndex: number = 0;

export const $setActiveAtlasIndex = (index: number): void =>
{
    $activeAtlasIndex = index;
};

const $atlasAttachmentObjects: IAttachmentObject[] = [];

export const $getAtlasAttachmentObjects = (): IAttachmentObject[] =>
{
    return $atlasAttachmentObjects;
};

export const $setAtlasAttachmentObject = (attachment_object: IAttachmentObject): void =>
{
    $atlasAttachmentObjects[$activeAtlasIndex] = attachment_object;
};

export const $getAtlasAttachmentObject = (): IAttachmentObject =>
{
    if (!($activeAtlasIndex in $atlasAttachmentObjects)) {
        $setAtlasAttachmentObject(
            frameBufferManagerGetAttachmentObjectUseCase($RENDER_MAX_SIZE, $RENDER_MAX_SIZE, true)
        );
    }
    return $atlasAttachmentObjects[$activeAtlasIndex];
};

export const $hasAtlasAttachmentObject = (): boolean =>
{
    return $activeAtlasIndex in $atlasAttachmentObjects;
};

export const $rootNodes: TexturePacker[] = [];

export let $atlasTexture: ITextureObject | null = null;

export const $getAtlasTextureObject = (): ITextureObject =>
{
    if (!$atlasTexture) {
        $atlasTexture = textureManagerCreateAtlasTextureUseCase();
    }
    return $atlasTexture as ITextureObject;
};

const $transferBounds: Float32Array[] = [];

export const $getActiveTransferBounds = (index: number): Float32Array =>
{
    if (!(index in $transferBounds)) {
        $transferBounds[index] = new Float32Array([
            $MAX_VALUE,
            $MAX_VALUE,
            $MIN_VALUE,
            $MIN_VALUE
        ]);
    }
    return $transferBounds[index];
};

export const $clearTransferBounds = (): void =>
{
    for (let idx = 0; idx < $transferBounds.length; ++idx) {
        const bounds = $transferBounds[idx];
        if (!bounds) {
            continue;
        }

        bounds[0] = bounds[1] = $MAX_VALUE;
        bounds[2] = bounds[3] = $MIN_VALUE;
    }
};

export let $currentAtlasIndex: number = 0;

export const $setCurrentAtlasIndex = (index: number): void =>
{
    $currentAtlasIndex = index;
};
