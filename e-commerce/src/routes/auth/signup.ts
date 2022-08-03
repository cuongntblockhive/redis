import type { RequestHandler } from '@sveltejs/kit';
import { signup } from '$services/auth/auth';

export const post: RequestHandler = async ({ request, locals }) => {
	const { username, password } = await request.json();
	console.log(username, password)
	const userId = await signup(username, password);
	console.log(userId)
	locals.session.userId = userId;
	locals.session.username = username;
	console.log(locals.session)
	return {
		status: 200
	};
};
