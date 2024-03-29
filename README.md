# VoiceNotifyBot

__ARCHIVED__
同等の機能を持つ新しい Bot を製作しました。 [Yuukin256/voice-notify-bot](https://github.com/Yuukin256/voice-notify-bot)

Discord で通話が始まったときにお知らせする Bot。

# Features

Discord でボイスチャンネルの通話が始まったとき、設定したテキストチャンネルで通知を行います。
通知を行うかどうかや、通知メッセージで誰をメンションするかは、ボイスチャンネルごとに設定可能です。

# Usage and Commands

`))` はコマンドプレフィックスです。

-   `))channel <テキストチャンネルの名前/ID/メンション>` で通知メッセージを送信するテキストチャンネルを設定します。短縮: `ch`
-   `))set <ボイスチャンネルの名前/ID> <ユーザー名/ロール名/ユーザーID/ロールID/メンション>` で、指定したボイスチャンネルで通話が始まったときに通知を行います。ロール、ユーザーを指定した場合は、それらにメンションを行います。複数指定可能。指定しなかった場合はメンションを行わずに通知します。短縮: `s`
-   `))get <ボイスチャンネルの名前/ID>` で、指定したボイスチャンネルで通話が始まったときの通知設定を確認します。指定しなかった場合、サーバー内のボイスチャンネルのうち通知設定があるものをすべて表示します。短縮: `g`
-   `))remove <ボイスチャンネルの名前/ID>` で、指定したボイスチャンネルの通知設定を削除できます。複数指定可能。短縮: `r`
-   `))prefix <新しいプレフィックス>` で、この Bot のコマンドを実行するためのプレフィックスを変更できます。
-   `))ping` で、Bot の ping 値を確認できます。
-   `))nickname <新しいニックネーム>` で、この Bot のそのサーバー上でのニックネームを変更できます。

# Development / Self hosting

## Requirement

-   Node.js 14+
-   Npm / Yarn

## Installation

```bash
# yarn
yarn

# npm
npm install
```

## Hosting

`.env` ファイルに Discord bot のトークンを記入して以下のコマンドを実行することで Bot を起動できます。

```bash
# yarn
yarn build
yarn start

# npm
npm run build
npm start
```
