import { DisplayObject } from "../next2d/display/DisplayObject";
import { InteractiveObject } from "../next2d/display/InteractiveObject";
import { DisplayObjectContainer } from "../next2d/display/DisplayObjectContainer";
import { Sprite } from "../next2d/display/Sprite";
import { MovieClip } from "../next2d/display/MovieClip";
import { BitmapData } from "../next2d/display/BitmapData";
import { BlendMode } from "../next2d/display/BlendMode";
import { FrameLabel } from "../next2d/display/FrameLabel";
import { Graphics } from "../next2d/display/Graphics";
import { Loader } from "../next2d/display/Loader";
import { LoaderInfo } from "../next2d/display/LoaderInfo";
import { Shape } from "../next2d/display/Shape";
import { Stage } from "../next2d/display/Stage";
import type { DisplayImpl } from "../interface/DisplayImpl";

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