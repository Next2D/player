import type { DisplayObject } from "../player/next2d/display/DisplayObject";
import type { InteractiveObject } from "../player/next2d/display/InteractiveObject";
import type { DisplayObjectContainer } from "../player/next2d/display/DisplayObjectContainer";
import type { BitmapData } from "../player/next2d/display/BitmapData";
import type { BlendMode } from "../player/next2d/display/BlendMode";
import type { FrameLabel } from "../player/next2d/display/FrameLabel";
import type { Graphics } from "../player/next2d/display/Graphics";
import type { Loader } from "../player/next2d/display/Loader";
import type { LoaderInfo } from "../player/next2d/display/LoaderInfo";
import type { MovieClip } from "../player/next2d/display/MovieClip";
import type { Shape } from "../player/next2d/display/Shape";
import type { Sprite } from "../player/next2d/display/Sprite";
import type { Stage } from "../player/next2d/display/Stage";

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
