# 第15回 サンプル実験

## Sample: 線形探索（見つけたら位置）

### Code
```c
#include <stdio.h>

int main(void) {
  int a[4] = {3, 7, 2, 5};
  int key = 2, pos = -1;

  for (int i = 0; i < 4; i++) {
    // @bp 一致を確認
    if (a[i] == key) {
      pos = i;
      break;
    }
  }

  // @bp 位置を表示
  printf("%d\n", pos);
  return 0;
}
```

### Watch
- i
- pos
- key
- a[i]

### Trace (exported reference)
```json
[
  {
    "at": "一致を確認",
    "vars": {
      "i": 0,
      "pos": -1
    },
    "stdout": ""
  },
  {
    "at": "一致を確認",
    "vars": {
      "i": 1,
      "pos": -1
    },
    "stdout": ""
  },
  {
    "at": "一致を確認",
    "vars": {
      "i": 2,
      "pos": 2
    },
    "stdout": ""
  },
  {
    "at": "位置を表示",
    "vars": {
      "pos": 2
    },
    "stdout": "2\n"
  }
]
```

## Sample: バブルソート（2回だけのイメージ）

### Code
```c
#include <stdio.h>

int main(void) {
  int a[3] = {3, 1, 2};
  // @bp 配列を用意
  int n = (int)(sizeof(a) / sizeof(a[0]));  // 配列の要素数

  // バブルソート（n=3なので外側は2回）
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        int tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
      }
    }
  }

  // 結果表示
  // @bp 並べ替え結果を表示
  for (int k = 0; k < n; k++) {
    printf("%d", a[k]);
    if (k < n - 1) printf(" ");
  }
  printf("\n");

  return 0;
}
```

### Watch
- i
- j
- k
- n
- a[j]

### Trace (exported reference)
```json
[
  {
    "at": "配列を用意",
    "vars": {
      "a": "3, 1, 2"
    },
    "stdout": ""
  },
  {
    "at": "並べ替え結果を表示",
    "vars": {
      "a": "1, 2, 3"
    },
    "stdout": "1 2 3\n"
  }
]
```

## Sample: 関数の復習：min関数

### Code
```c
#include <stdio.h>

int min2(int a, int b) {
  return (a < b) ? a : b;
}

int main(void) {
  // @bp 最小値を表示
  printf("%d\n", min2(3, 5));
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "最小値を表示",
    "vars": {},
    "stdout": "3\n"
  }
]
```

## Sample: 構造体（struct）：RLCの定数と状態をまとめる

### Code
```c
#include <stdio.h>

typedef struct {
  double R, L, C;
} RLCParam;

typedef struct {
  double i;
  double vc;
} State;

int main(void) {
  // @bp 値を用意
  RLCParam p = {10.0, 0.1, 0.0001};
  State x = {0.0, 1.0};  // i0, Vc0

  // @bp di/dtを計算
  double didt = -(p.R / p.L) * x.i - (1.0 / p.L) * x.vc;
  // @bp dVc/dtを計算
  double dvcdt = (1.0 / p.C) * x.i;

  // @bp 結果を表示
  printf("di/dt=%.3f dVc/dt=%.3f\n", didt, dvcdt);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "値を用意",
    "vars": {
      "p.R": 10.0,
      "p.L": 0.1,
      "p.C": 0.0001,
      "x.i": 0.0,
      "x.vc": 1.0
    },
    "stdout": ""
  },
  {
    "at": "di/dtを計算",
    "vars": {
      "p.R": 10.0,
      "p.L": 0.1,
      "p.C": 0.0001,
      "x.i": 0.0,
      "x.vc": 1.0,
      "didt": -10.0
    },
    "stdout": ""
  },
  {
    "at": "dVc/dtを計算",
    "vars": {
      "p.R": 10.0,
      "p.L": 0.1,
      "p.C": 0.0001,
      "x.i": 0.0,
      "x.vc": 1.0,
      "didt": -10.0,
      "dvcdt": 0.0
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "didt": -10.0,
      "dvcdt": 0.0
    },
    "stdout": "di/dt=-10.000 dVc/dt=0.000\n"
  }
]
```
