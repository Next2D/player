import {$currentPlayer, $PREFIX} from "../../../src/util/Util";
import { Sprite } from "../../../src/next2d/display/Sprite";
import {MovieClip} from "../../../src/next2d/display/MovieClip";

describe("Sprite.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        let sprite = new Sprite();
        expect($PREFIX).toBe("__next2d__");
        expect(sprite.toString()).toBe("[object Sprite]");
    });

});

describe("Sprite.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Sprite.toString()).toBe("[class Sprite]");
    });

});

describe("Sprite.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Sprite();
        expect(object.namespace).toBe("next2d.display.Sprite");
    });

    it("namespace test static", function()
    {
        expect(Sprite.namespace).toBe("next2d.display.Sprite");
    });

});

describe("Sprite.js property test", function()
{

    it("buttonMode test case1", function ()
    {
        let s = new Sprite();
        expect(s.buttonMode).toBe(false);
    });

    it("buttonMode test case2", function ()
    {
        let s = new Sprite();
        s.buttonMode = true;
        expect(s.buttonMode).toBe(true);
    });

});

describe("Sprite.js buttonMode test", function()
{

    it("default test case1", function()
    {
        let sp = new Sprite();
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case4", function()
    {
        let sp = new Sprite();
        sp.buttonMode = true;
        expect(sp.buttonMode).toBe(true);
    });

    it("default test case7", function()
    {
        let sp = new Sprite();
        // @ts-ignore
        sp.buttonMode = 0;
        expect(sp.buttonMode).toBe(false);
    });

    it("default test case8", function()
    {
        let sp = new Sprite();
        // @ts-ignore
        sp.buttonMode = 1;
        expect(sp.buttonMode).toBe(true);
    });

});
