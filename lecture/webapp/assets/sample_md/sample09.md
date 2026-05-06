# 第9回 サンプル実験

## Sample: 関数で2乗を計算

### Code
```c
#include <stdio.h>

double square(double x) {
  return x * x;
}

int main(void) {
  // @bp 値を用意
  double a = 3;
  // @bp 計算結果を表示
  printf("%.0f\n", square(a));
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "値を用意",
    "vars": {
      "a": 3.0
    },
    "stdout": ""
  },
  {
    "at": "計算結果を表示",
    "vars": {
      "a": 3.0
    },
    "stdout": "9\n"
  }
]
```

## Sample: 関数でオームの法則（I=V/R）

### Code
```c
#include <stdio.h>

double current(double V, double R) {
  return V / R;
}

int main(void) {
  // @bp 電流を表示
  printf("%.2f\n", current(5, 10));
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "電流を表示",
    "vars": {},
    "stdout": "0.50\n"
  }
]
```

## Sample: 関数で配列の合計

### Code
```c
#include <stdio.h>

int sum3(int a[3]) {
  return a[0] + a[1] + a[2];
}

int main(void) {
  int x[3] = {1, 2, 3};
  // @bp 合計を表示
  printf("%d\n", sum3(x));
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "合計を表示",
    "vars": {
      "x[0]": 1,
      "x[1]": 2,
      "x[2]": 3
    },
    "stdout": "6\n"
  }
]
```
