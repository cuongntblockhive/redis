<script lang="ts">
	import Badge from '$lib/components/badge.svelte';
	import { DateTime } from 'luxon';

	interface ItemSummary {
		id: string;
		name: string;
		endingAt: number;
		imageUrl: string;
		price: number;
		bids: number;
		views: number;
		likes: number;
	}

	export let item: ItemSummary;

	function status(item: ItemSummary) {
		const ended = DateTime.fromMillis(item.endingAt) < DateTime.now();
		const sold = item.price > 0;

		if (ended && sold) {
			return { value: 'sold', role: 'success' };
		} else if (ended) {
			return { value: 'unsold', role: 'danger' };
		} else {
			return { value: 'active', role: 'secondary' };
		}
	}
</script>

<Badge role={status(item).role}>{status(item).value}</Badge>
