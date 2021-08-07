[![Build Status](https://github.com/Next2D/Player/actions/workflows/main.yml/badge.svg)](https://github.com/Next2D/Player/actions)
[![license](https://img.shields.io/github/license/Next2D/Player)](https://github.com/Next2D/Player/blob/main/LICENSE)

# About(Japanese)
Next2D Playerは、JavaScript FlashPlayer「swf2js」から派生したプロジェクトで  
あらゆるデバイスで動作する2D最速エンジンを提供することを目的としてます。  
  
WebGL、WebGL2を完全にサポートしており、ブラウザやデバイスの互換性に対処したりすることなく  
リッチでインタラクティブなグラフィック、クロスプラットフォーム アプリケーション、およびゲームを作成できるライブラリです。  
  
Next2D Toolを利用することで、NoCodeでイメージしたアニメーションを直感的に作成でき  
書き出したJSONデータを、Next2D Playerで簡単に再生および公開が可能です。  
Next2D Toolはインストール不要、会員登録不要、アクセスすれば誰でもすぐに使えるWebサービスです。  
  
2Dエンターテインメント開発を簡単に！快速に！快適に！  

# About(English)
Next2D Player is a project derived from the JavaScript FlashPlayer "swf2js".  
The goal is to provide the fastest 2D engine that works on any device.  
  
It fully supports WebGL and WebGL2, and can be used to create rich, interactive graphics and cross-platform applications without having to deal with browser or device compatibility.  
It is a library that allows you to create rich, interactive graphics, cross-platform applications and games without having to deal with browser or device compatibility.  
  
With the Next2D Tool, you can intuitively create animations as you imagine them in NoCode.  
The exported JSON data can be easily played and published using the Next2D Player.  
Next2D Tool is a web service that does not require installation or membership registration, and can be used immediately by anyone who accesses it.  
  
2D entertainment development made easy! Fast! Comfortable!


# Use Simple Sample
```html
<script src="next2d.js"></script>
next2d.load("JSON Path...");
```

# Use Program Sample(TODO)
```javascript
const {Loader}     = next2d.display;
const {URLRequest} = next2d.net;
const {URLRequest} = next2d.events;

const root = next2d.createRootMovieClip();

const request = new URLRequest("JSON or Image");
const loader  = new Loader(request);

```
@see [API Documentation](https://next2d.app/docs/player/index.html)

# Related sites
* Website
* Next2D Tool(α version to be released in December 2021.)
* Next2D Framework(β version to be released in December 2021.)
* Demo
* Examples
* Tutorial
* [Chat Community(Discord)](https://discord.gg/6c9rv5Uns5)
* [API Documentation](https://next2d.app/docs/player/index.html)

# License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.