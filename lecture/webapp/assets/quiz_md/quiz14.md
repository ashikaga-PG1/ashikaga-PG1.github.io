# Quiz 14
## Q1
入力ファイルを読み取り用で開く関数は？

- A: fopen
- B: fprintf
- C: fscanf
- D: fclose

**Answer:** A
**Explain:** ファイルを開くときは fopen を使います。

## Q2
`fopen(name, "w")` の意味として正しいのは？

- A: 読み取り専用で開く
- B: 追記で開く
- C: 書き込み用で開く
- D: 閉じる

**Answer:** C
**Explain:** "w" は書き込み用で、既存内容は上書きされます。

## Q3
`while(fscanf(fin, "%lf %lf", &V, &R) == 2)` の `== 2` が表す意味は？

- A: ファイルを2回開く
- B: 2個の値を正しく読み取れた
- C: 2行読み飛ばす
- D: 2バイト読む

**Answer:** B
**Explain:** V と R の 2 項目を読めたときだけ処理を続けます。

## Q4
計算した電流 I を result.txt に書き出すのに使う関数は？

- A: printf
- B: scanf
- C: fprintf
- D: fopen

**Answer:** C
**Explain:** fprintf は出力先の FILE* を指定して書き込めます。

## Q5
処理が終わったあと、開いたファイルを閉じる関数は？

- A: fclose
- B: finish
- C: fileend
- D: return

**Answer:** A
**Explain:** 開いたファイルは fclose で閉じます。
