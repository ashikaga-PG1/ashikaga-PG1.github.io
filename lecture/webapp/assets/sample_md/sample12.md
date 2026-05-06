# 第12回 サンプル実験

## Sample: scanf（キーボード入力）の最小例

### Code
```c
#include <stdio.h>

int main(void) {
  int x;
  // @bp 入力を受け取る
  printf("x ? ");
  // ここではキーボードから 1 つ整数を入力する
  if (scanf("%d", &x) != 1) {
    printf("input error\n");
    return 0;
  }
  // @bp 結果を表示
  printf("x=%d\n", x);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "入力を受け取る",
    "vars": {
      "x": 7
    },
    "stdout": "x ? 7\n"
  },
  {
    "at": "結果を表示",
    "vars": {
      "x": 7
    },
    "stdout": "x ? 7\nx=7\n"
  }
]
```

## Sample: scanfで2値入力→計算（V, R → I）

### Code
```c
#include <stdio.h>

int main(void) {
  double v, r;
  // @bp 入力を受け取る
  printf("V R ? ");
  if (scanf("%lf %lf", &v, &r) != 2) {
    printf("input error\n");
    return 0;
  }
  if (r <= 0) {
    printf("R error\n");
    return 0;
  }
  // @bp 電流を表示
  printf("I=%.3f\n", v / r);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "入力を受け取る",
    "vars": {
      "v": 10.0,
      "r": 5.0
    },
    "stdout": "V R ? 10 5\n"
  },
  {
    "at": "電流を表示",
    "vars": {
      "v": 10.0,
      "r": 5.0,
      "I": 2.0
    },
    "stdout": "V R ? 10 5\nI=2.000\n"
  }
]
```

## Sample: ファイル入力（fscanf）：正しい書き方 → 擬似データで実行

### Code
```c
#include <stdio.h>

int main(void) {
  // VS Code で実行するときは、実際にファイルから読み込みます
  // このツール上では、下の「擬似データ」部分が有効です
  const char *inName = "data.txt";

  double V[100], R[100];
  int n = 0;

  /* ----------------------------
   * 【本来の実装】ファイルから読み込む（正しい書き方）
   * 1行に V R（空白区切り）
   * 例: 10 5
   * ---------------------------- */
  /*
  FILE *fp = fopen(inName, "r");
  if (fp == NULL) {
    printf("open error: %s\n", inName);
    return 0;
  }

  while (n < 100 && fscanf(fp, "%lf %lf", &V[n], &R[n]) == 2) {
    n++;
  }

  fclose(fp);
  */

  /* ----------------------------
   * 【ツール用】擬似的に配列から読み込む（data.txt相当）
   * ※ data.txt の先頭数行と同じデータ
   * ---------------------------- */
  {
    double v_dummy[] = {10, 12, 8, 15};
    double r_dummy[] = {5, 0, 4, 7};
    int dummy_n = (int)(sizeof(v_dummy) / sizeof(v_dummy[0]));

    for (int i = 0; i < dummy_n && i < 100; i++) {
      V[i] = v_dummy[i];
      R[i] = r_dummy[i];
    }
    n = dummy_n;
  }

  // --- ここから共通処理（読み込んだデータを使う）---
  double sumI = 0.0;
  int valid = 0;

  for (int i = 0; i < n; i++) {
    if (R[i] <= 0) {
      // @bp 各行を処理
      printf("R error\n");
      continue;
    }
    double I = V[i] / R[i];
    // @bp 各行を処理
    printf("I=%.3f\n", I);
    sumI += I;
    valid++;
  }

  // @bp 平均を表示
  if (valid > 0) {
    printf("avg=%.3f\n", sumI / valid);
  } else {
    printf("avg=NA\n");
  }

  return 0;
}
```

### Watch
- i
- n
- V[n]

### Trace (exported reference)
```json
[
  {
    "at": "各行を処理",
    "vars": {
      "i": 0,
      "n": 4
    },
    "stdout": "I=2.000\n"
  },
  {
    "at": "各行を処理",
    "vars": {
      "i": 1,
      "n": 4
    },
    "stdout": "I=2.000\nR error\n"
  },
  {
    "at": "各行を処理",
    "vars": {
      "i": 2,
      "n": 4
    },
    "stdout": "I=2.000\nR error\nI=2.000\n"
  },
  {
    "at": "各行を処理",
    "vars": {
      "i": 3,
      "n": 4
    },
    "stdout": "I=2.000\nR error\nI=2.000\nI=2.143\n"
  },
  {
    "at": "平均を表示",
    "vars": {
      "sumI": 6.142857,
      "valid": 3
    },
    "stdout": "I=2.000\nR error\nI=2.000\nI=2.143\navg=2.048\n"
  }
]
```

## Sample: ファイル出力（fprintf）：正しい書き方 → 画面に擬似出力

### Code
```c
#include <stdio.h>

int main(void) {
  const char *outName = "output12.txt";

  /* ----------------------------
   * 【本来の実装】ファイルへ書き込む（正しい書き方）
   * ---------------------------- */
  /*
  FILE *fp = fopen(outName, "w");
  if (fp == NULL) {
    printf("open error: %s\n", outName);
    return 0;
  }

  // 例：I の計算結果を保存する
  fprintf(fp, "I=%.3f\n", 2.000);
  fprintf(fp, "I=%.3f\n", 2.143);

  fclose(fp);
  printf("%s に保存しました\n", outName);
  return 0;
  */

  /* ----------------------------
   * 【ツール用】擬似的に「保存する内容」を画面に表示
   * ---------------------------- */
  // @bp 保存先を表示
  printf("[write] %s\n", outName);
  // @bp 1件目を書き出し
  printf("I=2.000\n");
  // @bp 2件目を書き出し
  printf("I=2.143\n");
  // @bp 完了を表示
  printf("(done)\n");
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "保存先を表示",
    "vars": {
      "outName": "output12.txt"
    },
    "stdout": "[write] output12.txt\n"
  },
  {
    "at": "1件目を書き出し",
    "vars": {
      "outName": "output12.txt"
    },
    "stdout": "[write] output12.txt\nI=2.000\n"
  },
  {
    "at": "2件目を書き出し",
    "vars": {
      "outName": "output12.txt"
    },
    "stdout": "[write] output12.txt\nI=2.000\nI=2.143\n"
  },
  {
    "at": "完了を表示",
    "vars": {},
    "stdout": "[write] output12.txt\nI=2.000\nI=2.143\n(done)\n"
  }
]
```

## Sample: 構造体 `Stats` の最小確認

### Code
```c
#include <stdio.h>

typedef struct {
  double sumI;
  int valid;
} Stats;

int main(void) {
  Stats st = {0.0, 0};

  // @bp 値を更新
  st.sumI += 1.2;
  st.valid++;

  // @bp 結果を表示
  printf("sumI=%.1f valid=%d\n", st.sumI, st.valid);
  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "初期値を用意",
    "vars": {
      "sumI": 0.0,
      "valid": 0
    },
    "stdout": ""
  },
  {
    "at": "結果を表示",
    "vars": {
      "sumI": 1.2,
      "valid": 1
    },
    "stdout": "sumI=1.2 valid=1\n"
  }
]
```
