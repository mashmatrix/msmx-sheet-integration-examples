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
$ sfdx force:org:create -f config/project-scratch-def.json -a msmx-sheet-integration -w 10
```

2. コマンドラインでMashmatrix Sheetのトライアルパッケージをインストールします

```sh
$ sfdx force:package:install --package 04tIT0000013Pp3YAE -u msmx-sheet-integration -w 10
```

3. スクラッチ組織のデフォルトのユーザに必要な権限セットを割り当てます

```sh
$ sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetUser -u msmx-sheet-integration
$ sfdx force:user:permset:assign --permsetname msmxSheet__MashmatrixSheetAdministrator -u msmx-sheet-integration
```

4. このレポジトリのソースコードをスクラッチ組織にプッシュして配布します

```sh
$ sfdx force:source:push -u msmx-sheet-integration
```

5. サンプルに含まれるコンポーネントにアクセスするための権限セットを割り当てます

```sh
$ sfdx force:user:permset:assign --permsetname Mashmatrix_Sheet_Integration_Examples -u msmx-sheet-integration
```

6. デモ用のデータを[SFDX migration automatic](https://github.com/stomita/sfdx-migration-automatic) プラグインを用いてロードします

```sh
$ sfdx plugins:install sfdx-migration-automatic
$ sfdx automig:load --inputdir data/records -u msmx-sheet-integration
$ sfdx automig:load --inputdir data/books -u msmx-sheet-integration
```

7. Mashmatrix Sheetアプリを開いてロードしたブック及びレコードにアクセスできることを確かめます

```sh
$ sfdx force:org:open -u msmx-sheet-integration -p /lightning/n/msmxSheet__MashmatrixSheet
```

8. 左サイドバー内にリストされているブックのIDをブックの設定画面から確かめて、ブックの名前とともにメモしておきます

9. 「Mashmatrix Sheet Integration Examples」アプリをアプリケーションランチャーから選択します

10. 「Map Integration」タブにフォーカスし、画面の右上のメニューから「ページを編集」を選びます

11. 「Account Search」コンポーネントを選び、「Book ID」プロパティの値をステップ8でメモしておいた「Acccount/Contact」ブックのIDの値に置き換えます。同様に「Account Map」および「Contacts in Selected Account」コンポーネントについてもブックIDを置き換えます。

12. 「Filter Control Integration」タブにフォーカスし、 画面の右上のメニューから「ページを編集」を選びます

13. 「Accommodations Result」コンポーネントを選び、「Book ID」プロパティの値をステップ8でメモしておいた「Accommodation」ブックのIDの値に置き換えます

14. 「Message Debug」タブにフォーカスし、 画面の右上のメニューから「ページを編集」を選びます

15. 左ペインにあるMashmatrix Sheetコンポーネントを選び、「Book ID」プロパティの値をステップ8でメモしておいた「Book for Event/Message Debug」ブックのIDの値に置き換えます

16. 「Custom Event」タブにフォーカスし、画面の右上のメニューから「ページを編集」を選びます

17. 左ペインにあるMashmatrix Sheetコンポーネントを選び、「Book ID」プロパティの値をステップ8でメモしておいた「Custom Event」ブックのIDの値に置き換えます

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
「Custom Event on Action Button」コンポーネントは、「Sum」ボタンをクリックした後、「calcSum」という名前のカスタムイベントを受け取り、現在選択されているレコードの「Price per Day」、「Bathrooms」、「Bedrooms」列の合計を計算します。
「Custom Event on Action Link」コンポーネントは、「Accommodation Name」がクリックされたときに、「accommodationDetail」という名前のカスタムイベントを受け取り、宿泊施設の詳細情報を表示します。