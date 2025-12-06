# 権限管理システム設計提案

## 📋 4つの権限区分

### 1. 未ログインユーザー（Guest）
**できること：**
- ✅ 診断クイズの閲覧・プレイ（無制限）
- ✅ 人気ランキングの閲覧
- ✅ 静的ページの閲覧（使い方、活用法など）

**できないこと：**
- ❌ 診断クイズの作成
- ❌ マイページへのアクセス
- ❌ 作成した診断の編集・削除
- ❌ アクセス解析の閲覧

### 2. 無料会員（Free Member）
**できること：**
- ✅ 診断クイズの作成：**月3個まで**
- ✅ 作成した診断の編集・削除
- ✅ 基本的なアクセス解析（閲覧数、完了数）
- ✅ AI自動生成：**月5回まで**
- ✅ テンプレート使用：すべて利用可
- ✅ デザインテーマ：5種類すべて
- ✅ レイアウト：カード・チャット両方
- ✅ リード獲得機能

**制限事項：**
- ⚠️ 作成可能数：**月3個まで**（超過した場合は有料プランへの案内）
- ⚠️ AI生成：**月5回まで**
- ⚠️ 1診断あたりの質問数：**最大5問**
- ⚠️ 結果パターン：**最大3パターン**
- ❌ HTMLダウンロード：不可
- ❌ 埋め込みコード：不可
- ❌ CSV出力：不可
- ❌ 広告非表示：不可

### 3. 有料会員（Premium Member）- 月額980円（推奨）
**できること：**
- ✅ 診断クイズの作成：**無制限**
- ✅ AI自動生成：**月30回まで**
- ✅ 質問数：**最大10問**
- ✅ 結果パターン：**最大10パターン**
- ✅ 詳細なアクセス解析（CTR、コンバージョン率など）
- ✅ HTMLダウンロード：**個別寄付不要**
- ✅ 埋め込みコード発行：**個別寄付不要**
- ✅ CSV出力：**個別寄付不要**
- ✅ 広告非表示（診断結果画面の広告を非表示）
- ✅ 優先サポート
- ✅ 新機能の先行アクセス

**制限事項：**
- ⚠️ AI生成：月30回まで（コスト管理のため）
- ❌ 他ユーザーの診断の編集・削除：不可

### 4. 管理者（Admin）
**できること：**
- ✅ すべての機能へのフルアクセス
- ✅ すべてのユーザーの診断を閲覧・編集・削除
- ✅ AI生成：無制限
- ✅ ユーザー管理（将来的に実装する場合）
- ✅ 統計ダッシュボード（全体の利用状況）
- ✅ 規約違反コンテンツの削除

---

## 🏗️ 実装方法

### データベース設計

#### 1. `users` テーブルに追加するカラム
```sql
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS
  user_role TEXT DEFAULT 'free', -- 'free', 'premium', 'admin'
  subscription_id TEXT, -- Stripe Subscription ID
  subscription_status TEXT, -- 'active', 'canceled', 'past_due'
  subscription_expires_at TIMESTAMP,
  quiz_count_this_month INTEGER DEFAULT 0,
  ai_generation_count_this_month INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE;
```

#### 2. `user_limits` テーブル（新規作成）
```sql
CREATE TABLE user_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_created_this_month INTEGER DEFAULT 0,
  ai_used_this_month INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### フロントエンド実装

#### 1. 権限チェック用のUtility関数
```javascript
// lib/permissions.js
export const USER_ROLES = {
  GUEST: 'guest',
  FREE: 'free',
  PREMIUM: 'premium',
  ADMIN: 'admin'
};

export const LIMITS = {
  free: {
    quizPerMonth: 3,
    aiGenerationPerMonth: 5,
    maxQuestions: 5,
    maxResults: 3,
    canDownloadHTML: false,
    canEmbed: false,
    canExportCSV: false
  },
  premium: {
    quizPerMonth: Infinity,
    aiGenerationPerMonth: 30,
    maxQuestions: 10,
    maxResults: 10,
    canDownloadHTML: true,
    canEmbed: true,
    canExportCSV: true
  },
  admin: {
    quizPerMonth: Infinity,
    aiGenerationPerMonth: Infinity,
    maxQuestions: 10,
    maxResults: 10,
    canDownloadHTML: true,
    canEmbed: true,
    canExportCSV: true
  }
};

export const canCreateQuiz = (user, currentCount) => {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'premium') return true;
  return currentCount < LIMITS.free.quizPerMonth;
};

export const canUseAIGeneration = (user, currentCount) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const limit = LIMITS[user.role]?.aiGenerationPerMonth || 0;
  return currentCount < limit;
};

export const getQuizLimits = (userRole) => {
  return LIMITS[userRole] || LIMITS.free;
};
```

#### 2. エディタ画面での制限表示
```javascript
// components/Editor.jsx に追加
const userLimits = getQuizLimits(user?.role || 'free');
const canCreate = canCreateQuiz(user, currentMonthQuizCount);

// UI表示例
{!canCreate && (
  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
    <p className="text-yellow-800 font-bold">
      今月の作成上限（{LIMITS.free.quizPerMonth}個）に達しました
    </p>
    <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg">
      プレミアムプランで無制限作成
    </button>
  </div>
)}
```

#### 3. Stripe連携（有料プラン）
```javascript
// 月額サブスクリプション設定
const STRIPE_PRICES = {
  premium: 'price_xxxxxxxxxxxxx' // Stripeで作成した価格ID
};

// サブスクリプション作成処理
const handleSubscribe = async () => {
  const response = await fetch('/api/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: STRIPE_PRICES.premium,
      userId: user.id
    })
  });
  const { sessionId } = await response.json();
  // Stripeチェックアウトへリダイレクト
};
```

---

## 💰 マネタイゼーション戦略

### 推奨プラン構成

| 項目 | 無料プラン | プレミアムプラン |
|------|------------|------------------|
| **月額料金** | 0円 | **980円** |
| **作成数** | 月3個 | 無制限 |
| **AI生成** | 月5回 | 月30回 |
| **質問数** | 最大5問 | 最大10問 |
| **結果パターン** | 最大3パターン | 最大10パターン |
| **HTML DL** | 個別500円〜 | 無料 |
| **埋め込み** | 個別500円〜 | 無料 |
| **CSV出力** | 個別500円〜 | 無料 |
| **広告** | あり | なし |

### なぜこの制限が効果的か

1. **月3個制限（無料）**
   - お試しで十分使える
   - 本格的に使いたいユーザーは有料化
   - 「ちょっと足りない」感がアップセルを促進

2. **質問数・結果パターン制限**
   - 簡易的な診断は無料で作れる
   - 本格的な診断には有料プランが必要
   - 明確な差別化ポイント

3. **AI生成回数制限**
   - OpenAI APIのコスト管理
   - 無料ユーザーでも十分試せる
   - プレミアムは余裕を持った上限

4. **個別寄付 vs 月額**
   - 無料ユーザー：必要に応じて個別機能を解放（500円〜）
   - ヘビーユーザー：月額980円で全機能使い放題がお得

---

## 🚀 実装の優先順位

### フェーズ1: 基本的な制限（すぐ実装可能）
1. ✅ 作成数カウント（Supabaseで管理）
2. ✅ 未ログインユーザーの作成制限
3. ✅ UI上での制限表示

### フェーズ2: 有料プラン（Stripe連携）
1. Stripeサブスクリプション設定
2. 決済フロー実装
3. サブスクリプション管理画面

### フェーズ3: 高度な機能
1. AI生成回数の制限
2. 質問数・結果パターンの制限
3. 広告表示/非表示の切り替え

---

## 📊 想定される収益モデル

### シナリオ1: 控えめな成長
- 無料ユーザー: 1000人
- 有料転換率: 3%
- 有料ユーザー: 30人
- **月間収益: 29,400円**

### シナリオ2: 順調な成長
- 無料ユーザー: 5000人
- 有料転換率: 5%
- 有料ユーザー: 250人
- **月間収益: 245,000円**

### シナリオ3: 成功パターン
- 無料ユーザー: 20,000人
- 有料転換率: 7%
- 有料ユーザー: 1,400人
- **月間収益: 1,372,000円**

---

## ❓ よくある質問

**Q: 既存ユーザーはどうなる？**
A: 既存ユーザーは全員「無料プラン」として扱い、グランドファザリングなし。ただし、移行期間（1ヶ月）は制限なしで使える猶予期間を設ける。

**Q: 個別寄付機能はどうなる？**
A: そのまま残す。無料ユーザーが必要に応じて個別機能を解放できる選択肢として。

**Q: 管理者は何人まで？**
A: データベースで`is_admin`フラグで管理。基本は1〜2名。

**Q: 年間プランは？**
A: 月額980円 × 12 = 11,760円 → **年間9,800円（約17%OFF）**で提供するのも効果的。

---

この設計で実装を進めますか？必要に応じて調整・相談も可能です！

