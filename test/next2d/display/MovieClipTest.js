
describe("MovieClip.js toString test", function()
{

    // toString
    it("toString test success", function ()
    {
        expect(new MovieClip().toString()).toBe("[object MovieClip]");
    });

});

describe("MovieClip.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(MovieClip.toString()).toBe("[class MovieClip]");
    });

});

describe("MovieClip.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new MovieClip();
        expect(object.namespace).toBe("next2d.display.MovieClip");
    });

    it("namespace test static", function()
    {
        expect(MovieClip.namespace).toBe("next2d.display.MovieClip");
    });

});

describe("MovieClip.js property test", function()
{
    // currentFrame
    it("currentFrame test success", function ()
    {
        let mc = new MovieClip();
        expect(mc.currentFrame).toBe(1);
    });

    it("currentFrame test readonly", function ()
    {
        let mc = new MovieClip();
        mc.currentFrame = 10;
        expect(mc.currentFrame).toBe(1);
    });

    // currentFrameLabel
    it("currentFrameLabel test success case null", function ()
    {
        let mc = new MovieClip();
        expect(mc.currentFrameLabel).toBe(null);
    });

    it("currentFrameLabel test success case string", function ()
    {
        let mc = new MovieClip();

        mc.addFrameLabel(new FrameLabel("aaa", 1));
        mc.addFrameLabel(new FrameLabel("bbb", 1));

        expect(mc.currentFrameLabel.name).toBe("bbb");
    });

    it("currentFrameLabel test readonly", function ()
    {
        let mc = new MovieClip();
        mc.currentFrameLabel = "aaa";
        expect(mc.currentFrameLabel).toBe(null);
    });

    it("currentFrameLabel test success case2", function ()
    {
        let mc = new MovieClip();

        mc._$currentFrame = 2;
        mc.addFrameLabel(new FrameLabel("bbb", 3));
        mc.addFrameLabel(new FrameLabel("aaa", 1));

        expect(mc.currentFrameLabel).toBe(null);
    });

    // currentLabels
    it("currentLabels test success case1", function ()
    {
        let mc = new MovieClip();
        expect(mc.currentLabels).toBe(null);
    });

    it("currentLabels test success case2", function ()
    {
        let mc = new MovieClip();

        mc.addFrameLabel(new FrameLabel("aaa", 1));
        mc.addFrameLabel(new FrameLabel("bbb", 2));

        expect(mc.currentLabels.length).toBe(2);

        let labels = mc.currentLabels;
        for (let i = 0; i < labels.length; i++) {

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
    it("isPlaying test success", function ()
    {
        let mc = new MovieClip();
        expect(mc.isPlaying).toBe(false);
    });

    it("isPlaying test readonly", function ()
    {
        let mc = new MovieClip();
        mc.isPlaying = true;
        expect(mc.isPlaying).toBe(false);
    });

    it("isPlaying test case1", function ()
    {
        let mc = new MovieClip();
        mc.play();
        expect(mc.isPlaying).toBe(true);
    });

    it("isPlaying test case2", function ()
    {
        let mc = new MovieClip();
        mc.gotoAndPlay(1);
        expect(mc.isPlaying).toBe(true);
    });

    it("isPlaying test case3", function ()
    {
        let mc = new MovieClip();
        mc.gotoAndPlay(1);
        mc.stop();
        expect(mc.isPlaying).toBe(false);
    });

    // totalFrames
    it("totalFrames test success", function ()
    {
        let mc = new MovieClip();
        expect(mc.totalFrames).toBe(1);
    });

    it("totalFrames test readonly", function ()
    {
        let mc = new MovieClip();
        mc.totalFrames = 10;
        expect(mc.totalFrames).toBe(1);
    });

});

describe("MovieClip.js addFrameLabel test", function()
{

    it("addFrameLabel test success", function ()
    {
        let mc = new MovieClip();
        mc.addFrameLabel(new FrameLabel("test", 1));

        let fl = mc._$labels.get(1);
        expect(fl instanceof FrameLabel).toBe(true);
    });

    it("addFrameLabel test valid1", function ()
    {
        let mc = new MovieClip();
        mc.addFrameLabel({
            "name": 10,
            "frame": 12
        });

        expect(mc._$labels.size).toBe(0);
    });

});

describe("MovieClip.js play test", function()
{

    it("play test success", function ()
    {
        let mc = new MovieClip();
        mc._$stopFlag = true;
        mc.play();
        expect(mc._$stopFlag).toBe(false);
    });

});

describe("MovieClip.js stop test", function()
{

    it("stop test success", function ()
    {
        let mc = new MovieClip();
        mc._$stopFlag = false;
        mc.stop();
        expect(mc._$stopFlag).toBe(true);
    });

});

describe("MovieClip.js gotoAndPlay test", function()
{

    it("gotoAndPlay test success case number", function ()
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();
        expect(mc.currentFrame).toBe(1);

        mc.gotoAndPlay(2);
        expect(mc.currentFrame).toBe(2);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test success case string", function ()
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

    it("gotoAndPlay test valid case1", function ()
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();

        mc.gotoAndPlay(0);
        expect(mc.currentFrame).toBe(1);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test valid case2", function ()
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.stop();

        mc.gotoAndPlay(4);
        expect(mc.currentFrame).toBe(3);

        expect(mc._$stopFlag).toBe(false);
    });

    it("gotoAndPlay test valid case3", function ()
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

describe("MovieClip.js gotoAndStop test", function()
{

    it("gotoAndStop test success case number", function ()
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        expect(mc.currentFrame).toBe(1);

        mc.gotoAndStop(2);
        expect(mc.currentFrame).toBe(2);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test success case string", function ()
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

    it("gotoAndStop test valid case1", function ()
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();

        mc.gotoAndStop(0);
        expect(mc.currentFrame).toBe(1);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test valid case2", function ()
    {
        let mc = new MovieClip();
        mc._$totalFrames = 3;
        mc.play();

        mc.gotoAndStop(4);
        expect(mc.currentFrame).toBe(3);

        expect(mc._$stopFlag).toBe(true);
    });

    it("gotoAndStop test valid case3", function ()
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

describe("MovieClip.js nextFrame test", function()
{
    it("nextFrame test success", function ()
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

describe("MovieClip.js prevFrame test", function()
{
    it("prevFrame test success", function ()
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

    it("prevFrame test success case2", function ()
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

describe("MovieClip.js isPlaying test", function()
{

    it("default test case1", function()
    {
        let mc = new MovieClip();
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case2", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = null;
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case3", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = undefined;
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case4", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = true;
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case5", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = "abc";
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case6", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = 1;
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case7", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = { "a":0 };
        expect(mc.isPlaying).toBe(false);
    });

    it("default test case8", function()
    {
        let mc = new MovieClip();
        mc.isPlaying = function a() {};
        expect(mc.isPlaying).toBe(false);
    });

});

describe("MovieClip.js _$goToFrame test", function()
{
    beforeEach(function() {
        window.next2d = new Next2D();
        window.next2d._$player.stop();
    });

    it("_$goToFrame test case1", function()
    {
        const player = next2d._$player;
        player._$stopFlag = true;

        let mc = new MovieClip();
        mc._$totalFrames = 10;
        let result = "";
        mc.addFrameScript(
            1, function () { result += "A" },
            2, function () { result += "B" },
            3, function () { result += "C" },
            4, function () { this.gotoAndStop(2); this.gotoAndStop(3); result += "D" }
        );

        // frame1
        player._$doAction();
        expect(result).toBe("A");

        // frame2
        mc._$canAction = true;
        mc._$currentFrame++;
        mc._$setAction();
        player._$doAction();
        expect(result).toBe("AB");

        // frame3
        mc._$canAction = true;
        mc._$currentFrame++;
        mc._$setAction();
        player._$doAction();
        expect(result).toBe("ABC");

        // frame4
        mc._$canAction = true;
        mc._$currentFrame++;
        mc._$setAction();
        player._$doAction();
        expect(result).toBe("ABCDC");

    });

});
