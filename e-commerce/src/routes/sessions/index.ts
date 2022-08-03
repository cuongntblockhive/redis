import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (event) => {
	console.log("event.locals.session",event.locals.session)
	return {
		status: 200,
		body: event.locals.session as any
	};
};
