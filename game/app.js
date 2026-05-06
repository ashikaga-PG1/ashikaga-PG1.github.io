(() => {
  "use strict";

  const STORAGE_KEY = "campus-circuit-c-quest-progress-v3";
  const PUBLISHED_CHAPTER_COUNT = 5;

  const chapterAbstracts = [
    {
      chapter: "第1章 基本",
      title: "Cプログラムを動かす最小セット",
      abstract: "printfで結果を表示し、変数で測定値を保持し、ifで安全判定を行います。forとwhileでは、抵抗値の候補を順に調べる回路調整を題材に、繰り返し処理の使い分けを学びます。"
    },
    {
      chapter: "第2章 配列",
      title: "複数の測定値をまとめて扱う",
      abstract: "複数の抵抗値や枝電流を配列に並べ、添字で取り出します。配列とforを組み合わせて全要素を処理し、ifと組み合わせて異常値の数を集計します。"
    },
    {
      chapter: "第3章 関数",
      title: "計算と処理を再利用できる形にする",
      abstract: "#includeとstdio.hの意味を確認し、printfなどの標準入出力を使う準備を理解します。さらに、電流計算を関数化し、引数・戻り値・プロトタイプ宣言を使ってプログラムを読みやすく分けます。"
    },
    {
      chapter: "第4章 ファイル入出力",
      title: "測定ログを読み書きする",
      abstract: "FILEポインタ、fopen、fscanf、fprintf、fcloseを使い、測定ログを読み込んで計算結果を報告書へ書き出します。画面表示だけでなく、データを残すプログラムへ発展させます。"
    },
    {
      chapter: "第5章 発展",
      title: "交流回路と複雑な計算",
      abstract: "math.hを使って、RLC回路のインピーダンスや共振周波数を計算します。これまでの基本からファイル操作までの知識を総動員して、より高度な電子回路解析に挑戦します。"
    }
  ];

  const missions = [
    {
      id: "basic-printf",
      chapter: "第1章 基本",
      session: "1-1 printf",
      title: "監視端末を起動せよ",
      tags: ["printf", "main", "改行"],
      brief: "Cプログラムの入口を作り、監視端末へ状態を表示する。まずは main、printf、改行、正常終了をひとつの最小プログラムとして接続する。",
      points: ["Cは main 関数から実行される", "printf は文字列や数値を画面に出す", "\\n は端末の表示を次の行へ送る"],
      formulas: ["処理の入口(main)", "文字列の表示(printf)", "処理の正常終了(return)"],
      circuit: { voltage: 5, resistors: [10], limit: 0.6 },
      code: [
        "#include {{header}}",
        "",
        "int {{entry}}(void) {",
        "  {{print}}(\"AUX POWER ONLINE{{newline}}\");",
        "  {{finish}};",
        "}"
      ].join("\n"),
      blanks: [
        { id: "header", label: "ヘッダ", answer: "<stdio.h>", options: ["<math.h>", "<stdio.h>", "<stdlib.h>", "<string.h>"] },
        { id: "entry", label: "開始関数", answer: "main", options: ["start", "main", "printf", "init"] },
        { id: "print", label: "出力関数", answer: "printf", options: ["scanf", "printf", "fopen", "return"] },
        { id: "newline", label: "改行", answer: "\\n", options: ["\\t", "\\0", "\\n", "/n"] },
        { id: "finish", label: "正常終了", answer: "return 0", options: ["return 0", "printf 0", "break 0", "exit"] }
      ],
      hint: "printf を使うには <stdio.h> が必要。処理の入口は main、正常終了は return 0 です。",
      terminal: "AUX POWER ONLINE\n\n[OK] 補助電源盤の監視端末が応答しました。"
    },
    {
      id: "basic-variables",
      chapter: "第1章 基本",
      session: "1-2 変数",
      title: "計測値を変数で保持せよ",
      tags: ["int", "double", "書式"],
      brief: "回路の電圧・抵抗・電流を変数として名前付きで保持する。整数と小数の型を使い分け、端末に単位付きで表示する。",
      points: ["int は整数、double は小数を扱える", "変数名は値の意味がわかる名前にする", "printf の %d と %f は型に合わせて使う"],
      formulas: ["実数型の宣言", "整数の書式(%d)", "小数の書式(%f)"],
      circuit: { voltage: 12, resistors: [8, 16, 24], limit: 1.8 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  {{vtype}} busV = 12.0;",
        "  {{rtype}} shuntR = 8.0;",
        "  double I = {{currentCalc}};",
        "  printf(\"R=%d Ω  I={{fmtA}} A\\n\", (int)shuntR, I);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "vtype", label: "電圧の型", answer: "double", options: ["int", "double", "char", "void"] },
        { id: "rtype", label: "抵抗の型", answer: "double", options: ["int", "double", "FILE", "main"] },
        { id: "currentCalc", label: "電流計算", answer: "busV / shuntR", options: ["busV / shuntR", "busV * shuntR", "shuntR / busV", "busV - shuntR"] },
        { id: "fmtA", label: "電流表示", answer: "%.3f", options: ["%d", "%.3f", "%c", "%s"] }
      ],
      hint: "電流は小数になるので double。double を表示するときは %f 系の書式を使います。",
      terminal: "R=8 Ω  I=1.500 A\n\n[OK] 変数で計測値を安全に保持しました。"
    },
    {
      id: "basic-if",
      chapter: "第1章 基本",
      session: "1-3 if",
      title: "過電流を判定せよ",
      tags: ["if", "比較", "分岐"],
      brief: "計算した電流が安全上限を超えたか判定する。if と else を使い、同じ測定値でも状態に応じたメッセージを分けて出す。",
      points: ["if は条件が真のときだけ処理を行う", "比較には >, <, == などを使う", "else は条件が偽だった場合の処理を書く"],
      formulas: ["条件による分岐", "値の比較判定", "不一致時の処理(else)"],
      circuit: { voltage: 5, resistors: [2, 5, 10, 20], limit: 0.8 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  double V = 5.0;",
        "  double R = 5.0;",
        "  double limit = 0.8;",
        "  double I = V / R;",
        "",
        "  if ({{condition}}) {",
        "    printf(\"LIMIT\\n\");",
        "  } {{elseToken}} {",
        "    printf(\"SAFE\\n\");",
        "  }",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "condition", label: "過電流条件", answer: "I > limit", options: ["I = limit", "I > limit", "R > I", "limit > R"] },
        { id: "elseToken", label: "偽の場合", answer: "else", options: ["then", "else", "case", "return"] }
      ],
      hint: "代入の = と比較の == は違います。上限超えは I > limit で判定できます。",
      terminal: "I=1.000 A\nLIMIT\n\n[OK] 過電流を分岐で検出しました。"
    },
    {
      id: "basic-for",
      chapter: "第1章 基本",
      session: "1-4 for",
      title: "抵抗候補を一括走査せよ",
      tags: ["for", "繰り返し", "カウンタ"],
      brief: "複数の抵抗候補を順番に試算する。回数が決まっている作業では for 文を使うと、初期化・条件・更新が一行で見える。",
      points: ["for(初期化; 条件; 更新) の形を覚える", "カウンタ変数 k は処理回数や候補番号に使える", "同じ計算を何度も書かずに済む"],
      formulas: ["回数指定の反復", "カウンタ変数", "等差数列の計算"],
      circuit: { voltage: 5, drop: 2, resistors: [100, 150, 200, 250, 300], limit: 0.02 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  double Vin = 5.0, Vf = 2.0;",
        "  for ({{loop}}) {",
        "    int R = {{resistance}};",
        "    double I = (Vin - Vf) / R;",
        "    printf(\"%d Ω  %.3f A\\n\", R, I);",
        "  }",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "loop", label: "5回の走査", answer: "int k = 0; k < 5; k++", options: ["int k = 0; k < 5; k++", "int k = 1; k < 5", "int k = 5; k < 0; k++", "k = k + 1"] },
        { id: "resistance", label: "抵抗候補", answer: "100 + 50 * k", options: ["100 + 50 * k", "100 / 50 * k", "50 - k", "k / 100"] }
      ],
      hint: "0,1,2,3,4 の5回処理したいときは k < 5。抵抗値は k に応じて増やします。",
      terminal: "100 Ω  0.030 A\n150 Ω  0.020 A\n200 Ω  0.015 A\n250 Ω  0.012 A\n300 Ω  0.010 A"
    },
    {
      id: "basic-while",
      chapter: "第1章 基本",
      session: "1-5 while",
      title: "安全値になるまで抵抗を増やせ",
      tags: ["while", "更新", "停止条件"],
      brief: "条件を満たすまで処理を続ける。while は終了条件を自分で変化させる必要があるため、更新を忘れると止まらない。",
      points: ["while は条件が真の間だけ繰り返す", "ループ内で条件に関係する値を更新する", "終了後の値が設計判断に使える"],
      formulas: ["条件成立中の反復", "変数の値の更新", "無限ループの回避"],
      circuit: { voltage: 5, drop: 2, resistors: [100, 150, 200, 250, 300], limit: 0.02 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  double Vin = 5.0, Vf = 2.0, limit = 0.020;",
        "  int R = 100;",
        "  double I = (Vin - Vf) / R;",
        "",
        "  while ({{condition}}) {",
        "    R = {{updateR}};",
        "    I = (Vin - Vf) / R;",
        "  }",
        "  printf(\"selected=%d Ω\\n\", R);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "condition", label: "継続条件", answer: "I > limit", options: ["I > limit", "I = limit", "R < I", "limit > R"] },
        { id: "updateR", label: "抵抗更新", answer: "R + 50", options: ["R + 50", "R - 50", "I + 50", "limit + R"] }
      ],
      hint: "while の条件がいつか偽になるように、ループ内で R と I を更新します。",
      terminal: "100 Ω -> 0.030 A\n150 Ω -> 0.020 A\nselected=150 Ω"
    },
    {
      id: "array-basic",
      chapter: "第2章 配列",
      session: "2-1 配列の基本",
      title: "センサ値をひとつの棚に並べよ",
      tags: ["配列", "添字", "要素数"],
      brief: "複数の抵抗値を別々の変数ではなく配列にまとめる。配列は同じ型の値を順番に格納し、添字で取り出す。",
      points: ["Cの配列添字は0から始まる", "要素数5の最後の添字は4", "同じ意味の値をまとめると処理しやすい"],
      formulas: ["配列の定義と確保", "最初の番号(0)", "最後の番号(N-1)"],
      circuit: { voltage: 3.3, resistors: [220, 330, 470, 680, 1000], limit: 0.012 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  int R{{size}} = {220, 330, 470, 680, 1000};",
        "  printf(\"first=%d Ω\\n\", R[{{firstIndex}}]);",
        "  printf(\"last=%d Ω\\n\", R[{{lastIndex}}]);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "size", label: "要素数", answer: "[5]", options: ["[4]", "[5]", "[0]", "[N-1]"] },
        { id: "firstIndex", label: "最初の添字", answer: "0", options: ["0", "1", "5", "-1"] },
        { id: "lastIndex", label: "最後の添字", answer: "4", options: ["3", "4", "5", "N"] }
      ],
      hint: "5個の配列は R[0] から R[4] まで。R[5] は範囲外です。",
      terminal: "first=220 Ω\nlast=1000 Ω\n\n[OK] 配列の端を正しく参照しました。"
    },
    {
      id: "array-loop",
      chapter: "第2章 配列",
      session: "2-2 配列 + for",
      title: "枝電流をまとめて計算せよ",
      tags: ["配列", "for", "計算結果"],
      brief: "抵抗配列 R と電流配列 I を添字で対応させる。for 文と配列を組み合わせると、同じ式を全要素へ適用できる。",
      points: ["R[k] と I[k] は同じ枝番号を表す", "計算結果を別配列に保存できる", "for の条件は k < 要素数 が基本"],
      formulas: ["配列要素への順次アクセス", "カウンタを添字に使う", "一括計算の適用"],
      circuit: { voltage: 3.3, resistors: [220, 330, 470, 680, 1000], limit: 0.012 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  double Vref = 3.3;",
        "  int R[5] = {220, 330, 470, 680, 1000};",
        "  double I[5];",
        "",
        "  for ({{loop}}) {",
        "    I[k] = {{calc}};",
        "  }",
        "  printf(\"I0=%.4f A\\n\", I[0]);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "loop", label: "全要素処理", answer: "int k = 0; k < 5; k++", options: ["int k = 0; k < 5; k++", "int k = 1; k <= 5; k++", "int k = 0; k <= 5; k++", "int k = 5; k > 0; k++"] },
        { id: "calc", label: "電流配列", answer: "Vref / R[k]", options: ["Vref / R", "Vref / R[k]", "R[k] / Vref", "I[k] / Vref"] }
      ],
      hint: "配列の添字をforのカウンタ k として使うと、全要素に同じ処理を流せます。",
      terminal: "I0=0.0150 A\nI1=0.0100 A\nI2=0.0070 A\n\n[OK] 配列とforで枝電流を計算しました。"
    },
    {
      id: "array-combo",
      chapter: "第2章 配列",
      session: "2-3 配列 + if",
      title: "センサ島の異常枝を数えよ",
      tags: ["配列", "if", "集計"],
      brief: "配列、for、ifを組み合わせて、複数枝のうち上限を超えた枝を数える。基礎構文を組み合わせると小さな診断ツールになる。",
      points: ["配列から取り出した値を条件判定できる", "条件を満たした回数をカウンタで数える", "結果は端末に集計として出す"],
      formulas: ["データの条件選別", "フラグ/カウンタの加算", "全データのスキャン"],
      circuit: { voltage: 3.3, resistors: [220, 330, 470, 680, 1000], limit: 0.012 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  double Vref = 3.3, limit = 0.012;",
        "  int R[5] = {220, 330, 470, 680, 1000};",
        "  int highCount = 0;",
        "",
        "  for (int k = 0; k < 5; k++) {",
        "    double I = Vref / R[k];",
        "    if ({{condition}}) {",
        "      highCount = {{count}};",
        "    }",
        "  }",
        "  printf(\"HIGH=%d\\n\", highCount);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "condition", label: "異常条件", answer: "I > limit", options: ["I > limit", "I = limit", "R[k] > I", "limit > R[k]"] },
        { id: "count", label: "異常数更新", answer: "highCount + 1", options: ["highCount + 1", "highCount - 1", "I + 1", "R[k] + 1"] }
      ],
      hint: "異常枝を見つけたときだけ highCount を1増やします。",
      terminal: "branch 0: HIGH\nbranch 1: calm\nbranch 2: calm\nbranch 3: calm\nbranch 4: calm\nHIGH=1"
    },
    {
      id: "function-include",
      chapter: "第3章 関数",
      session: "3-1 include と stdio.h",
      title: "標準入出力の工具箱を読み込め",
      tags: ["include", "stdio.h", "宣言"],
      brief: "printf や scanf は最初から勝手に使える命令ではなく、標準入出力ライブラリの機能として宣言されている。#include で工具箱を読み込む感覚をつかむ。",
      points: ["#include はヘッダファイルを読み込む指示", "stdio.h は standard input/output のヘッダ", "printf, scanf, FILE などの宣言を使えるようにする"],
      formulas: ["外部機能の読み込み", "入出力ライブラリ", "関数の利用準備"],
      circuit: { voltage: 5, resistors: [10, 20], limit: 0.6 },
      code: [
        "{{includeLine}}",
        "",
        "int main(void) {",
        "  {{print}}(\"stdio connected\\n\");",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "includeLine", label: "標準入出力ヘッダ", answer: "#include <stdio.h>", options: ["#include <stdio.h>", "#include <math.h>", "include stdio", "#define stdio.h"] },
        { id: "print", label: "stdioの出力", answer: "printf", options: ["printf", "scanf", "fopen", "return"] }
      ],
      hint: "stdio.h を読み込むと printf など標準入出力の関数宣言を利用できます。",
      terminal: "stdio connected\n\n[OK] 標準入出力の工具箱を読み込みました。"
    },
    {
      id: "function-basic",
      chapter: "第3章 関数",
      session: "3-2 関数の基本",
      title: "電流計算を関数化せよ",
      tags: ["関数", "引数", "戻り値"],
      brief: "同じ計算を何度も書かないために、電流計算を関数に切り出す。入力を引数で受け取り、結果を戻り値として返す。",
      points: ["関数は処理に名前を付けて再利用する仕組み", "引数は関数に渡す入力", "return は関数の計算結果を呼び出し元へ返す"],
      formulas: ["共通処理の部品化", "外部からの入力(引数)", "計算結果の出力(戻り値)"],
      circuit: { voltage: 5, resistors: [10, 20, 50], limit: 0.6 },
      code: [
        "#include <stdio.h>",
        "",
        "double current(double V, double R) {",
        "  {{returnLine}};",
        "}",
        "",
        "int main(void) {",
        "  double I = {{call}};",
        "  printf(\"I=%.3f A\\n\", I);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "returnLine", label: "戻り値", answer: "return V / R", options: ["return V / R", "printf(V / R)", "return R / V", "void V / R"] },
        { id: "call", label: "関数呼び出し", answer: "current(5.0, 10.0)", options: ["current(5.0, 10.0)", "current", "double current", "printf(5.0, 10.0)"] }
      ],
      hint: "戻り値のある関数は return で値を返し、呼び出し側では変数に受け取れます。",
      terminal: "I=0.500 A\n\n[OK] 電流計算を再利用できる関数にしました。"
    },
    {
      id: "function-prototype",
      chapter: "第3章 関数",
      session: "3-3 プロトタイプ",
      title: "関数の予告を先に置け",
      tags: ["プロトタイプ", "void", "分割"],
      brief: "main より後ろに関数本体を書く場合、コンパイラへ先に関数の形を知らせる必要がある。これがプロトタイプ宣言。",
      points: ["プロトタイプは戻り値型・関数名・引数型を先に書く", "void は戻り値がないことを示す", "計算関数と表示関数を分けると読みやすい"],
      formulas: ["関数の形状を事前通知", "戻り値のない処理(void)", "mainと部品の分離"],
      circuit: { voltage: 5, drop: 2, resistors: [180, 220, 330, 470], limit: 0.02 },
      code: [
        "#include <stdio.h>",
        "",
        "{{proto}};",
        "void alarm(double I);",
        "",
        "int main(void) {",
        "  double I = ledCurrent(5.0, 2.0, 220.0);",
        "  alarm(I);",
        "  return 0;",
        "}",
        "",
        "double ledCurrent(double Vin, double Vf, double R) {",
        "  return (Vin - Vf) / R;",
        "}",
        "",
        "{{voidType}} alarm(double I) {",
        "  if (I > 0.020) printf(\"LIMIT\\n\");",
        "  else printf(\"SAFE\\n\");",
        "}"
      ].join("\n"),
      blanks: [
        { id: "proto", label: "プロトタイプ", answer: "double ledCurrent(double Vin, double Vf, double R)", options: ["double ledCurrent(double Vin, double Vf, double R)", "ledCurrent(double Vin, double Vf, double R)", "void ledCurrent(void)", "#define ledCurrent"] },
        { id: "voidType", label: "戻り値なし", answer: "void", options: ["int", "double", "void", "NULL"] }
      ],
      hint: "main から呼ぶ前に関数の形を宣言します。表示だけの alarm は戻り値がないので void です。",
      terminal: "ledCurrent(5.0, 2.0, 220.0) -> 0.014 A\nalarm(0.014) -> SAFE"
    },
    {
      id: "file-read",
      chapter: "第4章 ファイル入出力",
      session: "4-1 読み込み",
      title: "測定ログを読み込め",
      tags: ["FILE", "fopen", "fscanf"],
      brief: "キーボード入力だけでなく、ファイルから測定データを読む。FILE* でファイルを扱い、fscanf で数値を取り出す。",
      points: ["fopen はファイルを開く", "\"r\" は読み込みモード", "double を fscanf で読むときは %lf"],
      formulas: ["ファイルポインタの定義", "読み込み用で開く", "ファイルからのデータ取得"],
      circuit: { voltage: 10, resistors: [5, 10, 25], limit: 1.5 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  FILE *fp = {{openFile}}(\"night_log.txt\", {{mode}});",
        "  double V, R;",
        "  {{scan}}(fp, \"%lf %lf\", &V, &R);",
        "  printf(\"V=%.1f R=%.1f\\n\", V, R);",
        "  {{closeFile}}(fp);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "openFile", label: "開く", answer: "fopen", options: ["printf", "fopen", "scanf", "return"] },
        { id: "mode", label: "読み込みモード", answer: "\"r\"", options: ["\"r\"", "\"w\"", "\"lf\"", "\"stdio\""] },
        { id: "scan", label: "ファイル読取", answer: "fscanf", options: ["scanf", "fprintf", "fscanf", "fclose"] },
        { id: "closeFile", label: "閉じる", answer: "fclose", options: ["close", "fclose", "return", "break"] }
      ],
      hint: "ファイルから読むときは fscanf(fp, ...) のように、最初の引数に FILE* を渡します。",
      terminal: "night_log.txt: 10.0 5.0\nV=10.0 R=5.0\n\n[OK] 測定ログを読み込みました。"
    },
    {
      id: "file-write",
      chapter: "第4章 ファイル入出力",
      session: "4-2 書き込み",
      title: "点検表を書き出せ",
      tags: ["fprintf", "fclose", "出力"],
      brief: "計算結果を画面だけでなくファイルへ残す。fprintf は printf と同じ書式で、出力先を FILE* として指定できる。",
      points: ["\"w\" は新規作成または上書きの書き込みモード", "fprintf はファイルへ書式付き出力する", "開いたファイルは最後に fclose する"],
      formulas: ["書き込み用で開く", "ファイルへの出力", "使用後のクローズ"],
      circuit: { voltage: 10, resistors: [5, 10, 25], limit: 1.5 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  FILE *out = fopen(\"morning_report.txt\", {{mode}});",
        "  double V = 10.0, R = 5.0;",
        "  double I = V / R;",
        "  {{write}}(out, \"V=%.1f R=%.1f I=%.3f\\n\", V, R, I);",
        "  {{closeFile}}(out);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "mode", label: "書き込みモード", answer: "\"w\"", options: ["\"r\"", "\"w\"", "\"lf\"", "\"stdio\""] },
        { id: "write", label: "ファイル出力", answer: "fprintf", options: ["printf", "scanf", "fprintf", "fopen"] },
        { id: "closeFile", label: "閉じる", answer: "fclose", options: ["close", "fclose", "return", "break"] }
      ],
      hint: "printf は画面へ、fprintf は指定した FILE* へ出力します。書式指定の考え方は同じです。",
      terminal: "morning_report.txt\nV=10.0 R=5.0 I=2.000\n\n[OK] 点検表を書き出しました。"
    },
    {
      id: "file-io-combo",
      chapter: "第4章 ファイル入出力",
      session: "4-3 読み書き",
      title: "夜間ログから報告書を作れ",
      tags: ["while", "fscanf", "fprintf"],
      brief: "ファイルI/Oの総仕上げとして、複数行の測定ログを読みながら計算し、報告ファイルへ書き出す。while と組み合わせると行数が変わっても処理できる。",
      points: ["fscanf の戻り値で読み取り成功を判定できる", "while で読める間だけ処理する", "読み込み用と書き込み用の FILE* を分ける"],
      formulas: ["終端までのループ読取", "複数データの順次処理", "読込と書込の同時制御"],
      circuit: { voltage: 10, resistors: [5, 10, 25], limit: 1.5 },
      code: [
        "#include <stdio.h>",
        "",
        "int main(void) {",
        "  FILE *in = fopen(\"night_log.txt\", \"r\");",
        "  FILE *out = fopen(\"morning_report.txt\", \"w\");",
        "  double V, R;",
        "",
        "  while ({{readLoop}}) {",
        "    double I = {{calc}};",
        "    {{write}}(out, \"V=%.1f R=%.1f I=%.3f\\n\", V, R, I);",
        "  }",
        "  fclose(in);",
        "  fclose(out);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "readLoop", label: "読める間", answer: "fscanf(in, \"%lf %lf\", &V, &R) == 2", options: ["fscanf(in, \"%lf %lf\", &V, &R) == 2", "fprintf(in, \"%lf %lf\", &V, &R)", "scanf(out) == 2", "fclose(in) == 2"] },
        { id: "calc", label: "電流計算", answer: "V / R", options: ["V / R", "V * R", "R / V", "I / R"] },
        { id: "write", label: "報告出力", answer: "fprintf", options: ["printf", "scanf", "fprintf", "fopen"] }
      ],
      hint: "fscanf は読めた項目数を返します。V と R の2つが読めたときだけ処理を続けます。",
      terminal: [
        "night_log.txt",
        "10.0 5.0",
        "10.0 10.0",
        "10.0 25.0",
        "",
        "morning_report.txt",
        "V=10.0 R=5.0 I=2.000",
        "V=10.0 R=10.0 I=1.000",
        "V=10.0 R=25.0 I=0.400"
      ].join("\n")
    },
    {
      id: "rlc-math",
      chapter: "第5章 発展",
      session: "5-1 math.h と RLC",
      title: "共振周波数を算出せよ",
      tags: ["math.h", "sqrt", "M_PI"],
      brief: "交流回路における共振周波数を計算する。ルート（sqrt）や円周率（M_PI）を使うため、math.h ヘッダを導入する。",
      points: ["#include <math.h> で数学関数が使えるようになる", "sqrt(x) は x の平方根を計算する", "M_PI は数学定数としての円周率（近似値）"],
      formulas: ["数学ライブラリ(math.h)", "円周率の定数(M_PI)", "平方根の計算(sqrt)"],
      circuit: { voltage: 5, resistors: [10], limit: 1.0, drop: 0 },
      code: [
        "#include <stdio.h>",
        "{{includeMath}}",
        "",
        "int main(void) {",
        "  double L = 0.001; // 1mH",
        "  double C = 0.0000001; // 0.1uF",
        "  double f = 1.0 / (2.0 * {{piConst}} * {{rootFunc}}(L * C));",
        "  printf(\"f = %.1f Hz\\n\", f);",
        "  return 0;",
        "}"
      ].join("\n"),
      blanks: [
        { id: "includeMath", label: "数学ヘッダ", answer: "#include <math.h>", options: ["#include <math.h>", "#include <stdlib.h>", "#include <time.h>", "include math"] },
        { id: "piConst", label: "円周率定数", answer: "M_PI", options: ["PI", "M_PI", "3.14", "MATH_PI"] },
        { id: "rootFunc", label: "平方根関数", answer: "sqrt", options: ["sq", "sqrt", "root", "pow"] }
      ],
      hint: "平方根には sqrt()、円周率には math.h で定義されている M_PI を使います。",
      terminal: "f = 15915.5 Hz\n\n[OK] 共振周波数の計算に成功しました。高度な解析プログラムへの第一歩です。"
    }
  ];

  const state = loadState();
  let selectedMission = normalizeMissionIndex(state.currentMission || 0);
  let selectedResistorIndex = 0;
  let hintOpen = false;

  const elements = {
    chapterToc: document.getElementById("chapterToc"),
    energyValue: document.getElementById("energyValue"),
    energyBar: document.getElementById("energyBar"),
    scoreValue: document.getElementById("scoreValue"),
    completeCount: document.getElementById("completeCount"),
    missionList: document.getElementById("missionList"),
    missionSession: document.getElementById("missionSession"),
    missionTitle: document.getElementById("missionTitle"),
    missionTags: document.getElementById("missionTags"),
    missionBrief: document.getElementById("missionBrief"),
    formulaStrip: document.getElementById("formulaStrip"),
    codeBlock: document.getElementById("codeBlock"),
    blankCount: document.getElementById("blankCount"),
    runButton: document.getElementById("runButton"),
    hintButton: document.getElementById("hintButton"),
    nextButton: document.getElementById("nextButton"),
    feedback: document.getElementById("feedback"),
    circuitArt: document.getElementById("circuitArt"),
    circuitState: document.getElementById("circuitState"),
    resistorButtons: document.getElementById("resistorButtons"),
    meterVoltage: document.getElementById("meterVoltage"),
    meterResistance: document.getElementById("meterResistance"),
    meterCurrent: document.getElementById("meterCurrent"),
    meterJudge: document.getElementById("meterJudge"),
    terminal: document.getElementById("terminal"),
    terminalStatus: document.getElementById("terminalStatus"),
    resetButton: document.getElementById("resetButton")
  };

  elements.runButton.addEventListener("click", checkMission);
  elements.hintButton.addEventListener("click", showHint);
  elements.nextButton.addEventListener("click", goNext);
  elements.resetButton.addEventListener("click", resetProgress);

  render();

  function publishedMissions() {
    return missions.filter(isPublishedMission);
  }

  function isPublishedMission(mission) {
    if (!mission) return false;
    const num = chapterNumber(mission.chapter);
    if (num > PUBLISHED_CHAPTER_COUNT) return false;
    // 第5章は第4章の完了が条件
    if (num === 5) {
      const chapter4Missions = missions.filter((m) => chapterNumber(m.chapter) === 4);
      return chapter4Missions.length > 0 && chapter4Missions.every((m) => state.completed.includes(m.id));
    }
    return true;
  }

  function chapterNumber(chapter) {
    const match = String(chapter).match(/第(\d+)章/);
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
  }

  function normalizeMissionIndex(index) {
    const published = publishedMissions();
    const fallbackId = published[0] ? published[0].id : missions[0].id;
    const candidate = missions[Math.min(Math.max(index, 0), missions.length - 1)];
    if (isPublishedMission(candidate)) {
      return missions.indexOf(candidate);
    }
    return missions.findIndex((mission) => mission.id === fallbackId);
  }

  function loadState() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("debug")) {
      return {
        completed: missions.map((m) => m.id),
        score: missions.length * 150,
        currentMission: 0
      };
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.completed)) {
        return {
          completed: saved.completed.filter(Boolean),
          score: Number.isFinite(saved.score) ? saved.score : 0,
          currentMission: Number.isFinite(saved.currentMission) ? saved.currentMission : 0
        };
      }
    } catch (_) {
      // Ignore invalid localStorage data and start fresh.
    }
    return { completed: [], score: 0, currentMission: 0 };
  }

  function saveState() {
    state.currentMission = selectedMission;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function render() {
    selectedMission = normalizeMissionIndex(selectedMission);
    const mission = missions[selectedMission];
    selectedResistorIndex = 0;
    hintOpen = false;
    renderChapterToc();
    renderHud();
    renderMissionList();
    renderMission(mission);
    renderCircuit(mission);
    renderResistors(mission);
    updateMeter(mission);
    setFeedback("", "");
    setTerminal(initialTerminal(mission), "ready");
    elements.nextButton.disabled = !isPublishedMission(missions[selectedMission + 1]);
    saveState();
  }

  function renderHud() {
    const published = publishedMissions();
    const completedCount = published.filter((mission) => state.completed.includes(mission.id)).length;
    const energy = Math.round((completedCount / published.length) * 100);
    elements.energyValue.textContent = `${energy}%`;
    elements.energyBar.style.width = `${energy}%`;
    elements.scoreValue.textContent = String(state.score);
    elements.completeCount.textContent = `${completedCount} / ${published.length}`;
  }

  function renderChapterToc() {
    elements.chapterToc.innerHTML = "";

    chapterAbstracts.forEach((chapter, index) => {
      const number = index + 1;
      const chapterMissions = missions.filter((mission) => mission.chapter === chapter.chapter);
      const isChapter4Cleared = missions.filter((m) => chapterNumber(m.chapter) === 4).every((m) => state.completed.includes(m.id));
      const published = (number <= PUBLISHED_CHAPTER_COUNT) && (number < 5 || isChapter4Cleared);
      const completed = chapterMissions.filter((mission) => state.completed.includes(mission.id)).length;
      const firstMissionIndex = missions.findIndex((mission) => mission.chapter === chapter.chapter);
      const item = document.createElement("article");
      item.className = `toc-card${published ? "" : " is-locked"}`;
      item.innerHTML = [
        `<div class="toc-card-head">`,
        `<span class="chapter-badge">${escapeHtml(chapter.chapter)}</span>`,
        `<span class="publish-badge">${published ? "公開中" : "準備中"}</span>`,
        `</div>`,
        `<h3>${escapeHtml(chapter.title)}</h3>`,
        `<p>${escapeHtml(chapter.abstract)}</p>`,
        `<div class="toc-meta">${completed} / ${chapterMissions.length} ミッション完了</div>`
      ].join("");

      const button = document.createElement("button");
      button.type = "button";
      button.className = published ? "secondary-button" : "secondary-button";
      button.textContent = published ? "この章を始める" : "段階公開待ち";
      button.disabled = !published;
      button.addEventListener("click", () => {
        selectedMission = normalizeMissionIndex(firstMissionIndex);
        render();
        document.querySelector(".workbench").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      item.appendChild(button);
      elements.chapterToc.appendChild(item);
    });
  }

  function renderMissionList() {
    elements.missionList.innerHTML = "";
    let lastChapter = "";

    missions.forEach((mission, index) => {
      if (mission.chapter !== lastChapter) {
        const divider = document.createElement("li");
        divider.className = "chapter-divider";
        divider.textContent = mission.chapter;
        elements.missionList.appendChild(divider);
        lastChapter = mission.chapter;
      }

      const item = document.createElement("li");
      const button = document.createElement("button");
      const isPublished = isPublishedMission(mission);
      const isUnlocked = isPublished && (
        index === 0 ||
        state.completed.includes(missions[index - 1].id) ||
        state.completed.includes(mission.id)
      );
      button.type = "button";
      button.className = [
        "mission-card",
        index === selectedMission ? "active" : "",
        state.completed.includes(mission.id) ? "completed" : "",
        isPublished ? "" : "unpublished"
      ].filter(Boolean).join(" ");
      button.disabled = !isUnlocked;
      button.innerHTML =
        `<strong>${pad(index + 1)} ${escapeHtml(mission.title)}</strong>` +
        `<span>${escapeHtml(mission.session)} / ${escapeHtml(mission.tags.join("・"))}${isPublished ? "" : " / 準備中"}</span>`;
      button.addEventListener("click", () => {
        selectedMission = index;
        render();
      });
      item.appendChild(button);
      elements.missionList.appendChild(item);
    });
  }

  function renderMission(mission) {
    elements.missionSession.textContent = `${mission.chapter} / ${mission.session}`;
    elements.missionTitle.textContent = mission.title;
    elements.missionBrief.textContent = mission.brief;
    elements.missionTags.innerHTML = mission.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    elements.formulaStrip.innerHTML =
      mission.formulas.map((formula) => `<span class="formula-pill">${escapeHtml(formula)}</span>`).join("") +
      `<ul class="lesson-points">${mission.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`;
    elements.blankCount.textContent = `${mission.blanks.length} blanks`;
    renderCode(mission);
  }

  function renderCode(mission) {
    elements.codeBlock.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const pattern = /{{(.*?)}}/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(mission.code)) !== null) {
      fragment.append(document.createTextNode(mission.code.slice(lastIndex, match.index)));
      fragment.append(createBlankSelect(mission, match[1]));
      lastIndex = pattern.lastIndex;
    }

    fragment.append(document.createTextNode(mission.code.slice(lastIndex)));
    elements.codeBlock.append(fragment);
  }

  function createBlankSelect(mission, blankId) {
    const blank = mission.blanks.find((item) => item.id === blankId);
    const select = document.createElement("select");
    select.className = "blank-select";
    select.dataset.blankId = blankId;
    select.setAttribute("aria-label", blank ? blank.label : blankId);

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "???";
    select.appendChild(empty);

    if (blank) {
      blank.options.forEach((optionText) => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      });
    }

    select.addEventListener("change", () => {
      select.classList.remove("is-wrong", "is-correct");
      if (select.value) setFeedback("", "");
    });
    return select;
  }

  function renderCircuit(mission) {
    const isDone = state.completed.includes(mission.id);
    const flowClass = isDone ? "active" : "";
    const resistance = mission.circuit.resistors[selectedResistorIndex];
    const dropText = mission.circuit.drop ? `drop ${mission.circuit.drop.toFixed(1)}V` : "";
    elements.circuitArt.innerHTML = `
      <svg class="circuit-svg" viewBox="0 0 420 230" role="img" aria-labelledby="circuitTitle">
        <title id="circuitTitle">${escapeHtml(mission.title)} の実験回路</title>
        <path class="wire-shadow" d="M82 112 H152 L174 82 L196 142 L218 82 L240 142 L262 112 H336 V178 H82 Z"></path>
        <path class="wire" d="M82 112 H152 L174 82 L196 142 L218 82 L240 142 L262 112 H336 V178 H82 Z"></path>
        <rect class="component-fill" x="55" y="80" width="54" height="74" rx="6"></rect>
        <line x1="73" y1="97" x2="73" y2="137" stroke="#123f35" stroke-width="4"></line>
        <line x1="92" y1="106" x2="92" y2="128" stroke="#123f35" stroke-width="4"></line>
        <rect class="component-dark" x="288" y="88" width="72" height="48" rx="6"></rect>
        <text x="324" y="118" text-anchor="middle" fill="#f7ead1" font-family="Consolas, 'Segoe UI Symbol', monospace" font-size="18">R</text>
        <text x="82" y="48" text-anchor="middle" fill="#f7ead1" font-family="Consolas, 'Segoe UI Symbol', monospace" font-size="18">${mission.circuit.voltage.toFixed(1)}V</text>
        <text x="220" y="210" text-anchor="middle" fill="#f7ead1" font-family="Consolas, 'Segoe UI Symbol', monospace" font-size="13">${escapeHtml(dropText)}</text>
        <text x="324" y="64" text-anchor="middle" fill="#f7ead1" font-family="Consolas, 'Segoe UI Symbol', monospace" font-size="16">${resistance} Ω</text>
        <g transform="translate(210 112)">
          <circle class="spark ${flowClass}" r="5"></circle>
          <circle class="spark s2 ${flowClass}" r="5"></circle>
          <circle class="spark s3 ${flowClass}" r="5"></circle>
        </g>
      </svg>
    `;
  }

  function renderResistors(mission) {
    elements.resistorButtons.innerHTML = "";
    mission.circuit.resistors.forEach((resistance, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `resistor-button${index === selectedResistorIndex ? " active" : ""}`;
      button.textContent = `${resistance} Ω`;
      button.addEventListener("click", () => {
        selectedResistorIndex = index;
        renderResistors(mission);
        updateMeter(mission);
        renderCircuit(mission);
      });
      elements.resistorButtons.appendChild(button);
    });
  }

  function updateMeter(mission) {
    const voltage = mission.circuit.voltage;
    const drop = mission.circuit.drop || 0;
    const resistance = mission.circuit.resistors[selectedResistorIndex];
    const current = Math.max(voltage - drop, 0) / resistance;
    const judge = current > mission.circuit.limit ? "LIMIT" : "SAFE";

    elements.meterVoltage.textContent = `${voltage.toFixed(1)} V`;
    elements.meterResistance.textContent = `${resistance} Ω`;
    elements.meterCurrent.textContent = `${current.toFixed(3)} A`;
    elements.meterJudge.textContent = judge;
    elements.meterJudge.style.color = judge === "LIMIT" ? "var(--warn)" : "var(--ok)";
    elements.circuitState.textContent = state.completed.includes(mission.id) ? (judge === "LIMIT" ? "hot" : "flow") : "standby";
    elements.circuitState.className = `state-pill ${state.completed.includes(mission.id) ? (judge === "LIMIT" ? "hot" : "flow") : ""}`;
  }

  function checkMission() {
    const mission = missions[selectedMission];
    const selects = [...elements.codeBlock.querySelectorAll(".blank-select")];
    const wrong = [];
    const missing = [];

    selects.forEach((select) => {
      const blank = mission.blanks.find((item) => item.id === select.dataset.blankId);
      select.classList.remove("is-wrong", "is-correct");
      if (!select.value) {
        missing.push(blank.label);
        return;
      }
      if (select.value === blank.answer) {
        select.classList.add("is-correct");
      } else {
        select.classList.add("is-wrong");
        wrong.push(blank.label);
      }
    });

    if (missing.length || wrong.length) {
      const lines = [];
      if (missing.length) lines.push(`未接続: ${missing.join("、")}`);
      if (wrong.length) lines.push(`再確認: ${wrong.join("、")}`);
      setFeedback(lines.join(" / "), "warn");
      setTerminal(initialTerminal(mission), "compile stopped");
      return;
    }

    const alreadyDone = state.completed.includes(mission.id);
    if (!alreadyDone) {
      state.completed.push(mission.id);
      state.score += 100 + mission.blanks.length * 10 + (hintOpen ? 0 : 25);
    }

    setFeedback("復旧成功。コードと回路の読みがそろっています。", "ok");
    setTerminal(mission.terminal, "passed");
    renderCircuit(mission);
    updateMeter(mission);
    renderHud();
    renderMissionList();
    saveState();
  }

  function showHint() {
    const mission = missions[selectedMission];
    hintOpen = true;
    setFeedback(mission.hint, "warn");
  }

  function goNext() {
    if (isPublishedMission(missions[selectedMission + 1])) {
      const current = missions[selectedMission];
      const canMove = state.completed.includes(current.id) || state.completed.includes(missions[selectedMission + 1].id);
      if (!canMove) {
        setFeedback("このミッションを完了すると次へ進めます。", "warn");
        return;
      }
      selectedMission += 1;
      render();
    } else {
      setFeedback("次の章はまだ準備中です。公開すると進めるようになります。", "warn");
    }
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    state.completed = [];
    state.score = 0;
    state.currentMission = 0;
    selectedMission = 0;
    render();
  }

  function setFeedback(message, kind) {
    elements.feedback.textContent = message || " ";
    elements.feedback.className = `feedback ${kind || ""}`.trim();
  }

  function setTerminal(message, status) {
    elements.terminal.textContent = message;
    elements.terminalStatus.textContent = status;
  }

  function initialTerminal(mission) {
    const voltage = mission.circuit.voltage;
    const drop = mission.circuit.drop || 0;
    const resistance = mission.circuit.resistors[0];
    const current = Math.max(voltage - drop, 0) / resistance;
    const judge = current > mission.circuit.limit ? "LIMIT" : "SAFE";
    return [
      "$ ./chapter-mission",
      `V=${voltage.toFixed(1)}V R=${resistance} Ω -> I=${current.toFixed(3)}A ${judge}`,
      "status: source blanks unresolved"
    ].join("\n");
  }

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
