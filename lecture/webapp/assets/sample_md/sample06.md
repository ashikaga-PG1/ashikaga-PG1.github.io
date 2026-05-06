# 第6回 サンプル実験

## Sample: 配列の合計

### Code
```c
#include <stdio.h>

int main(void) {
  int a[5] = {1, 2, 3, 4, 5};
  // @bp 合計を初期化
  int sum = 0;

  for (int i = 0; i < 5; i++) {
    // @bp 合計を更新
    sum += a[i];
  }

  // @bp 結果を表示
  printf("%d\n", sum);
  return 0;
}
```

### Watch
- i
- sum
- a[i]

### Trace (exported reference)
```json
[
  {
    "at": "合計を初期化",
    "vars": {
      "i": 0,
      "sum": 0
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "i": 1,
      "sum": 1
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "i": 2,
      "sum": 3
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "i": 3,
      "sum": 6
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "i": 4,
      "sum": 10
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "i": 5,
      "sum": 15
    },
    "stdout": "15\n"
  }
]
```

## Sample: 最大値を探す

### Code
```c
#include <stdio.h>

int main(void) {
  int a[4] = {3, 7, 2, 5};
  // @bp 最大値を初期化
  int max = a[0];

  for (int i = 1; i < 4; i++) {
    // @bp 最大値を確認
    if (a[i] > max) {
      max = a[i];
    }
  }

  // @bp 結果を表示
  printf("%d\n", max);
  return 0;
}
```

### Watch
- i
- max
- a[i]

### Trace (exported reference)
```json
[
  {
    "at": "最大値を初期化",
    "vars": {
      "i": 1,
      "max": 3
    },
    "stdout": ""
  },
  {
    "at": "最大値を確認",
    "vars": {
      "i": 2,
      "max": 7
    },
    "stdout": ""
  },
  {
    "at": "最大値を確認",
    "vars": {
      "i": 3,
      "max": 7
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "i": 4,
      "max": 7
    },
    "stdout": "7\n"
  }
]
```

## Sample: 配列とprintf（一覧表示）

### Code
```c
#include <stdio.h>

int main(void) {
  int a[3] = {2, 4, 6};

  for (int i = 0; i < 3; i++) {
    // @bp 各要素を表示
    printf("%d\n", a[i]);
  }
  return 0;
}
```

### Watch
- i
- a[i]

### Trace (exported reference)
```json
[
  {
    "at": "各要素を表示",
    "vars": {
      "i": 0
    },
    "stdout": "2\n"
  },
  {
    "at": "各要素を表示",
    "vars": {
      "i": 1
    },
    "stdout": "2\n4\n"
  },
  {
    "at": "各要素を表示",
    "vars": {
      "i": 2
    },
    "stdout": "2\n4\n6\n"
  }
]
```
