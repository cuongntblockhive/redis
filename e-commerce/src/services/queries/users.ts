import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { userKey } from "$services/keys";
import { client } from "$services/redis/client";

export const getUserByUsername = async (username: string) => { };

export const getUserById = async (id: string) => {
	const res = await client.HGETALL(userKey(id))
	return deserialize(id, res)
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId()
	await client.HSET(userKey(id), serialize(attrs))
	return id
};

const serialize = (attrs: CreateUserAttrs) => {
	return {
		username: attrs.username,
		password: attrs.password
	}
}

const deserialize = (id: string, attrs: { [x: string]: string }) => {
	return {
		id,
		...attrs
	}
}