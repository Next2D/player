import { execute } from "./LoadUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Loader } from "@next2d/display";
import { URLRequest } from "@next2d/net";

vi.mock("@next2d/display", () => {
    const mockLoaderInfo = {
        data: null,
        content: null,
        addEventListener: vi.fn()
    };

    const mockLoader = {
        contentLoaderInfo: mockLoaderInfo,
        load: vi.fn(async () => {})
    };

    return {
        Loader: vi.fn(function() {
            return mockLoader;
        }),
        stage: {
            stageWidth: 240,
            stageHeight: 240,
            frameRate: 60,
            backgroundColor: "#ffffff",
            addChild: vi.fn()
        }
    };
});

vi.mock("@next2d/net", () => ({
    URLRequest: vi.fn()
}));

vi.mock("../../Player/usecase/PlayerBootUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../Player/usecase/PlayerResizeEventUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../Player/usecase/PlayerReadyCompleteUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../Player/service/PlayerRemoveLoadingElementService", () => ({
    execute: vi.fn()
}));

vi.mock("../../Player/service/PlayerAppendElementService", () => ({
    execute: vi.fn()
}));

vi.mock("../../Canvas/service/CanvasSetPositionService", () => ({
    execute: vi.fn()
}));

describe("LoadUseCase.js test", () =>
{
    beforeEach(async () => {
        vi.clearAllMocks();
        const { stage, Loader } = await import("@next2d/display");
        stage.stageWidth = 240;
        stage.stageHeight = 240;
        stage.frameRate = 60;
        stage.backgroundColor = "#ffffff";
        
        const loaderInstance = new Loader();
        loaderInstance.contentLoaderInfo.data = null;
        loaderInstance.contentLoaderInfo.content = null;
    });

    it("execute test case1 - return early when URL is empty", async () =>
    {
        const { Loader } = await import("@next2d/display");
        const loaderInstance = new Loader();
        
        await execute("");

        expect(loaderInstance.load).not.toHaveBeenCalled();
    });

    it("execute test case2 - load valid URL", async () =>
    {
        const { stage, Loader } = await import("@next2d/display");
        const loaderInstance = new Loader();
        loaderInstance.contentLoaderInfo.data = {
            stage: {
                width: 480,
                height: 320,
                fps: 30,
                bgColor: "#000000"
            }
        };
        loaderInstance.contentLoaderInfo.content = {};

        await execute("https://example.com/content.json");

        expect(loaderInstance.load).toHaveBeenCalled();
        expect(stage.stageWidth).toBe(480);
        expect(stage.stageHeight).toBe(320);
        expect(stage.frameRate).toBe(30);
        expect(stage.backgroundColor).toBe("#000000");
        expect(stage.addChild).toHaveBeenCalled();
    });

    it("execute test case3 - load with custom bgColor option", async () =>
    {
        const { stage, Loader } = await import("@next2d/display");
        const loaderInstance = new Loader();
        loaderInstance.contentLoaderInfo.data = {
            stage: {
                width: 480,
                height: 320,
                fps: 30,
                bgColor: "#000000"
            }
        };
        loaderInstance.contentLoaderInfo.content = {};

        await execute("https://example.com/content.json", { bgColor: "#ff0000" });

        expect(stage.backgroundColor).toBe("#ff0000");
    });

    it("execute test case4 - return early when data is null", async () =>
    {
        const { stage, Loader } = await import("@next2d/display");
        const loaderInstance = new Loader();
        loaderInstance.contentLoaderInfo.data = null;

        await execute("https://example.com/content.json");

        expect(stage.addChild).not.toHaveBeenCalled();
    });

    it("execute test case5 - handle URL with leading slash", async () =>
    {
        const { Loader } = await import("@next2d/display");
        const loaderInstance = new Loader();
        loaderInstance.contentLoaderInfo.data = {
            stage: {
                width: 240,
                height: 240,
                fps: 60,
                bgColor: "#ffffff"
            }
        };
        loaderInstance.contentLoaderInfo.content = {};

        await execute("//example.com/content.json");

        expect(loaderInstance.load).toHaveBeenCalled();
    });

    it("execute test case6 - fps clamping", async () =>
    {
        const { stage, Loader } = await import("@next2d/display");
        const loaderInstance = new Loader();
        loaderInstance.contentLoaderInfo.data = {
            stage: {
                width: 240,
                height: 240,
                fps: 120,
                bgColor: "#ffffff"
            }
        };
        loaderInstance.contentLoaderInfo.content = {};

        await execute("https://example.com/content.json");

        expect(stage.frameRate).toBe(60);
    });
});
