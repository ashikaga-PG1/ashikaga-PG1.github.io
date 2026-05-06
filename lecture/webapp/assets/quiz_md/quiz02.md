# Quiz 2
## Q1
int と double の説明として正しいのは？

- A: どちらも整数型
- B: intは整数、doubleは小数を扱える
- C: intは文字列、doubleは整数
- D: doubleは真偽値

**Answer:** B
**Explain:** int は整数、double は実数（小数）を扱います。

## Q2
int 型の変数 a を表示する printf の書式は？

- A: %f
- B: %d
- C: %lf
- D: %c

**Answer:** B
**Explain:** %d は整数（int）用の書式指定子です。

## Q3
小数を小数第2位まで表示したい。適切なのは？

- A: printf("%f", x);
- B: printf("%.2f", x);
- C: printf("%2.f", x);
- D: printf("%d", x);

**Answer:** B
**Explain:** %.2f は小数点以下2桁で表示します。

## Q4
Cで int a=7, b=2; のとき a/b の結果は？

- A: 3
- B: 3.5
- C: 4
- D: 0

**Answer:** A
**Explain:** int 同士の割り算は整数除算になり、小数点以下は切り捨てられます。

## Q5
7/2 を 3.5 として計算したい。適切なのは？

- A: a/b
- B: (double)a/b
- C: a/(int)b
- D: (int)a/(double)b

**Answer:** B
**Explain:** どちらかを double にすると実数除算になります。

