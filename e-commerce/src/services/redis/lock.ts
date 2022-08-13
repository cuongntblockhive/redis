import { locksKey } from '$services/keys';
import { genToken } from '$services/utils';
import { client } from './client';

export const withLock = async (key: string, cb: CallableFunction) => {
	const retryDelayMs = 100;
	let retries = 20

	const token = genToken()

	const lockKey = locksKey(key)

	while (retries >= 0) {

		retries--
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		})

		if (!acquired) {
			await pause(retryDelayMs)
			continue
		}

		try {
			const result = await cb()
			return result;
		} finally {
			// await client.del(locksKey(key))
			await client.unLock(lockKey, token)
		}
	}


};

const buildClientProxy = () => { };

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
