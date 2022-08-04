import type { Session } from '$services/types';
import { client } from "$services/redis/client";
import {sessionKey} from "$services/keys"
export const getSession = async (id: string) => {
	const o = await client.HGETALL(sessionKey(id))
	if(Object.keys(o).length == 0) {
		return null
	}
	return o
};

export const saveSession = async (session: Session) => {};
