const passwords = {
    1: 'aB7xR9m2',
    2: 'kP4tW5nQ',
    3: 'vE2sY8zG',
    4: 'hJ9cM6dL'
};

const points = {
    1: ["オームの法則（V = I * R）の適用","forループによる10段階のシミュレーション","if文による許容電流 Imax の判定","printfによる書式付き一覧表示"],
    2: ["抵抗値を配列 int R[5] = {5, 10, 15, 20, 25} で定義","計算結果を格納する配列 double I[5] の利用","ループ内での配列要素へのアクセス（R[k], I[k]）","集計変数 okCount による処理結果の管理"],
    3: ["関数の定義と呼び出し（計算・チェック・統計）","ポインタによる複数の返り値の受け取り（*outI）","不適切な入力（R<=0）に対するエラー処理","配列サイズを sizeof で自動取得"],
    4: ["構造体 Stats による統計情報のカプセル化","ファイルポインタ FILE* と fopen/fclose の利用","fscanf によるファイルからの連続読み込み","fprintf による別ファイルへの結果出力"]
};

const code = {
    1: `#include <stdio.h>\n\nint main(void){\n  const double V = 5.0;      // 電圧[V]\n  const double Imax = 0.60;  // 許容電流[A]\n\n  int okCount = 0;           // OKの件数\n\n  printf("V=%.1fV  Imax=%.2fA\\n", V, Imax);\n  printf("-------------------------\\n");\n  printf("R(ohm)   I(A)    judge\\n");\n  printf("-------------------------\\n");\n\n  for(int k = 1; k <= 10; k++){\n    int R = 5 * k;              // 5,10,15,...,50\n\n    // TODO1: オームの法則で電流Iを計算\n    double I = V / R;\n\n    // TODO2: 判定して表示（WARN/OK）\n    if( I > Imax ){\n      printf("%5d  %6.3f   WARN\\n", R, I);\n    }else{\n      printf("%5d  %6.3f   OK\\n", R, I);\n      okCount++;\n    }\n  }\n\n  printf("-------------------------\\n");\n  printf("OK=%d / 10\\n", okCount);\n\n  return 0;\n}`,
    2: `#include <stdio.h>\n\nint main(void){\n  const double V = 5.0;      // 電圧[V]\n  const double Imax = 0.60;  // 許容電流[A]\n\n  // TODO1: 配列の定義をする\n  int R[5] = {5, 10, 15, 20, 25};   // 抵抗[Ω]\n  double I[5];                      // 電流[A]（計算結果）\n  int okCount = 0;\n\n  // TODO2: 配列Iに電流を計算して格納\n  for(int k = 0; k < 5; k++){\n    I[k] = V / R[k];\n  }\n\n  // TODO3: 一覧表示＋OK件数の集計（ifで判定）\n  printf("V=%.1fV  Imax=%.2fA\\n", V, Imax);\n  printf("-------------------------\\n");\n  printf("k  R(ohm)   I(A)    judge\\n");\n  printf("-------------------------\\n");\n\n  for(int k = 0; k < 5; k++){\n    if(I[k] > Imax){\n      printf("%d %5d  %6.3f   WARN\\n", k, R[k], I[k]);\n    }else{\n      printf("%d %5d  %6.3f   OK\\n", k, R[k], I[k]);\n      okCount = okCount + 1;\n    }\n  }\n\n  printf("-------------------------\\n");\n  printf("OK=%d / 5\\n", okCount);\n\n  return 0;\n}`,
    3: `#include <stdio.h>\n\n// 計算専用\ndouble calcI(double V, double R){\n  return V / R;\n}\n\n// 入力チェック込み（成功:1 / 失敗:0）\nint calcI_checked(double V, double R, double *outI){\n  if(R <= 0) return 0;\n  *outI = calcI(V, R);\n  return 1;\n}\n\n// TODO1-1: 新しいmaxを返す\ndouble maxValue(double a, double b){\n  if(a > b) return a;\n  return b;\n}\n\n// TODO1-2: 新しいminを返す\ndouble minValue(double a, double b){\n  if(a < b) return a;\n  return b;\n}\n\nint main(void){\n  double V_list[] = {5.0, 5.0, 5.0, 12.0, 9.0};\n  double R_list[] = {5.0, 10.0, 0.0, 6.0, 3.0};\n  int N = (int)(sizeof(V_list) / sizeof(V_list[0]));\n\n  double sumI = 0.0;\n  int validCount = 0;\n  double maxI = 0.0;\n  double minI = 0.0;\n\n  for(int k = 0; k < N; k++){\n    double V = V_list[k];\n    double R = R_list[k];\n    double I;\n\n    printf("case %d: V=%.1f R=%.1f -> ", k + 1, V, R);\n\n    if(!calcI_checked(V, R, &I)){\n      printf("R error\\n");\n      continue;\n    }\n\n    printf("I=%.3f\\n", I);\n\n    sumI += I;\n    if(validCount == 0){\n      maxI = I;\n      minI = I;\n    }else{\n      maxI = maxValue(maxI, I);\n      minI = minValue(minI, I);\n    }\n    validCount++;\n  }\n\n  if(validCount > 0){\n    printf("avg=%.3f\\n", sumI / validCount);\n    printf("max=%.3f\\n", maxI);\n    printf("min=%.3f\\n", minI);\n  }else{\n    printf("avg=NA\\n");\n    printf("max=NA\\n");\n    printf("min=NA\\n");\n  }\n\n  return 0;\n}`,
    4: `#include <stdio.h>\n\ntypedef struct {\n  double sumI;\n  int valid;\n} Stats;\n\n// TODO1-1: 入力ファイルを開く\nFILE *openInputFile(const char *name){\n  FILE *fin = fopen(name, "r");\n  return fin;\n}\n\n// TODO1-2: 出力ファイルを開く\nFILE *openOutputFile(const char *name){\n  FILE *fout = fopen(name, "w");\n  return fout;\n}\n\n// 読み込み → 処理 → 書き込み\nStats processAndWrite(FILE *fin, FILE *fout){\n  Stats st = {0.0, 0};\n  double V, R;\n\n  while(fscanf(fin, "%lf %lf", &V, &R) == 2){\n    if(R <= 0){\n      printf("skip (R error)\\n");\n      continue;\n    }\n    double I = V / R;\n    fprintf(fout, "%.3f\\n", I);\n    printf("I=%.3f (write)\\n", I);\n    st.sumI += I;\n    st.valid++;\n  }\n  return st;\n}\n\nvoid printSummary(Stats st){\n  if(st.valid > 0) printf("avg=%.3f\\n", st.sumI / st.valid);\n  else          printf("avg=NA\\n");\n}\n\nint main(void){\n  const char *inName = "data.txt";\n  const char *outName = "result.txt";\n\n  FILE *fin = openInputFile(inName);\n  if(fin == NULL){\n    printf("open error: %s\\n", inName);\n    return 0;\n  }\n\n  FILE *fout = openOutputFile(outName);\n  if(fout == NULL){\n    printf("open error: %s\\n", outName);\n    fclose(fin);\n    return 0;\n  }\n\n  Stats st = processAndWrite(fin, fout);\n\n  fclose(fin);\n  fclose(fout);\n\n  printSummary(st);\n\n  return 0;\n}`
};

function encrypt(key, text) {
    const k = key.split('').map(c => c.charCodeAt(0));
    // Simulate browser's unescape(encodeURIComponent(text)) behavior accurately in node:
    const utf8 = Buffer.from(text, 'utf-8').toString('binary');
    const s = utf8.split('').map(c => c.charCodeAt(0));
    const res = s.map((c, i) => c ^ k[i % k.length]);
    return Buffer.from(res).toString('base64');
}

const encryptedContent = {};
for (let i = 1; i <= 4; i++) {
    encryptedContent[i] = {
        points: encrypt(passwords[i], JSON.stringify(points[i])),
        code: encrypt(passwords[i], code[i])
    };
}

console.log(JSON.stringify(encryptedContent, null, 2));
