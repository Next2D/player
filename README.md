Next2D Player
=============
<img src="https://next2d.app/assets/img/player/logo.svg" width="200" height="200" alt="Next2D Player Logo">

[![UnitTest](https://github.com/Next2D/Player/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/integration.yml)
[![CodeQL](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml)
[![Lint](https://github.com/Next2D/Player/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Next2D/Player/actions/workflows/lint.yml) \
[![release](https://img.shields.io/github/v/release/Next2D/Player)](https://github.com/Next2D/Player/releases)
[![license](https://img.shields.io/github/license/Next2D/Player)](https://github.com/Next2D/Player/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://next2d.app/docs/player/index.html)
[![Discord](https://img.shields.io/discord/812136803506716713?label=Discord&logo=discord)](https://discord.gg/6c9rv5Uns5)
![Twitter Follow](https://img.shields.io/twitter/follow/Next2D?style=social)
[![Github All Releases](https://img.shields.io/npm/dt/@next2d/player)](https://github.com/Next2D/player/releases)

[日本語](./README.ja.md) | [简体中文](./README.cn.md)

## About
Next2D Player is a project derived from the JavaScript FlashPlayer "swf2js" and aims to provide the fastest 2D engine that works on any device.

It fully supports WebGL and WebGL2, and can be used to create rich and interactive web content, without having to deal with browser or device compatibility. With full support for WebGL and WebGL2, you can create rich, interactive web content and games without having to deal with browser or device compatibility.

With the Next2D NoCode Tool, you can intuitively create the animations you envision, and the exported JSON data can be easily played and published with the Next2D Player.  
Next2D NoCode Tool is a web service that does not require installation and can be used immediately by anyone who accesses it.

## Use Simple Sample
```javascript
next2d.load("JSON Path...");
```
[CodePen](https://codepen.io/next2d/pen/rNGMrZG)

## Use Program Sample
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

| name | type | default | description |
| --- | --- | --- | --- |
| `base` | string | empty | When acquiring JSON by relative path, the URL set here will be applied as the root. For absolute paths, the URL set here will not be applied. |
| `fullScreen` | boolean | false | It will be drawn on the entire screen beyond the width and height set in the Stage class. |
| `tagId` | string | empty | When an ID is specified, drawing will be performed within the element with the specified ID. |
| `bgColor` | array | empty | The [R,G,B,A] array of background colors can be specified from 0 to 255. false is colorless and transparent. |

## Related sites
* [Website](https://next2d.app)
* [Player API Documentation](https://next2d.app/en/docs/player)
* [Next2D NoCode Tool(β version)](https://tool.next2d.app)
* [Next2D Framework](https://next2d.app/#framework)
* [Tutorial & Reference.](https://next2d.app/en/reference/player)
* [Chat Community(Discord)](https://discord.gg/6c9rv5Uns5)

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
