import { BlendMode } from "./BlendMode";
import { describe, expect, it } from "vitest";

describe("BlendMode.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new BlendMode().namespace).toBe("next2d.display.BlendMode");
    });

    it("namespace test static", () =>
    {
        expect(BlendMode.namespace).toBe("next2d.display.BlendMode");
    });
});

describe("BlendMode.js property test", () =>
{
    it("ADD test", () =>
    {
        expect(BlendMode.ADD).toBe("add");
    });

    it("ALPHA test", () =>
    {
        expect(BlendMode.ALPHA).toBe("alpha");
    });

    it("DARKEN test", () =>
    {
        expect(BlendMode.DARKEN).toBe("darken");
    });

    it("DIFFERENCE test", () =>
    {
        expect(BlendMode.DIFFERENCE).toBe("difference");
    });

    it("ERASE test", () =>
    {
        expect(BlendMode.ERASE).toBe("erase");
    });

    it("HARDLIGHT test", () =>
    {
        expect(BlendMode.HARDLIGHT).toBe("hardlight");
    });

    it("INVERT test", () =>
    {
        expect(BlendMode.INVERT).toBe("invert");
    });

    it("LAYER test", () =>
    {
        expect(BlendMode.LAYER).toBe("layer");
    });

    it("LIGHTEN test", () =>
    {
        expect(BlendMode.LIGHTEN).toBe("lighten");
    });

    it("MULTIPLY test", () =>
    {
        expect(BlendMode.MULTIPLY).toBe("multiply");
    });

    it("NORMAL test", () =>
    {
        expect(BlendMode.NORMAL).toBe("normal");
    });

    it("OVERLAY test", () =>
    {
        expect(BlendMode.OVERLAY).toBe("overlay");
    });

    it("SCREEN test", () =>
    {
        expect(BlendMode.SCREEN).toBe("screen");
    });

    it("SUBTRACT test", () =>
    {
        expect(BlendMode.SUBTRACT).toBe("subtract");
    });
});