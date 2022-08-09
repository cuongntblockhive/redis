import { bidHistoryKey } from "$services/keys";
import { client } from "$services/redis";
import type { CreateBidAttrs } from "$services/types";

export const createBid = async (attrs: CreateBidAttrs) => {
	const history = serialize(attrs.createdAt, attrs.amount)
	return client.rPush(bidHistoryKey(attrs.itemId), history)
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10) => {
	const historiesRes = await client.lRange(bidHistoryKey(itemId), -offset - count, -offset - 1)
	const histories = historiesRes.map(history => deserialize(history))
	console.log("history", histories)
	return histories;
};


const serialize = (createdAt: number, amount: number) => `${createdAt}:${amount}`

const deserialize = (value: string) => {
	const [createdAt, amount] = value.split(':')
	return {
		createdAt: parseInt(createdAt),
		amount: parseFloat(amount)
	}
}