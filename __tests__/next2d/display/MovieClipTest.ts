import { $PREFIX } from "../../../packages/util/Util";
import { MovieClip } from "../../../packages/display/src/MovieClip";
import { FrameLabel } from "../../../packages/display/src/FrameLabel";

describe("MovieClip.js toString test", () =>
{

    // toString
    it("toString test success", () =>
    {
        expect($PREFIX).toBe("__next2d__");
        expect(new MovieClip().toString()).toBe("[object MovieClip]");
    });

});

describe("MovieClip.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(MovieClip.toString()).toBe("[class MovieClip]");
    });

});

describe("MovieClip.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new MovieClip();
        expect(object.namespace).toBe("next2d.display.MovieClip");
    });

    it("namespace test static", () =>
    {
        expect(MovieClip.namespace).toBe("next2d.display.MovieClip");
    });

});

describe("MovieClip.js property test", () =>
{
    // currentFrame
    it("currentFrame test success", () =>
    {
        let mc = new MovieClip();
        expect(mc.currentFrame).toBe(1);
    });

    it("currentFrame test readonly", () =>
    {
        let mc = new MovieClip();
        try {
            // @ts-ignore
            mc.currentFrame = 10;
        } catch (e) {}

        expect(mc.currentFrame).toBe(1);
    });

    // currentFrameLabel
    it("currentFrameLabel test success case null", () =>
    {
        let mc = new MovieClip();
        expect(mc.currentFrameLabel).toBe(null);
    });

    it("currentFrameLabel test success case string", () =>
    {
        let mc = new MovieClip();

        mc.addFrameLabel(new FrameLabel("aaa", 1));
        mc.addFrameLabel(new FrameLabel("bbb", 1));

        // @ts-ignore
        expect(mc.currentFrameLabel.name).toBe("bbb");
    });

    it("currentFrameLabel test readonly", () =>
    {
        let mc = new MovieClip();
        try {
            // @ts-ignore
            mc.currentFrameLabel = "aaa";
        } catch (e) {}

        // @ts-ignore
        expect(mc.currentFrameLabel).toBe(null);
    });

    it("currentFrameLabel test success case2", () =>
    {
        let mc = new MovieClip();

        mc._$currentFrame = 2;
        mc.addFrameLabel(new FrameLabel("bbb", 3));
        mc.addFrameLabel(new FrameLabel("aaa", 1));

        // @ts-ignore
        expect(mc.currentFrameLabel).toBe(null);
    });

    // currentLabels
    it("currentLabels test success case1", () =>
    {
        let mc = new MovieClip();
        // @ts-ignore
        expect(mc.currentLabels).toBe(null);
    });

    it("currentLabels test success case2", () =>
    {
        let mc = new MovieClip();

        mc.addFrameLabel(new FrameLabel("aaa", 1));
        mc.addFrameLabel(new FrameLabel("bbb", 2));

        // @ts-ignore
        expect(mc.currentLabels.length).toBe(2);

        // @ts-ignore
        let labels = mc.currentLabels;
        // @ts-ignore
        for (let i = 0; i < labels.length; i++) {

            // @ts-ignore
            let label = labels[i];
            switch (i) {
                case 0:
                    expect(label.name).toBe("aaa");
                    break;
                case 1:
                    expect(label.name).toBe("bbb");
                    break;
            }
        }
    });

    // isPlaying
    it("isPlaying test success", () =>
    {
        let mc = new MovieClip();
        expect(mc.isPlaying).toBe(false);
    });

    it("isPlaying test readonly", () =>
    {
        let mc = new MovieClip();
        try {
            // @ts-ignore
            mc.isPlaying = true;
        } catch (e) {}
        expect(mc.isPlaying).toBe(false);
    });

    it("isPlaying test case1", () =>
    {
        let mc = new MovieClip();
        mc.play();
        expect(mc.isPlaying).toBe(true);
    });

    it("isPlaying test case2", () =>
    {
        let mc = new MovieClip();
        mc.gotoAndPlay(1);
        expect(mc.isPlaying).toBe(true);
    });

    it("isPlaying test case3", () =>
    {
        let mc = new MovieClip();
        mc.gotoAndPlay(1);
        mc.stop();
        expect(mc.isPlaying).toBe(false);
    });

    // totalFrames
    it("totalFrames test success", () =>
    {
        let mc = new MovieClip();
        expect(mc.totalFrames).toBe(1);
    });

    it("totalFrames test readonly", () =>
    {
        let mc = new MovieClip();
        try {
            // @ts-ignore
            mc.totalFrames = 10;
        } catch (e) {}
        expect(mc.totalFrames).toBe(1);
    });

});

describe("MovieClip.js addFrameLabel test", () =>
{

    it("addFrameLabel test success", () =>
    {
        let mc = new MovieClip();
        mc.addFrameLabel(new FrameLabel("test", 1));

        // @ts-ignore
        let labels = mc.currentLabels;
        // @ts-ignore
        expect(labels.length).toBe(1);
        // @ts-ignore
        expect(labels[0] instanceof FrameLabel).toBe(true);
    });

});

describe("MovieClip.js play test", () =>
{

    it("play test success", () =>
    {
        let mc = new MovieClip();
        mc._$stopFlag = true;
        mc.play();
        expect(mc._$stopFlag).toBe(false);
    });

});

describe("MovieClip.js stop test", () =>
{

    it("stop test success", () =>
    {
        let mc = new MovieClip();
        mc._$stopFlag = false;
        mc.stop();
        expect(mc._$stopFlag).toBe(true);
    });

});

describe("MovieClip.js gotoAndPlay test", () =>
{

    it("gotoAndPlay test success case number", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();
        expect(mc.currentFrame).toBe(1);

        mc.gotoAndPlay(2);
        expect(mc.currentFrame).toBe(2);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test success case string", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();
        expect(mc.currentFrame).toBe(1);

        mc.addFrameLabel(new FrameLabel("f1", 1));
        mc.addFrameLabel(new FrameLabel("f2", 2));
        mc.addFrameLabel(new FrameLabel("f3", 3));

        mc.gotoAndPlay("f2");
        expect(mc.currentFrame).toBe(2);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test valid case1", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();

        mc.gotoAndPlay(0);
        expect(mc.currentFrame).toBe(1);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test valid case2", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();

        mc.gotoAndPlay(4);
        expect(mc.currentFrame).toBe(3);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test valid case3", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();

        mc.gotoAndPlay(2);
        mc.gotoAndPlay(-1);
        expect(mc.currentFrame).toBe(1);

        expect(mc._$stopFlag).toBe(false);
    });
});

describe("MovieClip.js gotoAndStop test", () =>
{

    it("gotoAndStop test success case number", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        expect(mc.currentFrame).toBe(1);

        mc.gotoAndStop(2);
        expect(mc.currentFrame).toBe(2);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test success case string", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();
        expect(mc.currentFrame).toBe(1);

        mc.addFrameLabel(new FrameLabel("f1", 1));
        mc.addFrameLabel(new FrameLabel("f2", 2));
        mc.addFrameLabel(new FrameLabel("f3", 3));

        mc.gotoAndStop("f2");
        expect(mc.currentFrame).toBe(2);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test valid case1", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();

        mc.gotoAndStop(0);
        expect(mc.currentFrame).toBe(1);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test valid case2", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();

        mc.gotoAndStop(4);
        expect(mc.currentFrame).toBe(3);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test valid case3", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();

        mc.gotoAndStop(2);
        mc.gotoAndStop(-1);
        expect(mc.currentFrame).toBe(1);

        expect(mc._$stopFlag).toBe(true);
    });

});

describe("MovieClip.js nextFrame test", () =>
{
    it("nextFrame test success", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();

        expect(mc._$stopFlag).toBe(false);
        expect(mc.currentFrame).toBe(1);

        mc.nextFrame();
        expect(mc.currentFrame).toBe(2);
        expect(mc._$stopFlag).toBe(true);

        mc.nextFrame();
        expect(mc.currentFrame).toBe(3);
        expect(mc._$stopFlag).toBe(true);

        mc.nextFrame();
        expect(mc.currentFrame).toBe(3);
        expect(mc._$stopFlag).toBe(true);

    });
});

describe("MovieClip.js prevFrame test", () =>
{
    it("prevFrame test success", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames  = 3;
        mc._$currentFrame = 3;
        mc.play();

        expect(mc._$stopFlag).toBe(false);
        expect(mc.currentFrame).toBe(3);

        mc.prevFrame();
        expect(mc.currentFrame).toBe(2);
        expect(mc._$stopFlag).toBe(true);

        mc.prevFrame();
        expect(mc.currentFrame).toBe(1);
        expect(mc._$stopFlag).toBe(true);

        mc.prevFrame();
        expect(mc.currentFrame).toBe(1);
        expect(mc._$stopFlag).toBe(true);
    });

    it("prevFrame test success case2", () =>
    {
        let mc = new MovieClip();
        mc._$totalFrames  = 3;
        mc._$currentFrame = 1;
        mc.play();

        expect(mc._$stopFlag).toBe(false);
        expect(mc.currentFrame).toBe(1);

        mc.prevFrame();
        expect(mc.currentFrame).toBe(1);
        expect(mc._$stopFlag).toBe(false);

        mc._$currentFrame = 2;
        mc.prevFrame();
        expect(mc.currentFrame).toBe(1);
        expect(mc._$stopFlag).toBe(true);

    });

});

describe("MovieClip.js isPlaying test", () =>
{

    it("default test case1", () =>
    {
        let mc = new MovieClip();
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case1", () =>
    {
        let mc = new MovieClip();
        mc.play();
        expect(mc.isPlaying).toBe(true);
        mc.stop();
        expect(mc.isPlaying).toBe(false);
    });
});
