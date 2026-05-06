# 第2回 サンプル実験

## Sample: 変数とprintf（足し算）

### Code
```c
#include <stdio.h>

int main(void) {
  int a = 3;
  // @bp bを用意
  int b = 5;
  // @bp 合計を計算
  int s = a + b;
  // @bp 結果を表示
  printf("%d\n", s);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "aを用意",
    "vars": {
      "a": 3
    },
    "stdout": ""
  },
  {
    "at": "bを用意",
    "vars": {
      "a": 3,
      "b": 5
    },
    "stdout": ""
  },
  {
    "at": "合計を計算",
    "vars": {
      "a": 3,
      "b": 5,
      "s": 8
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "a": 3,
      "b": 5,
      "s": 8
    },
    "stdout": "8\n"
  }
]
```

## Sample: doubleと書式（面積）

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 半径を用意
  double r = 2.0;
  // @bp 面積を計算
  double s = 3.14159 * r * r;
  // @bp 結果を表示
  printf("%.2f\n", s);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "半径を用意",
    "vars": {
      "r": 2.0
    },
    "stdout": ""
  },
  {
    "at": "面積を計算",
    "vars": {
      "r": 2.0,
      "s": 12.56636
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "r": 2.0,
      "s": 12.56636
    },
    "stdout": "12.57\n"
  }
]
```

## Sample: 整数除算とキャスト

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 値を用意
  int a = 7, b = 2;
  // @bp 整数除算を表示
  printf("%d\n", a / b);
  // @bp 実数除算を表示
  printf("%.1f\n", (double)a / b);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "値を用意",
    "vars": {
      "a": 7,
      "b": 2
    },
    "stdout": ""
  },
  {
    "at": "整数除算を表示",
    "vars": {
      "a": 7,
      "b": 2
    },
    "stdout": "3\n"
  },
  {
    "at": "実数除算を表示",
    "vars": {
      "a": 7,
      "b": 2
    },
    "stdout": "3\n3.5\n"
  }
]
```
