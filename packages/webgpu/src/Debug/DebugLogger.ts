/**
 * @description WebGPU版のデバッグロガー
 *              Debug logger for WebGPU version
 */

// デバッグモード（trueで有効化）
let $debugEnabled = false;

/**
 * @description デバッグモードを有効化
 */
export const enableDebug = (): void => {
    $debugEnabled = true;
    console.log("[WebGPU Debug] Debug mode enabled");
};

/**
 * @description デバッグモードを無効化
 */
export const disableDebug = (): void => {
    $debugEnabled = false;
};

/**
 * @description デバッグモードの状態を取得
 */
export const isDebugEnabled = (): boolean => {
    return $debugEnabled;
};

/**
 * @description グラデーション関連のデバッグ出力
 */
export const logGradient = (
    label: string,
    data: {
        type?: number;
        stops?: number[];
        gradientMatrix?: Float32Array;
        contextMatrix?: Float32Array;
        inverseMatrix?: Float32Array;
        linearPoints?: Float32Array | null;
        spread?: number;
        focal?: number;
    }
): void => {
    if (!$debugEnabled) { return }

    console.group(`[WebGPU Gradient] ${label}`);

    if (data.type !== undefined) {
        console.log("Type:", data.type === 0 ? "Linear" : "Radial");
    }
    if (data.stops) {
        console.log("Stops count:", data.stops.length / 5);
    }
    if (data.gradientMatrix) {
        console.log("Gradient Matrix:", Array.from(data.gradientMatrix));
    }
    if (data.contextMatrix) {
        console.log("Context Matrix:", Array.from(data.contextMatrix));
    }
    if (data.inverseMatrix) {
        console.log("Inverse Matrix:", Array.from(data.inverseMatrix));
    }
    if (data.linearPoints) {
        console.log("Linear Points:", Array.from(data.linearPoints));
    }
    if (data.spread !== undefined) {
        console.log("Spread:", data.spread);
    }
    if (data.focal !== undefined) {
        console.log("Focal:", data.focal);
    }

    console.groupEnd();
};

/**
 * @description ストローク関連のデバッグ出力
 */
export const logStroke = (
    label: string,
    data: {
        thickness?: number;
        halfThickness?: number;
        vertexCount?: number;
        matrix?: Float32Array;
        viewportWidth?: number;
        viewportHeight?: number;
    }
): void => {
    if (!$debugEnabled) { return }

    console.group(`[WebGPU Stroke] ${label}`);

    if (data.thickness !== undefined) {
        console.log("Thickness (input):", data.thickness);
    }
    if (data.halfThickness !== undefined) {
        console.log("Half Thickness (calculated):", data.halfThickness);
    }
    if (data.vertexCount !== undefined) {
        console.log("Vertex Count:", data.vertexCount);
    }
    if (data.matrix) {
        console.log("Matrix:", Array.from(data.matrix));
    }
    if (data.viewportWidth !== undefined && data.viewportHeight !== undefined) {
        console.log("Viewport:", data.viewportWidth, "x", data.viewportHeight);
    }

    console.groupEnd();
};

/**
 * @description マスク関連のデバッグ出力
 */
export const logMask = (
    label: string,
    data: {
        clipLevel?: number;
        maskValue?: number;
        maskBinary?: string;
        isMaskDrawing?: boolean;
        isMaskTestEnabled?: boolean;
        bounds?: Float32Array;
    }
): void => {
    if (!$debugEnabled) { return }

    console.group(`[WebGPU Mask] ${label}`);

    if (data.clipLevel !== undefined) {
        console.log("Clip Level:", data.clipLevel);
    }
    if (data.maskValue !== undefined) {
        console.log("Mask Value:", data.maskValue, `(0x${data.maskValue.toString(16)})`);
    }
    if (data.maskBinary !== undefined) {
        console.log("Mask Binary:", data.maskBinary);
    }
    if (data.isMaskDrawing !== undefined) {
        console.log("Is Mask Drawing:", data.isMaskDrawing);
    }
    if (data.isMaskTestEnabled !== undefined) {
        console.log("Is Mask Test Enabled:", data.isMaskTestEnabled);
    }
    if (data.bounds) {
        console.log("Bounds:", Array.from(data.bounds));
    }

    console.groupEnd();
};

/**
 * @description インスタンス描画関連のデバッグ出力
 */
export const logInstanced = (
    label: string,
    data: {
        instanceCount?: number;
        globalAlpha?: number;
        mulColor?: number[];
        addColor?: number[];
        matrix?: number[];
        textureRect?: number[];
        isMasked?: boolean;
        maskReference?: number;
        hasMaskedPipeline?: boolean;
        hasStencilView?: boolean;
        useStencil?: boolean;
    }
): void => {
    if (!$debugEnabled) { return }

    console.group(`[WebGPU Instanced] ${label}`);

    if (data.instanceCount !== undefined) {
        console.log("Instance Count:", data.instanceCount);
    }
    if (data.globalAlpha !== undefined) {
        console.log("Global Alpha:", data.globalAlpha);
    }
    if (data.mulColor) {
        console.log("Mul Color:", data.mulColor);
    }
    if (data.addColor) {
        console.log("Add Color:", data.addColor);
    }
    if (data.matrix) {
        console.log("Matrix:", data.matrix);
    }
    if (data.textureRect) {
        console.log("Texture Rect:", data.textureRect);
    }
    if (data.isMasked !== undefined) {
        console.log("Is Masked:", data.isMasked);
    }
    if (data.maskReference !== undefined) {
        console.log("Mask Reference:", data.maskReference);
    }
    if (data.hasMaskedPipeline !== undefined) {
        console.log("Has Masked Pipeline:", data.hasMaskedPipeline);
    }
    if (data.hasStencilView !== undefined) {
        console.log("Has Stencil View:", data.hasStencilView);
    }
    if (data.useStencil !== undefined) {
        console.log("Use Stencil:", data.useStencil);
    }

    console.groupEnd();
};

/**
 * @description 行列をフォーマットして表示
 */
export const logMatrix3x3 = (label: string, matrix: Float32Array | number[]): void => {
    if (!$debugEnabled) { return }

    const m = Array.from(matrix);
    console.group(`[WebGPU Matrix] ${label}`);
    console.log(`| ${m[0]?.toFixed(4)} ${m[1]?.toFixed(4)} ${m[2]?.toFixed(4)} |`);
    console.log(`| ${m[3]?.toFixed(4)} ${m[4]?.toFixed(4)} ${m[5]?.toFixed(4)} |`);
    console.log(`| ${m[6]?.toFixed(4)} ${m[7]?.toFixed(4)} ${m[8]?.toFixed(4)} |`);
    console.groupEnd();
};

/**
 * @description Uniformバッファの内容を表示
 */
export const logUniformBuffer = (label: string, data: Float32Array): void => {
    if (!$debugEnabled) { return }

    console.group(`[WebGPU Uniform] ${label}`);
    console.log("Buffer size:", data.length, "floats");

    // 最初の20要素を表示（グラデーションUniformの場合）
    for (let i = 0; i < Math.min(20, data.length); i++) {
        console.log(`[${i}]:`, data[i]);
    }

    console.groupEnd();
};
