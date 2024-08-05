# Development Environments

## Version 
Middleware required for development and supported versions
```
node >= v20.x
```

## Initial Settings
```
git clone git@github.com:Next2D/player.git
cd player
npm install
```

## Start Development
```
npm start
```

## Unit Test
```
npm test
```

## ESLint
```
npm run lint
```

## concept
各 `class` の `method` は `usecase` もしくは `service` で実装しています。但し、`service` から `service` をコールするのは禁止しています。`method` が簡素な場合は、`service` を直接コールし、複雑な場合や、複数の `service` を呼び出したい場合は `usecase` を実装しています。ロジックは `usecase` もしくは `service` に責務を置き、 `method` の役割は、 `private` や `protected` など、`class` 変数への値のセットまでとしています。

The `method` of each `class` is implemented by `usecase` or `service`. However, calling `service` from `service` is prohibited. If the `method` is simple, call `service` directly. If the `method` is complex or you want to call multiple `service`, implement `usecase`. The logic places the responsibility on the `usecase` or `service`, and the role of the `method` is limited to setting values in `class` variables, such as `private` or `protected`.

### dependency diagram

#### case1
```
class => method => service
```

#### case2
```
class => method => usecase => service
```

## packages
`packages` ディレクトリの依存関係で注意する点は以下の通りです。
- `@next2d/core` は他の `packages` からの参照を禁止しています。
- `@next2d/events`, `@next2d/cache`, `@next2d/webgl` は疎結合で設計されている為、他の `packages` の `import` を禁止しています。
- `@next2d/renderer` はOffscreenCanvasがworkerで処理されるため、 `@next2d/webgl` のみ `import` を許可しています。

The dependencies to note in the `packages` directory are as follows
- `@next2d/core` does not allow references from other `packages`.
- `@next2d/events`, `@next2d/cache`, and `@next2d/webgl` are designed to be loosely coupled, so `import` of other `packages` is prohibited.
- `@next2d/renderer` allows `import` only for `@next2d/webgl`, because OffscreenCanvas is processed by the worker.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.