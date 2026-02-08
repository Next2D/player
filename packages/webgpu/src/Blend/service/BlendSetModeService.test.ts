import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendSetModeService";
import { $currentBlendMode, $setCurrentBlendMode } from "../../Blend";

describe("BlendSetModeService", () =>
{
    beforeEach(() =>
    {
        $setCurrentBlendMode("normal");
    });

    it("should set blend mode to normal", () =>
    {
        execute("normal");

        expect($currentBlendMode).toBe("normal");
    });

    it("should set blend mode to add", () =>
    {
        execute("add");

        expect($currentBlendMode).toBe("add");
    });

    it("should set blend mode to screen", () =>
    {
        execute("screen");

        expect($currentBlendMode).toBe("screen");
    });

    it("should set blend mode to alpha", () =>
    {
        execute("alpha");

        expect($currentBlendMode).toBe("alpha");
    });

    it("should set blend mode to erase", () =>
    {
        execute("erase");

        expect($currentBlendMode).toBe("erase");
    });

    it("should set blend mode to copy", () =>
    {
        execute("copy");

        expect($currentBlendMode).toBe("copy");
    });

    it("should change mode from one to another", () =>
    {
        execute("add");
        expect($currentBlendMode).toBe("add");

        execute("screen");
        expect($currentBlendMode).toBe("screen");

        execute("normal");
        expect($currentBlendMode).toBe("normal");
    });
});
