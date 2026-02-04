# Next2D Player

Next2D Player 是一个使用 WebGL/WebGPU 的高性能 2D 渲染引擎。它在 Web 上提供类似 Flash Player 的功能，支持矢量图形、补间动画、文本、音频、视频等。

## 主要特性

- **高速渲染**：使用 WebGL/WebGPU 进行快速 2D 渲染
- **多平台支持**：支持从桌面到移动设备
- **Flash 兼容 API**：源自 swf2js 的熟悉 API 设计
- **丰富的滤镜**：支持模糊、投影、发光、斜角等效果

## 渲染管线

Next2D Player 实现高速渲染的管线概述。

```mermaid
flowchart TB
    %% Main Drawing Flow Chart
    subgraph MainFlow["绘制流程图 - 主渲染管线"]
        direction TB

        subgraph Inputs["显示对象"]
            Shape["Shape<br/>(位图/矢量)"]
            TextField["TextField<br/>(canvas2d)"]
            Video["Video 元素"]
        end

        Shape --> MaskCheck
        TextField --> MaskCheck
        Video --> MaskCheck

        MaskCheck{"遮罩<br/>渲染?"}

        MaskCheck -->|是| DirectRender["直接渲染"]
        DirectRender -->|drawArrays| FinalRender

        MaskCheck -->|否| CacheCheck1{"缓存<br/>存在?"}

        CacheCheck1 -->|否| TextureAtlas["纹理图集<br/>(二叉树打包)"]
        TextureAtlas --> Coordinates

        CacheCheck1 -->|是| Coordinates["坐标数据库<br/>(x, y, w, h)"]

        Coordinates --> FilterBlendCheck{"滤镜或<br/>混合?"}

        FilterBlendCheck -->|否| MainArrays
        FilterBlendCheck -->|是| NeedCache{"缓存<br/>存在?"}

        NeedCache -->|否| CacheRender["渲染到缓存"]
        CacheRender --> TextureCache
        NeedCache -->|是| TextureCache["纹理缓存"]

        TextureCache -->|drawArrays| FinalRender

        MainArrays["实例化数组<br/>━━━━━━━━━━━━━━━<br/>matrix<br/>colorTransform<br/>Coordinates<br/>━━━━━━━━━━━━━━━<br/><b>批量渲染</b>"]

        MainArrays -->|drawArraysInstanced<br/><b>一次调用渲染多个对象</b>| FinalRender["最终渲染"]

        FinalRender -->|60fps| MainFramebuffer["主帧缓冲<br/>(显示)"]
    end

    %% Branch Flow for Filter/Blend/Mask
    subgraph BranchFlow["滤镜/混合/遮罩 - 分支处理"]
        direction TB

        subgraph FilterInputs["显示对象"]
            Shape2["Shape<br/>(位图/矢量)"]
            TextField2["TextField<br/>(canvas2d)"]
            Video2["Video 元素"]
        end

        Shape2 --> CacheCheck2
        TextField2 --> CacheCheck2
        Video2 --> CacheCheck2

        CacheCheck2{"缓存<br/>存在?"}

        CacheCheck2 -->|否| EffectRender["效果渲染"]
        CacheCheck2 -->|是| BranchArrays
        EffectRender --> BranchArrays

        BranchArrays["实例化数组<br/>━━━━━━━━━━━━━━━<br/>matrix<br/>colorTransform<br/>Coordinates<br/>━━━━━━━━━━━━━━━<br/><b>批量渲染</b>"]

        BranchArrays -->|drawArraysInstanced<br/><b>一次调用渲染多个对象</b>| BranchRender["效果结果"]

        BranchRender -->|滤镜/混合| TextureCache
    end

    %% Connections between flows
    FilterBlendCheck -.->|"触发<br/>分支流程"| BranchFlow
    BranchArrays -.->|"渲染信息<br/>(坐标)"| MainArrays
```

### 管线特性

- **批量渲染**：一次 GPU 调用渲染多个对象
- **纹理缓存**：高效处理滤镜和混合效果
- **二叉树打包**：纹理图集的最佳内存使用
- **60fps 渲染**：高帧率的流畅动画

## DisplayList 架构

Next2D Player 使用与 Flash Player 类似的 DisplayList 架构。

### 主要类层次结构

```
DisplayObject (基类)
├── InteractiveObject
│   ├── DisplayObjectContainer
│   │   ├── Sprite
│   │   ├── MovieClip
│   │   └── Stage
│   └── TextField
├── Shape
├── Video
└── Bitmap
```

### DisplayObjectContainer

可以容纳子对象的容器类：

- `addChild(child)`：将子对象添加到前面
- `addChildAt(child, index)`：在指定索引添加子对象
- `removeChild(child)`：移除子对象
- `getChildAt(index)`：通过索引获取子对象
- `getChildByName(name)`：通过名称获取子对象

### MovieClip

具有时间轴动画的 DisplayObject：

- `play()`：开始时间轴播放
- `stop()`：停止时间轴
- `gotoAndPlay(frame)`：跳转到帧并播放
- `gotoAndStop(frame)`：跳转到帧并停止
- `currentFrame`：当前帧号
- `totalFrames`：总帧数

## 基本用法

```javascript
const { MovieClip } = next2d.display;
const { DropShadowFilter } = next2d.filters;

// 初始化舞台
const root = await next2d.createRootMovieClip(800, 600, 60, {
    tagId: "container",
    bgColor: "#ffffff"
});

// 创建 MovieClip
const mc = new MovieClip();
root.addChild(mc);

// 设置位置和大小
mc.x = 100;
mc.y = 100;
mc.scaleX = 2;
mc.scaleY = 2;
mc.rotation = 45;

// 应用滤镜
mc.filters = [
    new DropShadowFilter(4, 45, 0x000000, 0.5)
];
```

## 加载 JSON 数据

加载并渲染使用 Open Animation Tool 创建的 JSON 文件：

```javascript
const { Loader } = next2d.display;
const { URLRequest } = next2d.net;

const loader = new Loader();
await loader.load(new URLRequest("animation.json"));

const mc = loader.content;
stage.addChild(mc);
```

## 相关文档

### 显示对象
- [DisplayObject](/cn/reference/player/display-object) - 所有显示对象的基类
- [MovieClip](/cn/reference/player/movie-clip) - 时间轴动画
- [Sprite](/cn/reference/player/sprite) - 图形绘制和交互
- [Shape](/cn/reference/player/shape) - 轻量级矢量绘制
- [TextField](/cn/reference/player/text-field) - 文本显示和输入
- [Video](/cn/reference/player/video) - 视频播放

### 系统
- [事件系统](/cn/reference/player/events) - 鼠标、键盘、触摸事件
- [滤镜](/cn/reference/player/filters) - 模糊、投影、发光等
- [Sound](/cn/reference/player/sound) - 音频播放和音效
- [补间动画](/cn/reference/player/tween) - 程序化动画
