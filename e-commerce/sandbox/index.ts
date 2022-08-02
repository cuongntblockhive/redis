import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	const res_1 = await client.HSET("car", {
		"color": "red",
		"year": 1950
	});
	console.log("res1", res_1)
	const res_2 = await client.HGETALL("car1")
	console.log("res2", JSON.stringify(res_2))
};
run();
