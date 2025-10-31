import { execute } from "./PlayerBootUseCase";
import { $player } from "../../Player";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../service/PlayerCreateContainerElementService", () => ({
    execute: vi.fn(() => document.createElement("div"))
}));

vi.mock("../service/PlayerApplyContainerElementStyleService", () => ({
    execute: vi.fn()
}));

vi.mock("../service/PlayerLoadingAnimationService", () => ({
    execute: vi.fn()
}));

vi.mock("./PlayerResizeEventUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("./PlayerResizeRegisterUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../Player", () => ({
    $player: {
        setOptions: vi.fn(),
        fixedWidth: false,
        fixedHeight: false
    }
}));

describe("PlayerBootUseCase.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $player.fixedWidth = false;
        $player.fixedHeight = false;
    });

    it("execute test case1 - boot with default options", async () =>
    {
        const { execute: playerCreateContainerElementService } = await import("../service/PlayerCreateContainerElementService");
        const { execute: playerApplyContainerElementStyleService } = await import("../service/PlayerApplyContainerElementStyleService");
        const { execute: playerLoadingAnimationService } = await import("../service/PlayerLoadingAnimationService");
        const { execute: playerResizeEventService } = await import("./PlayerResizeEventUseCase");
        const { execute: playerResizeRegisterService } = await import("./PlayerResizeRegisterUseCase");

        execute();

        expect($player.setOptions).toHaveBeenCalledWith(null);
        expect(playerCreateContainerElementService).toHaveBeenCalled();
        expect(playerApplyContainerElementStyleService).toHaveBeenCalled();
        expect(playerLoadingAnimationService).toHaveBeenCalled();
        expect(playerResizeRegisterService).toHaveBeenCalled();
        expect(playerResizeEventService).toHaveBeenCalled();
    });

    it("execute test case2 - boot with custom options", async () =>
    {
        const options = { bgColor: "#ff0000" };
        
        execute(options);

        expect($player.setOptions).toHaveBeenCalledWith(options);
    });

    it("execute test case3 - boot with fixed width", async () =>
    {
        const { execute: playerResizeRegisterService } = await import("./PlayerResizeRegisterUseCase");
        
        $player.fixedWidth = true;
        $player.fixedHeight = false;

        execute();

        expect(playerResizeRegisterService).not.toHaveBeenCalled();
    });

    it("execute test case4 - boot with fixed height", async () =>
    {
        const { execute: playerResizeRegisterService } = await import("./PlayerResizeRegisterUseCase");
        
        $player.fixedWidth = false;
        $player.fixedHeight = true;

        execute();

        expect(playerResizeRegisterService).not.toHaveBeenCalled();
    });

    it("execute test case5 - boot with both fixed dimensions", async () =>
    {
        const { execute: playerResizeRegisterService } = await import("./PlayerResizeRegisterUseCase");
        
        $player.fixedWidth = true;
        $player.fixedHeight = true;

        execute();

        expect(playerResizeRegisterService).not.toHaveBeenCalled();
    });
});
