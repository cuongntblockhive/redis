import type { RequestHandler } from '@sveltejs/kit';
import { getItem, getSimilarItems } from '$services/queries/items';
import { incrementView } from '$services/queries/views';
import { userLikesItem } from '$services/queries/likes';
import { getBidHistory } from '$services/queries/bids';

interface Params {
	id: string;
}

export const get: RequestHandler<Params, any> = async ({ params, locals }) => {
	const item = await getItem(params.id);
	
	if (!item) {
		return {
			status: 404,
			body: {
				message: 'Item not found'
			}
		};
	}

	await incrementView(item.id, locals.session.userId);
	const userLikes = await userLikesItem(item.id, locals.session.userId);
	const history = await getBidHistory(item.id);
	console.log("history after bid", history)
	const similarItems = await getSimilarItems(item.id);
	const userHasHighBid = item.highestBidUserId === locals.session.userId;
	return {
		body: { item, userLikes, userHasHighBid, history, similarItems }
	};
};
