# 第8回 サンプル実験

## Sample: 配列に計算結果を格納（I[k]=V/R[k]）

### Code
```c
#include <stdio.h>

int main(void) {
  const double V = 5.0;
  int R[5] = {5, 10, 15, 20, 25};
  double I[5];

  for (int k = 0; k < 5; k++) {
    // @bp 配列に保存
    I[k] = V / R[k];
  }

  // @bp 先頭と末尾を表示
  printf("%.3f %.3f\n", I[0], I[4]);
  return 0;
}
```

### Watch
- k
- I[k]

### Trace (exported reference)
```json
[
  {
    "at": "配列に保存",
    "stdout": "",
    "vars": {
      "k": 0
    }
  },
  {
    "at": "配列に保存",
    "stdout": "",
    "vars": {
      "k": 1
    }
  },
  {
    "at": "配列に保存",
    "stdout": "",
    "vars": {
      "k": 2
    }
  },
  {
    "at": "配列に保存",
    "stdout": "",
    "vars": {
      "k": 3
    }
  },
  {
    "at": "配列に保存",
    "stdout": "",
    "vars": {
      "k": 4
    }
  },
  {
    "at": "先頭と末尾を表示",
    "stdout": "1.000 0.200\n",
    "vars": {
      "I0": 1.0,
      "I4": 0.2
    }
  }
]
```

## Sample: if判定＋カウント（OK/WARN）

### Code
```c
#include <stdio.h>

int main(void) {
  const double Imax = 0.60;
  double I = 0.50;
  int okCount = 0;

  if (I > Imax) {
    printf("WARN\n");
  } else {
    // @bp OKを表示
    printf("OK\n");
    okCount = okCount + 1;
  }

  // @bp 件数を表示
  printf("OK=%d\n", okCount);
  return 0;
}
```

### Watch
- okCount

### Trace (exported reference)
```json
[
  {
    "at": "OKを表示",
    "stdout": "OK\n",
    "vars": {
      "I": 0.5,
      "Imax": 0.6,
      "okCount": 1
    }
  },
  {
    "at": "件数を表示",
    "stdout": "OK\nOK=1\n",
    "vars": {
      "I": 0.5,
      "Imax": 0.6,
      "okCount": 1
    }
  }
]
```
