# sample_md フォーマット（サンプル実験用）

## 基本

1ファイルに複数の `## Sample:` を書けます。

```md
## Sample: タイトル

### Code
```c
#include <stdio.h>
int main(void){
  return 0;
}
```

### Watch
- i
- sum
```

## trace 生成（半自動）

- `// @bp tag` をコードに書くと、その位置で trace を切るログを挿入して生成します。
- `tag` には日本語や空白を含む短い説明も使えます（例: `// @bp 1件目を表示`）。
- 生成は build 時に実行（学生のStep操作では生成しません）。

## コマンド
- 以下はすべて、このリポジトリの直下（`tools/` フォルダが見える場所）で実行します。
- export: `python3 tools/build_tool.py --export-samples`
- bp挿入支援: `python3 tools/build_tool.py --auto-bp`
- import: `python3 tools/build_tool.py --samples`
- import + trace生成: `python3 tools/build_tool.py --samples --trace`
