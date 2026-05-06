:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1
# 第9回：関数（引数・戻り値）

## 1. 導入
- よく使う計算を「部品化」して再利用する＝関数
- 回路計算（I=V/R）やチェック処理を整理できる
- 後半：関数サンプルを動かして、引数を変えて確認

### 90分の流れ
- 前半（約45分）：スライド → 確認テスト（5問）
- 後半（約45分）：サンプル実験のコード確認 → VSCode で実行・改造

## 2. 今日のゴール（目標）
- 関数の宣言（プロトタイプ）と定義を書ける
- 引数と戻り値（return）の意味を説明できる
- mainを短くして、処理を関数に分けられる

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### 関数

> **ポイント:** C言語は、**手続き型**のプログラミング言語であり、処理を関数に分けて整理できる

```c
#include <stdio.h>

int main(void){               // main という名前の関数
  printf("Hello, World!\n");
  return 0;
}
```

---

## ユーザー定義関数

- 関数を自分で作ることができる = ユーザー定義関数
- コード（プログラム）のメンテナンス（保守、修正）がやりやすくなる
- コード（プログラム）の再利用がやりやすくなる

### 関数利用あり

```c
#include <stdio.h>

// 整数型の a + b の計算結果を戻り値とする calcという名前の関数
int calc(int a, int b){
  return a + b; // 掛け算にしたくなったら、ここだけ修正（+ → *）
}

int main(void){

  printf("%d\n", calc(3,5)); // 引数に(3, 5)を設定して add関数を呼び、結果を表示する 
  printf("%d\n", calc(4,6)); // 引数に(4, 6)を設定して add関数を呼び、結果を表示する 
  printf("%d\n", calc(5,7)); // 引数に(5, 7)を設定して add関数を呼び、結果を表示する 

  return 0;
}
```

### 関数利用なし

```c
#include <stdio.h>

int main(void){

  printf("%d\n", 3+5); // 3+5の結果を表示する
  printf("%d\n", 4+6); // 4+6の結果を表示する 
  printf("%d\n", 5+7); // 5+7の結果を表示する 
  
  return 0;
}
```

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## 関数の構成

![](assets/img/session09/fnc_img.png)

```c
関数の型 関数名(仮引数){
  return 戻り値;
}

int main(){

  関数名(引数); // 関数名と、渡したい値（変数でもOK）を書く
  return 0;
}
```

- 戻り値がない関数の型は、`void` とする
- 引数がない関数の仮引数は、`void` とする
> **ポイント:** voidは、空（空っぽ）という意味です

```c
#include <stdio.h>

// Hello, world! と表示するだけの関数
void hello(void){   // void = 戻り値がない, (void) = 引数がない
  printf("Hello, world!\n");
}

int main(void){
  hello();      // 関数を呼ぶ （引数はないので空欄）
  return 0;
}
```

- 関数からさらに関数を呼ぶこともできる
- 自分自身を呼ぶ（**関数Aの中で、関数Aを使う**）こともできる（再帰）

![](assets/img/session09/fnc_subfnc.png)

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### 関数の形（プロトタイプ→定義）

- 先に「使う宣言」を書く（プロトタイプ）
- その下に「中身」を書く（定義）
- 戻り値がないとき、仮引数は `void` とする
- `main` より前に関数の定義を書けば、プロトタイプを省略できる場合もある
- この授業では、関数の位置関係に応じて、プロトタイプありと省略した書き方の両方が出てくる

```c
#include <stdio.h>

int add(int a, int b);   // プロトタイプ宣言

int add(int a, int b){   // 定義
  return a + b;
}

int main(void){
  printf("%d\n", add(3,5));
  return 0;
}
```

![](assets/img/session09/fnc_return.png)

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### 引数で値を受け取る

- 同じ処理でも入力が変わる：引数で渡す
- 回路：VとRを渡してIを返すなど
- 「どこで使うか」を意識して関数名を付ける

```c
#include <stdio.h>

double current(double V, double R){
  return V / R;
}

int main(void){
  printf("%.3f\n", current(5.0, 10.0));
  return 0;
}
```

![](assets/img/session09/fnc_return2.png)

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### 戻り値と早期return

- 条件により `return` で早く抜ける（エラー処理）
- 関数の中で `printf` を乱用しない（責務分離）
- 動作確認しやすい小さな関数にする

```c
#include <stdio.h>

double current(double V, double R){
  if(R == 0){
    return -1;  // もし R=0 だったら、計算せずに -1 を main関数に戻す
  }
  return V / R;
}

int main(void){
  printf("%.3f\n", current(5.0, 10.0));
  return 0;
}
```

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### 参考：int main()の意味

- `int main` は、整数型の値を返す `main` という名前の関数であることを意味する
- `return 0` は、整数0 を返す（`main` 関数は、C言語の中でも特別な関数）
- 慣例として、成功した場合（正常終了）は `0`、失敗した場合（異常終了）は `-1` を返す
- `main` 関数の値はどこに返すかというと、`OS（Operating System）`

```c
#include <stdio.h>
int main(void){     // int型の main という名前の関数 という意味

  int a = 7, b = 2;

  printf("%d\n", a / b);
  printf("%.1f\n", (double)a / b);

  return 0;        // int なので、整数を返す（0以外でもOK。慣例として0）
}
```

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### まとめ

- 関数で「計算の部品化」→ `main`関数が読みやすくなる
- 引数＝入力、戻り値＝結果（`return`）
- 次回：回路×関数（課題3）

![](assets/img/session09/fnc_return.png)

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 後半：サンプル実験の解説

- 「サンプル実験」タブのコードを見ながら、**読むポイント**を確認します
- 基本は **読む → 動かす → 少し変える** です
- 入力値やファイル内容を変えて**挙動を観察**します

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### サンプル1：関数で2乗を計算

- 関数：処理をまとめて名前を付ける（再利用）
- `return` で計算結果を返す
- **改造例**：3乗関数にする／引数を増やす

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### サンプル2：関数でオームの法則（I=V/R）

- オームの法則 `I=V/R` を関数化
- 引数（V,R）→ 戻り値（I） の形にすると使い回せる
- **改造例**：`R==0` のときの対策を入れる（ifでエラー表示など）

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### サンプル3：関数で配列の合計

- `sumArray(a, n)` のように **配列＋要素数** を渡すのが基本
- 関数の中で `for` して合計を計算
- **改造例**：平均（sum/n）を返す関数を作る

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

### VSCode 実習の進め方

1. 授業資料ツールの **サンプル実験** を実行して、出力・変数表示を確認します
2. そのまま **VSCode** で同等のコードを作成して実行します
3. 値や条件を変えて挙動を観察します（例：定数／配列の中身／ループ回数）
