import { describe, it, expect } from "vitest";
import { isWebGPUSupported, getPreferredCanvasFormat } from "../src/WebGPUInit";
import { Context } from "../src/Context";
import { $getArray, $getFloat32Array4 } from "../src/WebGPUUtil";

describe("WebGPU Package", () => {
    describe("WebGPUInit", () => {
        it("should check WebGPU support", () => {
            // WebGPUサポートチェック（テスト環境では利用できない）
            // Check WebGPU support (not available in test environment)
            const isSupported = isWebGPUSupported();
            expect(typeof isSupported).toBe("boolean");
        });

        it("should get preferred canvas format", () => {
            // 推奨キャンバスフォーマット取得（テスト環境では null）
            // Get preferred canvas format (null in test environment)
            const format = getPreferredCanvasFormat();
            expect(format === null || typeof format === "string").toBe(true);
        });
    });

    describe("WebGPUUtil", () => {
        it("should manage array pool", () => {
            // 配列プールのテスト
            // Test array pool
            const array1 = $getArray();
            const array2 = $getArray();
            
            expect(Array.isArray(array1)).toBe(true);
            expect(Array.isArray(array2)).toBe(true);
            expect(array1).not.toBe(array2);
        });

        it("should manage Float32Array pool", () => {
            // Float32Arrayプールのテスト
            // Test Float32Array pool
            const array1 = $getFloat32Array4(1, 2, 3, 4);
            const array2 = $getFloat32Array4(5, 6, 7, 8);
            
            expect(array1).toBeInstanceOf(Float32Array);
            expect(array2).toBeInstanceOf(Float32Array);
            expect(array1.length).toBe(4);
            expect(array2.length).toBe(4);
            
            expect(array1[0]).toBe(1);
            expect(array1[1]).toBe(2);
            expect(array1[2]).toBe(3);
            expect(array1[3]).toBe(4);
        });
    });

    describe("Context", () => {
        it("should create mock context for testing", () => {
            // テスト用のモックコンテキスト作成
            // Create mock context for testing
            const mockDevice = {} as GPUDevice;
            const mockCanvasContext = {} as GPUCanvasContext;
            
            // WebGPUが利用できない環境でもテストできるよう、
            // 最低限の初期化だけを行う
            // Perform minimal initialization for testing even when WebGPU is not available
            expect(() => {
                // Context creation would throw in test environment without WebGPU
                // Just test that the class exists and is callable
                expect(typeof Context).toBe("function");
            }).not.toThrow();
        });
    });

    describe("Shader Templates", () => {
        it("should provide WGSL shader templates", async () => {
            // WGSL シェーダーテンプレートのテスト
            // Test WGSL shader templates
            const { TEXTURE_TEMPLATE, VECTOR_TEMPLATE } = await import("../src/Shader/Vertex/VertexShaderSource");
            const { TEXTURE_TEMPLATE: FRAG_TEXTURE } = await import("../src/Shader/Fragment/FragmentShaderSource");
            
            const vertexShader = TEXTURE_TEMPLATE();
            const fragmentShader = FRAG_TEXTURE();
            
            expect(typeof vertexShader).toBe("string");
            expect(typeof fragmentShader).toBe("string");
            
            // WGSL特有の記述が含まれているかチェック
            // Check if WGSL-specific syntax is included
            expect(vertexShader).toContain("@vertex");
            expect(vertexShader).toContain("fn main");
            expect(fragmentShader).toContain("@fragment");
            expect(fragmentShader).toContain("fn main");
        });
    });
});