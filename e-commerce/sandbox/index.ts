import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car1', {
		color: 'red',
		year: 1951
	});

	await client.hSet('car2', {
		color: 'red',
		year: 1952
	});

	await client.hSet('car3', {
		color: 'red',
		year: 1953
	});

	const commands = ['car1','car2','car3'].map(id => client.HGETALL(id))
	const result = await Promise.all(commands)
	console.log("result",result)
};
run();
