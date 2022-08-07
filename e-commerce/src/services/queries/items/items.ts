import { itemsByEndingAtKey, itemsByViewsKey, itemsKey } from "$services/keys";
import { client } from "$services/redis";
import type { CreateItemAttrs } from "$services/types";
import { genId } from "$services/utils";
import { deserialize } from "./deserialize";
import { serialize } from "./serialize";


export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id))
	if (Object.keys(item).length == 0) {
		return null
	}
	return deserialize(id, item)
};

export const getItems = async (ids: string[]) => {
	const result = await Promise.all(ids.map(id => client.HGETALL(itemsKey(id))))
	return result.map((item, index) => deserialize(ids[index], item));
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();
	await Promise.all([
		client.hSet(itemsKey(id), serialize(attrs)),
		client.zAdd(itemsByViewsKey(), {
			value: id,
			score: 0
		}),
		client.zAdd(itemsByEndingAtKey(), {
			value: id,
			score: attrs.endingAt.toMillis()
		})
	])
	return id;
};
