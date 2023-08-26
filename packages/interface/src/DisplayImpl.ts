import {
    DisplayObject,
    InteractiveObject,
    DisplayObjectContainer,
    BitmapData,
    BlendMode,
    FrameLabel,
    Graphics,
    Loader,
    LoaderInfo,
    MovieClip,
    Shape,
    Sprite,
    Stage,
    TextField
} from "@next2d/display";
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
    TextField: typeof TextField;
}
