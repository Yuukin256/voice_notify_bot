import { MyClient } from './client';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const client = new MyClient();

client.on('error', (err) => console.log(dayjs().toJSON(), err));

// ログイン
const token = process.env.DISCORD_TOKEN;
if (token) {
	client.login(token);
} else {
	console.error('.env ファイルにDiscord Botのトークンを設定してください');
}
