export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (userId: string) => `users#${userId}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;

export const usernameUniqueKey = () => 'usernames:unique';
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => `usernames` // // Sorted set [username,id]

// Items
export const itemsKey = (itemId: string) => `items#${itemId}`; // Hash
export const itemsByViewsKey = () => 'items:views'; // Sorted set [itemId,views]
export const itemsByEndingAtKey = () => 'item:endingAt'; // Sorted set [itemId,endingAt]
export const itemsViewsKey = (itemId: string) => `item:views#${itemId}`; // Hyperloglog [userId]
export const itemsByPricesKey = () => 'items:price'; // Sorted set [itemId, price]
// Bids
export const bidHistoryKey = (itemId: string) => `history#${itemId}`; // List [createdAt:amount]