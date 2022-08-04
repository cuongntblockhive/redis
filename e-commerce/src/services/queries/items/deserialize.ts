import type { Item } from "$services/types";
import { DateTime } from "luxon";

export const deserialize = (id: string, item: { [key: string]: string }):Item => {
	return {
		id,
		name: item.name,
		ownerId: item.ownerId,
		imageUrl: item.imageUrl,
		description: item.description,
		createdAt: parseInt(item.createdAt),
		endingAt: parseInt(item.endingAt),
		views: parseInt(item.views),
		likes: parseInt(item.likes),
		price: parseFloat(item.price),
		bids: parseInt(item.bids),
		highestBidUserId: item.highestBidUserId,
	}
};
