import { execute } from "./ShapeLoadAsyncUseCase";
import { Shape } from "../../Shape";
import { Event } from "@next2d/events";
import { describe, expect, it, vi } from "vitest";

describe("ShapeLoadAsyncUseCase.js test", () =>
{
    it("execute test case1 - returns a Promise", () =>
    {
        const shape = new Shape();
        const url = "https://example.com/image.png";

        const result = execute(shape, url);

        expect(result).toBeInstanceOf(Promise);
    });

    it("execute test case2 - resolves when COMPLETE event dispatched", async () =>
    {
        const shape = new Shape();
        const url = "https://example.com/image.png";

        // addEventListener をモック
        const addEventListenerSpy = vi.spyOn(shape, "addEventListener");

        const promise = execute(shape, url);

        // addEventListener が Event.COMPLETE で呼び出されたことを確認
        expect(addEventListenerSpy).toHaveBeenCalledWith(Event.COMPLETE, expect.any(Function));

        // 手動で COMPLETE イベントをディスパッチ
        shape.dispatchEvent(new Event(Event.COMPLETE));

        // resolve は引数なしで呼ばれるため void を返す
        const result = await promise;
        expect(result).toBeUndefined();
    });

    it("execute test case3 - sets src property on shape", async () =>
    {
        const shape = new Shape();
        const url = "https://example.com/test.png";

        execute(shape, url);

        // src が設定されていることを確認
        expect(shape.src).toBe(url);

        // COMPLETE イベントをディスパッチして解決
        shape.dispatchEvent(new Event(Event.COMPLETE));
    });

    it("execute test case4 - handles data URL", async () =>
    {
        const shape = new Shape();
        const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        const promise = execute(shape, dataUrl);

        expect(shape.src).toBe(dataUrl);

        shape.dispatchEvent(new Event(Event.COMPLETE));

        const result = await promise;
        expect(result).toBeUndefined();
    });

    it("execute test case5 - handles relative URL", async () =>
    {
        const shape = new Shape();
        const relativeUrl = "./images/test.png";

        const promise = execute(shape, relativeUrl);

        expect(shape.src).toBe(relativeUrl);

        shape.dispatchEvent(new Event(Event.COMPLETE));

        const result = await promise;
        expect(result).toBeUndefined();
    });

    it("execute test case6 - handles absolute URL", async () =>
    {
        const shape = new Shape();
        const absoluteUrl = "/assets/image.jpg";

        const promise = execute(shape, absoluteUrl);

        expect(shape.src).toBe(absoluteUrl);

        shape.dispatchEvent(new Event(Event.COMPLETE));

        const result = await promise;
        expect(result).toBeUndefined();
    });

    it("execute test case7 - handles empty string URL", async () =>
    {
        const shape = new Shape();
        const emptyUrl = "";

        const promise = execute(shape, emptyUrl);

        expect(shape.src).toBe(emptyUrl);

        shape.dispatchEvent(new Event(Event.COMPLETE));

        const result = await promise;
        expect(result).toBeUndefined();
    });

    it("execute test case8 - addEventListener called before src assignment", () =>
    {
        const shape = new Shape();
        const url = "https://example.com/image.png";
        
        const callOrder: string[] = [];

        // addEventListener をモック
        const originalAddEventListener = shape.addEventListener.bind(shape);
        vi.spyOn(shape, "addEventListener").mockImplementation((type, listener) => {
            callOrder.push("addEventListener");
            return originalAddEventListener(type, listener);
        });

        // src セッターをモック
        const originalSrc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(shape), "src");
        Object.defineProperty(shape, "src", {
            set: (value: string) => {
                callOrder.push("setSrc");
                if (originalSrc && originalSrc.set) {
                    originalSrc.set.call(shape, value);
                }
            },
            get: () => {
                if (originalSrc && originalSrc.get) {
                    return originalSrc.get.call(shape);
                }
                return "";
            }
        });

        execute(shape, url);

        // addEventListener が src 設定より先に呼び出されることを確認
        expect(callOrder[0]).toBe("addEventListener");
        expect(callOrder[1]).toBe("setSrc");
    });

    it("execute test case9 - preserves shape instance", async () =>
    {
        const shape = new Shape();
        const originalShape = shape;
        const url = "https://example.com/test.png";

        execute(shape, url);

        expect(shape).toBe(originalShape);

        shape.dispatchEvent(new Event(Event.COMPLETE));
    });

    it("execute test case10 - handles multiple calls sequentially", async () =>
    {
        const shape = new Shape();

        const promise1 = execute(shape, "https://example.com/image1.png");
        shape.dispatchEvent(new Event(Event.COMPLETE));
        await promise1;

        const promise2 = execute(shape, "https://example.com/image2.png");
        expect(shape.src).toBe("https://example.com/image2.png");
        shape.dispatchEvent(new Event(Event.COMPLETE));
        
        const result = await promise2;
        expect(result).toBeUndefined();
    });
});
