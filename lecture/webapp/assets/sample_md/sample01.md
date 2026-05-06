# 第1回 サンプル実験

## Sample: Hello, world（表示の流れ）

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 表示する
  printf("Hello, world!\n");
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "開始",
    "vars": {
      "(開始)": ""
    },
    "stdout": ""
  },
  {
    "at": "main開始",
    "vars": {
      "(main開始)": ""
    },
    "stdout": ""
  },
  {
    "at": "表示する",
    "vars": {
      "(printf呼出)": ""
    },
    "stdout": "Hello, world!\n"
  }
]
```

## Sample: 整数の計算と出力（printf）

### Code
```c
#include <stdio.h>

int main(void) {
  int a = 3, b = 5;
  // @bp 結果を表示
  printf("%d\n", a + b);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "値を用意",
    "vars": {
      "a": 3,
      "b": 5
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "a": 3,
      "b": 5
    },
    "stdout": "8\n"
  }
]
```

## Sample: コンパイル→実行のイメージ（擬似）

### Code
```c
// 実際はVSCode＋gccで実行します
// ここでは手順の確認だけ
```

### Trace (exported reference)
```json
[
  {
    "vars": {
      "手順": "gcc main.c -o main.exe"
    },
    "stdout": ""
  },
  {
    "vars": {
      "手順": "./main.exe"
    },
    "stdout": "（実行結果が表示される）\n"
  }
]
```
