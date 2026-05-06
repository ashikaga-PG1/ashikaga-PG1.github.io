# 第0回：VSCode + C言語（gcc）環境構築

対象：Windows / macOS  
（更新日：2026-04-20）

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## この手順で入るもの
- Visual Studio Code（VSCode）
- VSCode 日本語化（Japanese Language Pack）
- C言語用拡張（C/C++）
- C言語の開発環境
- gcc / make などのビルドツール

> **ポイント：** Windows は `Prog1_Installer.exe`、macOS は `setup/install_mac.sh` を使ってセットアップします（インターネット接続が必要）

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## 準備（最初に1回だけ）
1. **Windows** の人は、配布された `Prog1_Installer.exe` を保存します
2. **macOS** の人は、配布された `Prog1_Package` を展開します
3. **Windows の人はこのあと「Windows 向け手順」へ、macOS の人は「macOS 向け手順」へ進んでください**

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## Windows 向け手順

対象：Windows 10 / 11

### 1. インストーラーを実行
1. 配布された `Prog1_Installer.exe` をダブルクリックします
2. Windows の確認画面が出た場合は、`実行` または `はい` を選びます

![01 フォルダ配置](assets/img/session00/01_folder_layout.png)

### 2. 自動セットアップを待つ
1. インストーラーは `C:\Prog1\Prog1_Package` を自動で準備します
2. 続けて `setup\install.ps1` を自動実行し、VSCode・gcc・拡張機能を導入します
3. `winget` / `MSYS2` の処理で時間がかかることがあります

![03 install実行](assets/img/session00/03_install_start.png)
![03 install完了](assets/img/session00/03_install_done.png)

### 3. 教材が自動で開くことを確認
- セットアップが完了すると、`C:\Prog1\Prog1_Package\Lecture&CEmu_NoAnswers\index.html` が既定ブラウザで開きます
- VSCode を使う前に、一度閉じて再起動すると日本語化が反映されやすくなります

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

### 4. VSCodeでSession00を開く

1. VSCodeを起動します
2. `フォルダーを開く` から `C:\Prog1\Prog1_Package\Programming1\Session00` を選択します

![04 Session00を開く](assets/img/session00/04_open_session00_1.png)
![04 Session00を開く](assets/img/session00/04_open_session00_2.png)
![04 Session00を開く](assets/img/session00/04_open_session00_3.png)

### 5. main.c をビルド
1. `main.c` を開きます
2. `Ctrl + Shift + B` でビルドします
3. ターミナルにエラーが出ないことを確認します

![05 ビルド成功](assets/img/session00/05_build_success.png)


### 6. [▶︎]でデバッグ実行
1. `[▶︎]` を押して実行します
2. プログラム出力が表示されることを確認します

![06 デバッグ実行成功](assets/img/session00/06_debug_success_1.png)
![06 デバッグ実行成功](assets/img/session00/06_debug_success_2.png)

### 7. Windows向けチェック項目
- [ ] `Prog1_Installer.exe` が最後まで完了した
- [ ] `Lecture&CEmu_NoAnswers` がブラウザで開いた
- [ ] VSCodeが日本語表示になった
- [ ] `Session00/main.c` がビルドできた
- [ ] `F5` で実行できた

### 8. 日本語化
- VSCodeが日本語にならない場合は、以下の操作を試してください

1. `Ctrl + Shift + P` を押して、`Configure Display Language` で `ja` を選択してください
2. 再起動して、メニューなどの表示が日本語になればOKです

![08 日本語化](assets/img/session00/99_chg_lang_1.png)
![08 日本語化](assets/img/session00/99_chg_lang_2.png)
![08 日本語化](assets/img/session00/99_chg_lang_3.png)


---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## macOS 向け手順

対象：macOS（Apple Silicon / Intel）

PowerShell の代わりに、ターミナルで `setup/install_mac.sh` を実行します。

```bash
cd ~/Downloads/Prog1_Package
chmod +x ./setup/install_mac.sh
./setup/install_mac.sh
```

### macOS版で導入されるもの
- Xcode Command Line Tools
- Homebrew
- gcc / make
- Visual Studio Code
- Japanese Language Pack
- C/C++ 拡張（ms-vscode.cpptools）

### 補足
- 初回は Xcode Command Line Tools のインストールダイアログが表示されます
- Homebrew の導入や `brew update` で数分かかることがあります
- 完了後はターミナルを開き直すと PATH が確実に反映されます

### macOS向けチェック項目
- [ ] `setup/install_mac.sh` が最後まで完走した
- [ ] `gcc --version` が表示された
- [ ] VSCode が起動できた
- [ ] `code --version` が表示された（または VSCode のコマンドパレットから `Shell Command: Install 'code' command in PATH` を実行した）
- [ ] `Programming1/Session00/main.c` がビルドできた

---

:::set layout=1col side=right w=40 gap=16 fit=contain opacity=1

## よくあるトラブル

### 1) winget が見つからない / インストールに失敗する
- Microsoft Store の **App Installer** を更新してください（winget が含まれます）

### 2) VSCode が日本語にならない
- VSCode を一度完全に終了して起動し直してください
- それでも英語のままの場合、次のファイルがあるか確認：
  - `%APPDATA%\Code\User\locale.json`
  - 中身：`{"locale":"ja"}`

### 3) C/C++ 拡張が入らない（code コマンドが見つからない）
- 一度 VSCode を起動してから、もう一度 `Prog1_Installer.exe` を実行してください
- 手動の場合：拡張機能で次を検索してインストール
  - Japanese Language Pack（ID: `MS-CEINTL.vscode-language-pack-ja`）
  - C/C++（ID: `ms-vscode.cpptools`）

### 4) コンパイルできない（gcc が無い）
- MSYS2 の導入が不完全な可能性があります。もう一度 `Prog1_Installer.exe` を実行してください
- 既定の参照先：`C:\msys64\mingw64\bin\gcc.exe`

### 5) macOS で `code --version` が通らない
- VSCode のコマンドパレットを開き、`Shell Command: Install 'code' command in PATH` を実行してください
- その後、ターミナルを開き直してから `code --version` を確認してください

### 6) macOS で gcc / make が使えない
- `setup/install_mac.sh` の実行後にターミナルを開き直してください
- それでも使えない場合は `echo $PATH` で Homebrew のパスが反映されているか確認してください

## 問い合わせの前に（チェック）
- `Prog1_Installer.exe` は最後まで完了しましたか？
- Windows の確認画面が出た場合に `実行` / `はい` を選びましたか？
- インストール完了後に VSCode を再起動しましたか？
- macOS の場合、ターミナルを開き直したあとに `gcc --version` や `code --version` を確認しましたか？
- `Session00（第0回）` を VSCode で開いていますか？（ZIPの中の別フォルダではなく）
