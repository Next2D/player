[![Build Status](https://github.com/Next2D/Player/actions/workflows/main.yml/badge.svg)](https://github.com/Next2D/Player/actions)
[![license](https://img.shields.io/github/license/Next2D/Player)](https://github.com/Next2D/Player/blob/main/LICENSE)

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