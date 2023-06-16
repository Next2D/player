import { Easing } from "../../../src/player/next2d/ui/Easing";

describe("Easing.js toString test", function()
{
    it("toString test success", function()
    {
        let object = new Easing();
        expect(object.toString()).toBe("[object Easing]");
    });

});

describe("Easing.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Easing.toString()).toBe("[class Easing]");
    });

});

describe("Easing.js namespace test", function()
{

    it("namespace test public", function()
    {
        expect(new Easing().namespace).toBe("next2d.ui.Easing");
    });

    it("namespace test static", function()
    {
        expect(Easing.namespace).toBe("next2d.ui.Easing");
    });

});

describe("Easing.js method test", function()
{
    it("linear method test", function()
    {
        expect(Easing.linear(0.1, 0.5, 0.5, 1)).toBe(0.55);
    });

    it("inQuad method test", function()
    {
        expect(Easing.inQuad(0.1, 0.5, 0.5, 1)).toBe(0.505);
    });

    it("outQuad method test", function()
    {
        expect(Easing.outQuad(0.1, 0.5, 0.5, 1)).toBe(0.595);
    });

    it("inOutQuad method test", function()
    {
        expect(Easing.inOutQuad(0.1, 0.5, 0.5, 1)).toBe(0.51);
    });

    it("inCubic method test", function()
    {
        expect(Easing.inCubic(0.1, 0.5, 0.5, 1)).toBe(0.5005);
    });

    it("outCubic method test", function()
    {
        expect(Easing.outCubic(0.1, 0.5, 0.5, 1)).toBe(0.6355);
    });

    it("inOutCubic method test", function()
    {
        expect(Easing.inOutCubic(0.1, 0.5, 0.5, 1)).toBe(0.502);
    });

    it("inQuart method test", function()
    {
        expect(Easing.inQuart(0.1, 0.5, 0.5, 1)).toBe(0.50005);
    });

    it("outQuart method test", function()
    {
        expect(Easing.outQuart(0.1, 0.5, 0.5, 1)).toBe(0.6719499999999999);
    });

    it("inOutQuart method test", function()
    {
        expect(Easing.inOutQuart(0.1, 0.5, 0.5, 1)).toBe(0.5004);
    });

    it("inQuint method test", function()
    {
        expect(Easing.inQuint(0.1, 0.5, 0.5, 1)).toBe(0.500005);
    });

    it("outQuint method test", function()
    {
        expect(Easing.outQuint(0.1, 0.5, 0.5, 1)).toBe(0.7047549999999999);
    });

    it("inOutQuint method test", function()
    {
        expect(Easing.inOutQuint(0.1, 0.5, 0.5, 1)).toBe(0.50008);
    });

    it("inSine method test", function()
    {
        expect(Easing.inSine(0.1, 0.5, 0.5, 1)).toBe(0.5061558297024311);
    });

    it("outSine method test", function()
    {
        expect(Easing.outSine(0.1, 0.5, 0.5, 1)).toBe(0.5782172325201155);
    });

    it("inOutSine method test", function()
    {
        expect(Easing.inOutSine(0.1, 0.5, 0.5, 1)).toBe(0.5122358709262116);
    });

    it("inExpo method test", function()
    {
        expect(Easing.inExpo(0.1, 0.5, 0.5, 1)).toBe(0.5009765625);
    });

    it("outExpo method test", function()
    {
        expect(Easing.outExpo(0.1, 0.5, 0.5, 1)).toBe(0.75);
    });

    it("inOutExpo method test", function()
    {
        expect(Easing.inOutExpo(0.1, 0.5, 0.5, 1)).toBe(0.5009765625);
    });

    it("inCirc method test", function()
    {
        expect(Easing.inCirc(0.1, 0.5, 0.5, 1)).toBe(0.5025062814466901);
    });

    it("outCirc method test", function()
    {
        expect(Easing.outCirc(0.1, 0.5, 0.5, 1)).toBe(0.7179449471770336);
    });

    it("inOutCirc method test", function()
    {
        expect(Easing.inOutCirc(0.1, 0.5, 0.5, 1)).toBe(0.5003126955570227);
    });

    it("inBack method test", function()
    {
        expect(Easing.inBack(0.1, 0.5, 0.5, 1)).toBe(0.49284289);
    });

    it("outBack method test", function()
    {
        expect(Easing.outBack(0.1, 0.5, 0.5, 1)).toBe(0.7044139899999999);
    });

    it("inOutBack method test", function()
    {
        expect(Easing.inOutBack(0.1, 0.5, 0.5, 1)).toBe(0.481240724);
    });

    it("inElastic method test", function()
    {
        expect(Easing.inElastic(0.1, 0.5, 0.5, 1)).toBe(0.5009765625);
    });

    it("outElastic method test", function()
    {
        expect(Easing.outElastic(0.1, 0.5, 0.5, 1)).toBe(1.125);
    });

    it("inOutElastic method test", function()
    {
        expect(Easing.inOutElastic(0.1, 0.5, 0.5, 1)).toBe(0.5001695782985028);
    });

    it("outBounce method test", function()
    {
        expect(Easing.outBounce(0.1, 0.5, 0.5, 1)).toBe(0.5378125);
    });

    it("inBounce method test", function()
    {
        expect(Easing.inBounce(0.1, 0.5, 0.5, 1)).toBe(0.5059375);
    });

    it("inOutBounce method test", function()
    {
        expect(Easing.inOutBounce(0.1, 0.5, 0.5, 1)).toBe(0.515);
    });

});

