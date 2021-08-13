[![UnitTest](https://github.com/Next2D/Player/actions/workflows/main.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/main.yml)
[![CodeQL](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml/badge.svg?branch=develop)](https://github.com/Next2D/Player/actions/workflows/codeql-analysis.yml)
[![license](https://img.shields.io/github/license/Next2D/Player)](https://github.com/Next2D/Player/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://next2d.app/docs/player/index.html)
[![Discord](https://img.shields.io/discord/812136803506716713?label=Discord&logo=discord)](https://discord.gg/6c9rv5Uns5)
[![Follow us on Twitter](https://img.shields.io/twitter/follow/Next2D?label=Follow&style=social)](https://twitter.com/intent/user?screen_name=Next2D)

# About
developブランチは開発専用のブランチです。  
The develop branch is a development-only branch.

## Version
開発に必要なミドルウェアと対応バージョン  
Middleware required for development and supported versions
```
node >= v14.x
gulp >= 4.x
karma >= 6.x
```

## Initial Settings
```
git clone -b develop git@github.com:Next2D/Player.git
cd Player
npm install -g gulp karma
npm install
```

## Start Development
```
gulp
```

## Unit Test
```
gulp test
```

## Export minify
```
gulp --debugBuild=true --prodBuild=true
```

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.