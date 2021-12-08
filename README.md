Next2D Player
=============
<img src="https://next2d.app/assets/img/player/logo.svg" width="200" height="200" alt="Next2D Player Logo">

[![UnitTest](https://github.com/Next2D/Player/actions/workflows/integration.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/integration.yml)
[![CodeQL](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml)
[![Lint](https://github.com/Next2D/Player/actions/workflows/lint.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/lint.yml) \
[![release](https://img.shields.io/github/v/release/Next2D/Player)](https://github.com/Next2D/Player/releases)
[![license](https://img.shields.io/github/license/Next2D/Player)](https://github.com/Next2D/Player/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://next2d.app/docs/player/index.html)
[![Discord](https://img.shields.io/discord/812136803506716713?label=Discord&logo=discord)](https://discord.gg/6c9rv5Uns5)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/Next2D?label=Follow&style=social)](https://twitter.com/intent/user?screen_name=Next2D)

## About(Japanese)
Next2D Playerは、JavaScript FlashPlayer「swf2js」から派生したプロジェクトで  
あらゆるデバイスで動作する2D最速エンジンを提供することを目的としてます。  
  
WebGL、WebGL2を完全にサポートしており、ブラウザやデバイスの互換性に対処したりすることなく  
リッチでインタラクティブなグラフィック、クロスプラットフォーム アプリケーション、およびゲームを作成できるライブラリです。  
  
Next2D NoCode Toolを利用することで、イメージしたアニメーションを直感的に作成でき、書き出したJSONデータを、Next2D Playerで簡単に再生および公開が可能です。  
Next2D NoCode Toolはインストール不要でアクセスすれば誰でもすぐに使えるWebサービスです。  
  
2Dエンターテインメント開発を簡単に！快速に！快適に！  

## About(English)
Next2D Player is a project derived from the JavaScript FlashPlayer "swf2js".  
The goal is to provide the fastest 2D engine that works on any device.  
  
It fully supports WebGL and WebGL2, and it allows you to create rich, interactive graphics, cross-platform applications and games without having to deal with browser or device compatibility.  

By using the Next2D NoCode Tool, you can intuitively create the animation you have imagined, and the exported JSON data can be easily played and published using the Next2D Player.  
Next2D NoCode Tool is a web service that does not require installation and can be used immediately by anyone who accesses it.  

2D entertainment development made easy! Fast! Comfortable!

## 关于(简体中文)
Next2D Player 是一个来源于 JavaScript Flash 播放器 "swf2js" 的衍生项目。
目标是提供一个在任何设备上都工作最快的 2D 引擎。

它完整提供了 WebGL 和 WebGL2, 可被用于创建丰富、交互式图形、跨平台应用程序和游戏, 而不需要处理浏览器或者设备兼容性问题。

通过使用 Next NoCode Toll, 你可以直观地创建想象中的动画, 导出的 JSON 数据可以通过使用 Next2D Player 很容易被播放和发布。
Next2D NoCode Tool 是一个 web 服务, 不需要下载并且谁都可以立马使用。

使 2D 娱乐开发更简单! 快速! 舒服!

## Use Simple Sample
```javascript
next2d.load("JSON Path...");
```

## Use Program Sample
```javascript
const { Loader }     = next2d.display;
const { URLRequest } = next2d.net;
const { Event }      = next2d.events;

// create root MovieClip
const root = next2d.createRootMovieClip();

const request = new URLRequest("JSON path");
const loader  = new Loader(request);

loader
    .contentLoaderInfo
    .addEventListener(Event.COMPLETE, (event) =>
    {
        const loaderInfo = event.currentTarget;
        
        root.addChild(loaderInfo.content);
    });

loader.load(request);
```
@see [API Documentation](https://next2d.app/docs/player)

## Option settings

| name | value | default | description |
| --- | --- | --- | --- |
| `base` | string | empty |  The value to be set if the URL is not set at the time of the request. |
| `fullScreen` | boolean | false |  It will be drawn beyond the width and height set in the fullscreen setting and stage. |
| `tagId` | string | empty | Set value of the ID of the DOM where you want to set the drawing. |
| `bgColor` | array [R,G,B,A] or false | false | RGBA can be specified from 0-255. |

## Related sites
* [Website](https://next2d.app)
* [Player API Documentation](https://next2d.app/docs/player)
* [Next2D NoCode Tool(α version)](https://tool.next2d.app)
* [Next2D Framework(β version)](https://next2d.app/#framework)
* [Tutorial & Reference.](https://next2d.app/tutorials/player)
* [Chat Community(Discord)](https://discord.gg/6c9rv5Uns5)

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
