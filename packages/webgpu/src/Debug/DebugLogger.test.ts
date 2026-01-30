import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    enableDebug,
    disableDebug,
    isDebugEnabled,
    logGradient,
    logStroke,
    logMask,
    logInstanced,
    logMatrix3x3,
    logUniformBuffer
} from "./DebugLogger";

describe("DebugLogger", () =>
{
    beforeEach(() =>
    {
        disableDebug();
        vi.restoreAllMocks();
    });

    describe("debug mode toggle", () =>
    {
        it("should default to disabled", () =>
        {
            disableDebug();
            expect(isDebugEnabled()).toBe(false);
        });

        it("should enable debug mode", () =>
        {
            const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
            enableDebug();
            expect(isDebugEnabled()).toBe(true);
            consoleSpy.mockRestore();
        });

        it("should disable debug mode", () =>
        {
            const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
            enableDebug();
            disableDebug();
            expect(isDebugEnabled()).toBe(false);
            consoleSpy.mockRestore();
        });
    });

    describe("logGradient", () =>
    {
        it("should not log when debug is disabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            disableDebug();
            logGradient("test", { "type": 0 });
            expect(groupSpy).not.toHaveBeenCalled();
        });

        it("should log when debug is enabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
            const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

            enableDebug();
            logGradient("test label", { "type": 0, "spread": 1 });

            expect(groupSpy).toHaveBeenCalledWith("[WebGPU Gradient] test label");
            expect(groupEndSpy).toHaveBeenCalled();
        });
    });

    describe("logStroke", () =>
    {
        it("should not log when debug is disabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            disableDebug();
            logStroke("test", { "thickness": 2 });
            expect(groupSpy).not.toHaveBeenCalled();
        });

        it("should log when debug is enabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
            vi.spyOn(console, "log").mockImplementation(() => {});

            enableDebug();
            logStroke("stroke test", { "thickness": 5, "halfThickness": 2.5 });

            expect(groupSpy).toHaveBeenCalledWith("[WebGPU Stroke] stroke test");
            expect(groupEndSpy).toHaveBeenCalled();
        });
    });

    describe("logMask", () =>
    {
        it("should not log when debug is disabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            disableDebug();
            logMask("test", { "clipLevel": 1 });
            expect(groupSpy).not.toHaveBeenCalled();
        });

        it("should log when debug is enabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
            vi.spyOn(console, "log").mockImplementation(() => {});

            enableDebug();
            logMask("mask test", { "clipLevel": 2, "isMaskDrawing": true });

            expect(groupSpy).toHaveBeenCalledWith("[WebGPU Mask] mask test");
            expect(groupEndSpy).toHaveBeenCalled();
        });
    });

    describe("logInstanced", () =>
    {
        it("should not log when debug is disabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            disableDebug();
            logInstanced("test", { "instanceCount": 100 });
            expect(groupSpy).not.toHaveBeenCalled();
        });

        it("should log when debug is enabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
            vi.spyOn(console, "log").mockImplementation(() => {});

            enableDebug();
            logInstanced("instanced test", { "instanceCount": 50, "isMasked": false });

            expect(groupSpy).toHaveBeenCalledWith("[WebGPU Instanced] instanced test");
            expect(groupEndSpy).toHaveBeenCalled();
        });
    });

    describe("logMatrix3x3", () =>
    {
        it("should not log when debug is disabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            disableDebug();
            logMatrix3x3("test", [1, 0, 0, 0, 1, 0, 0, 0, 1]);
            expect(groupSpy).not.toHaveBeenCalled();
        });

        it("should log matrix when debug is enabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
            vi.spyOn(console, "log").mockImplementation(() => {});

            enableDebug();
            logMatrix3x3("identity", new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));

            expect(groupSpy).toHaveBeenCalledWith("[WebGPU Matrix] identity");
            expect(groupEndSpy).toHaveBeenCalled();
        });
    });

    describe("logUniformBuffer", () =>
    {
        it("should not log when debug is disabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            disableDebug();
            logUniformBuffer("test", new Float32Array([1, 2, 3, 4]));
            expect(groupSpy).not.toHaveBeenCalled();
        });

        it("should log buffer info when debug is enabled", () =>
        {
            const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
            const groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
            vi.spyOn(console, "log").mockImplementation(() => {});

            enableDebug();
            logUniformBuffer("uniform test", new Float32Array([1, 2, 3, 4, 5]));

            expect(groupSpy).toHaveBeenCalledWith("[WebGPU Uniform] uniform test");
            expect(groupEndSpy).toHaveBeenCalled();
        });
    });
});
