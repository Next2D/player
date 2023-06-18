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

## Next2Dプロジェクト

### Player
Next2D Playerは、WebGL、OffscreenCanvasをサポートしており、高度なグラフィカル表現が可能です。  
また、ブラウザやデバイスの互換性に対処したりすることなく、ゲーム制作・広告制作など豊かな表現が必要とされるシーンで利用できると思います。  
  
### NoCode Tool
Webブラウザ上で動作する、NoCode開発を主体としたオーサリングツールで、イメージしたアニメーションを直感的に作成でき、書き出したデータはWebにアップロードしてPlayerで簡単に公開できます。  
[NoCode Tool](https://tool.next2d.app)  
  
### Framework
従来のCanvas/WebGLアプリケーションでは困難だったURLによるシーン管理（SPA）を可能にし、開発パターンを固定化し、可読性・共有性を簡素化するフレームワークです。  
  
最新ニュースや技術情報は、Twitterの[@Next2D](https://twitter.com/Next2D)や公式の[Website](https://next2d.app)で発信していきますので、チェックしてみてください。  
  
Next2Dがお役に立つようでしたら、プロジェクトをご支援いただければ幸いです。  
  
<div style="text-align: center;">
  <a href="https://github.com/sponsors/Next2D" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" width=180 alt="GitHub Sponsor" />
  </a>
</div>

[English](./README.md) | [简体中文](./README.cn.md)

## 関連サイト
* [Website](https://next2d.app)
* [Player API Documentation](https://next2d.app/ja/docs/player)
* [NoCode Tool](https://tool.next2d.app)
* [Framework](https://github.com/Next2D/framework)

## Examples

### シンプルプログラム
```javascript
next2d.load("JSON Path...");
```

[CodePen](https://codepen.io/next2d/pen/rNGMrZG)

### プログラムサンプル
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
@see [Player API Documentation](https://next2d.app/ja/docs/player)

## オプション設定

| プロパティ名       | 型       | デフォルト値        | 説明                                                                    |
|--------------|---------|---------------|-----------------------------------------------------------------------|
| `base`       | string  | empty         | 相対パスでJSONを取得する場合、ここで設定したURLがrootとして適用されます。絶対パスの場合はここで設定したURLは適用されません。 |
| `fullScreen` | boolean | false         | Stageクラスで設定した幅と高さを超えて画面全体に描画されます。                                     |
| `tagId`      | string  | empty         | IDを指定すると、指定したIDのエレメント内で描画を行います。                                       |
| `bgColor`    | string  | "transparent" | 背景色を16進数で指定できます。デフォルトは無色透明です。                                         |

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
