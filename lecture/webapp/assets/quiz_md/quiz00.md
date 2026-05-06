# Quiz 0
## Q1
Windows の環境構築で最初に行う操作として正しいのは？

- A: Prog1_Installer.exe を実行する
- B: main.c をダブルクリックして導入する
- C: ブラウザだけで完結する
- D: スマホで実行する

**Answer:** A
**Explain:** Windows 向け手順では、配布された `Prog1_Installer.exe` を実行する流れになっています。

## Q2
Prog1_Installer.exe の動作として正しいのは？

- A: C:\Prog1\Prog1_Package を準備し、setup\install.ps1 を自動実行する
- B: main.c をダブルクリックして導入する
- C: VS Code だけ入れればOK
- D: MSYS2 は不要

**Answer:** A
**Explain:** インストーラーは `C:\Prog1\Prog1_Package` を準備したあと、`setup\install.ps1` を自動実行します。

## Q3
セットアップ完了後に自動で開くものは？

- A: Lecture&CEmu_NoAnswers\index.html
- B: C:\Windows\System32
- C: MSYS2 の設定画面
- D: main.c

**Answer:** A
**Explain:** セットアップ完了後は、`Lecture&CEmu_NoAnswers\index.html` が既定ブラウザで開く想定です。

## Q4
動作確認でビルドを行うショートカットキーは？

- A: Ctrl + Shift + B
- B: Ctrl + B
- C: F5
- D: Ctrl + Shift + P

**Answer:** A
**Explain:** 動作確認の手順で『ビルド：Ctrl + Shift + B』とあります。

## Q5
VS Code が日本語にならない場合に確認するファイルとして挙げられているのは？

- A: %APPDATA%\Code\User\locale.json
- B: C:\msys64\locale.json
- C: ~/.vscode/locale.json
- D: C:\Windows\locale.json

**Answer:** A
**Explain:** トラブルシュートに locale.json の場所と中身（{\"locale\":\"ja\"}）が示されています。
