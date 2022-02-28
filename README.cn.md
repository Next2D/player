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

## 关于

Next2D Player 是一个来源于 JavaScript Flash 播放器 "swf2js" 的衍生项目。
目标是提供一个在任何设备上都工作最快的 2D 引擎。

它完整提供了 WebGL 和 WebGL2, 可被用于创建丰富、交互式图形、跨平台应用程序和游戏, 而不需要处理浏览器或者设备兼容性问题。

通过使用 Next NoCode Tool, 你可以直观地创建想象中的动画, 导出的 JSON 数据可以通过使用 Next2D Player 很容易被播放和发布。
Next2D NoCode Tool 是一个 web 服务, 不需要下载并且谁都可以立马使用。

使 2D 娱乐开发更简单! 快速! 舒服!

## 使用之简单示例

```javascript
next2d.load("JSON Path...");
```
[CodePen](https://codepen.io/next2d/pen/rNGMrZG)

## 使用之程序示例

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
        root.addChild(event.currentTarget.content);
    });

loader.load(request);
```
[CodePen](https://codepen.io/next2d/pen/VwMKGEv)\
@see [API 文档](https://next2d.app/cn/docs/player)

## 设置选项

| 名称 | 值类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `base` | string | 空值 |  如果在请求时未设置URL，则要设置。 |
| `fullScreen` | boolean | false | 全屏绘制 |
| `tagId` | string | 空值 | 值为你希望在 DOM 中绘制位置的容器 ID。 |
| `bgColor` | array | empty | RGBA 值在 0-255 范围内选择。 |

## 相关站点

* [官网](https://next2d.app)
* [Player API 文档](https://next2d.app/cn/docs/player)
* [Next2D NoCode Tool(β version)](https://tool.next2d.app)
* [Next2D Framework](https://next2d.app/#framework)
* [教程 & 参考](https://next2d.app/cn/reference/player)
* [聊天社区(Discord)](https://discord.gg/6c9rv5Uns5)

## 许可证

本项目使用 [MIT License](https://opensource.org/licenses/MIT) 许可证 - 参考 [LICENSE](LICENSE) 文件了解许可证内容。
