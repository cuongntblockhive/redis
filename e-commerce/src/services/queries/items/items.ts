import { itemsKey } from "$services/keys";
import { client } from "$services/redis";
import type { CreateItemAttrs, Item } from "$services/types";
import { genId } from "$services/utils";
import { deserialize } from "./deserialize";
import { serialize } from "./serialize";


export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id))
	if(Object.keys(item).length == 0) {
		return null
	}
	console.log("item",item, deserialize(id, item))
	return deserialize(id, item)
};

export const getItems = async (ids: string[]) => { };

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();
	await client.hSet(itemsKey(id), serialize(attrs));
	return id;
};
