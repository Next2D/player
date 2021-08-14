//
// describe("BitmapData.js toString test", function()
// {
//     // toString
//     it("toString test success", function()
//     {
//         let bitmapData = new BitmapData();
//         expect(bitmapData.toString()).toBe("[object BitmapData]");
//     });
//
// });
//
// describe("BitmapData.js static toString test", function()
// {
//
//     it("static toString test", function()
//     {
//         expect(BitmapData.toString()).toBe("[class BitmapData]");
//     });
//
// });
//
// describe("BitmapData.js namespace test", function()
// {
//
//     it("namespace test public", function()
//     {
//         const object = new BitmapData();
//         expect(object.namespace).toBe("next2d.display.BitmapData");
//     });
//
//     it("namespace test static", function()
//     {
//         expect(BitmapData.namespace).toBe("next2d.display.BitmapData");
//     });
//
// });
//
// describe("BitmapData.js property test", function()
// {
//     // height
//     it("height test success", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(100, 90);
//         expect(bitmap.height).toBe(90);
//     });
//
//     it("height test readonly", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap    = new BitmapData(100, 90);
//         bitmap.height = 10;
//         expect(bitmap.height).toBe(90);
//     });
//
//     // rect
//     it("rect test success", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         expect(bitmap.rect.toString()).toBe("(x=0, y=0, w=256, h=256)");
//     });
//
//     it("rect test readonly", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap    = new BitmapData(100, 100, true, 0xffffff);
//         bitmap.rect   = new Rectangle(0, 0, 256, 256);
//         expect(bitmap.rect.toString()).toBe("(x=0, y=0, w=100, h=100)");
//     });
//
//     // transparent
//     it("transparent test success", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("transparent test readonly", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap         = new BitmapData(100, 100, true, 0xffffff);
//         bitmap.transparent = false;
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     // width
//     it("width test success", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(100);
//         expect(bitmap.width).toBe(100);
//     });
//
//     it("width test readonly", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap   = new BitmapData(100);
//         bitmap.width = 10;
//         expect(bitmap.width).toBe(100);
//     });
//
//     it("instance test", function ()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         expect(new BitmapData() instanceof BitmapData).toBe(true);
//     });
//
// });
//
// describe("BitmapData.js clone test", function()
// {
//     it("clone test", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(80, 30, false, 0xff0000);
//
//         let clone  = bmd.clone();
//
//         // clone check
//         expect(clone.height).toBe(30);
//         expect(clone.rect.height).toBe(30);
//         expect(clone.rect.width).toBe(80);
//         expect(clone.transparent).toBe(false);
//         expect(clone.width).toBe(80);
//
//     });
// });
//
// describe("BitmapData.js getPixel test", function()
// {
//     it("getPixel success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel(0, 0)).toBe(16711680);
//     });
//
//     it("getPixel success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel(29, 29)).toBe(16711680);
//     });
//
//     it("getPixel success case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel(30, 30)).toBe(0);
//     });
//
//     it("getPixel valid case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel("10", "10")).toBe(16711680);
//     });
//
//     it("getPixel valid case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel("10a", "10a")).toBe(16711680);
//     });
//
//     it("getPixel valid case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel(-3, 0)).toBe(0);
//     });
//
// });
//
// describe("BitmapData.js getPixel32 test", function()
// {
//
//     it("getPixel32 success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//     });
//
//     it("getPixel32 success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel32(29, 29)).toBe(4294901760);
//     });
//
//     it("getPixel32 success case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel32(30, 30)).toBe(0);
//     });
//
//     it("getPixel32 valid case1", function()
//     {
//
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel32("10", "10")).toBe(4294901760);
//     });
//
//     it("getPixel32 valid case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel32("10a", "10a")).toBe(4294901760);
//     });
//
//     it("getPixel32 valid case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd = new BitmapData(30, 30, false, 0xff0000);
//         expect(bmd.getPixel32(-3, 0)).toBe(0);
//     });
//
// });
//
// describe("BitmapData.js compare test", function()
// {
//
//     it("compare success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(100, 60, false, 0xFF0000);
//         let bmd2 = new BitmapData(100, 60, false, 0xFFAA00);
//
//         let bmd3 = bmd1.compare(bmd2);
//         expect(bmd3.width).toBe(100);
//         expect(bmd3.height).toBe(60);
//         expect(bmd3.transparent).toBe(true);
//         expect(bmd3.getPixel32(0, 0)).toBe(4278212096);
//
//         let bmd4 = bmd2.compare(bmd1);
//         expect(bmd4.width).toBe(100);
//         expect(bmd4.height).toBe(60);
//         expect(bmd4.transparent).toBe(true);
//         expect(bmd4.getPixel32(0, 0)).toBe(4278233600);
//
//     });
//
//     it("compare success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(100, 60, true, 0xFFFF0000);
//         let bmd2 = new BitmapData(100, 60, true, 0xCCFF0000);
//
//         let bmd3 = bmd1.compare(bmd2);
//         expect(bmd3.width).toBe(100);
//         expect(bmd3.height).toBe(60);
//         expect(bmd3.transparent).toBe(true);
//         expect(bmd3.getPixel32(0, 0)).toBe(872415231);
//
//         let bmd4 = bmd2.compare(bmd1);
//         expect(bmd4.width).toBe(100);
//         expect(bmd4.height).toBe(60);
//         expect(bmd4.transparent).toBe(true);
//         expect(bmd4.getPixel32(1, 1) >>> 24).toBe(205);
//
//     });
//
//     it("compare valid width error", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(90,  50, true, 0xFFFF8800);
//         let bmd2 = new BitmapData(100, 60, true, 0xCCCC6600);
//
//         expect(bmd1.compare(bmd2)).toBe(-3);
//         expect(bmd2.compare(bmd1)).toBe(-3);
//     });
//
//     it("compare valid height error", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(100, 50, true, 0xFFFF8800);
//         let bmd2 = new BitmapData(100, 60, true, 0xCCCC6600);
//
//         expect(bmd1.compare(bmd2)).toBe(-4);
//         expect(bmd2.compare(bmd1)).toBe(-4);
//     });
//
//     it("compare valid alpha error1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(100, 60, false, 0xFF8800);
//         let bmd2 = new BitmapData(100, 60, false, 0xFF8800);
//
//         expect(bmd1.compare(bmd2)).toBe(0);
//         expect(bmd2.compare(bmd1)).toBe(0);
//     });
//
//     it("compare valid alpha error2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(100, 60, true, 0xCCFF8800);
//         let bmd2 = new BitmapData(100, 60, true, 0xCCFF8800);
//
//         expect(bmd1.compare(bmd2)).toBe(0);
//         expect(bmd2.compare(bmd1)).toBe(0);
//     });
//
//     it("compare valid case5", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(100, 60, true,  0xFFFFAA00);
//         let bmd2 = new BitmapData(100, 60, false, 0xFFAA00);
//
//         expect(bmd1.compare(bmd2)).toBe(0);
//         expect(bmd2.compare(bmd1)).toBe(0);
//     });
//
// });
//
// describe("BitmapData.js copyChannel test", function()
// {
//
//     it("copyChannel success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         let rect = new Rectangle(0, 0, 20, 20);
//         let pt   = new Point(10, 10);
//
//         bmd.copyChannel(bmd, rect, pt, BitmapDataChannel.RED, BitmapDataChannel.BLUE);
//
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//         expect(bmd.getPixel32(10, 10)).toBe(4294902015);
//     });
//
//     it("copyChannel valid case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         let rect = new Rectangle(0, 0, 20, 20);
//         let pt   = new Point(10, 10);
//
//         bmd.copyChannel(new Shape(), rect, pt, BitmapDataChannel.RED, BitmapDataChannel.BLUE);
//
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//         expect(bmd.getPixel32(10, 10)).toBe(4294901760);
//     });
//
//     it("copyChannel valid case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         let rect = new Rectangle(0, 0, 20, 20);
//         let pt   = new Point(10, 10);
//
//         bmd.copyChannel(bmd, new Shape(), pt, BitmapDataChannel.RED, BitmapDataChannel.BLUE);
//
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//         expect(bmd.getPixel32(10, 10)).toBe(4294901760);
//     });
//
//     it("copyChannel valid case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         let rect = new Rectangle(0, 0, 20, 20);
//         let pt   = new Point(10, 10);
//
//         bmd.copyChannel(bmd, rect, new Shape(), BitmapDataChannel.RED, BitmapDataChannel.BLUE);
//
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//         expect(bmd.getPixel32(10, 10)).toBe(4294901760);
//     });
//
//     it("copyChannel valid case4", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         let rect = new Rectangle(0, 0, 20, 20);
//         let pt   = new Point(10, 10);
//
//         bmd.copyChannel(bmd, rect, pt, 0, BitmapDataChannel.BLUE);
//
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//         expect(bmd.getPixel32(10, 10)).toBe(4294901760);
//     });
//
//     it("copyChannel valid case5", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         let rect = new Rectangle(0, 0, 20, 20);
//         let pt   = new Point(10, 10);
//
//         bmd.copyChannel(bmd, rect, pt, BitmapDataChannel.RED, 0);
//
//         expect(bmd.getPixel32(0, 0)).toBe(4294901760);
//         expect(bmd.getPixel32(10, 10)).toBe(4294901760);
//     });
//
// });
//
// describe("BitmapData.js dispose test", function()
// {
//
//     it("dispose success", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(100, 80, false, 0x00FF0000);
//         bmd.dispose();
//
//         expect(bmd._$rect.x).toBe(0);
//         expect(bmd._$rect.y).toBe(0);
//         expect(bmd._$rect.width).toBe(0);
//         expect(bmd._$rect.height).toBe(0);
//     });
//
// });
//
// describe("BitmapData.js copyPixels test", function()
// {
//
//     it("copyPixels success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1  = new BitmapData(40, 40, false, 0x000000FF);
//         let bmd2  = new BitmapData(80, 40, false, 0x0000CC44);
//
//         let rect  = new Rectangle(0, 0, 20, 20);
//         let point = new Point(10, 10);
//         bmd2.copyPixels(bmd1, rect, point);
//
//         expect(bmd2.getPixel32(0,0)).toBe(4278242372);
//         expect(bmd2.getPixel32(20,20)).toBe(4278190335);
//     });
//
//     // it("copyPixels success case2", function()
//     // {
//     //     // ------------------------------------------------------------
//     //     // ターゲット用 BitmapData オブジェクトを作成する（32bit）
//     //     // ------------------------------------------------------------
//     //     var bmp_data = new BitmapData( 512 , 512 , true , 0xffc0c0ff );
//     //
//     //     // ------------------------------------------------------------
//     //     // ソース用 BitmapData オブジェクトを作成する（32bit）
//     //     // ------------------------------------------------------------
//     //     var source0 = new BitmapData( 256 , 256 , true , 0xffaa6600 );
//     //
//     //     // ------------------------------------------------------------
//     //     // アルファソース用 BitmapData オブジェクトを作成する（32bit）
//     //     // ------------------------------------------------------------
//     //     var source1 = (function(){
//     //
//     //         // Shape オブジェクトを作成
//     //         var shape = new Shape();
//     //
//     //         // Shape に矩形を描画
//     //         var g = shape.graphics;
//     //         var mtx = new Matrix(256/1638.4,0,0,1,128,0);
//     //         g.beginGradientFill ( GradientType.LINEAR , [0x000000,0x000000] , [0.0,1.0] , [0,255] , mtx );
//     //         g.moveTo (   0 ,   0 );
//     //         g.lineTo (   0 , 256 );
//     //         g.lineTo ( 256 , 256 );
//     //         g.lineTo ( 256 ,   0 );
//     //         g.endFill();
//     //
//     //         // BitmapData オブジェクトを作成する（32bit）
//     //         var bmp_data1 = new BitmapData( 256 , 256 , true , 0x00000000 );
//     //
//     //         // ビットマップに Shape を描画
//     //         bmp_data1.draw(shape);
//     //
//     //         return bmp_data1;
//     //
//     //     })();
//     //
//     //     // ------------------------------------------------------------
//     //     // コピー用パラメータ
//     //     // ------------------------------------------------------------
//     //     // ソースの矩形範囲
//     //     var source_rect = new Rectangle( 50 , 50 , 256 , 128 );
//     //     // ターゲットの位置
//     //     var target_pos = new Point( 20 , 20 );
//     //     // アルファソースの位置
//     //     var alpha_pos = new Point( 150 , 190 );
//     //
//     //     // ------------------------------------------------------------
//     //     // ピクセルカラーを高速コピーする
//     //     // ------------------------------------------------------------
//     //     bmp_data.copyPixels( source0 , source_rect , target_pos , source1 , alpha_pos , true );
//     //
//     //     expect(bmp_data.getPixel32(0, 0)).toBe(4290822399);
//     //     expect(bmp_data.getPixel32(20, 20) >>> 24).toBe(255); // 4289956713
//     //
//     // });
//
// });
//
// describe("BitmapData.js fillRect test", function()
// {
//
//     it("fillRect success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, true, 0xFF00FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0xFF0000FF);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(4278190335);
//         expect(myBitmapData.getPixel32(20, 20)).toBe(4278255360);
//     });
//
//     it("fillRect success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, true, 0x00FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0xFF0000FF);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(4278190335);
//         expect(myBitmapData.getPixel32(20, 20)).toBe(0);
//     });
//
//     it("fillRect success case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, true, 0xFF00FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0x110000FF);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(285212927);
//         expect(myBitmapData.getPixel32(20, 20)).toBe(4278255360);
//     });
//
//     it("fillRect success case4", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, false, 0xFF00FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0x0000FF);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(4278190335);
//         expect(myBitmapData.getPixel32(20, 20)).toBe(4278255360);
//     });
//
//     it("fillRect success case5", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, true, 0xFF00FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0x0000FF);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(0);
//         expect(myBitmapData.getPixel32(20, 20)).toBe(4278255360);
//     });
//
// });
//
// describe("BitmapData.js floodFill test", function()
// {
//
//     it("floodFill success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, false, 0x0000FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0x000000FF);
//         rect = new Rectangle(15, 15, 25, 25);
//         myBitmapData.fillRect(rect, 0x000000FF);
//
//         myBitmapData.floodFill(10, 10, 0x00FF0000);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(4294901760);
//         expect(myBitmapData.getPixel32(0, 39)).toBe(4278255360);
//         expect(myBitmapData.getPixel32(39, 39)).toBe(4294901760);
//         expect(myBitmapData.getPixel32(39, 0)).toBe(4278255360);
//
//     });
//
//     it("floodFill success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(40, 40, false, 0x0000FF00);
//
//         let rect = new Rectangle(0, 0, 20, 20);
//         myBitmapData.fillRect(rect, 0x000000FF);
//
//         rect = new Rectangle(20, 20, 20, 20);
//         myBitmapData.fillRect(rect, 0x000000FF);
//
//         myBitmapData.floodFill(10, 10, 0x00FF0000);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(4294901760);
//         expect(myBitmapData.getPixel32(0, 39)).toBe(4278255360);
//         expect(myBitmapData.getPixel32(39, 39)).toBe(4278190335);
//         expect(myBitmapData.getPixel32(39, 0)).toBe(4278255360);
//
//     });
//
// });
//
// describe("BitmapData.js generateFilterRect test", function()
// {
//
//     // BlurFilter
//     it("BlurFilter success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 1)).toString()).toBe("(x=8, y=8, w=44, h=14)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 2)).toString()).toBe("(x=6, y=6, w=48, h=18)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 3)).toString()).toBe("(x=4, y=4, w=52, h=22)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 4)).toString()).toBe("(x=4, y=4, w=52, h=22)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 5)).toString()).toBe("(x=3, y=3, w=54, h=24)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 6)).toString()).toBe("(x=2, y=2, w=56, h=26)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 7)).toString()).toBe("(x=2, y=2, w=56, h=26)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 8)).toString()).toBe("(x=1, y=1, w=58, h=28)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 9)).toString()).toBe("(x=1, y=1, w=58, h=28)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 10)).toString()).toBe("(x=1, y=1, w=58, h=28)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 11)).toString()).toBe("(x=0, y=0, w=60, h=30)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 12)).toString()).toBe("(x=-2, y=-2, w=64, h=34)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 13)).toString()).toBe("(x=-2, y=-2, w=64, h=34)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 14)).toString()).toBe("(x=-4, y=-4, w=68, h=38)");
//         expect(bmd.generateFilterRect(rect, new BlurFilter(4, 4, 15)).toString()).toBe("(x=-4, y=-4, w=68, h=38)");
//     });
//
//     it("BlurFilter success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//         expect(bmd.generateFilterRect(rect, new BlurFilter(0, 0, 1)).toString()).toBe("(x=9, y=9, w=42, h=12)");
//     });
//
//     it("BlurFilter success case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//         expect(bmd.generateFilterRect(rect, new BlurFilter(120, 120, 15)).toString()).toBe("(x=-410, y=-410, w=880, h=850)");
//     });
//
//     // BevelFilter
//     it("BevelFilter success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//
//         let ret = [
//             "(x=4, y=8, w=52, h=14)",
//             "(x=5, y=8, w=50, h=14)",
//             "(x=5, y=7, w=50, h=16)",
//             "(x=5, y=7, w=50, h=16)",
//             "(x=5, y=6, w=50, h=18)",
//             "(x=6, y=5, w=48, h=20)",
//             "(x=6, y=5, w=48, h=20)",
//             "(x=7, y=5, w=46, h=20)",
//             "(x=8, y=5, w=44, h=20)",
//             "(x=8, y=4, w=44, h=22)",
//             "(x=7, y=5, w=46, h=20)",// 10
//             "(x=6, y=5, w=48, h=20)",
//             "(x=6, y=5, w=48, h=20)",
//             "(x=5, y=5, w=50, h=20)",
//             "(x=4, y=6, w=52, h=18)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=3, y=7, w=54, h=16)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=4, y=6, w=52, h=18)",// 20
//             "(x=4, y=5, w=52, h=20)",
//             "(x=4, y=5, w=52, h=20)",
//             "(x=5, y=4, w=50, h=22)",
//             "(x=5, y=4, w=50, h=22)",
//             "(x=6, y=4, w=48, h=22)",
//             "(x=7, y=4, w=46, h=22)",
//             "(x=7, y=3, w=46, h=24)",
//             "(x=7, y=4, w=46, h=22)",
//             "(x=7, y=4, w=46, h=22)",
//             "(x=6, y=4, w=48, h=22)",// 30
//             "(x=6, y=4, w=48, h=22)",
//             "(x=5, y=5, w=50, h=20)",
//             "(x=5, y=5, w=50, h=20)",
//             "(x=5, y=6, w=50, h=18)",
//             "(x=5, y=7, w=50, h=16)",
//             "(x=4, y=8, w=52, h=14)"
//         ];
//
//         let filter = new BevelFilter();
//         for (let i = 0; i < 37; i++) {
//             filter.angle = 10 * i;
//             expect(bmd.generateFilterRect(rect, filter).toString()).toBe(ret[i]);
//         }
//
//     });
//
//     // GlowFilter
//     it("GlowFilter success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//
//         bmd.fillRect(rect, 0xFF0000);
//
//         let filter = new GlowFilter();
//         filter.blurX = 4;
//         filter.blurY = 4;
//
//         expect(bmd.generateFilterRect(rect, filter).toString()).toBe("(x=8, y=8, w=44, h=14)");
//
//     });
//
//     // DropShadowFilter
//     it("DropShadowFilter success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//
//         let ret = [
//             "(x=10, y=8, w=46, h=14)",
//             "(x=10, y=8, w=45, h=14)",
//             "(x=10, y=9, w=45, h=14)",
//             "(x=10, y=9, w=45, h=14)",
//             "(x=10, y=9, w=45, h=15)",
//             "(x=9, y=10, w=45, h=15)",
//             "(x=9, y=10, w=45, h=15)",
//             "(x=9, y=10, w=44, h=15)",
//             "(x=8, y=10, w=44, h=15)",
//             "(x=8, y=10, w=44, h=16)",
//             "(x=7, y=10, w=44, h=15)",// 10
//             "(x=6, y=10, w=45, h=15)",
//             "(x=6, y=10, w=45, h=15)",
//             "(x=5, y=10, w=45, h=15)",
//             "(x=4, y=9, w=46, h=15)",
//             "(x=4, y=9, w=46, h=14)",
//             "(x=4, y=9, w=46, h=14)",
//             "(x=4, y=8, w=46, h=14)",
//             "(x=4, y=8, w=46, h=14)",
//             "(x=4, y=7, w=46, h=14)",
//             "(x=4, y=6, w=46, h=15)",// 20
//             "(x=4, y=5, w=46, h=15)",
//             "(x=4, y=5, w=46, h=15)",
//             "(x=5, y=4, w=45, h=16)",
//             "(x=5, y=4, w=45, h=16)",
//             "(x=6, y=4, w=45, h=16)",
//             "(x=7, y=4, w=44, h=16)",
//             "(x=7, y=4, w=44, h=16)",
//             "(x=8, y=4, w=44, h=16)",
//             "(x=9, y=4, w=44, h=16)",
//             "(x=9, y=4, w=45, h=16)",// 30
//             "(x=9, y=4, w=45, h=16)",
//             "(x=10, y=5, w=45, h=15)",
//             "(x=10, y=5, w=45, h=15)",
//             "(x=10, y=6, w=45, h=15)",
//             "(x=10, y=7, w=45, h=14)",
//             "(x=10, y=8, w=46, h=14)"
//         ];
//
//         let filter = new DropShadowFilter();
//         for (let i = 0; i < 37; i++) {
//             filter.angle = 10 * i;
//             expect(bmd.generateFilterRect(rect, filter).toString()).toBe(ret[i]);
//         }
//     });
//
//     // GradientGlowFilter
//     it("GradientGlowFilter success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//
//         let ret = [
//             "(x=10, y=8, w=46, h=14)",
//             "(x=10, y=8, w=45, h=14)",
//             "(x=10, y=9, w=45, h=14)",
//             "(x=10, y=9, w=45, h=14)",
//             "(x=10, y=9, w=45, h=15)",
//             "(x=9, y=10, w=45, h=15)",
//             "(x=9, y=10, w=45, h=15)",
//             "(x=9, y=10, w=44, h=15)",
//             "(x=8, y=10, w=44, h=15)",
//             "(x=8, y=10, w=44, h=16)",
//             "(x=7, y=10, w=44, h=15)",// 10
//             "(x=6, y=10, w=45, h=15)",
//             "(x=6, y=10, w=45, h=15)",
//             "(x=5, y=10, w=45, h=15)",
//             "(x=4, y=9, w=46, h=15)",
//             "(x=4, y=9, w=46, h=14)",
//             "(x=4, y=9, w=46, h=14)",
//             "(x=4, y=8, w=46, h=14)",
//             "(x=4, y=8, w=46, h=14)",
//             "(x=4, y=7, w=46, h=14)",
//             "(x=4, y=6, w=46, h=15)",// 20
//             "(x=4, y=5, w=46, h=15)",
//             "(x=4, y=5, w=46, h=15)",
//             "(x=5, y=4, w=45, h=16)",
//             "(x=5, y=4, w=45, h=16)",
//             "(x=6, y=4, w=45, h=16)",
//             "(x=7, y=4, w=44, h=16)",
//             "(x=7, y=4, w=44, h=16)",
//             "(x=8, y=4, w=44, h=16)",
//             "(x=9, y=4, w=44, h=16)",
//             "(x=9, y=4, w=45, h=16)",// 30
//             "(x=9, y=4, w=45, h=16)",
//             "(x=10, y=5, w=45, h=15)",
//             "(x=10, y=5, w=45, h=15)",
//             "(x=10, y=6, w=45, h=15)",
//             "(x=10, y=7, w=45, h=14)",
//             "(x=10, y=8, w=46, h=14)"
//         ];
//
//         let filter = new GradientGlowFilter(4, 45, [0xffffff, 0xff0000], [1, 1], [0, 255]);
//         for (let i = 0; i < 37; i++) {
//             filter.angle = 10 * i;
//             expect(bmd.generateFilterRect(rect, filter).toString()).toBe(ret[i]);
//         }
//     });
//
//     // GradientBevelFilter
//     it("GradientBevelFilter success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 30, false, 0xFFCC00);
//         let rect = new Rectangle(10, 10, 40, 10);
//         bmd.fillRect(rect, 0xFF0000);
//
//         let ret = [
//             "(x=4, y=8, w=52, h=14)",
//             "(x=5, y=8, w=50, h=14)",
//             "(x=5, y=7, w=50, h=16)",
//             "(x=5, y=7, w=50, h=16)",
//             "(x=5, y=6, w=50, h=18)",
//             "(x=6, y=5, w=48, h=20)",
//             "(x=6, y=5, w=48, h=20)",
//             "(x=7, y=5, w=46, h=20)",
//             "(x=8, y=5, w=44, h=20)",
//             "(x=8, y=4, w=44, h=22)",
//             "(x=7, y=5, w=46, h=20)",// 10
//             "(x=6, y=5, w=48, h=20)",
//             "(x=6, y=5, w=48, h=20)",
//             "(x=5, y=5, w=50, h=20)",
//             "(x=4, y=6, w=52, h=18)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=3, y=7, w=54, h=16)",
//             "(x=4, y=7, w=52, h=16)",
//             "(x=4, y=6, w=52, h=18)",// 20
//             "(x=4, y=5, w=52, h=20)",
//             "(x=4, y=5, w=52, h=20)",
//             "(x=5, y=4, w=50, h=22)",
//             "(x=5, y=4, w=50, h=22)",
//             "(x=6, y=4, w=48, h=22)",
//             "(x=7, y=4, w=46, h=22)",
//             "(x=7, y=3, w=46, h=24)",
//             "(x=7, y=4, w=46, h=22)",
//             "(x=7, y=4, w=46, h=22)",
//             "(x=6, y=4, w=48, h=22)",// 30
//             "(x=6, y=4, w=48, h=22)",
//             "(x=5, y=5, w=50, h=20)",
//             "(x=5, y=5, w=50, h=20)",
//             "(x=5, y=6, w=50, h=18)",
//             "(x=5, y=7, w=50, h=16)",
//             "(x=4, y=8, w=52, h=14)"
//         ];
//
//         let filter = new GradientBevelFilter(4, 45, [0xffffff, 0xff0000], [1, 1], [0, 255]);
//         for (let i = 0; i < 37; i++) {
//             filter.angle = 10 * i;
//             expect(bmd.generateFilterRect(rect, filter).toString()).toBe(ret[i]);
//         }
//
//     });
//
// });
//
// describe("BitmapData.js getColorBoundsRect test", function()
// {
//
//     // it("getColorBoundsRect success case1", function()
//     // {
//     //     Util.$stages  = [];
//     //     Util.$players = [];
//     //
//     //     var player = new Player();
//     //     Util.$currentPlayerId = player._$id;
//     //     player.initializeCanvas();
//     //
//     //     var bmd  = new BitmapData(80, 40, false, 0xFFFFFF);
//     //     var rect = new Rectangle(0, 0, 80, 20);
//     //     bmd.fillRect(rect, 0xFF0000);
//     //
//     //     var maskColor = 0xFFFFFF;
//     //     var color     = 0xFF0000;
//     //
//     //     var redBounds = bmd.getColorBoundsRect(maskColor, color, true);
//     //     expect(redBounds.toString()).toBe("(x=0, y=0, w=80, h=20)");
//     //
//     //     var notRedBounds = bmd.getColorBoundsRect(maskColor, color, false);
//     //     expect(notRedBounds.toString()).toBe("(x=0, y=20, w=80, h=20)");
//     // });
//     //
//     //
//     // it("getColorBoundsRect success case2", function()
//     // {
//     //     Util.$stages  = [];
//     //     Util.$players = [];
//     //
//     //     var player = new Player();
//     //     Util.$currentPlayerId = player._$id;
//     //     player.initializeCanvas();
//     //
//     //     var color_argb0 = 0xFF998877;
//     //     var color_argb1 = 0xff112233;
//     //
//     //     var bmp_data = new BitmapData( 512 , 512 , true , color_argb0 );
//     //
//     //     bmp_data.setPixel32(  40 , 150 , color_argb1 );
//     //     bmp_data.setPixel32( 200 ,  60 , color_argb1 );
//     //     bmp_data.setPixel32( 420 , 220 , color_argb1 );
//     //
//     //     var mask  = 0xFFFFFF00;
//     //     var rect0 = bmp_data.getColorBoundsRect(  mask , (color_argb1 & mask) );
//     //
//     //     expect(rect0.toString()).toBe("(x=40, y=60, w=381, h=161)");
//     //
//     //     var rect1 = bmp_data.getColorBoundsRect(  mask , (color_argb0 & mask) , false );
//     //     expect(rect1.toString()).toBe("(x=40, y=60, w=381, h=161)");
//     //
//     // });
//
// });
//
// describe("BitmapData.js hitTest test", function()
// {
//
//     it("hitTest Point success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(80, 80, true, 0x00000000);
//         let rect = new Rectangle(20, 20, 40, 40);
//         bmd1.fillRect(rect, 0xFF0000FF);
//
//         let pt1 = new Point(1, 1);
//         expect(bmd1.hitTest(pt1, 0xFF, pt1)).toBe(false);
//
//         let pt2 = new Point(40, 40);
//         expect(bmd1.hitTest(pt1, 0xFF, pt2)).toBe(true);
//
//     });
//
//     it("hitTest Rectangle success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(80, 80, true, 0x00000000);
//         let rect = new Rectangle(20, 20, 40, 40);
//         bmd1.fillRect(rect, 0xFF0000FF);
//
//         expect(bmd1.hitTest(new Point(0, 0), 0xFF, new Rectangle(0, 0, 0 ,0))).toBe(false);
//         expect(bmd1.hitTest(new Point(0, 0), 0xFF, new Rectangle(20, 20, 1 ,1))).toBe(true);
//         expect(bmd1.hitTest(new Point(0, 0), 0xFF, new Rectangle(20, 20, 40 ,40))).toBe(true);
//         expect(bmd1.hitTest(new Point(0, 0), 0xFF, new Rectangle(60, 60, 1 ,1))).toBe(false);
//
//     });
//
//     it("hitTest BitmapData success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd1 = new BitmapData(80, 80, true, 0x00000000);
//         let rect = new Rectangle(20, 20, 40, 40);
//         bmd1.fillRect(rect, 0xFF0000FF);
//
//         let bmd2 = new BitmapData(80, 80, true, 0x00000000);
//         bmd2.fillRect(rect, 0xFF00FF00);
//
//         expect(bmd1.hitTest(
//             new Point(100, 100), 0xFF, bmd2,
//             new Point(140, 140), 0xFF
//         )).toBe(false);
//
//         expect(bmd1.hitTest(
//             new Point(100, 100), 0xFF, bmd2,
//             new Point(139, 139), 0xFF
//         )).toBe(true);
//
//         expect(bmd1.hitTest(
//             new Point(140, 100), 0xFF, bmd2,
//             new Point(140, 140), 0xFF
//         )).toBe(false);
//
//         expect(bmd1.hitTest(
//             new Point(180, 100), 0xFF, bmd2,
//             new Point(140, 140), 0xFF
//         )).toBe(false);
//
//         expect(bmd1.hitTest(
//             new Point(180, 100), 0xFF, bmd2,
//             new Point(141, 139), 0xFF
//         )).toBe(true);
//
//         expect(bmd1.hitTest(
//             new Point(180, 180), 0xFF, bmd2,
//             new Point(140, 140), 0xFF
//         )).toBe(false);
//
//         expect(bmd1.hitTest(
//             new Point(180, 180), 0xFF, bmd2,
//             new Point(141, 141), 0xFF
//         )).toBe(true);
//
//     });
//
// });
//
// // シェーダの丸め誤差でテストに失敗するので、一時的にコメントアウト。
// /*
// describe("BitmapData.js merge test", function()
// {
//
//     it("merge BitmapData success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         var bmd1 = new BitmapData(100, 80, true, 0xFF00FF00);
//         var bmd2 = new BitmapData(100, 80, true, 0xFFFF0000);
//         var rect = new Rectangle(0, 0, 20, 20);
//         var pt = new Point(20, 20);
//         var mult = 0x80; // 50%
//         bmd1.merge(bmd2, rect, pt, mult, mult, mult, mult);
//
//         expect(bmd1.getPixel32(0, 0)).toBe(4278255360);
//         expect(bmd1.getPixel32(20, 20)).toBe(4286545664);
//
//     });
//
//     it("merge BitmapData success case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         var bmd1 = new BitmapData(100, 80, false, 0xFF00FF00);
//         var bmd2 = new BitmapData(100, 80, false, 0xFFFF0000);
//         var rect = new Rectangle(0, 0, 20, 20);
//         var pt = new Point(20, 20);
//         var mult = 0x80; // 50%
//         bmd1.merge(bmd2, rect, pt, mult, mult, mult, mult);
//
//         expect(bmd1.getPixel32(0, 0)).toBe(4278255360);
//         expect(bmd1.getPixel32(20, 20)).toBe(4286545664);
//
//     });
//
// });
// */
//
// describe("BitmapData.js paletteMap test", function()
// {
//
//     it("paletteMap BitmapData success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let myBitmapData = new BitmapData(80, 80, false, 0x00FF0000);
//         myBitmapData.fillRect(new Rectangle(20, 20, 40, 40), 0x0000FF00);
//
//         let redArray = new Array(256);
//         let greenArray = new Array(256);
//
//         for(let i = 0; i < 255; i++) {
//             redArray[i] = 0x00000000;
//             greenArray[i] = 0x00000000;
//         }
//
//         redArray[0xFF] = 0x0000FF00;
//         greenArray[0xFF] = 0x00FF0000;
//
//         let bottomHalf = new Rectangle(0, 0, 100, 40);
//         let pt = new Point(0, 0);
//         myBitmapData.paletteMap(myBitmapData, bottomHalf, pt, redArray, greenArray);
//
//         expect(myBitmapData.getPixel32(0, 0)).toBe(4278255360);
//         expect(myBitmapData.getPixel32(20, 20)).toBe(4294901760);
//
//     });
//
//     // シェーダの丸め誤差でテストに失敗するので、一時的にコメントアウト。
//     /*
//     it("paletteMap BitmapData success case2", function()
//     {
//
//         Util.$stages  = [];
//         Util.$players = [];
//
//         var player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         // ------------------------------------------------------------
//         // ターゲット用 BitmapData オブジェクトを作成する（32bit）
//         // ------------------------------------------------------------
//         var bmp_data = new BitmapData( 512 , 512 , true , 0x00000000 );
//
//         // ------------------------------------------------------------
//         // ソース用 BitmapData オブジェクトを作成する（32bit）
//         // ------------------------------------------------------------
//         var source = new BitmapData( 256 , 256 , true , 0xffa8b8c8 );
//
//         // ------------------------------------------------------------
//         // パレットマップ用パラメータ
//         // ------------------------------------------------------------
//         // ソースの矩形範囲
//         var source_rect = new Rectangle( 50 , 50 , 256 , 128 );
//         // ターゲットの位置
//         var target_pos = new Point( 20 , 20 );
//
//         // ------------------------------------------------------------
//         // パレットマップ用の配列を作成する
//         // ------------------------------------------------------------
//         var map_a = []; // 透過チャンネル用のパレットマップ
//         var map_r = []; // 赤チャンネル用のパレットマップ
//         var map_g = []; // 緑チャンネル用のパレットマップ
//         var map_b = []; // 青チャンネル用のパレットマップ
//
//         // ------------------------------------------------------------
//         // パレットマップを初期化する
//         // ------------------------------------------------------------
//         var i;
//         for(i=0;i < 256;i++){
//             map_a[i] = (i << 24);
//             map_r[i] = (i << 16);
//             map_g[i] = (i <<  8);
//             map_b[i] = (i <<  0);
//         }
//
//         // ------------------------------------------------------------
//         // 赤が 0xa8 である場合、赤(+2) 緑(-3) 青(-5) を加算する
//         // ------------------------------------------------------------
//         map_r[0xa8] += ((2) << 16) + ((-3) << 8) + ((-5) << 0);
//
//         // ------------------------------------------------------------
//         // パレットマップを使って、イメージをコピーする
//         // ------------------------------------------------------------
//         bmp_data.paletteMap( source , source_rect , target_pos , map_r , map_g , map_b , map_a );
//
//         expect(bmp_data.getPixel(20,20)).toBe(11121859);
//
//     });
// */
//
// });
//
// describe("BitmapData.js scroll test", function()
// {
//
//     it("scroll BitmapData success case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bmd  = new BitmapData(80, 80, true, 0xFFCCCCCC);
//         let rect = new Rectangle(0, 0, 40, 40);
//         bmd.fillRect(rect, 0xFFFF0000);
//
//         expect(bmd.getPixel32(50, 20).toString(16)).toBe("ffcccccc");
//
//         bmd.scroll(30, 0);
//
//         expect(bmd.getPixel32(50, 20).toString(16)).toBe("ffff0000");
//     });
//
// });
//
// describe("BitmapData.js transparent test", function()
// {
//     it("default test case1", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case2", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = null;
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case3", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = undefined;
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case4", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = true;
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case5", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = "abc";
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case6", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = 1;
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case7", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = { "a":0 };
//         expect(bitmap.transparent).toBe(true);
//     });
//
//     it("default test case8", function()
//     {
//         Util.$stages  = [];
//         Util.$players = [];
//
//         let player = new Player();
//         Util.$currentPlayerId = player._$id;
//         player.initializeCanvas();
//
//         let bitmap = new BitmapData(256, 256, true, 0xffcc8800);
//         bitmap.transparent = function a() {};
//         expect(bitmap.transparent).toBe(true);
//     });
// });
