:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1
![](assets/img/session07/parallel_circuit.png)

# 第8回：電気回路とプログラミング2（演習課題2）：解説

## 課題
抵抗値を配列で用意し、オームの法則 **I = V / R** を使って電流を計算・判定するプログラムを完成させてください。  
この課題は **配列＋for＋if** がポイントです（**scanfは使いません**）。

## 仕様（提出物）
- 電圧：`V = 5.0` [V]とする
- 許容電流：`Imax = 0.60` [A]とする
- 抵抗配列：`R = {5, 10, 15, 20, 25}`（要素数は5）
- 電流配列：`I[k] = V / R[k]` を **for文で計算して配列Iに格納**
- **if文**で `I[k] > Imax` のとき `WARN`、それ以外は `OK`
- 一覧を表示し、最後に **OK件数**を表示する
- 提出物：完成した `main.c`（1ファイル）

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 未完成コード（課題）

```c
#include <stdio.h>

int main(void){
  const double V = 5.0;      // 電圧[V]
  const double Imax = 0.60;  // 許容電流[A]

  // TODO1: 配列の定義をする
  int R[?] = {5, 10, 15, 20, 25};   // 抵抗[Ω]
  double I[5];                      // 電流[A]（計算結果）
  int okCount = 0;

  // TODO2: 配列Iに電流を計算して格納
  for(int k = 0; k < 5; k++){
    I[k] = ???;
  }
// TODO3: 一覧表示＋OK件数の集計（ifで判定）
  printf("V=%.1fV  Imax=%.2fA\n", V, Imax);
  printf("-------------------------\n");
  printf("k  R(ohm)   I(A)    judge\n");
  printf("-------------------------\n");

  for(int k = 0; k < 5; k++){
    if(???){
      printf("%d %5d  %6.3f   WARN\n", k, R[k], I[k]);
    }else{
      printf("%d %5d  %6.3f   OK\n", k, R[k], I[k]);
      okCount = okCount + 1;
    }
  }

  printf("-------------------------\n");
  printf("OK=%d / 5\n", okCount);

  return 0;
}

```

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 解答

### TODO1

```C
// TODO1: 配列の定義をする
int R[?] = {5, 10, 15, 20, 25};   // 抵抗[Ω]
```
> // TODO1: 配列の定義をする
> int R[5] = {5, 10, 15, 20, 25};   // 抵抗[Ω]

### TODO2

```C
// TODO2: 配列Iに電流を計算して格納
for(int k = 0; k < 5; k++){
  I[k] = ???;
}
```

> // TODO2: 配列Iに電流を計算して格納
> I[k] = V / R[k];

### TODO3

```C
// TODO3: 一覧表示＋OK件数の集計（ifで判定）
for(int k = 0; k < 5; k++){
  if(???){
    printf("%d %5d  %6.3f   WARN\n", k, R[k], I[k]);
  }else{
    printf("%d %5d  %6.3f   OK\n", k, R[k], I[k]);
    okCount = okCount + 1;
  }
}
```

> // TODO3: 一覧表示＋OK件数の集計（ifで判定）
> if(I[k] > Imax)
