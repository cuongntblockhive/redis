import { itemsByPricesKey, itemsByViewsKey, itemsKey } from "$services/keys";
import { client } from "$services/redis";
import { deserialize } from "./deserialize";

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const fields = ['name', 'views', 'imageUrl', 'description', 'endingAt', 'price']
    let results = await client.sort(itemsByPricesKey(), {
        GET: [
            '#',
            ...fields.map(field => `${itemsKey('*')}->${field}`)
        ],
        BY: 'score',
        DIRECTION: order,
        LIMIT: {
            offset,
            count
        }
    })
    if (typeof results == 'number') return;
    const items = []

    while (results.length) {
        const itemValue = results.splice(0, fields.length + 1)
        const itemObj = {}
        fields.forEach((field, index) => itemObj[field] = itemValue[index + 1])
        items.push(deserialize(itemValue[0], itemObj))
    }
    return items
};
