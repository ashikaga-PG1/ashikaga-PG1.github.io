# 第4回 サンプル実験

## Sample: 未完成コード（課題）

### Code
```c
#include <stdio.h>

int main(void) {
  const double V = 5.0;      // 電圧[V]
  const double Imax = 0.60;  // 許容電流[A]

  int okCount = 0;           // OKの件数

  printf("V=%.1fV  Imax=%.2fA\n", V, Imax);
  printf("-------------------------\n");
  printf("R(ohm)   I(A)    judge\n");
  printf("-------------------------\n");

  for (int k = 1; k <= 10; k++) {
    int R = 5 * k;              // 5,10,15,...,50

    // TODO1: オームの法則で電流Iを計算
    double I = ???;

    // TODO2: 判定して表示（WARN/OK）
    //        OKのときは okCount を増やす
    if ( ??? ) {
      printf("%5d  %6.3f   WARN\n", R, I);
    } else {
      printf("%5d  %6.3f   OK\n", R, I);
      okCount = ???;
    }
  }

  printf("-------------------------\n");
  printf("OK=%d / 10\n", okCount);

  return 0;
}
```
