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

[日本語](./README.ja.md) | [简体中文](./README.cn.md)

## About
Next2D Player is a project derived from the JavaScript FlashPlayer "swf2js".  
The goal is to provide the fastest 2D engine that works on any device.

It fully supports WebGL and WebGL2, and it allows you to create rich, interactive graphics, cross-platform applications and games without having to deal with browser or device compatibility.

By using the Next2D NoCode Tool, you can intuitively create the animation you have imagined, and the exported JSON data can be easily played and published using the Next2D Player.  
Next2D NoCode Tool is a web service that does not require installation and can be used immediately by anyone who accesses it.

2D entertainment development made easy! Fast! Comfortable!

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
