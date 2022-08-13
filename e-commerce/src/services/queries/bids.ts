import { bidHistoryKey, itemsByPricesKey, itemsKey } from "$services/keys";
import { client, withLock } from "$services/redis";
import type { CreateBidAttrs, Item } from "$services/types";
import { DateTime } from "luxon";
import { getItem } from "./items";

export const createBid = async (attrs: CreateBidAttrs) => {
	return withLock(attrs.itemId, async () => {

		// Check item exist
		const item = await getItem(attrs.itemId)
		if (!item) {
			throw new Error("Item doesn't exist")
		}

		// Check bid is highest amount
		if (attrs.amount <= item.price) {
			throw new Error("Bid must higher")
		}

		// Check item expiry
		if (DateTime.fromMillis(item.endingAt).diff(DateTime.now()).toMillis() < 0) {
			throw new Error("Item closed")
		}
		const history = serialize(attrs.createdAt, attrs.amount)
		return Promise.all([
			client.rPush(bidHistoryKey(attrs.itemId), history),
			client.hSet(itemsKey(attrs.itemId), {
				price: attrs.amount,
				bids: item.bids + 1,
				highestBidUserId: attrs.userId
			}),
			client.zAdd(itemsByPricesKey(), {
				value: item.id,
				score: attrs.amount
			})
		])
	})
	return client.executeIsolated(async (isolatedClient) => {
		await isolatedClient.watch(itemsKey(attrs.itemId))
		await isolatedClient.watch(bidHistoryKey(attrs.itemId))
		// Check item exist
		const item = await getItem(attrs.itemId)
		if (!item) {
			throw new Error("Item doesn't exist")
		}

		// Check bid is highest amount
		if (attrs.amount <= item.price) {
			throw new Error("Bid must higher")
		}

		// Check item expiry
		if (DateTime.fromMillis(item.endingAt).diff(DateTime.now()).toMillis() < 0) {
			throw new Error("Item closed")
		}
		const history = serialize(attrs.createdAt, attrs.amount)
		return isolatedClient.multi()
			.rPush(bidHistoryKey(attrs.itemId), history)
			.hSet(itemsKey(attrs.itemId), {
				price: attrs.amount,
				bids: item.bids + 1,
				highestBidUserId: attrs.userId
			}).zAdd(itemsByPricesKey(), {
				value: item.id,
				score: attrs.amount
			})
			.exec();
	})
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10) => {
	const historiesRes = await client.lRange(bidHistoryKey(itemId), -offset - count, -offset - 1)
	const histories = historiesRes.map(history => deserialize(history))
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