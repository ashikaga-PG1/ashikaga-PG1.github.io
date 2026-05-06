# Quiz 15
## Q1
線形探索（Linear Search）の説明として正しいのは？

- A: 二分探索のこと
- B: 先頭から順に比較して探す
- C: ランダムに探す
- D: 必ずO(1)で探せる

**Answer:** B
**Explain:** 線形探索は上から順に見ていく最も基本的な探索です。

## Q2
配列 `a` の要素数を、その場で求める書き方として適切なのは？

- A: sizeof(a)/sizeof(a[0])
- B: sizeof(a[0])/sizeof(a)
- C: length(a)
- D: count(a)

**Answer:** A
**Explain:** 配列本体がその場にあるときは、`sizeof(a)/sizeof(a[0])` で要素数を求められます。

## Q3
バブルソートの基本動作として正しいのは？

- A: 隣り合う要素を比較し、必要なら交換する
- B: 最大値だけを1回で見つける
- C: 必ず1回で並ぶ
- D: 要素を削除する

**Answer:** A
**Explain:** 隣接比較＋交換を繰り返して整列します。

## Q4
2つの変数 a と b を交換する一般的な方法は？

- A: a=b; b=a;
- B: temp=a; a=b; b=temp;
- C: a=a+b; b=a-b; a=a-b;
- D: swap(a)

**Answer:** B
**Explain:** 一時変数 temp を使うのが最も読みやすく安全です。

## Q5
struct を使う利点として最も適切なのは？

- A: 配列が不要になる
- B: 関連する値をひとまとめにして扱える
- C: 必ず高速になる
- D: printfが不要になる

**Answer:** B
**Explain:** RLC定数や状態のように関連する値をまとめるのに向きます。
