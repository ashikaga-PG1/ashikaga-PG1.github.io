# 第7回 サンプル実験

## Sample: 未完成コード（課題）

### Code
```c
#include <stdio.h>

int main(void) {
  const double V = 5.0;      // 電圧[V]
  const double Imax = 0.60;  // 許容電流[A]

  // TODO1: 配列の定義をする
  int R[?] = {5, 10, 15, 20, 25};   // 抵抗[Ω]
  double I[5];                      // 電流[A]（計算結果）
  int okCount = 0;

  // TODO2: 配列Iに電流を計算して格納
  for (int k = 0; k < 5; k++) {
    I[k] = ???;
  }

  // TODO3: 一覧表示＋OK件数の集計（ifで判定）
  printf("V=%.1fV  Imax=%.2fA\n", V, Imax);
  printf("-------------------------\n");
  printf("k  R(ohm)   I(A)    judge\n");
  printf("-------------------------\n");

  for (int k = 0; k < 5; k++) {
    if (???) {
      printf("%d %5d  %6.3f   WARN\n", k, R[k], I[k]);
    } else {
      printf("%d %5d  %6.3f   OK\n", k, R[k], I[k]);
      okCount = okCount + 1;
    }
  }

  printf("-------------------------\n");
  printf("OK=%d / 5\n", okCount);

  return 0;
}
```
