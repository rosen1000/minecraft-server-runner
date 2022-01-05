import { json, urlencoded } from 'body-parser';
import * as express from 'express';
import * as util from 'minecraft-server-util';
import { renderFile } from 'ejs';
import { join } from 'path';
const app = express();

app.set('views', join(__dirname, '../views'));
app.engine('html', renderFile);
app.set('view engine', 'html');

app.use(json());
app.use(urlencoded({ extended: true }));
app.set('Content-Security-Policy', 'default-src: *');
app.disable('x-powered-by');

app.use('*', (req, res, next) => {
	console.log(req.ip);
	next();
});

app.use('/server/:ip', async (req, res) => {
	console.log(req.params['ip']);
	await util.status(req.params['ip']).then((data) => {
		res.send(`<img src="${data.favicon}">`);
	});
});

app.get('/server', (req, res) => {
	res.render('server');
});

let client = new util.RCON('localhost', { password: '123' });
client.connect().catch(console.error);

app.post('/server', (req, res) => {
	// @ts-ignore
	let cmd: string = req.query.cmd;
	if (cmd.charAt(0) == '>') cmd.slice(1);
	cmd.trim();

	client.run(cmd).catch((e) => {
		res.send(e);
	});
	if (cmd == 'stop') client.close();

	client.once('output', (msg) => {
		console.log(msg);
		res.send(msg);
	});
});

app.use('/', (req, res) => {
	res.json('uwu');
});

app.use((_req, res) => {
	res.status(404).json('404');
});

app.use((e: Error, _req: express.Request, res: express.Response, _: any) => {
	console.error(e);
	res.status(500).json('500');
});

app.listen(8080, () => {
	console.log('Listening at http://localhost:8080');
});
