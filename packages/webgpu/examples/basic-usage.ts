/**
 * @description WebGPU Basic Usage Example
 * This example demonstrates how to initialize and use the Next2D WebGPU renderer
 */

import { Context } from "../src/Context";

async function initializeWebGPU() {
    // Check WebGPU support
    if (!navigator.gpu) {
        console.error("WebGPU is not supported in this browser");
        return null;
    }

    // Request adapter and device
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.error("Failed to get GPU adapter");
        return null;
    }

    const device = await adapter.requestDevice();
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    
    if (!canvas) {
        console.error("Canvas element not found");
        return null;
    }

    const context = canvas.getContext("webgpu");
    if (!context) {
        console.error("Failed to get WebGPU context");
        return null;
    }

    const preferredFormat = navigator.gpu.getPreferredCanvasFormat();
    
    return new Context(device, context, preferredFormat);
}

async function drawBasicShapes(ctx: Context) {
    // フレーム開始
    ctx.beginFrame();

    // Clear background
    ctx.updateBackgroundColor(0.2, 0.2, 0.2, 1.0);
    ctx.fillBackgroundColor();

    // Draw a red rectangle
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(150, 150);
    ctx.lineTo(50, 150);
    ctx.closePath();
    ctx.fillStyle(1.0, 0.0, 0.0, 1.0);
    ctx.fill();

    // Draw a blue circle
    ctx.beginPath();
    ctx.arc(300, 100, 50);
    ctx.fillStyle(0.0, 0.0, 1.0, 1.0);
    ctx.fill();

    // Draw a green bezier curve
    ctx.beginPath();
    ctx.moveTo(400, 50);
    ctx.bezierCurveTo(450, 20, 500, 20, 550, 50);
    ctx.strokeStyle(0.0, 1.0, 0.0, 1.0);
    ctx.stroke();

    // フレーム終了（コマンド送信）
    ctx.endFrame();
}

async function main() {
    const ctx = await initializeWebGPU();
    if (!ctx) {
        return;
    }

    await drawBasicShapes(ctx);
}

// Run when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
