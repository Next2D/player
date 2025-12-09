import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { $offset } from "../index";
import { execute as filterApplyBlurFilterUseCase } from "../BlurFilter/FilterApplyBlurFilterUseCase";

/**
 * @description 度からラジアンへの変換係数
 */
const DEG_TO_RAD: number = Math.PI / 180;

/**
 * @description 32bit整数からRGB値を抽出（プリマルチプライドアルファ対応）
 */
const intToRGBA = (color: number, alpha: number): [number, number, number, number] => {
    const r = ((color >> 16) & 0xFF) / 255 * alpha;
    const g = ((color >> 8) & 0xFF) / 255 * alpha;
    const b = (color & 0xFF) / 255 * alpha;
    return [r, g, b, alpha];
};

/**
 * @description ドロップシャドウフィルターを適用
 *              Apply drop shadow filter
 *
 * @param  {IAttachmentObject} sourceAttachment - 入力テクスチャ
 * @param  {Float32Array} matrix - 変換行列
 * @param  {number} distance - シャドウの距離
 * @param  {number} angle - シャドウの角度（度）
 * @param  {number} color - シャドウ色 (32bit整数)
 * @param  {number} alpha - アルファ
 * @param  {number} blurX - X方向ブラー量
 * @param  {number} blurY - Y方向ブラー量
 * @param  {number} strength - シャドウ強度
 * @param  {number} quality - クオリティ
 * @param  {boolean} inner - インナーシャドウ
 * @param  {boolean} knockout - ノックアウトモード
 * @param  {boolean} hideObject - 元オブジェクトを隠す
 * @param  {number} devicePixelRatio - デバイスピクセル比
 * @param  {IDropShadowConfig} config - WebGPUリソース設定
 * @return {IAttachmentObject} - フィルター適用後のアタッチメント
 */
export const execute = (
    sourceAttachment: IAttachmentObject,
    matrix: Float32Array,
    distance: number,
    angle: number,
    color: number,
    alpha: number,
    blurX: number,
    blurY: number,
    strength: number,
    quality: number,
    inner: boolean,
    knockout: boolean,
    hideObject: boolean,
    devicePixelRatio: number,
    config: IFilterConfig
): IAttachmentObject => {

    const { device, commandEncoder, frameBufferManager, pipelineManager, textureManager } = config;

    // 元のオフセットを保存
    const baseOffsetX = $offset.x;
    const baseOffsetY = $offset.y;
    const baseWidth = sourceAttachment.width;
    const baseHeight = sourceAttachment.height;

    // ブラーフィルターを適用
    const blurAttachment = filterApplyBlurFilterUseCase(
        sourceAttachment, matrix,
        blurX, blurY, quality,
        devicePixelRatio, config
    );

    const blurWidth = blurAttachment.width;
    const blurHeight = blurAttachment.height;
    const blurOffsetX = $offset.x;
    const blurOffsetY = $offset.y;

    const offsetDiffX = blurOffsetX - baseOffsetX;
    const offsetDiffY = blurOffsetY - baseOffsetY;

    // 変換行列からスケールを取得
    const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

    // シャドウのオフセットを計算
    const radian = angle * DEG_TO_RAD;
    const shadowX = Math.cos(radian) * distance * (xScale / devicePixelRatio);
    const shadowY = Math.sin(radian) * distance * (yScale / devicePixelRatio);

    // 出力キャンバスのサイズを計算
    const w = inner ? baseWidth : blurWidth + Math.max(0, Math.abs(shadowX) - offsetDiffX);
    const h = inner ? baseHeight : blurHeight + Math.max(0, Math.abs(shadowY) - offsetDiffY);
    const width = Math.ceil(w);
    const height = Math.ceil(h);
    const fractionX = (width - w) / 2;
    const fractionY = (height - h) / 2;

    // テクスチャの位置を計算
    const baseTextureX = inner ? 0 : Math.max(0, offsetDiffX - shadowX) + fractionX;
    const baseTextureY = inner ? 0 : Math.max(0, offsetDiffY - shadowY) + fractionY;
    const blurTextureX = inner ? shadowX - blurOffsetX : (shadowX > 0 ? Math.max(0, shadowX - offsetDiffX) : 0) + fractionX;
    const blurTextureY = inner ? shadowY - blurOffsetY : (shadowY > 0 ? Math.max(0, shadowY - offsetDiffY) : 0) + fractionY;

    // 出力アタッチメントを作成
    const destAttachment = frameBufferManager.createTemporaryAttachment(width, height);

    const pipeline = pipelineManager.getPipeline("drop_shadow_filter");
    const bindGroupLayout = pipelineManager.getBindGroupLayout("drop_shadow_filter");

    if (!pipeline || !bindGroupLayout) {
        console.error("[WebGPU DropShadowFilter] Pipeline not found");
        frameBufferManager.releaseTemporaryAttachment(blurAttachment);
        return sourceAttachment;
    }

    // サンプラーを作成
    const sampler = textureManager.createSampler("drop_shadow_sampler", true);

    // タイプとノックアウト状態を決定
    let isInner = inner;
    let isKnockout = knockout;
    let isHideObject = hideObject;

    if (inner) {
        isKnockout = knockout || hideObject;
    } else if (!knockout && hideObject) {
        // フルモード（シャドウのみ表示）
        isKnockout = true;
        isHideObject = true;
    }

    // ユニフォームバッファを作成
    // color: vec4<f32> (16 bytes)
    // offset: vec2<f32> (8 bytes)
    // strength: f32 (4 bytes)
    // inner: f32 (4 bytes)
    // knockout: f32 (4 bytes)
    // hideObject: f32 (4 bytes)
    // _padding: vec2<f32> (8 bytes)
    // Total: 48 bytes
    const [r, g, b, a] = intToRGBA(color, alpha);

    // テクスチャ座標でのオフセットを計算
    const texOffsetX = (blurTextureX - baseTextureX) / width;
    const texOffsetY = (blurTextureY - baseTextureY) / height;

    const uniformData = new Float32Array([
        r, g, b, a,
        texOffsetX, texOffsetY,
        strength,
        isInner ? 1.0 : 0.0,
        isKnockout ? 1.0 : 0.0,
        isHideObject ? 1.0 : 0.0,
        0.0, 0.0 // padding
    ]);

    const uniformBuffer = device.createBuffer({
        size: uniformData.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    // 元テクスチャを適切な位置にコピーした一時テクスチャを作成
    const baseTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    // 元テクスチャをコピー（オフセット付き）
    const baseX = Math.round(baseTextureX);
    const baseY = Math.round(baseTextureY);
    if (baseX >= 0 && baseY >= 0 &&
        baseX + baseWidth <= width && baseY + baseHeight <= height) {
        commandEncoder.copyTextureToTexture(
            {
                texture: sourceAttachment.texture!.resource,
                origin: { x: 0, y: 0, z: 0 }
            },
            {
                texture: baseTextureForComposite.texture!.resource,
                origin: { x: baseX, y: baseY, z: 0 }
            },
            {
                width: baseWidth,
                height: baseHeight
            }
        );
    }

    // ブラーテクスチャを適切な位置にコピーした一時テクスチャを作成
    const blurTextureForComposite = frameBufferManager.createTemporaryAttachment(width, height);

    const blurX2 = Math.round(blurTextureX);
    const blurY2 = Math.round(blurTextureY);
    const srcX = Math.max(0, -blurX2);
    const srcY = Math.max(0, -blurY2);
    const dstX = Math.max(0, blurX2);
    const dstY = Math.max(0, blurY2);
    const copyWidth = Math.min(blurWidth - srcX, width - dstX);
    const copyHeight = Math.min(blurHeight - srcY, height - dstY);

    if (copyWidth > 0 && copyHeight > 0) {
        commandEncoder.copyTextureToTexture(
            {
                texture: blurAttachment.texture!.resource,
                origin: { x: srcX, y: srcY, z: 0 }
            },
            {
                texture: blurTextureForComposite.texture!.resource,
                origin: { x: dstX, y: dstY, z: 0 }
            },
            {
                width: copyWidth,
                height: copyHeight
            }
        );
    }

    // バインドグループを作成
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: blurTextureForComposite.texture!.view },
            { binding: 3, resource: baseTextureForComposite.texture!.view }
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
    uniformBuffer.destroy();
    frameBufferManager.releaseTemporaryAttachment(blurAttachment);
    frameBufferManager.releaseTemporaryAttachment(baseTextureForComposite);
    frameBufferManager.releaseTemporaryAttachment(blurTextureForComposite);

    // オフセットを更新（インナーの場合は元のオフセットを維持）
    if (inner) {
        $offset.x = baseOffsetX;
        $offset.y = baseOffsetY;
    }

    return destAttachment;
};
