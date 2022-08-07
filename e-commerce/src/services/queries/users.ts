import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usernamesKey, usernameUniqueKey, usersKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	const decId = await client.zScore(usernamesKey(), username)
	if(!decId) {
		throw new Error('Not found id')
	}
	const hexId = decId.toString(16)
	return await getUserById(hexId)

};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	const score = await client.zScore(usernamesKey(), attrs.username)
	if (score) {
		throw new Error('Username is taken')
	}

	await client.hSet(usersKey(id), serialize(attrs));
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	})
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
