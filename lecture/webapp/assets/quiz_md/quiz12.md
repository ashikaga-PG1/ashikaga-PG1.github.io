# Quiz 12
## Q1
標準入力（stdin）として基本になるものはどれ？

- A: キーボード
- B: 画面
- C: プリンタ
- D: result.txt

**Answer:** A
**Explain:** 標準入力（stdin）は、基本的にはキーボード入力です。

## Q2
ファイル入出力の基本手順として正しい順番は？

- A: fopen -> fscanf / fprintf -> fclose
- B: fclose -> fopen -> fscanf
- C: printf -> scanf -> return
- D: return -> fopen -> fclose

**Answer:** A
**Explain:** まず開いて、読んだり書いたりして、最後に閉じます。

## Q3
scanf で double を読み取るときの書式指定子は？

- A: %d
- B: %f
- C: %lf
- D: %c

**Answer:** C
**Explain:** double は scanf では %lf を使います。

## Q4
書き込みモード "w" の意味として正しいのは？

- A: 追記
- B: 新規作成または上書きして書く
- C: 読み取り専用
- D: バイナリ

**Answer:** B
**Explain:** "w" は新規作成または上書きです。追記は "a" です。

## Q5
fprintf と printf の違いとして正しいのは？

- A: fprintf は画面、printf はファイル
- B: fprintf は FILE* を指定してファイルへ出力できる（書式は printf と同じ）
- C: fprintf は入力専用
- D: どちらも FILE* が必須

**Answer:** B
**Explain:** fprintf は出力先を FILE* で指定できます。printf は標準出力です。
