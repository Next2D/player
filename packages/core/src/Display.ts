import type { DisplayImpl } from "@next2d/interface";
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