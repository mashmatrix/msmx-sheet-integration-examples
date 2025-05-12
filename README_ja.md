# Mashmatrix Sheet インテグレーションサンプル

- [README (English)](./README.md)

本プロジェクトは、[Mashmatrix Sheet](https://www.mashmatrix.co.jp/)とその公開APIを利用して達成できる可能性について示すものです。

以下のAPIを利用したサンプルが含まれています。

- Message Channel API (en | [ja](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/customization/developing_apps_using_message_channel_api))
- Platform Event API (en | [ja](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/customization/capturing_user_ops_using_platform_event_api))

## 事前準備

- 本レポジトリから最新のソースコードをチェックアウト
- Salesforce CLIのインストール
- スクラッチ組織が作成できるようにSalesforceのDevHub組織に接続

## セットアップ手順 

1. インテグレーションサンプルをセットアップするスクラッチ組織を作成します

```sh
$ sf org create scratch -f config/project-scratch-def.json -a msmx-sheet-integration -c -w 10
```

2. コマンドラインでMashmatrix Sheetのトライアルパッケージをインストールします

```sh
$ sf package install --package 04tIT0000013T56YAE -o msmx-sheet-integration -w 10
```

3. コマンドラインから Dynamic Interaction Component Example をインストールする。

```sh
$ sf package install --package 04tdL0000009JD7QAM -o msmx-sheet-integration -w 10
```

4. スクラッチ組織のデフォルトのユーザに必要な権限セットを割り当てます

```sh
$ sf org assign permset --name msmxSheet__MashmatrixSheetUser --name msmxSheet__MashmatrixSheetAdministrator -o msmx-sheet-integration
```

5. このレポジトリのソースコードをスクラッチ組織にデプロイします。

```sh
$ sf project deploy start -d force-app/main -o msmx-sheet-integration
```

6. サンプルに含まれるコンポーネントにアクセスするための権限セットを割り当てます

```sh
$ sf org assign permset --name Mashmatrix_Sheet_Integration_Examples -o msmx-sheet-integration
```

7. デモ用のデータを[SFDX migration automatic](https://github.com/stomita/sfdx-migration-automatic) プラグインを用いてロードします

```sh
$ sfdx plugins:install sfdx-migration-automatic
$ sfdx automig:load --inputdir data/records -u msmx-sheet-integration
$ sfdx automig:load --inputdir data/books -u msmx-sheet-integration
```

8. Mashmatrix Sheetアプリを開いてロードしたブック及びレコードにアクセスできることを確かめます

```sh
$ sf org open -o msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet
```

9. 左サイドバー内にリストされているブックのIDをブックの設定画面から確かめて、ブックの名前とともにメモしておきます

10. 「Mashmatrix Sheet Integration Examples」アプリをアプリケーションランチャーから選択します

11. 「Map Integration」タブにフォーカスし、画面の右上のメニューから「ページを編集」を選びます

12. 「Account Search」コンポーネントを選び、「Book ID」プロパティの値をステップ9でメモしておいた「Acccount/Contact」ブックのIDの値に置き換えます。同様に「Account Map」および「Contacts in Selected Account」コンポーネントについてもブックIDを置き換えます。

13. 「Dynamic Interaction」タブにフォーカスし、画面の右上のメニューから「ページを編集」を選びます

14. 左側のペインで最初と2番目の「Mashmatrix Sheet」コンポーネントを選択し、手順9でコピーした「Dynamic Interaction」ブックのBook IDの値に置き換える。

15. 「Filter Control Integration」タブにフォーカスし、 画面の右上のメニューから「ページを編集」を選びます

16. 「Accommodations Result」コンポーネントを選び、「Book ID」プロパティの値をステップ9でメモしておいた「Accommodation」ブックのIDの値に置き換えます

17. 「Message Debug」タブにフォーカスし、 画面の右上のメニューから「ページを編集」を選びます

18. 左ペインにあるMashmatrix Sheetコンポーネントを選び、「Book ID」プロパティの値をステップ9でメモしておいた「Book for Event/Message Debug」ブックのIDの値に置き換えます

19. 「Custom Event」タブにフォーカスし、画面の右上のメニューから「ページを編集」を選びます

20. 左ペインにあるMashmatrix Sheetコンポーネントを選び、「Book ID」プロパティの値をステップ9でメモしておいた「Custom Event」ブックのIDの値に置き換えます

## サンプルの解説

### Map Integration

<img width="2051" alt="map-integration-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/96a7f1f6-f69c-49f6-b39a-e1cd3e684766">

「Map Integeration」タブには、２つのMashmatrix Sheetコンポーネントとカスタムの地図コンポーネントがページ内に配置されています。
左ペインに配置されている「Account Search」コンポーネントは組織内の取引先レコードを対象とし、都道府県や取引先種別でフィルタして検索します。
地図コンポーネントは `loadComplete` メッセージを検索結果とともに受け取り、地図上にプロットします。
ユーザが地図上にプロットされたエントリをクリックすると、`setParameters` メッセージをその取引先のIDとともに発行します。
ページ右下の「Contacts in Selected Account」コンポーネントは、accountIdパラメータをフィルタの値として参照しているため、
選択された取引先に所属しているすべての取引先責任者をリストします。

### Filter Condition Integration

<img width="2055" alt="filter-control-integration-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/03a43eb9-b823-405f-83ee-5bfccc3077a2">

「Filter Condition Integration」タブのページ内には２つのコンポーネントがあります。
1つはカスタムの制御用コンポーネントで、ユーザによる入力に応じて `setParameters` メッセージを発行します。
もう1つは組織内の宿泊先施設データを一覧するMashmatrix Sheetコンポーネントで、パラメータ値をフィルタで参照しています。
制御コンポーネントの入力を変化させることで、Sheetコンポーネントは自動的に入力された条件に合うレコードをリストアップして更新します。

フィルタの中でパラメータの値を参照するには、ユーザガイド内の「[参照値](https://docs.mashmatrix.com/mashmatrix-sheet/v/ja/functions_about_displaying_data/reference_value)」をチェックしてください。

### Message Debug

<img width="2055" alt="message-debug-screen" src="https://github.com/mashmatrix/msmx-sheet-integration-examples/assets/23387/b06a2dc3-78b7-4026-b590-fa70c93e4e34">

「Message Debug」タブ内には、１つのSheetコンポーネントと２つのカスタムコンポーネントがあります。
「Debug Messages」コンポーネントは、メッセージチャネルに対して発行されたすべてのメッセージ、およびすべての発行されたプラットフォームイベントをリアルタイムでリストします。
「Publish Messages」コンポーネントでは、送信したいメッセージをJSONでテキストエリアに指定することで、生のメッセージを指定したメッセージチャネルに対して発行することができます。

### Custom Event

<img width="2055" alt="message-debug-screen" src="https://github.com/user-attachments/assets/56c60aa2-8aad-4d31-bb73-a3b99dfc361d">

「Custom Event」タブでは、1つのシートコンポーネントと2つのカスタムコンポーネントが表示されます。
「Custom Event on Action Button」コンポーネントは、「sum」ボタンがクリックされたときに、「calcSum」という名前のカスタムイベントを受け取り、現在選択されているレコードの「Price per Day」、「Bathrooms」、「Bedrooms」列の合計を計算します。
「Custom Event on Action Link」コンポーネントは、「Accommodation Name」がクリックされたときに、「accommodationDetail」という名前のカスタムイベントを受け取り、宿泊施設の詳細情報を表示します。

### Dynamic Interaction

<img width="2055" alt="dynamic-interaction-screen" src="https://github.com/user-attachments/assets/3aa8dc84-5f63-413f-8180-8aa070313e92">

「Dynamic Interaction」タブには、3つのMashmatrix Sheetコンポーネントと1つのカスタムチャートコンポーネントがページ上に配置されています。

「Account Chart」コンポーネントは、最初のシートでレコードがフォーカスまたは選択されたときに、Accountごとにグループ化されたOpportunityの合計金額を表示します。
チャート内のバーをクリックすると、accountId、startDate、endDate、year というプロパティを含むDynamic Interactionイベントが発行されます。
このDynamic Interactionイベントは、第2のシートの parameters プロパティに accountId={!Event.accountId}&startDate={!Event.startDate}&endDate={!Event.endDate} という値を設定します。
第2のシートでは、フィルターが closeDate と accountId 列に設定されているため、選択された accountId および startDate、endDate に基づいて自動的に更新されます。
同様に、第3のシートには year={!Event.year} の値で parameters プロパティが設定されており、こちらも year 列にフィルターが設定されているため、選択された year に応じて更新されます。
