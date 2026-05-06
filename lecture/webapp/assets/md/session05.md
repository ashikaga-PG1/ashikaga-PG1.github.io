:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

# 第5回：電気回路とプログラミング1（演習課題1）：解説

## 課題
オームの法則 I = V / R を用いて、与えられた電圧Vと抵抗Rから電流Iを計算するプログラムを完成させてください。この回は 条件分岐 と 繰り返し を使うことがポイントです。

## 仕様（提出物）
- 電圧 V=5.0[V] とする
- 許容電流 Imax=0.60[A] とする
- for文で抵抗 R=5,10,15,...,50[Ω] を順に処理する
- 各Rについて I=V/R を計算し、1行ずつ表示する（小数3桁）
- I>Imax なら WARN、それ以外は OK と表示する
- OK の件数を数えて最後に OK=○ / 10 を表示する
- ヒント：I=V/R。小数表示は printf("%.3f", 値) を使います

![](assets/img/session04/circuit.png)

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 未完成コード（課題）

```c
#include <stdio.h>

int main(void){
  const double V = 5.0;      // 電圧[V]
  const double Imax = 0.60;  // 許容電流[A]

  int okCount = 0;           // OKの件数

  printf("V=%.1fV  Imax=%.2fA\n", V, Imax);
  printf("-------------------------\n");
  printf("R(ohm)   I(A)    judge\n");
  printf("-------------------------\n");

  for(int k = 1; k <= 10; k++){
    int R = 5 * k;              // 5,10,15,...,50

    // TODO1: オームの法則で電流Iを計算
    double I = ???;

    // TODO2: 判定して表示（WARN/OK）
    //        OKのときは okCount を増やす
    if( ??? ){
      printf("%5d  %6.3f   WARN\n", R, I);
    }else{
      printf("%5d  %6.3f   OK\n", R, I);
      okCount = ???;
    }
  }

  printf("-------------------------\n");
  printf("OK=%d / 10\n", okCount);

  return 0;
}
```

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 解答

### TODO1

```C
// TODO1: オームの法則で電流Iを計算
double I = ???;
```
> // TODO1: オームの法則で電流Iを計算
> double I = V / R;

### TODO2

```C
// TODO2: 判定して表示（WARN/OK）
//        OKのときは okCount を増やす
if( ??? ){
  printf("%5d  %6.3f   WARN\n", R, I);
}else{
  printf("%5d  %6.3f   OK\n", R, I);
  okCount = ???;
}
```

> // TODO2: 判定して表示（WARN/OK）
> if( I > Imax )

> //        OKのときは okCount を増やす
> 解１）okCount = okCount + 1;
> 解２）okCount++; // 省略表記 変数++ で変数の中身を１つ増やす
