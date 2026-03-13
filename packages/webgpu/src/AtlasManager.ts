import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { TexturePacker } from "@next2d/texture-packer";

const $MAX_VALUE: number = Number.MAX_VALUE;
const $MIN_VALUE: number = -Number.MAX_VALUE;

let $activeAtlasIndex: number = 0;

export const $setActiveAtlasIndex = (index: number): void =>
{
    $activeAtlasIndex = index;
};

export const $getActiveAtlasIndex = (): number =>
{
    return $activeAtlasIndex;
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

type AtlasCreator = (index: number) => IAttachmentObject;

let $atlasCreator: AtlasCreator | null = null;

export const $setAtlasCreator = (creator: AtlasCreator): void =>
{
    $atlasCreator = creator;
};

export const $getAtlasAttachmentObject = (): IAttachmentObject | null =>
{
    if (!($activeAtlasIndex in $atlasAttachmentObjects)) {
        if ($atlasCreator) {
            const attachment = $atlasCreator($activeAtlasIndex);
            $setAtlasAttachmentObject(attachment);
        } else {
            return null;
        }
    }
    return $atlasAttachmentObjects[$activeAtlasIndex];
};

export const $getAtlasAttachmentObjectByIndex = (index: number): IAttachmentObject | null =>
{
    if (!(index in $atlasAttachmentObjects)) {
        return null;
    }
    return $atlasAttachmentObjects[index];
};

export const $hasAtlasAttachmentObject = (): boolean =>
{
    return $activeAtlasIndex in $atlasAttachmentObjects;
};

export const $rootNodes: TexturePacker[] = [];

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

let $currentAtlasIndex: number = 0;

export const $setCurrentAtlasIndex = (index: number): void =>
{
    $currentAtlasIndex = index;
};

export const $getCurrentAtlasIndex = (): number =>
{
    return $currentAtlasIndex;
};

export const $resetAtlas = (): void =>
{
    $rootNodes.length = 0;

    $setActiveAtlasIndex(0);

    for (let idx = 0; idx < $atlasAttachmentObjects.length; idx++) {
        const attachment = $atlasAttachmentObjects[idx];
        if (!attachment) {
            continue;
        }
        if (attachment.texture) {
            attachment.texture.resource.destroy();
        }
        if (attachment.stencil) {
            attachment.stencil.resource.destroy();
        }
        if (attachment.msaaTexture) {
            attachment.msaaTexture.resource.destroy();
        }
        if (attachment.msaaStencil) {
            attachment.msaaStencil.resource.destroy();
        }
    }

    $atlasAttachmentObjects.length = 0;

    $clearTransferBounds();

    $setCurrentAtlasIndex(0);
};
