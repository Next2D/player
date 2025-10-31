import { describe, expect, it, vi, beforeEach } from "vitest";
import { Sprite } from "@next2d/display";

vi.mock("@next2d/display", () => ({
    Sprite: class MockSprite {},
    stage: {
        stageWidth: 240,
        stageHeight: 240,
        frameRate: 60,
        addChild: vi.fn(),
        getChildAt: vi.fn()
    }
}));

vi.mock("../../Player/usecase/PlayerBootUseCase", () => ({
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

describe("CreateRootMovieClipUseCase.js test", () =>
{
    let execute: any;
    
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        const { stage } = await import("@next2d/display");
        stage.stageWidth = 240;
        stage.stageHeight = 240;
        stage.frameRate = 60;
        
        const module = await import("./CreateRootMovieClipUseCase");
        execute = module.execute;
    });

    it("execute test case1 - create root with default parameters", async () =>
    {
        const { stage } = await import("@next2d/display");
        const mockSprite = new Sprite();
        stage.addChild.mockReturnValue(mockSprite);

        const result = execute();

        expect(stage.stageWidth).toBe(240);
        expect(stage.stageHeight).toBe(240);
        expect(stage.frameRate).toBe(60);
        expect(stage.addChild).toHaveBeenCalled();
    });

    it("execute test case2 - create root with custom dimensions", async () =>
    {
        const { stage } = await import("@next2d/display");
        const mockSprite = new Sprite();
        stage.addChild.mockReturnValue(mockSprite);

        const result = execute(480, 320, 30);

        expect(stage.stageWidth).toBe(480);
        expect(stage.stageHeight).toBe(320);
        expect(stage.frameRate).toBe(30);
    });

    it("execute test case3 - fps clamping", async () =>
    {
        const { stage } = await import("@next2d/display");
        const mockSprite = new Sprite();
        stage.addChild.mockReturnValue(mockSprite);

        execute(240, 240, 120);

        expect(stage.frameRate).toBe(60);
    });

    it("execute test case4 - return existing root on second call", async () =>
    {
        const { stage } = await import("@next2d/display");
        const mockSprite = new Sprite();
        stage.addChild.mockReturnValue(mockSprite);
        stage.getChildAt.mockReturnValue(mockSprite);

        const first = execute();
        const second = execute();

        expect(stage.getChildAt).toHaveBeenCalledWith(0);
    });
});
