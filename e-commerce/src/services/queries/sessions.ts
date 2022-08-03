import type { Session } from '$services/types';
import { genId } from '$services/utils';
import { client } from "$services/redis/client";
import { sessionKey } from "$services/keys"
export const getSession = async (id: string) => {
	const o = await client.HGETALL((id))
	if (Object.keys(o).length == 0) {
		return null
	}
	return deserialize(id, o)
};

export const saveSession = async (session: Session) => {
	return await client.HSET(sessionKey(session.id), serialize(session))
};

const serialize = (attrs: Session) => {
	return {
		userId: attrs.userId,
		username: attrs.username
	}
}

const deserialize = (id: string, attrs: { [x: string]: string }) => {
	return {
		id,
		userId: attrs.userId,
		username: attrs.username
	}
}