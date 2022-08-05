import { client } from "$services/redis"
import { itemsKey, userLikesKey } from "$services/keys";
import { getItems } from "./items";
export const userLikesItem = async (itemId: string, userId: string) => {
	const exist = await client.sIsMember(userLikesKey(userId), itemId);
	return exist;
};

export const likedItems = async (userId: string) => { 
	const itemIds = await client.sMembers(userLikesKey(userId))
	const items = await getItems(itemIds)
	return items;
};

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(userLikesKey(userId), itemId);
	if (inserted) {
		await client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(userLikesKey(userId), itemId);
	if (removed) {
		await client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const itemIds = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)])
	const items = await getItems(itemIds)
	return items;
 };
