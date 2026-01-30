import { describe, it, expect, beforeEach } from "vitest";
import { execute } from "./BlendSetModeService";
import { $getCurrentBlendMode, $setCurrentBlendMode } from "../../Blend";

describe("BlendSetModeService", () =>
{
    beforeEach(() =>
    {
        $setCurrentBlendMode("normal");
    });

    it("should set blend mode to normal", () =>
    {
        execute("normal");

        expect($getCurrentBlendMode()).toBe("normal");
    });

    it("should set blend mode to add", () =>
    {
        execute("add");

        expect($getCurrentBlendMode()).toBe("add");
    });

    it("should set blend mode to screen", () =>
    {
        execute("screen");

        expect($getCurrentBlendMode()).toBe("screen");
    });

    it("should set blend mode to alpha", () =>
    {
        execute("alpha");

        expect($getCurrentBlendMode()).toBe("alpha");
    });

    it("should set blend mode to erase", () =>
    {
        execute("erase");

        expect($getCurrentBlendMode()).toBe("erase");
    });

    it("should set blend mode to copy", () =>
    {
        execute("copy");

        expect($getCurrentBlendMode()).toBe("copy");
    });

    it("should change mode from one to another", () =>
    {
        execute("add");
        expect($getCurrentBlendMode()).toBe("add");

        execute("screen");
        expect($getCurrentBlendMode()).toBe("screen");

        execute("normal");
        expect($getCurrentBlendMode()).toBe("normal");
    });
});
