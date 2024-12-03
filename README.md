# ExecuteSimulator

コマンド「execute」と同様の操作を扱うことができます。
<br>現状Java版仕様です

## Usage

`execute/index` からimportして使用してください。

```js
import { Execute } from "./execute/index";

const execute = new Execute();

execute.as("@a").at("@s").run("playsound random.pop @s ~ ~ ~ 10 1");
```

詳細は[.d.ts](/scripts/execute/Execute.d.ts)を参照してください。

## Vertified Versions

- 1.20.6x

## Note

- CommandSourceStackクラスをExecuteのコンストラクタに渡すのは推奨されません。現在バグ修正を試みています。

## License

This pack is released under the [Mit license](https://en.wikipedia.org/wiki/MIT_License), see LICENSE.

## Author

- [GitHub](https://github.com/Takenoko-II)
- [Twitter](https://twitter.com/Takenoko_4096)
- Discord: takenoko_4096 | たけのこII#1119
