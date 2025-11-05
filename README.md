Next2D Player
=============
<div align="center">
  <img src="https://next2d.app/assets/img/player/logo.svg" width="250" alt="Next2D Player">
</div>

[![UnitTest](https://github.com/Next2D/Player/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/integration.yml)
[![CodeQL](https://github.com/Next2D/player/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/Next2D/player/actions/workflows/github-code-scanning/codeql)
[![Lint](https://github.com/Next2D/Player/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/lint.yml)

[![release](https://img.shields.io/github/v/release/Next2D/Player)](https://github.com/Next2D/Player/releases)
[![Github All Releases](https://img.shields.io/npm/dt/@next2d/player)](https://github.com/Next2D/Player/releases)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/6c9rv5Uns5)
[![Twitter](https://img.shields.io/twitter/follow/Next2D?style=social)](https://twitter.com/Next2D)

[日本語]  
Next2D Playerは、WebGLのハードウェアアクセラレーションでグラフィックス処理負荷を軽減し、OffscreenCanvasのマルチスレッド処理で描画パフォーマンスを向上させています。  
ベクター描画、Tweenアニメーション、テキスト、音声、動画など、さまざまな要素をサポートしているので、ゲーム制作、インタラクティブなデータビジュアライゼーション、クリエイティブなウェブアプリケーションなど、豊かな表現が必要とされるプロジェクトで活用が期待できます。  
  
[English]  
Next2D Player reduces graphics processing load with WebGL hardware acceleration and improves drawing performance with OffscreenCanvas multi-threaded processing.  
With support for vector rendering, tween animation, text, audio, video, and many other elements, Next2D Player can be used for game production, interactive data visualization, creative web applications, and other projects that require rich expression. The software is expected to be used in game production, interactive data visualization, creative web applications and other projects requiring rich expression.  
  
[简体中文]  
Next2D Player通过WebGL硬件加速降低了图形处理负载，通过OffscreenCanvas多线程处理提高了绘图性能。  
由于支持矢量绘图、Tween动画、文本、音频、视频和许多其他元素，它可用于游戏制作、交互式数据可视化、创意网络应用和其他需要丰富表达的项目。 该软件可用于需要丰富表现力的项目中。  
  
## Support
[日本語]  
最新ニュースや技術情報は、Twitterの[@Next2D](https://twitter.com/Next2D)や公式の[Website](https://next2d.app/ja/)で発信していきますので、チェックしてみてください。  
Next2Dがお役に立つようでしたら、プロジェクトをご支援いただければ幸いです。  
  
[English]  
Please check [@Next2D](https://twitter.com/Next2D) on Twitter and the [official website](https://next2d.app/en/) for the latest news and technical information.    
If Next2D is useful to you, we hope you will support our project.  
  
[简体中文]  
请在Twitter上查看[@Next2D](https://twitter.com/Next2D)和[官方网站](https://next2d.app/cn/)，了解最新的新闻和技术信息。  
如果Next2D对你有用，我们希望你能支持我们的项目。  
  
<div align="center">
  <a href="https://github.com/sponsors/Next2D" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" width=180 alt="GitHub Sponsor" />
  </a>
</div>

## Related Sites
* [Website](https://next2d.app)
* [Animation Tool](https://tool.next2d.app)
* [Framework](https://github.com/Next2D/framework)

## Examples

### Use Simple Sample
```javascript
next2d.load("Path to JSON output from Animation Tool");
```

### Use Program Sample For JavaScript
```javascript
const { Loader }     = next2d.display;
const { URLRequest } = next2d.net;
const { Event }      = next2d.events;

// create root MovieClip
const start = async () =>
{
    const request = new URLRequest("JSON path");
    const loader  = new Loader();
    await loader.load(request);

    const root = await next2d.createRootMovieClip();
    root.addChild(loader.contentLoaderInfo.content);
};

start();
```

### Use Program Sample For TypeScript
```typescript
import { Loader } from "@next2d/display";
import { URLRequest } from "@next2d/net";
import { Event } from "@next2d/events";

// create root MovieClip
const start = async (): Promise<void> =>
{
    const request = new URLRequest("JSON path");
    const loader  = new Loader();
    await loader.load(request);

    const root = await next2d.createRootMovieClip();
    root.addChild(loader.content);
};

start();
```

## Option settings

[日本語]  

| プロパティ名       | 型       | デフォルト値        | 説明                                                                    |
|--------------|---------|---------------|-----------------------------------------------------------------------|
| `fullScreen` | boolean | false         | Stageクラスで設定した幅と高さを超えて画面全体に描画されます。                                     |
| `tagId`      | string  | empty         | IDを指定すると、指定したIDのエレメント内で描画を行います。                                       |
| `bgColor`    | string  | "transparent" | 背景色を16進数で指定できます。デフォルトは無色透明です。                                         |

[English]  

| name           | type    | default       | description                                                                                                                         |
|----------------|---------|---------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `fullScreen`   | boolean | false         | The entire screen is drawn beyond the width and height set in the Stage class.                                                      |
| `tagId`        | string  | empty         | When an ID is specified, drawing is performed within the element of the specified ID.                                               |
| `bgColor`      | string  | "transparent" | You can specify a background color in hexadecimal. The default is colorless.                                                        |

[简体中文]  

| 名称           | 值类型     | 默认值           | 说明                                                |
|--------------|---------|---------------|---------------------------------------------------|
| `fullScreen` | boolean | false         | 整个屏幕的绘制超出了Stage类中设置的宽度和高度。                        |
| `tagId`      | string  | empty         | 当一个ID被指定时，在指定ID的元素内进行绘图。                          |
| `bgColor`    | string  | "transparent" | 你可以指定一个十六进制的背景颜色。默认为无色。                           |

##  Flowchart

```mermaid
flowchart LR
    subgraph Left["Drawing Flow Chart"]
        direction TB
        subgraph Container1["Container (framebuffer - offscreen rendering)"]
            direction TB
            Shape1["Shape<br/>(Bitmap or Vector)"]
            TextField1["TextField<br/>(canvas2d)"]
            Video1["Video<br/>(Video Element)"]
            
            Shape1 --> MaskCheck{mask rendering?}
            TextField1 --> MaskCheck
            Video1 --> MaskCheck
            
            MaskCheck -->|NO| Cache1{Is there<br/>a cache?}
            Cache1 -->|YES| CoordDB1["Coordinates<br/>x, y, w, h"]
            CoordDB1 --> FilterCheck{Filter or<br/>Blend?}
            FilterCheck -->|NO| Arrays1["Instanced Arrays<br/>matrix | colorTransform<br/>| Coordinates"]
        end
        
        MaskCheck -->|YES| Direct1[rendering]
        Direct1 -->|drawArrays| Final[rendering]
        
        Arrays1 -->|drawArraysInstanced| Final
        Final -->|60fps| Screen[main framebuffer]
        
        FilterCheck -->|YES| CacheCheck1{Is there<br/>a cache?}
    end
    
    subgraph Center["Middle Layer"]
        direction TB
        Cache1 -->|NO| Atlas["Texture Atlas<br/>(Drawing with<br/>binary trees)"]
        Atlas --> CoordDB1
        
        CacheCheck1 -->|NO| Render2[rendering]
        Render2 -->|cache| TexCache["texture cache"]
        CacheCheck1 -->|YES| TexCache
        TexCache -->|drawArrays| Final
    end
    
    subgraph Right["Filter/Blend/Mask Processing"]
        direction TB
        subgraph Container2["Container (filter or blend or mask)"]
            direction TB
            Shape2["Shape<br/>(Bitmap or Vector)"]
            TextField2["TextField<br/>(canvas2d)"]
            Video2["Video<br/>(Video Element)"]
            
            Shape2 --> Cache2{Is there<br/>a cache?}
            TextField2 --> Cache2
            Video2 --> Cache2
            
            Cache2 -->|NO| Render3[rendering]
            Render3 --> Arrays2["Instanced Arrays<br/>matrix | colorTransform<br/>| Coordinates"]
            Cache2 -->|YES| Arrays2
        end
        
        Arrays2 -->|drawArraysInstanced| Render4[rendering]
        Render4 -->|filter or blend| TexCache
        
        Arrays2 -.->|Array of rendering<br/>information| Arrays1
    end
    
    Container1 -.->|filter or blend| Container2
    FilterCheck -.->|filter or blend| CacheCheck2{Is there<br/>a cache?}
    CacheCheck2 -->|NO| Render5[rendering]
    CacheCheck2 -->|YES| TexCache
    Render5 -->|cache| TexCache
    
    style Left fill:#e6f3ff,stroke:#4d94ff,stroke-width:2px
    style Center fill:#fff9e6,stroke:#ffcc00,stroke-width:2px
    style Right fill:#ffe6f0,stroke:#ff66a3,stroke-width:2px
    style Container1 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    style Container2 fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
    style Final fill:#ffe6cc,stroke:#d79b00,stroke-width:2px
    style Render4 fill:#ffe6cc,stroke:#d79b00,stroke-width:2px
    style Screen fill:#d5e8d4,stroke:#82b366,stroke-width:2px
    style CoordDB1 fill:#f0f0f0,stroke:#666,stroke-width:2px
    style TexCache fill:#f0f0f0,stroke:#666,stroke-width:2px
```

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
