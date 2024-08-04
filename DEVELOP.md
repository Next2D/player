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
各クラスのメソッドはusecaseもしくはserviceで実装しています。但し、serviceからserviceをコールするのは禁止しています。メソッドが簡素な場合は、serviceを直接コールし、複雑な場合や、複数のserviceを呼び出したい場合はusecaseを実装しています。ロジックはusecaseもしくはserviceに責務を置き、メソッドの役割は、privateやprotectedなど、クラス変数への値のセットまでとしています。

The methods of each class are implemented by usecase or service. However, calling service from service is prohibited. If the method is simple, call service directly. If the method is complex or if you want to call multiple services, implement usecase. Logic places the responsibility on usecase or service, and the role of the method is limited to setting values to class variables, such as private and protected.

### dependency diagram

#### case1
```
class => method => service
```

#### case2
```
class => method => usecase => service
```

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.