# 第14回 サンプル実験

## Sample: ファイルを開く→値を表示→閉じる（最小）

### Code
```c
#include <stdio.h>

int main(void) {
  const char *inName = "data.txt";
  // @bp ファイルを開く
  FILE *fin = fopen(inName, "r");
  if (fin == NULL) {
    printf("open error: %s\n", inName);
    return 0;
  }

  double V, R;

  while (fscanf(fin, "%lf %lf", &V, &R) == 2) {
    // @bp 1行を表示
    printf("V=%.1f R=%.1f\n", V, R);
  }

  fclose(fin);
  // @bp 完了を表示
  printf("done\n");

  return 0;
}
```

### Trace (exported reference)
```json
[
  {
    "at": "ファイルを開く",
    "vars": {
      "inName": "data.txt"
    },
    "stdout": ""
  },
  {
    "at": "1行を表示",
    "vars": {
      "V": 10.0,
      "R": 5.0
    },
    "stdout": "V=10.0 R=5.0\n"
  },
  {
    "at": "1行を表示",
    "vars": {
      "V": 10.0,
      "R": 5.0
    },
    "stdout": "V=10.0 R=5.0\n"
  },
  {
    "at": "1行を表示",
    "vars": {
      "V": 12.0,
      "R": 0.0
    },
    "stdout": "V=10.0 R=5.0\nV=12.0 R=0.0\n"
  },
  {
    "at": "1行を表示",
    "vars": {
      "V": 8.0,
      "R": 4.0
    },
    "stdout": "V=10.0 R=5.0\nV=12.0 R=0.0\nV=8.0 R=4.0\n"
  },
  {
    "at": "完了を表示",
    "vars": {},
    "stdout": "V=10.0 R=5.0\nV=12.0 R=0.0\nV=8.0 R=4.0\ndone\n"
  }
]
```
