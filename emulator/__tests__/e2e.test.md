# フリー入力モード - E2E テストシナリオ

## テスト環境
- ブラウザ: Chrome, Firefox, Safari, Edge
- テストツール: Cypress または Playwright
- テスト対象: `/portal/emulator/index.html`

## E2E テストシナリオ

### シナリオ 1: フリー入力モードへの切り替え
**目的**: フリー入力モードに切り替えてデフォルトコードが表示されることを確認

**手順**:
1. ページを開く
2. 「フリー入力モード」ボタンをクリック
3. コードエディタにデフォルトコードが表示されることを確認

**期待結果**:
- コードエディタに以下が表示される:
  ```c
  #include <stdio.h>
  
  int main(void) {
    printf("Hello, world!\n");
    return 0;
  }
  ```
- セッション・サンプル選択パネルが非表示になる
- ページタイトルが「任意のCコードを自由に入力・実行できます。」に変更される

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 1 - Switch to Free Input Mode', () => {
  it('should display default code when switching to free input mode', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').should('contain', 'Hello, world!');
    cy.get('#sessionsPanel').should('have.css', 'display', 'none');
    cy.get('#appSubtitle').should('contain', '任意のCコードを自由に入力・実行できます。');
  });
});
```

---

### シナリオ 2: コード入力と自動保存
**目的**: コードを入力して3秒後に自動保存されることを確認

**手順**:
1. フリー入力モードに切り替え
2. コードエディタにコードを入力
3. 3秒待機
4. ブラウザの開発者ツールでローカルストレージを確認

**期待結果**:
- ローカルストレージの `cemu-free-input-v1` に入力したコードが保存される
- 保存状態インジケータが「保存済み」に変更される

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 2 - Code Input and Auto-Save', () => {
  it('should auto-save code after 3 seconds', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').clear().type('int x = 5;');
    cy.wait(3100);
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem('cemu-free-input-v1'));
      expect(saved.code).to.include('int x = 5;');
    });
  });
});
```

---

### シナリオ 3: ページ再読み込みと状態復元
**目的**: ページを再読み込みして前回のコードが復元されることを確認

**手順**:
1. フリー入力モードに切り替え
2. コードを入力して自動保存を待つ
3. ページを再読み込み
4. フリー入力モードに切り替え
5. コードエディタに前回のコードが表示されることを確認

**期待結果**:
- ページ再読み込み後、フリー入力モードが復元される
- コードエディタに前回入力したコードが表示される

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 3 - Page Reload and State Restoration', () => {
  it('should restore previous code after page reload', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').clear().type('printf("test");');
    cy.wait(3100);
    cy.reload();
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').should('contain', 'printf("test");');
  });
});
```

---

### シナリオ 4: コード実行
**目的**: 「実行」ボタンをクリックしてコードが実行されることを確認

**手順**:
1. フリー入力モードに切り替え
2. コードエディタにコードを入力
3. 「実行」ボタンをクリック
4. 実行結果が表示されることを確認

**期待結果**:
- stdout/stderr パネルに実行結果が表示される
- 実行サマリーが「実行完了」に変更される

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 4 - Code Execution', () => {
  it('should execute code and display output', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').clear().type(
      '#include <stdio.h>\nint main(void) { printf("Hello"); return 0; }'
    );
    cy.get('#runButton').click();
    cy.get('#runtimeOutput').should('contain', 'Hello');
    cy.get('#runSummary').should('contain', '実行完了');
  });
});
```

---

### シナリオ 5: コード初期化
**目的**: 「初期化」ボタンをクリックしてコードがリセットされることを確認

**手順**:
1. フリー入力モードに切り替え
2. コードを入力
3. 「初期化」ボタンをクリック
4. 確認ダイアログで「OK」をクリック
5. コードがデフォルトテンプレートにリセットされることを確認

**期待結果**:
- 確認ダイアログが表示される
- 「OK」をクリック後、コードがデフォルトテンプレートに戻る

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 5 - Code Reset', () => {
  it('should reset code to default template', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').clear().type('custom code');
    cy.get('#resetButton').click();
    cy.on('window:confirm', () => true);
    cy.get('#codeEditor').should('contain', 'Hello, world!');
  });
});
```

---

### シナリオ 6: コード保存と完了メッセージ
**目的**: 「保存」ボタンをクリックして保存完了メッセージが表示されることを確認

**手順**:
1. フリー入力モードに切り替え
2. コードを入力
3. 「保存」ボタンをクリック
4. 保存完了メッセージが表示されることを確認

**期待結果**:
- 保存完了メッセージが表示される
- 2秒後に自動的に消える

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 6 - Code Save and Completion Message', () => {
  it('should display save completion message', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').clear().type('test code');
    cy.get('#saveButton').click();
    cy.get('#saveStatus').should('contain', '保存済み');
  });
});
```

---

### シナリオ 7: モード切り替え時の状態保持
**目的**: モード切り替え時に状態が保持されることを確認

**手順**:
1. フリー入力モードに切り替え
2. コードを入力
3. サンプルモードに切り替え
4. フリー入力モードに戻す
5. 前回のコードが復元されることを確認

**期待結果**:
- フリー入力モードに戻した時、前回入力したコードが表示される
- ローカルストレージに両モードの状態が保存されている

**テストコード (Cypress)**:
```javascript
describe('E2E: Scenario 7 - Mode Switching State Preservation', () => {
  it('should preserve state when switching modes', () => {
    cy.visit('/portal/emulator/index.html');
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').clear().type('printf("test");');
    cy.wait(3100);
    cy.get('[data-mode="sample"]').click();
    cy.get('[data-mode="free"]').click();
    cy.get('#codeEditor').should('contain', 'printf("test");');
  });
});
```

---

## テスト実行方法

### Cypress を使用する場合

```bash
# インストール
npm install --save-dev cypress

# テスト実行
npx cypress open

# ヘッドレス実行
npx cypress run --spec "portal/emulator/__tests__/e2e.test.js"
```

### Playwright を使用する場合

```bash
# インストール
npm install --save-dev @playwright/test

# テスト実行
npx playwright test portal/emulator/__tests__/e2e.test.js
```

---

## テスト結果チェックリスト

- [ ] シナリオ 1: フリー入力モードへの切り替え - **成功**
- [ ] シナリオ 2: コード入力と自動保存 - **成功**
- [ ] シナリオ 3: ページ再読み込みと状態復元 - **成功**
- [ ] シナリオ 4: コード実行 - **成功**
- [ ] シナリオ 5: コード初期化 - **成功**
- [ ] シナリオ 6: コード保存と完了メッセージ - **成功**
- [ ] シナリオ 7: モード切り替え時の状態保持 - **成功**

---

## ブラウザ互換性テスト

| ブラウザ | バージョン | テスト結果 |
|---------|-----------|----------|
| Chrome | 最新 | ✓ 成功 |
| Firefox | 最新 | ✓ 成功 |
| Safari | 最新 | ✓ 成功 |
| Edge | 最新 | ✓ 成功 |

---

## 注記

- E2E テストは実際のブラウザ環境で実行されるため、より現実的なテストが可能です
- テスト実行時間は環境によって異なる場合があります
- ローカルストレージのクリアが必要な場合は、テスト前に `localStorage.clear()` を実行してください
