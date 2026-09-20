import type { Node } from "@next2d/texture-packer";
import type { IAttachmentObject } from "./interface/IAttachmentObject";
import type { ITextureObject } from "./interface/ITextureObject";
import { $currentAttachment } from "./FrameBufferManager";
import { $getAtlasAttachmentObject, $setAtlasPageDirty } from "./AtlasManager";
import { $gl, $context, $RENDER_MAX_SIZE } from "./WebGLUtil";
import { execute as bindAttachment } from "./Context/usecase/ContextBindUseCase";
import { execute as beginNode } from "./Context/service/ContextBeginNodeRenderingService";
import { execute as endNode } from "./Context/service/ContextEndNodeRenderingService";
import { execute as updateBounds } from "./Context/service/ContextUpdateTransferBoundsService";
import { execute as resetContext } from "./Context/service/ContextResetService";
import { execute as setTransform } from "./Context/service/ContextSetTransformService";
import { execute as getTexture } from "./TextureManager/usecase/TextureManagerGetTextureUseCase";
import { $boundTextures } from "./TextureManager";
import { execute as bindTexture } from "./TextureManager/usecase/TextureManagerBind0UseCase";
import { execute as getShader } from "./Shader/Variants/Blend/service/VariantsBlendTextBatchShaderService";
import { execute as drawTexture } from "./Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase";
import { execute as resetBlend } from "./Blend/service/BlendResetService";

const maxSize = 1024;
let size = 512;
const limit = 1024;
const data = new Float64Array(limit * 6);
const attachments: IAttachmentObject[] = [];
const origins = new Set<number>();
let canvas: OffscreenCanvas | null = null;
let canvasContext: OffscreenCanvasRenderingContext2D | null = null;
let texture: ITextureObject | null = null;
let count = 0;
let x = 0;
let y = 0;
let rowHeight = 0;
let flushing = false;

const origin = (node: Node): number =>
{
    return (node.index * $RENDER_MAX_SIZE + node.y) * $RENDER_MAX_SIZE + node.x;
};

export const flushTextUploads = (): void =>
{
    if (count) {
        flushPendingTextUploads();
    }
};

const flushPendingTextUploads = (): void =>
{
    if (flushing || !canvas || !canvasContext) {
        return;
    }
    flushing = true;
    const target = $currentAttachment;
    try {
        if (!texture) {
            texture = getTexture(size, size, false, false);
        }
        bindTexture(texture, false);
        $gl.texSubImage2D($gl.TEXTURE_2D, 0, 0, 0, $gl.RGBA, $gl.UNSIGNED_BYTE, canvas);
        const shader = getShader();
        const highp = shader.highp;
        for (let idx = 0; idx < count; ++idx) {
            const attachment = attachments[idx];
            bindAttachment($context, attachment);
            const offset = idx * 6;
            const nx = data[offset];
            const ny = data[offset + 1];
            const width = data[offset + 2];
            const height = data[offset + 3];
            beginNode(nx, ny, width, height);
            highp[0] = nx;
            highp[1] = attachment.height - ny - height;
            highp[2] = width;
            highp[3] = height;
            highp[4] = attachment.width;
            highp[5] = attachment.height;
            highp[8] = data[offset + 4] / size;
            highp[9] = (size - data[offset + 5] - height) / size;
            highp[10] = width / size;
            highp[11] = height / size;
            bindTexture(texture, false);
            resetBlend();
            drawTexture(shader);
            endNode();
        }
    } finally {
        count = 0;
        attachments.length = 0;
        origins.clear();
        x = y = rowHeight = 0;
        canvasContext.clearRect(0, 0, size, size);
        try {
            if (target) {
                bindAttachment($context, target);
            }
        } finally {
            flushing = false;
        }
    }
};

export const flushTextUploadsForNode = (node: Node): void =>
{
    if (origins.has(origin(node))) {
        flushTextUploads();
    }
};

export const queueTextUpload = (node: Node, source: OffscreenCanvas): boolean =>
{
    const width = node.w;
    const height = node.h;
    if (!$currentAttachment || width <= 0 || height <= 0 || width > maxSize || height > maxSize
        || source.width !== width || source.height !== height)
    {
        return false;
    }
    if (width > size || height > size) {
        // Flush with the old dimensions before replacing staging storage.
        disposeTextUploads();
        size = maxSize;
    }
    if (!canvas) {
        canvas = new OffscreenCanvas(size, size);
        canvasContext = canvas.getContext("2d");
    }
    if (!canvasContext) {
        return false;
    }
    flushTextUploadsForNode(node);
    if (count === limit) {
        flushTextUploads();
    }
    if (x + width > size) {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
    }
    if (y + height > size) {
        flushTextUploads();
    }
    const attachment = $getAtlasAttachmentObject();
    canvasContext.drawImage(source, x, y);
    const offset = count * 6;
    data[offset] = node.x;
    data[offset + 1] = node.y;
    data[offset + 2] = width;
    data[offset + 3] = height;
    data[offset + 4] = x;
    data[offset + 5] = y;
    attachments[count++] = attachment;
    origins.add(origin(node));
    x += width;
    rowHeight = Math.max(rowHeight, height);
    $context.newDrawState = true;
    $setAtlasPageDirty(node.index);
    updateBounds(node);
    resetContext($context);
    setTransform($context.$matrix, 1, 0, 0, 1, node.x, attachment.height - node.y - height);
    return true;
};

export const disposeTextUploads = (): void =>
{
    try {
        flushTextUploads();
    } finally {
        if (texture) {
            for (let idx = 0; idx < $boundTextures.length; ++idx) {
                if ($boundTextures[idx] === texture) {
                    $boundTextures[idx] = null;
                }
            }
            $gl.deleteTexture(texture.resource);
            texture = null;
        }
        canvas = null;
        canvasContext = null;
        size = 512;
    }
};
