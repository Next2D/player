import type { IDisplay } from "./interface/IDisplay";
import {
    Sprite,
    MovieClip,
    BitmapData,
    BlendMode,
    DisplayObject,
    DisplayObjectContainer,
    FrameLabel,
    Graphics,
    InteractiveObject,
    Loader,
    Shape,
    Stage
} from "@next2d/display";

const display: IDisplay = {
    Sprite,
    MovieClip,
    BitmapData,
    BlendMode,
    DisplayObject,
    DisplayObjectContainer,
    FrameLabel,
    Graphics,
    InteractiveObject,
    Loader,
    Shape,
    Stage
};

Object.entries(display).forEach(([key, DisplayClass]) =>
{
    Object.defineProperty(display, key, {
        get()
        {
            return DisplayClass;
        }
    });
});

export { display };