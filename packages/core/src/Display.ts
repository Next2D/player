import type { DisplayImpl } from "./interface/DisplayImpl";
import {
    Sprite,
    MovieClip,
    BitmapData,
    BlendMode,
    DisplayObject,
    FrameLabel,
    Graphics,
    InteractiveObject,
    Loader,
    Shape,
    Stage,
    TextField
} from "@next2d/display";

const display: DisplayImpl = {
    Sprite,
    MovieClip,
    BitmapData,
    BlendMode,
    DisplayObject,
    FrameLabel,
    Graphics,
    InteractiveObject,
    Loader,
    Shape,
    Stage,
    TextField
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