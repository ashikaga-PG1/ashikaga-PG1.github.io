# 第13回 サンプル実験

## Sample: 未完成コード（課題）

### Code
```c
#include <stdio.h>

typedef struct {
  double sumI;
  int valid;
} Stats;

// TODO1-1: 入力ファイルを開く
FILE *openInputFile(const char *name) {
  FILE *fin = ???(name, "r");
  return fin;
}

// TODO1-2: 出力ファイルを開く
FILE *openOutputFile(const char *name) {
  FILE *fout = ???(name, "w");
  return fout;
}

// 読み込み → 処理 → 書き込み
Stats processAndWrite(FILE *fin, FILE *fout) {
  Stats st = {0.0, 0};
  double V, R;

  // TODO2-1: 値をファイルから読み込み
  while (???(fin, "%lf %lf", &V, &R) == 2) {
    if (R <= 0) {
      printf("skip (R error)\n");
      continue;
    }
    double I = V / R;
    ???(fout, "%.3f\n", I);      // TODO2-2: 値をファイルに出力（書き込み）
    printf("I=%.3f (write)\n", I);
    st.sumI += I;
    st.valid++;
  }
  return st;
}

// 結果（電流の平均値）を画面に出力する
void printSummary(Stats st) {
  if (st.valid > 0) {
    printf("avg=%.3f\n", st.sumI / st.valid);
  } else {
    printf("avg=NA\n");
  }
}

int main(void) {
  const char *inName = "data.txt";
  const char *outName = "result.txt";

  FILE *fin = openInputFile(inName);
  if (fin == NULL) {
    printf("open error: %s\n", inName);
    return 0;
  }

  FILE *fout = openOutputFile(outName);
  if (fout == NULL) {
    printf("open error: %s\n", outName);
    fclose(fin);
    return 0;
  }

  Stats st = processAndWrite(fin, fout);

  ???(fin);       //TODO3-1: ファイルを閉じる
  ???(fout);      //TODO3-2: ファイルを閉じる

  // TODO4: まとめ（電流の平均値）を出力する関数を呼び出す
  ???(st);
  return 0;
}
```
