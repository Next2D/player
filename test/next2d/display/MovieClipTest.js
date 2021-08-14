//
// describe("MovieClip.js toString test", function()
// {
//
//     // toString
//     it("toString test success", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.toString()).toBe("[object MovieClip]");
//     });
//
// });
//
// describe("MovieClip.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(Util.$toString(MovieClip)).toBe("[class MovieClip]");
//     });
//
// });
//
//
// describe("MovieClip.js getQualifiedClassName test", function()
// {
//
//     it("getQualifiedClassName test public", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(new MovieClip());
//         expect(str).toBe("flash.display::MovieClip");
//     });
//
//     it("getQualifiedClassName test static", function()
//     {
//         var swf2js = new Swf2js();
//         var str = swf2js.flash.utils.getQualifiedClassName(MovieClip);
//         expect(str).toBe("flash.display::MovieClip");
//     });
//
// });
//
// describe("MovieClip.js property test", function()
// {
//     // currentFrame
//     it("currentFrame test success", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.currentFrame).toBe(1);
//     });
//
//     it("currentFrame test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.currentFrame = 10;
//         expect(mc.currentFrame).toBe(1);
//     });
//
//
//     // currentFrameLabel
//     it("currentFrameLabel test success case null", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.currentFrameLabel).toBe(null);
//     });
//
//     it("currentFrameLabel test success case string", function ()
//     {
//         var mc = new MovieClip();
//
//         mc._$addFrameLabel(new FrameLabel("aaa", 1));
//         mc._$addFrameLabel(new FrameLabel("bbb", 1));
//
//         expect(mc.currentFrameLabel).toBe("bbb");
//     });
//
//     it("currentFrameLabel test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.currentFrameLabel = "aaa";
//         expect(mc.currentFrameLabel).toBe(null);
//     });
//
//     it("currentFrameLabel test success case2", function ()
//     {
//         var mc = new MovieClip();
//
//         mc._$currentFrame = 2;
//         mc._$addFrameLabel(new FrameLabel("bbb", 3));
//         mc._$addFrameLabel(new FrameLabel("aaa", 1));
//
//         expect(mc.currentFrameLabel).toBe(null);
//     });
//
//
//     // currentLabel
//     it("currentLabel test success case null", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.currentLabel).toBe(null);
//     });
//
//     it("currentLabel test success case string", function ()
//     {
//         var mc = new MovieClip();
//
//         mc._$addFrameLabel(new FrameLabel("aaa", 1));
//         mc._$addFrameLabel(new FrameLabel("bbb", 1));
//
//         expect(mc.currentLabel).toBe("aaa");
//     });
//
//     it("currentLabel test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.currentLabel = "aaa";
//         expect(mc.currentLabel).toBe(null);
//     });
//
//     it("currentLabel test success case2", function ()
//     {
//         var mc = new MovieClip();
//         mc._$currentFrame = 2;
//
//         mc._$addFrameLabel(new FrameLabel("bbb", 3));
//         mc._$addFrameLabel(new FrameLabel("aaa", 1));
//
//         expect(mc.currentLabel).toBe("aaa");
//     });
//
//
//     // currentLabels
//     it("currentLabels test success case1", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.currentLabels.length).toBe(0);
//     });
//
//     it("currentLabels test success case2", function ()
//     {
//         var mc = new MovieClip();
//
//         mc._$addFrameLabel(new FrameLabel("aaa", 1));
//         mc._$addFrameLabel(new FrameLabel("bbb", 1));
//
//         expect(mc.currentLabels.length).toBe(2);
//
//         var labels = mc.currentLabels;
//         for (var i = 0; i < labels.length; i++) {
//
//             var label = labels[i];
//
//             switch (i) {
//                 case 0:
//                     expect(label.name).toBe("aaa");
//                     break;
//                 case 1:
//                     expect(label.name).toBe("bbb");
//                     break;
//             }
//         }
//     });
//
//     it("currentLabels test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.currentLabels = [new FrameLabel("aaa", 1), new FrameLabel("bbb", 1)];
//         expect(mc.currentLabels.length).toBe(0);
//     });
//
//
//     // currentScene
//     it("currentScene test success", function ()
//     {
//         var mc = new MovieClip();
//         mc._$totalFrames  = 4;
//         mc._$currentFrame = 1;
//
//         var sceneA = new Scene("a", [], 1);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("b", [], 2);
//         sceneB._$offset = 1;
//
//         var sceneC = new Scene("c", [], 1);
//         sceneC._$offset = 3;
//
//         mc._$scenes = [sceneA, sceneB, sceneC];
//
//         var scene;
//
//         scene = mc.currentScene;
//         expect(scene.name).toBe("a");
//
//         mc._$currentFrame = 2;
//         scene = mc.currentScene;
//         expect(scene.name).toBe("b");
//
//         mc._$currentFrame = 3;
//         scene = mc.currentScene;
//         expect(scene.name).toBe("b");
//
//         mc._$currentFrame = 4;
//         scene = mc.currentScene;
//         expect(scene.name).toBe("c");
//     });
//
//     it("currentScene test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc._$scenes = [new Scene("a", [], 1)];
//
//         mc.currentScene = new Scene("b", [], 2);
//
//         expect(mc.currentScene.name).toBe("a");
//     });
//
//
//     // enabled
//     it("enabled test success case1", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("enabled test success case2", function ()
//     {
//         var mc = new MovieClip();
//         mc.enabled = false;
//         expect(mc.enabled).toBe(false);
//     });
//
//     it("enabled test valid case1", function ()
//     {
//         var mc = new MovieClip();
//         mc.enabled = 0;
//         expect(mc.enabled).toBe(false);
//
//         mc.enabled = "test";
//         expect(mc.enabled).toBe(true);
//     });
//
//
//     // isPlaying
//     it("isPlaying test success", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("isPlaying test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = true;
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("isPlaying test case1", function ()
//     {
//         var mc = new MovieClip();
//         mc.play();
//         expect(mc.isPlaying).toBe(true);
//     });
//
//     it("isPlaying test case2", function ()
//     {
//         // reset
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc.gotoAndPlay(1);
//         expect(mc.isPlaying).toBe(true);
//     });
//
//     it("isPlaying test case3", function ()
//     {
//         // reset
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc.gotoAndPlay(1);
//         mc.stop();
//         expect(mc.isPlaying).toBe(false);
//     });
//
//
//     // scenes
//     it("scenes test success", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.scenes.length).toBe(1);
//     });
//
//     it("scenes test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.scenes = [1,2,3];
//         expect(mc.scenes.length).toBe(1);
//     });
//
//
//     // totalFrames
//     it("totalFrames test success", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.totalFrames).toBe(1);
//     });
//
//     it("totalFrames test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.totalFrames = 10;
//         expect(mc.totalFrames).toBe(1);
//     });
//
//
//     // trackAsMenu
//     it("trackAsMenu test success case1", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("trackAsMenu test success case2", function ()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = false;
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("trackAsMenu test valid", function ()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = 0;
//         expect(mc.trackAsMenu).toBe(false);
//
//         mc.trackAsMenu = "test";
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//
//     // framesLoaded
//     it("framesLoaded test success", function ()
//     {
//         var mc = new MovieClip();
//         expect(mc.framesLoaded).toBe(1);
//     });
//
//     it("framesLoaded test readonly", function ()
//     {
//         var mc = new MovieClip();
//         mc.framesLoaded = 10;
//         expect(mc.framesLoaded).toBe(1);
//     });
// });
//
//
// describe("MovieClip.js _$addFrameLabel test", function()
// {
//
//     it("_$addFrameLabel test success", function ()
//     {
//         var mc = new MovieClip();
//         mc._$addFrameLabel(new FrameLabel("test", 1));
//
//         var fl = mc._$frameLabels[0];
//         expect(fl instanceof FrameLabel).toBe(true);
//     });
//
//     it("_$addFrameLabel test valid1", function ()
//     {
//         var mc = new MovieClip();
//         mc._$addFrameLabel({
//             "name": 10,
//             "frame": 12
//         });
//
//         var fl = mc._$frameLabels[0];
//         expect(fl).toBe(undefined);
//     });
//
// });
//
// //
// // describe("MovieClip.js _$addAction test", function()
// // {
// //
// //     it("_$addAction test success", function ()
// //     {
// //         var mc = new MovieClip();
// //         mc._$addAction(1, new ActionScript([]));
// //
// //         var as = mc._$actions[1][0];
// //         expect(as instanceof Function).toBe(true);
// //     });
// //
// //     it("_$addAction test valid", function ()
// //     {
// //         var mc = new MovieClip();
// //         mc._$addAction(1, {});
// //         expect(mc._$actions[1].length).toBe(0);
// //     });
// //
// //     it("_$addAction test valid2", function ()
// //     {
// //         var mc = new MovieClip();
// //         mc._$addAction("aaa", new ActionScript([]));
// //         expect(mc._$actions[1] === undefined).toBe(true);
// //     });
// //
// // });
//
//
//
// describe("MovieClip.js play test", function()
// {
//
//     it("play test success", function ()
//     {
//         var mc = new MovieClip();
//         mc._$stopFlag = true;
//         mc.play();
//         expect(mc._$stopFlag).toBe(false);
//     });
//
// });
//
//
// describe("MovieClip.js stop test", function()
// {
//
//     it("stop test success", function ()
//     {
//         var mc = new MovieClip();
//         mc._$stopFlag = false;
//         mc.stop();
//         expect(mc._$stopFlag).toBe(true);
//     });
//
// });
//
//
// describe("MovieClip.js gotoAndPlay test", function()
// {
//
//     it("gotoAndPlay test success case number", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.stop();
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndPlay(2);
//         expect(mc.currentFrame).toBe(2);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay test success case string", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.stop();
//         expect(mc.currentFrame).toBe(1);
//
//         mc._$addFrameLabel(new FrameLabel("f1", 1));
//         mc._$addFrameLabel(new FrameLabel("f2", 2));
//         mc._$addFrameLabel(new FrameLabel("f3", 3));
//
//         mc.gotoAndPlay("f2");
//         expect(mc.currentFrame).toBe(2);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay test valid case1", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.stop();
//
//         mc.gotoAndPlay(0);
//         expect(mc.currentFrame).toBe(1);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay test valid case2", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.stop();
//
//         mc.gotoAndPlay(4);
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay test valid case3", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.stop();
//
//         mc.gotoAndPlay(2);
//         mc.gotoAndPlay(-1);
//         expect(mc.currentFrame).toBe(1);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay scene test success", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndPlay(1, "B");
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay scene test valid case1", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndPlay(1, "C");
//         expect(mc.currentFrame).toBe(1);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay scene test valid case2", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndPlay(3, "A");
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//
//     it("gotoAndPlay scene test valid case3", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.stop();
//
//         mc._$addFrameLabel(new FrameLabel("f1", 1));
//         mc._$addFrameLabel(new FrameLabel("f2", 2));
//         mc._$addFrameLabel(new FrameLabel("f3", 3));
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndPlay("f3", "B");
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(false);
//     });
// });
//
//
// describe("MovieClip.js gotoAndStop test", function()
// {
//
//     it("gotoAndStop test success case number", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndStop(2);
//         expect(mc.currentFrame).toBe(2);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop test success case string", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.play();
//         expect(mc.currentFrame).toBe(1);
//
//         mc._$addFrameLabel(new FrameLabel("f1", 1));
//         mc._$addFrameLabel(new FrameLabel("f2", 2));
//         mc._$addFrameLabel(new FrameLabel("f3", 3));
//
//         mc.gotoAndStop("f2");
//         expect(mc.currentFrame).toBe(2);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop test valid case1", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.play();
//
//         mc.gotoAndStop(0);
//         expect(mc.currentFrame).toBe(1);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop test valid case2", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.play();
//
//         mc.gotoAndStop(4);
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop test valid case3", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.play();
//
//         mc.gotoAndStop(2);
//         mc.gotoAndStop(-1);
//         expect(mc.currentFrame).toBe(1);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop scene test success", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.play();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndStop(1, "B");
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop scene test valid case1", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.play();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndStop(1, "C");
//         expect(mc.currentFrame).toBe(1);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop scene test valid case2", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.play();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndStop(3, "A");
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//
//     it("gotoAndStop scene test valid case3", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.play();
//
//         mc._$addFrameLabel(new FrameLabel("f1", 1));
//         mc._$addFrameLabel(new FrameLabel("f2", 2));
//         mc._$addFrameLabel(new FrameLabel("f3", 3));
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.gotoAndStop("f3", "B");
//         expect(mc.currentFrame).toBe(3);
//
//         expect(mc._$stopFlag).toBe(true);
//     });
// });
//
//
// describe("MovieClip.js nextFrame test", function()
// {
//     it("nextFrame test success", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 3;
//         mc.play();
//
//         expect(mc._$stopFlag).toBe(false);
//         expect(mc.currentFrame).toBe(1);
//
//         mc.nextFrame();
//         expect(mc.currentFrame).toBe(2);
//         expect(mc._$stopFlag).toBe(true);
//
//         mc.nextFrame();
//         expect(mc.currentFrame).toBe(3);
//         expect(mc._$stopFlag).toBe(true);
//
//         mc.nextFrame();
//         expect(mc.currentFrame).toBe(3);
//         expect(mc._$stopFlag).toBe(true);
//
//     });
// });
//
//
// describe("MovieClip.js prevFrame test", function()
// {
//     it("prevFrame test success", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames  = 3;
//         mc._$currentFrame = 3;
//         mc.play();
//
//         expect(mc._$stopFlag).toBe(false);
//         expect(mc.currentFrame).toBe(3);
//
//         mc.prevFrame();
//         expect(mc.currentFrame).toBe(2);
//         expect(mc._$stopFlag).toBe(true);
//
//         mc.prevFrame();
//         expect(mc.currentFrame).toBe(1);
//         expect(mc._$stopFlag).toBe(true);
//
//         mc.prevFrame();
//         expect(mc.currentFrame).toBe(1);
//         expect(mc._$stopFlag).toBe(true);
//     });
//
//     it("prevFrame test success case2", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames  = 3;
//         mc._$currentFrame = 1;
//         mc.play();
//
//         expect(mc._$stopFlag).toBe(false);
//         expect(mc.currentFrame).toBe(1);
//
//         mc.prevFrame();
//         expect(mc.currentFrame).toBe(1);
//         expect(mc._$stopFlag).toBe(false);
//
//         mc._$currentFrame = 2;
//         mc.prevFrame();
//         expect(mc.currentFrame).toBe(1);
//         expect(mc._$stopFlag).toBe(true);
//
//     });
//
// });
//
//
// describe("MovieClip.js nextScene test", function()
// {
//     it("nextScene test success", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 4;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.nextScene();
//         expect(mc.currentFrame).toBe(3);
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//     it("nextScene test valid", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames  = 4;
//         mc._$currentFrame = 3;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(3);
//
//         mc.nextScene();
//         expect(mc.currentFrame).toBe(3);
//         expect(mc._$stopFlag).toBe(false);
//     });
// });
//
//
// describe("MovieClip.js prevScene test", function()
// {
//     it("prevScene test success", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames  = 4;
//         mc._$currentFrame = 3;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(3);
//
//         mc.prevScene();
//         expect(mc.currentFrame).toBe(1);
//         expect(mc._$stopFlag).toBe(false);
//     });
//
//     it("prevScene test valid", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames  = 4;
//         mc._$currentFrame = 1;
//         mc.stop();
//
//         var sceneA = new Scene("A", [], 2);
//         sceneA._$offset = 0;
//
//         var sceneB = new Scene("B", [], 2);
//         sceneB._$offset = 2;
//
//         mc._$scenes = [sceneA, sceneB];
//
//         expect(mc.currentFrame).toBe(1);
//
//         mc.prevScene();
//         expect(mc.currentFrame).toBe(1);
//         expect(mc._$stopFlag).toBe(false);
//     });
// });
//
// describe("MovieClip.js enabled test", function()
// {
//
//     it("default test case1", function()
//     {
//         var mc = new MovieClip();
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case2", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = null;
//         expect(mc.enabled).toBe(false);
//     });
//
//     it("default test case3", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = undefined;
//         expect(mc.enabled).toBe(false);
//     });
//
//     it("default test case4", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = true;
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case5", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = "";
//         expect(mc.enabled).toBe(false);
//     });
//
//     it("default test case6", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = "abc";
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = 0;
//         expect(mc.enabled).toBe(false);
//     });
//
//     it("default test case8", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = 1;
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case9", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = 500;
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case10", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = -1;
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case11", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = -500;
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case12", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = {a:0};
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case13", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = function a(){};
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case14", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = [1];
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = [1,2];
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = {};
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case17", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = {toString:function () { return 1; } };
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = {toString:function () { return "1"; } };
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = {toString:function () { return "1a"; } };
//         expect(mc.enabled).toBe(true);
//     });
//
//     it("default test case20", function()
//     {
//         var mc = new MovieClip();
//         mc.enabled = new XML("<a>100</a>");
//         expect(mc.enabled).toBe(true);
//     });
//
// });
//
// describe("MovieClip.js isPlaying test", function()
// {
//
//     it("default test case1", function()
//     {
//         var mc = new MovieClip();
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case2", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = null;
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case3", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = undefined;
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case4", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = true;
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case5", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = "abc";
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case6", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = 1;
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case7", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = {a:0};
//         expect(mc.isPlaying).toBe(false);
//     });
//
//     it("default test case8", function()
//     {
//         var mc = new MovieClip();
//         mc.isPlaying = function a(){};
//         expect(mc.isPlaying).toBe(false);
//     });
//
// });
//
// describe("MovieClip.js trackAsMenu test", function()
// {
//
//     it("default test case1", function()
//     {
//         var mc = new MovieClip();
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("default test case2", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = null;
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("default test case3", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = undefined;
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("default test case4", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = true;
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case5", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = "";
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("default test case6", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = "abc";
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = 0;
//         expect(mc.trackAsMenu).toBe(false);
//     });
//
//     it("default test case8", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = 1;
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case9", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = 500;
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case10", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = -1;
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case11", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = -500;
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case12", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = {a:0};
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case13", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = function a(){};
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case14", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = [1];
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case15", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = [1,2];
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case16", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = {};
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case17", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = {toString:function () { return 1; } };
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case18", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = {toString:function () { return "1"; } };
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case19", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = {toString:function () { return "1a"; } };
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
//     it("default test case20", function()
//     {
//         var mc = new MovieClip();
//         mc.trackAsMenu = new XML("<a>100</a>");
//         expect(mc.trackAsMenu).toBe(true);
//     });
//
// });
//
//
// describe("MovieClip.js _$goToFrame test", function()
// {
//
//     it("_$goToFrame test case1", function()
//     {
//         Util.$error = false;
//         Util.$errorObject = null;
//
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$players = [player];
//         Util.$currentPlayerId = player._$id;
//
//         var mc = new MovieClip();
//         mc._$totalFrames = 10;
//         var result = "";
//         mc.addFrameScript(
//             0, function () { result += "A"; },
//             1, function () { result += "B"; },
//             2, function () { result += "C"; },
//             3, function () { this.gotoAndStop(2); this.gotoAndStop(3); result += "D"; }
//         );
//
//         // frame1
//         player.doAction();
//         expect(result).toBe("A");
//
//         // frame2
//         mc._$canAction = true;
//         mc._$currentFrame++;
//         mc._$setAction();
//         player.doAction();
//         expect(result).toBe("AB");
//
//         // frame3
//         mc._$canAction = true;
//         mc._$currentFrame++;
//         mc._$setAction();
//         player.doAction();
//         expect(result).toBe("ABC");
//
//         // frame4
//         mc._$canAction = true;
//         mc._$currentFrame++;
//         mc._$setAction();
//         player.doAction();
//         expect(result).toBe("ABCDC");
//
//     });
//
// });