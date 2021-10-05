Next2D Player
=============
<img src="https://next2d.app/assets/img/player/logo.svg" width="200" height="200" alt="Next2D Player Logo">

[![UnitTest](https://github.com/Next2D/Player/actions/workflows/main.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/main.yml)
[![CodeQL](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml)
[![release](https://img.shields.io/github/v/release/Next2D/Player)](https://github.com/Next2D/Player/releases)
[![license](https://img.shields.io/github/license/Next2D/Player)](https://github.com/Next2D/Player/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://next2d.app/docs/player/index.html)
[![Discord](https://img.shields.io/discord/812136803506716713?label=Discord&logo=discord)](https://discord.gg/6c9rv5Uns5)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/Next2D?label=Follow&style=social)](https://twitter.com/intent/user?screen_name=Next2D)

# About(Japanese)
Next2D Playerは、JavaScript FlashPlayer「swf2js」から派生したプロジェクトで  
あらゆるデバイスで動作する2D最速エンジンを提供することを目的としてます。  
  
WebGL、WebGL2を完全にサポートしており、ブラウザやデバイスの互換性に対処したりすることなく  
リッチでインタラクティブなグラフィック、クロスプラットフォーム アプリケーション、およびゲームを作成できるライブラリです。  
  
Next2D NoCode Toolを利用することで、イメージしたアニメーションを直感的に作成でき、書き出したJSONデータを、Next2D Playerで簡単に再生および公開が可能です。  
Next2D NoCode Toolはインストール不要でアクセスすれば誰でもすぐに使えるWebサービスです。  
  
2Dエンターテインメント開発を簡単に！快速に！快適に！  

# About(English)
Next2D Player is a project derived from the JavaScript FlashPlayer "swf2js".  
The goal is to provide the fastest 2D engine that works on any device.  
  
It fully supports WebGL and WebGL2, and can be used to create rich, interactive graphics and cross-platform applications without having to deal with browser or device compatibility.  
It is a library that allows you to create rich, interactive graphics, cross-platform applications and games without having to deal with browser or device compatibility.  

By using the Next2D NoCode Tool, you can intuitively create the animation you have imagined, and the exported JSON data can be easily played and published using the Next2D Player.  
Next2D NoCode Tool is a web service that does not require installation and can be used immediately by anyone who accesses it.  

2D entertainment development made easy! Fast! Comfortable!


# Use Simple Sample
```javascript
next2d.load("JSON Path...");
```

# Use Program Sample
```javascript
const {Loader}     = next2d.display;
const {URLRequest} = next2d.net;
const {Event}      = next2d.events;

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
@see [API Documentation](https://next2d.app/docs/player/index.html)

# Related sites
* [Website](https://next2d.app)
* [Player API Documentation](https://next2d.app/docs/player/index.html)
* [Next2D NoCode Tool(α version)](https://tool.next2d.app)
* [Next2D Framework(α version)](https://next2d.app/#framework)
* [Tutorial](https://next2d.app/tutorials)
* [Chat Community(Discord)](https://discord.gg/6c9rv5Uns5)


# License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.