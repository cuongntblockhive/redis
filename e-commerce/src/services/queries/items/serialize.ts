import type { CreateItemAttrs } from '$services/types';
import { DateTime } from 'luxon';

export const serialize = (attrs: CreateItemAttrs) => {
    return {
        ...attrs,
        createdAt: DateTime.now().toMillis(),
        endingAt: DateTime.now().toMillis(),
    }
};
