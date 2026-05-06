# 第10回 サンプル実験

## Sample: 未完成コード（課題）

### Code
```c
#include <stdio.h>

// 計算専用
double calcI(double V, double R) {
  return V / R;
}

// 入力チェック込み（成功:1 / 失敗:0）
int calcI_checked(double V, double R, double *outI) {
  if (R <= 0) {
    return 0;
  }
  *outI = calcI(V, R);
  return 1;
}

// TODO1-1: 新しいmaxを返す
double maxValue(double a, double b) {
  if (???) return a;  // もし、a が b よりも大きければ、a を返す
  return b;          // そうでない場合は、 b を返す
}

// TODO1-2: 新しいminを返す
double minValue(double a, double b) {
  if (???) return a;  // もし、a が b よりも小さければ、a を返す
  return b;          // そうでない場合は、 b を返す
}

int main(void) {
  double V_list[] = {5.0, 5.0, 5.0, 12.0, 9.0};  // 電圧リスト
  double R_list[] = {5.0, 10.0, 0.0, 6.0, 3.0};  // 抵抗リスト
  int N = (int)(sizeof(V_list) / sizeof(V_list[0]));

  double sumI = 0.0;
  int validCount = 0;
  double maxI = 0.0;
  double minI = 0.0;

  for (int k = 0; k < N; k++) {
    double V = ???;        // TODO2-1: 電圧リストのk番目
    double R = ???;        // TODO2-2: 抵抗リストのk番目
    double I;

    printf("case %d: V=%.1f R=%.1f -> ", k + 1, V, R);

    if (!calcI_checked(V, R, &I)) {
      printf("R error\n");
      continue;
    }

    printf("I=%.3f\n", I);

    sumI += I;
    if (validCount == 0) {
      maxI = I;
      minI = I;
    } else {
      maxI = ???(maxI, I);  // TODO3-1: 電流の最大値を取得する関数を呼ぶ
      minI = ???(minI, I);  // TODO3-2: 電流の最小値を取得する関数を呼ぶ
    }
    validCount++;
  }

  if (validCount > 0) {
    printf("avg=%.3f\n", sumI / validCount);
    printf("max=%.3f\n", maxI);
    printf("min=%.3f\n", minI);
  } else {
    printf("avg=NA\n");
    printf("max=NA\n");
    printf("min=NA\n");
  }

  return 0;
}
```
