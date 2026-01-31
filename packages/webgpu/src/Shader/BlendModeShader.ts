import { BlendModeVertex } from "./wgsl/vertex/FilterVertex";
import {
    MultiplyBlendFragment,
    ScreenBlendFragment,
    LightenBlendFragment,
    DarkenBlendFragment,
    OverlayBlendFragment,
    HardLightBlendFragment,
    DifferenceBlendFragment,
    SubtractBlendFragment
} from "./wgsl/fragment/BlendFragment";

/**
 * @description WebGPU用ブレンドモードシェーダー
 *              Blend mode shaders for WebGPU
 */
export class BlendModeShader
{
    /**
     * @description ブレンドモード用の頂点シェーダー
     * @return {string}
     */
    static getVertexShader(): string
    {
        return BlendModeVertex;
    }

    /**
     * @description Multiplyブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getMultiplyShader(): string
    {
        return MultiplyBlendFragment;
    }

    /**
     * @description Screenブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getScreenShader(): string
    {
        return ScreenBlendFragment;
    }

    /**
     * @description Lightenブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getLightenShader(): string
    {
        return LightenBlendFragment;
    }

    /**
     * @description Darkenブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getDarkenShader(): string
    {
        return DarkenBlendFragment;
    }

    /**
     * @description Overlayブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getOverlayShader(): string
    {
        return OverlayBlendFragment;
    }

    /**
     * @description Hard Lightブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getHardLightShader(): string
    {
        return HardLightBlendFragment;
    }

    /**
     * @description Differenceブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getDifferenceShader(): string
    {
        return DifferenceBlendFragment;
    }

    /**
     * @description Subtractブレンド用のフラグメントシェーダー
     * @return {string}
     */
    static getSubtractShader(): string
    {
        return SubtractBlendFragment;
    }
}
