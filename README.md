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

[日本語](./README.ja.md) | [简体中文](./README.cn.md)

## Next2D Project

### Player
Next2D Player supports WebGL and OffscreenCanvas, enabling advanced graphical expression.  
It can also be used in game production, advertisement production, and other scenes requiring rich expressions without having to deal with browser or device compatibility.

### NoCode Tool
It is an authoring tool that runs in a Web browser and is mainly based on NoCode development. It allows users to intuitively create animations they have imagined, and the exported data can be easily uploaded to the Web and published with Player.  
[NoCode Tool](https://tool.next2d.app)

### Framework
This framework enables scene management by URL (SPA), which has been difficult with conventional Canvas/WebGL applications, to fix development patterns and simplify readability and shareability.  

Please check [@Next2D](https://twitter.com/Next2D) on Twitter and the [official website](https://next2d.app) for the latest news and technical information.  

If Next2D is useful to you, we hope you will support our project.  

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

### Use Simple Sample
```javascript
next2d.load("JSON Path...");
```
[CodePen](https://codepen.io/next2d/pen/rNGMrZG)

### Use Program Sample
```javascript
const { Loader }     = next2d.display;
const { URLRequest } = next2d.net;
const { Event }      = next2d.events;

// create root MovieClip
next2d
    .createRootMovieClip()
    .then((root) => 
    {
        const request = new URLRequest("JSON path");
        const loader  = new Loader(request);
        
        loader
            .contentLoaderInfo
            .addEventListener(Event.COMPLETE, (event) =>
            {
                root.addChild(event.currentTarget.content);
            });
        
        loader.load(request);
    });
```

[CodePen](https://codepen.io/next2d/pen/VwMKGEv)\
@see [API Documentation](https://next2d.app/en/docs/player)

## Option settings

| name           | type    | default       | description                                                                                                                         |
|----------------|---------|---------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `base`         | string  | empty         | When JSON is acquired by a relative path, the URL set here is applied as root. For absolute paths, the URL set here is not applied. |
| `fullScreen`   | boolean | false         | The entire screen is drawn beyond the width and height set in the Stage class.                                                      |
| `tagId`        | string  | empty         | When an ID is specified, drawing is performed within the element of the specified ID.                                               |
| `bgColor`      | string  | "transparent" | You can specify a background color in hexadecimal. The default is colorless.                                                        |

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
