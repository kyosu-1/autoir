# 要件整理

1. システム全体の役割とアーキテクチャ

1-1. システムの目的
	1.	アラート管理
	•	SIEM/EDR/Firewallなど様々なソースからのアラートを一元管理。
	•	自動で取得したアラートや、人が手動で発見した不審事象を「インシデント」として扱い、対応漏れを防止する。
	2.	インシデント管理
	•	検知～対応～復旧～事後分析(ポストモーテム)までのライフサイクルを管理。
	•	チーム全体でインシデント状況を把握し、対応タスクや経緯を見える化する。
	3.	LLMを活用した自動分析・提案
	•	アラートや過去ナレッジをRAG (Retrieval Augmented Generation)などで検索しながら、原因仮説や対策手順を自動提案。
	•	ユーザとの対話UI（WebやSlack）を通じて、効率的かつ高度なインシデント対応をサポート。
	4.	ポストモーテム管理・ナレッジ化
	•	終了したインシデントの分析結果をストックし、次回以降の対応の参考にする。
	•	LLMによるレポート自動作成も行い、再利用しやすいナレッジベースを構築する。
	5.	Playbookによるアクション自動化（SOAR的な拡張）
	•	Block IPやホスト隔離などの対応手順を標準化・プログラマブルにし、LLM提案＋人間の承認後に自動実行できる設計を目指す。

1-2. アーキテクチャ概念図

┌─────────────────────────────┐
│          Web UI / REST API          │
│ (ユーザログイン、インシデント/アラート管理  │
└─────────┬─────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│         バックエンドサービス群(主要ロジック)    │
│  1) ユーザー管理サービス                       │
│  2) アラート管理サービス                       │
│  3) インシデント管理サービス                   │
│  4) 対応履歴・タスク管理サービス               │
│  5) ポストモーテム管理サービス                 │
│  6) LLM連携サービス (RAG, 自動提案, 対話API)     │
└─────────┬─────────────────────────────┘
          │
          │ (CRUD/検索/アクション呼び出し)
          ▼
┌─────────────────────────────────────────┐
│   DB / ナレッジベース / ベクターストア          │
│  - RDB (User, Alert, Incident, ActionLog, ...)   │
│  - Vector Store (Faiss, Milvus, etc)             │
│  - 添付ファイル / ログストレージ(S3など)          │
└─────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│   外部連携 (Slack, Teams, SIEM, EDR, Firewall,  │
│             OpenAI API, 社内LLM, SOARなど)      │
└────────────────────────────────────────────────┘

	•	Web UI: ログイン、インシデント一覧・詳細、ポストモーテム閲覧・編集、Playbook実行承認などを提供。
	•	バックエンドサービス: ユーザ管理やインシデント管理の中心的なロジックを担当。
	•	LLM連携サービス: RAG で過去事例を検索して回答生成、アクション提案(Playbook呼び出し)を担う。
	•	DB/ナレッジベース: 正規化テーブル(RDB) + ベクターストアを組み合わせて運用。
	•	外部連携: SIEM/EDRアラートを取り込むWebhook、Slack Botでのチャット起票、OpenAIなどのLLM APIとの通信など。

2. エンティティ（データモデル）設計

2-1. ユーザー管理

User(例)
	•	id / username / role / email / password_hash / created_at / updated_at
	•	ロールは (Admin / Analyst / Viewer 等)

2-2. アラート管理

Alert(例)
	•	id / source(SIEM名など) / source_alert_id / title / description / severity / status / detected_at / created_at
	•	複数アラートを一つのインシデントに関連づけられるようにすることも多い。(IncidentAlertMapping テーブルで多対多)

2-3. インシデント管理

Incident(例)
	•	id / title / description / severity / status / reported_by / source_type(alert/manual等) / detected_at / closed_at / created_at
	•	ライフサイクル: New → Triage → Contain → Recover → Closed (など)

2-4. 対応アクション履歴

ActionLog(例)
	•	id / incident_id / action_type / description / requested_by / approved_by / status / executed_at / created_at
	•	ここにLLMが提案したアクション(例えば「Block IP xxx.xxx.xxx.xxx」)を承認待ちステータスで登録し、人間が承認・実行→結果を更新する流れ。

2-5. ポストモーテム管理

PostmortemReport(例)
	•	id / incident_id / summary / root_cause / timeline / lessons_learned / created_by / created_at
	•	インシデント終了後の事後分析を保存し、再利用可能なナレッジとする。

2-6. Playbook (オプション拡張)

Playbook(例)
	•	id / name / description / definition(JSON/YAML) / created_by / created_at
	•	具体的な対処フロー(ステップ)を定義し、実行時に引数(IP、hostID等)を渡して動かす。

3. LLMエージェントの役割
	1.	アラート・インシデント分析
	•	過去事例(ポストモーテム)やベクターストア内の類似ログと照合して原因推定、対応策を提案。
	2.	類似案件の検索・紹介
	•	「このアラート/インシデントに似たパターンはないか？」と問い合わせた際、ベクター検索結果を自然言語で提示。
	3.	対話式の補助
	•	Slack / Web UI などで対話し、調査すべきログやコマンド例を案内。
	4.	自動アクション提案（承認制）
	•	例：IPブロック、ホスト隔離、アカウントロックなどをPlaybook起動するよう提案 → ActionLogに登録 → 承認後に実行。
	5.	ポストモーテムドラフト生成
	•	対応ログやタイムラインを要約し、ポストモーテムのたたき台を作成。

4. Playbookによるアクション自動化 (SOAR的)

4-1. Playbookの構造
	•	ステップ定義: “承認ステップ” → “Firewall APIでブロック” → “通知ステップ” などの流れをJSON/YAMLで宣言的に書く。
	•	パラメータ: アクションに必要な引数(IP, Host ID, etc)を受け取り、ステップ間で受け渡す。
	•	条件分岐: エラーや重大度に応じてフローを分岐。

4-2. Playbook実行基盤
	•	Playbookエンジン: 各アクションプラグイン(“firewall.block_ip”, “edr.isolate_host”など)をまとめ、指定されたステップを順に実行。
	•	PlaybookRun: 実行ログを記録し、成功/失敗をインシデント管理システムに反映。
	•	承認制: アクション実行前に必ず承認が必要なステップを設け、安全性を確保。

5. 外部連携と運用フロー

5-1. アラート基盤連携
	1.	Webhook / API受信
	•	SIEM (Splunk, Sentinel等)、EDR (CrowdStrike等) からアラートを受け取り、Alert テーブルに登録。
	•	必要に応じて自動で Incident 作成 or 人間が確認してからインシデント化。
	2.	SOARツール連携 (オプション)
	•	Playbookを別のSOARソリューション(Palo Alto XSOAR等)に委ねることも可能。
	•	IMS(インシデント管理システム)とはAPI連携でステータス同期。

5-2. SlackやTeamsでの操作
	1.	インシデント起票: “/incident create 〇〇” のようなコマンドでカスタムインシデントを手動作成。
	2.	LLM問い合わせ: “/askLLM <質問>” で原因分析や類似事例の取得。
	3.	承認通知: “LLM提案: IPブロックしますか？ [承認/却下]” のインタラクティブメッセージを受け取り、人間が承認 → Playbook実行。

5-3. ポストモーテム運用
	1.	インシデントがClosedになったタイミングで事後分析を始める。
	2.	LLMが自動ドラフトを生成 → アナリストが追記/修正 → 最終レポートをPostmortemReportに保存。
	3.	今後のインシデント発生時に類似検索し、教訓や対策を再利用する。

6. セキュリティおよび運用面の注意
	1.	認証・認可
	•	ユーザロールによる機能制限(Viewer, Analyst, Admin)や、アクション承認時の二段階承認など。
	2.	監査ログ
	•	誰がいつ承認を出したか、LLM提案をどう扱ったかをトレースできるようにする。
	3.	機密情報の扱い
	•	LLMへの入力データを最小化（マスキング/トークン化）。プライベートLLMや契約で安全を確保しているLLM APIを利用するなどの配慮が必要。
	4.	アクションのインパクト管理
	•	サービス停止や権限ロックなど重大影響のあるアクションは必ず承認フローを通す。
	5.	スケーラビリティ
	•	多数のアラートやインシデントが発生する可能性を考え、データベース構成やベクターストアの性能を検討しておく。
	6.	ロールバック
	•	誤ったアクションを実行した際のロールバック手順(例: Firewallルールを戻す)を用意すると安全。

7. 今後の実装ステップ
	1.	コアDBスキーマ・ER図・APIスキーマの確定
    - User / Alert / Incident / ActionLog / PostmortemReport / [Playbook関連]
    - 必要な外部キー、enum、インデックスなどを決定。
    - protobufでAPIスキーマを定義する。
	2.	UIプロトタイプ
    - TypeScript, Next.js, chakra-uiで実装する。
	- インシデント一覧/詳細、アラート一覧/詳細、ポストモーテムの編集、LLMチャットビューなど。
	- より良いUXを目指して、デザインを工夫する。
    - 一旦APIはmockで実装する。
	3.	基本的なAPI実装
	- protoで定義したAPIを実装する。
	- バックエンドはGoで実装する。
	4.	APIの繋ぎ込み
	- バックエンドのAPIをUIに繋ぐ。
	5.	LLM連携モジュール
	- RAG(ベクターストア)の構築 → ドキュメントを埋め込みベクトル化 → 類似検索 → ChatCompletion API呼び出し。
	- Action提案をActionLogに登録するフローを作る。
	6.	Playbookエンジン
	- YAML/JSONでの手順定義 → ステップごとのアクションプラグイン呼び出し → 成功/失敗ハンドリング → ActionLog/Incidentに結果を反映。
	- ユーザ承認ステップのUI実装 (Slack or WebUI)。
	7.	外部連携
	- Slack Botでの slashコマンド, Interactive Message
	- SIEM/EDRからのアラートWebhook受信
	- Firewall/AD/クラウドなどへの API プラグインを必要に応じて実装。
	8.	テスト・検証
	- ユースケース (IPブロック, Host隔離, アカウントロック等)ごとにシナリオテストを行い、トラブルがないか検証。
