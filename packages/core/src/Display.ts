import type { DisplayImpl } from "./interface/DisplayImpl";
import {
    DisplayObject,
    InteractiveObject,
    DisplayObjectContainer,
    Sprite,
    MovieClip,
    BitmapData,
    BlendMode,
    FrameLabel,
    Graphics,
    Loader,
    LoaderInfo,
    Shape,
    Stage,
    TextField
} from "@next2d/display";

const display: DisplayImpl = {
    DisplayObject,
    InteractiveObject,
    DisplayObjectContainer,
    Sprite,
    MovieClip,
    BitmapData,
    BlendMode,
    FrameLabel,
    Graphics,
    Loader,
    LoaderInfo,
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