const util = require('minecraft-server-util');
let rcon = new util.RCON('localhost', { port: 25575, password: 'dsa321' });

rcon.on('output', (message) => console.log(message));

// rcon.on('warning', (warn) => {
// 	console.warn(warn);
// });

// util.scanLAN().then(console.log).catch(console.error);
rcon.connect()
	.then(async () => {
		await rcon.run('list');
	})
	.catch((error) => {
		throw error;
	});
util.status