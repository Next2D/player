import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../FilterOffset";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description 度からラジアンへの変換係数
 */
const DEG_TO_RAD: number = Math.PI / 180;

/**
 * @description 32bit整数からRGB値を抽出（プリマルチプライドアルファ対応）
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = (color >> 16 & 0xFF) / 255 * alpha;
    const g = (color >> 8 & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description ベベルフィルターを適用
 *              WebGL版と同様に、erase前処理で差分テクスチャを作成してからブラーを適用
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    distance: number,
    angle: number,
    highlightColor: number,
    highlightAlpha: number,
    shadowColor: number,
    shadowAlpha: number,
    blurX: number,
    blurY: number,
    strength: number,
    quality: number,
    type: number,
    knockout: boolean,
    devicePixelRatio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = sourceAttachment.width;
    const baseHeight = sourceAttachment.height;

    // スケールを計算
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // オフセットを計算（WebGL版と同じ）
    const radian = angle * DEG_TO_RAD;
    const x = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const y = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    // === Erase前処理：差分テクスチャを作成 ===
    // WebGL版の動作：
    // 1. 空のフレームバッファに元の位置でテクスチャを描画
    // 2. オフセット位置「に」同じテクスチャをerase描画
    //
    // WebGPU版での実装：
    // 1. ソーステクスチャを元の位置にコピー
    // 2. オフセット位置「から」サンプルしてerase描画
    //    (画面座標に対してオフセットしたUV座標でサンプル = オフセット位置に描画と同等)
    const eraseAttachment = frameBufferManager.createTemporaryAttachment(baseWidth, baseHeight);

    // Step 1: ソーステクスチャを元の位置にコピー
    commandEncoder.copyTextureToTexture(
        {
            "texture": sourceAttachment.texture!.resource,
            "origin": { "x": 0, "y": 0, "z": 0 }
        },
        {
            "texture": eraseAttachment.texture!.resource,
            "origin": { "x": 0, "y": 0, "z": 0 }
        },
        {
            "width": baseWidth,
            "height": baseHeight
        }
    );

    // Step 2: オフセット位置からサンプルしてerase描画
    // UV = texCoord - offset により、画面の(0,0)でUV(-offset,-offset)をサンプル
    // これはWebGLの「オフセット位置に描画」と等価
    const erasePipeline = pipelineManager.getPipeline("texture_erase");
    const eraseBindGroupLayout = pipelineManager.getBindGroupLayout("texture_copy");

    if (erasePipeline && eraseBindGroupLayout) {
        const eraseSampler = textureManager.createSampler("erase_sampler", true);

        // オフセット用のユニフォーム
        // BlurTextureCopyFragment: uv = (texCoord - offset) * scale
        // 「オフセット位置に描画」= 画面の(offset,offset)にソースの(0,0)を描画
        // = 画面位置Pに対して、ソース位置(P - offset)をサンプル
        // = uv = texCoord - offset（正のoffset）
        const offsetX = x * 2 / baseWidth;
        const offsetY = y * 2 / baseHeight;

        const eraseUniformData = new Float32Array([
            1.0, 1.0,         // scale
            offsetX, offsetY, // offset（正のオフセット）
            0, 0, 0, 0        // padding
        ]);

        const eraseUniformBuffer = device.createBuffer({
            "size": eraseUniformData.byteLength,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(eraseUniformBuffer, 0, eraseUniformData);

        const eraseBindGroup = device.createBindGroup({
            "layout": eraseBindGroupLayout,
            "entries": [
                { "binding": 0, "resource": { "buffer": eraseUniformBuffer } },
                { "binding": 1, "resource": eraseSampler },
                { "binding": 2, "resource": sourceAttachment.texture!.view }
            ]
        });

        const erasePassDescriptor = frameBufferManager.createRenderPassDescriptor(
            eraseAttachment.texture!.view, 0, 0, 0, 0, "load"
        );

        const erasePassEncoder = commandEncoder.beginRenderPass(erasePassDescriptor);
        erasePassEncoder.setPipeline(erasePipeline);
        erasePassEncoder.setBindGroup(0, eraseBindGroup);
        erasePassEncoder.draw(6, 1, 0, 0);
        erasePassEncoder.end();
    }

    // DEBUG: erase処理の結果を直接確認
    // return eraseAttachment;

    // === 差分テクスチャにブラーを適用 ===
    const blurAttachment = filterApplyBlurFilterUseCase(
        eraseAttachment, matrix,
        blurX, blurY, quality,
        devicePixelRatio, config
    );

    // eraseアタッチメントを解放
    frameBufferManager.releaseTemporaryAttachment(eraseAttachment);

    const blurWidth = blurAttachment.width;
    const blurHeight = blurAttachment.height;

    // 出力サイズを計算
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const isInner = type === 1;
    const bevelWidth = Math.ceil(blurWidth + absX * 2);
    const bevelHeight = Math.ceil(blurHeight + absY * 2);
    const width = isInner ? baseWidth : bevelWidth;
    const height = isInner ? baseHeight : bevelHeight;

    // オフセット差分を計算
    const blurOffsetFromBase = (blurWidth - baseWidth) / 2;
    const blurOffsetFromBaseY = (blurHeight - baseHeight) / 2;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getPipeline("bevel_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("bevel_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU BevelFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("bevel_sampler", true);

    // ユニフォームバッファを作成
    const [hr, hg, hb, ha] = intToRGBA(highlightColor, highlightAlpha);
    const [sr, sg, sb, sa] = intToRGBA(shadowColor, shadowAlpha);

    const uniformData = new Float32Array([
        hr, hg, hb, ha,
        sr, sg, sb, sa,
        strength,
        isInner ? 1.0 : 0.0,
        knockout ? 1.0 : 0.0,
        type
    ]);

    const uniformBuffer = device.createBuffer({
        "size": uniformData.byteLength,
        "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // 元テクスチャを適切な位置にコピーした一時テクスチャを作成
    const baseTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    const baseTextureX = isInner ? 0 : Math.floor(absX + blurOffsetFromBase);
    const baseTextureY = isInner ? 0 : Math.floor(absY + blurOffsetFromBaseY);

    if (baseTextureX >= 0 && baseTextureY >= 0 &&
        baseTextureX + baseWidth <= width && baseTextureY + baseHeight <= height) {
        commandEncoder.copyTextureToTexture(
            {
                "texture": sourceAttachment.texture!.resource,
                "origin": { "x": 0, "y": 0, "z": 0 }
            },
            {
                "texture": baseTextureForComposite.texture!.resource,
                "origin": { "x": baseTextureX, "y": baseTextureY, "z": 0 }
            },
            {
                "width": baseWidth,
                "height": baseHeight
            }
        );
    }

    // ブラーテクスチャを適切な位置にコピーした一時テクスチャを作成
    const blurTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    const blurTextureX = isInner ? Math.floor(-blurOffsetFromBase - x) : Math.floor(absX - x);
    const blurTextureY = isInner ? Math.floor(-blurOffsetFromBaseY - y) : Math.floor(absY - y);

    const srcX = Math.max(0, -blurTextureX);
    const srcY = Math.max(0, -blurTextureY);
    const dstX = Math.max(0, blurTextureX);
    const dstY = Math.max(0, blurTextureY);
    const copyWidth = Math.min(blurWidth - srcX, width - dstX);
    const copyHeight = Math.min(blurHeight - srcY, height - dstY);

    if (copyWidth > 0 && copyHeight > 0) {
        commandEncoder.copyTextureToTexture(
            {
                "texture": blurAttachment.texture!.resource,
                "origin": { "x": srcX, "y": srcY, "z": 0 }
            },
            {
                "texture": blurTextureForComposite.texture!.resource,
                "origin": { "x": dstX, "y": dstY, "z": 0 }
            },
            {
                "width": copyWidth,
                "height": copyHeight
            }
        );
    }

    // バインドグループを作成（4バインディング: uniform, sampler, blur, base）
    const bindGroup = device.createBindGroup({
        "layout": bindGroupLayout,
        "entries": [
            { "binding": 0, "resource": { "buffer": uniformBuffer } },
            { "binding": 1, "resource": sampler },
            { "binding": 2, "resource": blurTextureForComposite.texture!.view },
            { "binding": 3, "resource": baseTextureForComposite.texture!.view }
        ]
    });

    // レンダーパスを実行
    const renderPassDescriptor = frameBufferManager.createRenderPassDescriptor(
        destAttachment.texture!.view, 0, 0, 0, 0, "clear"
    );

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    // クリーンアップ
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);
    frameBufferManager.releaseTemporaryAttachment(baseTextureForComposite);
    frameBufferManager.releaseTemporaryAttachment(blurTextureForComposite);

    // オフセットを更新（WebGL版と同じ: 常にbaseOffset+baseTextureXYに設定）
    $offset.x = baseOffsetX + baseTextureX;
    $offset.y = baseOffsetY + baseTextureY;

    return destAttachment;
};
