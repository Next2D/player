Next2D Player
=============
<img src="https://next2d.app/assets/img/player/logo.svg" width="200" height="200" alt="Next2D Player Logo">

[![UnitTest](https://github.com/Next2D/Player/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/integration.yml)
[![CodeQL](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml)
[![Lint](https://github.com/Next2D/Player/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/lint.yml)

[![release](https://img.shields.io/github/v/release/Next2D/Player)](https://github.com/Next2D/Player/releases)
[![Github All Releases](https://img.shields.io/npm/dt/@next2d/player)](https://github.com/Next2D/player/releases)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/6c9rv5Uns5)
![Twitter Follow](https://img.shields.io/twitter/follow/Next2D?style=social)

[English](./README.md) | [日本語](./README.ja.md)

## 下一个2D项目
  
### Player
Next2D Player支持WebGL和OffscreenCanvas，实现了先进的图形表达。  
它还可以用于游戏制作、广告制作和其他需要丰富表达的场景，而不必处理浏览器或设备的兼容性问题。  
  
### NoCode Tool
它是一个在网络浏览器中运行的创作工具，主要基于NoCode开发。它允许用户直观地创建他们所想象的动画，导出的数据可以很容易地上传到网络上，并用播放器发布。
[NoCode Tool](https://tool.next2d.app)
  
### Framework
这个框架可以通过URL（SPA）实现场景管理，这在传统的Canvas/WebGL应用中是很难做到的，可以固定开发模式，简化可读性和共享性。  
  
请在Twitter上查看[@Next2D](https://twitter.com/Next2D)和[官方网站](https://next2d.app)，了解最新的新闻和技术信息。  

如果Next2D对你有用，我们希望你能支持我们的项目。  

<div align="center">
  <a href="https://github.com/sponsors/Next2D" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" width=180 alt="GitHub Sponsor" />
  </a>
</div>

## 関連サイト
* [Website](https://next2d.app)
* [Player API Documentation](https://next2d.app/ja/docs/player)
* [NoCode Tool](https://tool.next2d.app)
* [Framework](https://github.com/Next2D/framework)

## Examples

### 使用简单的样本
```javascript
next2d.load("JSON Path...");
```
[CodePen](https://codepen.io/next2d/pen/rNGMrZG)

### 使用程序样本

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

| 名称           | 值类型     | 默认值           | 说明                                                |
|--------------|---------|---------------|---------------------------------------------------|
| `base`       | string  | empty         | 当JSON是由相对路径获得的，这里设置的URL被应用为根。对于绝对路径，这里设置的URL不被应用。 |
| `fullScreen` | boolean | false         | 整个屏幕的绘制超出了Stage类中设置的宽度和高度。                        |
| `tagId`      | string  | empty         | 当一个ID被指定时，在指定ID的元素内进行绘图。                          |
| `bgColor`    | string  | "transparent" | 你可以指定一个十六进制的背景颜色。默认为无色。                           |

## 许可证
本项目使用 [MIT License](https://opensource.org/licenses/MIT) 许可证 - 参考 [LICENSE](LICENSE) 文件了解许可证内容。
