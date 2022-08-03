import type { CreateItemAttrs } from '$services/types';
import { serialize } from "$services/queries/items/serialize";
import { client } from "$services/redis/client";
import { itemKey } from "$services/keys";
import { genId } from '$services/utils';
export const getItem = async (id: string) => { };

export const getItems = async (ids: string[]) => { };

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    console.log("attrs",attrs)
    const id = genId()
    await client.HSET(itemKey(id), serialize(attrs))
    return id
};
