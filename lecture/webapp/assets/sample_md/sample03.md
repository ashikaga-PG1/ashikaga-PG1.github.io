# 第3回 サンプル実験

## Sample: if/else（偶数・奇数）

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 値を用意
  int n = 7;

  if (n % 2 == 0) {
    printf("even\n");
  } else {
    // @bp 判定結果を表示
    printf("odd\n");
  }
  return 0;
}
```

### Watch
- n

### Trace (exported reference)
```json
[
  {
    "at": "値を用意",
    "vars": {
      "n": 7
    },
    "stdout": ""
  },
  {
    "at": "判定結果を表示",
    "vars": {
      "n": 7
    },
    "stdout": "odd\n"
  }
]
```

## Sample: for（1〜5の合計）

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 初期化
  int sum = 0;

  for (int i = 1; i <= 5; i++) {
    // @bp 合計を更新
    sum += i;
  }

  // @bp 結果を表示
  printf("%d\n", sum);
  return 0;
}
```

### Watch
- i
- sum

### Trace (exported reference)
```json
[
  {
    "at": "初期化",
    "vars": {
      "sum": 0,
      "i": 1
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "sum": 1,
      "i": 2
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "sum": 3,
      "i": 3
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "sum": 6,
      "i": 4
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "sum": 10,
      "i": 5
    },
    "stdout": ""
  },
  {
    "at": "合計を更新",
    "vars": {
      "sum": 15,
      "i": 6
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "sum": 15
    },
    "stdout": "15\n"
  }
]
```

## Sample: while（カウントダウン）

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 初期値を用意
  int n = 3;

  while (n > 0) {
    // @bp 現在値を表示
    printf("%d\n", n);
    n--;
  }

  // @bp 終了を表示
  printf("go!\n");
  return 0;
}
```

### Watch
- n

### Trace (exported reference)
```json
[
  {
    "at": "初期値を用意",
    "vars": {
      "n": 3
    },
    "stdout": ""
  },
  {
    "at": "現在値を表示",
    "vars": {
      "n": 3
    },
    "stdout": "3\n"
  },
  {
    "at": "現在値を表示",
    "vars": {
      "n": 2
    },
    "stdout": "3\n2\n"
  },
  {
    "at": "現在値を表示",
    "vars": {
      "n": 1
    },
    "stdout": "3\n2\n1\n"
  },
  {
    "at": "終了を表示",
    "vars": {
      "n": 0
    },
    "stdout": "3\n2\n1\ngo!\n"
  }
]
```
