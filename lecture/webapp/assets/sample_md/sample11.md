# 第11回 サンプル実験

## Sample: 関数 calcI の最小例

### Code
```c
#include <stdio.h>

double calcI(double V, double R) {
  return V / R;
}

int main(void) {
  // @bp 計算結果を表示
  printf("%.3f\n", calcI(5.0, 10.0));
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "計算結果を表示",
    "stdout": "0.500\n",
    "vars": {}
  }
]
```

## Sample: 配列で複数ケースを処理（scanfなし）

### Code
```c
#include <stdio.h>

int main(void) {
  const int N = 3;
  double V_list[3] = {5.0, 5.0, 5.0};
  double R_list[3] = {5.0, 10.0, 0.0};

  for (int k = 0; k < N; k++) {
    // @bp 各ケースを表示
    printf("%d %.1f %.1f\n", k, V_list[k], R_list[k]);
  }
  return 0;
}
```

### Watch
- k
- V_list[k]

### Trace (exported reference)
```json
[
  {
    "at": "各ケースを表示",
    "stdout": "0 5.0 5.0\n",
    "vars": {
      "k": 0
    }
  },
  {
    "at": "各ケースを表示",
    "stdout": "0 5.0 5.0\n1 5.0 10.0\n",
    "vars": {
      "k": 1
    }
  },
  {
    "at": "各ケースを表示",
    "stdout": "0 5.0 5.0\n1 5.0 10.0\n2 5.0 0.0\n",
    "vars": {
      "k": 2
    }
  }
]
```
