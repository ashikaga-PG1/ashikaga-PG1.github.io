:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

# 第2回：C言語の基本（変数・出力）

## 1. 導入
- 変数＝値を入れて使う箱（int / double）
- printfの書式（%d, %f）で表示をコントロール
- 後半：サンプル実験 → VSCode で同じコードを動かして確認します

### 90分の流れ
- 前半（約45分）：スライド → 確認テスト（5問）
- 後半（約45分）：サンプル実験のコード確認 → VSCode で実行・改造

## 2. 今日のゴール（目標）
- 変数の宣言・代入・計算ができる（int / double）
- printfの基本書式（%d, %.2f）を使い分けられる
- 整数除算とキャストの違いを説明できる

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## 復習：プログラムとは何か（IPO）

- Input（入力）→ Process（処理）→ Output（出力）

```mermaid
flowchart LR
  A[入力] --> B[処理]
  B --> C[出力]
```

- 電気回路の計算も同じ（与えられた値→結果）
- まずは Output（表示）から慣れる

![](assets/img/session01/circuit.png)

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### 処理の流れ
- Input（入力）→ Process（処理）→ Output（出力）
- この [処理] の部分が、**分岐**したり、**繰り返したり**する

> **ポイント:** 今後の講義の中でも繰り返し登場します（I→P→O）

```mermaid
flowchart LR
  A[入力] --> B[処理]
  B --> C[出力]
```

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### 復習:printf

- Cは **main**から始まる
- `printf` で出力できる

```c
#include <stdio.h>
int main(void){
  printf("Hello, world!\n");
  return 0;
}
```

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### 変数
- 変数：プログラムに入力する値（数値、文字列など）を入れておく箱
- 変数には型（カタ）がある
- 数値（整数、小数）、文字（文字列）など
- プログラムが行う処理にあわせて変数の型を選び使用する必要がある

> **ポイント:** 型を間違えると求める結果を得られない場合がある

![](assets/img/session02/parameters2.png)

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1
![](assets/img/session02/type.png)

## 変数の型（カタ）

### 整数型
- 例：-1, 0, 1, 2, 3
- よく使うのは、`int`

### 浮動小数点数型
- 例：-1.00, 0.00, 1.00, 2.00, 3.00
- よく使うのは、 `double`

```c
#include <stdio.h>
int main(void){
  int a = 2; // 整数
  
  double pi = 3.141592; // 浮動小数点数
  
  return 0;
}
```

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1
![](assets/img/session02/parameters.png)

### 変数の宣言と代入

- `int a;` ：整数の箱を用意
- `a = 2;` ：値を入れる

> **ポイント:** 宣言と代入は、まとめてもOK： `int a = 3;`

```c
#include <stdio.h>
int main(void){
  int a = 2, b = 3;
  int i = a + b;
  printf("%d\n", i);
  return 0;
}
```

![](assets/img/session02/formula.png)

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### double と表示（%.2f）

- 小数を扱う：`double`
- 円の面積など（πr^2）の計算に使う
- 表示は `%.2f` のように桁を揃える
- 小数点以下**第２位**まで表示させたい場合は、 `%.2f` 
- 小数点以下**第n位**まで表示させたい場合は、 `%.nf` 

```c
#include <stdio.h>
int main(void){
  double r = 2.0;
  double s = 3.14159 * r * r;
  
  printf("%.2f\n", s);
  
  return 0;
}
```

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1
![](assets/img/session02/calc.png)

### 加減剰余

- 加減乗除：+, -, *, /
- 剰余：% (7%2 = 1; 7割る2・・・1)

```c
#include <stdio.h>
int main(void){
  
  printf("%d\n", 1 + 2); // 和
  
  printf("%d\n", 9 - 1); // 差
  
  printf("%d\n", 3 * 4); // 乗
  
  printf("%d\n", 6 / 2); // 除

  printf("%d\n", 6 % 4); // 剰余
  
  return 0;
}
```

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### 整数除算とキャスト（型変換）

- `7/2` を計算
- int同士 → 3（切り捨て）
- (double) を付けると小数になる：3.5

> **ポイント:** どの型で計算しているかを意識する

```c
#include <stdio.h>
int main(void){
  
  int a = 7, b = 2;
  
  printf("%d\n", a / b); // 3
  printf("%.1f\n", (double)a / b); // 3.5
  
  return 0;
}
```

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### まとめ

- 変数に入れて計算→printfで表示（学習の基本形）
- intとdoubleの違い（整数／小数、除算の結果）
- 次回：条件分岐と繰り返し（if, for, while）

```mermaid
flowchart LR
  A[入力] --> B[処理]
  B --> C[出力]
```

![](assets/img/session02/parameters2.png)

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 後半：サンプル実験の解説

- 「サンプル実験」タブのコードを見ながら、**読むポイント**を確認します
- 基本は **読む → 動かす → 少し変える** です
- 入力値やファイル内容を変えて**挙動を観察**します

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### サンプル1：変数とprintf（足し算）

- `int a,b,s` を用意して、`s=a+b` を計算
- `%d` で `s` を表示
- **改造例**：`a,b` を変える／`s` を使わずに `a+b` を直接表示してもOK

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### サンプル2：doubleと書式（面積）

- `double`：小数（実数）を扱う型
- 面積 `s=πr^2` を計算（`r*r`）
- `%.2f`：小数点以下2桁で表示
- **改造例**：`r` を変えて面積が2乗で増えることを確認

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### サンプル3：整数除算とキャスト

- `a/b`（int同士）は **整数除算**（小数が切り捨て）
- `(double)a/b` にすると **実数計算**になる
- **改造例**：`a=5,b=2` などにして差を観察

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### VSCode 実習の進め方

1. 授業資料ツールの **サンプル実験** を実行して、出力・変数表示を確認します
2. そのまま **VSCode** で同等のコードを作成して実行します
3. 値や条件を変えて挙動を観察します（例：定数／配列の中身／ループ回数）
