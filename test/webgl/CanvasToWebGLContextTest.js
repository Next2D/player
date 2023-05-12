//
//
// describe("CanvasToWebGLContext.js setTransform test", function()
// {
//
//     it("setTransform test case1", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         ctg.setTransform(1, 0, 0, 1, 0, 0);
//
//         expect(ctg._$matrix[0]).toBe(1);
//         expect(ctg._$matrix[1]).toBe(0);
//         expect(ctg._$matrix[2]).toBe(0);
//         expect(ctg._$matrix[3]).toBe(0);
//         expect(ctg._$matrix[4]).toBe(1);
//         expect(ctg._$matrix[5]).toBe(0);
//         expect(ctg._$matrix[6]).toBe(0);
//         expect(ctg._$matrix[7]).toBe(0);
//         expect(ctg._$matrix[8]).toBe(1);
//     });
//
//
//     it("setTransform test case2", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         ctg.setTransform(1.5, 0, 0, 10, 105, 203);
//
//         expect(ctg._$matrix[0]).toBe(1.5);
//         expect(ctg._$matrix[1]).toBe(0);
//         expect(ctg._$matrix[2]).toBe(0);
//         expect(ctg._$matrix[3]).toBe(0);
//         expect(ctg._$matrix[4]).toBe(10);
//         expect(ctg._$matrix[5]).toBe(0);
//         expect(ctg._$matrix[6]).toBe(105);
//         expect(ctg._$matrix[7]).toBe(203);
//         expect(ctg._$matrix[8]).toBe(1);
//     });
//
//
//     it("setTransform test case3", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//         ctg.setTransform(1.5, 0.123, -0.678, 10, 105, 203);
//
//         expect(ctg._$matrix[0]).toBe(1.5);
//         expect(ctg._$matrix[1]).toBe(0.12300000339746475);
//         expect(ctg._$matrix[2]).toBe(0);
//         expect(ctg._$matrix[3]).toBe(-0.6779999732971191);
//         expect(ctg._$matrix[4]).toBe(10);
//         expect(ctg._$matrix[5]).toBe(0);
//         expect(ctg._$matrix[6]).toBe(105);
//         expect(ctg._$matrix[7]).toBe(203);
//         expect(ctg._$matrix[8]).toBe(1);
//     });
// });
//
//
// describe("CanvasToWebGLContext.js lineTo test", function()
// {
//
//     it("lineTo test case1", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         ctg.lineTo(100, 200);
//
//         expect(ctg._$currentPath[0]).toBe(100);
//         expect(ctg._$currentPath[1]).toBe(200);
//     });
//
// });
//
//
// describe("CanvasToWebGLContext.js moveTo test", function()
// {
//
//     it("moveTo test case1", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         ctg.moveTo(10, 20);
//
//         expect(ctg._$currentPath[0]).toBe(10);
//         expect(ctg._$currentPath[1]).toBe(20);
//     });
//
//
//     it("moveTo test case2", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         ctg.moveTo(10, 20);
//         ctg.lineTo(100, 200);
//         ctg.moveTo(90, 40);
//
//         expect(ctg._$currentPath[0]).toBe(90);
//         expect(ctg._$currentPath[1]).toBe(40);
//     });
//
// });
//
//
// describe("CanvasToWebGLContext.js beginPath test", function()
// {
//
//     it("beginPath test case1", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         ctg._$vertices[ctg._$vertices.length] = 1;
//         ctg._$vertices[ctg._$vertices.length] = 1;
//         ctg._$vertices[ctg._$vertices.length] = 1;
//         ctg._$vertices[ctg._$vertices.length] = 1;
//         ctg.beginPath();
//
//         expect(ctg._$vertices.length).toBe(0);
//     });
//
// });
//
//
// describe("CanvasToWebGLContext.js fillStyle test", function()
// {
//
//     it("fillStyle default test case", function()
//     {
//         Util.$players = [];
//         var player =  new Player();
//         player.initializeCanvas();
//         var ctg = player._$context;
//
//         expect(ctg.fillStyle[0]).toBe(1);
//         expect(ctg.fillStyle[1]).toBe(1);
//         expect(ctg.fillStyle[2]).toBe(1);
//         expect(ctg.fillStyle[3]).toBe(1);
//     });
//
//     // it("fillStyle test case1", function()
//     // {
//     //     Util.$players = [];
//     //     var player =  new Player();
//     //     player.initializeCanvas();
//     //     var ctg = player._$context;
//     //
//     //     ctg.fillStyle = 0xff0000;
//     //     expect(ctg.fillStyle[0]).toBe(1);
//     //     expect(ctg.fillStyle[1]).toBe(0);
//     //     expect(ctg.fillStyle[2]).toBe(0);
//     //     expect(ctg.fillStyle[3]).toBe(1);
//     // });
//     //
//     //
//     // it("fillStyle test case2", function()
//     // {
//     //     Util.$players = [];
//     //     var player =  new Player();
//     //     player.initializeCanvas();
//     //     var ctg = player._$context;
//     //
//     //     ctg.fillStyle = "red";
//     //     expect(ctg.fillStyle[0]).toBe(1);
//     //     expect(ctg.fillStyle[1]).toBe(0);
//     //     expect(ctg.fillStyle[2]).toBe(0);
//     //     expect(ctg.fillStyle[3]).toBe(1);
//     // });
//     //
//     //
//     // it("fillStyle test case3", function()
//     // {
//     //     Util.$players = [];
//     //     var player =  new Player();
//     //     player.initializeCanvas();
//     //     var ctg = player._$context;
//     //
//     //     ctg.fillStyle = "#ffff00";
//     //     expect(ctg.fillStyle[0]).toBe(1);
//     //     expect(ctg.fillStyle[1]).toBe(1);
//     //     expect(ctg.fillStyle[2]).toBe(0);
//     //     expect(ctg.fillStyle[3]).toBe(1);
//     // });
//
// });
//
//
