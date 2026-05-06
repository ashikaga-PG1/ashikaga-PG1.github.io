:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1
![](assets/img/session14/slide01.png)

# 第14回：電気回路とプログラミング4（演習課題4）：解説

## 課題
ファイル data.txt から (V, R) を読み込み、I=V/R を計算して表示します。この回は fopen / fscanf / fclose がポイントです。

> この回の主題は **I/O の基本手順（開く→読む/書く→閉じる）** です。  
> `Stats` や関数分割は、処理を見やすく整理するための補助として使います。

## 仕様（提出物）
- data.txt を読み取りで開く
- result.txt を書き込みで開く
- while(fscanf(... )==2) で V と R を1行ずつ読み取り、I=V/R を計算する
- R<=0 の行は "skip (R error)" を表示してスキップする
- 有効な行は result.txt に出力し、最後に平均 avg を表示する

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 未完成コード（課題）

```c
#include <stdio.h>

typedef struct {
  double sumI;
  int valid;
} Stats;

// TODO1-1: 入力ファイルを開く
FILE *openInputFile(const char *name){
  FILE *fin = ???(name, "r");
  return fin;
}

// TODO1-2: 出力ファイルを開く
FILE *openOutputFile(const char *name){
  FILE *fout = ???(name, "w");
  return fout;
}

// 読み込み → 処理 → 書き込み
Stats processAndWrite(FILE *fin, FILE *fout){
  Stats st = {0.0, 0};
  double V, R;

// TODO2-1: 値をファイルから読み込み
  while(???(fin, "%lf %lf", &V, &R) == 2){
    if(R <= 0){
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
void printSummary(Stats st){
  if(st.valid > 0) printf("avg=%.3f\n", st.sumI / st.valid);
  else      printf("avg=NA\n");
}

int main(void){
  const char *inName = "data.txt";
  const char *outName = "result.txt";

  FILE *fin = openInputFile(inName);
  if(fin == NULL){
    printf("open error: %s\n", inName);
    return 0;
  }

  FILE *fout = openOutputFile(outName);
  if(fout == NULL){
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

---

:::set layout=2col side=right w=40 gap=16 fit=contain opacity=1

## 解答（完成コード）

```c
#include <stdio.h>

typedef struct {
  double sumI;
  int valid;
} Stats;

// TODO1-1: 入力ファイルを開く
FILE *openInputFile(const char *name){
  FILE *fin = fopen(name, "r");
  return fin;
}

// TODO1-2: 出力ファイルを開く
FILE *openOutputFile(const char *name){
  FILE *fout = fopen(name, "w");
  return fout;
}

// 読み込み → 処理 → 書き込み
Stats processAndWrite(FILE *fin, FILE *fout){
  Stats st = {0.0, 0};
  double V, R;

// TODO2-1: 値をファイルから読み込み
  while(fscanf(fin, "%lf %lf", &V, &R) == 2){
    if(R <= 0){
      printf("skip (R error)\n");
      continue;
    }
    double I = V / R;
    fprintf(fout, "%.3f\n", I);      // TODO2-2: 値をファイルに出力（書き込み）
    printf("I=%.3f (write)\n", I);
    st.sumI += I;
    st.valid++;
  }
  return st;
}

// 結果（電流の平均値）を画面に出力する
void printSummary(Stats st){
  if(st.valid > 0) printf("avg=%.3f\n", st.sumI / st.valid);
  else          printf("avg=NA\n");
}

int main(void){
  const char *inName = "data.txt";
  const char *outName = "result.txt";

  FILE *fin = openInputFile(inName);
  if(fin == NULL){
    printf("open error: %s\n", inName);
    return 0;
  }

  FILE *fout = openOutputFile(outName);
  if(fout == NULL){
    printf("open error: %s\n", outName);
    fclose(fin);
    return 0;
  }

  Stats st = processAndWrite(fin, fout);

  fclose(fin);       //TODO3-1: ファイルを閉じる
  fclose(fout);      //TODO3-2: ファイルを閉じる

  // TODO4: まとめ（電流の平均値）を出力する関数を呼び出す
  printSummary(st);

  return 0;
}
```
