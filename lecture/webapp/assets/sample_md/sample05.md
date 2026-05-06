# 第5回 サンプル実験

## Sample: オームの法則（V=IR）：Iを計算

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 値を用意
  double V = 5.0, R = 10.0;
  // @bp 電流を計算
  double I = V / R;
  // @bp 結果を表示
  printf("I=%.3f A\n", I);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "値を用意",
    "vars": {
      "V": 5.0,
      "R": 10.0
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "V": 5.0,
      "R": 10.0,
      "I": 0.5
    },
    "stdout": "I=0.500 A\n"
  }
]
```

## Sample: 条件分岐：許容電流を超えたら警告

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 値を用意
  double I = 0.8;

  if (I > 0.5) {
    // @bp 警告を表示
    printf("WARN\n");
  } else {
    printf("OK\n");
  }
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "警告を表示",
    "vars": {
      "I": 0.8
    },
    "stdout": "WARN\n"
  }
]
```

## Sample: 繰り返し：Rを変えてIを一覧表示

### Code
```c
#include <stdio.h>

int main(void) {
  // @bp 電圧を用意
  double V = 5.0;

  for (int r = 5; r <= 15; r += 5) {
    // @bp 各抵抗で表示
    printf("R=%d I=%.2f\n", r, V / r);
  }
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "各抵抗で表示",
    "vars": {
      "V": 5.0,
      "r": 5
    },
    "stdout": "R=5 I=1.00\n"
  },
  {
    "at": "各抵抗で表示",
    "vars": {
      "V": 5.0,
      "r": 10
    },
    "stdout": "R=5 I=1.00\nR=10 I=0.50\n"
  },
  {
    "at": "各抵抗で表示",
    "vars": {
      "V": 5.0,
      "r": 15
    },
    "stdout": "R=5 I=1.00\nR=10 I=0.50\nR=15 I=0.33\n"
  }
]
```
