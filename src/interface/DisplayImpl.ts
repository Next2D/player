import type { DisplayObject } from "../next2d/display/DisplayObject";
import type { InteractiveObject } from "../next2d/display/InteractiveObject";
import type { DisplayObjectContainer } from "../next2d/display/DisplayObjectContainer";
import type { BitmapData } from "../next2d/display/BitmapData";
import type { BlendMode } from "../next2d/display/BlendMode";
import type { FrameLabel } from "../next2d/display/FrameLabel";
import type { Graphics } from "../next2d/display/Graphics";
import type { Loader } from "../next2d/display/Loader";
import type { LoaderInfo } from "../next2d/display/LoaderInfo";
import type { MovieClip } from "../next2d/display/MovieClip";
import type { Shape } from "../next2d/display/Shape";
import type { Sprite } from "../next2d/display/Sprite";
import type { Stage } from "../next2d/display/Stage";

export interface DisplayImpl {
    DisplayObject: typeof DisplayObject;
    InteractiveObject: typeof InteractiveObject;
    DisplayObjectContainer: typeof DisplayObjectContainer;
    BitmapData: typeof BitmapData;
    BlendMode: typeof BlendMode;
    FrameLabel: typeof FrameLabel;
    Graphics: typeof Graphics;
    Loader: typeof Loader;
    LoaderInfo: typeof LoaderInfo;
    MovieClip: typeof MovieClip;
    Shape: typeof Shape;
    Sprite: typeof Sprite;
    Stage: typeof Stage;
}
